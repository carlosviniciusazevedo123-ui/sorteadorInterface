import { useEffect, useState } from 'react';

import { api } from '../services/api';
import { mensagemDoErro } from '../utils/mensagemDoErro';

export function useJogadores() {
  const [jogadores, setJogadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  function removerJogador(id) {
    setJogadores((atuais) => atuais.filter((jogador) => jogador.id !== id));
  }

  useEffect(() => {
    let ativo = true;

    async function carregarJogadores() {
      try {
        const { data } = await api.get('/players');

        if (ativo)
          setJogadores(Array.isArray(data) ? data : data?.players || []);
      } catch (error) {
        if (ativo) {
          setErro(
            mensagemDoErro(error, 'Não foi possível carregar os jogadores.')
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarJogadores();

    return () => {
      ativo = false;
    };
  }, []);

  return { jogadores, carregando, erro, removerJogador };
}
