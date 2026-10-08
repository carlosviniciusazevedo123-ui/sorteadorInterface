import { useCallback, useEffect, useState } from 'react';

import { api } from '../services/api';
import { mensagemDoErro } from '../utils/mensagemDoErro';

function enriquecerJogo(dadosJogo, dadosPartida) {
  const times = dadosPartida?.teams || [];

  return {
    ...dadosJogo,
    teamA: times.find((time) => time.id === dadosJogo.team_a_id),
    teamB: times.find((time) => time.id === dadosJogo.team_b_id),
    winner: times.find((time) => time.id === dadosJogo.winner_team_id),
  };
}

function obterJogo(resposta) {
  return resposta?.game ?? resposta;
}

function obterPartida(resposta) {
  return resposta?.match ?? resposta;
}

export function useControleJogo(matchId, gameId) {
  const [partida, setPartida] = useState(null);
  const [jogo, setJogo] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);
  const [vencedorId, setVencedorId] = useState('');
  const [resultadoAberto, setResultadoAberto] = useState(false);

  const buscarDados = useCallback(async () => {
    const [{ data: dadosJogo }, { data: dadosPartida }] = await Promise.all([
      api.get(`/matches/${matchId}/games/${gameId}`),
      api.get(`/matches/${matchId}`),
    ]);

    return {
      partida: obterPartida(dadosPartida),
      jogo: obterJogo(dadosJogo),
    };
  }, [matchId, gameId]);

  const aplicarDados = useCallback(
    ({ partida: dadosPartida, jogo: dadosJogo }) => {
      setPartida(dadosPartida);
      setJogo(enriquecerJogo(dadosJogo, dadosPartida));
      setSegundosDecorridos(Number(dadosJogo.elapsed_seconds) || 0);
      setResultadoAberto(dadosJogo.status === 'finished');
    },
    []
  );

  useEffect(() => {
    let ativo = true;

    async function carregarJogo() {
      try {
        const dados = await buscarDados();
        if (ativo) aplicarDados(dados);
      } catch (error) {
        console.error('Erro ao carregar jogo:', error.response?.data ?? error);
        if (ativo) {
          setErro(mensagemDoErro(error, 'Não foi possível carregar o jogo.'));
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarJogo();
    return () => {
      ativo = false;
    };
  }, [buscarDados, aplicarDados]);

  useEffect(() => {
    if (jogo?.status !== 'in_progress') return;

    let ativo = true;
    const intervalo = setInterval(async () => {
      try {
        const { data } = await api.get(`/matches/${matchId}/games/${gameId}`);
        const dadosJogo = obterJogo(data);
        if (!ativo) return;

        setJogo(enriquecerJogo(dadosJogo, partida));
        setSegundosDecorridos(Number(dadosJogo.elapsed_seconds) || 0);
        setResultadoAberto(dadosJogo.status === 'finished');
      } catch (error) {
        console.error(
          'Erro ao atualizar o estado do jogo:',
          error.response?.data ?? error
        );
      }
    }, 3000);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [jogo?.status, matchId, gameId, partida]);

  useEffect(() => {
    if (jogo?.status !== 'in_progress') return;

    const intervalo = setInterval(() => {
      setSegundosDecorridos((segundos) => segundos + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [jogo?.status]);

  async function atualizarEstadoJogo(acao) {
    setErro('');
    setAtualizando(true);

    try {
      await api.patch(`/matches/${matchId}/games/${gameId}/${acao}`);
      aplicarDados(await buscarDados());
    } catch (error) {
      setErro(mensagemDoErro(error, 'Não foi possível atualizar o jogo.'));
    } finally {
      setAtualizando(false);
    }
  }

  async function handleFinalizarJogo() {
    if (!vencedorId) {
      setErro('Selecione o time vencedor.');
      return;
    }

    setErro('');
    setAtualizando(true);

    try {
      await api.patch(`/matches/${matchId}/games/${gameId}/finish`, {
        winner_team_id: vencedorId,
      });
      aplicarDados(await buscarDados());
      setResultadoAberto(true);
    } catch (error) {
      setErro(mensagemDoErro(error, 'Não foi possível finalizar o jogo.'));
    } finally {
      setAtualizando(false);
    }
  }

  return {
    partida,
    setPartida,
    jogo,
    carregando,
    erro,
    setErro,
    atualizando,
    segundosDecorridos,
    vencedorId,
    setVencedorId,
    resultadoAberto,
    setResultadoAberto,
    atualizarEstadoJogo,
    handleFinalizarJogo,
  };
}
