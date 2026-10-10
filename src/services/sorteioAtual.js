const CHAVE_DRAW_ATUAL = 'sorteador.drawAtual';

export function obterSorteioAtual() {
  try {
    const sorteio = JSON.parse(
      sessionStorage.getItem(CHAVE_DRAW_ATUAL) || 'null'
    );
    return sorteio?.drawId &&
      Array.isArray(sorteio.times) &&
      Array.isArray(sorteio.participacoes) &&
      Array.isArray(sorteio.jogadores)
      ? sorteio
      : null;
  } catch {
    return null;
  }
}

export function salvarSorteioAtual(sorteio) {
  sessionStorage.setItem(CHAVE_DRAW_ATUAL, JSON.stringify(sorteio));
}
