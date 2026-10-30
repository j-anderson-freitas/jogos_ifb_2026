import { Match, CollectiveTeam, StandingRow } from '../types/database';

/**
 * Calcula a tabela de classificação de um grupo/chave de acordo com o Regulamento Oficial JIS-IFB 2026.
 */
export function computeGroupStandings(
  groupName: string,
  groupTeams: CollectiveTeam[],
  matches: Match[],
  isFutsal: boolean
): StandingRow[] {
  const table: Record<string, StandingRow> = {};

  // Inicializar registros para cada equipe
  groupTeams.forEach((t) => {
    table[t.id] = {
      team_id: t.id,
      team_name: t.name,
      campus_id: t.campus_id,
      avatar_key: t.avatar_key,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      penalties_won: 0,
      goals_for: 0,
      goals_against: 0,
      goal_diff: 0,
      points: 0,
    };
  });

  const relevantMatches = matches.filter(
    (m) =>
      m.status === 'Finalizado' &&
      (m.group_name === groupName || (!m.group_name && groupName === 'Classificação Geral'))
  );

  for (const m of relevantMatches) {
    const teamA = table[m.team_a_id || ''];
    const teamB = table[m.team_b_id || ''];
    if (!teamA || !teamB) continue;

    teamA.played += 1;
    teamB.played += 1;
    teamA.goals_for += m.score_a;
    teamA.goals_against += m.score_b;
    teamB.goals_for += m.score_b;
    teamB.goals_against += m.score_a;

    if (m.score_a > m.score_b) {
      teamA.won += 1;
      teamA.points += 3;
      teamB.lost += 1;
    } else if (m.score_b > m.score_a) {
      teamB.won += 1;
      teamB.points += 3;
      teamA.lost += 1;
    } else {
      // Empate
      teamA.drawn += 1;
      teamB.drawn += 1;

      if (isFutsal) {
        // Regulamento Oficial IFB: Vitória nos pênaltis = 2 pts; Derrota nos pênaltis = 1 pt
        const penA = m.score_penalties_a ?? 0;
        const penB = m.score_penalties_b ?? 0;
        if (penA > penB) {
          teamA.penalties_won = (teamA.penalties_won || 0) + 1;
          teamA.points += 2;
          teamB.points += 1;
        } else if (penB > penA) {
          teamB.penalties_won = (teamB.penalties_won || 0) + 1;
          teamB.points += 2;
          teamA.points += 1;
        } else {
          teamA.points += 1;
          teamB.points += 1;
        }
      } else {
        teamA.points += 1;
        teamB.points += 1;
      }
    }
  }

  // Calcular saldo de gols e ordenar segundo os critérios oficiais de desempate
  const rows = Object.values(table).map((r) => ({
    ...r,
    goal_diff: r.goals_for - r.goals_against,
  }));

  return rows.sort((a, b) => {
    // 1º Critério: Maior número de pontos
    if (b.points !== a.points) return b.points - a.points;
    // 2º Critério: Maior número de vitórias
    if (b.won !== a.won) return b.won - a.won;
    // 3º Critério: Maior saldo de gols/pontos
    if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
    // 4º Critério: Maior número de gols/pontos pró
    if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
    // 5º Critério: Menor número de gols sofridos
    return a.goals_against - b.goals_against;
  });
}

