import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  Campus, 
  Modality, 
  CollectiveTeam, 
  Match, 
  IndividualParticipant, 
  IndividualPodium, 
  Regulation, 
  Notice 
} from '../types/database';
import { 
  INITIAL_CAMPUSES, 
  INITIAL_MODALITIES, 
  INITIAL_TEAMS, 
  INITIAL_MATCHES, 
  INITIAL_REGULATIONS, 
  INITIAL_NOTICES 
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
// Permite funcionamento completo offline/demo e sincroniza com o Supabase
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
// DATA ACCESS API (CRUD UNIFICADO)
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
      if (!error && data && data.length > 0) return data as Regulation[];
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
      console.warn('Fallback local para avisos:', e);
    }
  }
  return getLocal<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
}

export async function getParticipants(): Promise<IndividualParticipant[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_participants').select('*');
      if (!error && data) return data as IndividualParticipant[];
    } catch (e) {
      console.warn('Fallback local para participantes:', e);
    }
  }
  return getLocal<IndividualParticipant[]>(STORAGE_KEYS.PARTICIPANTS, []);
}

export async function getPodiums(): Promise<IndividualPodium[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_podiums').select('*');
      if (!error && data) return data as IndividualPodium[];
    } catch (e) {
      console.warn('Fallback local para pódios:', e);
    }
  }
  return getLocal<IndividualPodium[]>(STORAGE_KEYS.PODIUMS, []);
}

// ====================================================================
// OPERAÇÕES DE ESCRITA / CRUD (ADMIN)
// ====================================================================

export async function saveMatch(match: Match): Promise<Match> {
  match.updated_at = new Date().toISOString();

  if (supabase) {
    try {
      const { data, error } = await supabase.from('matches').upsert(match).select().single();
      if (!error && data) {
        return data as Match;
      }
    } catch (e) {
      console.warn('Erro ao salvar no Supabase, salvando localmente:', e);
    }
  }

  // Local storage update
  const current = getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  const index = current.findIndex((m) => m.id === match.id);
  let updated: Match[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = match;
  } else {
    updated = [match, ...current];
  }
  setLocal(STORAGE_KEYS.MATCHES, updated);
  notifyLocalMatchChange(updated);
  return match;
}

export async function deleteMatch(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('matches').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Erro ao deletar no Supabase, deletando localmente:', e);
    }
  }

  const current = getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
  const updated = current.filter((m) => m.id !== id);
  setLocal(STORAGE_KEYS.MATCHES, updated);
  notifyLocalMatchChange(updated);
  return true;
}

export async function saveTeam(team: CollectiveTeam): Promise<CollectiveTeam> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('collective_teams').upsert(team).select().single();
      if (!error && data) return data as CollectiveTeam;
    } catch (e) {
      console.warn('Erro ao salvar equipe no Supabase:', e);
    }
  }

  const current = getLocal<CollectiveTeam[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  const idx = current.findIndex((t) => t.id === team.id);
  const updated = idx >= 0 ? current.map((t) => (t.id === team.id ? team : t)) : [team, ...current];
  setLocal(STORAGE_KEYS.TEAMS, updated);
  return team;
}

export async function deleteTeam(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('collective_teams').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Erro ao deletar equipe no Supabase:', e);
    }
  }

  const current = getLocal<CollectiveTeam[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  const updated = current.filter((t) => t.id !== id);
  setLocal(STORAGE_KEYS.TEAMS, updated);
  return true;
}

export async function saveParticipant(p: IndividualParticipant): Promise<IndividualParticipant> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_participants').upsert(p).select().single();
      if (!error && data) return data as IndividualParticipant;
    } catch (e) {
      console.warn('Erro ao salvar participante no Supabase:', e);
    }
  }

  const current = getLocal<IndividualParticipant[]>(STORAGE_KEYS.PARTICIPANTS, []);
  const idx = current.findIndex((x) => x.id === p.id);
  const updated = idx >= 0 ? current.map((x) => (x.id === p.id ? p : x)) : [p, ...current];
  setLocal(STORAGE_KEYS.PARTICIPANTS, updated);
  return p;
}

export async function deleteParticipant(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('individual_participants').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
  const current = getLocal<IndividualParticipant[]>(STORAGE_KEYS.PARTICIPANTS, []);
  setLocal(STORAGE_KEYS.PARTICIPANTS, current.filter((x) => x.id !== id));
  return true;
}

export async function savePodium(podium: IndividualPodium): Promise<IndividualPodium> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('individual_podiums').upsert(podium).select().single();
      if (!error && data) return data as IndividualPodium;
    } catch (e) {
      console.warn('Erro ao salvar pódio no Supabase:', e);
    }
  }

  const current = getLocal<IndividualPodium[]>(STORAGE_KEYS.PODIUMS, []);
  const idx = current.findIndex((x) => x.id === podium.id);
  const updated = idx >= 0 ? current.map((x) => (x.id === podium.id ? podium : x)) : [podium, ...current];
  setLocal(STORAGE_KEYS.PODIUMS, updated);
  return podium;
}

export async function deletePodium(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('individual_podiums').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
  const current = getLocal<IndividualPodium[]>(STORAGE_KEYS.PODIUMS, []);
  setLocal(STORAGE_KEYS.PODIUMS, current.filter((x) => x.id !== id));
  return true;
}

// ====================================================================
// REALTIME SUBSCRIPTION
// ====================================================================
export function subscribeToMatches(onUpdate: (matches: Match[]) => void): () => void {
  // 1. Ouvir via Supabase Realtime se conectado
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

  // 2. Ouvir via Emulação Local
  localMatchListeners.add(onUpdate);
  return () => {
    localMatchListeners.delete(onUpdate);
  };
}

