import React, { useState } from 'react';
import { CollectiveTeam, Modality, Campus } from '../../types/database';
import { saveTeam, deleteTeam } from '../../lib/supabase';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import { Plus, Search, Trash2, Edit3, Shield, AlertTriangle } from 'lucide-react';

export interface TeamManagerProps {
  teams: CollectiveTeam[];
  modalities: Modality[];
  campuses: Campus[];
  onTeamsChanged: () => void;
}

export const TeamManager: React.FC<TeamManagerProps> = ({
  teams,
  modalities,
  campuses,
  onTeamsChanged,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModality, setFilterModality] = useState('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<CollectiveTeam | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  const [newTeam, setNewTeam] = useState<Partial<CollectiveTeam>>({
    name: '',
    modality_id: modalities[0]?.id || 'futsal-masc',
    group_name: 'Grupo A',
    campus_id: campuses[0]?.id || 'campus-brasilia',
    avatar_key: 'galaticos',
  });

  const availableAvatars = [
    'galaticos',
    'gatopreto',
    'gama',
    'sarues',
    'canela',
    'cachorroes',
    'next',
    'deepriver',
    'estrutural',
    'donas',
    'sebastiana',
    'voleibol_ctag',
    'boratime',
    'titas',
    'semdidatica',
    'ctaghoopers',
    'quitados',
    'jordana',
    'cest',
    'bonde',
    'sand',
    'mtbrothers',
    'soberanas',
    'elite',
    'endorfinadas',
    'furia',
  ];

  const filteredTeams = teams.filter((t) => {
    const matchesMod = filterModality === 'all' || t.modality_id === filterModality;
    const matchesSearch =
      !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.group_name && t.group_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesMod && matchesSearch;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name) return;

    const id = `team-${Date.now()}`;
    const toSave: CollectiveTeam = {
      id,
      name: newTeam.name,
      modality_id: newTeam.modality_id || 'futsal-masc',
      group_name: newTeam.group_name || 'Grupo A',
      campus_id: newTeam.campus_id,
      avatar_key: newTeam.avatar_key || 'galaticos',
    };

    await saveTeam(toSave);
    setIsCreateOpen(false);
    onTeamsChanged();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam) return;

    await saveTeam(editingTeam);
    setEditingTeam(null);
    onTeamsChanged();
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTeamId) return;
    await deleteTeam(deletingTeamId);
    setDeletingTeamId(null);
    onTeamsChanged();
  };

  const getCampusName = (campusId?: string) => {
    const c = campuses.find((item) => item.id === campusId);
    return c ? c.name : 'Não informado';
  };

  const getModalityName = (modalityId: string) => {
    const m = modalities.find((item) => item.id === modalityId);
    return m ? `${m.name} (${m.category})` : modalityId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Cadastro de Equipes e Avatars
          </h2>
          <p className="text-xs text-slate-500">
            {teams.length} equipes coletivas registradas no sistema
          </p>
        </div>

        <M3Button variant="filled" icon={<Plus size={16} />} onClick={() => setIsCreateOpen(true)}>
          Cadastrar Nova Equipe
        </M3Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-m3-surface-container-low dark:bg-m3-surface-container-low-dark p-3.5 rounded-m3-md">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar equipe por nome..."
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
          {modalities
            .filter((m) => m.type === 'coletiva')
            .map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.category})
              </option>
            ))}
        </select>
      </div>

      {/* Grid de Equipes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeams.map((t) => (
          <M3Card key={t.id} variant="elevated" className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <TeamAvatar avatarKey={t.avatar_key} name={t.name} size="md" />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{t.name}</h4>
                <div className="text-[11px] text-m3-primary dark:text-m3-primary-dark font-semibold">
                  {getModalityName(t.modality_id)}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {getCampusName(t.campus_id)} • {t.group_name}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                type="button"
                onClick={() => setEditingTeam({ ...t })}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <Edit3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => setDeletingTeamId(t.id)}
                className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-950 text-rose-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </M3Card>
        ))}
      </div>

      {/* Modal: Inserir Equipe */}
      <M3Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Cadastrar Nova Equipe">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome da Equipe</label>
            <input
              type="text"
              required
              placeholder="Ex: Galáticos Cpla, Gato Preto..."
              value={newTeam.name}
              onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Modalidade</label>
              <select
                value={newTeam.modality_id}
                onChange={(e) => setNewTeam({ ...newTeam, modality_id: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              >
                {modalities
                  .filter((m) => m.type === 'coletiva')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Campus do IFB</label>
              <select
                value={newTeam.campus_id}
                onChange={(e) => setNewTeam({ ...newTeam, campus_id: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Escolher Avatar / Brasão</label>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-m3-sm max-h-36 overflow-y-auto">
              {availableAvatars.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setNewTeam({ ...newTeam, avatar_key: av })}
                  className={`p-1 rounded-m3-sm border-2 transition-all flex items-center justify-center ${
                    newTeam.avatar_key === av
                      ? 'border-m3-primary bg-emerald-100 dark:bg-emerald-950 scale-105'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                >
                  <TeamAvatar avatarKey={av} name={av} size="sm" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button variant="text" size="sm" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" type="submit">
              Salvar Equipe
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Editar Equipe */}
      <M3Dialog isOpen={Boolean(editingTeam)} onClose={() => setEditingTeam(null)} title="Modificar Equipe">
        {editingTeam && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Nome da Equipe</label>
              <input
                type="text"
                required
                value={editingTeam.name}
                onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Campus de Origem</label>
                <select
                  value={editingTeam.campus_id}
                  onChange={(e) => setEditingTeam({ ...editingTeam, campus_id: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                >
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Grupo / Chave</label>
                <input
                  type="text"
                  value={editingTeam.group_name || ''}
                  onChange={(e) => setEditingTeam({ ...editingTeam, group_name: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Avatar / Emblema</label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-m3-sm max-h-36 overflow-y-auto">
                {availableAvatars.map((av) => (
                  <button
                    type="button"
                    key={av}
                    onClick={() => setEditingTeam({ ...editingTeam, avatar_key: av })}
                    className={`p-1 rounded-m3-sm border-2 transition-all flex items-center justify-center ${
                      editingTeam.avatar_key === av
                        ? 'border-m3-primary bg-emerald-100 dark:bg-emerald-950 scale-105'
                        : 'border-transparent hover:border-slate-300'
                    }`}
                  >
                    <TeamAvatar avatarKey={av} name={av} size="sm" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
              <M3Button variant="text" size="sm" type="button" onClick={() => setEditingTeam(null)}>
                Cancelar
              </M3Button>
              <M3Button variant="filled" size="sm" type="submit">
                Atualizar Equipe
              </M3Button>
            </div>
          </form>
        )}
      </M3Dialog>

      {/* Modal: Confirmar Remoção */}
      <M3Dialog
        isOpen={Boolean(deletingTeamId)}
        onClose={() => setDeletingTeamId(null)}
        title="Confirmar Exclusão de Equipe"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-m3-md">
            <AlertTriangle size={24} className="flex-shrink-0" />
            <p className="text-xs sm:text-sm">
              Tem certeza que deseja remover esta equipe? Partidas associadas podem ser impactadas.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <M3Button variant="text" size="sm" onClick={() => setDeletingTeamId(null)}>
              Cancelar
            </M3Button>
            <M3Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Sim, Remover Equipe
            </M3Button>
          </div>
        </div>
      </M3Dialog>
    </div>
  );
};

