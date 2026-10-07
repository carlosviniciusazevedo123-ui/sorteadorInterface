import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { api } from '../../services/api';
import {
  PaginaJogadores as PaginaPartidas,
  EyebrowJogadores,
  TituloJogadores,
  DescricaoJogadores,
} from '../Jogadores/styles';
import {
  CartaoCriacaoPartida,
  BotaoCriarPartida,
  CartaoTimePartida,
  ListaJogadoresPartida,
  ItemJogadorPartida,
  MensagemEstadoPartida,
  MensagemErroPartida,
  ListaTimesPartida,
  CampoConfiguracaoJogo,
  SelecaoConfiguracaoJogo,
  EntradaDuracaoJogo,
} from './styles';

const CHAVE_DRAW_ATUAL = 'sorteador.drawAtual';

function formatarNome(nome = '') {
  return nome
    .trim()
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s'-])\p{L}/gu, (parte) => parte.toLocaleUpperCase('pt-BR'));
}

function mensagemDoErro(error, padrao) {
  const mensagem = error.response?.data?.error;

  return Array.isArray(mensagem)
    ? mensagem.join(' ')
    : typeof mensagem === 'string'
      ? mensagem
      : padrao;
}

function recuperarDraw() {
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE_DRAW_ATUAL) || 'null');
  } catch {
    return null;
  }
}

