const CHAVE_TOKEN = 'sorteador.token';
const CHAVE_USUARIO = 'sorteador.user';
export const EVENTO_SESSAO = 'sorteador:sessao';

export function expiracaoToken(token) {
  try {
    const partes = token.split('.');
    if (partes.length !== 3) return 0;
    const payload = JSON.parse(
      atob(partes[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    return Number.isFinite(payload.exp) ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

export function limparDadosDaSessao() {
  const chaves = [];
  for (let indice = 0; indice < sessionStorage.length; indice += 1) {
    const chave = sessionStorage.key(indice);
    if (chave?.startsWith('sorteador.')) chaves.push(chave);
  }
  chaves.forEach((chave) => sessionStorage.removeItem(chave));
}

function notificarSessao() {
  window.dispatchEvent(new Event(EVENTO_SESSAO));
}

export function obterToken() {
  const token = localStorage.getItem(CHAVE_TOKEN);
  return token && expiracaoToken(token) > Date.now() ? token : null;
}

export function obterUsuario() {
  if (!obterToken()) return null;
  try {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIO) || 'null');
  } catch {
    return null;
  }
}

export function salvarSessao(token, usuario) {
  if (!obterToken() || obterUsuario()?.id !== usuario?.id)
    limparDadosDaSessao();
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuario));
  notificarSessao();
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_USUARIO);
  limparDadosDaSessao();
  notificarSessao();
}
