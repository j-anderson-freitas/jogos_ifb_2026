import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Match, Modality, CollectiveTeam } from '../../types/database';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Card } from '../m3/M3Card';
import { Trophy, Medal, Swords, Award, Sparkles } from 'lucide-react';

export interface BracketTreeProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
}

export const BracketTree: React.FC<BracketTreeProps> = ({
  matches,
  modalities,
  teams,
}) => {
  // Todas as modalidades coletivas com fases finais, playoffs, confrontos diretos ou triangulares
  const playoffModalities = modalities.filter((m) => m.type === 'coletiva');

  const [selectedModalityId, setSelectedModalityId] = useState<string>(
    playoffModalities[0]?.id || 'futsal-masc'
  );

  const selectedModality = modalities.find((m) => m.id === selectedModalityId);
  const modalityMatches = matches.filter((m) => m.modality_id === selectedModalityId);

  // Filtrar partidas de mata-mata e finais
  const semifinals = modalityMatches.filter((m) => m.phase === 'Semifinal');
  const thirdPlace = modalityMatches.find((m) => m.phase === 'Disputa 3º Lugar');
  const finalMatch = modalityMatches.find((m) => m.phase === 'Final');
  const otherMatches = modalityMatches.filter(
    (m) => !['Semifinal', 'Disputa 3º Lugar', 'Final'].includes(m.phase)
  );

  const getTeamAvatar = (teamId?: string) => {
    const t = teams.find((item) => item.id === teamId);
    return t ? t.avatar_key : '';
  };

  const renderMatchBox = (
    title: string,
    match?: Match,
    fallbackA = 'A definir',
    fallbackB = 'A definir'
  ) => {
    const teamAName = match ? match.team_a_name : fallbackA;
    const teamBName = match ? match.team_b_name : fallbackB;
    const scoreA = match && match.status !== 'Agendado' ? match.score_a : '-';
    const scoreB = match && match.status !== 'Agendado' ? match.score_b : '-';
    const isFinished = match?.status === 'Finalizado';
    const winnerA = isFinished && match.score_a > match.score_b;
    const winnerB = isFinished && match.score_b > match.score_a;

    return (
      <div className="bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border border-m3-outline-variant/40 rounded-m3-md p-3.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-m3-outline-variant/20 pb-1.5">
          <span>{title}</span>
          {match && match.status === 'Ao Vivo' && (
            <span className="text-[10px] bg-m3-tertiary text-white px-2 py-0.5 rounded-full animate-pulse">
              AO VIVO
            </span>
          )}
        </div>

        {/* Time A */}
        <div className={`flex items-center justify-between gap-2 p-1.5 rounded-m3-sm ${winnerA ? 'bg-emerald-100/70 dark:bg-emerald-950/40 font-bold' : ''}`}>
          <div className="flex items-center gap-2 truncate">
            <TeamAvatar avatarKey={getTeamAvatar(match?.team_a_id)} name={teamAName} size="sm" />
            <span className="text-xs sm:text-sm truncate text-slate-900 dark:text-white">{teamAName}</span>
          </div>
          <span className="font-mono font-bold text-sm sm:text-base px-2">{scoreA}</span>
        </div>

        {/* Time B */}
        <div className={`flex items-center justify-between gap-2 p-1.5 rounded-m3-sm ${winnerB ? 'bg-emerald-100/70 dark:bg-emerald-950/40 font-bold' : ''}`}>
          <div className="flex items-center gap-2 truncate">
            <TeamAvatar avatarKey={getTeamAvatar(match?.team_b_id)} name={teamBName} size="sm" />
            <span className="text-xs sm:text-sm truncate text-slate-900 dark:text-white">{teamBName}</span>
          </div>
          <span className="font-mono font-bold text-sm sm:text-base px-2">{scoreB}</span>
        </div>

        {match && (
          <div className="text-[10px] text-slate-500 text-right pt-1 flex items-center justify-between">
            {match.sets_detail ? <span className="font-medium text-emerald-600 dark:text-emerald-400">{match.sets_detail}</span> : <span />}
            <span>{match.match_date} • {match.match_time} ({match.venue})</span>
          </div>
        )}
      </div>
    );
  };

  const isDirectFinal = selectedModalityId === 'futevolei-misto';
  const isPointsCorridos = selectedModalityId === 'futevolei-masc';
  const isTriangular = selectedModality?.format === 'triangular';

  return (
    <div className="space-y-6">
      {/* Seletor de Modalidade Coletiva (Com Futevôlei, Basquete, Futsal, Vôlei, Queimada, Handebol) */}
      <div className="flex flex-wrap gap-2 pb-2">
        {playoffModalities.map((m) => {
          const active = selectedModalityId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModalityId(m.id)}
              className={`px-3.5 py-1.5 rounded-m3-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                active
                  ? 'bg-m3-primary text-white border-m3-primary shadow-sm dark:bg-m3-primary-dark dark:text-black'
                  : 'bg-m3-surface dark:bg-m3-surface-dark text-slate-700 dark:text-slate-300 border-m3-outline-variant hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {m.name} ({m.category})
            </button>
          );
        })}
      </div>

      <M3Card variant="elevated" className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-m3-outline-variant/30">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
              <Swords className="w-5 h-5 text-m3-primary dark:text-m3-primary-dark" />
              Chaveamento & Fases Finais • {selectedModality?.name} ({selectedModality?.category})
            </h3>
            <p className="text-xs text-slate-500 mt-1">{selectedModality?.rules_summary}</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            {isDirectFinal ? 'Confronto Direto' : isPointsCorridos ? 'Pontos Corridos' : isTriangular ? 'Triangular' : 'Eliminatória Simples'}
          </span>
        </div>

        {/* Caso 1: Futevôlei Misto (Confronto Direto) */}
        {isDirectFinal ? (
          <div className="max-w-xl mx-auto py-4">
            <div className="text-center font-bold text-xs uppercase tracking-wider text-amber-500 mb-3 flex items-center justify-center gap-1.5">
              <Trophy size={18} className="text-amber-500" />
              Confronto Direto pelo Título (Melhor de 3 Sets de 12 Pontos)
            </div>
            <motion.div whileHover={{ scale: 1.02 }} className="p-1 rounded-m3-lg bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 shadow-m3-2">
              {renderMatchBox(
                'Grande Final • Decisão do Título',
                finalMatch || modalityMatches[0],
                'Soberanas do Taguá Clube',
                'Deep River'
              )}
            </motion.div>
          </div>
        ) : isPointsCorridos ? (
          /* Caso 2: Futevôlei Masculino (Pontos Corridos - 5 Duplas) */
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-m3-md border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Award className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <span>
                <strong>Disputa em Turno Único:</strong> Todas as 5 duplas jogam entre si em partidas de set único de 18 pontos com vantagem de 2 pontos. A pontuação acumulada define o Campeão (Ouro), Vice (Prata) e 3º Lugar (Bronze).
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {modalityMatches.map((m, idx) => (
                <div key={m.id}>
                  {renderMatchBox(`Confronto ${idx + 1} • Turno Único`, m)}
                </div>
              ))}
            </div>
          </div>
        ) : isTriangular ? (
          /* Caso 3: Formato Triangular (Futsal Fem / Basquete 3x3 Misto) */
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-m3-md border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-5 h-5 flex-shrink-0 text-m3-primary" />
              <span>
                <strong>Triangular de Chave Única:</strong> As 3 equipes jogam entre si em turno único. O pódio e a medalha de Ouro são definidos pela maior pontuação na tabela de classificação.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {modalityMatches.map((m, idx) => (
                <div key={m.id}>
                  {renderMatchBox(`Rodada ${idx + 1}`, m)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Caso 4: Mata-Mata Tradicional (Futsal Masc, Vôlei, Basquete Masc, Vôlei de Praia Masc, Queimada, Handebol) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Coluna 1: Semifinais */}
            <div className="space-y-6">
              <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
                Semifinais
              </div>
              {renderMatchBox(
                'Semifinal 1',
                semifinals[0],
                selectedModalityId.includes('futsal') ? '1º Geral dos Grupos' : '1º Colocado Grupo A / Chave',
                selectedModalityId.includes('futsal') ? 'Vencedor do Playoff 2ºs' : '2º Colocado Grupo B / Chave'
              )}
              {renderMatchBox(
                'Semifinal 2',
                semifinals[1],
                selectedModalityId.includes('futsal') ? '2º Geral dos Grupos' : '1º Colocado Grupo B / Chave',
                selectedModalityId.includes('futsal') ? '3º Geral dos Grupos' : '2º Colocado Grupo A / Chave'
              )}
            </div>

            {/* Coluna 2: Disputa de 3º Lugar */}
            <div className="space-y-6 md:pt-12">
              <div className="text-center font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center justify-center gap-1">
                <Medal size={14} />
                Disputa de 3º Lugar (Bronze)
              </div>
              {renderMatchBox(
                'Decisão do 3º Lugar',
                thirdPlace,
                'Perdedor Semifinal 1',
                'Perdedor Semifinal 2'
              )}
            </div>

            {/* Coluna 3: Grande Final */}
            <div className="space-y-6">
              <div className="text-center font-bold text-xs uppercase tracking-wider text-amber-500 mb-2 flex items-center justify-center gap-1.5">
                <Trophy size={16} className="text-amber-400" />
                Grande Final (Ouro & Prata)
              </div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-1 rounded-m3-lg bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-m3-2"
              >
                {renderMatchBox(
                  'Disputa do Título',
                  finalMatch,
                  'Vencedor Semifinal 1',
                  'Vencedor Semifinal 2'
                )}
              </motion.div>
            </div>
          </div>
        )}
      </M3Card>
    </div>
  );
};
