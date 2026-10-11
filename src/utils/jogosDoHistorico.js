function dataDoConfronto(partida, jogo) {
  const registro = jogo || partida;
  const finalizacao = registro.finished_at || registro.finishedAt;
  const criacao = registro.createdAt || registro.created_at;
  const valida = (data) => data && Number.isFinite(new Date(data).getTime());
  if (valida(finalizacao))
    return { data: finalizacao, tipoData: 'Finalizado em' };
  if (valida(criacao)) return { data: criacao, tipoData: 'Criado em' };
  return { data: '', tipoData: '' };
}

export function jogosDoHistorico(partidas) {
  return partidas
    .map((partida) => {
      const jogo = partida.game || partida.games?.[0] || null;
      return {
        partida,
        jogo,
        ...dataDoConfronto(partida, jogo),
        chave: `${partida.id}.${jogo?.id || 'sem-jogo'}`,
      };
    })
    .sort((a, b) => {
      const dataA = new Date(a.data).getTime() || 0;
      const dataB = new Date(b.data).getTime() || 0;
      return dataB - dataA;
    });
}
