import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Jogo } from '../src/containers/Jogo';
import { api } from '../src/services/api';

vi.mock('../src/services/api', () => ({
  api: { get: vi.fn(), patch: vi.fn(), post: vi.fn() },
}));

const game = {
  id: 'game-1',
  match_id: 'match-1',
  team_a_id: 'team-a',
  team_b_id: 'team-b',
  status: 'pending',
  duration: 10,
  elapsed_seconds: 0,
};
const match = {
  id: 'match-1',
  status: 'pending',
  teams: [
    { id: 'team-a', name: 'Azul', players: [] },
    { id: 'team-b', name: 'Verde', players: [] },
  ],
  games: [game],
};

function abrirJogo(overrides = {}) {
  const currentGame = { ...game, ...overrides.game };
  const currentMatch = { ...match, ...overrides.match };
  api.get.mockImplementation((url) => {
    if (url === '/matches/match-1')
      return Promise.resolve({ data: currentMatch });
    if (url.endsWith('/events')) return Promise.resolve({ data: [] });
    return Promise.resolve({ data: currentGame });
  });
  return render(
    <MemoryRouter initialEntries={['/jogo/match-1/game-1']}>
      <Routes>
        <Route path="/jogo/:matchId/:gameId" element={<Jogo />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('edição da duração antes do início', () => {
  beforeEach(() => vi.resetAllMocks());

  it('mostra a duração atual e abre a edição inline', async () => {
    abrirJogo();
    const duration = await screen.findByLabelText('Duração do jogo');
    expect(duration.textContent).toBe('10');
    fireEvent.click(
      screen.getByRole('button', { name: 'Editar duração do jogo' })
    );
    expect(screen.getByLabelText('Duração (minutos)').value).toBe('10');
    expect(screen.getByRole('button', { name: 'Salvar duração' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Cancelar edição da duração' })
    ).toBeTruthy();
  });

  it('cancela sem enviar alteração', async () => {
    abrirJogo();
    fireEvent.click(
      await screen.findByRole('button', { name: 'Editar duração do jogo' })
    );
    fireEvent.change(screen.getByLabelText('Duração (minutos)'), {
      target: { value: '15' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Cancelar edição da duração' })
    );
    expect(screen.getByLabelText('Duração do jogo').textContent).toBe('10');
    expect(api.patch).not.toHaveBeenCalled();
  });

  it.each(['0', '-2', '1.5'])(
    'rejeita duração inválida %s sem chamar a API',
    async (value) => {
      abrirJogo();
      fireEvent.click(
        await screen.findByRole('button', { name: 'Editar duração do jogo' })
      );
      fireEvent.change(screen.getByLabelText('Duração (minutos)'), {
        target: { value },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Salvar duração' }));
      expect((await screen.findByRole('alert')).textContent).toContain(
        'inteira e positiva'
      );
      expect(api.patch).not.toHaveBeenCalled();
    }
  );

  it('persiste a duração, bloqueia envios duplicados e atualiza a interface', async () => {
    abrirJogo();
    let responder;
    api.patch.mockReturnValue(
      new Promise((resolve) => {
        responder = resolve;
      })
    );
    fireEvent.click(
      await screen.findByRole('button', { name: 'Editar duração do jogo' })
    );
    fireEvent.change(screen.getByLabelText('Duração (minutos)'), {
      target: { value: '15' },
    });
    const save = screen.getByRole('button', { name: 'Salvar duração' });
    fireEvent.click(save);
    fireEvent.click(save);
    expect(save.disabled).toBe(true);
    expect(api.patch).toHaveBeenCalledOnce();
    expect(api.patch).toHaveBeenCalledWith(
      '/matches/match-1/games/game-1/duration',
      { duration: 15 }
    );
    responder({ data: { ...game, duration: 15 } });
    await screen.findByText('Duração atualizada.');
    expect(screen.getByLabelText('Duração do jogo').textContent).toBe('15');
  });

  it('mantém a edição aberta e exibe erro quando a API rejeita a alteração', async () => {
    abrirJogo();
    api.patch.mockRejectedValueOnce({
      response: {
        data: {
          error: 'Game duration can only be changed while the game is pending.',
        },
      },
    });
    fireEvent.click(
      await screen.findByRole('button', { name: 'Editar duração do jogo' })
    );
    fireEvent.change(screen.getByLabelText('Duração (minutos)'), {
      target: { value: '15' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar duração' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.getByLabelText('Duração (minutos)')).toBeTruthy();
  });

  it.each([
    ['partida', { match: { status: 'in_progress' } }],
    ['jogo', { game: { status: 'in_progress' } }],
  ])('bloqueia edição quando o %s já começou', async (_which, overrides) => {
    abrirJogo(overrides);
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Editar duração do jogo' }).disabled
      ).toBe(true)
    );
    expect(api.patch).not.toHaveBeenCalled();
  });
});
