import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';

import { NavegacaoInf } from '../../components/NavegacaoInf';

export function AreaLogada() {
  const navigate = useNavigate();
  const location = useLocation();
  const paginaAtiva = location.pathname.split('/')[1];

  const rotaJogo = location.pathname.startsWith('/jogo/')
    ? location.pathname
    : location.state?.limparRotaJogo
      ? ''
      : sessionStorage.getItem('sorteador.rotaJogo') || '';

  useEffect(() => {
    if (location.pathname.startsWith('/jogo/')) {
      sessionStorage.setItem('sorteador.rotaJogo', location.pathname);
    } else if (location.state?.limparRotaJogo) {
      sessionStorage.removeItem('sorteador.rotaJogo');
    }
  }, [location.pathname, location.state?.limparRotaJogo]);

  return (
    <>
      <Outlet />
      <NavegacaoInf
        paginaAtiva={paginaAtiva}
        rotaJogo={rotaJogo}
        aoNavegar={(pagina) => {
          if (pagina === 'jogo' && rotaJogo) {
            navigate(rotaJogo);
            return;
          }

          navigate(`/${pagina}`);
        }}
      />
    </>
  );
}
