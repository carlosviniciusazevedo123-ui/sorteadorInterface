import { Fragment, useEffect, useState } from 'react';
import { Navigate } from 'react-router';

import {
  EVENTO_SESSAO,
  expiracaoToken,
  limparDadosDaSessao,
  limparSessao,
  obterToken,
} from '../services/session';

export function RotaProtegida({ children }) {
  const [token, setToken] = useState(obterToken);
  useEffect(() => {
    const atualizar = () => setToken(obterToken());
    const aoMudarArmazenamento = (event) => {
      if (
        event.key === null ||
        event.key === 'sorteador.token' ||
        event.key === 'sorteador.user'
      ) {
        limparDadosDaSessao();
        atualizar();
      }
    };
    window.addEventListener(EVENTO_SESSAO, atualizar);
    window.addEventListener('storage', aoMudarArmazenamento);
    let intervalo;
    function agendarExpiracao() {
      if (!token) return;
      const restante = expiracaoToken(token) - Date.now();
      if (restante <= 0) {
        if (!obterToken()) limparSessao();
        atualizar();
        return;
      }
      intervalo = setTimeout(agendarExpiracao, Math.min(restante, 2147483647));
    }
    agendarExpiracao();
    return () => {
      window.removeEventListener(EVENTO_SESSAO, atualizar);
      window.removeEventListener('storage', aoMudarArmazenamento);
      clearTimeout(intervalo);
    };
  }, [token]);
  return token && obterToken() ? (
    <Fragment key={token}>{children}</Fragment>
  ) : (
    <Navigate to="/login" replace />
  );
}
