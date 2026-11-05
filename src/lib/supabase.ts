import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Campus, 
  Modality, 
  CollectiveTeam, 
  Match, 
  IndividualParticipant, 
  IndividualPodium, 
  Regulation, 
  Notice,
  DistanceRecord
} from '../types/database';
import { 
  INITIAL_CAMPUSES, 
  INITIAL_MODALITIES, 
  INITIAL_TEAMS, 
  INITIAL_MATCHES, 
  INITIAL_REGULATIONS, 
  INITIAL_NOTICES,
  INITIAL_DISTANCES,
  INITIAL_PARTICIPANTS,
  INITIAL_PODIUMS
} from './mockData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// ====================================================================
// RESILIENT LOCAL STORAGE ENGINE
// ====================================================================
const STORAGE_KEYS = {
  CAMPUSES: 'jis_campuses',
  MODALITIES: 'jis_modalities',
  TEAMS: 'jis_teams',
  MATCHES: 'jis_matches',
  PARTICIPANTS: 'jis_participants',
  PODIUMS: 'jis_podiums',
  REGULATIONS: 'jis_regulations',
  NOTICES: 'jis_notices',
  DISTANCES: 'jis_distances',
};

const getLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocal = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Erro ao salvar localmente:', err);
  }
};

// Listeners locais para emular Realtime caso o Supabase não esteja conectado
type MatchListener = (matches: Match[]) => void;
const localMatchListeners: Set<MatchListener> = new Set();

const notifyLocalMatchChange = (matches: Match[]) => {
  localMatchListeners.forEach((fn) => fn(matches));
};

// ====================================================================
// DATA ACCESS API (READ)
// ====================================================================

export async function getCampuses(): Promise<Campus[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('campuses').select('*');
      if (!error && data && data.length > 0) return data as Campus[];
    } catch (e) {
      console.warn('Fallback local para campi:', e);
    }
  }
  return getLocal<Campus[]>(STORAGE_KEYS.CAMPUSES, INITIAL_CAMPUSES);
}

export async function getModalities(): Promise<Modality[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('modalities').select('*').order('order_index');
      if (!error && data && data.length > 0) return data as Modality[];
    } catch (e) {
      console.warn('Fallback local para modalidades:', e);
    }
  }
  return getLocal<Modality[]>(STORAGE_KEYS.MODALITIES, INITIAL_MODALITIES);
}

export async function getTeams(): Promise<CollectiveTeam[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('collective_teams').select('*');
      if (!error && data && data.length > 0) return data as CollectiveTeam[];
    } catch (e) {
      console.warn('Fallback local para equipes:', e);
    }
  }
  return getLocal<CollectiveTeam[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
}

export async function getMatches(): Promise<Match[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('matches').select('*').order('round');
      if (!error && data && data.length > 0) return data as Match[];
    } catch (e) {
      console.warn('Fallback local para partidas:', e);
    }
  }
  return getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
}

export async function getRegulations(): Promise<Regulation[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('regulations').select('*').order('order_index');
      // Se o Supabase tiver o regulamento completo (22 seções ou mais), retorna do banco
      if (!error && data && data.length >= 22) {
        return data as Regulation[];
      }
      // Se tiver menos de 22 seções no banco, sincroniza automaticamente
      if (!error && data && data.length < 22) {
        console.info('Regulamento incompleto detectado no Supabase. Atualizando para 22 seções...');
        syncRegulationsToSupabase().catch(console.error);
      }
    } catch (e) {
      console.warn('Fallback local para regulamento:', e);
    }
  }
  return getLocal<Regulation[]>(STORAGE_KEYS.REGULATIONS, INITIAL_REGULATIONS);
}

export async function getNotices(): Promise<Notice[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('notices').select('*').order('published_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Notice[];
    } catch (e) {
      console.warn('Fallback local para notícias:', e);
    }
  }
  return getLocal<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
}

export async function getParticipants(): Promise<IndividualParticipant[]> {
  const localData = getLocal<IndividualParticipant[]>(STORAGE_KEYS.PARTICIPANTS, INITIAL_PARTICIPANTS);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_participants').select('*');
      if (!error && data && data.length > 0) {
        // Atualiza cache local com o banco remoto
        setLocal(STORAGE_KEYS.PARTICIPANTS, data);
        return data as IndividualParticipant[];
      }
    } catch (e) {
      console.warn('Fallback local para participantes:', e);
    }
  }
  return localData;
}

