import { useFocoModal } from '../../../hooks/useFocoModal';
import {
  BotaoAcaoJogo,
  ConfrontoJogo,
  DetalhesJogo,
  FundoModalResultado,
  LinkAvaliacaoJogo,
  ModalResultado,
  StatusJogo,
  ValorPlacarJogo,
} from '../styles';

export function ModalResultadoJogo({
  jogo,
  placar,
  erro,
  erroEventos,
  onRecarregarEventos,
  tempoDecorrido,
  linkAvaliacao,
  expiraAvaliacao,
  linkCopiado,
  gerandoLink,
  onGerarLink,
  onCopiarLink,
  onCriarOutraPartida,
  onFechar,
}) {
  const refModal = useFocoModal(jogo?.status === 'finished', onFechar);
  if (jogo?.status !== 'finished') return null;

  const horarioExpiracao = expiraAvaliacao
    ? new Date(expiraAvaliacao).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <FundoModalResultado
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onFechar();
      }}
    >
      <ModalResultado
        ref={refModal}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-resultado-jogo"
      >
        <StatusJogo>JOGO ENCERRADO</StatusJogo>
        <h2 id="titulo-resultado-jogo">Resultado do jogo</h2>
        {erro && <p role="alert">{erro}</p>}
        <ConfrontoJogo>
          {jogo.teamA?.name || 'Time A'} x {jogo.teamB?.name || 'Time B'}
        </ConfrontoJogo>
        <ValorPlacarJogo aria-label="Placar final">
          {placar?.a ?? '—'} x {placar?.b ?? '—'}
        </ValorPlacarJogo>
        {!placar && !erroEventos && <p role="status">Carregando placar...</p>}
        {erroEventos && (
          <>
            <p role="alert">{erroEventos}</p>
            <BotaoAcaoJogo type="button" onClick={onRecarregarEventos}>
              Tentar carregar eventos novamente
            </BotaoAcaoJogo>
          </>
        )}
        <DetalhesJogo>Tempo de jogo: {tempoDecorrido}</DetalhesJogo>
        <p>
          {jogo.winner?.name
            ? `Vencedor: ${jogo.winner.name}`
            : 'Jogo finalizado'}
        </p>

        {!linkAvaliacao ? (
          <BotaoAcaoJogo
            type="button"
            onClick={onGerarLink}
            disabled={gerandoLink}
          >
            {gerandoLink ? 'Gerando link...' : 'Gerar link de avaliação'}
          </BotaoAcaoJogo>
        ) : (
          <>
            <LinkAvaliacaoJogo aria-label="Link para avaliação">
              {linkAvaliacao}
            </LinkAvaliacaoJogo>
            {horarioExpiracao && (
              <DetalhesJogo>Link válido até {horarioExpiracao}</DetalhesJogo>
            )}
            <BotaoAcaoJogo type="button" onClick={onCopiarLink}>
              {linkCopiado ? 'Link copiado' : 'Copiar link'}
            </BotaoAcaoJogo>
          </>
        )}
        <BotaoAcaoJogo type="button" onClick={onCriarOutraPartida}>
          Criar outra partida
        </BotaoAcaoJogo>
        <BotaoAcaoJogo type="button" onClick={onFechar}>
          Fechar resultado
        </BotaoAcaoJogo>
      </ModalResultado>
    </FundoModalResultado>
  );
}