export function Partidas() {
  const location = useLocation();
  const navigate = useNavigate();
  const draw = location.state?.draw || recuperarDraw();
  const drawId = location.state?.drawId || draw?.drawId;
  const timesSorteados = location.state?.times || draw?.times || [];
  const participacoes =
    location.state?.participacoes || draw?.participacoes || [];

  const [jogadores, setJogadores] = useState([]);
  const [carregandoJogadores, setCarregandoJogadores] = useState(true);
  const [timeAId, setTimeAId] = useState('');
  const [timeBId, setTimeBId] = useState('');
  const [duracaoJogo, setDuracaoJogo] = useState(10);
  const [criandoPartida, setCriandoPartida] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarJogadores() {
      try {
        const { data } = await api.get('/players');
        setJogadores(data);
      } catch (error) {
        setErro(
          mensagemDoErro(error, 'Não foi possível carregar os jogadores.')
        );
      } finally {
        setCarregandoJogadores(false);
      }
    }

    carregarJogadores();
  }, []);

  useEffect(() => {
    setTimeAId('');
    setTimeBId('');
  }, [drawId]);

  const jogadoresPorId = useMemo(
    () => new Map(jogadores.map((jogador) => [jogador.id, jogador])),
    [jogadores]
  );

  function nomeDoTime(time, indice) {
    return time.name || `Time ${time.team_number ?? indice + 1}`;
  }

  async function handleCriarPartida() {
    if (!drawId) {
      setErro('Faça um sorteio antes de criar a partida.');
      return;
    }

    if (!timeAId || !timeBId) {
      setErro('Selecione os dois times que vão se enfrentar.');
      return;
    }

    if (timeAId === timeBId) {
      setErro('Escolha dois times diferentes.');
      return;
    }

    if (!Number.isInteger(Number(duracaoJogo)) || Number(duracaoJogo) < 1) {
      setErro('Informe uma duração válida em minutos.');
      return;
    }

    setErro('');
    setCriandoPartida(true);

    try {
      const { data } = await api.post('/matches', {
        draw_id: drawId,
        draw_team_a_id: timeAId,
        draw_team_b_id: timeBId,
        round: 1,
        duration: Number(duracaoJogo),
      });

      const partida = data.match ?? data;
      const jogo = partida.games?.[0] ?? data.game;

      if (!partida.id || !jogo?.id) {
        setErro('A resposta não trouxe os dados da partida e do jogo.');
        return;
      }

      navigate(`/jogo/${partida.id}/${jogo.id}`, {
        state: { partida, jogo },
      });
    } catch (error) {
      console.error('Erro ao criar partida:', error.response?.data ?? error);
      setErro(mensagemDoErro(error, 'Não foi possível criar a partida.'));
    } finally {
      setCriandoPartida(false);
    }
  }

  return (
    <PaginaPartidas>
      <EyebrowJogadores>PRÓXIMO CONFRONTO</EyebrowJogadores>
      <TituloJogadores>Partidas</TituloJogadores>
      <DescricaoJogadores>
        Escolha dois times do sorteio para criar uma partida.
      </DescricaoJogadores>

      {erro && <MensagemErroPartida role="alert">{erro}</MensagemErroPartida>}
      {carregandoJogadores && (
        <MensagemEstadoPartida role="status">
          Carregando jogadores...
        </MensagemEstadoPartida>
      )}

      {!drawId && !carregandoJogadores && (
        <CartaoCriacaoPartida>
          <h2>Nenhum sorteio disponível</h2>
          <p>Faça um sorteio para escolher os times deste confronto.</p>
          <BotaoCriarPartida type="button" onClick={() => navigate('/sorteio')}>
            Ir para Sorteio
          </BotaoCriarPartida>
        </CartaoCriacaoPartida>
      )}

      {drawId && !carregandoJogadores && (
        <>
          <CartaoCriacaoPartida>
            <h2>Escolha os times</h2>
            <p>
              Os times e jogadores serão copiados do sorteio para esta partida.
            </p>

            <CampoConfiguracaoJogo>
              Time A
              <SelecaoConfiguracaoJogo
                value={timeAId}
                onChange={(event) => setTimeAId(event.target.value)}
              >
                <option value="">Selecione o primeiro time</option>
                {timesSorteados.map((time, indice) => (
                  <option key={time.id} value={time.id}>
                    {nomeDoTime(time, indice)}
                  </option>
                ))}
              </SelecaoConfiguracaoJogo>
            </CampoConfiguracaoJogo>

            <CampoConfiguracaoJogo>
              Time B
              <SelecaoConfiguracaoJogo
                value={timeBId}
                onChange={(event) => setTimeBId(event.target.value)}
              >
                <option value="">Selecione o segundo time</option>
                {timesSorteados.map((time, indice) => (
                  <option
                    key={time.id}
                    value={time.id}
                    disabled={time.id === timeAId}
                  >
                    {nomeDoTime(time, indice)}
                  </option>
                ))}
              </SelecaoConfiguracaoJogo>
            </CampoConfiguracaoJogo>

            <CampoConfiguracaoJogo>
              Duração do jogo (minutos)
              <EntradaDuracaoJogo
                type="number"
                min="1"
                value={duracaoJogo}
                onChange={(event) => setDuracaoJogo(Number(event.target.value))}
              />
            </CampoConfiguracaoJogo>

            <BotaoCriarPartida
              type="button"
              onClick={handleCriarPartida}
              disabled={criandoPartida || !timeAId || !timeBId}
            >
              {criandoPartida ? 'Criando partida...' : 'Criar partida'}
            </BotaoCriarPartida>
          </CartaoCriacaoPartida>

          <section>
            <h2>Times do sorteio</h2>
            <ListaTimesPartida>
              {timesSorteados.map((time, indice) => {
                const jogadoresDoTime = participacoes.filter(
                  (participacao) => participacao.team_id === time.id
                );

                return (
                  <CartaoTimePartida key={time.id}>
                    <h3>{nomeDoTime(time, indice)}</h3>
                    <ListaJogadoresPartida>
                      {jogadoresDoTime.map((participacao) => {
                        const jogador = jogadoresPorId.get(
                          participacao.player_id
                        );
                        return (
                          <ItemJogadorPartida key={participacao.id}>
                            <span>
                              {formatarNome(jogador?.name || 'Jogador')}
                              {participacao.is_reserve ? ' · Reserva' : ''}
                              {participacao.is_goalkeeper ? ' · Goleiro' : ''}
                            </span>
                            <span>Nº {participacao.number}</span>
                          </ItemJogadorPartida>
                        );
                      })}
                    </ListaJogadoresPartida>
                  </CartaoTimePartida>
                );
              })}
            </ListaTimesPartida>
          </section>
        </>
      )}
    </PaginaPartidas>
  );
}
