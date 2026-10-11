import { useEffect, useState } from 'react';

import { api } from '../services/api';
import { calcularPlacar } from '../utils/calcularPlacar';
import { mensagemDoErro } from '../utils/mensagemDoErro';

export function useUltimoJogo() {
  const [ultimoJogo, setUltimoJogo] = useState(null);
  const [placar, setPlacar] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    async function carregarPlacar() {
      try {
        const { data } = await api.get('/matches/games/latest', {
          signal: controller.signal,
        });
        if (controller.signal.aborted || data === null) return;
        if (
          !data?.match?.id ||
          !data?.game?.id ||
          !Array.isArray(data.events) ||
          !data.game.team_a_id ||
          !data.game.team_b_id ||
          data.game.status !== 'finished' ||
          !data.game.finished_at ||
          !Number.isFinite(new Date(data.game.finished_at).getTime())
        ) {
          throw new Error('Invalid latest game response');
        }
        setUltimoJogo({ partida: data.match, jogo: data.game });
        setPlacar(
          calcularPlacar(data.events, data.game.team_a_id, data.game.team_b_id)
        );
      } catch (error) {
        if (!controller.signal.aborted)
          setErro(
            mensagemDoErro(error, 'Não foi possível carregar o último jogo.')
          );
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }
    carregarPlacar();
    return () => controller.abort();
  }, []);

  return { ultimoJogo, placar, carregando, erro };
}
