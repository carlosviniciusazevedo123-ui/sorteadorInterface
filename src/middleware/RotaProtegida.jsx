import { Navigate } from 'react-router';

import { obterToken } from '../services/session';

export function RotaProtegida({ children }) {
  return obterToken() ? children : <Navigate to="/login" replace />;
}
