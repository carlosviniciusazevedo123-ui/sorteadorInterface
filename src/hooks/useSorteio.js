import { useEffect, useMemo, useRef, useState } from 'react';

import { api } from '../services/api';
import { EVENTO_SESSAO, obterToken } from '../services/session';
import { salvarSorteioAtual } from '../services/sorteioAtual';
import { mensagemDoErro } from '../utils/mensagemDoErro';
import { validarSorteio } from '../utils/validarSorteio';

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
  const sorteioEmAndamento = useRef(false);
  const consulta = useRef(null);

  useEffect(() => {
    const cancelar = () => {
      consulta.current?.abort();
      setSorteando(false);
    };
    const aoMudarArmazenamento = (event) => {
      if (
        event.key === null ||
        event.key === 'sorteador.token' ||
        event.key === 'sorteador.user'
      )
        cancelar();
    };
    window.addEventListener(EVENTO_SESSAO, cancelar);
    window.addEventListener('storage', aoMudarArmazenamento);
    return () => {
      consulta.current?.abort();
      window.removeEventListener(EVENTO_SESSAO, cancelar);
      window.removeEventListener('storage', aoMudarArmazenamento);
    };
  }, []);

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
    if (sorteioEmAndamento.current) return;
    const jogadoresDoSorteio = jogadores.filter((jogador) =>
      jogadoresSelecionados.includes(jogador.id)
    );
    const erroValidacao = validarSorteio({
      quantidadeTimes,
      jogadoresPorTime,
      temReserva,
      reservasPorTime,
      considerarGoleiros,
      jogadoresSelecionados: jogadoresDoSorteio,
    });
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    sorteioEmAndamento.current = true;
    setErro('');
    setResultadoSorteio(null);
    setSorteando(true);
    const controller = new AbortController();
    consulta.current = controller;
    const tokenOriginal = obterToken();
    const sessaoValida = () =>
      !controller.signal.aborted && obterToken() === tokenOriginal;

    try {
      const { data: respostaDraw } = await api.post(
        '/draws',
        {
          howManyTeams: quantidadeTimes,
          playersPerTeam: jogadoresPorTime,
          hasReserve: temReserva,
          reservePerTeam: temReserva ? reservasPorTime : 0,
          considerGoalkeepers: considerarGoleiros,
        },
        { signal: controller.signal }
      );

      if (!sessaoValida()) return;

      const drawId = respostaDraw.draw.id;
      const { data: participacoes } = await api.post(
        `/draws/${drawId}/draw`,
        {
          playerIds: jogadoresSelecionados,
        },
        { signal: controller.signal }
      );

      if (!sessaoValida()) return;

      const sorteioConcluido = {
        drawId,
        times: respostaDraw.teams,
        participacoes,
        jogadores: jogadoresDoSorteio,
      };

      salvarSorteioAtual(sorteioConcluido);
      setResultadoSorteio(sorteioConcluido);
    } catch (error) {
      if (!sessaoValida()) return;
      console.error('Erro ao sortear:', error.response?.data ?? error);
      setErro(mensagemDoErro(error, 'Não foi possível realizar o sorteio.'));
    } finally {
      sorteioEmAndamento.current = false;
      if (!controller.signal.aborted) setSorteando(false);
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
