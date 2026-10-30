import React, { useState } from 'react';
import { Match, Modality, CollectiveTeam } from '../../types/database';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Badge } from '../m3/M3Badge';
import { M3Card } from '../m3/M3Card';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';

export interface ScheduleViewProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  matches,
  modalities,
  teams,
}) => {
  const [selectedStage, setSelectedStage] = useState<'all' | 'Primeiro Lance' | 'Geral'>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Coletar praças esportivas únicas
  const venues = Array.from(new Set(matches.map((m) => m.venue).filter(Boolean)));

  const filteredMatches = matches.filter((m) => {
    const mod = modalities.find((modality) => modality.id === m.modality_id);
    const matchesStage = selectedStage === 'all' || mod?.stage === selectedStage;
    const matchesVenue = selectedVenue === 'all' || m.venue === selectedVenue;
    const matchesSearch =
      !searchTerm ||
      m.team_a_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.team_b_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mod?.name && mod.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesStage && matchesVenue && matchesSearch;
  });

  const getTeamAvatar = (teamId?: string) => {
    const t = teams.find((item) => item.id === teamId);
    return t ? t.avatar_key : '';
  };

  const getModality = (modalityId: string) => {
    return modalities.find((m) => m.id === modalityId);
  };

  return (
    <div className="space-y-6">
      {/* Filtros de Cronograma */}
      <div className="bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Seletor de Etapas Oficiais */}
          <div className="inline-flex rounded-m3-full p-1 bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border border-m3-outline-variant/40">
            {(['all', 'Primeiro Lance', 'Geral'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-3.5 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
                  selectedStage === stage
                    ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {stage === 'all' ? 'Todas as Etapas' : `Etapa ${stage}`}
              </button>
            ))}
          </div>

          {/* Campo de Busca */}
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar equipe, praça ou esporte..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Filtro por Praça Esportiva */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Local:</span>
          <button
            onClick={() => setSelectedVenue('all')}
            className={`px-3 py-1 rounded-m3-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedVenue === 'all'
                ? 'bg-m3-secondary text-white dark:bg-m3-secondary-dark dark:text-black'
                : 'bg-m3-surface dark:bg-m3-surface-dark text-slate-600 dark:text-slate-300 border border-m3-outline-variant'
            }`}
          >
            Todos os Locais
          </button>
          {venues.map((venue) => (
            <button
              key={venue}
              onClick={() => setSelectedVenue(venue)}
              className={`px-3 py-1 rounded-m3-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedVenue === venue
                  ? 'bg-m3-secondary text-white dark:bg-m3-secondary-dark dark:text-black'
                  : 'bg-m3-surface dark:bg-m3-surface-dark text-slate-600 dark:text-slate-300 border border-m3-outline-variant'
              }`}
            >
              {venue}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Partidas do Cronograma */}
      <div className="space-y-3">
        {filteredMatches.map((m) => {
          const mod = getModality(m.modality_id);
          return (
            <M3Card
              key={m.id}
              variant="elevated"
              className="p-4 hover:border-m3-primary/40 border border-transparent transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {/* Info do Esporte e Fase */}
                <div className="space-y-1 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-m3-primary dark:text-m3-primary-dark">
                      {mod?.name} ({mod?.category})
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {m.group_name || m.phase}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
                      {m.match_date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {m.match_time}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                      <MapPin size={13} className="text-m3-primary" />
                      {m.venue}
                    </span>
                  </div>
                </div>

                {/* Confronto e Placar */}
                <div className="flex items-center justify-center gap-3 flex-1 px-4">
                  <div className="flex items-center gap-2 text-right justify-end flex-1">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {m.team_a_name}
                    </span>
                    <TeamAvatar avatarKey={getTeamAvatar(m.team_a_id)} name={m.team_a_name} size="sm" />
                  </div>

                  <div className="flex items-center gap-1 font-mono font-black text-base sm:text-lg bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-m3-sm">
                    <span>{m.status === 'Agendado' ? '-' : m.score_a}</span>
                    <span className="text-xs text-slate-400 font-sans">x</span>
                    <span>{m.status === 'Agendado' ? '-' : m.score_b}</span>
                  </div>

                  <div className="flex items-center gap-2 text-left justify-start flex-1">
                    <TeamAvatar avatarKey={getTeamAvatar(m.team_b_id)} name={m.team_b_name} size="sm" />
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {m.team_b_name}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0 self-end sm:self-center">
                  <M3Badge status={m.status} />
                </div>
              </div>
            </M3Card>
          );
        })}
      </div>
    </div>
  );
};
