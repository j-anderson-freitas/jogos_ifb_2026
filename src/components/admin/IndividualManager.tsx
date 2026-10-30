import React, { useState } from 'react';
import { Modality, Campus, IndividualParticipant, IndividualPodium } from '../../types/database';
import { saveParticipant, deleteParticipant, savePodium, deletePodium } from '../../lib/supabase';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import { Plus, UserPlus, Trophy, Trash2, Medal, Search, AlertCircle } from 'lucide-react';

export interface IndividualManagerProps {
  modalities: Modality[];
  campuses: Campus[];
  participants: IndividualParticipant[];
  podiums: IndividualPodium[];
  onDataChanged: () => void;
}

export const IndividualManager: React.FC<IndividualManagerProps> = ({
  modalities,
  campuses,
  participants,
  podiums,
  onDataChanged,
}) => {
  const individualModalities = modalities.filter((m) => m.type === 'individual');

  const [activeTab, setActiveTab] = useState<'podiums' | 'participants'>('podiums');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [isPodiumModalOpen, setIsPodiumModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);

  // Form State Pódio
  const [newPodium, setNewPodium] = useState<Partial<IndividualPodium>>({
    modality_id: individualModalities[0]?.id || 'xadrez-aberto',
    event_category: 'Geral',
    position: 1,
    participant_name: '',
    campus_id: campuses[0]?.id || 'campus-brasilia',
    score_time_detail: '',
  });

  // Form State Participante
  const [newParticipant, setNewParticipant] = useState<Partial<IndividualParticipant>>({
    name: '',
    campus_id: campuses[0]?.id || 'campus-brasilia',
    modality_id: individualModalities[0]?.id || 'xadrez-aberto',
    event_category: 'Geral',
  });

  const handlePodiumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodium.participant_name) return;

    const toSave: IndividualPodium = {
      id: `podium-${Date.now()}`,
      modality_id: newPodium.modality_id || 'xadrez-aberto',
      event_category: newPodium.event_category || 'Geral',
      position: (newPodium.position as 1 | 2 | 3) || 1,
      participant_name: newPodium.participant_name,
      campus_id: newPodium.campus_id || 'campus-brasilia',
      score_time_detail: newPodium.score_time_detail,
      created_at: new Date().toISOString(),
    };

    await savePodium(toSave);
    setIsPodiumModalOpen(false);
    setNewPodium({ ...newPodium, participant_name: '', score_time_detail: '' });
    onDataChanged();
  };

  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name) return;

    const toSave: IndividualParticipant = {
      id: `participant-${Date.now()}`,
      name: newParticipant.name,
      campus_id: newParticipant.campus_id || 'campus-brasilia',
      modality_id: newParticipant.modality_id || 'xadrez-aberto',
      event_category: newParticipant.event_category || 'Geral',
      created_at: new Date().toISOString(),
    };

    await saveParticipant(toSave);
    setIsParticipantModalOpen(false);
    setNewParticipant({ ...newParticipant, name: '' });
    onDataChanged();
  };

  const getCampusName = (campusId: string) => {
    return campuses.find((c) => c.id === campusId)?.name || campusId;
  };

  const getModalityName = (modalityId: string) => {
    return modalities.find((m) => m.id === modalityId)?.name || modalityId;
  };

  return (
    <div className="space-y-6">
      {/* Header e Alternador de Seções */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Modalidades Individuais (Servidores / Atletas)
          </h2>
          <p className="text-xs text-slate-500">
            Xadrez, Damas, Tênis de Mesa, Natação e Corrida/Caminhada
          </p>
        </div>

        <div className="flex items-center gap-2">
          <M3Button
            variant="filled"
            size="sm"
            icon={<Trophy size={16} />}
            onClick={() => setIsPodiumModalOpen(true)}
          >
            Lançar Pódio (Medalha)
          </M3Button>
          <M3Button
            variant="tonal"
            size="sm"
            icon={<UserPlus size={16} />}
            onClick={() => setIsParticipantModalOpen(true)}
          >
            Novo Participante
          </M3Button>
        </div>
      </div>

      {/* Tabs M3 para alternar entre Pódios e Participantes */}
      <div className="inline-flex rounded-m3-full p-1 bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border border-m3-outline-variant/40">
        <button
          onClick={() => setActiveTab('podiums')}
          className={`px-4 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
            activeTab === 'podiums'
              ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Pódios e Medalhas ({podiums.length})
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-4 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
            activeTab === 'participants'
              ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Servidores Inscritos ({participants.length})
        </button>
      </div>

      {/* Lista de Pódios Cadastrados */}
      {activeTab === 'podiums' && (
        <div className="space-y-3">
          {podiums.length === 0 ? (
            <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
              <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhum pódio lançado ainda</h4>
              <p className="text-xs text-slate-500 mt-1">
                Clique em "Lançar Pódio" para registrar os servidores vencedores (1º, 2º e 3º lugares) e somar pontos ao Campus!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {podiums.map((pod) => {
                const medalBadge = {
                  1: { label: 'Ouro (1º)', color: 'bg-amber-100 text-amber-900 border-amber-300', emoji: '🥇' },
                  2: { label: 'Prata (2º)', color: 'bg-slate-200 text-slate-800 border-slate-300', emoji: '🥈' },
                  3: { label: 'Bronze (3º)', color: 'bg-amber-800/20 text-amber-900 dark:text-amber-300 border-amber-600/40', emoji: '🥉' },
                }[pod.position];

                return (
                  <M3Card key={pod.id} variant="elevated" className="p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-m3-primary dark:text-m3-primary-dark">
                          {getModalityName(pod.modality_id)}
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${medalBadge.color}`}>
                          {medalBadge.emoji} {medalBadge.label}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">
                        {pod.participant_name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Campus: <span className="font-semibold text-slate-700 dark:text-slate-300">{getCampusName(pod.campus_id)}</span>
                      </p>
                      {pod.event_category && (
                        <p className="text-[11px] text-slate-400 mt-1">Prova: {pod.event_category}</p>
                      )}
                      {pod.score_time_detail && (
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                          Tempo/Resultado: {pod.score_time_detail}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-m3-outline-variant/30 flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          await deletePodium(pod.id);
                          onDataChanged();
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Remover Pódio</span>
                      </button>
                    </div>
                  </M3Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Lista de Participantes Inscritos */}
      {activeTab === 'participants' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {participants.map((p) => (
              <M3Card key={p.id} variant="elevated" className="p-4 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h4>
                  <p className="text-xs text-slate-500">{getCampusName(p.campus_id)}</p>
                  <span className="text-[11px] font-semibold text-m3-primary dark:text-m3-primary-dark">
                    {getModalityName(p.modality_id)} ({p.event_category || 'Geral'})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteParticipant(p.id);
                    onDataChanged();
                  }}
                  className="p-1.5 rounded-full hover:bg-rose-100 text-rose-600"
                >
                  <Trash2 size={15} />
                </button>
              </M3Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Lançar Pódio */}
      <M3Dialog
        isOpen={isPodiumModalOpen}
        onClose={() => setIsPodiumModalOpen(false)}
        title="Lançar Resultado / Pódio de Servidor"
      >
        <form onSubmit={handlePodiumSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome Completo do Servidor / Atleta</label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Silva, Maria Santos..."
              value={newPodium.participant_name}
              onChange={(e) => setNewPodium({ ...newPodium, participant_name: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Modalidade Individual</label>
              <select
                value={newPodium.modality_id}
                onChange={(e) => setNewPodium({ ...newPodium, modality_id: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              >
                {individualModalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Posição / Medalha</label>
              <select
                value={newPodium.position}
                onChange={(e) => setNewPodium({ ...newPodium, position: parseInt(e.target.value) as any })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold text-m3-primary"
              >
                <option value={1}>🥇 1º Lugar - Ouro (10 pontos)</option>
                <option value={2}>🥈 2º Lugar - Prata (7 pontos)</option>
                <option value={3}>🥉 3º Lugar - Bronze (5 pontos)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Campus do Servidor</label>
              <select
                value={newPodium.campus_id}
                onChange={(e) => setNewPodium({ ...newPodium, campus_id: e.target.value })}
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
              <label className="block text-xs font-semibold mb-1">Prova / Categoria</label>
              <input
                type="text"
                placeholder="Ex: 50m Livre, Absoluto, 5km..."
                value={newPodium.event_category}
                onChange={(e) => setNewPodium({ ...newPodium, event_category: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Detalhes (Tempo ou Pontuação)</label>
            <input
              type="text"
              placeholder="Ex: 00:27.42, 5/5 vitórias..."
              value={newPodium.score_time_detail}
              onChange={(e) => setNewPodium({ ...newPodium, score_time_detail: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button variant="text" size="sm" type="button" onClick={() => setIsPodiumModalOpen(false)}>
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" type="submit">
              Salvar Pódio e Pontuar Campus
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Cadastrar Novo Participante */}
      <M3Dialog
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        title="Inscrever Servidor em Modalidade Individual"
      >
        <form onSubmit={handleParticipantSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome Completo</label>
            <input
              type="text"
              required
              placeholder="Nome do servidor(a)"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Campus de Lotação</label>
              <select
                value={newParticipant.campus_id}
                onChange={(e) => setNewParticipant({ ...newParticipant, campus_id: e.target.value })}
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
              <label className="block text-xs font-semibold mb-1">Modalidade</label>
              <select
                value={newParticipant.modality_id}
                onChange={(e) => setNewParticipant({ ...newParticipant, modality_id: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              >
                {individualModalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button variant="text" size="sm" type="button" onClick={() => setIsParticipantModalOpen(false)}>
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" type="submit">
              Confirmar Inscrição
            </M3Button>
          </div>
        </form>
      </M3Dialog>
    </div>
  );
};

