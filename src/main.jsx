import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router';

import './styles/global.css';
import { Rotas } from './routes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Rotas />
    </HashRouter>
  </StrictMode>
);
