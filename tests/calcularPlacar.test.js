import assert from 'node:assert/strict';

import { it as test } from 'vitest';

import { calcularPlacar } from '../src/utils/calcularPlacar.js';

test('recupera o placar de uma lista de eventos persistidos', () => {
  const eventos = [
    { event_type: 'goal', team_id: 'a' },
    { event_type: 'goal', team_id: 'b' },
    { event_type: 'own_goal', team_id: 'b' },
    { event_type: 'own_goal', team_id: 'a' },
    { event_type: 'goal', team_id: 'a' },
    { event_type: 'assist', team_id: 'a' },
    { event_type: 'red_card', team_id: 'b' },
    { event_type: 'substitution', team_id: 'a' },
  ];
  assert.deepEqual(calcularPlacar(eventos, 'a', 'b'), { a: 3, b: 2 });
  assert.deepEqual(
    calcularPlacar(JSON.parse(JSON.stringify(eventos)), 'a', 'b'),
    {
      a: 3,
      b: 2,
    }
  );
});

test('jogo sem eventos tem placar zero', () => {
  assert.deepEqual(calcularPlacar([], 'a', 'b'), { a: 0, b: 0 });
});

test('eventos de outros times não alteram o placar, inclusive gol contra', () => {
  assert.deepEqual(
    calcularPlacar(
      [
        { event_type: 'goal', team_id: 'outro' },
        { event_type: 'own_goal', team_id: 'outro' },
      ],
      'a',
      'b'
    ),
    { a: 0, b: 0 }
  );
});
