import { useNavigate } from 'react-router';

import { useJogadores } from '../../hooks/useJogadores';
import { useSorteio } from '../../hooks/useSorteio';
import { formatarNome } from '../../utils/formatarNome';
import {
  PaginaJogadores as PaginaSorteio,
  EyebrowJogadores,
  TituloJogadores,
  DescricaoJogadores,
} from '../Jogadores/styles';
import {
  SecaoSelecao,
  TituloSelecao,
  ListaOpcoes,
  OpcaoJogador,
  CampoBusca,
  GradeConfiguracoes,
  CampoConfiguracao,
  InputConfiguracao,
  OpcaoConfiguracao,
  ListaTimesSorteados,
  CartaoTimeSorteado,
  TituloTimeSorteado,
  ListaJogadoresSorteados,
  JogadorSorteado,
  BotaoAcaoSorteio,
  CartaoConfiguracaoSorteio,
  LinhaQuantidadeTimes,
  TextoQuantidadeTimes,
  ControleQuantidadeTimes,
  BotaoAjusteQuantidade,
  ValorQuantidadeTimes,
  NotaJogadorSorteio,
  CabecalhoJogadoresSorteio,
  TituloDisponiveisSorteio,
  ContadorSelecionadosSorteio,
  ResumoConfiguracaoSorteio,
  CabecalhoTimeSorteado,
  MediaTimeSorteado,
  TipoJogadorSorteado,
  InfoJogadorSorteado,
  NumeroJogadorSorteado,
  AcoesResultadoSorteio,
  BotaoSecundarioSorteio,
} from './styles';

