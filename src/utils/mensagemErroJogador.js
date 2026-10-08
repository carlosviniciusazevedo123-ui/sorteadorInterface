export function mensagemErroJogador(error, padrao) {
  return error.response?.data?.error ===
    'A player with this name already exists'
    ? 'Já existe um jogador com esse nome.'
    : padrao;
}
