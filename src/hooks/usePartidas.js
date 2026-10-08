import { useEffect, useState } from 'react';

import { api } from '../services/api';
import { mensagemDoErro } from '../utils/mensagemDoErro';

function obterPartida(resposta) {
  return resposta?.match ?? resposta;
}

export function usePartidas({ incluirDetalhes = false } = {}) {
  const [partidas, setPartidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarPartidas() {
      try {
        const { data } = await api.get('/matches');
        const lista = Array.isArray(data) ? data : data?.matches || [];

        const partidasCarregadas = incluirDetalhes
          ? await Promise.all(
              lista.map(async (partida) => {
                if (partida.teams?.length && partida.games?.length) {
                  return partida;
                }

                try {
                  const { data: detalhes } = await api.get(
                    `/matches/${partida.id}`
                  );
                  return obterPartida(detalhes);
                } catch {
                  return partida;
                }
              })
            )
          : lista;

        if (ativo) setPartidas(partidasCarregadas);
      } catch (error) {
        if (ativo) {
          setErro(
            mensagemDoErro(error, 'Não foi possível carregar as partidas.')
          );
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarPartidas();

    return () => {
      ativo = false;
    };
  }, [incluirDetalhes]);

  return { partidas, carregando, erro };
}
