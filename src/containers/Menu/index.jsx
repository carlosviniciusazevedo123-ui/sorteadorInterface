import { UsersRound, Shuffle, CalendarDays, History } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useJogadores } from '../../hooks/useJogadores';
import { useUltimoJogo } from '../../hooks/useUltimoJogo';
import { useUltimoSorteio } from '../../hooks/useUltimoSorteio';
import { limparSessao, obterUsuario } from '../../services/session';
import {
  Cabecalho,
  PerfilUsuario,
  AvatarUsuario,
  InformacoesUsuario,
  Saudacao,
  NomePainel,
  Apresentacao,
  Eyebrow,
  Titulo,
  Destaque,
  Subtitulo,
  BotaoSair,
  CartaoResumo,
  ValorResumo,
  TituloResumo,
  Pagina,
  ResumoGrid,
  AcaoLink,
  SecaoAcoes,
  TituloSecao,
  AcoesGrid,
  CartaoPartida,
  CartaoSorteioVazio,
  SecaoUltimoJogo,
  PlacarJogo,
  ConfrontoJogo,
  InformacoesJogo,
  StatusJogo,
  NotaResumo,
  ElencosUltimoJogo,
  TimeUltimoJogo,
  ListaJogadoresTime,
  CabecalhoUltimoJogo,
  AcaoPrincipal,
  IconeAcao,
  TextoAcao,
  TituloAcao,
  DescricaoAcao,
  AcaoVazia,
} from './styles';

