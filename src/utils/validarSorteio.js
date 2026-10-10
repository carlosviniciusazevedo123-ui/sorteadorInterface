export function validarSorteio({
  quantidadeTimes,
  jogadoresPorTime,
  temReserva,
  reservasPorTime,
  considerarGoleiros,
  jogadoresSelecionados,
}) {
  if (
    !Number.isInteger(quantidadeTimes) ||
    quantidadeTimes < 2 ||
    quantidadeTimes > 50
  )
    return 'Escolha entre 2 e 50 times.';
  if (
    !Number.isInteger(jogadoresPorTime) ||
    jogadoresPorTime < 1 ||
    jogadoresPorTime > 20
  )
    return 'Informe entre 1 e 20 jogadores de linha por time.';
  if (
    temReserva &&
    (!Number.isInteger(reservasPorTime) ||
      reservasPorTime < 1 ||
      reservasPorTime > 10)
  )
    return 'Informe entre 1 e 10 reservas por time.';

  const vagasLinha =
    quantidadeTimes * (jogadoresPorTime + (temReserva ? reservasPorTime : 0));
  const jogadoresLinha = considerarGoleiros
    ? jogadoresSelecionados.filter((jogador) => !jogador.is_goalkeeper)
    : jogadoresSelecionados;
  if (jogadoresLinha.length < vagasLinha)
    return `Selecione pelo menos ${vagasLinha} jogadores${considerarGoleiros ? ' de linha' : ''} para esta configuração.`;
  if (
    considerarGoleiros &&
    jogadoresSelecionados.filter((jogador) => jogador.is_goalkeeper).length <
      quantidadeTimes
  )
    return `Selecione pelo menos ${quantidadeTimes} goleiros ou desative a opção de considerar goleiros.`;
  return '';
}
