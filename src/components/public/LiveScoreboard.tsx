import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Match, Modality, CollectiveTeam } from '../../types/database';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Badge } from '../m3/M3Badge';
import { M3Card } from '../m3/M3Card';
import { Clock, MapPin, Calendar, Flame, AlertCircle } from 'lucide-react';

export interface LiveScoreboardProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
}

export const LiveScoreboard: React.FC<LiveScoreboardProps> = ({
  matches,
  modalities,
  teams,
}) => {
  const [selectedModality, setSelectedModality] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Ao Vivo' | 'Finalizado' | 'Agendado'>('all');

  const filteredMatches = matches.filter((m) => {
    const matchModality = selectedModality === 'all' || m.modality_id === selectedModality;
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchModality && matchStatus;
  });

  const liveMatches = matches.filter((m) => m.status === 'Ao Vivo');

  const getTeamAvatar = (teamId?: string) => {
    const t = teams.find((item) => item.id === teamId);
    return t ? t.avatar_key : '';
  };

  const getModalityName = (modalityId: string) => {
    const mod = modalities.find((m) => m.id === modalityId);
    return mod ? `${mod.name} (${mod.category})` : modalityId;
  };

  return (
    <div className="space-y-6">
      {/* Banner de Partidas Ao Vivo (se houver) */}
      {liveMatches.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-m3-lg bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white shadow-m3-2"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 animate-pulse text-amber-200" />
            <h2 className="text-base sm:text-lg font-black tracking-wide uppercase font-['Outfit']">
              Jogos Acontecendo Agora • Tempo Real
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveMatches.map((m) => (
              <div
                key={m.id}
                className="bg-black/30 backdrop-blur-md rounded-m3-md p-3.5 border border-white/10 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <TeamAvatar avatarKey={getTeamAvatar(m.team_a_id)} name={m.team_a_name} size="sm" />
                  <span className="font-bold text-sm truncate">{m.team_a_name}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xl font-black bg-white/20 px-3 py-1 rounded-m3-sm">
                  <span>{m.score_a}</span>
                  <span className="text-xs text-white/70">x</span>
                  <span>{m.score_b}</span>
                </div>
                <div className="flex items-center gap-2.5 min-w-0 justify-end">
                  <span className="font-bold text-sm truncate text-right">{m.team_b_name}</span>
                  <TeamAvatar avatarKey={getTeamAvatar(m.team_b_id)} name={m.team_b_name} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Barra de Filtros M3 */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-m3-surface-container dark:bg-m3-surface-container-dark p-3.5 rounded-m3-lg">
        {/* Filtro por Modalidade */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className="text-xs sm:text-sm font-semibold rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary"
          >
            <option value="all">Todas as Modalidades</option>
            {modalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} - {m.category}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Status */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {(['all', 'Ao Vivo', 'Agendado', 'Finalizado'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-semibold rounded-m3-full transition-all ${
                statusFilter === st
                  ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
                  : 'bg-m3-surface dark:bg-m3-surface-dark text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? 'Todos os Status' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Partidas */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-12 bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant p-8">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">Nenhuma partida encontrada</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Altere os filtros acima para visualizar os outros confrontos dos Jogos de Integração.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredMatches.map((match) => (
              <M3Card
                key={match.id}
                variant="elevated"
                className="relative flex flex-col justify-between hover:border-m3-primary/40 transition-all border border-transparent"
              >
                {/* Header do Card */}
                <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-m3-outline-variant/30 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-m3-primary dark:text-m3-primary-dark">
                    <span>{getModalityName(match.modality_id)}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                      {match.group_name || match.phase}
                    </span>
                  </div>
                  <M3Badge status={match.status} />
                </div>

                {/* Confronto e Placar Principal */}
                <div className="grid grid-cols-5 items-center gap-2 py-3">
                  {/* Time A */}
                  <div className="col-span-2 flex flex-col items-center text-center gap-2">
                    <TeamAvatar avatarKey={getTeamAvatar(match.team_a_id)} name={match.team_a_name} size="md" />
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-tight">
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
                    <div className="flex items-center gap-1.5 font-mono text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      <span>{match.status === 'Agendado' ? '-' : match.score_a}</span>
                      <span className="text-xs font-normal text-slate-400 font-sans">x</span>
                      <span>{match.status === 'Agendado' ? '-' : match.score_b}</span>
                    </div>
                    {match.sets_detail && (
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1 text-center">
                        {match.sets_detail}
                      </span>
                    )}
                  </div>

                  {/* Time B */}
                  <div className="col-span-2 flex flex-col items-center text-center gap-2">
                    <TeamAvatar avatarKey={getTeamAvatar(match.team_b_id)} name={match.team_b_name} size="md" />
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-tight">
                      {match.team_b_name}
                    </span>
                    {match.score_penalties_b !== null && match.score_penalties_b !== undefined && (
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Pên: {match.score_penalties_b}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer do Card com Data, Horário e Praça Esportiva */}
                <div className="mt-3 pt-2.5 border-t border-m3-outline-variant/30 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{match.match_date}</span>
                    <span className="mx-1">•</span>
                    <Clock size={13} className="text-slate-400" />
                    <span>{match.match_time}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium truncate max-w-[45%] text-right">
                    <MapPin size={13} className="text-m3-primary dark:text-m3-primary-dark flex-shrink-0" />
                    <span className="truncate">{match.venue}</span>
                  </div>
                </div>
              </M3Card>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

