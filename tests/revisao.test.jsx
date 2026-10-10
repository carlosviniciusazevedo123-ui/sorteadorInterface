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
import { Historico } from '../src/containers/Historico';
import { EditarJogador } from '../src/containers/Jogadores/Cadastro/editarJogador';
import { Jogo } from '../src/containers/Jogo';
import { ModalEventoJogo } from '../src/containers/Jogo/components/ModalEventoJogo';
import { Partidas } from '../src/containers/Partidas';
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

describe('Correções de jogo e histórico', () => {
  it('substitui o modal de evento pelo resultado ao encerrar remotamente', async () => {
    vi.useFakeTimers();
    let remoto = { ...jogo, status: 'in_progress' };
    api.get.mockImplementation((url) =>
      Promise.resolve({
        data: url.endsWith('/events')
          ? []
          : url === '/matches/m'
            ? partida
            : remoto,
      })
    );
    render(
      <MemoryRouter initialEntries={['/jogo/m/g']}>
        <Routes>
          <Route path="/jogo/:matchId/:gameId" element={<Jogo />} />
        </Routes>
      </MemoryRouter>
    );
    await act(async () => {});
    fireEvent.click(screen.getByRole('button', { name: 'Gol' }));
    expect(screen.getByRole('dialog').textContent).toContain('Registrar gol');
    remoto = { ...jogo, status: 'finished', winner_team_id: null };
    await act(async () => vi.advanceTimersByTimeAsync(3000));
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).toContain('Resultado do jogo');
    within(dialog).getByRole('button', { name: 'Fechar resultado' }).focus();
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.click(
      within(dialog).getByRole('button', { name: 'Fechar resultado' })
    );
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('encerra um empate sem exigir a seleção de vencedor', async () => {
    let remoto = { ...jogo, status: 'in_progress' };
    api.get.mockImplementation((url) =>
      Promise.resolve({
        data: url.endsWith('/events')
          ? []
          : url === '/matches/m'
            ? partida
            : remoto,
      })
    );
    api.patch.mockImplementation(async () => {
      remoto = { ...jogo, status: 'finished', winner_team_id: null };
      return {};
    });
    render(
      <MemoryRouter initialEntries={['/jogo/m/g']}>
        <Routes>
          <Route path="/jogo/:matchId/:gameId" element={<Jogo />} />
        </Routes>
      </MemoryRouter>
    );
    fireEvent.click(
      await screen.findByRole('button', { name: 'Encerrar jogo' })
    );
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Empate')).not.toBeNull();
    expect(api.patch).toHaveBeenCalledWith('/matches/m/games/g/finish', {});
  });

  it.each([
    ['pending', 'Abrir jogo'],
    ['paused', 'Retomar jogo'],
    ['in_progress', 'Retomar jogo'],
    ['finished', 'Ver resultado'],
  ])('reabre um jogo %s pelo histórico', async (status, label) => {
    api.get.mockResolvedValue({
      data: [
        { id: 'm', teams: partida.teams, games: [{ ...jogo, status }], status },
      ],
    });
    render(
      <MemoryRouter initialEntries={['/historico']}>
        <Routes>
          <Route path="/historico" element={<Historico />} />
          <Route path="/jogo/:matchId/:gameId" element={<p>Jogo reaberto</p>} />
        </Routes>
      </MemoryRouter>
    );
    const link = await screen.findByRole('link', { name: label });
    expect(link.getAttribute('href')).toBe('/jogo/m/g');
    fireEvent.click(link);
    expect(screen.getByText('Jogo reaberto')).not.toBeNull();
  });

  it('oferece acesso às partidas existentes mesmo sem sorteio nesta sessão', () => {
    render(
      <MemoryRouter>
        <Partidas />
      </MemoryRouter>
    );
    expect(
      screen
        .getByRole('link', { name: 'Ver partidas e resultados' })
        .getAttribute('href')
    ).toBe('/historico');
  });

  it.each(['goal', 'assist', 'card'])(
    'filtra reservas no seletor de %s sem bloquear cartões',
    (tipo) => {
      render(
        <ModalEventoJogo
          tipo={tipo}
          jogo={{ ...jogo, teamA: { id: 'a' }, teamB: { id: 'b' } }}
          timeId="a"
          jogadoresDoTime={() => [
            {
              id: '1',
              player_id: 'p',
              player_name: 'Titular',
              is_reserve: false,
            },
            {
              id: '2',
              player_id: 'q',
              player_name: 'Reserva',
              is_reserve: true,
            },
          ]}
          onFechar={vi.fn()}
        />
      );
      expect(screen.getByRole('option', { name: 'Titular' })).not.toBeNull();
      expect(Boolean(screen.queryByRole('option', { name: 'Reserva' }))).toBe(
        tipo === 'card'
      );
    }
  );
});

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
