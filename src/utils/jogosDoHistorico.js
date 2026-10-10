function dataDoConfronto(partida, jogo) {
  return (
    jogo?.finished_at ||
    jogo?.finishedAt ||
    partida.finished_at ||
    partida.finishedAt ||
    jogo?.createdAt ||
    partida.createdAt ||
    ''
  );
}

export function jogosDoHistorico(partidas) {
  return partidas
    .flatMap((partida) => {
      const jogos = partida.games?.length ? partida.games : [null];
      return jogos.map((jogo) => ({
        partida,
        jogo,
        data: dataDoConfronto(partida, jogo),
        chave: `${partida.id}.${jogo?.id || 'sem-jogo'}`,
      }));
    })
    .sort((a, b) => {
      const dataA = new Date(a.data).getTime() || 0;
      const dataB = new Date(b.data).getTime() || 0;
      return dataB - dataA;
    });
}