export function Menu() {
  const {
    jogadores: players,
    carregando: carregandoJogadores,
    erro: erroJogadores,
  } = useJogadores();
  const { ultimoJogo, placar, carregando, erro } = useUltimoJogo();
  const {
    sorteio: ultimoSorteio,
    carregando: carregandoSorteio,
    erro: erroSorteio,
  } = useUltimoSorteio();

  const [usuario] = useState(obterUsuario);

  const primeiroNome = usuario?.name?.trim().split(/\s+/)[0] || 'por aí';
  const primeiroNomeFormatado =
    primeiroNome.charAt(0).toLocaleUpperCase('pt-BR') + primeiroNome.slice(1);
  const iniciais =
    usuario?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase() || 'VS';

  const navigate = useNavigate();

  function handleLogout() {
    limparSessao();
    navigate('/login', { replace: true });
  }

  const jogo = ultimoJogo?.jogo;
  const times = ultimoJogo?.partida.teams || [];
  const timeA =
    times.find((time) => time.id === jogo?.team_a_id) || jogo?.teamA;
  const timeB =
    times.find((time) => time.id === jogo?.team_b_id) || jogo?.teamB;
  const nomeTime = (time) =>
    time?.name ||
    (time?.team_number != null
      ? `Time ${time.team_number}`
      : 'Time não informado');
  const dataJogo =
    jogo &&
    new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(jogo.finished_at));

  return (
    <Pagina>
      <Cabecalho>
        <PerfilUsuario>
          <AvatarUsuario aria-hidden="true">{iniciais}</AvatarUsuario>
          <InformacoesUsuario>
            <Saudacao>Olá, {primeiroNomeFormatado}!</Saudacao>
            <NomePainel>Seu espaço de sorteios</NomePainel>
          </InformacoesUsuario>
        </PerfilUsuario>

        <BotaoSair type="button" onClick={handleLogout}>
          Sair
        </BotaoSair>
      </Cabecalho>

      <Apresentacao>
        <Eyebrow>BOM TER VOCÊ POR AQUI</Eyebrow>
        <Titulo>
          Vamos fazer a sorte <Destaque>girar?</Destaque>
        </Titulo>
        <Subtitulo>Seus jogadores e partidas, tudo no mesmo lugar.</Subtitulo>
      </Apresentacao>

      <ResumoGrid>
        <CartaoResumo>
          <TituloResumo>Jogadores cadastrados:</TituloResumo>

          <ValorResumo>
            {carregandoJogadores
              ? 'Carregando...'
              : erroJogadores
                ? 'Não foi possível carregar'
                : players.length}
          </ValorResumo>
        </CartaoResumo>
        <CartaoPartida>
          <TituloResumo>Último sorteio:</TituloResumo>
          <ValorResumo>
            {carregandoSorteio
              ? 'Carregando...'
              : erroSorteio
                ? 'Indisponível'
                : ultimoSorteio
                  ? `${ultimoSorteio.times.length} times`
                  : 'Nenhum'}
          </ValorResumo>
          <NotaResumo>
            {erroSorteio ? (
              <span role="alert">{erroSorteio}</span>
            ) : carregandoSorteio ? (
              'Buscando último sorteio'
            ) : ultimoSorteio ? (
              'Último sorteio realizado'
            ) : (
              'Nenhum sorteio realizado'
            )}
          </NotaResumo>
        </CartaoPartida>
      </ResumoGrid>
      <SecaoUltimoJogo aria-label="Último jogo">
        <TituloSecao>Último jogo</TituloSecao>
        <CartaoSorteioVazio>
          {carregando ? (
            <span role="status">Carregando último jogo...</span>
          ) : erro ? (
            <span role="alert">{erro}</span>
          ) : jogo ? (
            <InformacoesJogo>
              <CabecalhoUltimoJogo>
                <StatusJogo>Finalizado</StatusJogo>
                <time dateTime={jogo.finished_at}>{dataJogo}</time>
              </CabecalhoUltimoJogo>
              <ConfrontoJogo>
                <strong className="time-a">{nomeTime(timeA)}</strong>
                <PlacarJogo
                  aria-label={
                    placar
                      ? `Placar: ${placar.a} a ${placar.b}`
                      : 'Placar indisponível'
                  }
                >
                  {placar ? `${placar.a} × ${placar.b}` : '— × —'}
                </PlacarJogo>
                <strong className="time-b">{nomeTime(timeB)}</strong>
              </ConfrontoJogo>
              <ElencosUltimoJogo>
                {[timeA, timeB].map((time, indice) => (
                  <TimeUltimoJogo
                    key={time?.id || indice}
                    $segundo={indice === 1}
                  >
                    {time?.players?.length ? (
                      <ListaJogadoresTime
                        aria-label={`Jogadores do ${nomeTime(time)}`}
                      >
                        {time.players.map((jogador, indiceJogador) => (
                          <li
                            key={
                              jogador.id || jogador.player_id || indiceJogador
                            }
                          >
                            <strong>
                              {jogador.player_name ||
                                jogador.name ||
                                'Nome não informado'}
                            </strong>
                          </li>
                        ))}
                      </ListaJogadoresTime>
                    ) : (
                      <p>Jogadores não informados.</p>
                    )}
                  </TimeUltimoJogo>
                ))}
              </ElencosUltimoJogo>
              <AcaoVazia to={`/jogo/${ultimoJogo.partida.id}/${jogo.id}`}>
                Ver detalhes do jogo
              </AcaoVazia>
            </InformacoesJogo>
          ) : (
            <>
              <span>Nenhum jogo finalizado ainda.</span>
              <AcaoVazia to="/partidas">Ver partidas</AcaoVazia>
            </>
          )}
        </CartaoSorteioVazio>
      </SecaoUltimoJogo>
      <SecaoAcoes>
        <TituloSecao>Ações rápidas</TituloSecao>
        <AcoesGrid>
          <AcaoLink to="/jogadores">
            <IconeAcao>
              <UsersRound size={18} aria-hidden="true" />
            </IconeAcao>
            <TextoAcao>
              <TituloAcao>Gerenciar jogadores</TituloAcao>
              <DescricaoAcao>Gerencie seu elenco</DescricaoAcao>
            </TextoAcao>
          </AcaoLink>
          <AcaoPrincipal to="/sorteio">
            <IconeAcao>
              <Shuffle size={18} aria-hidden="true" />
            </IconeAcao>
            <TextoAcao>
              <TituloAcao>Novo sorteio</TituloAcao>
              <DescricaoAcao>Times equilibrados</DescricaoAcao>
            </TextoAcao>
          </AcaoPrincipal>
          <AcaoLink to="/partidas">
            <IconeAcao>
              <CalendarDays size={18} aria-hidden="true" />
            </IconeAcao>
            <TextoAcao>
              <TituloAcao>Partidas</TituloAcao>
              <DescricaoAcao>Organize uma rodada</DescricaoAcao>
            </TextoAcao>
          </AcaoLink>

          <AcaoLink to="/historico">
            <IconeAcao>
              <History size={18} aria-hidden="true" />
            </IconeAcao>
            <TextoAcao>
              <TituloAcao>Histórico</TituloAcao>
              <DescricaoAcao>Consulte sorteios</DescricaoAcao>
            </TextoAcao>
          </AcaoLink>
        </AcoesGrid>
      </SecaoAcoes>
    </Pagina>
  );
}
