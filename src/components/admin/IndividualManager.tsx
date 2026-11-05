import React, { useState, useRef } from 'react';
import { Modality, Campus, IndividualParticipant, IndividualPodium, DistanceRecord } from '../../types/database';
import {
  saveParticipant,
  deleteParticipant,
  savePodium,
  deletePodium,
  saveDistance,
  saveBatchDistances,
  deleteDistance,
} from '../../lib/supabase';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import {
  Plus,
  UserPlus,
  Trophy,
  Trash2,
  Medal,
  Search,
  AlertCircle,
  Footprints,
  FileSpreadsheet,
  Upload,
} from 'lucide-react';

export interface IndividualManagerProps {
  modalities: Modality[];
  campuses: Campus[];
  participants: IndividualParticipant[];
  podiums: IndividualPodium[];
  distances: DistanceRecord[];
  onDataChanged: () => void;
}

export const IndividualManager: React.FC<IndividualManagerProps> = ({
  modalities,
  campuses,
  participants,
  podiums,
  distances,
  onDataChanged,
}) => {
  const individualModalities = modalities.filter((m) => m.type === 'individual');

  const [activeTab, setActiveTab] = useState<'podiums' | 'participants' | 'distances'>('podiums');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais
  const [isPodiumModalOpen, setIsPodiumModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isDistanceModalOpen, setIsDistanceModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Form State Distância
  const [newDistance, setNewDistance] = useState<Partial<DistanceRecord>>({
    participant_name: '',
    campus_id: campuses[0]?.id || 'campus-brasilia',
    distance_km: 5,
    category: 'Servidor',
  });

  const handlePodiumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodium.participant_name) return;

    const toSave: IndividualPodium = {
      id: `podium-${Date.now()}`,
      modality_id: newPodium.modality_id || 'xadrez-aberto',
      event_category: newPodium.event_category || 'Geral',
      position: (Number(newPodium.position) as 1 | 2 | 3) || 1,
      participant_name: newPodium.participant_name.trim(),
      campus_id: newPodium.campus_id || campuses[0]?.id || 'campus-brasilia',
      score_time_detail: newPodium.score_time_detail?.trim(),
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
      name: newParticipant.name.trim(),
      campus_id: newParticipant.campus_id || campuses[0]?.id || 'campus-brasilia',
      modality_id: newParticipant.modality_id || 'xadrez-aberto',
      event_category: newParticipant.event_category?.trim() || 'Geral',
      created_at: new Date().toISOString(),
    };

    await saveParticipant(toSave);
    setIsParticipantModalOpen(false);
    setNewParticipant({ ...newParticipant, name: '' });
    onDataChanged();
  };

  const handleDistanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistance.participant_name || !newDistance.distance_km) return;

    const toSave: DistanceRecord = {
      id: `dist-${Date.now()}`,
      participant_name: newDistance.participant_name.trim(),
      campus_id: newDistance.campus_id || campuses[0]?.id || 'campus-brasilia',
      distance_km: Number(newDistance.distance_km) || 0,
      category: newDistance.category || 'Servidor',
      created_at: new Date().toISOString(),
    };

    await saveDistance(toSave);
    setIsDistanceModalOpen(false);
    setNewDistance({ ...newDistance, participant_name: '', distance_km: 5 });
    onDataChanged();
  };

  // Importador de Planilha CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/).filter(Boolean);
      const parsedRecords: DistanceRecord[] = [];

      lines.forEach((line, idx) => {
        // Ignora cabeçalho se houver
        if (idx === 0 && (line.toLowerCase().includes('nome') || line.toLowerCase().includes('servidor'))) {
          return;
        }

        const parts = line.split(/[,;\t]/).map((p) => p.trim());
        if (parts.length >= 2) {
          const name = parts[0];
          const campusStr = parts[1];
          const kmStr = parts[2]?.replace(',', '.') || '5';
          const km = parseFloat(kmStr) || 0;

          // Localizar campus
          const matchedCampus = campuses.find(
            (c) =>
              c.name.toLowerCase().includes(campusStr.toLowerCase()) ||
              c.short_name.toLowerCase().includes(campusStr.toLowerCase()) ||
              c.id.toLowerCase() === campusStr.toLowerCase()
          );

          if (name && km > 0) {
            parsedRecords.push({
              id: `dist-import-${Date.now()}-${idx}`,
              participant_name: name,
              campus_id: matchedCampus?.id || campuses[0]?.id || 'campus-brasilia',
              distance_km: km,
              category: 'Servidor',
              created_at: new Date().toISOString(),
            });
          }
        }
      });

      if (parsedRecords.length > 0) {
        await saveBatchDistances(parsedRecords);
        onDataChanged();
        alert(`✅ ${parsedRecords.length} registros de distância importados com sucesso da planilha!`);
      } else {
        alert('⚠️ Não foi possível identificar registros válidos. Use o formato: Nome, Campus, Distância (km)');
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const getCampusName = (campusId: string) => {
    return campuses.find((c) => c.id === campusId)?.name || campusId;
  };

  const getModalityName = (modalityId: string) => {
    return modalities.find((m) => m.id === modalityId)?.name || modalityId;
  };

  return (
    <div className="space-y-6">
      {/* Input oculto para importação de CSV */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".csv,.txt"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Header e Alternador de Seções */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg border border-m3-outline-variant/30">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Modalidades Individuais & Corrida/Caminhada
          </h2>
          <p className="text-xs text-slate-500">
            Xadrez, Damas, Tênis de Mesa, Natação e Desafio de Quilometragem
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <M3Button
            variant="filled"
            size="sm"
            icon={<Trophy size={16} />}
            onClick={() => setIsPodiumModalOpen(true)}
          >
            Lançar Pódio
          </M3Button>
          <M3Button
            variant="tonal"
            size="sm"
            icon={<UserPlus size={16} />}
            onClick={() => setIsParticipantModalOpen(true)}
          >
            Novo Participante
          </M3Button>
          <M3Button
            variant="tonal"
            size="sm"
            icon={<Footprints size={16} />}
            onClick={() => setIsDistanceModalOpen(true)}
          >
            Lançar KM
          </M3Button>
          <M3Button
            variant="outlined"
            size="sm"
            icon={<Upload size={16} />}
            onClick={() => fileInputRef.current?.click()}
          >
            Importar Planilha (CSV)
          </M3Button>
        </div>
      </div>

      {/* Tabs M3 para alternar entre Pódios, Participantes e Distâncias */}
      <div className="inline-flex rounded-m3-full p-1 bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border border-m3-outline-variant/40">
        <button
          onClick={() => setActiveTab('podiums')}
          className={`px-4 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
            activeTab === 'podiums'
              ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Pódios e Medalhas ({podiums.length})
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`px-4 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
            activeTab === 'participants'
              ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Servidores Inscritos ({participants.length})
        </button>
        <button
          onClick={() => setActiveTab('distances')}
          className={`px-4 py-1.5 rounded-m3-full text-xs font-bold transition-all ${
            activeTab === 'distances'
              ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-extrabold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          Caminhada & Corrida ({distances.length} KMs)
        </button>
      </div>

      {/* 1. ABA DE PÓDIOS */}
      {activeTab === 'podiums' && (
        <div className="space-y-3">
          {podiums.length === 0 ? (
            <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
              <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhum pódio lançado ainda</h4>
              <p className="text-xs text-slate-500 mt-1">
                Clique em "Lançar Pódio" para registrar servidores medalhistas (1º, 2º e 3º lugares) e atribuir pontos ao Campus!
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
                  <M3Card key={pod.id} variant="elevated" className="p-4 flex flex-col justify-between border border-m3-outline-variant/30">
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
                        onClick={async () => {
                          if (confirm(`Remover pódio de ${pod.participant_name}?`)) {
                            await deletePodium(pod.id);
                            onDataChanged();
                          }
                        }}
                        className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        Remover
                      </button>
                    </div>
                  </M3Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. ABA DE PARTICIPANTES INSCRITOS */}
      {activeTab === 'participants' && (
        <div className="space-y-3">
          {participants.length === 0 ? (
            <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
              <UserPlus className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhum servidor inscrito cadastrado</h4>
              <p className="text-xs text-slate-500 mt-1">
                Adicione os servidores participantes para somar 1 ponto de participação por inscrição para cada campus!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {participants.map((part) => (
                <M3Card key={part.id} variant="elevated" className="p-3.5 flex items-center justify-between border border-m3-outline-variant/30">
                  <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">{part.name}</h5>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{getCampusName(part.campus_id)}</span>
                      <span>•</span>
                      <span className="font-semibold text-m3-primary">{getModalityName(part.modality_id)}</span>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm(`Remover participante ${part.name}?`)) {
                        await deleteParticipant(part.id);
                        onDataChanged();
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-full"
                    title="Remover"
                  >
                    <Trash2 size={15} />
                  </button>
                </M3Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. ABA DE DISTÂNCIAS (CAMINHADA & CORRIDA) */}
      {activeTab === 'distances' && (
        <div className="space-y-3">
          {distances.length === 0 ? (
            <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
              <Footprints className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhuma distância registrada</h4>
              <p className="text-xs text-slate-500 mt-1">
                Clique em "Lançar KM" ou "Importar Planilha (CSV)" para adicionar as quilometragens percorridas pelos servidores!
              </p>
            </div>
          ) : (
            <M3Card variant="elevated" className="overflow-hidden border border-m3-outline-variant/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-semibold border-b border-m3-outline-variant/30">
                      <th className="py-2.5 px-3">Servidor(a)</th>
                      <th className="py-2.5 px-3">Campus</th>
                      <th className="py-2.5 px-3">Categoria</th>
                      <th className="py-2.5 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">Distância (KM)</th>
                      <th className="py-2.5 px-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-m3-outline-variant/20">
                    {distances.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {d.participant_name}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          {getCampusName(d.campus_id)}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{d.category || 'Servidor'}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          {d.distance_km} km
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(`Remover registro de ${d.participant_name}?`)) {
                                await deleteDistance(d.id);
                                onDataChanged();
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            title="Remover"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </M3Card>
          )}
        </div>
      )}

      {/* Modal: Lançar Pódio */}
      <M3Dialog
        isOpen={isPodiumModalOpen}
        onClose={() => setIsPodiumModalOpen(false)}
        title="Lançar Pódio (Medalha de Modalidade Individual)"
      >
        <form onSubmit={handlePodiumSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Colocação no Pódio</label>
              <select
                value={newPodium.position}
                onChange={(e) => setNewPodium({ ...newPodium, position: Number(e.target.value) as any })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
              >
                <option value={1}>🥇 1º Lugar (Ouro - 10 pts)</option>
                <option value={2}>🥈 2º Lugar (Prata - 7 pts)</option>
                <option value={3}>🥉 3º Lugar (Bronze - 5 pts)</option>
              </select>
            </div>
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
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Nome Completo do Servidor(a)</label>
            <input
              type="text"
              required
              placeholder="Ex: João da Silva"
              value={newPodium.participant_name}
              onChange={(e) => setNewPodium({ ...newPodium, participant_name: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Prova / Categoria</label>
              <input
                type="text"
                placeholder="Ex: 50m Livre Masc, Geral..."
                value={newPodium.event_category}
                onChange={(e) => setNewPodium({ ...newPodium, event_category: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Resultado / Tempo (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: 27s45, 5 rodadas..."
                value={newPodium.score_time_detail}
                onChange={(e) => setNewPodium({ ...newPodium, score_time_detail: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button variant="text" size="sm" type="button" onClick={() => setIsPodiumModalOpen(false)}>
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" type="submit">
              Salvar Pódio
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Novo Participante */}
      <M3Dialog
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        title="Cadastrar Servidor Participante (1 pt por inscrição)"
      >
        <form onSubmit={handleParticipantSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome Completo do Servidor(a)</label>
            <input
              type="text"
              required
              placeholder="Ex: Maria Pereira"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Campus</label>
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
              Cadastrar Participante
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Lançar Distância (KM) */}
      <M3Dialog
        isOpen={isDistanceModalOpen}
        onClose={() => setIsDistanceModalOpen(false)}
        title="Lançar Distância de Caminhada/Corrida"
      >
        <form onSubmit={handleDistanceSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome do Servidor(a)</label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Mendes"
              value={newDistance.participant_name}
              onChange={(e) => setNewDistance({ ...newDistance, participant_name: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Campus</label>
              <select
                value={newDistance.campus_id}
                onChange={(e) => setNewDistance({ ...newDistance, campus_id: e.target.value })}
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
              <label className="block text-xs font-semibold mb-1">Distância (em Quilômetros)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={newDistance.distance_km}
                onChange={(e) => setNewDistance({ ...newDistance, distance_km: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button variant="text" size="sm" type="button" onClick={() => setIsDistanceModalOpen(false)}>
              Cancelar
            </M3Button>
            <M3Button variant="filled" size="sm" type="submit">
              Salvar Distância
            </M3Button>
          </div>
        </form>
      </M3Dialog>
    </div>
  );
};
