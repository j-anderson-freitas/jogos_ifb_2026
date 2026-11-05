import { useState, useEffect, useCallback } from 'react';
import {
  Campus,
  Modality,
  CollectiveTeam,
  Match,
  IndividualParticipant,
  IndividualPodium,
  Regulation,
  Notice,
  DistanceRecord,
} from '../types/database';
import {
  getCampuses,
  getModalities,
  getTeams,
  getMatches,
  getRegulations,
  getNotices,
  getParticipants,
  getPodiums,
  getDistances,
  subscribeToMatches,
  syncRegulationsToSupabase,
} from '../lib/supabase';

export interface UseJISDataReturn {
  campuses: Campus[];
  modalities: Modality[];
  teams: CollectiveTeam[];
  matches: Match[];
  regulations: Regulation[];
  notices: Notice[];
  participants: IndividualParticipant[];
  podiums: IndividualPodium[];
  distances: DistanceRecord[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  syncRegulations: () => Promise<boolean>;
}

export function useJISData(): UseJISDataReturn {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [teams, setTeams] = useState<CollectiveTeam[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [participants, setParticipants] = useState<IndividualParticipant[]>([]);
  const [podiums, setPodiums] = useState<IndividualPodium[]>([]);
  const [distances, setDistances] = useState<DistanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const [c, m, t, mat, r, n, part, pod, dist] = await Promise.all([
        getCampuses(),
        getModalities(),
        getTeams(),
        getMatches(),
        getRegulations(),
        getNotices(),
        getParticipants(),
        getPodiums(),
        getDistances(),
      ]);
      setCampuses(c);
      setModalities(m);
      setTeams(t);
      setMatches(mat);
      setRegulations(r);
      setNotices(n);
      setParticipants(part);
      setPodiums(pod);
      setDistances(dist);
    } catch (err) {
      console.error('Erro ao sincronizar dados do JIS:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSyncRegulations = useCallback(async (): Promise<boolean> => {
    const success = await syncRegulationsToSupabase();
    if (success) {
      const fresh = await getRegulations();
      setRegulations(fresh);
    }
    return success;
  }, []);

  useEffect(() => {
    loadData();

    // Inscrição reativa para atualizações em tempo real (Supabase Realtime)
    const unsubscribe = subscribeToMatches((freshMatches) => {
      setMatches(freshMatches);
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  return {
    campuses,
    modalities,
    teams,
    matches,
    regulations,
    notices,
    participants,
    podiums,
    distances,
    isLoading,
    refreshData: loadData,
    syncRegulations: handleSyncRegulations,
  };
}
