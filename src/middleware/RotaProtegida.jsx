import { Navigate } from 'react-router';

const CHAVE_TOKEN = 'sorteador.token';

export function RotaProtegida({ children }) {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
