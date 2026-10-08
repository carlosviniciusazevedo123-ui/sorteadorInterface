export function mensagemDoErro(error, padrao = 'Ocorreu um erro.') {
  const mensagem = error.response?.data?.error;

  return Array.isArray(mensagem)
    ? mensagem.join(' ')
    : typeof mensagem === 'string'
      ? mensagem
      : padrao;
}
