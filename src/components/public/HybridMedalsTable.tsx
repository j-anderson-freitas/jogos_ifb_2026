import React, { useState } from 'react';
import { Campus, IndividualPodium, Match, CollectiveTeam, IndividualParticipant } from '../../types/database';
import { M3Card } from '../m3/M3Card';
import {
  Trophy,
  Medal,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';

export interface HybridMedalsTableProps {
  campuses: Campus[];
  matches: Match[];
  teams: CollectiveTeam[];
  podiums: IndividualPodium[];
  participants: IndividualParticipant[];
}

export const HybridMedalsTable: React.FC<HybridMedalsTableProps> = ({
  campuses,
  matches,
  teams,
  podiums,
}) => {
  const [viewMode, setViewMode] = useState<'hybrid' | 'olympic' | 'points'>('hybrid');

  // Computar Quadro Oficial de Medalhas e Pontos por Campus (1º = 10 pts, 2º = 7 pts, 3º = 5 pts)
  const scores: Record<string, {
    campus: Campus;
    gold: number;
    silver: number;
    bronze: number;
    total_medals: number;
    total_points: number;
  }> = {};

  campuses.forEach((c) => {
    scores[c.id] = {
      campus: c,
      gold: 0,
      silver: 0,
      bronze: 0,
      total_medals: 0,
      total_points: 0,
    };
  });

  // 1. Somar medalhas de pódios lançados
  podiums.forEach((p) => {
    const sc = scores[p.campus_id];
    if (!sc) return;

    if (p.position === 1) {
      sc.gold += 1;
      sc.total_points += 10;
    } else if (p.position === 2) {
      sc.silver += 1;
      sc.total_points += 7;
    } else if (p.position === 3) {
      sc.bronze += 1;
      sc.total_points += 5;
    }
    sc.total_medals += 1;
  });

  // 2. Somar medalhas de modalidades coletivas (Finais e Disputas de 3º) caso ainda não lançadas como pódio
  const finals = matches.filter((m) => m.phase === 'Final' && m.status === 'Finalizado');
  finals.forEach((m) => {
    // Se já houver pódio lançado para esta modalidade, não duplicar
    if (podiums.some((p) => p.modality_id === m.modality_id)) return;

    const winnerId = m.score_a > m.score_b ? m.team_a_id : m.score_b > m.score_a ? m.team_b_id : null;
    const runnerUpId = m.score_a > m.score_b ? m.team_b_id : m.score_b > m.score_a ? m.team_a_id : null;

    const winnerTeam = teams.find((t) => t.id === winnerId);
    const runnerTeam = teams.find((t) => t.id === runnerUpId);

    if (winnerTeam?.campus_id && scores[winnerTeam.campus_id]) {
      scores[winnerTeam.campus_id].gold += 1;
      scores[winnerTeam.campus_id].total_points += 10;
      scores[winnerTeam.campus_id].total_medals += 1;
    }
    if (runnerTeam?.campus_id && scores[runnerTeam.campus_id]) {
      scores[runnerTeam.campus_id].silver += 1;
      scores[runnerTeam.campus_id].total_points += 7;
      scores[runnerTeam.campus_id].total_medals += 1;
    }
  });

  const thirdPlaces = matches.filter((m) => m.phase === 'Disputa 3º Lugar' && m.status === 'Finalizado');
  thirdPlaces.forEach((m) => {
    if (podiums.some((p) => p.modality_id === m.modality_id)) return;

    const thirdId = m.score_a > m.score_b ? m.team_a_id : m.team_b_id;
    const thirdTeam = teams.find((t) => t.id === thirdId);
    if (thirdTeam?.campus_id && scores[thirdTeam.campus_id]) {
      scores[thirdTeam.campus_id].bronze += 1;
      scores[thirdTeam.campus_id].total_points += 5;
      scores[thirdTeam.campus_id].total_medals += 1;
    }
  });

  // Ordenação de acordo com o modo escolhido
  const sortedList = Object.values(scores).sort((a, b) => {
    if (viewMode === 'olympic') {
      if (b.gold !== a.gold) return b.gold - a.gold;
      if (b.silver !== a.silver) return b.silver - a.silver;
      if (b.bronze !== a.bronze) return b.bronze - a.bronze;
      return b.total_medals - a.total_medals;
    }
    // Modo Híbrido e Apenas Pontos: Pontos Totais (10/7/5) > Ouros > Pratas > Total Medalhas
    if (b.total_points !== a.total_points) return b.total_points - a.total_points;
    if (b.gold !== a.gold) return b.gold - a.gold;
    if (b.silver !== a.silver) return b.silver - a.silver;
    return b.total_medals - a.total_medals;
  });

  const maxPoints = sortedList[0]?.total_points || 1;

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Seção e Alternador de Modo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 sm:p-5 rounded-m3-lg border border-m3-outline-variant/30">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-['Outfit'] text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="text-amber-500 w-6 h-6" />
            Pontuação Geral dos Jogos • JIS-IFB 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {viewMode === 'hybrid' && 'Modelo Ponderado Oficial: 1º Lugar (Ouro) = 10 pts, 2º Lugar (Prata) = 7 pts, 3º Lugar (Bronze) = 5 pts'}
            {viewMode === 'olympic' && 'Quadro Olímpico: Ordenação prioritária por Ouro > Prata > Bronze'}
            {viewMode === 'points' && 'Apenas Pontuação: Comparativo da pontuação ponderada oficial por Campus'}
          </p>
        </div>

        {/* Seletor Segmentado de Visualização */}
        <div className="inline-flex rounded-m3-full p-1 bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border border-m3-outline-variant/40 self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setViewMode('hybrid')}
            className={`px-3.5 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
              viewMode === 'hybrid'
                ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Modelo Híbrido
          </button>
          <button
            onClick={() => setViewMode('olympic')}
            className={`px-3.5 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
              viewMode === 'olympic'
                ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Quadro Olímpico
          </button>
          <button
            onClick={() => setViewMode('points')}
            className={`px-3.5 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
              viewMode === 'points'
                ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-extrabold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Apenas Pontos
          </button>
        </div>
      </div>

      {/* Destaque do Top 3 (Pódio Geral da Competição) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sortedList.slice(0, 3).map((item, index) => {
          const podiumStyles = [
            'from-amber-400 via-yellow-500 to-amber-600 text-black',
            'from-slate-300 via-slate-400 to-slate-500 text-slate-900',
            'from-amber-700 via-amber-800 to-amber-900 text-white',
          ];

          const medalNames = ['1º Lugar • Ouro', '2º Lugar • Prata', '3º Lugar • Bronze'];

          return (
            <M3Card
              key={item.campus.id}
              variant="elevated"
              className="relative flex flex-col justify-between overflow-hidden p-5 border border-m3-outline-variant/30"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {medalNames[index]}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-m3-full text-xs font-black shadow-sm bg-gradient-to-r ${podiumStyles[index]}`}
                >
                  {index + 1}º Campus
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">
                  {item.campus.name}
                </h3>
                <p className="text-xs text-slate-500">{item.campus.city}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-m3-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-amber-500">🥇 {item.gold}</span>
                  <span className="font-bold text-slate-400">🥈 {item.silver}</span>
                  <span className="font-bold text-amber-700">🥉 {item.bronze}</span>
                </div>
                <div className="font-black text-sm text-m3-primary dark:text-m3-primary-dark">
                  {item.total_points} pts
                </div>
              </div>
            </M3Card>
          );
        })}
      </div>

      {/* Tabela de Classificação Reconfigurável Dinâmica */}
      <M3Card variant="elevated" className="overflow-hidden border border-m3-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-semibold border-b border-m3-outline-variant/30">
                <th className="py-3 pl-4 sm:pl-6 pr-2 w-12 text-center">Pos</th>
                <th className="py-3 px-3">Campus / Unidade IFB</th>

                {/* Colunas no Modo Olímpico */}
                {viewMode === 'olympic' && (
                  <>
                    <th className="py-3 px-3 text-center text-amber-600 font-bold bg-amber-50/40 dark:bg-amber-950/20">
                      🥇 Ouro
                    </th>
                    <th className="py-3 px-3 text-center text-slate-500 font-bold bg-slate-100/40 dark:bg-slate-800/20">
                      🥈 Prata
                    </th>
                    <th className="py-3 px-3 text-center text-amber-800 font-bold bg-amber-950/10">
                      🥉 Bronze
                    </th>
                    <th className="py-3 pr-4 sm:pr-6 pl-3 text-center font-black text-m3-primary dark:text-m3-primary-dark">
                      Total Medalhas
                    </th>
                  </>
                )}

                {/* Colunas no Modo Híbrido Oficial */}
                {viewMode === 'hybrid' && (
                  <>
                    <th className="py-3 px-3 text-center text-amber-600 font-bold">🥇 Ouro (10 pts)</th>
                    <th className="py-3 px-3 text-center text-slate-500 font-bold">🥈 Prata (7 pts)</th>
                    <th className="py-3 px-3 text-center text-amber-800 font-bold">🥉 Bronze (5 pts)</th>
                    <th className="py-3 px-3 text-center text-slate-500 hidden md:table-cell">Total Medalhas</th>
                    <th className="py-3 pr-4 sm:pr-6 pl-3 text-center font-black text-m3-primary dark:text-m3-primary-dark bg-emerald-50/50 dark:bg-emerald-950/20">
                      Pontos Totais
                    </th>
                  </>
                )}

                {/* Colunas no Modo Apenas Pontos */}
                {viewMode === 'points' && (
                  <>
                    <th className="py-3 px-3 text-center text-amber-600 font-bold">
                      Ouros (10 pts)
                    </th>
                    <th className="py-3 px-3 text-center text-slate-500 font-bold">
                      Pratas (7 pts)
                    </th>
                    <th className="py-3 px-3 text-center text-amber-800 font-bold">
                      Bronzes (5 pts)
                    </th>
                    <th className="py-3 px-4 text-center font-black text-m3-primary dark:text-m3-primary-dark bg-emerald-50/50 dark:bg-emerald-950/20">
                      Total de Pontos
                    </th>
                    <th className="py-3 pr-4 sm:pr-6 pl-3 text-left w-48 hidden lg:table-cell">
                      Desempenho Relativo
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-m3-outline-variant/20">
              {sortedList.map((row, idx) => {
                const isLeader = idx === 0;
                const pct = maxPoints > 0 ? Math.max(5, (row.total_points / maxPoints) * 100) : 0;

                return (
                  <tr
                    key={row.campus.id}
                    className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                      isLeader && row.total_points > 0 ? 'bg-amber-50/30 dark:bg-amber-950/15' : ''
                    }`}
                  >
                    <td className="py-3.5 pl-4 sm:pl-6 pr-2 font-bold text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                          idx === 0 && row.total_points > 0
                            ? 'bg-amber-400 text-black font-black shadow-sm'
                            : idx === 1 && row.total_points > 0
                            ? 'bg-slate-300 text-slate-900 font-bold'
                            : idx === 2 && row.total_points > 0
                            ? 'bg-amber-700 text-white font-bold'
                            : 'text-slate-500'
                        }`}
                      >
                        {idx + 1}º
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Building2 size={16} className="text-slate-400 flex-shrink-0" />
                        <span>{row.campus.name}</span>
                      </div>
                    </td>

                    {/* Dados Modo Olímpico */}
                    {viewMode === 'olympic' && (
                      <>
                        <td className="py-3.5 px-3 text-center font-bold text-amber-600 bg-amber-50/20 dark:bg-amber-950/10">
                          {row.gold}
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-slate-500 bg-slate-100/20 dark:bg-slate-800/10">
                          {row.silver}
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-amber-800 bg-amber-950/5">
                          {row.bronze}
                        </td>
                        <td className="py-3.5 pr-4 sm:pr-6 pl-3 text-center font-black text-base text-slate-900 dark:text-white">
                          {row.total_medals}
                        </td>
                      </>
                    )}

                    {/* Dados Modo Híbrido Oficial */}
                    {viewMode === 'hybrid' && (
                      <>
                        <td className="py-3.5 px-3 text-center font-bold text-amber-600">{row.gold}</td>
                        <td className="py-3.5 px-3 text-center font-bold text-slate-500">{row.silver}</td>
                        <td className="py-3.5 px-3 text-center font-bold text-amber-800">{row.bronze}</td>
                        <td className="py-3.5 px-3 text-center text-slate-500 hidden md:table-cell">{row.total_medals}</td>
                        <td className="py-3.5 pr-4 sm:pr-6 pl-3 text-center font-black text-base sm:text-lg text-m3-primary dark:text-m3-primary-dark bg-emerald-50/40 dark:bg-emerald-950/20">
                          {row.total_points} pts
                        </td>
                      </>
                    )}

                    {/* Dados Modo Apenas Pontos */}
                    {viewMode === 'points' && (
                      <>
                        <td className="py-3.5 px-3 text-center font-bold text-amber-600">
                          {row.gold} ({row.gold * 10} pts)
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-slate-500">
                          {row.silver} ({row.silver * 7} pts)
                        </td>
                        <td className="py-3.5 px-3 text-center font-bold text-amber-800">
                          {row.bronze} ({row.bronze * 5} pts)
                        </td>
                        <td className="py-3.5 px-4 text-center font-black text-base sm:text-lg text-m3-primary dark:text-m3-primary-dark bg-emerald-50/40 dark:bg-emerald-950/20">
                          {row.total_points} pts
                        </td>
                        <td className="py-3.5 pr-4 sm:pr-6 pl-3 hidden lg:table-cell">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-m3-primary dark:bg-m3-primary-dark h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </td>
                      </>
                    )}
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
