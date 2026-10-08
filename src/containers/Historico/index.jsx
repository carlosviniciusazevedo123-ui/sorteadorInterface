import { useMemo } from 'react';

import { usePartidas } from '../../hooks/usePartidas';
import {
  PaginaJogadores as PaginaHistorico,
  EyebrowJogadores,
  TituloJogadores,
  DescricaoJogadores,
} from '../Jogadores/styles';
import {
  ListaHistorico,
  CartaoHistorico,
  CabecalhoHistorico,
  DataHistorico,
  StatusHistorico,
  ConfrontoHistorico,
  DetalhesHistorico,
  ResultadoHistorico,
  EstadoHistorico,
  ErroHistorico,
} from './styles';

const statusEmPortugues = {
  pending: 'Aguardando início',
  in_progress: 'Em andamento',
  paused: 'Pausada',
  finished: 'Finalizada',
};

function formatarData(data) {
  if (!data) return 'Data não informada';

  const dataValida = new Date(data);
  if (Number.isNaN(dataValida.getTime())) return 'Data não informada';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dataValida);
}

function nomeDoTime(time, indice) {
  return time?.name || `Time ${time?.team_number ?? indice + 1}`;
}

function obterConfronto(partida, jogo) {
  const times = partida.teams || [];
  const timeA =
    jogo?.teamA || times.find((time) => time.id === jogo?.team_a_id);
  const timeB =
    jogo?.teamB || times.find((time) => time.id === jogo?.team_b_id);

  return {
    timeA: nomeDoTime(timeA, 0),
    timeB: nomeDoTime(timeB, 1),
    vencedor:
      jogo?.winner?.name ||
      times.find((time) => time.id === jogo?.winner_team_id)?.name ||
      null,
  };
}

export function Historico() {
  const { partidas, carregando, erro } = usePartidas({ incluirDetalhes: true });
  const partidasOrdenadas = useMemo(
    () =>
      [...partidas].sort((a, b) => {
        const dataA = new Date(a.finished_at || a.createdAt || 0);
        const dataB = new Date(b.finished_at || b.createdAt || 0);
        return dataB - dataA;
      }),
    [partidas]
  );

  return (
    <PaginaHistorico>
      <EyebrowJogadores>SUAS PARTIDAS</EyebrowJogadores>
      <TituloJogadores>Histórico</TituloJogadores>
      <DescricaoJogadores>
        Consulte os confrontos e resultados das suas partidas.
      </DescricaoJogadores>

      {carregando && (
        <EstadoHistorico role="status">Carregando partidas...</EstadoHistorico>
      )}

      {erro && <ErroHistorico role="alert">{erro}</ErroHistorico>}

      {!carregando && !erro && partidasOrdenadas.length === 0 && (
        <EstadoHistorico>
          <strong>Nenhuma partida por aqui ainda</strong>
          <span>Quando você jogar, os confrontos vão aparecer nesta tela.</span>
        </EstadoHistorico>
      )}

      {!carregando && partidasOrdenadas.length > 0 && (
        <ListaHistorico>
          {partidasOrdenadas.map((partida) => {
            const jogos = partida.games || [];
            const jogo = jogos[0];
            const confronto = obterConfronto(partida, jogo);
            const status = jogo?.status || partida.status;
            const data =
              jogo?.finished_at ||
              jogo?.finishedAt ||
              partida.finished_at ||
              partida.finishedAt ||
              jogo?.createdAt ||
              partida.createdAt;

            return (
              <CartaoHistorico key={partida.id}>
                <CabecalhoHistorico>
                  <DataHistorico>{formatarData(data)}</DataHistorico>
                  <StatusHistorico $status={status}>
                    {statusEmPortugues[status] ||
                      status ||
                      'Status indisponível'}
                  </StatusHistorico>
                </CabecalhoHistorico>

                <ConfrontoHistorico>
                  <span>{confronto.timeA}</span>
                  <span aria-hidden="true">×</span>
                  <span>{confronto.timeB}</span>
                </ConfrontoHistorico>

                <DetalhesHistorico>
                  {jogo?.round ? `Rodada ${jogo.round}` : 'Confronto'}
                  {jogo?.duration ? ` · ${jogo.duration} min` : ''}
                </DetalhesHistorico>

                {status === 'finished' && confronto.vencedor && (
                  <ResultadoHistorico>
                    Vencedor: <strong>{confronto.vencedor}</strong>
                  </ResultadoHistorico>
                )}
              </CartaoHistorico>
            );
          })}
        </ListaHistorico>
      )}
    </PaginaHistorico>
  );
}
