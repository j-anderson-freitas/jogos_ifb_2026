import React, { useState } from 'react';
import { Match, Modality, CollectiveTeam, IFB_UNITS } from '../../types/database';
import { saveMatch, deleteMatch } from '../../lib/supabase';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import { M3Badge } from '../m3/M3Badge';
import { Plus, Search, Trash2, Edit3, AlertTriangle, Calendar, MapPin } from 'lucide-react';

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

  // Modals de Ação
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [deletingMatchId, setDeletingMatchId] = useState<string | null>(null);

  // Form State para Nova Partida
  const [newMatch, setNewMatch] = useState<Partial<Match>>({
    modality_id: modalities[0]?.id || 'futsal-masc',
    phase: 'Fase de Grupos',
    group_name: 'Grupo A',
    team_a_name: '',
    team_b_name: '',
    status: 'Agendado',
    score_a: 0,
    score_b: 0,
    match_date: '10/11/2026',
    match_time: '14:00',
    venue: IFB_UNITS[0],
  });

  // Equipes disponíveis para a modalidade selecionada no form de criação
  const creationAvailableTeams = teams.filter((t) => t.modality_id === newMatch.modality_id);

  // Equipes disponíveis para a modalidade da partida em edição
  const editingAvailableTeams = editingMatch
    ? teams.filter((t) => t.modality_id === editingMatch.modality_id)
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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatch.team_a_name || !newMatch.team_b_name) return;

    const id = `match-${Date.now()}`;
    const matchToSave: Match = {
      id,
      modality_id: newMatch.modality_id || 'futsal-masc',
      phase: newMatch.phase || 'Fase de Grupos',
      group_name: newMatch.group_name || 'Grupo A',
      team_a_id: newMatch.team_a_id,
      team_b_id: newMatch.team_b_id,
      team_a_name: newMatch.team_a_name,
      team_b_name: newMatch.team_b_name,
      score_a: Number(newMatch.score_a) || 0,
      score_b: Number(newMatch.score_b) || 0,
      score_penalties_a: newMatch.score_penalties_a,
      score_penalties_b: newMatch.score_penalties_b,
      sets_detail: newMatch.sets_detail,
      status: (newMatch.status as any) || 'Agendado',
      match_date: newMatch.match_date || '10/11/2026',
      match_time: newMatch.match_time || '14:00',
      venue: newMatch.venue || IFB_UNITS[0],
    };

    await saveMatch(matchToSave);
    setIsCreateModalOpen(false);
    onMatchesChanged();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMatch) return;

    await saveMatch(editingMatch);
    setEditingMatch(null);
    onMatchesChanged();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMatchId) return;
    await deleteMatch(deletingMatchId);
    setDeletingMatchId(null);
    onMatchesChanged();
  };

  // Helper para máscara e conversão de data dd/mm/aaaa
  const handleDateChange = (val: string, isEditing = false) => {
    if (isEditing && editingMatch) {
      setEditingMatch({ ...editingMatch, match_date: val });
    } else {
      setNewMatch({ ...newMatch, match_date: val });
    }
  };

  return (
    <div className="space-y-6">
      {/* Controles de Busca e Inserção */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg border border-m3-outline-variant/30">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar equipe, praça ou confronto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <M3Button
            variant="filled"
            size="sm"
            icon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Inserir Partida
          </M3Button>
        </div>
      </div>

      {/* Filtros em Linha */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filterModality}
          onChange={(e) => setFilterModality(e.target.value)}
          className="text-xs font-semibold rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
        >
          <option value="all">Todas as Modalidades</option>
          {modalities.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.category})
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs font-semibold rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-800 dark:text-slate-200"
        >
          <option value="all">Todos os Status</option>
          <option value="Agendado">Agendado</option>
          <option value="Ao Vivo">Ao Vivo</option>
          <option value="Finalizado">Finalizado</option>
        </select>
      </div>

      {/* Lista de Partidas com Ações CRUD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMatches.map((m) => (
          <M3Card key={m.id} variant="elevated" className="border border-m3-outline-variant/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-m3-outline-variant/30">
              <span className="font-bold text-m3-primary dark:text-m3-primary-dark">
                {m.group_name || m.phase}
              </span>
              <M3Badge status={m.status} />
            </div>

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
                  onClick={() => setEditingMatch(m)}
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
        ))}
      </div>

      {/* Modal: Inserir Nova Partida (Create) */}
      <M3Dialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Inserir Nova Partida no Sistema"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Modalidade</label>
              <select
                value={newMatch.modality_id}
                onChange={(e) => {
                  const newModId = e.target.value;
                  const modTeams = teams.filter((t) => t.modality_id === newModId);
                  setNewMatch({
                    ...newMatch,
                    modality_id: newModId,
                    team_a_name: modTeams[0]?.name || '',
                    team_a_id: modTeams[0]?.id,
                    team_b_name: modTeams[1]?.name || '',
                    team_b_id: modTeams[1]?.id,
                  });
                }}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              >
                {modalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Fase / Chave</label>
              <input
                type="text"
                placeholder="Ex: Grupo A, Semifinal, Final..."
                value={newMatch.group_name}
                onChange={(e) => setNewMatch({ ...newMatch, group_name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
          </div>

          {/* Seleção de Equipes Filtradas pela Modalidade (Item 7) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Equipe A (Mandante)</label>
              {creationAvailableTeams.length > 0 ? (
                <select
                  required
                  value={newMatch.team_a_name}
                  onChange={(e) => {
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
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="Nome da equipe A"
                  value={newMatch.team_a_name}
                  onChange={(e) => setNewMatch({ ...newMatch, team_a_name: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Equipe B (Visitante)</label>
              {creationAvailableTeams.length > 0 ? (
                <select
                  required
                  value={newMatch.team_b_name}
                  onChange={(e) => {
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
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="Nome da equipe B"
                  value={newMatch.team_b_name}
                  onChange={(e) => setNewMatch({ ...newMatch, team_b_name: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                />
              )}
            </div>
          </div>

          {/* Data no formato dd/mm/aaaa, Horário e Unidade IFB Oficial */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Data (dd/mm/aaaa)</label>
              <input
                type="text"
                required
                placeholder="Ex: 10/11/2026"
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
                placeholder="Ex: 14:00"
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
                {IFB_UNITS.map((u) => (
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
              Salvar Partida
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Editar Partida (Update) */}
      <M3Dialog
        isOpen={Boolean(editingMatch)}
        onClose={() => setEditingMatch(null)}
        title="Modificar Dados da Partida"
      >
        {editingMatch && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Equipes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Equipe A</label>
                {editingAvailableTeams.length > 0 ? (
                  <select
                    value={editingMatch.team_a_name}
                    onChange={(e) => {
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
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editingMatch.team_a_name}
                    onChange={(e) => setEditingMatch({ ...editingMatch, team_a_name: e.target.value })}
                    className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Equipe B</label>
                {editingAvailableTeams.length > 0 ? (
                  <select
                    value={editingMatch.team_b_name}
                    onChange={(e) => {
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
                  </select>
                ) : (
                  <input
                    type="text"
                    value={editingMatch.team_b_name}
                    onChange={(e) => setEditingMatch({ ...editingMatch, team_b_name: e.target.value })}
                    className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                  />
                )}
              </div>
            </div>

            {/* Placares e Pênaltis */}
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

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold mb-1">Status da Partida</label>
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

            {/* Data dd/mm/aaaa, Horário e Unidade IFB */}
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
                <label className="block text-xs font-semibold mb-1">Unidade IFB (Sede)</label>
                <select
                  required
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-semibold"
                >
                  {IFB_UNITS.map((u) => (
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
                Atualizar Partida
              </M3Button>
            </div>
          </form>
        )}
      </M3Dialog>

      {/* Modal: Confirmar Remoção (Delete) */}
      <M3Dialog
        isOpen={Boolean(deletingMatchId)}
        onClose={() => setDeletingMatchId(null)}
        title="Confirmar Remoção da Partida"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-m3-md">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm">
              Tem certeza que deseja remover esta partida do sistema? Esta ação excluirá os placares e registros associados.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <M3Button variant="text" size="sm" onClick={() => setDeletingMatchId(null)}>
              Cancelar
            </M3Button>
            <M3Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Sim, Remover Partida
            </M3Button>
          </div>
        </div>
      </M3Dialog>
    </div>
  );
};
