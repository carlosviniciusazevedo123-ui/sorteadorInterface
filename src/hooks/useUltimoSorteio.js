import { useEffect, useState } from 'react';

import { api } from '../services/api';
import { mensagemDoErro } from '../utils/mensagemDoErro';

export function useUltimoSorteio({ habilitado = true } = {}) {
  const [sorteio, setSorteio] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  useEffect(() => {
    if (!habilitado) return;
    const controller = new AbortController();
    async function carregar() {
      try {
        const { data } = await api.get('/draws/latest', {
          signal: controller.signal,
        });
        if (controller.signal.aborted || data === null) return;
        if (
          !data?.draw?.id ||
          !Array.isArray(data.draw.teams) ||
          !Array.isArray(data.participants)
        ) {
          throw new Error('Invalid latest draw response');
        }
        setSorteio({
          drawId: data.draw.id,
          times: data.draw.teams,
          participacoes: data.participants,
          jogadores: [
            ...new Map(
              data.participants
                .filter((item) => item.player)
                .map((item) => [item.player.id, item.player])
            ).values(),
          ],
          data: data.drawn_at,
        });
      } catch (error) {
        if (!controller.signal.aborted)
          setErro(
            mensagemDoErro(error, 'Não foi possível carregar o último sorteio.')
          );
      } finally {
        if (!controller.signal.aborted) setCarregando(false);
      }
    }
    carregar();
    return () => controller.abort();
  }, [habilitado]);
  return { sorteio, carregando: habilitado && carregando, erro };
}
