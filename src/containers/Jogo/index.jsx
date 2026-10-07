import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { api } from '../../services/api';
import {
  PaginaJogadores,
  EyebrowJogadores,
  TituloJogadores,
} from '../Jogadores/styles';
import {
  BotaoAcaoJogo,
  BotaoControleJogo,
  CampoVencedorJogo,
  CartaoJogo,
  ConfrontoJogo,
  CronometroJogo,
  DetalhesJogo,
  SelectVencedorJogo,
  StatusJogo,
  FundoModalResultado,
  ModalResultado,
  LinkAvaliacaoJogo,
  ElencosJogo,
  TimeElencoJogo,
  ItemElencoJogo,
  NumeroElencoJogo,
  TipoElencoJogo,
  PlacarJogo,
  ValorPlacarJogo,
  BotaoPlacarJogo,
  GrupoPlacarJogo,
  AcoesRapidasJogo,
  GradeAcoesJogo,
  BotaoEventoJogo,
  ListaEventosJogo,
  ItemEventoJogo,
  FundoModalEvento,
  ModalEvento,
  CampoEventoJogo,
  CabecalhoTimesJogo,
  CartaoCronometroJogo,
  ControlesCronometroJogo,
} from './styles';

const statusEmPortugues = {
  pending: 'Aguardando início',
  in_progress: 'Em andamento',
  paused: 'Pausado',
  finished: 'Finalizado',
};

function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;

  return `${String(minutos).padStart(2, '0')}:${String(
    segundosRestantes
  ).padStart(2, '0')}`;
}

function mensagemDoErro(error, padrao) {
  const mensagem = error.response?.data?.error;

  return Array.isArray(mensagem)
    ? mensagem.join(' ')
    : typeof mensagem === 'string'
      ? mensagem
      : padrao;
}

const nomeEvento = {
  goal: 'Gol',
  own_goal: 'Gol contra',
  assist: 'Assistência',
  yellow_card: 'Cartão amarelo',
  red_card: 'Cartão vermelho',
  substitution: 'Substituição',
};

