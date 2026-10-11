import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, expect, it, vi } from 'vitest';

import { Historico } from '../src/containers/Historico';
import { Jogadores } from '../src/containers/Jogadores';
import { Partidas } from '../src/containers/Partidas';
import { useSorteio } from '../src/hooks/useSorteio';
import { api } from '../src/services/api';
import { limparSessao, salvarSessao } from '../src/services/session';
import { obterSorteioAtual } from '../src/services/sorteioAtual';
import { jogosDoHistorico } from '../src/utils/jogosDoHistorico';
import { mensagemDoErro } from '../src/utils/mensagemDoErro';

vi.mock('../src/services/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), delete: vi.fn() },
}));

beforeEach(() => vi.resetAllMocks());
const jogadores = [
  { id: 'p1', name: 'Ana' },
  { id: 'p2', name: 'Bia' },
];
const tela = (componente) => render(<MemoryRouter>{componente}</MemoryRouter>);
const pendente = () => {
  let resolver;
  const promise = new Promise((resolve) => {
    resolver = resolve;
  });
  return { promise, resolver };
};
function iniciarSessao() {
  salvarSessao(
    `h.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.s`,
    { id: 'owner' }
  );
}
function prepararSorteio() {
  const hook = renderHook(() => useSorteio(jogadores));
  act(() => {
    hook.result.current.setJogadoresPorTime(1);
    hook.result.current.setConsiderarGoleiros(false);
    hook.result.current.alternarSelecao('p1');
    hook.result.current.alternarSelecao('p2');
  });
  return hook;
}
it('não executa a segunda etapa de um sorteio após logout', async () => {
  iniciarSessao();
  const resposta = pendente();
  api.post.mockReturnValue(resposta.promise);
  const { result } = prepararSorteio();
  let sortear;
  act(() => {
    sortear = result.current.handleSortear();
  });
  const signal = api.post.mock.calls[0][2].signal;
  act(() => limparSessao());
  expect(signal.aborted).toBe(true);
  await act(async () => {
    resposta.resolver({ data: { draw: { id: 'draw' }, teams: [] } });
    await sortear;
  });
  expect(api.post).toHaveBeenCalledTimes(1);
  expect(obterSorteioAtual()).toBeNull();
});
it('não salva um sorteio antigo quando a resposta chega após trocar de conta', async () => {
  iniciarSessao();
  const resposta = pendente();
  api.post
    .mockResolvedValueOnce({ data: { draw: { id: 'draw' }, teams: [] } })
    .mockReturnValueOnce(resposta.promise);
  const { result } = prepararSorteio();
  let sortear;
  act(() => {
    sortear = result.current.handleSortear();
  });
  await waitFor(() => expect(api.post).toHaveBeenCalledTimes(2));
  act(() => {
    limparSessao();
    iniciarSessao();
  });
  await act(async () => {
    resposta.resolver({ data: [] });
    await sortear;
  });
  expect(obterSorteioAtual()).toBeNull();
});
it('avisa sobre detalhes incompletos e recupera os jogos ao tentar novamente', async () => {
  let falhar = true;
  api.get.mockImplementation(async (url) => {
    if (url === '/matches') return { data: [{ id: 'm' }] };
    if (falhar) throw new Error('Offline');
    return {
      data: {
        id: 'm',
        teams: [],
        games: [
          { id: 'g', status: 'finished', finished_at: '2026-10-01', round: 1 },
        ],
      },
    };
  });
  tela(<Historico />);
  await screen.findByText(/O histórico está incompleto/);
  expect(screen.queryByText('Nenhuma partida por aqui ainda')).toBeNull();
  expect(screen.queryByRole('link', { name: 'Ver resultado' })).toBeNull();
  falhar = false;
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByRole('link', { name: 'Ver resultado' });
  expect(screen.queryByText(/O histórico está incompleto/)).toBeNull();
  expect(screen.getByText(/Finalizado em/)).toBeTruthy();
});
it('não usa a finalização da partida como data de um jogo sem data própria', () => {
  const lista = jogosDoHistorico([
    {
      id: 'm',
      createdAt: '2026-10-01',
      games: [{ id: 'a', created_at: '2026-10-02' }],
    },
    { id: 'm2', finished_at: '2026-10-10', createdAt: '2026-10-01' },
  ]);
  expect(lista[0]).toMatchObject({
    data: '2026-10-10',
    tipoData: 'Finalizado em',
  });
  expect(lista[1]).toMatchObject({ data: '2026-10-02', tipoData: 'Criado em' });
});
it('traduz erros conhecidos e não exibe mensagens desconhecidas em inglês', () => {
  expect(
    mensagemDoErro({ response: { data: { error: 'Game not found.' } } })
  ).toBe('Jogo não encontrado.');
  expect(
    mensagemDoErro({
      response: { data: { error: ['Game cannot be started.'] } },
    })
  ).toBe('Este jogo não pode ser iniciado.');
  expect(
    mensagemDoErro(
      { response: { data: { error: 'Internal SQL failure' } } },
      'Não foi possível carregar.'
    )
  ).toBe('Não foi possível carregar.');
});
it('bloqueia exclusões paralelas e reabilita os botões ao terminar', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  api.get.mockResolvedValue({ data: jogadores });
  const resposta = pendente();
  api.delete.mockReturnValue(resposta.promise);
  tela(<Jogadores />);
  fireEvent.click(await screen.findByRole('button', { name: 'Excluir Ana' }));
  const segundo = screen.getByRole('button', { name: 'Excluir Bia' });
  expect(segundo.disabled).toBe(true);
  fireEvent.click(segundo);
  expect(api.delete).toHaveBeenCalledTimes(1);
  await act(async () => resposta.resolver({}));
  expect(screen.getByRole('button', { name: 'Excluir Bia' }).disabled).toBe(
    false
  );
});
it('recupera os times e nomes do último sorteio sem cache local', async () => {
  api.get.mockResolvedValue({
    data: {
      draw: {
        id: 'draw',
        teams: [
          { id: 'a', name: 'Verde' },
          { id: 'b', name: 'Azul' },
        ],
      },
      participants: [
        { id: 'dp1', team_id: 'a', player_id: 'p1', player: jogadores[0] },
        { id: 'dp2', team_id: 'b', player_id: 'p2', player: jogadores[1] },
      ],
    },
  });
  tela(<Partidas />);
  await screen.findAllByRole('option', { name: 'Verde' });
  expect(screen.getByText('Ana')).toBeTruthy();
  expect(screen.getByText('Bia')).toBeTruthy();
  expect(screen.queryByText('Nenhum sorteio disponível')).toBeNull();
  expect(
    within(screen.getByRole('main')).getByRole('button', {
      name: 'Criar partida',
    })
  ).toBeTruthy();
});
