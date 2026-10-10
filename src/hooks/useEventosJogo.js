import { useEffect, useMemo, useRef, useState } from 'react';

import { api } from '../services/api';
import { calcularPlacar } from '../utils/calcularPlacar';
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
  const chaveJogo = `${matchId}.${gameId}`;
  const [historico, setHistorico] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const revisaoEventos = useRef(0);
  const eventosCarregados =
    historico?.chave === chaveJogo ? historico.eventos : null;
  const erroEventos = historico?.chave === chaveJogo ? historico.erro : '';
  const carregandoEventos = eventosCarregados === null;

  useEffect(() => {
    const controller = new AbortController();
    let intervalo;

    async function carregarEventos() {
      const revisao = revisaoEventos.current;
      try {
        const { data } = await api.get(
          `/matches/${matchId}/games/${gameId}/events`,
          { signal: controller.signal }
        );
        if (controller.signal.aborted || revisao !== revisaoEventos.current)
          return;
        if (!Array.isArray(data))
          throw new Error('Resposta de eventos inválida.');
        setHistorico({ chave: chaveJogo, eventos: data, erro: '' });
      } catch (error) {
        if (controller.signal.aborted || revisao !== revisaoEventos.current)
          return;
        setHistorico((atual) => ({
          chave: chaveJogo,
          eventos: atual?.chave === chaveJogo ? atual.eventos : null,
          erro: mensagemDoErro(
            error,
            'Não foi possível carregar os eventos do jogo.'
          ),
        }));
      } finally {
        if (!controller.signal.aborted && jogo?.status === 'in_progress') {
          intervalo = setTimeout(carregarEventos, 3000);
        }
      }
    }

    carregarEventos();
    return () => {
      controller.abort();
      clearTimeout(intervalo);
    };
  }, [matchId, gameId, chaveJogo, jogo?.status, tentativa]);

  const eventos = useMemo(
    () =>
      (eventosCarregados || []).map((evento) => {
        const jogador = partida?.teams
          ?.flatMap((time) => time.players || [])
          .find((item) => item.player_id === evento.player_id);
        return {
          ...evento,
          player_name:
            evento.player_name ||
            jogador?.player_name ||
            jogador?.name ||
            'Jogador',
        };
      }),
    [eventosCarregados, partida?.teams]
  );

  const placar = useMemo(
    () =>
      carregandoEventos
        ? null
        : calcularPlacar(eventos, jogo?.teamA?.id, jogo?.teamB?.id),
    [carregandoEventos, eventos, jogo?.teamA?.id, jogo?.teamB?.id]
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
    if (carregandoEventos || salvandoEvento) return;
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
        revisaoEventos.current += 1;
        setHistorico((atual) => {
          if (atual && atual.chave !== chaveJogo) return atual;
          const anteriores = atual?.eventos || [];
          return {
            chave: chaveJogo,
            eventos: [
              ...anteriores,
              ...novosEventos.filter(
                (novo) => !anteriores.some((evento) => evento.id === novo.id)
              ),
            ],
            erro: '',
          };
        });
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
    carregandoEventos,
    erroEventos,
    recarregarEventos: () => setTentativa((atual) => atual + 1),
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
