export function selecionarUltimoJogo(partidas) {
  const finalizados = partidas
    .map((partida) => ({
      partida,
      jogo: partida.game || partida.games?.[0],
    }))
    .filter(({ jogo }) => jogo?.status === 'finished');

  // Sem a finalização real de todos os candidatos, não é possível garantir a ordem.
  if (
    finalizados.some(
      ({ jogo }) =>
        !jogo.finished_at ||
        !Number.isFinite(new Date(jogo.finished_at).getTime())
    )
  ) {
    return { ultimoJogo: null, dataIndisponivel: true };
  }

  finalizados.sort(
    (a, b) =>
      new Date(b.jogo.finished_at).getTime() -
      new Date(a.jogo.finished_at).getTime()
  );
  return { ultimoJogo: finalizados[0] || null, dataIndisponivel: false };
}
