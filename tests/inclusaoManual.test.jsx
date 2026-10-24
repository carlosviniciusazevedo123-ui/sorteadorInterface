import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ModalAdicionarJogador } from '../src/components/ModalAdicionarJogador';
import { Sorteio } from '../src/containers/Sorteio';
import { useUltimoSorteio } from '../src/hooks/useUltimoSorteio';
import { api } from '../src/services/api';
import { obterVagaInclusao } from '../src/utils/vagaInclusao';

vi.mock('../src/services/api', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

const drawId = 'draw-123';
const timeA = { id: 'team-a', name: 'Azul', team_number: 1 };
const timeB = { id: 'team-b', name: 'Verde', team_number: 2 };
const config = {
  howManyTeams: 2,
  playersPerTeam: 2,
  hasReserve: true,
  reservePerTeam: 1,
  considerGoalkeepers: true,
};
const players = [
  { id: 'p1', name: 'Ana', overall_rating: 8, is_goalkeeper: false },
  { id: 'p2', name: 'Bia', overall_rating: 7, is_goalkeeper: false },
  { id: 'p3', name: 'Caio', overall_rating: 6, is_goalkeeper: false },
  { id: 'g1', name: 'Davi', overall_rating: 8, is_goalkeeper: true },
  { id: 'g2', name: 'Eli', overall_rating: 7, is_goalkeeper: true },
];
const originalParticipants = [
  {
    id: 'part-1',
    team_id: timeA.id,
    player_id: 'p1',
    number: 10,
    is_reserve: false,
    is_goalkeeper: false,
    player: players[0],
  },
  {
    id: 'part-2',
    team_id: timeA.id,
    player_id: 'p2',
    number: 11,
    is_reserve: false,
    is_goalkeeper: false,
    player: players[1],
  },
  {
    id: 'part-3',
    team_id: timeB.id,
    player_id: 'g1',
    number: 1,
    is_reserve: false,
    is_goalkeeper: true,
    player: players[3],
  },
];

function latest(participants = originalParticipants) {
  return {
    draw: {
      id: drawId,
      how_many_teams: config.howManyTeams,
      drawn_at: '2026-10-01T10:00:00.000Z',
      teams: [timeA, timeB],
      players_per_team: config.playersPerTeam,
      has_reserve: config.hasReserve,
      reserve_per_team: config.reservePerTeam,
      consider_goalkeepers: config.considerGoalkeepers,
    },
    participants,
    drawn_at: '2026-10-01T10:00:00.000Z',
  };
}

function modal(props = {}) {
  const onClose = vi.fn();
  const onSuccess = vi.fn();
  render(
    <ModalAdicionarJogador
      sorteio={{
        drawId,
        times: [timeA, timeB],
        participacoes: originalParticipants,
        configuracao: config,
      }}
      time={timeA}
      jogadores={players}
      onClose={onClose}
      onSuccess={onSuccess}
      {...props}
    />
  );
  return { onClose, onSuccess };
}

describe('regras de vagas da inclusão manual', () => {
  const cfg = { ...config, playersPerTeam: 2 };
  it('atribui vaga de titular antes das reservas', () => {
    expect(
      obterVagaInclusao(timeA, [originalParticipants[0]], players[2], cfg)
    ).toMatchObject({ disponivel: true, tipo: 'titular' });
  });
  it('atribui reserva quando titulares estão completos', () => {
    expect(
      obterVagaInclusao(
        timeA,
        originalParticipants.slice(0, 2),
        players[2],
        cfg
      )
    ).toMatchObject({ disponivel: true, tipo: 'reserva' });
  });
  it('bloqueia jogador de linha quando titulares e reservas estão completos', () => {
    const full = [
      ...originalParticipants.slice(0, 2),
      {
        team_id: timeA.id,
        player_id: 'x',
        is_reserve: true,
        is_goalkeeper: false,
      },
    ];
    expect(obterVagaInclusao(timeA, full, players[2], cfg)).toMatchObject({
      disponivel: false,
    });
  });
  it('permite goleiro quando habilitado e ainda não há goleiro no time', () => {
    expect(
      obterVagaInclusao(
        timeA,
        originalParticipants.slice(0, 2),
        players[3],
        cfg
      )
    ).toMatchObject({ disponivel: true, tipo: 'goleiro' });
  });
  it('bloqueia o segundo goleiro', () => {
    const roster = [
      ...originalParticipants,
      { team_id: timeA.id, player_id: 'g1', is_goalkeeper: true },
    ];
    expect(obterVagaInclusao(timeA, roster, players[4], cfg)).toMatchObject({
      disponivel: false,
    });
  });
  it('trata goleiro cadastrado como jogador de linha quando a opção está desligada', () => {
    expect(
      obterVagaInclusao(timeA, originalParticipants.slice(0, 1), players[3], {
        ...cfg,
        considerGoalkeepers: false,
      })
    ).toMatchObject({ disponivel: true, tipo: 'titular' });
  });
});

describe('modal e integração da inclusão manual', () => {
  beforeEach(() => vi.resetAllMocks());

  it('lista jogadores não distribuídos, exclui participantes, e cancelar não chama API', () => {
    const { onClose } = modal();
    expect(screen.getByRole('dialog').textContent).toContain('Azul');
    const select = screen.getByLabelText('Jogador disponível');
    expect(
      within(select).getByRole('option', { name: /Caio.*Vaga de reserva/ })
    ).toBeTruthy();
    expect(within(select).queryByRole('option', { name: /Ana/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onClose).toHaveBeenCalledOnce();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('envia draw, time e jogador corretos; bloqueia duplo envio e atualiza pelo latest', async () => {
    let persisted = originalParticipants;
    api.get.mockImplementation(async (url) => ({
      data: url === '/players' ? players : latest(persisted),
    }));
    let completePost;
    api.post.mockImplementation((url, body) => {
      expect(url).toBe(`/draws/${drawId}/players`);
      expect(body).toEqual({ team_id: timeA.id, player_id: 'p3' });
      return new Promise((resolve) => {
        completePost = () => {
          persisted = [
            ...persisted,
            {
              id: 'part-4',
              team_id: timeA.id,
              player_id: 'p3',
              number: 12,
              is_reserve: true,
              is_goalkeeper: false,
              player: players[2],
            },
          ];
          resolve({ data: { id: 'part-4' } });
        };
      });
    });
    render(
      <MemoryRouter>
        <Sorteio />
      </MemoryRouter>
    );
    await screen.findByRole('heading', { name: 'Times sorteados' });
    expect(
      screen.getAllByRole('button', { name: /Adicionar jogador ao/ })
    ).toHaveLength(2);
    fireEvent.click(
      screen.getByRole('button', { name: 'Adicionar jogador ao Azul' })
    );
    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText('Jogador disponível'), {
      target: { value: 'p3' },
    });
    const confirm = within(dialog).getByRole('button', {
      name: 'Adicionar jogador',
    });
    fireEvent.click(confirm);
    fireEvent.click(confirm);
    expect(confirm.disabled).toBe(true);
    expect(api.post).toHaveBeenCalledOnce();
    completePost();
    await screen.findByText(/Caio adicionado ao time/);
    expect(api.post).toHaveBeenCalledOnce();
    expect(api.get.mock.calls.some(([url]) => url === '/draws/latest')).toBe(
      true
    );
    const teamCard = screen
      .getAllByRole('article')
      .find((card) => card.textContent.includes('Azul'));
    expect(teamCard.textContent).toContain('Caio');
    expect(teamCard.textContent).toContain('12');
    expect(teamCard.textContent).toContain('Reserva');
    expect(api.post.mock.calls.some(([url]) => url === '/draws')).toBe(false);
  });

  it('mostra erro da API e libera o modal após falha de conexão', async () => {
    const { onSuccess } = modal();
    api.post.mockRejectedValueOnce(new Error('Network Error'));
    const select = screen.getByLabelText('Jogador disponível');
    fireEvent.change(select, { target: { value: 'p3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar jogador' }));
    expect((await screen.findByRole('alert')).textContent).toContain(
      'Network Error'
    );
    expect(
      screen.getByRole('button', { name: 'Adicionar jogador' }).disabled
    ).toBe(false);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('exibe o texto retornado pelo backend sem fechar o modal', async () => {
    modal();
    api.post.mockRejectedValueOnce({
      response: {
        status: 409,
        data: { message: 'No compatible roster spot' },
      },
    });
    fireEvent.change(screen.getByLabelText('Jogador disponível'), {
      target: { value: 'p3' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Adicionar jogador' }));
    expect((await screen.findByRole('alert')).textContent).toContain(
      'No compatible roster spot'
    );
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('reexibe participante persistido e conserva a data original ao montar novamente', async () => {
    const persisted = [
      ...originalParticipants,
      {
        id: 'part-4',
        team_id: timeA.id,
        player_id: 'p3',
        number: 12,
        is_reserve: true,
        is_goalkeeper: false,
        player: players[2],
      },
    ];
    api.get.mockImplementation(async (url) => ({
      data: url === '/players' ? players : latest(persisted),
    }));
    const { unmount } = render(
      <MemoryRouter>
        <Sorteio />
      </MemoryRouter>
    );
    await screen.findByRole('heading', { name: 'Times sorteados' });
    await screen.findByText('Caio');
    const teamCard = screen
      .getAllByRole('article')
      .find((card) => card.textContent.includes('Azul'));
    expect(teamCard.textContent).toContain('12');
    expect(teamCard.textContent).toContain('Reserva');
    unmount();
    render(
      <MemoryRouter>
        <Sorteio />
      </MemoryRouter>
    );
    await screen.findByRole('heading', { name: 'Times sorteados' });
    await screen.findByText('Caio');
    expect(
      api.get.mock.calls.filter(([url]) => url === '/draws/latest')
    ).toHaveLength(2);
    expect(latest(persisted).drawn_at).toBe('2026-10-01T10:00:00.000Z');
  });

  it('mapeia snake_case das regras de vaga e conserva drawn_at do draw latest', async () => {
    api.get.mockResolvedValue({ data: latest(originalParticipants) });
    const { result } = renderHook(() => useUltimoSorteio());
    await waitFor(() => expect(result.current.sorteio).not.toBeNull());
    expect(result.current.sorteio).toMatchObject({
      drawId,
      data: '2026-10-01T10:00:00.000Z',
      configuracao: {
        playersPerTeam: 2,
        hasReserve: true,
        reservePerTeam: 1,
        considerGoalkeepers: true,
      },
    });
    expect(result.current.sorteio.times).toHaveLength(2);
  });
});