export function Jogo() {
  const { matchId, gameId } = useParams();
  const navigate = useNavigate();
  const [partida, setPartida] = useState(null);
  const [jogo, setJogo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);
  const [vencedorId, setVencedorId] = useState('');
  const [resultadoAberto, setResultadoAberto] = useState(false);
  const [gerandoLinkAvaliacao, setGerandoLinkAvaliacao] = useState(false);
  const [linkAvaliacao, setLinkAvaliacao] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [expiraAvaliacao, setExpiraAvaliacao] = useState('');
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

  const placar = useMemo(() => {
    return eventos.reduce(
      (total, evento) => {
        if (evento.event_type !== 'goal' && evento.event_type !== 'own_goal') {
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
    );
  }, [eventos, jogo?.teamA?.id, jogo?.teamB?.id]);

  function enriquecerJogo(dadosJogo, dadosPartida) {
    const teamA = dadosPartida?.teams?.find(
      (time) => time.id === dadosJogo.team_a_id
    );
    const teamB = dadosPartida?.teams?.find(
      (time) => time.id === dadosJogo.team_b_id
    );
    const winner = dadosPartida?.teams?.find(
      (time) => time.id === dadosJogo.winner_team_id
    );

    return { ...dadosJogo, teamA, teamB, winner };
  }

  useEffect(() => {
    async function carregarJogo() {
      try {
        const [{ data: dadosJogo }, { data: dadosPartida }] = await Promise.all(
          [
            api.get(`/matches/${matchId}/games/${gameId}`),
            api.get(`/matches/${matchId}`),
          ]
        );

        const partidaCarregada = dadosPartida.match ?? dadosPartida;
        const jogoCarregado = dadosJogo.game ?? dadosJogo;
        setPartida(partidaCarregada);
        setJogo(enriquecerJogo(jogoCarregado, partidaCarregada));
        setSegundosDecorridos(Number(jogoCarregado.elapsed_seconds) || 0);
        setResultadoAberto(jogoCarregado.status === 'finished');
      } catch (error) {
        console.error('Erro ao carregar jogo:', error.response?.data ?? error);

        const mensagem = error.response?.data?.error;

        setErro(
          Array.isArray(mensagem)
            ? mensagem.join(' ')
            : typeof mensagem === 'string'
              ? mensagem
              : 'Não foi possível carregar o jogo.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarJogo();
  }, [matchId, gameId]);

  useEffect(() => {
    if (jogo?.status !== 'in_progress') return;

    const intervalo = setInterval(async () => {
      try {
        const { data } = await api.get(`/matches/${matchId}/games/${gameId}`);
        const dadosJogo = data.game ?? data;
        setJogo(enriquecerJogo(dadosJogo, partida));
        setSegundosDecorridos(Number(dadosJogo.elapsed_seconds) || 0);
        setResultadoAberto(dadosJogo.status === 'finished');
      } catch (error) {
        console.error(
          'Erro ao atualizar o estado do jogo:',
          error.response?.data ?? error
        );
      }
    }, 3000);

    return () => clearInterval(intervalo);
  }, [jogo?.status, matchId, gameId, partida]);

  useEffect(() => {
    if (jogo?.status !== 'in_progress') return;

    const intervalo = setInterval(() => {
      setSegundosDecorridos((segundos) => segundos + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [jogo?.status]);

  async function atualizarEstadoJogo(acao) {
    setErro('');
    setAtualizando(true);

    try {
      await api.patch(`/matches/${matchId}/games/${gameId}/${acao}`);

      const [{ data: dadosJogo }, { data: dadosPartida }] = await Promise.all([
        api.get(`/matches/${matchId}/games/${gameId}`),
        api.get(`/matches/${matchId}`),
      ]);
      const partidaAtualizada = dadosPartida.match ?? dadosPartida;
      const jogoAtualizado = dadosJogo.game ?? dadosJogo;
      setPartida(partidaAtualizada);
      setJogo(enriquecerJogo(jogoAtualizado, partidaAtualizada));
      setSegundosDecorridos(Number(jogoAtualizado.elapsed_seconds) || 0);
      setResultadoAberto(jogoAtualizado.status === 'finished');
    } catch (error) {
      const mensagem = error.response?.data?.error;

      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(' ')
          : typeof mensagem === 'string'
            ? mensagem
            : 'Não foi possível atualizar o jogo.'
      );
    } finally {
      setAtualizando(false);
    }
  }
  async function handleFinalizarJogo() {
    if (!vencedorId) {
      setErro('Selecione o time vencedor.');
      return;
    }

    setErro('');
    setAtualizando(true);

    try {
      await api.patch(`/matches/${matchId}/games/${gameId}/finish`, {
        winner_team_id: vencedorId,
      });

      const [{ data: dadosJogo }, { data: dadosPartida }] = await Promise.all([
        api.get(`/matches/${matchId}/games/${gameId}`),
        api.get(`/matches/${matchId}`),
      ]);
      const partidaFinalizada = dadosPartida.match ?? dadosPartida;
      const jogoFinalizado = dadosJogo.game ?? dadosJogo;
      setPartida(partidaFinalizada);
      setJogo(enriquecerJogo(jogoFinalizado, partidaFinalizada));
      setSegundosDecorridos(Number(jogoFinalizado.elapsed_seconds) || 0);
      setResultadoAberto(true);
    } catch (error) {
      const mensagem = error.response?.data?.error;

      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(' ')
          : typeof mensagem === 'string'
            ? mensagem
            : 'Não foi possível finalizar o jogo.'
      );
    } finally {
      setAtualizando(false);
    }
  }

  async function handleGerarLinkAvaliacao() {
    setErro('');
    setGerandoLinkAvaliacao(true);

    try {
      const { data } = await api.post(`/matches/${matchId}/evaluators`);

      if (!data.token) {
        setErro('A resposta do backend não trouxe o token da avaliação.');
        return;
      }

      setLinkAvaliacao(
        new URL(`/avaliacao/${data.token}`, window.location.origin).toString()
      );
      setExpiraAvaliacao(data.expires_at || '');
    } catch (error) {
      console.error(
        'Erro ao gerar link da avaliação:',
        error.response?.data ?? error
      );
      setErro(
        mensagemDoErro(error, 'Não foi possível gerar o link de avaliação.')
      );
    } finally {
      setGerandoLinkAvaliacao(false);
    }
  }

  async function handleCopiarLinkAvaliacao() {
    try {
      await navigator.clipboard.writeText(linkAvaliacao);
      setLinkCopiado(true);
    } catch {
      setErro(
        'Não foi possível copiar o link neste navegador. Selecione e copie o endereço.'
      );
    }
  }

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

  return (
    <PaginaJogadores>
      <EyebrowJogadores>
        PARTIDA {jogo?.status === 'in_progress' ? 'EM ANDAMENTO' : ''}
      </EyebrowJogadores>
      <TituloJogadores>Cronômetro &amp; Placar</TituloJogadores>

      {carregando && <p role="status">Carregando jogo...</p>}
      {erro && <p role="alert">{erro}</p>}

      {jogo && (
        <>
          <CartaoJogo>
            <CabecalhoTimesJogo className="matchup">
              <strong className="time-a">{jogo.teamA?.name || 'Time A'}</strong>
              <span>VS</span>
              <strong className="time-b">{jogo.teamB?.name || 'Time B'}</strong>
            </CabecalhoTimesJogo>

            <StatusJogo className="game-status">
              {statusEmPortugues[jogo.status] || jogo.status}
            </StatusJogo>

            {jogo.status !== 'finished' && partida?.teams && (
              <ElencosJogo className="lineup">
                {[jogo.teamA, jogo.teamB].filter(Boolean).map((time) => (
                  <TimeElencoJogo key={time.id}>
                    <h3>{time.name}</h3>
                    {(time.players || []).map((jogador) => (
                      <ItemElencoJogo key={jogador.id}>
                        <NumeroElencoJogo>{jogador.number}</NumeroElencoJogo>
                        <strong>{jogador.player_name || jogador.name}</strong>
                        {(jogador.is_goalkeeper || jogador.is_reserve) && (
                          <TipoElencoJogo>
                            {jogador.is_goalkeeper ? 'Goleiro' : 'Reserva'}
                          </TipoElencoJogo>
                        )}
                      </ItemElencoJogo>
                    ))}
                  </TimeElencoJogo>
                ))}
              </ElencosJogo>
            )}

            <PlacarJogo className="score" aria-label="Placar do jogo">
              <GrupoPlacarJogo>
                <BotaoPlacarJogo
                  type="button"
                  $menos
                  aria-label="Remover gol do Time A"
                  title="Ainda não existe uma rota para remover um evento."
                  disabled
                >
                  -
                </BotaoPlacarJogo>

                <ValorPlacarJogo>{placar.a}</ValorPlacarJogo>

                <BotaoPlacarJogo
                  type="button"
                  aria-label={`Registrar gol para ${jogo.teamA?.name || 'Time A'}`}
                  onClick={() => abrirModalEvento('goal', jogo.teamA?.id)}
                  disabled={jogo.status !== 'in_progress'}
                >
                  +
                </BotaoPlacarJogo>
              </GrupoPlacarJogo>
              <strong>:</strong>
              <GrupoPlacarJogo>
                <BotaoPlacarJogo
                  type="button"
                  aria-label={`Registrar gol para ${jogo.teamB?.name || 'Time B'}`}
                  onClick={() => abrirModalEvento('goal', jogo.teamB?.id)}
                  disabled={jogo.status !== 'in_progress'}
                >
                  +
                </BotaoPlacarJogo>
                <ValorPlacarJogo>{placar.b}</ValorPlacarJogo>
                <BotaoPlacarJogo
                  type="button"
                  aria-label="Remover gol do Time B"
                  $menos
                  title="Ainda não existe uma rota para remover um evento."
                  disabled
                >
                  −
                </BotaoPlacarJogo>
              </GrupoPlacarJogo>
            </PlacarJogo>

            {jogo.status === 'in_progress' && (
              <AcoesRapidasJogo className="quick-events">
                <h3>Lançar evento</h3>
                <GradeAcoesJogo>
                  <BotaoEventoJogo
                    type="button"
                    onClick={() => abrirModalEvento('goal')}
                  >
                    Gol
                  </BotaoEventoJogo>
                  <BotaoEventoJogo
                    type="button"
                    onClick={() => abrirModalEvento('assist')}
                  >
                    Assistência
                  </BotaoEventoJogo>
                  <BotaoEventoJogo
                    type="button"
                    onClick={() => abrirModalEvento('substitution')}
                  >
                    Substituição
                  </BotaoEventoJogo>
                  <BotaoEventoJogo
                    type="button"
                    $perigo
                    onClick={() => abrirModalEvento('card')}
                  >
                    Cartões
                  </BotaoEventoJogo>
                </GradeAcoesJogo>
              </AcoesRapidasJogo>
            )}

            {eventos.length > 0 && (
              <AcoesRapidasJogo className="timeline">
                <h3>Eventos registrados</h3>
                <ListaEventosJogo>
                  {eventos.map((evento, indice) => (
                    <ItemEventoJogo
                      key={evento.id || `${evento.event_type}-${indice}`}
                    >
                      <span>
                        {nomeEvento[evento.event_type]} · {evento.player_name}
                      </span>
                      <span>{evento.minute ?? 0}&apos;</span>
                    </ItemEventoJogo>
                  ))}
                </ListaEventosJogo>
              </AcoesRapidasJogo>
            )}

            <CartaoCronometroJogo className="game-clock">
              <CronometroJogo aria-label="Tempo decorrido">
                {formatarTempo(segundosDecorridos)}
              </CronometroJogo>
              <DetalhesJogo>
                {jogo.status === 'paused' ? 'Pausado' : '1º tempo'} ·{' '}
                {jogo.duration}:00
              </DetalhesJogo>

              {jogo.status === 'in_progress' && (
                <CampoVencedorJogo>
                  Time vencedor
                  <SelectVencedorJogo
                    value={vencedorId}
                    onChange={(event) => setVencedorId(event.target.value)}
                  >
                    <option value="">Selecione o vencedor</option>
                    <option value={jogo.teamA?.id}>
                      {jogo.teamA?.name || 'Time A'}
                    </option>
                    <option value={jogo.teamB?.id}>
                      {jogo.teamB?.name || 'Time B'}
                    </option>
                  </SelectVencedorJogo>
                </CampoVencedorJogo>
              )}

              <ControlesCronometroJogo>
                {jogo.status === 'pending' && (
                  <BotaoControleJogo
                    type="button"
                    $primario
                    onClick={() => atualizarEstadoJogo('start')}
                    disabled={atualizando}
                  >
                    {atualizando ? 'Iniciando...' : 'Iniciar jogo'}
                  </BotaoControleJogo>
                )}
                {jogo.status === 'in_progress' && (
                  <BotaoControleJogo
                    type="button"
                    onClick={() => atualizarEstadoJogo('pause')}
                    disabled={atualizando}
                  >
                    {atualizando ? 'Pausando...' : 'Pausar'}
                  </BotaoControleJogo>
                )}
                {jogo.status === 'paused' && (
                  <BotaoControleJogo
                    type="button"
                    $primario
                    onClick={() => atualizarEstadoJogo('resume')}
                    disabled={atualizando}
                  >
                    {atualizando ? 'Retomando...' : 'Continuar'}
                  </BotaoControleJogo>
                )}
                {jogo.status === 'in_progress' && (
                  <BotaoControleJogo
                    type="button"
                    $finalizar
                    onClick={handleFinalizarJogo}
                    disabled={atualizando || !vencedorId}
                  >
                    {atualizando ? 'Encerrando...' : 'Encerrar jogo'}
                  </BotaoControleJogo>
                )}
              </ControlesCronometroJogo>
            </CartaoCronometroJogo>
          </CartaoJogo>

          {tipoModalEvento && (
            <FundoModalEvento
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget && !salvandoEvento) {
                  setTipoModalEvento('');
                }
              }}
            >
              <ModalEvento
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-modal-evento"
              >
                <h2 id="titulo-modal-evento">
                  {tipoModalEvento === 'goal'
                    ? 'Registrar gol'
                    : tipoModalEvento === 'assist'
                      ? 'Registrar assistência'
                      : tipoModalEvento === 'substitution'
                        ? 'Registrar substituição'
                        : 'Registrar cartão'}
                </h2>

                {erro && <p role="alert">{erro}</p>}

                {tipoModalEvento !== 'goal' && (
                  <CampoEventoJogo>
                    Time do jogador
                    <select
                      value={timeEventoId}
                      onChange={(event) => {
                        setTimeEventoId(event.target.value);
                        setJogadorEventoId('');
                      }}
                    >
                      <option value={jogo.teamA?.id}>
                        {jogo.teamA?.name || 'Time A'}
                      </option>
                      <option value={jogo.teamB?.id}>
                        {jogo.teamB?.name || 'Time B'}
                      </option>
                    </select>
                  </CampoEventoJogo>
                )}

                {tipoModalEvento === 'goal' && (
                  <>
                    <CampoEventoJogo>
                      Gol para
                      <select
                        value={timeEventoId}
                        onChange={(event) => {
                          setTimeEventoId(event.target.value);
                          setJogadorEventoId('');
                        }}
                      >
                        <option value={jogo.teamA?.id}>
                          {jogo.teamA?.name || 'Time A'}
                        </option>
                        <option value={jogo.teamB?.id}>
                          {jogo.teamB?.name || 'Time B'}
                        </option>
                      </select>
                    </CampoEventoJogo>
                    <label>
                      <input
                        type="checkbox"
                        checked={golContra}
                        onChange={(event) => {
                          setGolContra(event.target.checked);
                          setJogadorEventoId('');
                        }}
                      />{' '}
                      Gol contra
                    </label>
                  </>
                )}

                {tipoModalEvento === 'card' && (
                  <CampoEventoJogo>
                    Tipo de cartão
                    <select
                      value={tipoCartao}
                      onChange={(event) => setTipoCartao(event.target.value)}
                    >
                      <option value="yellow_card">Amarelo</option>
                      <option value="red_card">Vermelho</option>
                    </select>
                  </CampoEventoJogo>
                )}

                {tipoModalEvento === 'substitution' ? (
                  <>
                    <CampoEventoJogo>
                      Sai (jogador ativo)
                      <select
                        value={jogadorSaiId}
                        onChange={(event) =>
                          setJogadorSaiId(event.target.value)
                        }
                      >
                        <option value="">Selecione quem sai</option>
                        {jogadoresDoTime(timeEventoId)
                          .filter((jogador) => !jogador.is_reserve)
                          .map((jogador) => (
                            <option key={jogador.id} value={jogador.player_id}>
                              {jogador.player_name || jogador.name}
                            </option>
                          ))}
                      </select>
                    </CampoEventoJogo>
                    <CampoEventoJogo>
                      Entra (reserva)
                      <select
                        value={jogadorEntraId}
                        onChange={(event) =>
                          setJogadorEntraId(event.target.value)
                        }
                      >
                        <option value="">Selecione quem entra</option>
                        {jogadoresDoTime(timeEventoId)
                          .filter((jogador) => jogador.is_reserve)
                          .map((jogador) => (
                            <option key={jogador.id} value={jogador.player_id}>
                              {jogador.player_name || jogador.name}
                            </option>
                          ))}
                      </select>
                    </CampoEventoJogo>
                  </>
                ) : (
                  <CampoEventoJogo>
                    Jogador
                    <select
                      value={jogadorEventoId}
                      onChange={(event) =>
                        setJogadorEventoId(event.target.value)
                      }
                    >
                      <option value="">Selecione um jogador</option>
                      {jogadoresDoTime(
                        tipoModalEvento === 'goal' && golContra
                          ? timeEventoId === jogo.teamA?.id
                            ? jogo.teamB?.id
                            : jogo.teamA?.id
                          : timeEventoId
                      ).map((jogador) => (
                        <option key={jogador.id} value={jogador.player_id}>
                          {jogador.player_name || jogador.name}
                        </option>
                      ))}
                    </select>
                  </CampoEventoJogo>
                )}

                <BotaoAcaoJogo
                  type="button"
                  onClick={handleSalvarEvento}
                  disabled={salvandoEvento}
                >
                  {salvandoEvento ? 'Salvando evento...' : 'Salvar evento'}
                </BotaoAcaoJogo>
                <BotaoEventoJogo
                  type="button"
                  onClick={() => setTipoModalEvento('')}
                  disabled={salvandoEvento}
                >
                  Cancelar
                </BotaoEventoJogo>
              </ModalEvento>
            </FundoModalEvento>
          )}

          {resultadoAberto && jogo.status === 'finished' && (
            <FundoModalResultado
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setResultadoAberto(false);
                }
              }}
            >
              <ModalResultado
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-resultado-jogo"
              >
                <StatusJogo>JOGO ENCERRADO</StatusJogo>
                <h2 id="titulo-resultado-jogo">Resultado do jogo</h2>
                <ConfrontoJogo>
                  {jogo.teamA?.name || 'Time A'} x{' '}
                  {jogo.teamB?.name || 'Time B'}
                </ConfrontoJogo>
                <ValorPlacarJogo aria-label="Placar final">
                  {placar.a} x {placar.b}
                </ValorPlacarJogo>
                <DetalhesJogo>
                  Tempo de jogo: {formatarTempo(segundosDecorridos)}
                </DetalhesJogo>
                <p>
                  {jogo.winner?.name
                    ? `Vencedor: ${jogo.winner.name}`
                    : 'Jogo finalizado'}
                </p>
                {!linkAvaliacao ? (
                  <BotaoAcaoJogo
                    type="button"
                    onClick={handleGerarLinkAvaliacao}
                    disabled={gerandoLinkAvaliacao}
                  >
                    {gerandoLinkAvaliacao
                      ? 'Gerando link...'
                      : 'Gerar link de avaliação'}
                  </BotaoAcaoJogo>
                ) : (
                  <>
                    <LinkAvaliacaoJogo aria-label="Link para avaliação">
                      {linkAvaliacao}
                    </LinkAvaliacaoJogo>
                    {expiraAvaliacao && (
                      <DetalhesJogo>
                        Link válido até{' '}
                        {new Date(expiraAvaliacao).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </DetalhesJogo>
                    )}
                    <BotaoAcaoJogo
                      type="button"
                      onClick={handleCopiarLinkAvaliacao}
                    >
                      {linkCopiado ? 'Link copiado' : 'Copiar link'}
                    </BotaoAcaoJogo>
                    <BotaoAcaoJogo
                      type="button"
                      onClick={() => {
                        sessionStorage.removeItem('sorteador.partida');
                        navigate('/partidas', {
                          state: { limparRotaJogo: true },
                        });
                      }}
                    >
                      Criar outra partida
                    </BotaoAcaoJogo>
                  </>
                )}
              </ModalResultado>
            </FundoModalResultado>
          )}
        </>
      )}
    </PaginaJogadores>
  );
}
