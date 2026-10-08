import { useMemo, useState } from 'react';

import { api } from '../services/api';
import { mensagemDoErro } from '../utils/mensagemDoErro';

export function useEventosJogo({
  matchId,
  gameId,
  jogo,
  partida,
  setPartida,
  setErro,
}) {
  const [tipoModalEvento, setTipoModalEvento] = useState('');
  const [timeEventoId, setTimeEventoId] = useState('');
  const [jogadorEventoId, setJogadorEventoId] = useState('');
  const [jogadorSaiId, setJogadorSaiId] = useState('');
  const [jogadorEntraId, setJogadorEntraId] = useState('');
  const [golContra, setGolContra] = useState(false);
  const [tipoCartao, setTipoCartao] = useState('yellow_card');
  const [salvandoEvento, setSalvandoEvento] = useState(false);
  const [eventos, setEventos] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(`sorteador.eventos.${matchId}.${gameId}`) || '[]'
      );
    } catch {
      return [];
    }
  });

  const placar = useMemo(
    () =>
      eventos.reduce(
        (total, evento) => {
          if (
            evento.event_type !== 'goal' &&
            evento.event_type !== 'own_goal'
          ) {
            return total;
          }

          const timeQueMarca =
            evento.event_type === 'own_goal'
              ? evento.team_id === jogo?.teamA?.id
                ? jogo?.teamB?.id
                : jogo?.teamA?.id
              : evento.team_id;

          if (timeQueMarca === jogo?.teamA?.id) total.a += 1;
          if (timeQueMarca === jogo?.teamB?.id) total.b += 1;
          return total;
        },
        { a: 0, b: 0 }
      ),
    [eventos, jogo?.teamA?.id, jogo?.teamB?.id]
  );

  function abrirModalEvento(tipo, teamId = jogo?.teamA?.id || '') {
    setErro('');
    setTipoModalEvento(tipo);
    setTimeEventoId(teamId);
    setJogadorEventoId('');
    setJogadorSaiId('');
    setJogadorEntraId('');
    setGolContra(false);
    setTipoCartao('yellow_card');
  }

  function jogadoresDoTime(timeId) {
    return partida?.teams?.find((time) => time.id === timeId)?.players || [];
  }

  async function postarEvento({
    playerId,
    teamId,
    eventType,
    playerOutId,
    playerInId,
  }) {
    const payload =
      eventType === 'substitution'
        ? {
            team_id: teamId,
            event_type: eventType,
            player_out_id: playerOutId,
            player_in_id: playerInId,
          }
        : { player_id: playerId, team_id: teamId, event_type: eventType };

    const { data } = await api.post(
      `/matches/${matchId}/games/${gameId}/events`,
      payload
    );
    const jogador = partida?.teams
      ?.flatMap((time) => time.players || [])
      .find((item) => item.player_id === playerId || item.id === playerId);

    return {
      ...data,
      event_type: eventType,
      player_name: jogador?.player_name || jogador?.name || 'Jogador',
    };
  }

  async function handleSalvarEvento() {
    const eventoAtual =
      tipoModalEvento === 'card' ? tipoCartao : tipoModalEvento;
    const timeRealDoJogador = golContra
      ? timeEventoId === jogo?.teamA?.id
        ? jogo?.teamB?.id
        : jogo?.teamA?.id
      : timeEventoId;

    if (tipoModalEvento === 'substitution') {
      const jogadoresDoTimeAtual = jogadoresDoTime(timeEventoId);
      const jogadorSai = jogadoresDoTimeAtual.find(
        (jogador) => jogador.player_id === jogadorSaiId
      );
      const jogadorEntra = jogadoresDoTimeAtual.find(
        (jogador) => jogador.player_id === jogadorEntraId
      );

      if (!jogadorSaiId || !jogadorEntraId || !jogadorSai || !jogadorEntra) {
        setErro('Selecione quem sai e quem entra.');
        return;
      }
      if (jogadorSai.is_reserve || !jogadorEntra.is_reserve) {
        setErro(
          'Escolha um jogador ativo para sair e uma reserva para entrar.'
        );
        return;
      }
    } else if (!jogadorEventoId) {
      setErro('Selecione um jogador para registrar o evento.');
      return;
    }

    setErro('');
    setSalvandoEvento(true);

    try {
      const novosEventos = [];
      const guardarEventosRecebidos = () => {
        if (!novosEventos.length) return;
        const eventosAtualizados = [...eventos, ...novosEventos];
        setEventos(eventosAtualizados);
        sessionStorage.setItem(
          `sorteador.eventos.${matchId}.${gameId}`,
          JSON.stringify(eventosAtualizados)
        );
      };

      if (tipoModalEvento === 'substitution') {
        novosEventos.push(
          await postarEvento({
            playerId: jogadorSaiId,
            teamId: timeEventoId,
            eventType: 'substitution',
            playerOutId: jogadorSaiId,
            playerInId: jogadorEntraId,
          })
        );
        setPartida((atual) => ({
          ...atual,
          teams: atual.teams.map((time) =>
            time.id !== timeEventoId
              ? time
              : {
                  ...time,
                  players: time.players.map((jogador) =>
                    jogador.player_id === jogadorSaiId
                      ? { ...jogador, is_reserve: true }
                      : jogador.player_id === jogadorEntraId
                        ? { ...jogador, is_reserve: false }
                        : jogador
                  ),
                }
          ),
        }));
      } else {
        novosEventos.push(
          await postarEvento({
            playerId: jogadorEventoId,
            teamId: timeRealDoJogador,
            eventType: golContra ? 'own_goal' : eventoAtual,
          })
        );
      }

      guardarEventosRecebidos();
      setTipoModalEvento('');
    } catch (error) {
      console.error('Erro ao registrar evento:', error.response?.data ?? error);
      setErro(mensagemDoErro(error, 'Não foi possível registrar o evento.'));
    } finally {
      setSalvandoEvento(false);
    }
  }

  return {
    placar,
    eventos,
    tipoModalEvento,
    setTipoModalEvento,
    timeEventoId,
    setTimeEventoId,
    jogadorEventoId,
    setJogadorEventoId,
    jogadorSaiId,
    setJogadorSaiId,
    jogadorEntraId,
    setJogadorEntraId,
    golContra,
    setGolContra,
    tipoCartao,
    setTipoCartao,
    salvandoEvento,
    abrirModalEvento,
    jogadoresDoTime,
    handleSalvarEvento,
  };
}
