import React, { useState } from 'react';
import { Match, Modality, CollectiveTeam } from '../../types/database';
import { saveMatch, deleteMatch } from '../../lib/supabase';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import { M3Badge } from '../m3/M3Badge';
import { Plus, Search, Trash2, Edit3, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';

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
    match_date: 'A definir',
    match_time: 'A definir',
    venue: 'Ginásio Poliesportivo',
  });

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
      match_date: newMatch.match_date || 'A definir',
      match_time: newMatch.match_time || 'A definir',
      venue: newMatch.venue || 'Ginásio Poliesportivo',
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

  // Quick Score Update
  const updateScoreQuick = async (match: Match, deltaA: number, deltaB: number) => {
    const updated: Match = {
      ...match,
      score_a: Math.max(0, match.score_a + deltaA),
      score_b: Math.max(0, match.score_b + deltaB),
    };
    await saveMatch(updated);
    onMatchesChanged();
  };

  const setMatchStatusQuick = async (match: Match, newStatus: Match['status']) => {
    const updated: Match = { ...match, status: newStatus };
    await saveMatch(updated);
    onMatchesChanged();
  };

  const getTeamAvatar = (teamId?: string) => {
    const t = teams.find((item) => item.id === teamId);
    return t ? t.avatar_key : '';
  };

  return (
    <div className="space-y-6">
      {/* Barra de Ações do Administrador */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Gerenciamento de Partidas e Placares (CRUD)
          </h2>
          <p className="text-xs text-slate-500">
            {matches.length} partidas registradas no sistema
          </p>
        </div>

        <M3Button
          variant="filled"
          icon={<Plus size={16} />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Inserir Nova Partida
        </M3Button>
      </div>

      {/* Filtros e Busca */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-m3-surface-container-low dark:bg-m3-surface-container-low-dark p-3.5 rounded-m3-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por equipe ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={filterModality}
          onChange={(e) => setFilterModality(e.target.value)}
          className="text-xs sm:text-sm rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary"
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
          className="text-xs sm:text-sm rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-m3-primary"
        >
          <option value="all">Todos os Status</option>
          <option value="Agendado">Agendado</option>
          <option value="Ao Vivo">Ao Vivo</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Adiado">Adiado</option>
        </select>
      </div>

      {/* Lista de Partidas com Ações CRUD */}
      <div className="space-y-3">
        {filteredMatches.map((m) => (
          <M3Card key={m.id} variant="elevated" className="p-4 sm:p-5">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Informações da Partida */}
              <div className="space-y-1 min-w-[220px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-m3-primary dark:text-m3-primary-dark">
                    {modalities.find((mod) => mod.id === m.modality_id)?.name}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {m.group_name || m.phase}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span>📅 {m.match_date}</span>
                  <span>⏰ {m.match_time}</span>
                  <span>📍 {m.venue}</span>
                </div>
              </div>

              {/* Confronto e Placar Interativo */}
              <div className="flex items-center justify-center gap-4 flex-1">
                {/* Time A */}
                <div className="flex items-center gap-2 text-right justify-end flex-1">
                  <span className="font-bold text-xs sm:text-sm truncate text-slate-900 dark:text-white">
                    {m.team_a_name}
                  </span>
                  <TeamAvatar avatarKey={getTeamAvatar(m.team_a_id)} name={m.team_a_name} size="sm" />
                  <div className="inline-flex flex-col gap-0.5 ml-1">
                    <button
                      type="button"
                      onClick={() => updateScoreQuick(m, 1, 0)}
                      className="w-5 h-5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => updateScoreQuick(m, -1, 0)}
                      className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded text-xs hover:bg-slate-400"
                    >
                      -
                    </button>
                  </div>
                </div>

                {/* Placar Central */}
                <div className="flex flex-col items-center px-2">
                  <div className="font-mono text-xl sm:text-2xl font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-m3-sm text-slate-900 dark:text-white">
                    <span>{m.score_a}</span> : <span>{m.score_b}</span>
                  </div>
                  {m.score_penalties_a !== null && m.score_penalties_a !== undefined && (
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Pên: {m.score_penalties_a} x {m.score_penalties_b}
                    </span>
                  )}
                </div>

                {/* Time B */}
                <div className="flex items-center gap-2 text-left justify-start flex-1">
                  <div className="inline-flex flex-col gap-0.5 mr-1">
                    <button
                      type="button"
                      onClick={() => updateScoreQuick(m, 0, 1)}
                      className="w-5 h-5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-700"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => updateScoreQuick(m, 0, -1)}
                      className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded text-xs hover:bg-slate-400"
                    >
                      -
                    </button>
                  </div>
                  <TeamAvatar avatarKey={getTeamAvatar(m.team_b_id)} name={m.team_b_name} size="sm" />
                  <span className="font-bold text-xs sm:text-sm truncate text-slate-900 dark:text-white">
                    {m.team_b_name}
                  </span>
                </div>
              </div>

              {/* Status & Botões de Ação CRUD */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <select
                  value={m.status}
                  onChange={(e) => setMatchStatusQuick(m, e.target.value as any)}
                  className="text-xs font-semibold rounded-m3-full bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant px-2.5 py-1"
                >
                  <option value="Agendado">Agendado</option>
                  <option value="Ao Vivo">Ao Vivo</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Adiado">Adiado</option>
                </select>

                <button
                  type="button"
                  title="Editar dados da partida"
                  onClick={() => setEditingMatch({ ...m })}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  type="button"
                  title="Remover partida"
                  onClick={() => setDeletingMatchId(m.id)}
                  className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-950 text-rose-600"
                >
                  <Trash2 size={16} />
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
                onChange={(e) => setNewMatch({ ...newMatch, modality_id: e.target.value })}
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
              <label className="block text-xs font-semibold mb-1">Fase / Grupo</label>
              <input
                type="text"
                placeholder="Ex: Grupo A, Semifinal 1, Final..."
                value={newMatch.group_name}
                onChange={(e) => setNewMatch({ ...newMatch, group_name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Equipe A (Mandante)</label>
              <input
                type="text"
                required
                placeholder="Nome da equipe A"
                value={newMatch.team_a_name}
                onChange={(e) => setNewMatch({ ...newMatch, team_a_name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Equipe B (Visitante)</label>
              <input
                type="text"
                required
                placeholder="Nome da equipe B"
                value={newMatch.team_b_name}
                onChange={(e) => setNewMatch({ ...newMatch, team_b_name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Data</label>
              <input
                type="text"
                value={newMatch.match_date}
                onChange={(e) => setNewMatch({ ...newMatch, match_date: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Horário</label>
              <input
                type="text"
                value={newMatch.match_time}
                onChange={(e) => setNewMatch({ ...newMatch, match_time: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Praça / Local</label>
              <input
                type="text"
                value={newMatch.venue}
                onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Equipe A: {editingMatch.team_a_name}</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Placar:</span>
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
                    value={editingMatch.score_penalties_a || ''}
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
                <label className="block text-xs font-semibold mb-1">Equipe B: {editingMatch.team_b_name}</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Placar:</span>
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
                    value={editingMatch.score_penalties_b || ''}
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

            <div>
              <label className="block text-xs font-semibold mb-1">Detalhe de Sets (Ex: 25-21, 23-25, 15-12)</label>
              <input
                type="text"
                placeholder="Opcional: placar de sets para Vôlei ou Futevôlei"
                value={editingMatch.sets_detail || ''}
                onChange={(e) => setEditingMatch({ ...editingMatch, sets_detail: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Data</label>
                <input
                  type="text"
                  value={editingMatch.match_date}
                  onChange={(e) => setEditingMatch({ ...editingMatch, match_date: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Horário</label>
                <input
                  type="text"
                  value={editingMatch.match_time}
                  onChange={(e) => setEditingMatch({ ...editingMatch, match_time: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Praça / Local</label>
                <input
                  type="text"
                  value={editingMatch.venue}
                  onChange={(e) => setEditingMatch({ ...editingMatch, venue: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                />
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

