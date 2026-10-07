import { Trash2, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

import { api } from '../../services/api';
import {
  PaginaJogadores,
  TituloJogadores,
  EstadoVazioJogadores,
  BotaoCadastroJogador,
  ListaJogadores,
  CartaoJogador,
  CabecalhoJogadores,
  MensagemEstadoJogadores,
  MensagemErroJogadores,
  BotaoExcluirJogador,
  BotaoEditarJogador,
  EyebrowJogadores,
  DescricaoJogadores,
  ContagemJogadores,
} from './styles';

export function Jogadores() {
  const [jogadores, setJogadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroExclusao, setErroExclusao] = useState('');
  const [idExcluindo, setIdExcluindo] = useState(null);

  useEffect(() => {
    async function carregarJogadores() {
      try {
        const { data } = await api.get('/players');
        setJogadores(data);
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar os jogadores.');
      } finally {
        setCarregando(false);
      }
    }

    carregarJogadores();
  }, []);

  async function excluirJogador(jogador) {
    if (!window.confirm(`Deseja excluir ${jogador.name}?`)) return;

    setErroExclusao('');
    setIdExcluindo(jogador.id);

    try {
      await api.delete(`/players/${jogador.id}`);
      setJogadores((atuais) => atuais.filter((item) => item.id !== jogador.id));
    } catch (error) {
      setErroExclusao(
        error.response?.status === 409
          ? 'Este jogador já participou de uma partida e não pode ser excluído.'
          : 'Não foi possível excluir o jogador.'
      );
    } finally {
      setIdExcluindo(null);
    }
  }

  return (
    <PaginaJogadores>
      <CabecalhoJogadores>
        <div>
          <EyebrowJogadores>SEU ELENCO</EyebrowJogadores>
          <TituloJogadores>Jogadores</TituloJogadores>
          <DescricaoJogadores>
            Organize seu elenco para os próximos sorteios.
          </DescricaoJogadores>
          {!carregando && !erro && jogadores.length > 0 && (
            <ContagemJogadores>
              {jogadores.length}{' '}
              {jogadores.length === 1
                ? 'jogador cadastrado'
                : 'jogadores cadastrados'}
            </ContagemJogadores>
          )}
        </div>
        <BotaoCadastroJogador to="/jogadores/cadastro">
          Adicionar jogador
        </BotaoCadastroJogador>
      </CabecalhoJogadores>

      {erroExclusao && (
        <MensagemErroJogadores role="alert">
          {erroExclusao}
        </MensagemErroJogadores>
      )}
      {carregando && (
        <MensagemEstadoJogadores role="status">
          Carregando jogadores...
        </MensagemEstadoJogadores>
      )}

      {!carregando && erro && (
        <MensagemErroJogadores role="alert">{erro}</MensagemErroJogadores>
      )}

      {!carregando && !erro && jogadores.length === 0 && (
        <EstadoVazioJogadores>
          <p>Nenhum jogador cadastrado ainda.</p>
        </EstadoVazioJogadores>
      )}
      {!carregando && !erro && jogadores.length > 0 && (
        <ListaJogadores>
          {jogadores.map((jogador) => (
            <CartaoJogador key={jogador.id}>
              <div>
                <h2>{jogador.name}</h2>
                <p>{jogador.position || 'Posição não informada'}</p>
              </div>

              <div>
                <span>
                  {jogador.is_goalkeeper ? 'Goleiro' : 'Jogador de linha'}
                </span>
                <strong>
                  Nota {Number(jogador.overall_rating).toFixed(1)}
                </strong>
                <BotaoEditarJogador
                  to={`/jogadores/editar/${jogador.id}`}
                  aria-label={`Editar ${jogador.name}`}
                  title={`Editar ${jogador.name}`}
                >
                  <Pencil size={18} aria-hidden="true" />
                </BotaoEditarJogador>
                <BotaoExcluirJogador
                  type="button"
                  aria-label={
                    idExcluindo === jogador.id
                      ? `Excluindo ${jogador.name}`
                      : `Excluir ${jogador.name}`
                  }
                  title={`Excluir ${jogador.name}`}
                  onClick={() => excluirJogador(jogador)}
                  disabled={idExcluindo === jogador.id}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </BotaoExcluirJogador>
              </div>
            </CartaoJogador>
          ))}
        </ListaJogadores>
      )}
    </PaginaJogadores>
  );
}
