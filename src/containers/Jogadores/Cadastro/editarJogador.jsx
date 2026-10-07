import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { api } from '../../../services/api';
import { PaginaJogadores, TituloJogadores } from '../styles';
import {
  CartaoFormularioJogador,
  CampoJogador,
  LabelJogador,
  InputJogador,
  LinhaCheckbox,
  CheckboxJogador,
  LinkVoltarJogadores,
  BotaoSalvarJogador,
} from './styles';

export function EditarJogador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [jogador, setJogador] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('');
  const [ehGoleiro, setEhGoleiro] = useState(false);

  useEffect(() => {
    async function carregarJogador() {
      try {
        const { data } = await api.get(`/players/${id}`);
        setJogador(data);
        setNome(data.name);
        setPosicao(data.position ?? '');
        setEhGoleiro(data.is_goalkeeper);
      } catch (error) {
        setErro(
          error.response?.status === 404
            ? 'Jogador não encontrado.'
            : 'Não foi possível carregar os dados do jogador.'
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarJogador();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('O nome do jogador é obrigatório.');
      return;
    }

    setSalvando(true);

    try {
      await api.put(`/players/${id}`, {
        name: nome.trim(),
        position: posicao.trim(),
        is_goalkeeper: ehGoleiro,
      });

      navigate('/jogadores', { replace: true });
    } catch (error) {
      const erroBackend = error.response?.data?.error;

      setErro(
        erroBackend === 'A player with this name already exists'
          ? 'Já existe um jogador com esse nome.'
          : 'Não foi possível salvar as alterações.'
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <PaginaJogadores>
      <LinkVoltarJogadores to="/jogadores">
        Voltar para jogadores
      </LinkVoltarJogadores>

      <TituloJogadores>Editar jogador</TituloJogadores>

      {carregando && <p>Carregando jogador...</p>}
      {erro && <p role="alert">{erro}</p>}
      {jogador && (
        <CartaoFormularioJogador onSubmit={handleSubmit}>
          <CampoJogador>
            <LabelJogador htmlFor="nome">Nome do jogador</LabelJogador>
            <InputJogador
              id="nome"
              name="name"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              required
            />
          </CampoJogador>

          <CampoJogador>
            <LabelJogador htmlFor="posicao">Posição</LabelJogador>
            <InputJogador
              id="posicao"
              name="position"
              value={posicao}
              onChange={(event) => setPosicao(event.target.value)}
              placeholder="Ex.: Ala"
            />
          </CampoJogador>

          <LinhaCheckbox>
            <CheckboxJogador
              type="checkbox"
              name="is_goalkeeper"
              checked={ehGoleiro}
              onChange={(event) => setEhGoleiro(event.target.checked)}
            />
            É goleiro
          </LinhaCheckbox>

          <BotaoSalvarJogador type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </BotaoSalvarJogador>
        </CartaoFormularioJogador>
      )}
    </PaginaJogadores>
  );
}
