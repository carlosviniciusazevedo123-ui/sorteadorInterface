export function obterVagaInclusao(time, participacoes, jogador, configuracao) {
  const doTime = participacoes.filter((item) => item.team_id === time.id);
  const goleiroHabilitado = configuracao.considerGoalkeepers;
  if (goleiroHabilitado && jogador.is_goalkeeper) {
    if (doTime.some((item) => item.is_goalkeeper)) {
      return { disponivel: false, motivo: 'Este time já possui um goleiro.' };
    }
    return { disponivel: true, tipo: 'goleiro', descricao: 'Vaga de goleiro' };
  }

  const jogadoresDeLinha = doTime.filter((item) => !item.is_goalkeeper);
  const titulares = jogadoresDeLinha.filter((item) => !item.is_reserve).length;
  if (titulares < configuracao.playersPerTeam) {
    return { disponivel: true, tipo: 'titular', descricao: 'Vaga de titular' };
  }
  const reservas = jogadoresDeLinha.filter((item) => item.is_reserve).length;
  if (configuracao.hasReserve && reservas < configuracao.reservePerTeam) {
    return { disponivel: true, tipo: 'reserva', descricao: 'Vaga de reserva' };
  }
  return {
    disponivel: false,
    motivo: 'Este time está com as vagas de linha e de reserva completas.',
  };
}
