import { useEffect, useState } from 'react';

import { api } from '../services/api';
import { mensagemDoErro } from '../utils/mensagemDoErro';

function obterPartida(resposta) {
  return resposta?.match ?? resposta;
}

export function usePartidas({
  incluirDetalhes = false,
  exigirDetalhes = false,
} = {}) {
  const [partidas, setPartidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [erroDetalhes, setErroDetalhes] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    const controller = new AbortController();

    async function carregarPartidas() {
      setCarregando(true);
      setErro('');
      setErroDetalhes('');
      let falhouDetalhe = false;
      try {
        const { data } = await api.get('/matches', {
          signal: controller.signal,
        });
        const lista = Array.isArray(data) ? data : data?.matches || [];

        const partidasCarregadas = incluirDetalhes
          ? await Promise.all(
              lista.map(async (partida) => {
                if (
                  Array.isArray(partida.teams) &&
                  Array.isArray(partida.games)
                ) {
                  return partida;
                }

                try {
                  const { data: detalhes } = await api.get(
                    `/matches/${partida.id}`,
                    { signal: controller.signal }
                  );
                  return obterPartida(detalhes);
                } catch (error) {
                  if (exigirDetalhes) throw error;
                  falhouDetalhe = true;
                  return null;
                }
              })
            )
          : lista;

        if (ativo) {
          setPartidas(partidasCarregadas.filter(Boolean));
          if (falhouDetalhe)
            setErroDetalhes(
              'Algumas partidas não puderam ser carregadas. O histórico está incompleto.'
            );
        }
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
      controller.abort();
    };
  }, [incluirDetalhes, exigirDetalhes, tentativa]);

  return {
    partidas,
    carregando,
    erro,
    erroDetalhes,
    recarregar: () => setTentativa((atual) => atual + 1),
  };
}
