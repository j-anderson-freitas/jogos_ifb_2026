import React, { useState } from 'react';
import { Match, Modality, CollectiveTeam, StandingRow } from '../../types/database';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Card } from '../m3/M3Card';
import { Trophy, HelpCircle } from 'lucide-react';

export interface StandingsTableProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  matches,
  modalities,
  teams,
}) => {
  const collectiveModalities = modalities.filter((m) => m.type === 'coletiva');
  const [selectedModalityId, setSelectedModalityId] = useState<string>(
    collectiveModalities[0]?.id || 'futsal-masc'
  );

  const selectedModality = modalities.find((m) => m.id === selectedModalityId);
  const modalityTeams = teams.filter((t) => t.modality_id === selectedModalityId);
  const modalityMatches = matches.filter(
    (m) => m.modality_id === selectedModalityId && m.status === 'Finalizado'
  );

  // Agrupar equipes por chave/grupo (ex: Grupo A, Grupo B, Triangular, Chave Única)
  const groups: { [key: string]: CollectiveTeam[] } = {};
  modalityTeams.forEach((t) => {
    const grp = t.group_name || 'Classificação Geral';
    if (!groups[grp]) groups[grp] = [];
    groups[grp].push(t);
  });

  // Função para calcular a tabela de classificação de um grupo específico
  const computeGroupStandings = (groupName: string, groupTeams: CollectiveTeam[]): StandingRow[] => {
    const table: { [teamId: string]: StandingRow } = {};

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

    const isFutsal = selectedModalityId.includes('futsal');

    modalityMatches
      .filter((m) => m.group_name === groupName || (!m.group_name && groupName === 'Classificação Geral'))
      .forEach((m) => {
        const teamA = table[m.team_a_id || ''];
        const teamB = table[m.team_b_id || ''];
        if (!teamA || !teamB) return;

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
            // Regulamento Oficial: Vitória nos pênaltis = 2 pts, Derrota nos pênaltis = 1 pt
            if ((m.score_penalties_a || 0) > (m.score_penalties_b || 0)) {
              teamA.penalties_won = (teamA.penalties_won || 0) + 1;
              teamA.points += 2;
              teamB.points += 1;
            } else if ((m.score_penalties_b || 0) > (m.score_penalties_a || 0)) {
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
      });

    // Calcular Saldo de Gols e Ordenar pelos critérios oficiais
    const rows = Object.values(table).map((r) => ({
      ...r,
      goal_diff: r.goals_for - r.goals_against,
    }));

    return rows.sort((a, b) => {
      // 1. Pontos
      if (b.points !== a.points) return b.points - a.points;
      // 2. Número de Vitórias
      if (b.won !== a.won) return b.won - a.won;
      // 3. Saldo de Gols / Pontos
      if (b.goal_diff !== a.goal_diff) return b.goal_diff - a.goal_diff;
      // 4. Gols / Pontos Pró
      if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
      // 5. Menor número de gols sofridos
      return a.goals_against - b.goals_against;
    });
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Modalidade Coletiva */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {collectiveModalities.map((m) => {
          const active = selectedModalityId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModalityId(m.id)}
              className={`px-4 py-2 rounded-m3-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-m3-primary text-white border-m3-primary shadow-sm dark:bg-m3-primary-dark dark:text-black'
                  : 'bg-m3-surface dark:bg-m3-surface-dark text-slate-700 dark:text-slate-300 border-m3-outline-variant hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {m.name} ({m.category})
            </button>
          );
        })}
      </div>

      {/* Regra de Pontuação em Destaque */}
      {selectedModality && (
        <div className="p-3.5 rounded-m3-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
          <HelpCircle size={18} className="flex-shrink-0 mt-0.5 text-m3-primary dark:text-m3-primary-dark" />
          <div>
            <span className="font-bold">Critérios e Formato: </span>
            <span>{selectedModality.rules_summary}</span>
          </div>
        </div>
      )}

      {/* Tabelas de Classificação por Grupo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(groups).map(([groupName, gTeams]) => {
          const standings = computeGroupStandings(groupName, gTeams);
          return (
            <M3Card key={groupName} variant="elevated" className="overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-m3-outline-variant/30">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white font-['Outfit']">
                    {groupName}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {gTeams.length} equipes
                </span>
              </div>

              <div className="overflow-x-auto -mx-4 sm:-mx-5">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-semibold border-b border-m3-outline-variant/30">
                      <th className="py-2.5 pl-4 sm:pl-5 pr-2 w-10">Pos</th>
                      <th className="py-2.5 px-3">Equipe</th>
                      <th className="py-2.5 px-2 text-center" title="Pontos">PTS</th>
                      <th className="py-2.5 px-2 text-center" title="Jogos">J</th>
                      <th className="py-2.5 px-2 text-center" title="Vitórias">V</th>
                      <th className="py-2.5 px-2 text-center" title="Empates">E</th>
                      <th className="py-2.5 px-2 text-center" title="Derrotas">D</th>
                      <th className="py-2.5 px-2 text-center hidden sm:table-cell" title="Gols/Pontos Pró">GP</th>
                      <th className="py-2.5 px-2 text-center hidden sm:table-cell" title="Gols/Pontos Contra">GC</th>
                      <th className="py-2.5 pr-4 sm:pr-5 pl-2 text-center font-bold" title="Saldo">SG</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-m3-outline-variant/20">
                    {standings.map((row, idx) => {
                      const isTopZone = idx === 0;
                      return (
                        <tr
                          key={row.team_id}
                          className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                            isTopZone ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                          }`}
                        >
                          <td className="py-3 pl-4 sm:pl-5 pr-2 font-bold text-center">
                            <span
                              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                                idx === 0
                                  ? 'bg-amber-400 text-black font-extrabold'
                                  : idx === 1
                                  ? 'bg-slate-300 text-slate-800'
                                  : 'text-slate-500'
                              }`}
                            >
                              {idx + 1}º
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <TeamAvatar avatarKey={row.avatar_key} name={row.team_name} size="sm" />
                              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-none">
                                {row.team_name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-2 text-center font-black text-sm sm:text-base text-m3-primary dark:text-m3-primary-dark">
                            {row.points}
                          </td>
                          <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-400">{row.played}</td>
                          <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-400">{row.won}</td>
                          <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-400">{row.drawn}</td>
                          <td className="py-3 px-2 text-center text-slate-600 dark:text-slate-400">{row.lost}</td>
                          <td className="py-3 px-2 text-center text-slate-500 hidden sm:table-cell">{row.goals_for}</td>
                          <td className="py-3 px-2 text-center text-slate-500 hidden sm:table-cell">{row.goals_against}</td>
                          <td className={`py-3 pr-4 sm:pr-5 pl-2 text-center font-semibold ${row.goal_diff > 0 ? 'text-emerald-600 dark:text-emerald-400' : row.goal_diff < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'}`}>
                            {row.goal_diff > 0 ? `+${row.goal_diff}` : row.goal_diff}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </M3Card>
          );
        })}
      </div>
    </div>
  );
};