export function Sorteio() {
  const { jogadores, carregando, erro: erroCarregamento } = useJogadores();
  const {
    jogadoresSelecionados,
    busca,
    setBusca,
    quantidadeTimes,
    setQuantidadeTimes,
    jogadoresPorTime,
    setJogadoresPorTime,
    temReserva,
    setTemReserva,
    reservasPorTime,
    setReservasPorTime,
    considerarGoleiros,
    setConsiderarGoleiros,
    sorteando,
    resultadoSorteio,
    setResultadoSorteio,
    erro,
    jogadoresFiltrados,
    alternarSelecao,
    handleSortear,
  } = useSorteio(jogadores);

  const navigate = useNavigate();

  const erroExibido = erro || erroCarregamento;

  return (
    <PaginaSorteio>
      <EyebrowJogadores>
        {resultadoSorteio ? 'RESULTADO' : 'PREPARAR RODADA'}
      </EyebrowJogadores>

      <TituloJogadores>
        {resultadoSorteio ? 'Times sorteados' : 'Sorteio de times'}
      </TituloJogadores>

      <DescricaoJogadores>
        {resultadoSorteio
          ? 'Confira os jogadores de cada time antes de iniciar uma partida.'
          : 'Selecione os jogadores disponíveis para dividir os times.'}
      </DescricaoJogadores>

      {carregando && <p role="status">Carregando jogadores...</p>}
      {erroExibido && <p role="alert">{erroExibido}</p>}

      {!carregando && !erroCarregamento && jogadores.length === 0 && (
        <p>Cadastre jogadores antes de preparar um sorteio.</p>
      )}

      {!carregando && !erroCarregamento && jogadores.length > 0 && (
        <SecaoSelecao>
          {!resultadoSorteio && (
            <>
              <TituloSelecao>Como formar os times?</TituloSelecao>

              <CartaoConfiguracaoSorteio>
                <ResumoConfiguracaoSorteio>
                  Configuração: {quantidadeTimes} times, {jogadoresPorTime}{' '}
                  jogadores por time
                  {temReserva && (
                    <>
                      {' e '}
                      {reservasPorTime}{' '}
                      {reservasPorTime === 1 ? 'reserva' : 'reservas'} por time
                    </>
                  )}
                  . Goleiros{' '}
                  {considerarGoleiros
                    ? 'serão considerados'
                    : 'não serão considerados'}
                  .
                </ResumoConfiguracaoSorteio>
                <LinhaQuantidadeTimes>
                  <TextoQuantidadeTimes>
                    <strong>Quantidade de times</strong>
                    <span>Escolha quantos times montar</span>
                  </TextoQuantidadeTimes>

                  <ControleQuantidadeTimes>
                    <BotaoAjusteQuantidade
                      type="button"
                      aria-label="Diminuir quantidade de times"
                      disabled={quantidadeTimes <= 2}
                      onClick={() =>
                        setQuantidadeTimes((quantidade) =>
                          Math.max(2, quantidade - 1)
                        )
                      }
                    >
                      −
                    </BotaoAjusteQuantidade>

                    <ValorQuantidadeTimes>
                      {quantidadeTimes}
                    </ValorQuantidadeTimes>

                    <BotaoAjusteQuantidade
                      type="button"
                      aria-label="Aumentar quantidade de times"
                      disabled={quantidadeTimes >= 50}
                      onClick={() =>
                        setQuantidadeTimes((quantidade) => quantidade + 1)
                      }
                    >
                      +
                    </BotaoAjusteQuantidade>
                  </ControleQuantidadeTimes>
                </LinhaQuantidadeTimes>

                <GradeConfiguracoes>
                  <CampoConfiguracao>
                    Jogadores de linha por time
                    <InputConfiguracao
                      type="number"
                      min="1"
                      max="20"
                      value={jogadoresPorTime}
                      onChange={(event) =>
                        setJogadoresPorTime(Number(event.target.value))
                      }
                    />
                  </CampoConfiguracao>

                  {temReserva && (
                    <CampoConfiguracao>
                      Reservas por time
                      <InputConfiguracao
                        type="number"
                        min="1"
                        max="10"
                        value={reservasPorTime}
                        onChange={(event) =>
                          setReservasPorTime(Number(event.target.value))
                        }
                      />
                    </CampoConfiguracao>
                  )}
                </GradeConfiguracoes>

                <OpcaoConfiguracao>
                  <input
                    type="checkbox"
                    checked={temReserva}
                    onChange={(event) => setTemReserva(event.target.checked)}
                  />
                  Incluir reservas
                </OpcaoConfiguracao>

                <OpcaoConfiguracao>
                  <input
                    type="checkbox"
                    checked={considerarGoleiros}
                    onChange={(event) =>
                      setConsiderarGoleiros(event.target.checked)
                    }
                  />
                  Considerar goleiros no sorteio
                </OpcaoConfiguracao>
              </CartaoConfiguracaoSorteio>

              <CabecalhoJogadoresSorteio>
                <TituloDisponiveisSorteio>
                  Jogadores disponíveis
                </TituloDisponiveisSorteio>

                <ContadorSelecionadosSorteio role="status">
                  {jogadoresSelecionados.length}{' '}
                  {jogadoresSelecionados.length === 1
                    ? 'selecionado'
                    : 'selecionados'}
                </ContadorSelecionadosSorteio>
              </CabecalhoJogadoresSorteio>

              <CampoBusca
                type="search"
                aria-label="Buscar jogador pelo nome"
                placeholder="Buscar jogador..."
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />

              {jogadoresFiltrados.length === 0 && (
                <p>Nenhum jogador encontrado com esse nome.</p>
              )}

              <ListaOpcoes>
                {jogadoresFiltrados.map((jogador) => {
                  const selecionado = jogadoresSelecionados.includes(
                    jogador.id
                  );

                  return (
                    <OpcaoJogador key={jogador.id} $selecionado={selecionado}>
                      <input
                        type="checkbox"
                        checked={selecionado}
                        onChange={() => alternarSelecao(jogador.id)}
                      />

                      <div>
                        <strong>{formatarNome(jogador.name)}</strong>
                        <span>
                          {jogador.is_goalkeeper
                            ? 'Goleiro'
                            : jogador.position || 'Posição não informada'}
                        </span>
                      </div>

                      <NotaJogadorSorteio>
                        ★ {Number(jogador.overall_rating).toFixed(1)}
                      </NotaJogadorSorteio>
                    </OpcaoJogador>
                  );
                })}
              </ListaOpcoes>

              <BotaoAcaoSorteio
                type="button"
                onClick={handleSortear}
                disabled={sorteando || jogadoresSelecionados.length === 0}
              >
                {sorteando ? 'Sorteando times...' : 'Sortear times'}
              </BotaoAcaoSorteio>
            </>
          )}

          {resultadoSorteio && (
            <section>
              <TituloSelecao>Elencos</TituloSelecao>

              <ListaTimesSorteados>
                {resultadoSorteio.times.map((time, indice) => {
                  const participacoesDoTime =
                    resultadoSorteio.participacoes.filter(
                      (participacao) => participacao.team_id === time.id
                    );
                  const notasTitulares = participacoesDoTime
                    .filter((participacao) => !participacao.is_reserve)
                    .map((participacao) =>
                      jogadores.find(
                        (jogador) => jogador.id === participacao.player_id
                      )
                    )
                    .filter(Boolean)
                    .map((jogador) => Number(jogador.overall_rating))
                    .filter(Number.isFinite);

                  const mediaTime = notasTitulares.length
                    ? (
                        notasTitulares.reduce(
                          (total, nota) => total + nota,
                          0
                        ) / notasTitulares.length
                      ).toFixed(1)
                    : '—';

                  return (
                    <CartaoTimeSorteado key={time.id}>
                      <CabecalhoTimeSorteado>
                        <TituloTimeSorteado>
                          {time.name ||
                            `Time ${time.team_number ?? indice + 1}`}
                        </TituloTimeSorteado>

                        <MediaTimeSorteado>
                          ★ Média {mediaTime}
                        </MediaTimeSorteado>
                      </CabecalhoTimeSorteado>

                      <ListaJogadoresSorteados>
                        {participacoesDoTime.map((participacao) => {
                          const jogador = jogadores.find(
                            (item) => item.id === participacao.player_id
                          );

                          const tipo = participacao.is_reserve
                            ? 'Reserva'
                            : participacao.is_goalkeeper
                              ? 'Goleiro'
                              : jogador?.position || 'Linha';

                          return (
                            <JogadorSorteado key={participacao.id}>
                              <NumeroJogadorSorteado>
                                {participacao.number}
                              </NumeroJogadorSorteado>

                              <InfoJogadorSorteado>
                                <strong>
                                  {jogador
                                    ? formatarNome(jogador.name)
                                    : 'Jogador não encontrado'}
                                </strong>
                                <span>
                                  {jogador
                                    ? `Nota ${Number(jogador.overall_rating).toFixed(1)}`
                                    : 'Cadastro indisponível'}
                                </span>
                              </InfoJogadorSorteado>

                              <TipoJogadorSorteado
                                $reserva={participacao.is_reserve}
                              >
                                {tipo}
                              </TipoJogadorSorteado>
                            </JogadorSorteado>
                          );
                        })}
                      </ListaJogadoresSorteados>
                    </CartaoTimeSorteado>
                  );
                })}
              </ListaTimesSorteados>

              <AcoesResultadoSorteio>
                <BotaoSecundarioSorteio
                  type="button"
                  onClick={() => setResultadoSorteio(null)}
                >
                  Refazer sorteio
                </BotaoSecundarioSorteio>

                <BotaoAcaoSorteio
                  type="button"
                  onClick={() =>
                    navigate('/partidas', {
                      state: { draw: resultadoSorteio },
                    })
                  }
                >
                  Ir para Partidas
                </BotaoAcaoSorteio>
              </AcoesResultadoSorteio>
            </section>
          )}
        </SecaoSelecao>
      )}
    </PaginaSorteio>
  );
}
