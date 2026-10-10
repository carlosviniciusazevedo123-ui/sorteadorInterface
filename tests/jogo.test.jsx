import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useControleJogo } from '../src/hooks/useControleJogo';
import { useEventosJogo } from '../src/hooks/useEventosJogo';
import { api } from '../src/services/api';

vi.mock('../src/services/api', () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));
beforeEach(() => vi.resetAllMocks());

const partida = {
  teams: [
    { id: 'a', players: [{ player_id: 'p', player_name: 'Ana' }] },
    { id: 'b', players: [{ player_id: 'q', player_name: 'Bia' }] },
  ],
};
const jogo = { teamA: { id: 'a' }, teamB: { id: 'b' }, status: 'in_progress' };
const eventosSalvos = [
  { id: '1', event_type: 'goal', team_id: 'a', player_id: 'p' },
  { id: '2', event_type: 'own_goal', team_id: 'b', player_id: 'q' },
];
const propsEventos = {
  matchId: 'm',
  gameId: 'g',
  jogo,
  partida,
  setPartida: vi.fn(),
  setErro: vi.fn(),
};

describe('Eventos recuperados do servidor', () => {
  it('recupera placar e nomes mesmo com storage vazio ou desatualizado', async () => {
    sessionStorage.setItem('sorteador.eventos.m.g', '[]');
    api.get.mockResolvedValue({ data: eventosSalvos });
    const { result } = renderHook(() => useEventosJogo(propsEventos));
    expect(result.current.placar).toBeNull();
    await waitFor(() => expect(result.current.carregandoEventos).toBe(false));
    expect(result.current.placar).toEqual({ a: 2, b: 0 });
    expect(result.current.eventos[0].player_name).toBe('Ana');
    expect(api.get).toHaveBeenCalledWith(
      '/matches/m/games/g/events',
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
  });

  it('permite nova tentativa após falha e não transforma falha em placar zero', async () => {
    api.get
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue({ data: eventosSalvos });
    const { result } = renderHook(() =>
      useEventosJogo({ ...propsEventos, jogo: { ...jogo, status: 'finished' } })
    );
    await waitFor(() =>
      expect(result.current.erroEventos).toContain('Não foi possível')
    );
    expect(result.current.placar).toBeNull();
    act(() => result.current.recarregarEventos());
    await waitFor(() => expect(result.current.placar).toEqual({ a: 2, b: 0 }));
    expect(result.current.erroEventos).toBe('');
  });

  it('descarta uma consulta atrasada ao trocar de jogo', async () => {
    let responder;
    api.get
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            responder = resolve;
          })
      )
      .mockResolvedValue({ data: [] });
    const { result, rerender } = renderHook((props) => useEventosJogo(props), {
      initialProps: propsEventos,
    });
    rerender({ ...propsEventos, gameId: 'novo' });
    await waitFor(() => expect(result.current.carregandoEventos).toBe(false));
    await act(async () => responder({ data: eventosSalvos }));
    expect(result.current.placar).toEqual({ a: 0, b: 0 });
  });

  it('não duplica evento visto pela consulta enquanto o POST está em andamento', async () => {
    vi.useFakeTimers();
    const novo = { id: '3', event_type: 'goal', team_id: 'a', player_id: 'p' };
    api.get
      .mockResolvedValueOnce({ data: eventosSalvos })
      .mockResolvedValue({ data: [...eventosSalvos, novo] });
    let confirmarPost;
    api.post.mockImplementation(
      () =>
        new Promise((resolve) => {
          confirmarPost = resolve;
        })
    );
    const { result } = renderHook(() => useEventosJogo(propsEventos));
    await act(async () => {});
    expect(result.current.carregandoEventos).toBe(false);
    act(() => {
      result.current.abrirModalEvento('goal', 'a');
      result.current.setJogadorEventoId('p');
    });
    let salvamento;
    act(() => {
      salvamento = result.current.handleSalvarEvento();
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    await act(async () => {
      confirmarPost({ data: novo });
      await salvamento;
    });
    expect(result.current.eventos).toHaveLength(3);
    expect(result.current.placar).toEqual({ a: 3, b: 0 });
  });
});

describe('Controle do jogo', () => {
  it('resposta periódica atrasada não desfaz a pausa nem o tempo confirmado', async () => {
    vi.useFakeTimers();
    let responderConsulta;
    let leituras = 0;
    api.get.mockImplementation((url) => {
      if (url === '/matches/m') return Promise.resolve({ data: partida });
      leituras += 1;
      if (leituras === 2)
        return new Promise((resolve) => {
          responderConsulta = resolve;
        });
      return Promise.resolve({
        data: {
          id: 'g',
          team_a_id: 'a',
          team_b_id: 'b',
          elapsed_seconds: leituras === 1 ? 60 : 90,
          status: leituras === 1 ? 'in_progress' : 'paused',
        },
      });
    });
    api.patch.mockResolvedValue({});
    const { result } = renderHook(() => useControleJogo('m', 'g'));
    await act(async () => {});
    expect(result.current.carregando).toBe(false);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(3000);
    });
    await act(async () => {
      await result.current.atualizarEstadoJogo('pause');
    });
    await act(async () => {
      responderConsulta({
        data: { status: 'in_progress', elapsed_seconds: 65 },
      });
    });
    expect(result.current.jogo.status).toBe('paused');
    expect(result.current.segundosDecorridos).toBe(90);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });
    expect(result.current.segundosDecorridos).toBe(90);
  });
});
