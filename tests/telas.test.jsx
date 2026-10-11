import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Historico } from '../src/containers/Historico';
import { Menu } from '../src/containers/Menu';
import { Sorteio } from '../src/containers/Sorteio';
import { api } from '../src/services/api';
import { salvarSessao } from '../src/services/session';
import { salvarSorteioAtual } from '../src/services/sorteioAtual';

vi.mock('../src/services/api', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));
beforeEach(() => vi.resetAllMocks());

const jogadores = [
  { id: 'a', name: 'Ana', overall_rating: 7, is_goalkeeper: false },
  { id: 'b', name: 'Bia', overall_rating: 8, is_goalkeeper: false },
];
const times = [
  { id: 'time-a', name: 'Azul' },
  { id: 'time-b', name: 'Verde' },
];
const renderTela = (componente) =>
  render(<MemoryRouter>{componente}</MemoryRouter>);

describe('Telas completas', () => {
  it('mantém controles e seleção após erro da API e permite novo sorteio', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    api.get.mockResolvedValue({ data: jogadores });
    api.post
      .mockRejectedValueOnce({
        response: { data: { error: 'Falha temporária' } },
      })
      .mockResolvedValueOnce({ data: { draw: { id: 'draw' }, teams: times } })
      .mockResolvedValueOnce({
        data: [
          { id: 'p1', team_id: 'time-a', player_id: 'a' },
          { id: 'p2', team_id: 'time-b', player_id: 'b' },
        ],
      });
    renderTela(<Sorteio />);
    await screen.findByText('Ana');
    fireEvent.change(
      screen.getByRole('spinbutton', { name: 'Jogadores de linha por time' }),
      { target: { value: '1' } }
    );
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Considerar goleiros no sorteio' })
    );
    fireEvent.click(screen.getByRole('checkbox', { name: /Ana/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Bia/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Sortear times' }));
    await screen.findByText('Não foi possível realizar o sorteio.');
    expect(screen.getByRole('checkbox', { name: /Ana/ }).checked).toBe(true);
    expect(
      screen.getByRole('spinbutton', { name: 'Jogadores de linha por time' })
        .value
    ).toBe('1');
    fireEvent.click(screen.getByRole('button', { name: 'Sortear times' }));
    await screen.findByRole('heading', { name: 'Times sorteados' });
    expect(
      screen.queryByText('Não foi possível realizar o sorteio.')
    ).toBeNull();
    expect(api.post).toHaveBeenCalledTimes(3);
  });

  it('não chama a API quando a configuração é inválida e mantém os campos', async () => {
    api.get.mockResolvedValue({ data: jogadores });
    renderTela(<Sorteio />);
    await screen.findByText('Ana');
    fireEvent.click(screen.getByRole('checkbox', { name: /Ana/ }));
    fireEvent.change(
      screen.getByRole('spinbutton', { name: 'Jogadores de linha por time' }),
      { target: { value: '0' } }
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sortear times' }));
    await screen.findByText(
      'Informe entre 1 e 20 jogadores de linha por time.'
    );
    expect(api.post).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Sortear times' })
    ).not.toBeNull();
  });

  it('mostra último sorteio disponível no painel', async () => {
    salvarSessao(
      `header.${btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }))}.signature`,
      { id: 'owner', name: 'Pessoa' }
    );
    salvarSorteioAtual({
      drawId: 'draw',
      times: [...times, ...times],
      jogadores,
      participacoes: [{ id: '1' }, { id: '2' }],
    });
    api.get.mockImplementation(async (url) => ({
      data:
        url === '/players'
          ? []
          : url === '/draws/latest'
            ? {
                draw: { id: 'draw', teams: times },
                participants: [],
                drawn_at: '2026-10-01',
              }
            : null,
    }));
    renderTela(<Menu />);
    await waitFor(() => expect(screen.queryByText('Carregando...')).toBeNull());
    expect(screen.queryByText('2 times')).not.toBeNull();
    expect(screen.queryByText('Último sorteio realizado')).not.toBeNull();
    expect(screen.queryByText('Nenhum jogo finalizado ainda.')).not.toBeNull();
  });

  it('exibe cada jogo como uma partida independente no histórico', async () => {
    api.get.mockResolvedValue({
      data: [
        {
          id: 'partida-1',
          teams: times,
          games: [
            {
              id: 'g1',
              team_a_id: 'time-a',
              team_b_id: 'time-b',
              round: 1,
              status: 'finished',
              winner_team_id: 'time-a',
            },
          ],
        },
        {
          id: 'partida-2',
          teams: times,
          games: [
            {
              id: 'g2',
              team_a_id: 'time-a',
              team_b_id: 'time-b',
              round: 1,
              status: 'finished',
              winner_team_id: 'time-b',
            },
          ],
        },
      ],
    });
    renderTela(<Historico />);
    expect(await screen.findAllByText('Rodada 1')).toHaveLength(2);
    expect(screen.getAllByText('Vencedor:')).toHaveLength(2);
  });
});
