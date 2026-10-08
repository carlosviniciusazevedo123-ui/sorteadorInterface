import { useState } from 'react';
import { useNavigate } from 'react-router';

import { api } from '../../../services/api';
import { mensagemErroJogador } from '../../../utils/mensagemErroJogador';
import {
  PaginaJogadores,
  TituloJogadores,
  EyebrowJogadores,
  DescricaoJogadores,
} from '../styles';
import { FormularioJogador } from './FormularioJogador';
import { LinkVoltarJogadores } from './styles';

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
      setErroCadastro(
        mensagemErroJogador(
          error,
          'Não foi possível cadastrar o jogador. Confira os campos e tente novamente.'
        )
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
      <FormularioJogador
        nome={nome}
        onNomeChange={setNome}
        posicao={posicao}
        onPosicaoChange={setPosicao}
        ehGoleiro={ehGoleiro}
        onEhGoleiroChange={setEhGoleiro}
        nota={nota}
        onNotaChange={setNota}
        exibirNota
        erro={erroCadastro}
        salvando={salvando}
        textoBotao="Cadastrar jogador"
        onSubmit={handleSubmit}
      />
    </PaginaJogadores>
  );
}
