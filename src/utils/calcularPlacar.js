export function calcularPlacar(eventos, timeAId, timeBId) {
  return eventos.reduce(
    (placar, evento) => {
      if (evento.event_type !== 'goal' && evento.event_type !== 'own_goal')
        return placar;
      if (!timeAId || !timeBId) return placar;
      if (evento.team_id !== timeAId && evento.team_id !== timeBId)
        return placar;

      const marcouParaA =
        evento.event_type === 'own_goal'
          ? evento.team_id === timeBId
          : evento.team_id === timeAId;
      if (marcouParaA) placar.a += 1;
      else placar.b += 1;
      return placar;
    },
    { a: 0, b: 0 }
  );
}
