import { describe, expect, it } from 'vitest';

import {
  obterSorteioAtual,
  salvarSorteioAtual,
} from '../src/services/sorteioAtual';
import { jogosDoHistorico } from '../src/utils/jogosDoHistorico';
import { validarSorteio } from '../src/utils/validarSorteio';

const jogadores = [
  ...Array.from({ length: 8 }, (_, id) => ({ id, is_goalkeeper: false })),
  ...Array.from({ length: 2 }, (_, id) => ({
    id: `g${id}`,
    is_goalkeeper: true,
  })),
];
const config = {
  quantidadeTimes: 2,
  jogadoresPorTime: 4,
  temReserva: false,
  reservasPorTime: 1,
  considerarGoleiros: true,
  jogadoresSelecionados: jogadores,
};

describe('Validação do sorteio', () => {
  it('aceita configuração com jogadores de linha e goleiros suficientes', () => {
    expect(validarSorteio(config)).toBe('');
  });
  it.each([0, -1, 1.5, 21, NaN])(
    'rejeita jogadores por time inválidos: %s',
    (valor) => {
      expect(validarSorteio({ ...config, jogadoresPorTime: valor })).not.toBe(
        ''
      );
    }
  );
  it.each([0, 1, 2.5, 51])(
    'rejeita quantidade de times inválida: %s',
    (valor) => {
      expect(validarSorteio({ ...config, quantidadeTimes: valor })).not.toBe(
        ''
      );
    }
  );
  it.each([0, -1, 1.5, 11])(
    'rejeita quantidade de reservas inválida: %s',
    (valor) => {
      expect(
        validarSorteio({ ...config, temReserva: true, reservasPorTime: valor })
      ).not.toBe('');
    }
  );
  it('confere vagas de reservas e falta de goleiros', () => {
    expect(validarSorteio({ ...config, temReserva: true })).toContain(
      '10 jogadores de linha'
    );
    expect(
      validarSorteio({
        ...config,
        jogadoresSelecionados: jogadores.slice(0, 8),
      })
    ).toContain('2 goleiros');
  });
  it('permite goleiros como jogadores comuns quando a opção está desativada', () => {
    expect(
      validarSorteio({
        ...config,
        jogadoresPorTime: 5,
        considerarGoleiros: false,
      })
    ).toBe('');
  });
});

describe('Último sorteio e histórico completo', () => {
  it('recupera sorteio salvo e ignora cache inválido', () => {
    const sorteio = {
      drawId: 'draw',
      times: [],
      participacoes: [],
      jogadores: [],
    };
    salvarSorteioAtual(sorteio);
    expect(obterSorteioAtual()).toEqual(sorteio);
    sessionStorage.setItem('sorteador.drawAtual', '{');
    expect(obterSorteioAtual()).toBeNull();
    sessionStorage.setItem('sorteador.drawAtual', '{}');
    expect(obterSorteioAtual()).toBeNull();
  });
  it('mostra todos os jogos e ordena pelo horário mais recente', () => {
    const jogos = jogosDoHistorico([
      {
        id: 'partida',
        games: [
          { id: 'primeiro', finished_at: '2026-10-01T12:00:00Z' },
          { id: 'segundo', finished_at: '2026-10-01T13:00:00Z' },
        ],
      },
      { id: 'outra', createdAt: '2026-09-30T12:00:00Z', games: [] },
    ]);
    expect(jogos.map((item) => item.chave)).toEqual([
      'partida.segundo',
      'partida.primeiro',
      'outra.sem-jogo',
    ]);
  });
});
