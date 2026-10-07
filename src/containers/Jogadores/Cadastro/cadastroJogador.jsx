import { useState } from 'react';
import { useNavigate } from 'react-router';

import { api } from '../../../services/api';
import {
  PaginaJogadores,
  TituloJogadores,
  EyebrowJogadores,
  DescricaoJogadores,
} from '../styles';
import {
  LinkVoltarJogadores,
  CartaoFormularioJogador,
  CampoJogador,
  LabelJogador,
  InputJogador,
  LinhaCheckbox,
  CheckboxJogador,
  ErroCadastroJogador,
  BotaoSalvarJogador,
} from './styles';

export function CadastroJogador() {
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('');
  const [ehGoleiro, setEhGoleiro] = useState(false);
  const [nota, setNota] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [erroCadastro, setErroCadastro] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setErroCadastro('');

    if (!nome.trim() || nota === '') {
      setErroCadastro('Preencha o nome e a avaliação geral.');
      return;
    }

    setSalvando(true);

    try {
      await api.post('/players', {
        name: nome.trim(),
        position: posicao.trim() || undefined,
        is_goalkeeper: ehGoleiro,
        overall_rating: Number(nota),
      });

      navigate('/jogadores', { replace: true });
    } catch (error) {
      const erroBackend = error.response?.data?.error;

      setErroCadastro(
        erroBackend === 'A player with this name already exists'
          ? 'Já existe um jogador com esse nome.'
          : 'Não foi possível cadastrar o jogador. Confira os campos e tente novamente.'
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
      <EyebrowJogadores>NOVO INTEGRANTE</EyebrowJogadores>
      <TituloJogadores>Novo jogador</TituloJogadores>
      <DescricaoJogadores>
        Preencha os dados para incluir alguém no seu elenco.
      </DescricaoJogadores>
      <CartaoFormularioJogador onSubmit={handleSubmit}>
        <CampoJogador>
          <LabelJogador htmlFor="nome">Nome do jogador</LabelJogador>
          <InputJogador
            id="nome"
            name="name"
            type="text"
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
            type="text"
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
        <CampoJogador>
          <LabelJogador htmlFor="nota">Avaliação geral (0 a 10)</LabelJogador>
          <InputJogador
            id="nota"
            name="overall_rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={nota}
            onChange={(event) => setNota(event.target.value)}
            required
            placeholder="Ex.: 7.5"
          />
        </CampoJogador>
        {erroCadastro && (
          <ErroCadastroJogador role="alert">{erroCadastro}</ErroCadastroJogador>
        )}

        <BotaoSalvarJogador type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Cadastrar jogador'}
        </BotaoSalvarJogador>
      </CartaoFormularioJogador>
    </PaginaJogadores>
  );
}
