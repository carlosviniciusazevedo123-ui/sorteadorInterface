import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, expect, it, vi } from 'vitest';

import { Menu } from '../src/containers/Menu';
import { api } from '../src/services/api';
import { selecionarUltimoJogo } from '../src/utils/ultimoJogo';

vi.mock('../src/services/api', () => ({ api: { get: vi.fn() } }));
beforeEach(() => vi.resetAllMocks());

const jogo = (id, finished_at, status = 'finished') => ({
  id,
  finished_at,
  status,
  team_a_id: 'a',
  team_b_id: 'b',
});
const partidas = [
  {
    id: 'nova',
    createdAt: '2026-10-10',
    games: [jogo('antigo', '2026-10-01')],
  },
  {
    id: 'antiga',
    createdAt: '2026-09-01',
    teams: [
      {
        id: 'a',
        name: 'Time Verde',
        players: [{ id: 'p1', player_name: 'Ana Silva' }],
      },
      {
        id: 'b',
        name: 'Time Azul',
        players: [{ id: 'p2', player_name: 'Bruno Souza' }],
      },
    ],
    games: [jogo('primeiro', '2026-10-02')],
  },
  {
    id: 'mais-recente',
    createdAt: '2026-10-04',
    teams: [
      {
        id: 'a',
        name: 'Time Verde',
        players: [{ id: 'p1', player_name: 'Ana Silva' }],
      },
      {
        id: 'b',
        name: 'Time Azul',
        players: [{ id: 'p2', player_name: 'Bruno Souza' }],
      },
    ],
    games: [jogo('ultimo', '2026-10-03')],
  },
  {
    id: 'pendente',
    createdAt: '2026-10-05',
    games: [jogo('jogo-pendente', '2026-10-04', 'pending')],
  },
];

it('compara os jogos finalizados de partidas independentes pela data', () => {
  expect(selecionarUltimoJogo(partidas).ultimoJogo.jogo.id).toBe('ultimo');
  expect(selecionarUltimoJogo([{ games: [jogo('sem-data', null)] }])).toEqual({
    ultimoJogo: null,
    dataIndisponivel: true,
  });
});

it('recupera o placar do último jogo e abre sua rota de detalhes', async () => {
  api.get.mockImplementation(async (url) => {
    if (url === '/players') return { data: [] };
    if (url === '/draws/latest') return { data: null };
    if (url === '/matches/games/latest')
      return {
        data: {
          match: partidas[2],
          game: partidas[2].games[0],
          events: [
            { event_type: 'goal', team_id: 'a' },
            { event_type: 'own_goal', team_id: 'b' },
          ],
        },
      };
    throw new Error('Unexpected request');
  });
  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>
  );
  await screen.findByLabelText('Placar: 2 a 0');
  expect(screen.getByText('Time Verde')).toBeTruthy();
  expect(screen.getByText('Ana Silva')).toBeTruthy();
  expect(screen.getByText('Bruno Souza')).toBeTruthy();
  expect(screen.getByText('Finalizado')).toBeTruthy();
  expect(
    screen
      .getByRole('link', { name: 'Ver detalhes do jogo' })
      .getAttribute('href')
  ).toBe('/jogo/mais-recente/ultimo');
  expect(
    api.get.mock.calls.filter(([url]) => url === '/matches/games/latest')
  ).toHaveLength(1);
  expect(api.get).toHaveBeenCalledTimes(3);
});

it('não apresenta zero a zero quando a API não fornece os eventos', async () => {
  api.get.mockImplementation(async (url) => {
    if (url === '/players') return { data: [] };
    if (url === '/draws/latest') return { data: null };
    if (url === '/matches/games/latest')
      return { data: { match: partidas[2], game: partidas[2].games[0] } };
    throw new Error('Offline');
  });
  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>
  );
  await screen.findByText('Não foi possível carregar o último jogo.');
  expect(screen.queryByLabelText('Placar: 0 a 0')).toBeNull();
});

it('informa erro quando a consulta do último jogo falha', async () => {
  api.get.mockImplementation(async (url) => {
    if (url === '/players') return { data: [] };
    if (url === '/draws/latest') return { data: null };
    throw new Error('Offline');
  });
  render(
    <MemoryRouter>
      <Menu />
    </MemoryRouter>
  );
  await screen.findByText('Não foi possível carregar o último jogo.');
  expect(api.get.mock.calls.some(([url]) => url.endsWith('/events'))).toBe(
    false
  );
});
