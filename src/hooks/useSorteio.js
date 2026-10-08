import { useMemo, useState } from 'react';

import { api } from '../services/api';
import { mensagemDoErro } from '../utils/mensagemDoErro';

const CHAVE_DRAW_ATUAL = 'sorteador.drawAtual';

export function useSorteio(jogadores) {
  const [jogadoresSelecionados, setJogadoresSelecionados] = useState([]);
  const [busca, setBusca] = useState('');
  const [quantidadeTimes, setQuantidadeTimes] = useState(2);
  const [jogadoresPorTime, setJogadoresPorTime] = useState(4);
  const [temReserva, setTemReserva] = useState(false);
  const [reservasPorTime, setReservasPorTime] = useState(1);
  const [considerarGoleiros, setConsiderarGoleiros] = useState(true);
  const [sorteando, setSorteando] = useState(false);
  const [resultadoSorteio, setResultadoSorteio] = useState(null);
  const [erro, setErro] = useState('');

  const jogadoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');

    return jogadores.filter((jogador) =>
      jogador.name.toLocaleLowerCase('pt-BR').includes(termo)
    );
  }, [busca, jogadores]);

  function alternarSelecao(id) {
    setJogadoresSelecionados((selecionados) =>
      selecionados.includes(id)
        ? selecionados.filter((jogadorId) => jogadorId !== id)
        : [...selecionados, id]
    );
  }

  async function handleSortear() {
    if (jogadoresSelecionados.length === 0) {
      setErro('Selecione pelo menos um jogador.');
      return;
    }

    setErro('');
    setResultadoSorteio(null);
    setSorteando(true);

    try {
      const { data: respostaDraw } = await api.post('/draws', {
        howManyTeams: quantidadeTimes,
        playersPerTeam: jogadoresPorTime,
        hasReserve: temReserva,
        reservePerTeam: temReserva ? reservasPorTime : 0,
        considerGoalkeepers: considerarGoleiros,
      });

      const drawId = respostaDraw.draw.id;
      const { data: participacoes } = await api.post(`/draws/${drawId}/draw`, {
        playerIds: jogadoresSelecionados,
      });

      const jogadoresDoSorteio = jogadores.filter((jogador) =>
        jogadoresSelecionados.includes(jogador.id)
      );
      const sorteioConcluido = {
        drawId,
        times: respostaDraw.teams,
        participacoes,
        jogadores: jogadoresDoSorteio,
      };

      sessionStorage.setItem(
        CHAVE_DRAW_ATUAL,
        JSON.stringify(sorteioConcluido)
      );
      setResultadoSorteio(sorteioConcluido);
    } catch (error) {
      console.error('Erro ao sortear:', error.response?.data ?? error);
      setErro(mensagemDoErro(error, 'Não foi possível realizar o sorteio.'));
    } finally {
      setSorteando(false);
    }
  }

  return {
    jogadoresSelecionados,
    busca,
    setBusca,
    quantidadeTimes,
    setQuantidadeTimes,
    jogadoresPorTime,
    setJogadoresPorTime,
    temReserva,
    setTemReserva,
    reservasPorTime,
    setReservasPorTime,
    considerarGoleiros,
    setConsiderarGoleiros,
    sorteando,
    resultadoSorteio,
    setResultadoSorteio,
    erro,
    jogadoresFiltrados,
    alternarSelecao,
    handleSortear,
  };
}
