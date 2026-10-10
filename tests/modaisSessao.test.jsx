import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { ModalEventoJogo } from '../src/containers/Jogo/components/ModalEventoJogo';
import { ModalResultadoJogo } from '../src/containers/Jogo/components/ModalResultadoJogo';
import { RotaProtegida } from '../src/middleware/RotaProtegida';
import { limparSessao, salvarSessao } from '../src/services/session';

const jogo = {
  status: 'finished',
  teamA: { id: 'a', name: 'Time A' },
  teamB: { id: 'b', name: 'Time B' },
};
const resultado = {
  jogo,
  placar: { a: 1, b: 0 },
  onFechar: vi.fn(),
  onCriarOutraPartida: vi.fn(),
};
const token = (exp) => `header.${btoa(JSON.stringify({ exp }))}.signature`;

describe('Modais acessíveis', () => {
  it('move e prende o foco, permite Escape e restaura foco ao fechar', () => {
    const origem = document.createElement('button');
    origem.textContent = 'Abrir';
    document.body.appendChild(origem);
    origem.focus();
    const onFechar = vi.fn();
    const { unmount } = render(
      <ModalResultadoJogo {...resultado} onFechar={onFechar} />
    );
    const primeiro = screen.getByRole('button', {
      name: 'Gerar link de avaliação',
    });
    const ultimo = screen.getByRole('button', { name: 'Fechar resultado' });
    expect(document.activeElement).toBe(primeiro);
    ultimo.focus();
    fireEvent.keyDown(ultimo, { key: 'Tab' });
    expect(document.activeElement).toBe(primeiro);
    fireEvent.keyDown(primeiro, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(ultimo);
    origem.focus();
    expect(document.activeElement).toBe(primeiro);
    fireEvent.keyDown(primeiro, { key: 'Escape' });
    expect(onFechar).toHaveBeenCalledOnce();
    fireEvent.click(ultimo);
    expect(onFechar).toHaveBeenCalledTimes(2);
    unmount();
    expect(document.activeElement).toBe(origem);
    expect(document.body.style.overflow).toBe('');
    origem.remove();
  });

  it('permite criar outra partida sem gerar link de avaliação', () => {
    const criar = vi.fn();
    render(<ModalResultadoJogo {...resultado} onCriarOutraPartida={criar} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'Criar outra partida' })
    );
    expect(criar).toHaveBeenCalledOnce();
  });

  it('não fecha com Escape durante salvamento de evento', () => {
    const onFechar = vi.fn();
    const props = {
      tipo: 'goal',
      jogo,
      jogadoresDoTime: () => [],
      salvando: true,
      onFechar,
    };
    const { rerender } = render(<ModalEventoJogo {...props} />);
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(onFechar).not.toHaveBeenCalled();
    rerender(<ModalEventoJogo {...props} salvando={false} />);
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(onFechar).toHaveBeenCalledOnce();
  });
});

function renderArea() {
  return render(
    <MemoryRouter initialEntries={['/inicio']}>
      <Routes>
        <Route
          path="/inicio"
          element={
            <RotaProtegida>
              <p>Área protegida</p>
            </RotaProtegida>
          }
        />
        <Route path="/login" element={<p>Tela de login</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Proteção de rotas', () => {
  it('bloqueia token vencido', async () => {
    localStorage.setItem('sorteador.token', token(0));
    renderArea();
    await waitFor(() =>
      expect(screen.queryByText('Tela de login')).not.toBeNull()
    );
    expect(screen.queryByText('Área protegida')).toBeNull();
  });

  it('redireciona ao login quando a sessão é encerrada', async () => {
    salvarSessao(token(Math.floor(Date.now() / 1000) + 3600), { id: 'a' });
    renderArea();
    expect(screen.queryByText('Área protegida')).not.toBeNull();
    act(() => limparSessao());
    await waitFor(() =>
      expect(screen.queryByText('Tela de login')).not.toBeNull()
    );
  });

  it('encerra sessão quando o token vence com a tela aberta', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-10T12:00:00Z'));
    salvarSessao(token(Math.floor(Date.now() / 1000) + 1), { id: 'a' });
    renderArea();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1100);
    });
    expect(screen.queryByText('Tela de login')).not.toBeNull();
  });
});
