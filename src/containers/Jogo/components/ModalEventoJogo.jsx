import {
  BotaoAcaoJogo,
  BotaoEventoJogo,
  CampoEventoJogo,
  FundoModalEvento,
  ModalEvento,
} from '../styles';

function tituloDoEvento(tipo) {
  const titulos = {
    goal: 'Registrar gol',
    assist: 'Registrar assistência',
    substitution: 'Registrar substituição',
    card: 'Registrar cartão',
  };

  return titulos[tipo] || 'Registrar evento';
}

export function ModalEventoJogo({
  tipo,
  jogo,
  erro,
  timeId,
  onTimeChange,
  jogadorId,
  onJogadorChange,
  golContra,
  onGolContraChange,
  tipoCartao,
  onTipoCartaoChange,
  jogadorSaiId,
  onJogadorSaiChange,
  jogadorEntraId,
  onJogadorEntraChange,
  jogadoresDoTime,
  salvando,
  onSalvar,
  onFechar,
}) {
  if (!tipo) return null;

  const timeDoJogadorId =
    tipo === 'goal' && golContra
      ? timeId === jogo.teamA?.id
        ? jogo.teamB?.id
        : jogo.teamA?.id
      : timeId;

  return (
    <FundoModalEvento
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !salvando) onFechar();
      }}
    >
      <ModalEvento
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-evento"
      >
        <h2 id="titulo-modal-evento">{tituloDoEvento(tipo)}</h2>

        {erro && <p role="alert">{erro}</p>}

        {tipo !== 'goal' && (
          <CampoEventoJogo>
            Time do jogador
            <select value={timeId} onChange={onTimeChange}>
              <option value={jogo.teamA?.id}>
                {jogo.teamA?.name || 'Time A'}
              </option>
              <option value={jogo.teamB?.id}>
                {jogo.teamB?.name || 'Time B'}
              </option>
            </select>
          </CampoEventoJogo>
        )}

        {tipo === 'goal' && (
          <>
            <CampoEventoJogo>
              Gol para
              <select value={timeId} onChange={onTimeChange}>
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
                onChange={onGolContraChange}
              />{' '}
              Gol contra
            </label>
          </>
        )}

        {tipo === 'card' && (
          <CampoEventoJogo>
            Tipo de cartão
            <select value={tipoCartao} onChange={onTipoCartaoChange}>
              <option value="yellow_card">Amarelo</option>
              <option value="red_card">Vermelho</option>
            </select>
          </CampoEventoJogo>
        )}

        {tipo === 'substitution' ? (
          <>
            <CampoEventoJogo>
              Sai (jogador ativo)
              <select value={jogadorSaiId} onChange={onJogadorSaiChange}>
                <option value="">Selecione quem sai</option>
                {jogadoresDoTime(timeId)
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
              <select value={jogadorEntraId} onChange={onJogadorEntraChange}>
                <option value="">Selecione quem entra</option>
                {jogadoresDoTime(timeId)
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
            <select value={jogadorId} onChange={onJogadorChange}>
              <option value="">Selecione um jogador</option>
              {jogadoresDoTime(timeDoJogadorId).map((jogador) => (
                <option key={jogador.id} value={jogador.player_id}>
                  {jogador.player_name || jogador.name}
                </option>
              ))}
            </select>
          </CampoEventoJogo>
        )}

        <BotaoAcaoJogo type="button" onClick={onSalvar} disabled={salvando}>
          {salvando ? 'Salvando evento...' : 'Salvar evento'}
        </BotaoAcaoJogo>
        <BotaoEventoJogo type="button" onClick={onFechar} disabled={salvando}>
          Cancelar
        </BotaoEventoJogo>
      </ModalEvento>
    </FundoModalEvento>
  );
}
