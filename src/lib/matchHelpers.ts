import { Match, Modality, CollectiveTeam } from '../types/database';

/**
 * Utilitários puros e simplificados para manipulação de partidas e equipes do JIS-IFB 2026.
 */

export const getTeamAvatarKey = (teams: CollectiveTeam[], teamId?: string): string => {
  if (!teamId) return '';
  const team = teams.find((t) => t.id === teamId);
  return team?.avatar_key || '';
};

export const getModalityDisplayName = (modalities: Modality[], modalityId: string): string => {
  const mod = modalities.find((m) => m.id === modalityId);
  return mod ? `${mod.name} (${mod.category})` : modalityId;
};

export const formatScoreDisplay = (match: Match): { displayScoreA: string; displayScoreB: string } => {
  if (match.status === 'Agendado') {
    return { displayScoreA: '-', displayScoreB: '-' };
  }
  return {
    displayScoreA: String(match.score_a),
    displayScoreB: String(match.score_b),
  };
};

export const isFutsalModality = (modalityId: string): boolean => {
  return modalityId.toLowerCase().includes('futsal');
};

