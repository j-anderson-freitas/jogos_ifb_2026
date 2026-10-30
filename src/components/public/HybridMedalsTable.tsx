import React, { useState } from 'react';
import { Campus, IndividualPodium, Match, CollectiveTeam, IndividualParticipant } from '../../types/database';
import { M3Card } from '../m3/M3Card';
import { Trophy, Medal, Award, Flame, Building2 } from 'lucide-react';

export interface HybridMedalsTableProps {
  campuses: Campus[];
  podiums: IndividualPodium[];
  matches: Match[];
  teams: CollectiveTeam[];
  participants: IndividualParticipant[];
}

export const HybridMedalsTable: React.FC<HybridMedalsTableProps> = ({
  campuses,
  podiums,
  matches,
  teams,
  participants,
}) => {
  const [viewMode, setViewMode] = useState<'hybrid' | 'olympic' | 'points'>('hybrid');

  // Computar Quadro de Medalhas e Pontos por Campus
  const scores: {
    [campusId: string]: {
      campus: Campus;
      gold: number;
      silver: number;
      bronze: number;
      total_medals: number;
      points: number;
      participations: number;
    };
  } = {};

  campuses.forEach((c) => {
    scores[c.id] = {
      campus: c,
      gold: 0,
      silver: 0,
      bronze: 0,
      total_medals: 0,
      points: 0,
      participations: 0,
    };
  });

  // 1. Somar pódios individuais
  podiums.forEach((p) => {
    const sc = scores[p.campus_id];
    if (!sc) return;

    if (p.position === 1) {
      sc.gold += 1;
      sc.points += 10;
    } else if (p.position === 2) {
      sc.silver += 1;
      sc.points += 7;
    } else if (p.position === 3) {
      sc.bronze += 1;
      sc.points += 5;
    }
    sc.total_medals += 1;
  });

  // 2. Somar medalhas de modalidades coletivas que já tiveram Final e Disputa de 3º finalizadas
  const finals = matches.filter((m) => m.phase === 'Final' && m.status === 'Finalizado');
  finals.forEach((m) => {
    const winnerId = m.score_a > m.score_b ? m.team_a_id : m.score_b > m.score_a ? m.team_b_id : null;
    const runnerUpId = m.score_a > m.score_b ? m.team_b_id : m.score_b > m.score_a ? m.team_a_id : null;

    const winnerTeam = teams.find((t) => t.id === winnerId);
    const runnerTeam = teams.find((t) => t.id === runnerUpId);

    if (winnerTeam?.campus_id && scores[winnerTeam.campus_id]) {
      scores[winnerTeam.campus_id].gold += 1;
      scores[winnerTeam.campus_id].points += 10;
      scores[winnerTeam.campus_id].total_medals += 1;
    }
    if (runnerTeam?.campus_id && scores[runnerTeam.campus_id]) {
      scores[runnerTeam.campus_id].silver += 1;
      scores[runnerTeam.campus_id].points += 7;
      scores[runnerTeam.campus_id].total_medals += 1;
    }
  });

  const thirdPlaces = matches.filter((m) => m.phase === 'Disputa 3º Lugar' && m.status === 'Finalizado');
  thirdPlaces.forEach((m) => {
    const thirdId = m.score_a > m.score_b ? m.team_a_id : m.team_b_id;
    const thirdTeam = teams.find((t) => t.id === thirdId);
    if (thirdTeam?.campus_id && scores[thirdTeam.campus_id]) {
      scores[thirdTeam.campus_id].bronze += 1;
      scores[thirdTeam.campus_id].points += 5;
      scores[thirdTeam.campus_id].total_medals += 1;
    }
  });

  // 3. Pontos de participação (equipes e servidores cadastrados)
  teams.forEach((t) => {
    if (t.campus_id && scores[t.campus_id]) {
      scores[t.campus_id].participations += 1;
      scores[t.campus_id].points += 1;
    }
  });
  participants.forEach((p) => {
    if (p.campus_id && scores[p.campus_id]) {
      scores[p.campus_id].participations += 1;
      scores[p.campus_id].points += 1;
    }
  });

  // Ordenação
  const sortedList = Object.values(scores).sort((a, b) => {
    if (viewMode === 'olympic') {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      return b.points - a.points;
    }
    // Modo Híbrido ou Points: ordenado pelos pontos somados
    if (b.points !== a.points) return b.points - a.points;
    if (b.gold !== a.gold) return b.gold - a.gold;
    return b.total_medals - a.total_medals;
  });

  return (
    <div className="space-y-6">
      {/* Header com Alternador de Visualização */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="text-amber-500 w-6 h-6" />
            Classificação Geral dos Campi • JIS-IFB 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pontuação ponderada oficial: 1º Lugar = 10 pts • 2º Lugar = 7 pts • 3º Lugar = 5 pts • Participação = 1 pt
          </p>
        </div>

        {/* Segmented Buttons M3 */}
        <div className="inline-flex rounded-m3-full p-1 bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border border-m3-outline-variant/40">
          <button
            onClick={() => setViewMode('hybrid')}
            className={`px-3 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
              viewMode === 'hybrid'
                ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Modelo Híbrido
          </button>
          <button
            onClick={() => setViewMode('olympic')}
            className={`px-3 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
              viewMode === 'olympic'
                ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Quadro Olímpico
          </button>
          <button
            onClick={() => setViewMode('points')}
            className={`px-3 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
              viewMode === 'points'
                ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Apenas Pontos
          </button>
        </div>
      </div>

      {/* Pódio dos Líderes Gerais (Top 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sortedList.slice(0, 3).map((item, idx) => {
          const colors = [
            'from-amber-400 via-yellow-500 to-amber-600 text-black',
            'from-slate-300 via-slate-400 to-slate-500 text-slate-900',
            'from-amber-700 via-amber-800 to-amber-900 text-white',
          ][idx];

          const medalLabels = ['1º LUGAR (LÍDER)', '2º LUGAR', '3º LUGAR'][idx];

          return (
            <M3Card
              key={item.campus.id}
              variant="elevated"
              className="relative flex flex-col justify-between overflow-hidden p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {medalLabels}
                </span>
                <span className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors} flex items-center justify-center font-black shadow-md text-sm`}>
                  {idx + 1}º
                </span>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-['Outfit']">
                  {item.campus.name}
                </h3>
                <p className="text-xs text-slate-500">{item.campus.city}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-m3-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Total de Pontos</span>
                  <div className="text-xl sm:text-2xl font-black text-m3-primary dark:text-m3-primary-dark font-mono">
                    {item.points} pts
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span title="Ouro" className="flex items-center gap-0.5 text-amber-500">
                    🥇 {item.gold}
                  </span>
                  <span title="Prata" className="flex items-center gap-0.5 text-slate-400">
                    🥈 {item.silver}
                  </span>
                  <span title="Bronze" className="flex items-center gap-0.5 text-amber-700">
                    🥉 {item.bronze}
                  </span>
                </div>
              </div>
            </M3Card>
          );
        })}
      </div>

      {/* Tabela Completa dos 10 Campi + Reitoria */}
      <M3Card variant="elevated" className="overflow-hidden p-0">
        <div className="p-4 sm:p-5 border-b border-m3-outline-variant/30 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-m3-primary" />
            Quadro Completo de Campi Participantes
          </h3>
          <span className="text-xs text-slate-500">11 Unidades do IFB</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-semibold border-b border-m3-outline-variant/30">
                <th className="py-3 pl-4 sm:pl-6 w-14 text-center">Pos</th>
                <th className="py-3 px-3">Campus / Unidade</th>
                <th className="py-3 px-2 text-center" title="Medalhas de Ouro">🥇 Ouro</th>
                <th className="py-3 px-2 text-center" title="Medalhas de Prata">🥈 Prata</th>
                <th className="py-3 px-2 text-center" title="Medalhas de Bronze">🥉 Bronze</th>
                <th className="py-3 px-2 text-center font-bold" title="Total de Medalhas">Total Med.</th>
                <th className="py-3 px-2 text-center text-slate-400 hidden sm:table-cell" title="Participações">Partic.</th>
                <th className="py-3 pr-4 sm:pr-6 pl-2 text-center font-black text-sm text-m3-primary dark:text-m3-primary-dark">
                  PONTOS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-m3-outline-variant/20">
              {sortedList.map((item, idx) => {
                const isLeader = idx === 0;
                return (
                  <tr
                    key={item.campus.id}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                      isLeader ? 'bg-amber-50/40 dark:bg-amber-950/20' : ''
                    }`}
                  >
                    <td className="py-3.5 pl-4 sm:pl-6 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          idx === 0
                            ? 'bg-amber-400 text-black font-extrabold'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800 font-bold'
                            : idx === 2
                            ? 'bg-amber-700 text-white font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {idx + 1}º
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{item.campus.name}</div>
                      <div className="text-[11px] text-slate-500">{item.campus.city}</div>
                    </td>
                    <td className="py-3.5 px-2 text-center font-bold text-amber-600 dark:text-amber-400">{item.gold}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-slate-500 dark:text-slate-300">{item.silver}</td>
                    <td className="py-3.5 px-2 text-center font-bold text-amber-800 dark:text-amber-600">{item.bronze}</td>
                    <td className="py-3.5 px-2 text-center font-black">{item.total_medals}</td>
                    <td className="py-3.5 px-2 text-center text-slate-400 hidden sm:table-cell">{item.participations}</td>
                    <td className="py-3.5 pr-4 sm:pr-6 pl-2 text-center font-mono font-black text-base text-m3-primary dark:text-m3-primary-dark">
                      {item.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </M3Card>
    </div>
  );
};
