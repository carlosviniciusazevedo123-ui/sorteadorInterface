import {
  House,
  CalendarDays,
  History,
  Shuffle,
  UsersRound,
  Play,
} from 'lucide-react';

import { Button, Navegacao } from './styles';

export function NavegacaoInf({ paginaAtiva, aoNavegar, rotaJogo }) {
  return (
    <Navegacao $comJogo={Boolean(rotaJogo)} aria-label="Navegação principal">
      <Button
        type="button"
        aria-current={paginaAtiva === 'inicio' ? 'page' : undefined}
        onClick={() => aoNavegar('inicio')}
      >
        <House size={18} aria-hidden="true" />
        <span>Início</span>
      </Button>
      <Button
        type="button"
        aria-current={paginaAtiva === 'jogadores' ? 'page' : undefined}
        onClick={() => aoNavegar('jogadores')}
      >
        <UsersRound size={18} aria-hidden="true" />
        <span>Jogadores</span>
      </Button>
      <Button
        type="button"
        aria-current={paginaAtiva === 'sorteio' ? 'page' : undefined}
        onClick={() => aoNavegar('sorteio')}
      >
        <Shuffle size={18} aria-hidden="true" />
        <span>Sorteio</span>
      </Button>
      <Button
        type="button"
        aria-current={paginaAtiva === 'partidas' ? 'page' : undefined}
        onClick={() => aoNavegar('partidas')}
      >
        <CalendarDays size={18} aria-hidden="true" />
        <span>Partidas</span>
      </Button>
      {rotaJogo && (
        <Button
          type="button"
          aria-current={paginaAtiva === 'jogo' ? 'page' : undefined}
          onClick={() => aoNavegar('jogo')}
        >
          <Play size={18} aria-hidden="true" />
          <span>Jogo</span>
        </Button>
      )}
      <Button
        type="button"
        aria-current={paginaAtiva === 'historico' ? 'page' : undefined}
        onClick={() => aoNavegar('historico')}
      >
        <History size={18} aria-hidden="true" />
        <span>Histórico</span>
      </Button>
    </Navegacao>
  );
}
