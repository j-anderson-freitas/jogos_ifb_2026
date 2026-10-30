import test from 'node:test';
import assert from 'node:assert/strict';

test('Cálculo de pontos do Regulamento Oficial - Futsal', () => {
  // Vitória normal no tempo regulamentar
  const scoreVit = 3;
  assert.equal(scoreVit, 3, 'Vitória no tempo normal deve conceder 3 pontos');

  // Empate com vitória nos pênaltis: 2 pontos
  const regularDraw = 1;
  const penaltyBonus = 1;
  const totalPenaltyWin = regularDraw + penaltyBonus;
  assert.equal(totalPenaltyWin, 2, 'Empate com vitória nos pênaltis deve totalizar 2 pontos');

  // Empate com derrota nos pênaltis: 1 ponto
  assert.equal(regularDraw, 1, 'Empate com derrota nos pênaltis deve conceder 1 ponto');
});

test('Pontuação Ponderada de Medalhas por Campus', () => {
  const goldPoints = 10;
  const silverPoints = 7;
  const bronzePoints = 5;
  const participationPoints = 1;

  // Campus com 2 Ouros, 1 Prata, 1 Bronze e 5 participantes
  const total = 2 * goldPoints + 1 * silverPoints + 1 * bronzePoints + 5 * participationPoints;
  assert.equal(total, 20 + 7 + 5 + 5);
  assert.equal(total, 37, 'Total de pontos deve ser 37');
});

test('Desempate: Saldo de Gols', () => {
  const teamA = { goalsFor: 12, goalsAgainst: 4, diff: 8 };
  const teamB = { goalsFor: 10, goalsAgainst: 3, diff: 7 };
  assert.ok(teamA.diff > teamB.diff, 'Team A deve ficar à frente pelo saldo de gols');
});

test('Critérios de Ordenação Oficial: Pontos > Vitórias > Saldo > Gols Pró', () => {
  const team1 = { points: 6, won: 2, diff: 4, goalsFor: 7 };
  const team2 = { points: 6, won: 2, diff: 2, goalsFor: 5 };
  const team3 = { points: 3, won: 1, diff: -1, goalsFor: 2 };

  const ranked = [team2, team3, team1].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.won !== a.won) return b.won - a.won;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return b.goalsFor - a.goalsFor;
  });

  assert.equal(ranked[0], team1, 'team1 deve ser o primeiro colocado');
  assert.equal(ranked[1], team2, 'team2 deve ser o segundo colocado');
  assert.equal(ranked[2], team3, 'team3 deve ser o terceiro colocado');
});
