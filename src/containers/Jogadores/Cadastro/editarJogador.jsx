import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

import { api } from '../../../services/api';
import { mensagemErroJogador } from '../../../utils/mensagemErroJogador';
import { PaginaJogadores, TituloJogadores } from '../styles';
import { FormularioJogador } from './FormularioJogador';
import { LinkVoltarJogadores } from './styles';

export function EditarJogador() {
  const { id } = useParams();
  return <FormularioEdicao key={id} id={id} />;
}

function FormularioEdicao({ id }) {
  const ativo = useRef(true);
  const navigate = useNavigate();
  const [salvando, setSalvando] = useState(false);
  const [jogador, setJogador] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [nome, setNome] = useState('');
  const [posicao, setPosicao] = useState('');
  const [ehGoleiro, setEhGoleiro] = useState(false);

  useEffect(() => {
    ativo.current = true;
    const controller = new AbortController();
    async function carregarJogador() {
      try {
        const { data } = await api.get(`/players/${id}`, {
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        setJogador(data);
        setNome(data.name);
        setPosicao(data.position ?? '');
        setEhGoleiro(data.is_goalkeeper);
      } catch (error) {
        if (controller.signal.aborted) return;
        setErro(
          error.response?.status === 404
            ? 'Jogador não encontrado.'
            : 'Não foi possível carregar os dados do jogador.'
        );
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }

    carregarJogador();
    return () => {
      ativo.current = false;
      controller.abort();
    };
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

      if (ativo.current) navigate('/jogadores', { replace: true });
    } catch (error) {
      setErro(
        mensagemErroJogador(error, 'Não foi possível salvar as alterações.')
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
      {erro && !jogador && <p role="alert">{erro}</p>}
      {jogador && (
        <FormularioJogador
          nome={nome}
          onNomeChange={setNome}
          posicao={posicao}
          onPosicaoChange={setPosicao}
          ehGoleiro={ehGoleiro}
          onEhGoleiroChange={setEhGoleiro}
          erro={erro}
          salvando={salvando}
          textoBotao="Salvar alterações"
          onSubmit={handleSubmit}
        />
      )}
    </PaginaJogadores>
  );
}
