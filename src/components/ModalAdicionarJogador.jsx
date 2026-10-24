import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';

import { api } from '../services/api';
import { formatarNome } from '../utils/formatarNome';
import { obterVagaInclusao } from '../utils/vagaInclusao';
import { mensagemDoErro } from '../utils/mensagemDoErro';
import { useFocoModal } from '../hooks/useFocoModal';
import {
  FundoModalInclusao,
  CaixaModalInclusao,
  CabecalhoModalInclusao,
  BotaoFecharModalInclusao,
  CampoModalInclusao,
  BotoesModalInclusao,
  BotaoModalSecundario,
  BotaoModalPrimario,
  MensagemModalInclusao,
} from './ModalAdicionarJogador.styles';

export function ModalAdicionarJogador({
  sorteio,
  time,
  jogadores,
  onClose,
  onSuccess,
}) {
  const [playerId, setPlayerId] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const envio = useRef(false);
  const configuracao = sorteio.configuracao;
  const focoModal = useFocoModal(true, onClose, !enviando);
  const idsParticipantes = useMemo(
    () => new Set(sorteio.participacoes.map((item) => item.player_id)),
    [sorteio.participacoes]
  );
  const disponiveis = jogadores.filter(
    (jogador) => !idsParticipantes.has(jogador.id)
  );
  const selecionado = disponiveis.find((jogador) => jogador.id === playerId);
  const vaga = selecionado
    ? obterVagaInclusao(time, sorteio.participacoes, selecionado, configuracao)
    : null;

  async function adicionar() {
    if (!selecionado || !vaga?.disponivel || envio.current) return;
    envio.current = true;
    setEnviando(true);
    setErro('');
    try {
      await api.post(`/draws/${sorteio.drawId}/players`, {
        team_id: time.id,
        player_id: selecionado.id,
      });
      await onSuccess(selecionado);
    } catch (error) {
      const mensagemApi =
        error.response?.data?.error ?? error.response?.data?.message;
      const mensagem =
        typeof mensagemApi === 'string'
          ? mensagemApi
          : Array.isArray(mensagemApi)
            ? mensagemApi.join(' ')
            : '';
      setErro(
        mensagem ||
          error.message ||
          mensagemDoErro(
            error,
            'Não foi possível adicionar o jogador. Verifique sua conexão e tente novamente.'
          )
      );
    } finally {
      envio.current = false;
      setEnviando(false);
    }
  }

  return (
    <FundoModalInclusao
      onMouseDown={(event) =>
        event.target === event.currentTarget && !enviando && onClose()
      }
    >
      <CaixaModalInclusao
        ref={focoModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-adicionar-jogador"
        tabIndex={-1}
      >
        <CabecalhoModalInclusao>
          <div>
            <h2 id="titulo-adicionar-jogador">Adicionar jogador</h2>
            <p>{time.name || `Time ${time.team_number}`}</p>
          </div>
          <BotaoFecharModalInclusao
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            disabled={enviando}
          >
            <X size={20} />
          </BotaoFecharModalInclusao>
        </CabecalhoModalInclusao>
        <label htmlFor="jogador-disponivel">Jogador disponível</label>
        <CampoModalInclusao
          id="jogador-disponivel"
          value={playerId}
          onChange={(event) => setPlayerId(event.target.value)}
        >
          <option value="">Selecione um jogador</option>
          {disponiveis.map((jogador) => {
            const vagaJogador = obterVagaInclusao(
              time,
              sorteio.participacoes,
              jogador,
              configuracao
            );
            return (
              <option
                key={jogador.id}
                value={jogador.id}
                disabled={!vagaJogador.disponivel}
              >
                {formatarNome(jogador.name)}
                {vagaJogador.disponivel
                  ? ` — ${vagaJogador.descricao}`
                  : ` — ${vagaJogador.motivo}`}
              </option>
            );
          })}
        </CampoModalInclusao>
        {vaga && (
          <MensagemModalInclusao role={vaga.disponivel ? 'status' : 'alert'}>
            {vaga.disponivel ? `${vaga.descricao} será ocupada.` : vaga.motivo}
          </MensagemModalInclusao>
        )}
        {!disponiveis.length && (
          <MensagemModalInclusao role="status">
            Todos os jogadores cadastrados já participam deste sorteio.
          </MensagemModalInclusao>
        )}
        {erro && (
          <MensagemModalInclusao role="alert">{erro}</MensagemModalInclusao>
        )}
        <BotoesModalInclusao>
          <BotaoModalSecundario
            type="button"
            onClick={onClose}
            disabled={enviando}
          >
            Cancelar
          </BotaoModalSecundario>
          <BotaoModalPrimario
            type="button"
            onClick={adicionar}
            disabled={enviando || !vaga?.disponivel}
          >
            {enviando ? 'Adicionando...' : 'Adicionar jogador'}
          </BotaoModalPrimario>
        </BotoesModalInclusao>
      </CaixaModalInclusao>
    </FundoModalInclusao>
  );
}
