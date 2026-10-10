import { UsersRound, Shuffle, CalendarDays, History } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useJogadores } from '../../hooks/useJogadores';
import { usePartidas } from '../../hooks/usePartidas';
import { limparSessao, obterUsuario } from '../../services/session';
import { obterSorteioAtual } from '../../services/sorteioAtual';
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
  SecaoUltimoSorteio,
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
  const {
    partidas: matches,
    carregando: carregandoPartidas,
    erro: erroPartidas,
  } = usePartidas();

  const [usuario] = useState(obterUsuario);
  const [ultimoSorteio] = useState(obterSorteioAtual);

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

  const partidasPendentes = matches.filter(
    (partida) => partida.status === 'pending'
  ).length;

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
          <TituloResumo>Partidas aguardando início:</TituloResumo>

          <ValorResumo>
            {carregandoPartidas
              ? 'Carregando...'
              : erroPartidas
                ? 'Não foi possível carregar'
                : partidasPendentes}
          </ValorResumo>
        </CartaoPartida>
      </ResumoGrid>
      <SecaoUltimoSorteio aria-label="Último sorteio">
        <TituloSecao>Último sorteio</TituloSecao>
        <CartaoSorteioVazio>
          {ultimoSorteio ? (
            <>
              <span>
                {ultimoSorteio.times.length} times ·{' '}
                {ultimoSorteio.participacoes.length} jogadores sorteados
              </span>
              <AcaoVazia to="/partidas" state={{ draw: ultimoSorteio }}>
                Ver times e criar partida
              </AcaoVazia>
            </>
          ) : (
            <>
              <span>Nenhum sorteio disponível nesta sessão.</span>
              <AcaoVazia to="/sorteio">Fazer sorteio</AcaoVazia>
            </>
          )}
        </CartaoSorteioVazio>
      </SecaoUltimoSorteio>
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
