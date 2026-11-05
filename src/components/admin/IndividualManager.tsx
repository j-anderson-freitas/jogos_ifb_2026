import React, { useState, useMemo } from 'react';
import { Modality, Campus, IndividualParticipant, IndividualPodium, DistanceRecord, CollectiveTeam } from '../../types/database';
import {
  saveParticipant,
  deleteParticipant,
  savePodium,
  deletePodium,
  saveDistance,
  deleteDistance,
} from '../../lib/supabase';
import { M3Button } from '../m3/M3Button';
import { M3Card } from '../m3/M3Card';
import { M3Dialog } from '../m3/M3Dialog';
import {
  Trophy,
  UserPlus,
  Trash2,
  Medal,
  Search,
  AlertCircle,
  Footprints,
  Calendar,
  Users,
  Pencil,
} from 'lucide-react';

export interface IndividualManagerProps {
  modalities: Modality[];
  campuses: Campus[];
  participants: IndividualParticipant[];
  podiums: IndividualPodium[];
  distances: DistanceRecord[];
  teams: CollectiveTeam[];
  onDataChanged: () => void;
}

export const IndividualManager: React.FC<IndividualManagerProps> = ({
  modalities,
  campuses,
  participants,
  podiums,
  distances,
  teams,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'podiums' | 'participants' | 'distances'>('podiums');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais de Criação
  const [isPodiumModalOpen, setIsPodiumModalOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isDistanceModalOpen, setIsDistanceModalOpen] = useState(false);

  // Modais e Estados de Edição
  const [isEditParticipantModalOpen, setIsEditParticipantModalOpen] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<IndividualParticipant | null>(null);

  const [isEditDistanceModalOpen, setIsEditDistanceModalOpen] = useState(false);
  const [editingDistance, setEditingDistance] = useState<DistanceRecord | null>(null);

  // Form State Pódio Unificado (Coletivo e Individual)
  const [newPodium, setNewPodium] = useState<Partial<IndividualPodium>>({
    modality_id: modalities[0]?.id || 'futsal-masc',
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
    modality_id: modalities.find((m) => m.type === 'individual')?.id || 'corrida-caminhada',
    event_category: 'Geral',
  });

  // Form State Distância Diária
  const todayFormatted = useMemo(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}/${m}/${y}`;
  }, []);

  const [newDistance, setNewDistance] = useState<Partial<DistanceRecord>>({
    participant_name: '',
    campus_id: campuses[0]?.id || 'campus-brasilia',
    distance_km: 5.0,
    date: todayFormatted,
    category: 'Servidor',
  });

  // Listagens Ordenadas Alfabeticamente (A-Z) para Filtros e Modais
  const sortedCampuses = useMemo(() => {
    return [...campuses].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [campuses]);

  const sortedIndividualModalities = useMemo(() => {
    return modalities
      .filter((m) => m.type === 'individual' || m.id === 'corrida-caminhada')
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [modalities]);

  // Lista de servidores participantes ordenada em ordem alfabética (A-Z)
  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [participants]);

  // Servidores inscritos na Corrida / Caminhada ordenados em ordem alfabética
  const runners = useMemo(() => {
    return participants
      .filter((p) => p.modality_id === 'corrida-caminhada')
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [participants]);

  // Registros de distância ordenados por data e servidor
  const sortedDistances = useMemo(() => {
    return [...distances].sort((a, b) => {
      const [dA, mA, yA] = (a.date || '').split('/').map(Number);
      const [dB, mB, yB] = (b.date || '').split('/').map(Number);
      const timeA = yA ? new Date(yA, (mA || 1) - 1, dA || 1).getTime() : 0;
      const timeB = yB ? new Date(yB, (mB || 1) - 1, dB || 1).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return a.participant_name.localeCompare(b.participant_name, 'pt-BR');
    });
  }, [distances]);

  // Modalidade selecionada no pódio
  const selectedPodiumModality = useMemo(() => {
    return modalities.find((m) => m.id === newPodium.modality_id);
  }, [modalities, newPodium.modality_id]);

  const isSelectedModalityCollective = selectedPodiumModality?.type === 'coletiva';

  // Equipes disponíveis para a modalidade coletiva selecionada
  const availableTeamsForPodium = useMemo(() => {
    if (!newPodium.modality_id || !isSelectedModalityCollective) return [];
    return teams
      .filter((t) => t.modality_id === newPodium.modality_id)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [teams, newPodium.modality_id, isSelectedModalityCollective]);

  // Atletas participantes disponíveis para a modalidade individual selecionada
  const availableParticipantsForPodium = useMemo(() => {
    if (!newPodium.modality_id || isSelectedModalityCollective) return [];
    return participants
      .filter((p) => p.modality_id === newPodium.modality_id)
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [participants, newPodium.modality_id, isSelectedModalityCollective]);

  // Ao mudar a modalidade no pódio, reseta o nome e vincula o primeiro item disponível
  const handlePodiumModalityChange = (modalityId: string) => {
    const mod = modalities.find((m) => m.id === modalityId);
    if (mod?.type === 'coletiva') {
      const available = teams.filter((t) => t.modality_id === modalityId);
      const firstTeam = available[0];
      setNewPodium({
        ...newPodium,
        modality_id: modalityId,
        participant_name: firstTeam?.name || '',
        campus_id: firstTeam?.campus_id || campuses[0]?.id || 'campus-brasilia',
      });
    } else {
      const available = participants.filter((p) => p.modality_id === modalityId);
      const firstPart = available[0];
      setNewPodium({
        ...newPodium,
        modality_id: modalityId,
        participant_name: firstPart?.name || '',
        campus_id: firstPart?.campus_id || campuses[0]?.id || 'campus-brasilia',
      });
    }
  };

  const handlePodiumSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPodium.participant_name) return;

    const toSave: IndividualPodium = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'),
      modality_id: newPodium.modality_id || modalities[0]?.id || 'futsal-masc',
      event_category: newPodium.event_category || 'Geral',
      position: (Number(newPodium.position) as 1 | 2 | 3) || 1,
      participant_name: newPodium.participant_name.trim(),
      campus_id: newPodium.campus_id || campuses[0]?.id || 'campus-brasilia',
      score_time_detail: newPodium.score_time_detail?.trim(),
      created_at: new Date().toISOString(),
    };

    await savePodium(toSave);
    setIsPodiumModalOpen(false);
    onDataChanged();
  };

  const handleParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParticipant.name) return;

    const toSave: IndividualParticipant = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : '00000000-0000-4000-8000-' + Date.now().toString(16).padStart(12, '0'),
      name: newParticipant.name.trim(),
      campus_id: newParticipant.campus_id || campuses[0]?.id || 'campus-brasilia',
      modality_id: newParticipant.modality_id || 'corrida-caminhada',
      event_category: newParticipant.event_category?.trim() || 'Geral',
      created_at: new Date().toISOString(),
    };

    await saveParticipant(toSave);
    setIsParticipantModalOpen(false);
    setNewParticipant({ ...newParticipant, name: '' });
    onDataChanged();
  };

  const handleOpenEditParticipant = (p: IndividualParticipant) => {
    setEditingParticipant({ ...p });
    setIsEditParticipantModalOpen(true);
  };

  const handleEditParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingParticipant || !editingParticipant.name.trim()) return;

    const originalParticipant = participants.find((p) => p.id === editingParticipant.id);
    const updatedParticipant: IndividualParticipant = {
      ...editingParticipant,
      name: editingParticipant.name.trim(),
      campus_id: editingParticipant.campus_id || campuses[0]?.id || 'campus-brasilia',
      modality_id: editingParticipant.modality_id || 'corrida-caminhada',
      event_category: editingParticipant.event_category?.trim() || 'Geral',
    };

    await saveParticipant(updatedParticipant);

    // Se o nome ou campus do participante foi atualizado, propaga para os registros de distância vinculados
    if (originalParticipant && (originalParticipant.name.trim() !== updatedParticipant.name || originalParticipant.campus_id !== updatedParticipant.campus_id)) {
      const oldName = originalParticipant.name.trim();
      const matchingDistances = distances.filter((d) => d.participant_name.trim() === oldName);
      for (const dist of matchingDistances) {
        await saveDistance({
          ...dist,
          participant_name: updatedParticipant.name,
          campus_id: updatedParticipant.campus_id,
        });
      }
    }

    setIsEditParticipantModalOpen(false);
    setEditingParticipant(null);
    onDataChanged();
  };

  const handleDistanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDistance.participant_name || !newDistance.distance_km) return;

    const toSave: DistanceRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `dist-${Date.now()}`,
      participant_name: newDistance.participant_name.trim(),
      campus_id: newDistance.campus_id || campuses[0]?.id || 'campus-brasilia',
      distance_km: Number(newDistance.distance_km) || 0,
      date: newDistance.date || todayFormatted,
      category: (newDistance.category as any) || 'Servidor',
      created_at: new Date().toISOString(),
    };

    await saveDistance(toSave);
    setIsDistanceModalOpen(false);
    setNewDistance({
      ...newDistance,
      distance_km: 5.0,
      date: todayFormatted,
    });
    onDataChanged();
  };

  const handleOpenEditDistance = (d: DistanceRecord) => {
    setEditingDistance({ ...d });
    setIsEditDistanceModalOpen(true);
  };

  const handleEditDistanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDistance || !editingDistance.participant_name || !editingDistance.distance_km) return;

    const updatedDistance: DistanceRecord = {
      ...editingDistance,
      participant_name: editingDistance.participant_name.trim(),
      campus_id: editingDistance.campus_id || campuses[0]?.id || 'campus-brasilia',
      distance_km: Number(editingDistance.distance_km) || 0,
      date: editingDistance.date?.trim() || todayFormatted,
      category: (editingDistance.category as any) || 'Servidor',
    };

    await saveDistance(updatedDistance);
    setIsEditDistanceModalOpen(false);
    setEditingDistance(null);
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
      {/* Header e Ações Principais */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-m3-surface-container dark:bg-m3-surface-container-dark p-4 rounded-m3-lg border border-m3-outline-variant/30">
        <div>
          <h2 className="text-lg font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Pódios Oficiais & Atletas dos Jogos
          </h2>
          <p className="text-xs text-slate-500">
            Lançamento oficial de medalhas (coletivas e individuais), servidores participantes e registro diário da corrida
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <M3Button
            variant="filled"
            size="sm"
            icon={<Trophy size={16} />}
            onClick={() => {
              handlePodiumModalityChange(modalities[0]?.id || 'futsal-masc');
              setIsPodiumModalOpen(true);
            }}
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
            onClick={() => {
              if (runners.length > 0) {
                const first = runners[0];
                setNewDistance((prev) => ({
                  ...prev,
                  participant_name: first.name,
                  campus_id: first.campus_id,
                  date: todayFormatted,
                }));
              }
              setIsDistanceModalOpen(true);
            }}
          >
            Lançar KM Diário
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
          Caminhada & Corrida ({distances.length} Registros)
        </button>
      </div>

      {/* 1. ABA DE PÓDIOS (UNIFICADA COLETIVA E INDIVIDUAL) */}
      {activeTab === 'podiums' && (
        <div className="space-y-3">
          {podiums.length === 0 ? (
            <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
              <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhum pódio lançado ainda</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Cadastre os campeões das modalidades coletivas (Futsal, Vôlei, Futevôlei, Basquete) e individuais (Xadrez, Natação, Tênis de Mesa) para alimentar o Quadro de Medalhas.
              </p>
              <M3Button
                variant="filled"
                size="sm"
                icon={<Trophy size={16} />}
                onClick={() => {
                  handlePodiumModalityChange(modalities[0]?.id || 'futsal-masc');
                  setIsPodiumModalOpen(true);
                }}
              >
                Lançar Primeiro Pódio
              </M3Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {podiums.map((pod) => {
                const mod = modalities.find((m) => m.id === pod.modality_id);
                return (
                  <M3Card key={pod.id} variant="elevated" className="relative p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {mod?.name || pod.modality_id} • {mod?.type === 'coletiva' ? 'Coletiva' : 'Individual'}
                        </span>
                        <div className="flex items-center gap-1">
                          {pod.position === 1 && (
                            <span className="flex items-center gap-1 text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                              <Medal size={14} /> 1º Ouro (10 pts)
                            </span>
                          )}
                          {pod.position === 2 && (
                            <span className="flex items-center gap-1 text-xs font-black text-slate-400 bg-slate-400/10 px-2 py-0.5 rounded-full">
                              <Medal size={14} /> 2º Prata (7 pts)
                            </span>
                          )}
                          {pod.position === 3 && (
                            <span className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-700/10 px-2 py-0.5 rounded-full">
                              <Medal size={14} /> 3º Bronze (5 pts)
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {pod.participant_name}
                      </h4>
                      <p className="text-xs text-m3-primary dark:text-m3-primary-dark font-medium">
                        {getCampusName(pod.campus_id)}
                      </p>

                      {pod.event_category && (
                        <p className="text-[11px] text-slate-400 mt-1">
                          Categoria: {pod.event_category}
                        </p>
                      )}
                      {pod.score_time_detail && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">
                          Marca: {pod.score_time_detail}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-m3-outline-variant/30 flex justify-end">
                      <button
                        onClick={async () => {
                          if (confirm(`Remover pódio de ${pod.participant_name}?`)) {
                            await deletePodium(pod.id);
                            onDataChanged();
                          }
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950"
                      >
                        <Trash2 size={13} />
                        Excluir Pódio
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
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar servidor por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-m3-full bg-m3-surface-container dark:bg-m3-surface-container-dark border border-m3-outline-variant text-slate-900 dark:text-white"
              />
            </div>
            <p className="text-xs text-slate-500">
              Servidores inscritos nas modalidades individuais e na caminhada/corrida.
            </p>
          </div>

          {participants.length === 0 ? (
            <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
              <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhum servidor cadastrado</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Cadastre os servidores inscritos nas modalidades individuais e na caminhada/corrida.
              </p>
              <M3Button
                variant="filled"
                size="sm"
                icon={<UserPlus size={16} />}
                onClick={() => setIsParticipantModalOpen(true)}
              >
                Cadastrar Primeiro Participante
              </M3Button>
            </div>
          ) : (
            <M3Card variant="elevated" className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark text-slate-800 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-m3-outline-variant/30">
                    <tr>
                      <th className="py-2.5 px-3">Servidor(a)</th>
                      <th className="py-2.5 px-3">Modalidade</th>
                      <th className="py-2.5 px-3">Campus</th>
                      <th className="py-2.5 px-3">Categoria</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-m3-outline-variant/20">
                    {sortedParticipants
                      .filter((p) => {
                        const term = searchTerm.toLowerCase();
                        return (
                          p.name.toLowerCase().includes(term) ||
                          getCampusName(p.campus_id).toLowerCase().includes(term) ||
                          getModalityName(p.modality_id).toLowerCase().includes(term)
                        );
                      })
                      .map((part) => (
                        <tr key={part.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                            {part.name}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-m3-primary/10 text-m3-primary dark:text-m3-primary-dark font-medium">
                              {getModalityName(part.modality_id)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">{getCampusName(part.campus_id)}</td>
                          <td className="py-2.5 px-3 text-slate-400">{part.event_category || 'Geral'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleOpenEditParticipant(part)}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-m3-primary hover:bg-m3-primary/10 rounded transition-colors"
                                title="Editar servidor"
                                aria-label={`Editar ${part.name}`}
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(`Remover participante ${part.name}?`)) {
                                    await deleteParticipant(part.id);
                                    onDataChanged();
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                                title="Remover"
                                aria-label={`Remover ${part.name}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
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

      {/* 3. ABA DE DISTÂNCIAS (CAMINHADA & CORRIDA - REGISTRO DIÁRIO) */}
      {activeTab === 'distances' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-m3-md border border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Footprints className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Desafio da Caminhada & Corrida • Lançamento Diário
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Selecione o servidor inscrito, informe a data e a quilometragem percorrida no dia. No dashboard público será exibida apenas a soma total acumulada.
                </p>
              </div>
            </div>
            <M3Button
              variant="filled"
              size="sm"
              icon={<Footprints size={15} />}
              onClick={() => {
                if (runners.length > 0) {
                  const first = runners[0];
                  setNewDistance((prev) => ({
                    ...prev,
                    participant_name: first.name,
                    campus_id: first.campus_id,
                    date: todayFormatted,
                  }));
                }
                setIsDistanceModalOpen(true);
              }}
            >
              Lançar KM Diário
            </M3Button>
          </div>

          {distances.length === 0 ? (
            <div className="p-8 text-center bg-m3-surface-container-lowest dark:bg-m3-surface-container-lowest-dark rounded-m3-lg border border-dashed border-m3-outline-variant">
              <Footprints className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Nenhum registro de quilometragem</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                Lance os KMs percorridos diariamente pelos servidores da corrida e caminhada para pontuar para seus respectivos campi.
              </p>
              <M3Button
                variant="filled"
                size="sm"
                icon={<Footprints size={16} />}
                onClick={() => setIsDistanceModalOpen(true)}
              >
                Lançar Primeiro KM
              </M3Button>
            </div>
          ) : (
            <M3Card variant="elevated" className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark text-slate-800 dark:text-slate-200 uppercase font-bold text-[10px] tracking-wider border-b border-m3-outline-variant/30">
                    <tr>
                      <th className="py-2.5 px-3">Data</th>
                      <th className="py-2.5 px-3">Servidor(a)</th>
                      <th className="py-2.5 px-3">Campus</th>
                      <th className="py-2.5 px-3">Distância do Dia</th>
                      <th className="py-2.5 px-3">Categoria</th>
                      <th className="py-2.5 px-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-m3-outline-variant/20">
                    {sortedDistances.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                          <Calendar size={13} className="text-emerald-500" />
                          {d.date || (d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : '-')}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                          {d.participant_name}
                        </td>
                        <td className="py-2.5 px-3">{getCampusName(d.campus_id)}</td>
                        <td className="py-2.5 px-3 font-black text-emerald-600 dark:text-emerald-400">
                          {d.distance_km.toFixed(1)} km
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{d.category || 'Servidor'}</td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditDistance(d)}
                              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors"
                              title="Editar registro de quilometragem"
                              aria-label={`Editar registro de ${d.participant_name}`}
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Remover registro de ${d.participant_name} (${d.distance_km} km em ${d.date || 'data não informada'})?`)) {
                                  await deleteDistance(d.id);
                                  onDataChanged();
                                }
                              }}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors"
                              title="Remover"
                              aria-label={`Remover registro de ${d.participant_name}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
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

      {/* Modal: Lançar Pódio (Unificado para Modalidades Coletivas e Individuais) */}
      <M3Dialog
        isOpen={isPodiumModalOpen}
        onClose={() => setIsPodiumModalOpen(false)}
        title="Lançar Pódio Oficial (Medalha de Modalidade)"
      >
        <form onSubmit={handlePodiumSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Modalidade Esportiva</label>
            <select
              value={newPodium.modality_id}
              onChange={(e) => handlePodiumModalityChange(e.target.value)}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
            >
              <optgroup label="Modalidades Coletivas">
                {modalities
                  .filter((m) => m.type === 'coletiva')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Modalidades Individuais">
                {modalities
                  .filter((m) => m.type === 'individual')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category})
                    </option>
                  ))}
              </optgroup>
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
              <label className="block text-xs font-semibold mb-1">Campus</label>
              <select
                disabled
                value={newPodium.campus_id}
                className="w-full text-xs p-2 rounded-m3-sm bg-slate-100 dark:bg-slate-800 border border-m3-outline-variant text-slate-500 font-medium"
              >
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo de Seleção Estrita: Equipe (se Coletiva) ou Servidor (se Individual) */}
          {isSelectedModalityCollective ? (
            <div>
              <label className="block text-xs font-semibold mb-1">
                Equipe Campeã/Premiada ({availableTeamsForPodium.length} cadastradas)
              </label>
              {availableTeamsForPodium.length === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-xs rounded-m3-sm border border-amber-300">
                  <AlertCircle size={16} />
                  <span>Nenhuma equipe cadastrada para esta modalidade. Cadastre na aba "Equipes & Avatars".</span>
                </div>
              ) : (
                <select
                  required
                  value={newPodium.participant_name}
                  onChange={(e) => {
                    const selected = availableTeamsForPodium.find((t) => t.name === e.target.value);
                    setNewPodium({
                      ...newPodium,
                      participant_name: e.target.value,
                      campus_id: selected?.campus_id || newPodium.campus_id,
                    });
                  }}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
                >
                  <option value="">Selecione a equipe inscrita...</option>
                  {availableTeamsForPodium.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({getCampusName(t.campus_id || '')})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold mb-1">
                Servidor(a) Atleta ({availableParticipantsForPodium.length} inscritos)
              </label>
              {availableParticipantsForPodium.length === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-xs rounded-m3-sm border border-amber-300">
                  <AlertCircle size={16} />
                  <span>Nenhum servidor inscrito nesta modalidade individual. Cadastre na aba "Servidores Inscritos".</span>
                </div>
              ) : (
                <select
                  required
                  value={newPodium.participant_name}
                  onChange={(e) => {
                    const selected = availableParticipantsForPodium.find((p) => p.name === e.target.value);
                    setNewPodium({
                      ...newPodium,
                      participant_name: e.target.value,
                      campus_id: selected?.campus_id || newPodium.campus_id,
                    });
                  }}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
                >
                  <option value="">Selecione o servidor inscrito...</option>
                  {availableParticipantsForPodium.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({getCampusName(p.campus_id)})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Prova / Categoria</label>
              <input
                type="text"
                placeholder="Ex: Geral, 50m Livre Masc..."
                value={newPodium.event_category}
                onChange={(e) => setNewPodium({ ...newPodium, event_category: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Placar / Marca / Tempo (Opcional)</label>
              <input
                type="text"
                placeholder="Ex: 2x1, 28.4s, 5 vitórias..."
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
            <M3Button
              variant="filled"
              size="sm"
              type="submit"
              disabled={
                !newPodium.participant_name ||
                (isSelectedModalityCollective && availableTeamsForPodium.length === 0) ||
                (!isSelectedModalityCollective && availableParticipantsForPodium.length === 0)
              }
            >
              Confirmar Pódio
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Novo Participante */}
      <M3Dialog
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        title="Cadastrar Servidor Participante"
      >
        <form onSubmit={handleParticipantSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Nome Completo do Servidor(a)</label>
            <input
              type="text"
              required
              placeholder="Ex: Ana Clara Souza"
              value={newParticipant.name}
              onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Campus de Lotação</label>
              <select
                value={newParticipant.campus_id}
                onChange={(e) => setNewParticipant({ ...newParticipant, campus_id: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
              >
                {sortedCampuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Modalidade Individual / Corrida</label>
              <select
                value={newParticipant.modality_id}
                onChange={(e) => setNewParticipant({ ...newParticipant, modality_id: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
              >
                {sortedIndividualModalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Categoria / Observação</label>
            <input
              type="text"
              placeholder="Ex: Geral, Servidor, 50m Livre..."
              value={newParticipant.event_category}
              onChange={(e) => setNewParticipant({ ...newParticipant, event_category: e.target.value })}
              className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
            />
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

      {/* Modal: Editar Servidor Participante */}
      <M3Dialog
        isOpen={isEditParticipantModalOpen}
        onClose={() => {
          setIsEditParticipantModalOpen(false);
          setEditingParticipant(null);
        }}
        title="Editar Servidor Participante"
      >
        {editingParticipant && (
          <form onSubmit={handleEditParticipantSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Nome Completo do Servidor(a)</label>
              <input
                type="text"
                required
                placeholder="Ex: Ana Clara Souza"
                value={editingParticipant.name}
                onChange={(e) => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Campus de Lotação</label>
                <select
                  value={editingParticipant.campus_id}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, campus_id: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
                >
                  {sortedCampuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Modalidade Individual / Corrida</label>
                <select
                  value={editingParticipant.modality_id}
                  onChange={(e) => setEditingParticipant({ ...editingParticipant, modality_id: e.target.value })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
                >
                  {sortedIndividualModalities.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Categoria / Observação</label>
              <input
                type="text"
                placeholder="Ex: Geral, Servidor, 50m Livre..."
                value={editingParticipant.event_category || ''}
                onChange={(e) => setEditingParticipant({ ...editingParticipant, event_category: e.target.value })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
              <M3Button
                variant="text"
                size="sm"
                type="button"
                onClick={() => {
                  setIsEditParticipantModalOpen(false);
                  setEditingParticipant(null);
                }}
              >
                Cancelar
              </M3Button>
              <M3Button variant="filled" size="sm" type="submit" disabled={!editingParticipant.name.trim()}>
                Salvar Alterações
              </M3Button>
            </div>
          </form>
        )}
      </M3Dialog>

      {/* Modal: Lançar KM Diário de Caminhada/Corrida */}
      <M3Dialog
        isOpen={isDistanceModalOpen}
        onClose={() => setIsDistanceModalOpen(false)}
        title="Lançar KM Diário de Caminhada / Corrida"
      >
        <form onSubmit={handleDistanceSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Servidor(a) Atleta ({runners.length} inscritos na corrida)
            </label>
            {runners.length === 0 ? (
              <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-xs rounded-m3-sm border border-amber-300">
                <AlertCircle size={16} />
                <span>Nenhum servidor cadastrado na modalidade "Caminhada e Corrida de Rua". Cadastre-o na aba "Servidores Inscritos".</span>
              </div>
            ) : (
              <select
                required
                value={newDistance.participant_name}
                onChange={(e) => {
                  const runner = runners.find((r) => r.name === e.target.value);
                  setNewDistance({
                    ...newDistance,
                    participant_name: e.target.value,
                    campus_id: runner?.campus_id || newDistance.campus_id,
                  });
                }}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
              >
                <option value="">Selecione o servidor inscrito na corrida...</option>
                {runners.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({getCampusName(r.campus_id)})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Data da Atividade (dd/mm/aaaa)</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="10/11/2026"
                  value={newDistance.date || ''}
                  onChange={(e) => setNewDistance({ ...newDistance, date: e.target.value })}
                  className="w-full pl-8 pr-2 py-2 text-xs rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Campus</label>
              <select
                disabled
                value={newDistance.campus_id}
                className="w-full text-xs p-2 rounded-m3-sm bg-slate-100 dark:bg-slate-800 border border-m3-outline-variant text-slate-500 font-medium"
              >
                {sortedCampuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Distância do Dia (em KM)</label>
              <div className="relative">
                <Footprints size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  placeholder="Ex: 5.2"
                  value={newDistance.distance_km}
                  onChange={(e) =>
                    setNewDistance({ ...newDistance, distance_km: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-8 pr-2 py-2 text-xs rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold text-emerald-600 dark:text-emerald-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Categoria</label>
              <select
                value={newDistance.category}
                onChange={(e) => setNewDistance({ ...newDistance, category: e.target.value as any })}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
              >
                <option value="Servidor">Servidor</option>
                <option value="Servidora">Servidora</option>
                <option value="Geral">Geral</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
            <M3Button variant="text" size="sm" type="button" onClick={() => setIsDistanceModalOpen(false)}>
              Cancelar
            </M3Button>
            <M3Button
              variant="filled"
              size="sm"
              type="submit"
              disabled={!newDistance.participant_name || !newDistance.distance_km || runners.length === 0}
            >
              Registrar KM do Dia
            </M3Button>
          </div>
        </form>
      </M3Dialog>

      {/* Modal: Editar Registro de Quilometragem */}
      <M3Dialog
        isOpen={isEditDistanceModalOpen}
        onClose={() => {
          setIsEditDistanceModalOpen(false);
          setEditingDistance(null);
        }}
        title="Editar Registro de Quilometragem"
      >
        {editingDistance && (
          <form onSubmit={handleEditDistanceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Servidor(a) Atleta ({runners.length} inscritos na corrida)
              </label>
              <select
                required
                value={editingDistance.participant_name}
                onChange={(e) => {
                  const runner = runners.find((r) => r.name === e.target.value);
                  setEditingDistance({
                    ...editingDistance,
                    participant_name: e.target.value,
                    campus_id: runner?.campus_id || editingDistance.campus_id,
                  });
                }}
                className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold"
              >
                <option value="">Selecione o servidor inscrito na corrida...</option>
                {runners.map((r) => (
                  <option key={r.id} value={r.name}>
                    {r.name} ({getCampusName(r.campus_id)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Data da Atividade (dd/mm/aaaa)</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="10/11/2026"
                    value={editingDistance.date || ''}
                    onChange={(e) => setEditingDistance({ ...editingDistance, date: e.target.value })}
                    className="w-full pl-8 pr-2 py-2 text-xs rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Campus</label>
                <select
                  disabled
                  value={editingDistance.campus_id}
                  className="w-full text-xs p-2 rounded-m3-sm bg-slate-100 dark:bg-slate-800 border border-m3-outline-variant text-slate-500 font-medium"
                >
                  {sortedCampuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Distância do Dia (em KM)</label>
                <div className="relative">
                  <Footprints size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="Ex: 5.2"
                    value={editingDistance.distance_km}
                    onChange={(e) =>
                      setEditingDistance({ ...editingDistance, distance_km: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full pl-8 pr-2 py-2 text-xs rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Categoria</label>
                <select
                  value={editingDistance.category || 'Servidor'}
                  onChange={(e) => setEditingDistance({ ...editingDistance, category: e.target.value as any })}
                  className="w-full text-xs p-2 rounded-m3-sm bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant"
                >
                  <option value="Servidor">Servidor</option>
                  <option value="Servidora">Servidora</option>
                  <option value="Geral">Geral</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-m3-outline-variant/30">
              <M3Button
                variant="text"
                size="sm"
                type="button"
                onClick={() => {
                  setIsEditDistanceModalOpen(false);
                  setEditingDistance(null);
                }}
              >
                Cancelar
              </M3Button>
              <M3Button
                variant="filled"
                size="sm"
                type="submit"
                disabled={!editingDistance.participant_name || !editingDistance.distance_km}
              >
                Salvar Alterações
              </M3Button>
            </div>
          </form>
        )}
      </M3Dialog>
    </div>
  );
};
