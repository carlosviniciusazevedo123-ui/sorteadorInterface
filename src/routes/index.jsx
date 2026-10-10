import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router';

import { AreaLogada } from '../containers/AreaLogada';
import { Avaliacao } from '../containers/Avaliacao';
import { Cadastro } from '../containers/Cadastro';
import { Historico } from '../containers/Historico';
import { Jogadores } from '../containers/Jogadores';
import { CadastroJogador } from '../containers/Jogadores/Cadastro/cadastroJogador';
import { EditarJogador } from '../containers/Jogadores/Cadastro/editarJogador';
import { Jogo } from '../containers/Jogo';
import { Login } from '../containers/Login';
import { Menu } from '../containers/Menu';
import { Partidas } from '../containers/Partidas';
import { Sorteio } from '../containers/Sorteio';
import { RotaProtegida } from '../middleware/RotaProtegida';

export function Rotas() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <Login
            initialEmail={location.state?.email ?? ''}
            onRegister={() => navigate('/cadastro')}
            onLoginSuccess={() => {
              console.log('Login concluído; navegando para /inicio');
              navigate('/inicio', { replace: true });
            }}
          />
        }
      />

      <Route
        path="/cadastro"
        element={
          <Cadastro
            onLogin={(email) => navigate('/login', { state: { email } })}
          />
        }
      />
      <Route path="/avaliacao/:token" element={<Avaliacao />} />
      <Route
        element={
          <RotaProtegida>
            <AreaLogada />
          </RotaProtegida>
        }
      >
        <Route path="inicio" element={<Menu />} />

        <Route path="jogadores" element={<Jogadores />} />
        <Route path="sorteio" element={<Sorteio />} />
        <Route path="partidas" element={<Partidas />} />
        <Route path="historico" element={<Historico />} />
        <Route path="jogadores/cadastro" element={<CadastroJogador />} />
        <Route path="jogadores/editar/:id" element={<EditarJogador />} />
        <Route
          path="jogo/:matchId/:gameId"
          element={<Jogo key={location.pathname} />}
        />
      </Route>
    </Routes>
  );
}
