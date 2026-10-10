import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Avaliacao } from '../src/containers/Avaliacao';
import { EditarJogador } from '../src/containers/Jogadores/Cadastro/editarJogador';
import { Jogo } from '../src/containers/Jogo';
import { useControleJogo } from '../src/hooks/useControleJogo';
import { api } from '../src/services/api';

vi.mock('../src/services/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn() },
}));
beforeEach(() => vi.resetAllMocks());
const partida = {
  teams: [
    {
      id: 'a',
      name: 'Time A',
      players: [{ player_id: 'p', player_name: 'Ana', is_reserve: false }],
    },
    { id: 'b', name: 'Time B', players: [] },
  ],
};
const jogo = {
  id: 'g',
  team_a_id: 'a',
  team_b_id: 'b',
  elapsed_seconds: 0,
  status: 'pending',
};

describe('Sincronização de jogo e elencos', () => {
  it.each(['pending', 'paused'])(
    'detecta início ou retomada remota em %s',
    async (status) => {
      vi.useFakeTimers();
      let remoto = { ...jogo, status };
      let elenco = partida;
      api.get.mockImplementation((url) =>
        Promise.resolve({ data: url === '/matches/m' ? elenco : remoto })
      );
      const { result } = renderHook(() => useControleJogo('m', 'g'));
      await act(async () => {});
      remoto = { ...jogo, status: 'in_progress', elapsed_seconds: 30 };
      elenco = {
        teams: [
          {
            ...partida.teams[0],
            players: [{ ...partida.teams[0].players[0], is_reserve: true }],
          },
          partida.teams[1],
        ],
      };
      await act(async () => vi.advanceTimersByTimeAsync(3000));
      expect(result.current.jogo.status).toBe('in_progress');
      expect(result.current.jogo.teamA.players[0].is_reserve).toBe(true);
      expect(result.current.segundosDecorridos).toBe(30);
    }
  );

  it('atualiza imediatamente o elenco local e descarta consulta anterior à substituição', async () => {
    vi.useFakeTimers();
    let responder;
    let consultas = 0;
    api.get.mockImplementation((url) => {
      if (url === '/matches/m') return Promise.resolve({ data: partida });
      if (++consultas === 2)
        return new Promise((resolve) => {
          responder = resolve;
        });
      return Promise.resolve({ data: jogo });
    });
    const { result } = renderHook(() => useControleJogo('m', 'g'));
    await act(async () => {});
    await act(async () => vi.advanceTimersByTimeAsync(3000));
    act(() =>
      result.current.setPartida((atual) => ({
        ...atual,
        teams: [
          {
            ...atual.teams[0],
            players: [{ ...atual.teams[0].players[0], is_reserve: true }],
          },
          atual.teams[1],
        ],
      }))
    );
    expect(result.current.jogo.teamA.players[0].is_reserve).toBe(true);
    await act(async () => responder({ data: jogo }));
    expect(result.current.jogo.teamA.players[0].is_reserve).toBe(true);
  });
});

function Navegacao({ destino }) {
  const navigate = useNavigate();
  return <button onClick={() => navigate(destino)}>Trocar</button>;
}
function tela(componente, caminho, destino) {
  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <Navegacao destino={destino} />
      <Routes>
        <Route path="/editar/:id" element={componente} />
        <Route path="/avaliacao/:token" element={componente} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Troca de parâmetros', () => {
  it('esconde os campos anteriores enquanto carrega outro jogador', async () => {
    let responder;
    api.get
      .mockResolvedValueOnce({
        data: { name: 'Ana', position: 'Ala', is_goalkeeper: false },
      })
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            responder = resolve;
          })
      );
    tela(<EditarJogador />, '/editar/a', '/editar/b');
    await waitFor(() =>
      expect(screen.getByLabelText('Nome do jogador').value).toBe('Ana')
    );
    fireEvent.click(screen.getByRole('button', { name: 'Trocar' }));
    expect(screen.queryByLabelText('Nome do jogador')).toBeNull();
    expect(api.get.mock.calls[0][1].signal.aborted).toBe(true);
    await act(async () =>
      responder({ data: { name: 'Bia', position: '', is_goalkeeper: false } })
    );
    expect(screen.getByLabelText('Nome do jogador').value).toBe('Bia');
    expect(api.put).not.toHaveBeenCalled();
  });

  it('descarta jogador carregado com atraso depois de trocar a rota', async () => {
    let responder;
    api.get
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            responder = resolve;
          })
      )
      .mockResolvedValue({
        data: { name: 'Bia', position: '', is_goalkeeper: false },
      });
    tela(<EditarJogador />, '/editar/a', '/editar/b');
    fireEvent.click(screen.getByRole('button', { name: 'Trocar' }));
    await waitFor(() =>
      expect(screen.getByLabelText('Nome do jogador').value).toBe('Bia')
    );
    await act(async () => responder({ data: { name: 'Ana' } }));
    expect(screen.getByLabelText('Nome do jogador').value).toBe('Bia');
  });

  it('remove a sessão e as notas do link anterior ao trocar o token', async () => {
    api.get.mockResolvedValue({ data: {} });
    api.post.mockResolvedValue({
      data: { session_token: 'antiga', players: [{ id: 'p', name: 'Ana' }] },
    });
    tela(<Avaliacao />, '/avaliacao/a', '/avaliacao/b');
    await waitFor(() =>
      expect(screen.queryByLabelText('Seu nome')).not.toBeNull()
    );
    fireEvent.change(screen.getByLabelText('Seu nome'), {
      target: { value: 'Bia' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Ana' })).not.toBeNull()
    );
    fireEvent.click(screen.getByRole('button', { name: 'Trocar' }));
    expect(screen.queryByRole('heading', { name: 'Ana' })).toBeNull();
    await waitFor(() =>
      expect(screen.getByLabelText('Seu nome').value).toBe('')
    );
    expect(api.post).toHaveBeenCalledTimes(1);
  });
});

describe('Erros dentro do resultado', () => {
  function carregar() {
    api.get.mockImplementation((url) =>
      Promise.resolve({
        data: url.endsWith('/events')
          ? []
          : url === '/matches/m'
            ? partida
            : { ...jogo, status: 'finished' },
      })
    );
    return render(
      <MemoryRouter initialEntries={['/jogo/m/g']}>
        <Routes>
          <Route path="/jogo/:matchId/:gameId" element={<Jogo />} />
        </Routes>
      </MemoryRouter>
    );
  }
  it('exibe falha ao gerar link no próprio modal e permite tentar novamente', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    api.post
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ data: { token: 'link' } });
    carregar();
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Gerar link de avaliação' })
    );
    await waitFor(() =>
      expect(within(dialog).getByRole('alert').textContent).toContain(
        'Não foi possível gerar'
      )
    );
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Gerar link de avaliação' })
    );
    await waitFor(() =>
      expect(
        within(dialog).queryByRole('button', { name: 'Copiar link' })
      ).not.toBeNull()
    );
  });
  it('exibe falha da área de transferência no próprio modal', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('blocked')) },
    });
    api.post.mockResolvedValue({ data: { token: 'link' } });
    carregar();
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Gerar link de avaliação' })
    );
    await waitFor(() =>
      expect(
        within(dialog).queryByRole('button', { name: 'Copiar link' })
      ).not.toBeNull()
    );
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Copiar link' })
    );
    await waitFor(() =>
      expect(within(dialog).getByRole('alert').textContent).toContain(
        'Não foi possível copiar'
      )
    );
  });
});