export async function getPodiums(): Promise<IndividualPodium[]> {
  const localData = getLocal<IndividualPodium[]>(STORAGE_KEYS.PODIUMS, INITIAL_PODIUMS);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_podiums').select('*');
      if (!error && data && data.length > 0) {
        setLocal(STORAGE_KEYS.PODIUMS, data);
        return data as IndividualPodium[];
      }
    } catch (e) {
      console.warn('Fallback local para pódios:', e);
    }
  }
  return localData;
}

export async function getDistances(): Promise<DistanceRecord[]> {
  const localData = getLocal<DistanceRecord[]>(STORAGE_KEYS.DISTANCES, INITIAL_DISTANCES);
  if (supabase) {
    try {
      const { data, error } = await supabase.from('distance_records').select('*').order('distance_km', { ascending: false });
      if (!error && data && data.length > 0) {
        setLocal(STORAGE_KEYS.DISTANCES, data);
        return data as DistanceRecord[];
      }
    } catch (e) {
      console.warn('Fallback local para distâncias:', e);
    }
  }
  return localData;
}

// ====================================================================
// DATA ACCESS API (WRITE / CRUD ADMIN)
// ====================================================================

export async function saveMatch(match: Match): Promise<Match> {
  match.updated_at = new Date().toISOString();

  // Salvar no local storage imediatamente
  const current = getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  const index = current.findIndex((m) => m.id === match.id);
  const updated = index >= 0 ? current.map((m) => (m.id === match.id ? match : m)) : [match, ...current];
  setLocal(STORAGE_KEYS.MATCHES, updated);
  notifyLocalMatchChange(updated);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('matches').upsert(match).select().single();
      if (!error && data) return data as Match;
    } catch (e) {
      console.warn('Erro ao salvar no Supabase, mantido localmente:', e);
    }
  }

  return match;
}

export async function deleteMatch(id: string): Promise<boolean> {
  const current = getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  const updated = current.filter((m) => m.id !== id);
  setLocal(STORAGE_KEYS.MATCHES, updated);
  notifyLocalMatchChange(updated);

  if (supabase) {
    try {
      await supabase.from('matches').delete().eq('id', id);
    } catch (e) {
      console.warn('Erro ao deletar no Supabase:', e);
    }
  }

  return true;
}

export async function saveTeam(team: CollectiveTeam): Promise<CollectiveTeam> {
  const current = getLocal<CollectiveTeam[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  const idx = current.findIndex((t) => t.id === team.id);
  const updated = idx >= 0 ? current.map((t) => (t.id === team.id ? team : t)) : [team, ...current];
  setLocal(STORAGE_KEYS.TEAMS, updated);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('collective_teams').upsert(team).select().single();
      if (!error && data) return data as CollectiveTeam;
    } catch (e) {
      console.warn('Erro ao salvar equipe no Supabase:', e);
    }
  }

  return team;
}

export async function deleteTeam(id: string): Promise<boolean> {
  const current = getLocal<CollectiveTeam[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  setLocal(STORAGE_KEYS.TEAMS, current.filter((t) => t.id !== id));

  if (supabase) {
    try {
      await supabase.from('collective_teams').delete().eq('id', id);
    } catch (e) {
      console.warn('Erro ao deletar equipe no Supabase:', e);
    }
  }

  return true;
}

export async function saveParticipant(p: IndividualParticipant): Promise<IndividualParticipant> {
  // Salva no armazenamento local primeiro (garantia resiliente imediata)
  const current = getLocal<IndividualParticipant[]>(STORAGE_KEYS.PARTICIPANTS, []);
  const idx = current.findIndex((x) => x.id === p.id);
  const updated = idx >= 0 ? current.map((x) => (x.id === p.id ? p : x)) : [p, ...current];
  setLocal(STORAGE_KEYS.PARTICIPANTS, updated);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_participants').upsert(p).select().single();
      if (!error && data) return data as IndividualParticipant;
      if (error) console.warn('Supabase saveParticipant avisou:', error.message);
    } catch (e) {
      console.warn('Erro ao salvar participante no Supabase:', e);
    }
  }

  return p;
}

