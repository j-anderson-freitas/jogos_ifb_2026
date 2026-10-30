export interface Campus {
  id: string;
  name: string;
  short_name: string;
  city: string;
}

export type ModalityCategory = 'Masculino' | 'Feminino' | 'Misto' | 'Mista' | 'Aberto' | 'Fem e Absoluto' | 'Masc e Fem' | 'M/F Participativa';
export type ModalityType = 'coletiva' | 'individual';
export type ModalityStage = 'Primeiro Lance' | 'Geral';
export type ModalityFormat = 
  | 'grupos_3' 
  | 'grupos_4' 
  | 'triangular' 
  | 'pontos_corridos' 
  | 'confronto_direto' 
  | 'chave_unica' 
  | 'suico' 
  | 'grupos_eliminatoria' 
  | 'cronometrado' 
  | 'participativa';

export interface Modality {
  id: string;
  name: string;
  category: ModalityCategory;
  type: ModalityType;
  stage: ModalityStage;
  format: ModalityFormat;
  icon: string;
  rules_summary?: string;
  order_index?: number;
}

export interface CollectiveTeam {
  id: string;
  name: string;
  modality_id: string;
  group_name?: string;
  initial_code?: string;
  campus_id?: string;
  avatar_key: string;
}

export interface IndividualParticipant {
  id: string;
  name: string;
  campus_id: string;
  modality_id: string;
  event_category?: string;
  created_at?: string;
}

export interface IndividualPodium {
  id: string;
  modality_id: string;
  event_category: string;
  position: 1 | 2 | 3;
  participant_name: string;
  campus_id: string;
  score_time_detail?: string;
  created_at?: string;
}

export type MatchStatus = 'Agendado' | 'Ao Vivo' | 'Finalizado' | 'Adiado';

export interface Match {
  id: string;
  modality_id: string;
  phase: string;
  group_name?: string;
  team_a_id?: string;
  team_b_id?: string;
  team_a_name: string;
  team_b_name: string;
  score_a: number;
  score_b: number;
  score_penalties_a?: number;
  score_penalties_b?: number;
  sets_detail?: string;
  status: MatchStatus;
  match_date: string;
  match_time: string;
  venue: string;
  round?: number;
  notes?: string;
  updated_at?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'Urgente' | 'Técnico' | 'Geral';
  published_at: string;
}

export interface Regulation {
  id: number;
  section_type: 'Capítulo' | 'Anexo';
  section_number: string;
  title: string;
  content: string;
  modality_id?: string;
  order_index: number;
}

export interface StandingRow {
  team_id: string;
  team_name: string;
  campus_id?: string;
  avatar_key: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  penalties_won?: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
}

export interface CampusMedalScore {
  campus_id: string;
  campus_name: string;
  short_name: string;
  gold: number;
  silver: number;
  bronze: number;
  total_medals: number;
  points: number;
}
