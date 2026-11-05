import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Match,
  Modality,
  CollectiveTeam,
  Campus,
  Notice,
  DistanceRecord,
  IFB_UNITS,
} from '../../types/database';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Badge } from '../m3/M3Badge';
import { M3Card } from '../m3/M3Card';
import {
  Clock,
  MapPin,
  Calendar,
  Flame,
  AlertCircle,
  Footprints,
  Newspaper,
  ChevronRight,
  Trophy,
  Filter,
} from 'lucide-react';
import {
  getTeamAvatarKey,
  getModalityDisplayName,
  formatScoreDisplay,
} from '../../lib/matchHelpers';

export interface LiveScoreboardProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
  campuses: Campus[];
  notices: Notice[];
  distances: DistanceRecord[];
  onNavigateToNews?: () => void;
}

export const LiveScoreboard: React.FC<LiveScoreboardProps> = ({
  matches,
  modalities,
  teams,
  campuses,
  notices,
  distances,
  onNavigateToNews,
}) => {
  // Filtros do Dashboard
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ao Vivo' | 'Finalizado' | 'Agendado'>('all');

  // Helper para conversão de data/hora para ordenação cronológica estrita
  const parseDateTime = (d?: string, t?: string): number => {
    if (!d || d === 'A definir') return Number.MAX_SAFE_INTEGER;
    const parts = d.split('/').map(Number);
    const day = parts[0] || 1;
    const month = (parts[1] || 1) - 1;
    const year = parts[2] || 2026;
    let hours = 0;
    let minutes = 0;
    if (t && t.includes(':')) {
      const timeParts = t.split(':').map(Number);
      hours = timeParts[0] || 0;
      minutes = timeParts[1] || 0;
    }
    return new Date(year, month, day, hours, minutes).getTime();
  };

  // Extrair e ordenar todas as datas únicas das partidas em ordem cronológica
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(matches.map((m) => m.match_date).filter(Boolean)));
    return dates.sort((a, b) => {
      return parseDateTime(a) - parseDateTime(b);
    });
  }, [matches]);

  // Se datas da lista estiverem vazias, fornece fallback oficial
  const datesList = availableDates.length > 0 ? availableDates : ['07/11/2026', '10/11/2026', '11/11/2026', '12/11/2026', '13/11/2026', '14/11/2026'];

  // Listas ordenadas alfabeticamente para os filtros
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [teams]);

  const sortedModalities = useMemo(() => {
    return [...modalities].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [modalities]);

  const sortedVenues = useMemo(() => {
    return [...IFB_UNITS].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, []);

  // Filtragem composta com ordenação cronológica estrita (da primeira data até a última data futura)
  const filteredMatches = useMemo(() => {
    return matches
      .filter((m) => {
        const matchDate = selectedDate === 'all' || m.match_date === selectedDate;
        const matchModality = selectedModality === 'all' || m.modality_id === selectedModality;
        const matchTeam =
          selectedTeam === 'all' ||
          m.team_a_id === selectedTeam ||
          m.team_b_id === selectedTeam ||
          m.team_a_name === selectedTeam ||
          m.team_b_name === selectedTeam;
        const matchVenue = selectedVenue === 'all' || m.venue === selectedVenue;
        const matchStatus = statusFilter === 'all' || m.status === statusFilter;

        return matchDate && matchModality && matchTeam && matchVenue && matchStatus;
      })
      .sort((a, b) => parseDateTime(a.match_date, a.match_time) - parseDateTime(b.match_date, b.match_time));
  }, [matches, selectedDate, selectedModality, selectedTeam, selectedVenue, statusFilter]);

  const liveMatches = matches.filter((m) => m.status === 'Ao Vivo');

  // Cálculos do Desafio da Caminhada & Corrida
  const distanceByCampus = useMemo(() => {
    const totals: Record<string, { campus: Campus; totalKm: number; participantsCount: number }> = {};
    campuses.forEach((c) => {
      totals[c.id] = { campus: c, totalKm: 0, participantsCount: 0 };
    });

    distances.forEach((d) => {
      if (totals[d.campus_id]) {
        totals[d.campus_id].totalKm += Number(d.distance_km || 0);
        totals[d.campus_id].participantsCount += 1;
      }
    });

    return Object.values(totals).sort((a, b) => b.totalKm - a.totalKm);
  }, [campuses, distances]);

  const topRunners = useMemo(() => {
    const totals: Record<string, { id: string; participant_name: string; campus_id: string; totalKm: number }> = {};
    distances.forEach((d) => {
      const key = d.participant_name.trim();
      if (!totals[key]) {
        totals[key] = { id: d.id, participant_name: key, campus_id: d.campus_id, totalKm: 0 };
      }
      totals[key].totalKm += Number(d.distance_km || 0);
    });
    return Object.values(totals)
      .sort((a, b) => b.totalKm - a.totalKm)
      .slice(0, 5);
  }, [distances]);

  const getCampusShortName = (campusId: string) => {
    return campuses.find((c) => c.id === campusId)?.short_name || campusId;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ============================================================ */}
      {/* COLUNA PRINCIPAL (8 colunas): FOCO NAS MODALIDADES COLETIVAS */}
      {/* ============================================================ */}
      <div className="lg:col-span-8 space-y-6">
        {/* 1. JOGOS AO VIVO (COM PULSO TÉRMICO) */}
        {liveMatches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 sm:p-5 rounded-m3-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-m3-2"
            role="region"
            aria-label="Partidas acontecendo ao vivo"
          >
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 animate-pulse text-amber-200" />
              <h2 className="text-sm sm:text-base font-black tracking-wider uppercase font-['Outfit']">
                Jogos Acontecendo Agora • Tempo Real
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {liveMatches.map((m) => {
                const { displayScoreA, displayScoreB } = formatScoreDisplay(m);
                return (
                  <div
                    key={m.id}
                    className="bg-black/35 backdrop-blur-md rounded-m3-md p-3.5 border border-white/15 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <TeamAvatar avatarKey={getTeamAvatarKey(teams, m.team_a_id)} name={m.team_a_name} size="sm" />
                      <span className="font-bold text-xs sm:text-sm truncate">{m.team_a_name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-lg sm:text-xl font-black bg-white/20 px-3 py-1 rounded-m3-sm shrink-0">
                      <span>{displayScoreA}</span>
                      <span className="text-xs text-white/70 font-sans">x</span>
                      <span>{displayScoreB}</span>
                    </div>
                    <div className="flex items-center gap-2.5 min-w-0 justify-end">
                      <span className="font-bold text-xs sm:text-sm truncate text-right">{m.team_b_name}</span>
                      <TeamAvatar avatarKey={getTeamAvatarKey(teams, m.team_b_id)} name={m.team_b_name} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* 2. PAINEL DE FILTROS & CALENDÁRIO */}
        <div className="bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg border border-m3-outline-variant/30 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-m3-primary dark:text-m3-primary-dark" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Programação & Filtros de Jogos
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-m3-surface-variant dark:bg-m3-surface-variant-dark text-slate-600 dark:text-slate-300 font-semibold">
                {filteredMatches.length} {filteredMatches.length === 1 ? 'evento' : 'eventos'}
              </span>
            </div>
            {(selectedDate !== 'all' ||
              selectedModality !== 'all' ||
              selectedTeam !== 'all' ||
              selectedVenue !== 'all' ||
              statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSelectedDate('all');
                  setSelectedModality('all');
                  setSelectedTeam('all');
                  setSelectedVenue('all');
                  setStatusFilter('all');
                }}
                className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:underline transition-colors"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* 1. Data (Ordenada cronologicamente) */}
            <div>
              <label htmlFor="filter-date" className="block text-[11px] font-semibold text-slate-500 mb-1">
                Data do Jogo / Evento:
              </label>
              <select
                id="filter-date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full text-xs font-semibold rounded-m3-md bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
              >
                <option value="all">Todas as Datas</option>
                {datesList.map((d) => {
                  const count = matches.filter((m) => m.match_date === d).length;
                  return (
                    <option key={d} value={d}>
                      {d} {count > 0 ? `(${count})` : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* 2. Modalidade (Ordenada alfabeticamente) */}
            <div>
              <label htmlFor="filter-modality" className="block text-[11px] font-semibold text-slate-500 mb-1">
                Modalidade:
              </label>
              <select
                id="filter-modality"
                value={selectedModality}
                onChange={(e) => setSelectedModality(e.target.value)}
                className="w-full text-xs font-semibold rounded-m3-md bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
              >
                <option value="all">Todas as Modalidades</option>
                {sortedModalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Equipe / Delegação (Ordenada alfabeticamente) */}
            <div>
              <label htmlFor="filter-team" className="block text-[11px] font-semibold text-slate-500 mb-1">
                Equipe / Delegação:
              </label>
              <select
                id="filter-team"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full text-xs font-semibold rounded-m3-md bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
              >
                <option value="all">Todas as Equipes</option>
                {sortedTeams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Local (Ordenada alfabeticamente) */}
            <div>
              <label htmlFor="filter-venue" className="block text-[11px] font-semibold text-slate-500 mb-1">
                Local (Unidade IFB):
              </label>
              <select
                id="filter-venue"
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full text-xs font-semibold rounded-m3-md bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
              >
                <option value="all">Todos os Locais</option>
                {sortedVenues.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Status (Ordenado alfabeticamente) */}
            <div>
              <label htmlFor="filter-status" className="block text-[11px] font-semibold text-slate-500 mb-1">
                Status:
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full text-xs font-semibold rounded-m3-md bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
              >
                <option value="all">Todos os Status</option>
                <option value="Agendado">Agendado</option>
                <option value="Ao Vivo">Ao Vivo</option>
                <option value="Finalizado">Finalizado</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. GRADE PRINCIPAL DE JOGOS & CONFRONTOS */}
        <section aria-label="Grade de Partidas">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12 bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant p-8">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Nenhum evento ou confronto encontrado</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Altere a data ou os filtros acima para visualizar os outros jogos do cronograma.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredMatches.map((match) => {
                  const isSingleEvent = !match.team_b_name || !match.team_b_name.trim();
                  const { displayScoreA, displayScoreB } = formatScoreDisplay(match);

                  return (
                    <motion.div
                      key={match.id}
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.15 }}
                    >
                      <M3Card
                        variant="elevated"
                        className="relative flex flex-col justify-between hover:border-m3-primary/40 transition-colors border border-m3-outline-variant/30 h-full"
                      >
                        {/* Header do Card */}
                        <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-m3-outline-variant/30 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-m3-primary dark:text-m3-primary-dark">
                            <span>{getModalityDisplayName(modalities, match.modality_id)}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-slate-600 dark:text-slate-300 font-medium">
                              {match.group_name || match.phase}
                            </span>
                          </div>
                          <M3Badge status={match.status} />
                        </div>

                        {/* Corpo: Evento Único vs Confronto Coletivo */}
                        {isSingleEvent ? (
                          <div className="py-4 px-2 flex items-center gap-3.5 my-auto">
                            <div className="w-12 h-12 rounded-m3-md bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                              <Footprints className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 inline-block mb-1">
                                Prova / Evento Programado
                              </span>
                              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug truncate">
                                {match.team_a_name}
                              </h4>
                              {match.sets_detail && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                  {match.sets_detail}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-5 items-center gap-2 py-3">
                            {/* Equipe A */}
                            <div className="col-span-2 flex flex-col items-center text-center gap-2">
                              <TeamAvatar avatarKey={getTeamAvatarKey(teams, match.team_a_id)} name={match.team_a_name} size="md" />
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                {match.team_a_name}
                              </span>
                              {match.score_penalties_a !== null && match.score_penalties_a !== undefined && (
                                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  Pên: {match.score_penalties_a}
                                </span>
                              )}
                            </div>

                            {/* Placar Central */}
                            <div className="col-span-1 flex flex-col items-center justify-center">
                              <div
                                className="flex items-center gap-1.5 font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight"
                                aria-label={`Placar: ${match.team_a_name} ${displayScoreA}, ${match.team_b_name} ${displayScoreB}`}
                              >
                                <span>{displayScoreA}</span>
                                <span className="text-xs font-normal text-slate-400 font-sans">x</span>
                                <span>{displayScoreB}</span>
                              </div>
                              {match.sets_detail && (
                                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 text-center">
                                  {match.sets_detail}
                                </span>
                              )}
                            </div>

                            {/* Equipe B */}
                            <div className="col-span-2 flex flex-col items-center text-center gap-2">
                              <TeamAvatar avatarKey={getTeamAvatarKey(teams, match.team_b_id)} name={match.team_b_name} size="md" />
                              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-tight">
                                {match.team_b_name}
                              </span>
                              {match.score_penalties_b !== null && match.score_penalties_b !== undefined && (
                                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  Pên: {match.score_penalties_b}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Rodapé do Card com Data, Horário e Unidade IFB */}
                        <div className="mt-3 pt-2.5 border-t border-m3-outline-variant/30 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={13} className="text-slate-400" />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{match.match_date}</span>
                            <span className="mx-1">•</span>
                            <Clock size={13} className="text-slate-400" />
                            <span>{match.match_time}</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold truncate max-w-[48%] text-right text-m3-primary dark:text-m3-primary-dark">
                            <MapPin size={13} className="flex-shrink-0" />
                            <span className="truncate">{match.venue}</span>
                          </div>
                        </div>
                      </M3Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* ============================================================ */}
      {/* ÁREA LATERAL / SIDEBAR (4 colunas): NOTÍCIAS & CORRIDA       */}
      {/* ============================================================ */}
      <aside className="lg:col-span-4 space-y-6" aria-label="Painel Lateral Informativo">
        {/* 1. SEÇÃO DE NOTÍCIAS & COMUNICADOS OFICIAIS */}
        {notices.length > 0 && (
          <section aria-label="Últimas Notícias e Comunicados Oficiais">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold font-['Outfit'] flex items-center gap-2 text-slate-900 dark:text-white">
                <Newspaper className="w-4 h-4 text-m3-primary dark:text-m3-primary-dark" />
                Notícias & Comunicados
              </h2>
              {onNavigateToNews && (
                <button
                  onClick={onNavigateToNews}
                  className="text-xs font-bold text-m3-primary dark:text-m3-primary-dark hover:underline flex items-center gap-0.5"
                >
                  Ver todas ({notices.length})
                  <ChevronRight size={13} />
                </button>
              )}
            </div>

            <div className="space-y-3">
              {notices.slice(0, 3).map((notice) => (
                <M3Card
                  key={notice.id}
                  variant="elevated"
                  className="relative flex flex-col justify-between overflow-hidden group hover:border-m3-primary/50 transition-all border border-m3-outline-variant/30 p-3"
                >
                  {notice.image_url && (
                    <div className="h-28 -mx-3 -mt-3 mb-2.5 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <img
                        src={notice.image_url}
                        alt={notice.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-slate-500">
                      <span className="px-2 py-0.5 rounded-full bg-m3-primary/10 text-m3-primary dark:text-m3-primary-dark font-bold">
                        {notice.category}
                      </span>
                      <span>
                        {new Date(notice.published_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 mb-1">
                      {notice.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                      {notice.summary || notice.content}
                    </p>
                  </div>
                </M3Card>
              ))}
            </div>
          </section>
        )}

        {/* 2. CARD ESPECIAL: DESAFIO DE CORRIDA & CAMINHADA (ACUMULADO) */}
        <section aria-label="Desafio de Caminhada e Corrida dos Servidores">
          <M3Card variant="elevated" className="overflow-hidden border border-emerald-500/20 p-4">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-m3-outline-variant/30">
              <div className="flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold font-['Outfit'] text-slate-900 dark:text-white">
                  Desafio da Caminhada & Corrida
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 font-bold">
                Acumulado
              </span>
            </div>

            <div className="space-y-4">
              {/* Ranking por Campus */}
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                  <Trophy size={13} className="text-amber-500" />
                  Total Acumulado por Campus
                </h4>
                <div className="space-y-2">
                  {distanceByCampus.slice(0, 5).map((row, idx) => {
                    const maxKm = distanceByCampus[0]?.totalKm || 1;
                    const pct = Math.max(5, (row.totalKm / maxKm) * 100);
                    return (
                      <div key={row.campus.id} className="text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="flex items-center gap-1.5 truncate max-w-[70%]">
                            <span className="w-4 text-center font-bold text-slate-400 text-[11px]">{idx + 1}º</span>
                            <span className="text-slate-800 dark:text-slate-200 truncate">{row.campus.name}</span>
                          </span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                            {row.totalKm.toFixed(1)} km
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Servidores com Maiores Distâncias */}
              <div className="pt-2 border-t border-m3-outline-variant/20">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                  <Footprints size={13} className="text-emerald-500" />
                  Top Servidores (Km Total)
                </h4>
                <div className="divide-y divide-m3-outline-variant/20 text-xs">
                  {topRunners.map((runner, idx) => (
                    <div key={runner.id} className="py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate max-w-[72%]">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                          idx === 0 ? 'bg-amber-400 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-700 text-white' : 'text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="truncate">
                          <div className="font-bold text-slate-900 dark:text-white truncate text-[11px]">{runner.participant_name}</div>
                          <div className="text-[10px] text-slate-400">{getCampusShortName(runner.campus_id)}</div>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 shrink-0">
                        {runner.totalKm.toFixed(1)} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </M3Card>
        </section>
      </aside>
    </div>
  );
};