export async function deleteParticipant(id: string): Promise<boolean> {
  const current = getLocal<IndividualParticipant[]>(STORAGE_KEYS.PARTICIPANTS, []);
  setLocal(STORAGE_KEYS.PARTICIPANTS, current.filter((x) => x.id !== id));

  if (supabase) {
    try {
      await supabase.from('individual_participants').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
  return true;
}

export async function savePodium(podium: IndividualPodium): Promise<IndividualPodium> {
  // Salva no armazenamento local primeiro
  const current = getLocal<IndividualPodium[]>(STORAGE_KEYS.PODIUMS, []);
  const idx = current.findIndex((x) => x.id === podium.id);
  const updated = idx >= 0 ? current.map((x) => (x.id === podium.id ? podium : x)) : [podium, ...current];
  setLocal(STORAGE_KEYS.PODIUMS, updated);

  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_podiums').upsert(podium).select().single();
      if (!error && data) return data as IndividualPodium;
      if (error) console.warn('Supabase savePodium avisou:', error.message);
    } catch (e) {
      console.warn('Erro ao salvar pódio no Supabase:', e);
    }
  }

  return podium;
}

export async function deletePodium(id: string): Promise<boolean> {
  const current = getLocal<IndividualPodium[]>(STORAGE_KEYS.PODIUMS, []);
  setLocal(STORAGE_KEYS.PODIUMS, current.filter((x) => x.id !== id));

  if (supabase) {
    try {
      await supabase.from('individual_podiums').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
  return true;
}

export async function saveDistance(record: DistanceRecord): Promise<DistanceRecord> {
  const current = getLocal<DistanceRecord[]>(STORAGE_KEYS.DISTANCES, INITIAL_DISTANCES);
  const idx = current.findIndex((d) => d.id === record.id);
  const updated = idx >= 0 ? current.map((d) => (d.id === record.id ? record : d)) : [record, ...current];
  setLocal(STORAGE_KEYS.DISTANCES, updated);

  if (supabase) {
    try {
      await supabase.from('distance_records').upsert(record);
    } catch (e) {
      console.warn('Erro ao salvar distância no Supabase:', e);
    }
  }

  return record;
}

export async function saveBatchDistances(records: DistanceRecord[]): Promise<DistanceRecord[]> {
  const current = getLocal<DistanceRecord[]>(STORAGE_KEYS.DISTANCES, INITIAL_DISTANCES);
  const updated = [...records, ...current.filter((c) => !records.some((r) => r.id === c.id))];
  setLocal(STORAGE_KEYS.DISTANCES, updated);

  if (supabase) {
    try {
      await supabase.from('distance_records').upsert(records);
    } catch (e) {
      console.warn('Erro ao salvar lote de distâncias no Supabase:', e);
    }
  }

  return updated;
}

export async function deleteDistance(id: string): Promise<boolean> {
  const current = getLocal<DistanceRecord[]>(STORAGE_KEYS.DISTANCES, INITIAL_DISTANCES);
  setLocal(STORAGE_KEYS.DISTANCES, current.filter((d) => d.id !== id));

  if (supabase) {
    try {
      await supabase.from('distance_records').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
  return true;
}

export async function saveNotice(notice: Notice): Promise<Notice> {
  const current = getLocal<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  const idx = current.findIndex((n) => n.id === notice.id);
  const updated = idx >= 0 ? current.map((n) => (n.id === notice.id ? notice : n)) : [notice, ...current];
  setLocal(STORAGE_KEYS.NOTICES, updated);

  if (supabase) {
    try {
      await supabase.from('notices').upsert(notice);
    } catch (e) {
      console.warn('Erro ao salvar notícia no Supabase:', e);
    }
  }

  return notice;
}

export async function deleteNotice(id: string): Promise<boolean> {
  const current = getLocal<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  setLocal(STORAGE_KEYS.NOTICES, current.filter((n) => n.id !== id));

  if (supabase) {
    try {
      await supabase.from('notices').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
  return true;
}

export async function syncRegulationsToSupabase(): Promise<boolean> {
  // Salva localmente as 22 seções completas
  setLocal(STORAGE_KEYS.REGULATIONS, INITIAL_REGULATIONS);

  if (supabase) {
    try {
      const { error } = await supabase.from('regulations').upsert(INITIAL_REGULATIONS);
      if (error) {
        console.warn('Erro ao sincronizar regulamento no Supabase:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('Falha na sincronização de regulamento:', err);
      return false;
    }
  }
  return true;
}

// ====================================================================
// REALTIME SUBSCRIPTION
// ====================================================================
export function subscribeToMatches(onUpdate: (matches: Match[]) => void): () => void {
  if (supabase) {
    const channel = supabase
      .channel('jis_matches_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'matches' },
        async () => {
          const fresh = await getMatches();
          onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  localMatchListeners.add(onUpdate);
  return () => {
    localMatchListeners.delete(onUpdate);
  };
}
