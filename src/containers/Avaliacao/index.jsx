import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { api } from '../../services/api';
import {
  PaginaAvaliacao,
  CartaoAvaliacao,
  BotaoEnviarAvaliacao,
  MensagemAvaliacao,
  CampoNomeAvaliacao,
  ListaNotasAvaliacao,
  LinhaNotaAvaliacao,
} from './styles';

const criterios = [
  ['attack', 'Ataque'],
  ['defense', 'Defesa'],
  ['passing', 'Passe'],
  ['finishing', 'Finalização'],
  ['speed', 'Velocidade'],
  ['decision_making', 'Tomada de decisão'],
];

function mensagemDoErro(error, padrao) {
  const mensagem = error.response?.data?.error;

  return Array.isArray(mensagem)
    ? mensagem.join(' ')
    : typeof mensagem === 'string'
      ? mensagem
      : padrao;
}

function notasIniciais() {
  return Object.fromEntries(criterios.map(([campo]) => [campo, 5]));
}

export function Avaliacao() {
  const { token } = useParams();
  const [carregando, setCarregando] = useState(true);
  const [linkValidado, setLinkValidado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [expiraEm, setExpiraEm] = useState('');
  const [nome, setNome] = useState('');
  const [sessaoToken, setSessaoToken] = useState('');
  const [jogadores, setJogadores] = useState([]);
  const [indiceJogador, setIndiceJogador] = useState(0);
  const [notas, setNotas] = useState(notasIniciais);
  const [concluida, setConcluida] = useState(false);

  useEffect(() => {
    async function validarLink() {
      try {
        const { data } = await api.get(`/evaluations/${token}`);
        setExpiraEm(data.expires_at || '');
        setLinkValidado(true);
      } catch (error) {
        setErro(mensagemDoErro(error, 'Este link de avaliação é inválido ou expirou.'));
      } finally {
        setCarregando(false);
      }
    }

    validarLink();
  }, [token]);

  const jogadorAtual = jogadores[indiceJogador];
  const horarioExpiracao = useMemo(() => {
    if (!expiraEm) return '';
    return new Date(expiraEm).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [expiraEm]);

  async function handleIdentificar(event) {
    event.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      const { data } = await api.post(`/evaluations/${token}/player`, {
        name: nome.trim(),
      });

      setSessaoToken(data.session_token);
      setJogadores(data.players || []);
      setIndiceJogador(0);
      setNotas(notasIniciais());
      if (!data.players?.length) setConcluida(true);
    } catch (error) {
      setErro(mensagemDoErro(error, 'Não foi possível identificar você nesta partida.'));
    } finally {
      setEnviando(false);
    }
  }

  async function handleEnviarAvaliacao(event) {
    event.preventDefault();
    if (!jogadorAtual) return;

    setErro('');
    setEnviando(true);

    try {
      await api.post(`/evaluations/${sessaoToken}`, {
        evaluated_player_id: jogadorAtual.id,
        ...notas,
      });

      if (indiceJogador + 1 >= jogadores.length) {
        setConcluida(true);
      } else {
        setIndiceJogador((indice) => indice + 1);
        setNotas(notasIniciais());
      }
    } catch (error) {
      setErro(mensagemDoErro(error, 'Não foi possível salvar esta avaliação.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <PaginaAvaliacao>
      <p>AVALIAÇÃO DA PARTIDA</p>
      <h1>Avalie seus companheiros</h1>
      {horarioExpiracao && (
        <span>Este link fica disponível até {horarioExpiracao}.</span>
      )}

      {carregando && <MensagemAvaliacao role="status">Validando link...</MensagemAvaliacao>}
      {erro && <MensagemAvaliacao $erro role="alert">{erro}</MensagemAvaliacao>}

      {!carregando && linkValidado && !sessaoToken && (
        <CartaoAvaliacao as="form" onSubmit={handleIdentificar}>
          <h2>Identifique-se</h2>
          <p>Informe seu nome exatamente como está no elenco da partida.</p>
          <CampoNomeAvaliacao
            aria-label="Seu nome"
            placeholder="Digite seu nome"
            autoComplete="name"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />
          <BotaoEnviarAvaliacao type="submit" disabled={enviando || !nome.trim()}>
            {enviando ? 'Verificando...' : 'Continuar'}
          </BotaoEnviarAvaliacao>
        </CartaoAvaliacao>
      )}

      {linkValidado && sessaoToken && concluida && (
        <MensagemAvaliacao>
          Obrigado! Suas avaliações foram enviadas.
        </MensagemAvaliacao>
      )}

      {linkValidado && sessaoToken && !concluida && jogadorAtual && (
        <CartaoAvaliacao as="form" onSubmit={handleEnviarAvaliacao}>
          <h2>{jogadorAtual.name}</h2>
          <p>
            Avaliando {indiceJogador + 1} de {jogadores.length}
          </p>

          <ListaNotasAvaliacao>
            {criterios.map(([campo, rotulo]) => (
              <LinhaNotaAvaliacao key={campo}>
                <label htmlFor={`nota-${campo}`}>
                  <span>{rotulo}</span>
                  <strong>{Number(notas[campo]).toFixed(1)}</strong>
                </label>
                <input
                  id={`nota-${campo}`}
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={notas[campo]}
                  onChange={(event) =>
                    setNotas((atuais) => ({ ...atuais, [campo]: Number(event.target.value) }))
                  }
                />
              </LinhaNotaAvaliacao>
            ))}
          </ListaNotasAvaliacao>

          <BotaoEnviarAvaliacao type="submit" disabled={enviando}>
            {enviando
              ? 'Salvando...'
              : indiceJogador + 1 === jogadores.length
                ? 'Enviar avaliação'
                : 'Salvar e continuar'}
          </BotaoEnviarAvaliacao>
        </CartaoAvaliacao>
      )}
    </PaginaAvaliacao>
  );
}
