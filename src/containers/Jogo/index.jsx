import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { useControleJogo } from '../../hooks/useControleJogo';
import { useEventosJogo } from '../../hooks/useEventosJogo';
import { api } from '../../services/api';
import { mensagemDoErro } from '../../utils/mensagemDoErro';
import {
  PaginaJogadores,
  EyebrowJogadores,
  TituloJogadores,
} from '../Jogadores/styles';
import { ModalEventoJogo } from './components/ModalEventoJogo';
import { ModalResultadoJogo } from './components/ModalResultadoJogo';
import {
  BotaoControleJogo,
  CartaoJogo,
  CronometroJogo,
  DetalhesJogo,
  StatusJogo,
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
  const {
    partida,
    setPartida,
    jogo,
    carregando,
    erro,
    setErro,
    atualizando,
    segundosDecorridos,
    resultadoAberto,
    setResultadoAberto,
    atualizarEstadoJogo,
    handleFinalizarJogo,
  } = useControleJogo(matchId, gameId);
  const [gerandoLinkAvaliacao, setGerandoLinkAvaliacao] = useState(false);
  const [linkAvaliacao, setLinkAvaliacao] = useState('');
  const [linkCopiado, setLinkCopiado] = useState(false);
  const [expiraAvaliacao, setExpiraAvaliacao] = useState('');
  const [avaliacaoExpirada, setAvaliacaoExpirada] = useState(false);
  const {
    placar,
    eventos,
    carregandoEventos,
    erroEventos,
    recarregarEventos,
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
  } = useEventosJogo({
    matchId,
    gameId,
    jogo,
    partida,
    setPartida,
    setErro,
  });

  async function handleGerarLinkAvaliacao() {
    if (gerandoLinkAvaliacao || avaliacaoExpirada) return;
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

      if (error.response?.status === 410) {
        setAvaliacaoExpirada(true);

        setErro(
          'O prazo de avaliação desta partida terminou. Não é mais possível gerar o link.'
        );
        return;
      }

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

  return (
    <PaginaJogadores>
      <EyebrowJogadores>
        PARTIDA {jogo?.status === 'in_progress' ? 'EM ANDAMENTO' : ''}
      </EyebrowJogadores>
      <TituloJogadores>Cronômetro &amp; Placar</TituloJogadores>

      {carregando && <p role="status">Carregando jogo...</p>}
      {erro && <p role="alert">{erro}</p>}
      {carregandoEventos && !erroEventos && (
        <p role="status">Carregando placar e eventos...</p>
      )}
      {erroEventos && (
        <div role="alert">
          <p>{erroEventos}</p>
          <BotaoEventoJogo type="button" onClick={recarregarEventos}>
            Tentar carregar eventos novamente
          </BotaoEventoJogo>
        </div>
      )}

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

                <ValorPlacarJogo>{placar?.a ?? '—'}</ValorPlacarJogo>

                <BotaoPlacarJogo
                  type="button"
                  aria-label={`Registrar gol para ${jogo.teamA?.name || 'Time A'}`}
                  onClick={() => abrirModalEvento('goal', jogo.teamA?.id)}
                  disabled={carregandoEventos || jogo.status !== 'in_progress'}
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
                  disabled={carregandoEventos || jogo.status !== 'in_progress'}
                >
                  +
                </BotaoPlacarJogo>
                <ValorPlacarJogo>{placar?.b ?? '—'}</ValorPlacarJogo>
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

            {jogo.status === 'in_progress' && !carregandoEventos && (
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
                <DetalhesJogo>
                  O resultado será definido pelo placar registrado.
                </DetalhesJogo>
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
                    disabled={atualizando}
                  >
                    {atualizando ? 'Encerrando...' : 'Encerrar jogo'}
                  </BotaoControleJogo>
                )}
              </ControlesCronometroJogo>
            </CartaoCronometroJogo>
          </CartaoJogo>

          {jogo.status === 'in_progress' && (
            <ModalEventoJogo
              tipo={tipoModalEvento}
              jogo={jogo}
              erro={erro}
              timeId={timeEventoId}
              onTimeChange={(event) => {
                setTimeEventoId(event.target.value);
                setJogadorEventoId('');
              }}
              jogadorId={jogadorEventoId}
              onJogadorChange={(event) =>
                setJogadorEventoId(event.target.value)
              }
              golContra={golContra}
              onGolContraChange={(event) => {
                setGolContra(event.target.checked);
                setJogadorEventoId('');
              }}
              tipoCartao={tipoCartao}
              onTipoCartaoChange={(event) => setTipoCartao(event.target.value)}
              jogadorSaiId={jogadorSaiId}
              onJogadorSaiChange={(event) =>
                setJogadorSaiId(event.target.value)
              }
              jogadorEntraId={jogadorEntraId}
              onJogadorEntraChange={(event) =>
                setJogadorEntraId(event.target.value)
              }
              jogadoresDoTime={jogadoresDoTime}
              salvando={salvandoEvento}
              onSalvar={handleSalvarEvento}
              onFechar={() => setTipoModalEvento('')}
            />
          )}

          {resultadoAberto && (
            <ModalResultadoJogo
              jogo={jogo}
              placar={placar}
              erroEventos={erroEventos}
              erro={erro}
              onRecarregarEventos={recarregarEventos}
              tempoDecorrido={formatarTempo(segundosDecorridos)}
              linkAvaliacao={linkAvaliacao}
              expiraAvaliacao={expiraAvaliacao}
              linkCopiado={linkCopiado}
              gerandoLink={gerandoLinkAvaliacao}
              onGerarLink={handleGerarLinkAvaliacao}
              onCopiarLink={handleCopiarLinkAvaliacao}
              avaliacaoExpirada={avaliacaoExpirada}
              onCriarOutraPartida={() => {
                sessionStorage.removeItem('sorteador.partida');
                navigate('/partidas', {
                  state: { limparRotaJogo: true },
                });
              }}
              onFechar={() => setResultadoAberto(false)}
            />
          )}
        </>
      )}
    </PaginaJogadores>
  );
}
