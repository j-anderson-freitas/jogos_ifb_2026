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
  subscribeToMatches,
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
  isLoading: boolean;
  refreshData: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    try {
      const [c, m, t, mat, r, n, part, pod] = await Promise.all([
        getCampuses(),
        getModalities(),
        getTeams(),
        getMatches(),
        getRegulations(),
        getNotices(),
        getParticipants(),
        getPodiums(),
      ]);
      setCampuses(c);
      setModalities(m);
      setTeams(t);
      setMatches(mat);
      setRegulations(r);
      setNotices(n);
      setParticipants(part);
      setPodiums(pod);
    } catch (err) {
      console.error('Erro ao sincronizar dados do JIS:', err);
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
    refreshData: loadData,
  };
}
