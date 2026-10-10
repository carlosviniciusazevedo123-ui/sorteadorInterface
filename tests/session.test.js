import { describe, expect, it, vi } from 'vitest';

import { api } from '../src/services/api';
import {
  EVENTO_SESSAO,
  limparSessao,
  obterToken,
  obterUsuario,
  salvarSessao,
} from '../src/services/session';

export function criarToken(
  exp = Math.floor(Date.now() / 1000) + 3600,
  id = 'a'
) {
  return `header.${btoa(JSON.stringify({ exp, id }))}.signature`;
}

describe('Sessão e dados locais', () => {
  it('limpa sorteio, rota e eventos ao sair e mantém preferências', () => {
    salvarSessao(criarToken(), { id: 'a' });
    for (const chave of [
      'sorteador.drawAtual',
      'sorteador.rotaJogo',
      'sorteador.eventos.a.b',
    ])
      sessionStorage.setItem(chave, 'dados');
    sessionStorage.setItem('outra-aplicacao', 'manter');
    localStorage.setItem('sorteador.email', 'email@example.com');
    const notificar = vi.fn();
    window.addEventListener(EVENTO_SESSAO, notificar, { once: true });
    limparSessao();
    expect(obterToken()).toBeNull();
    expect(obterUsuario()).toBeNull();
    expect(sessionStorage.length).toBe(1);
    expect(sessionStorage.getItem('outra-aplicacao')).toBe('manter');
    expect(localStorage.getItem('sorteador.email')).toBe('email@example.com');
    expect(notificar).toHaveBeenCalledOnce();
  });

  it('limpa o sorteio ao trocar de conta, mesmo sem logout prévio', () => {
    salvarSessao(criarToken(), { id: 'a' });
    sessionStorage.setItem('sorteador.drawAtual', 'dados');
    salvarSessao(criarToken(undefined, 'b'), { id: 'b' });
    expect(sessionStorage.getItem('sorteador.drawAtual')).toBeNull();
    expect(obterUsuario().id).toBe('b');
  });

  it.each(['invalido', 'header.invalid.signature', criarToken(0)])(
    'rejeita token inválido ou vencido: %s',
    (token) => {
      localStorage.setItem('sorteador.token', token);
      localStorage.setItem('sorteador.user', JSON.stringify({ id: 'a' }));
      expect(obterToken()).toBeNull();
      expect(obterUsuario()).toBeNull();
    }
  );

  it('encerra a sessão após 401 autenticado', async () => {
    salvarSessao(criarToken(), { id: 'a' });
    sessionStorage.setItem('sorteador.drawAtual', 'dados');
    await expect(
      api.get('/players', {
        adapter: (config) =>
          Promise.reject({ config, response: { status: 401 } }),
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
    expect(obterToken()).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });

  it('não envia token nem encerra a sessão por erro em rota pública', async () => {
    const token = criarToken();
    salvarSessao(token, { id: 'a' });
    const adapter = vi.fn((config) =>
      Promise.reject({ config, response: { status: 401 } })
    );
    await expect(api.post('/sessions', {}, { adapter })).rejects.toMatchObject({
      response: { status: 401 },
    });
    expect(adapter.mock.calls[0][0].headers.Authorization).toBeUndefined();
    expect(obterToken()).toBe(token);
  });

  it('resposta 401 de token antigo não encerra uma nova sessão', async () => {
    salvarSessao(criarToken(), { id: 'a' });
    let rejeitar;
    const consulta = api.get('/players', {
      adapter: (config) =>
        new Promise((resolve, reject) => {
          rejeitar = () => reject({ config, response: { status: 401 } });
        }),
    });
    await vi.waitFor(() => expect(rejeitar).toBeTypeOf('function'));
    const novoToken = criarToken(undefined, 'b');
    salvarSessao(novoToken, { id: 'b' });
    rejeitar();
    await expect(consulta).rejects.toMatchObject({ response: { status: 401 } });
    expect(obterToken()).toBe(novoToken);
  });
});
