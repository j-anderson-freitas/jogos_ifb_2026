import React, { useState } from 'react';
import { Match, Modality, CollectiveTeam, IFB_UNITS } from '../../types/database';
import { saveMatch, deleteMatch } from '../../lib/supabase';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import { M3Badge } from '../m3/M3Badge';
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Trash2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Footprints,
} from 'lucide-react';

export interface MatchManagerProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
  onMatchesChanged: () => void;
}

export const MatchManager: React.FC<MatchManagerProps> = ({
  matches,
  modalities,
  teams,
  onMatchesChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModality, setFilterModality] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modais de Ação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [deletingMatchId, setDeletingMatchId] = useState<string | null>(null);

  // Estados de controle de modo do formulário de criação
  const [isEventMode, setIsEventMode] = useState(false);
  const [isCustomTeamA, setIsCustomTeamA] = useState(false);
  const [isCustomTeamB, setIsCustomTeamB] = useState(false);

  // Estados de controle para o formulário de edição
  const [isEditEventMode, setIsEditEventMode] = useState(false);
  const [isEditCustomTeamA, setIsEditCustomTeamA] = useState(false);
  const [isEditCustomTeamB, setIsEditCustomTeamB] = useState(false);

  // Listas ordenadas alfabeticamente para filtros e selects
  const sortedModalities = [...modalities].sort((a, b) => a.name.localeCompare(b.name));
  const sortedUnits = [...IFB_UNITS].sort((a, b) => a.localeCompare(b));

  // Form State para Nova Partida / Evento
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    modality_id: sortedModalities[0]?.id || 'futsal-masc',
    phase: 'Fase de Grupos',
    group_name: 'Grupo A',
    team_a_name: '',
    team_b_name: '',
    status: 'Agendado',
    score_a: 0,
    score_b: 0,
    match_date: '07/11/2026',
    match_time: '08:00',
    venue: sortedUnits[0],
  });

  // Equipes disponíveis para a modalidade selecionada no form de criação (ordenadas A-Z)
  const creationAvailableTeams = teams
    .filter((t) => t.modality_id === newMatch.modality_id)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Equipes disponíveis para a modalidade da partida em edição (ordenadas A-Z)
  const editingAvailableTeams = editingMatch
    ? teams
        .filter((t) => t.modality_id === editingMatch.modality_id)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  const filteredMatches = matches.filter((m) => {
    const matchModality = filterModality === 'all' || m.modality_id === filterModality;
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const matchSearch =
      !searchTerm ||
      m.team_a_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.team_b_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.venue.toLowerCase().includes(searchTerm.toLowerCase());

    return matchModality && matchStatus && matchSearch;
  });

  // Ao alterar a modalidade no form de criação, detecta se é individual (ativando modo evento)
  const handleModalityChange = (modId: string) => {
    const mod = modalities.find((m) => m.id === modId);
    const isIndiv = mod?.type === 'individual';
    const modTeams = teams.filter((t) => t.modality_id === modId).sort((a, b) => a.name.localeCompare(b.name));

    setIsEventMode(isIndiv);
    setIsCustomTeamA(false);
    setIsCustomTeamB(false);

    setNewMatch({
      ...newMatch,
      modality_id: modId,
      team_a_name: isIndiv ? `Largada / Prova de ${mod?.name}` : modTeams[0]?.name || '',
      team_a_id: isIndiv ? undefined : modTeams[0]?.id,
      team_b_name: isIndiv ? '' : modTeams[1]?.name || '',
      team_b_id: isIndiv ? undefined : modTeams[1]?.id,
    });
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.team_a_name) return;
    if (!isEventMode && !newMatch.team_b_name) return;

    const id = `match-${Date.now()}`;
    const matchToSave: Match = {
      id,
      modality_id: newMatch.modality_id || sortedModalities[0]?.id || 'futsal-masc',
      phase: newMatch.phase || (isEventMode ? 'Etapa Única' : 'Fase de Grupos'),
      group_name: newMatch.group_name || (isEventMode ? 'Geral' : 'Grupo A'),
      team_a_id: isCustomTeamA || isEventMode ? undefined : newMatch.team_a_id,
      team_b_id: isCustomTeamB || isEventMode ? undefined : newMatch.team_b_id,
      team_a_name: newMatch.team_a_name.trim(),
      team_b_name: isEventMode ? '' : (newMatch.team_b_name?.trim() || ''),
      score_a: Number(newMatch.score_a) || 0,
      score_b: Number(newMatch.score_b) || 0,
      score_penalties_a: newMatch.score_penalties_a,
      score_penalties_b: newMatch.score_penalties_b,
      sets_detail: newMatch.sets_detail,
      status: (newMatch.status as any) || 'Agendado',
      match_date: newMatch.match_date || '07/11/2026',
      match_time: newMatch.match_time || '08:00',
      venue: newMatch.venue || sortedUnits[0],
    };

    await saveMatch(matchToSave);
    setIsCreateModalOpen(false);
    onMatchesChanged();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;

    const toSave: Match = {
      ...editingMatch,
      team_a_name: editingMatch.team_a_name.trim(),
      team_b_name: isEditEventMode ? '' : (editingMatch.team_b_name?.trim() || ''),
      team_a_id: isEditCustomTeamA || isEditEventMode ? undefined : editingMatch.team_a_id,
      team_b_id: isEditCustomTeamB || isEditEventMode ? undefined : editingMatch.team_b_id,
    };

    await saveMatch(toSave);
    setEditingMatch(null);
    onMatchesChanged();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMatchId) return;
    await deleteMatch(deletingMatchId);
    setDeletingMatchId(null);
    onMatchesChanged();
  };

  const handleDateChange = (val: string, isEditing = false) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 8);
    let formatted = cleaned;
    if (cleaned.length >= 5) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    } else if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }

    if (isEditing && editingMatch) {
      setEditingMatch({ ...editingMatch, match_date: formatted });
    } else {
      setNewMatch({ ...newMatch, match_date: formatted });
    }
  };

  const openEditModal = (m: Match) => {
    const isIndiv = !m.team_b_name;
    setIsEditEventMode(isIndiv);
    setIsEditCustomTeamA(!m.team_a_id);
    setIsEditCustomTeamB(!m.team_b_id && Boolean(m.team_b_name));
    setEditingMatch(m);
  };

  return (
    <div className="space-y-6">
      {/* Header e Barra de Ações */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg border border-m3-outline-variant/30">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Programação de Partidas & Eventos Esportivos
          </h2>
          <p className="text-xs text-slate-500">
            Agende confrontos coletivos com equipes oficiais ou provisórias, e eventos de provas individuais
          </p>
        </div>

        <M3Button
          variant="filled"
          size="sm"
          icon={<Plus size={16} />}
          onClick={() => {
            handleModalityChange(sortedModalities[0]?.id || 'futsal-masc');
            setIsCreateModalOpen(true);
          }}
        >
          Inserir Partida / Evento
        </M3Button>
      </div>

      {/* Barra de Filtros Alfabéticos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por equipe, prova ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={filterModality}
          onChange={(e) => setFilterModality(e.target.value)}
          className="text-xs sm:text-sm rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
        >
          <option value="all">Todas as Modalidades</option>
          {sortedModalities.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.category})
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs sm:text-sm rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
        >
          <option value="all">Todos os Status</option>
          <option value="Agendado">Agendado</option>
          <option value="Ao Vivo">Ao Vivo</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Adiado">Adiado</option>
        </select>
      </div>

      {/* Lista de Partidas com Ações CRUD */}
      {filteredMatches.length === 0 ? (
        <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Nenhuma partida ou evento encontrado.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Clique em "Inserir Partida / Evento" para agendar jogos ou provas no calendário.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((m) => {
            const isSingleEvent = !m.team_b_name;

            return (
              <M3Card key={m.id} variant="elevated" className="border border-m3-outline-variant/30 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-m3-outline-variant/30">
                  <span className="font-bold text-m3-primary dark:text-m3-primary-dark">
                    {m.group_name || m.phase}
                  </span>
                  <M3Badge status={m.status} />
                </div>

                {isSingleEvent ? (
                  <div className="py-3 flex items-center gap-3">
                    <div className="p-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Footprints size={20} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {m.team_a_name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Prova / Evento sem confronto direto
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 font-bold text-sm text-slate-900 dark:text-white truncate">
                      {m.team_a_name}
                    </div>
                    <div className="font-mono font-black text-lg text-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-m3-sm shrink-0">
                      <span>{m.status === 'Agendado' ? '-' : m.score_a}</span>
                      <span className="text-xs text-slate-400 mx-1.5">x</span>
                      <span>{m.status === 'Agendado' ? '-' : m.score_b}</span>
                    </div>
                    <div className="flex-1 font-bold text-sm text-slate-900 dark:text-white truncate text-right">
                      {m.team_b_name}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-m3-outline-variant/30 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-[11px] truncate">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{m.match_date} às {m.match_time}</span>
                    <span>•</span>
                    <MapPin size={13} className="text-m3-primary shrink-0" />
                    <span className="truncate">{m.venue}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(m)}
                      title="Editar partida"
                      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => setDeletingMatchId(m.id)}
                      title="Remover partida"
                      className="p-1.5 rounded-full hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </M3Card>
            );
          })}
        </div>
      )}

      {/* Modal: Inserir Nova Partida / Evento (Create) */}
      <M3Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Inserir Nova Partida ou Evento Esportivo"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Modalidade</label>
              <select
                value={newMatch.modality_id}
                onChange={(e) => handleModalityChange(e.target.value)}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              >
                {sortedModalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Fase / Chave / Etapa</label>
              <input
                type="text"
                placeholder="Ex: Grupo A, Semifinal, Etapa Única..."
                value={newMatch.group_name}
                onChange={(e) => setNewMatch({ ...newMatch, group_name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
          </div>

          {/* Toggle para Prova / Evento sem confronto direto (ex: Corrida 07/11, Natação) */}
          <div className="flex items-center gap-2 p-2.5 rounded-m3-sm bg-slate-50 dark:bg-slate-800/40 border border-m3-outline-variant/30 text-xs">
            <input
              type="checkbox"
              id="create-event-mode"
              checked={isEventMode}
              onChange={(e) => {
                setIsEventMode(e.target.checked);
                if (e.target.checked) {
                  setNewMatch({ ...newMatch, team_b_name: '' });
                }
              }}
              className="rounded text-m3-primary focus:ring-m3-primary"
            />
            <label htmlFor="create-event-mode" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
              Evento / Prova Única (sem confronto direto entre duas equipes)
            </label>
          </div>

          {/* Se for Modo Evento Único (Corrida, Natação, Prova Geral) */}
          {isEventMode ? (
            <div>
              <label className="block text-xs font-semibold mb-1">Título da Prova / Evento</label>
              <input
                type="text"
                required
                placeholder="Ex: Largada Geral - Caminhada e Corrida dos Servidores (5km)"
                value={newMatch.team_a_name}
                onChange={(e) => setNewMatch({ ...newMatch, team_a_name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Aparecerá como evento no calendário oficial sem placar de jogo.
              </p>
            </div>
          ) : (
            /* Se for Confronto entre 2 Equipes */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Equipe A */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold">Equipe A (Mandante)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomTeamA(!isCustomTeamA);
                      if (!isCustomTeamA) setNewMatch({ ...newMatch, team_a_id: undefined, team_a_name: '' });
                    }}
                    className="text-[10px] text-m3-primary dark:text-m3-primary-dark hover:underline font-bold"
                  >
                    {isCustomTeamA ? 'Selecionar Equipe' : 'Provisória / Mata-Mata'}
                  </button>
                </div>

                {isCustomTeamA || creationAvailableTeams.length === 0 ? (
                  <input
                    type="text"
                    required
                    placeholder="Ex: 1º Grupo A, Vencedor Jogo 1, A definir"
                    value={newMatch.team_a_name}
                    onChange={(e) => setNewMatch({ ...newMatch, team_a_name: e.target.value })}
                    className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold text-slate-900 dark:text-white"
                  />
                ) : (
                  <select
                    required
                    value={newMatch.team_a_name}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomTeamA(true);
                        setNewMatch({ ...newMatch, team_a_name: '', team_a_id: undefined });
                        return;
                      }
                      const sel = creationAvailableTeams.find((t) => t.name === e.target.value);
                      setNewMatch({
                        ...newMatch,
                        team_a_name: e.target.value,
                        team_a_id: sel?.id,
                      });
                    }}
                    className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
                  >
                    <option value="">Selecione a Equipe A...</option>
                    {creationAvailableTeams.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.group_name || 'Geral'})
                      </option>
                    ))}
                    <option value="__custom__">➕ Digitar nome provisório (Mata-mata)...</option>
                  </select>
                )}
              </div>

              {/* Equipe B */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold">Equipe B (Visitante)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomTeamB(!isCustomTeamB);
                      if (!isCustomTeamB) setNewMatch({ ...newMatch, team_b_id: undefined, team_b_name: '' });
                    }}
                    className="text-[10px] text-m3-primary dark:text-m3-primary-dark hover:underline font-bold"
                  >
                    {isCustomTeamB ? 'Selecionar Equipe' : 'Provisória / Mata-Mata'}
                  </button>
                </div>

                {isCustomTeamB || creationAvailableTeams.length === 0 ? (
                  <input
                    type="text"
                    required
                    placeholder="Ex: 2º Grupo B, Vencedor Jogo 2, A definir"
                    value={newMatch.team_b_name}
                    onChange={(e) => setNewMatch({ ...newMatch, team_b_name: e.target.value })}
                    className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold text-slate-900 dark:text-white"
                  />
                ) : (
                  <select
                    required
                    value={newMatch.team_b_name}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomTeamB(true);
                        setNewMatch({ ...newMatch, team_b_name: '', team_b_id: undefined });
                        return;
                      }
                      const sel = creationAvailableTeams.find((t) => t.name === e.target.value);
                      setNewMatch({
                        ...newMatch,
                        team_b_name: e.target.value,
                        team_b_id: sel?.id,
                      });
                    }}
                    className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
                  >
                    <option value="">Selecione a Equipe B...</option>
                    {creationAvailableTeams.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.group_name || 'Geral'})
                      </option>
                    ))}
                    <option value="__custom__">➕ Digitar nome provisório (Mata-mata)...</option>
                  </select>
                )}
              </div>
            </div>
          )}

          {/* Data no formato dd/mm/aaaa, Horário e Unidade IFB Oficial */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Data (dd/mm/aaaa)</label>
              <input
                type="text"
                required
                placeholder="Ex: 07/11/2026"
                value={newMatch.match_date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Horário (hh:mm)</label>
              <input
                type="text"
                required
                placeholder="Ex: 08:00"
                value={newMatch.match_time}
                onChange={(e) => setNewMatch({ ...newMatch, match_time: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Unidade IFB (Sede)</label>
              <select
                required
                value={newMatch.venue}
                onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
              >
                {sortedUnits.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button variant="text" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" type="submit">
              Salvar {isEventMode ? 'Evento' : 'Partida'}
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Editar Partida / Evento (Update) */}
      <M3Dialog
        isOpen={Boolean(editingMatch)}
        onClose={() => setEditingMatch(null)}
        title="Modificar Dados da Partida / Evento"
      >
        {editingMatch && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Toggle Modo Evento Único */}
            <div className="flex items-center gap-2 p-2.5 rounded-m3-sm bg-slate-50 dark:bg-slate-800/40 border border-m3-outline-variant/30 text-xs">
              <input
                type="checkbox"
                id="edit-event-mode"
                checked={isEditEventMode}
                onChange={(e) => {
                  setIsEditEventMode(e.target.checked);
                  if (e.target.checked) {
                    setEditingMatch({ ...editingMatch, team_b_name: '' });
                  }
                }}
                className="rounded text-m3-primary focus:ring-m3-primary"
              />
              <label htmlFor="edit-event-mode" className="font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Evento / Prova Única (sem confronto direto entre duas equipes)
              </label>
            </div>

            {isEditEventMode ? (
              <div>
                <label className="block text-xs font-semibold mb-1">Título da Prova / Evento</label>
                <input
                  type="text"
                  required
                  value={editingMatch.team_a_name}
                  onChange={(e) => setEditingMatch({ ...editingMatch, team_a_name: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Equipe A */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">Equipe A</label>
                    <button
                      type="button"
                      onClick={() => setIsEditCustomTeamA(!isEditCustomTeamA)}
                      className="text-[10px] text-m3-primary dark:text-m3-primary-dark hover:underline font-bold"
                    >
                      {isEditCustomTeamA ? 'Selecionar Equipe' : 'Provisória'}
                    </button>
                  </div>
                  {isEditCustomTeamA || editingAvailableTeams.length === 0 ? (
                    <input
                      type="text"
                      required
                      placeholder="Ex: 1º Grupo A, A definir"
                      value={editingMatch.team_a_name}
                      onChange={(e) => setEditingMatch({ ...editingMatch, team_a_name: e.target.value })}
                      className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
                    />
                  ) : (
                    <select
                      value={editingMatch.team_a_name}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsEditCustomTeamA(true);
                          return;
                        }
                        const sel = editingAvailableTeams.find((t) => t.name === e.target.value);
                        setEditingMatch({
                          ...editingMatch,
                          team_a_name: e.target.value,
                          team_a_id: sel?.id,
                        });
                      }}
                      className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
                    >
                      {editingAvailableTeams.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                      <option value="__custom__">➕ Digitar nome provisório...</option>
                    </select>
                  )}
                </div>

                {/* Equipe B */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold">Equipe B</label>
                    <button
                      type="button"
                      onClick={() => setIsEditCustomTeamB(!isEditCustomTeamB)}
                      className="text-[10px] text-m3-primary dark:text-m3-primary-dark hover:underline font-bold"
                    >
                      {isEditCustomTeamB ? 'Selecionar Equipe' : 'Provisória'}
                    </button>
                  </div>
                  {isEditCustomTeamB || editingAvailableTeams.length === 0 ? (
                    <input
                      type="text"
                      required
                      placeholder="Ex: 2º Grupo B, A definir"
                      value={editingMatch.team_b_name}
                      onChange={(e) => setEditingMatch({ ...editingMatch, team_b_name: e.target.value })}
                      className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
                    />
                  ) : (
                    <select
                      value={editingMatch.team_b_name}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsEditCustomTeamB(true);
                          return;
                        }
                        const sel = editingAvailableTeams.find((t) => t.name === e.target.value);
                        setEditingMatch({
                          ...editingMatch,
                          team_b_name: e.target.value,
                          team_b_id: sel?.id,
                        });
                      }}
                      className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
                    >
                      {editingAvailableTeams.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                      <option value="__custom__">➕ Digitar nome provisório...</option>
                    </select>
                  )}
                </div>
              </div>
            )}

            {/* Placares e Pênaltis (somente se confronto) */}
            {!isEditEventMode && (
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-m3-sm">
                <div>
                  <label className="block text-xs font-semibold mb-1">Placar {editingMatch.team_a_name}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={editingMatch.score_a}
                      onChange={(e) =>
                        setEditingMatch({ ...editingMatch, score_a: parseInt(e.target.value) || 0 })
                      }
                      className="w-20 text-center font-bold text-sm p-1.5 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Pên."
                      value={editingMatch.score_penalties_a ?? ''}
                      onChange={(e) =>
                        setEditingMatch({
                          ...editingMatch,
                          score_penalties_a: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-16 text-center text-xs p-1.5 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Placar {editingMatch.team_b_name}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={editingMatch.score_b}
                      onChange={(e) =>
                        setEditingMatch({ ...editingMatch, score_b: parseInt(e.target.value) || 0 })
                      }
                      className="w-20 text-center font-bold text-sm p-1.5 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Pên."
                      value={editingMatch.score_penalties_b ?? ''}
                      onChange={(e) =>
                        setEditingMatch({
                          ...editingMatch,
                          score_penalties_b: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-16 text-center text-xs p-1.5 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold mb-1">Status da Partida / Evento</label>
              <select
                value={editingMatch.status}
                onChange={(e) => setEditingMatch({ ...editingMatch, status: e.target.value as any })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
              >
                <option value="Agendado">Agendado</option>
                <option value="Ao Vivo">Ao Vivo</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Adiado">Adiado</option>
              </select>
            </div>

            {/* Data, Horário e Local */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Data (dd/mm/aaaa)</label>
                <input
                  type="text"
                  required
                  value={editingMatch.match_date}
                  onChange={(e) => handleDateChange(e.target.value, true)}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Horário (hh:mm)</label>
                <input
                  type="text"
                  required
                  value={editingMatch.match_time}
                  onChange={(e) => setEditingMatch({ ...editingMatch, match_time: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Unidade IFB</label>
                <select
                  required
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
                >
                  {sortedUnits.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
              <M3Button variant="text" size="sm" type="button" onClick={() => setEditingMatch(null)}>
                Cancelar
              </M3Button>
              <M3Button variant="filled" size="sm" type="submit">
                Salvar Alterações
              </M3Button>
            </div>
          </form>
        )}
      </M3Dialog>

      {/* Confirmação de Exclusão */}
      <M3Dialog
        isOpen={Boolean(deletingMatchId)}
        onClose={() => setDeletingMatchId(null)}
        title="Confirmar Exclusão"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Tem certeza que deseja remover esta partida ou evento? Esta ação não pode ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <M3Button variant="text" size="sm" onClick={() => setDeletingMatchId(null)}>
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" onClick={handleDeleteConfirm}>
              Sim, Excluir
            </M3Button>
          </div>
        </div>
      </M3Dialog>
    </div>
  );
};
