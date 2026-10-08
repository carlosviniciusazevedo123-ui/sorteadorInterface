export function formatarNome(nome = '') {
  return nome
    .trim()
    .toLocaleLowerCase('pt-BR')
    .replace(/(^|[\s'-])\p{L}/gu, (parte) => parte.toLocaleUpperCase('pt-BR'));
}
