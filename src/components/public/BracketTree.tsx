import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Match, Modality, CollectiveTeam } from '../../types/database';
import { TeamAvatar } from '../avatars/TeamAvatar';
import { M3Card } from '../m3/M3Card';
import { Trophy, Medal, Swords } from 'lucide-react';

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
  const playoffModalities = modalities.filter((m) =>
    ['futsal-masc', 'volei-misto', 'basquete-masc', 'volei-praia-masc', 'queimada-mista', 'handebol-misto'].includes(m.id)
  );

  const [selectedModalityId, setSelectedModalityId] = useState<string>(
    playoffModalities[0]?.id || 'futsal-masc'
  );

  const selectedModality = modalities.find((m) => m.id === selectedModalityId);
  const modalityMatches = matches.filter((m) => m.modality_id === selectedModalityId);

  // Filtrar partidas de mata-mata
  const semifinals = modalityMatches.filter((m) => m.phase === 'Semifinal');
  const thirdPlace = modalityMatches.find((m) => m.phase === 'Disputa 3º Lugar');
  const finalMatch = modalityMatches.find((m) => m.phase === 'Final');
  const playoffPrelim = modalityMatches.filter((m) => m.phase === 'Playoff');

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
        <div className={`flex items-center justify-between gap-2 p-1.5 rounded-m3-sm ${winnerA ? 'bg-emerald-100/60 dark:bg-emerald-950/40 font-bold' : ''}`}>
          <div className="flex items-center gap-2 truncate">
            <TeamAvatar avatarKey={getTeamAvatar(match?.team_a_id)} name={teamAName} size="sm" />
            <span className="text-xs sm:text-sm truncate text-slate-900 dark:text-white">{teamAName}</span>
          </div>
          <span className="font-mono font-bold text-sm sm:text-base px-2">{scoreA}</span>
        </div>

        {/* Time B */}
        <div className={`flex items-center justify-between gap-2 p-1.5 rounded-m3-sm ${winnerB ? 'bg-emerald-100/60 dark:bg-emerald-950/40 font-bold' : ''}`}>
          <div className="flex items-center gap-2 truncate">
            <TeamAvatar avatarKey={getTeamAvatar(match?.team_b_id)} name={teamBName} size="sm" />
            <span className="text-xs sm:text-sm truncate text-slate-900 dark:text-white">{teamBName}</span>
          </div>
          <span className="font-mono font-bold text-sm sm:text-base px-2">{scoreB}</span>
        </div>

        {match && (
          <div className="text-[10px] text-slate-500 text-right pt-1">
            {match.match_date} • {match.match_time} ({match.venue})
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Seletor de Modalidade com Playoffs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {playoffModalities.map((m) => {
          const active = selectedModalityId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedModalityId(m.id)}
              className={`px-4 py-2 rounded-m3-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
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

      <M3Card variant="elevated" className="p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-m3-outline-variant/30">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Outfit'] flex items-center gap-2">
              <Swords className="w-5 h-5 text-m3-primary" />
              Chaveamento Mata-Mata • {selectedModality?.name} ({selectedModality?.category})
            </h3>
            <p className="text-xs text-slate-500 mt-1">{selectedModality?.rules_summary}</p>
          </div>
        </div>

        {/* Visualizador de Chaves / Árvore de Mata-mata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Coluna 1: Semifinais */}
          <div className="space-y-6">
            <div className="text-center font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">
              Semifinais
            </div>
            {renderMatchBox(
              'Semifinal 1',
              semifinals[0],
              selectedModalityId.includes('futsal') ? '1º Geral dos Grupos' : '1º Colocado Grupo A',
              selectedModalityId.includes('futsal') ? 'Vencedor do Playoff 2ºs' : '2º Colocado Grupo B'
            )}
            {renderMatchBox(
              'Semifinal 2',
              semifinals[1],
              selectedModalityId.includes('futsal') ? '2º Geral dos Grupos' : '1º Colocado Grupo B',
              selectedModalityId.includes('futsal') ? '3º Geral dos Grupos' : '2º Colocado Grupo A'
            )}
          </div>

          {/* Coluna 2: Conexão Visual / Disputa de 3º Lugar */}
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

        {/* Observação especial do Futsal sobre o Playoff de 2ºs colocados */}
        {selectedModalityId === 'futsal-masc' && (
          <div className="mt-8 pt-4 border-t border-m3-outline-variant/30 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-m3-md">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Regulamento do Futsal (Playoff da 4ª Vaga):{' '}
            </span>
            Os segundos colocados dos três grupos disputam duas partidas eliminatórias preliminares. Na primeira, o
            2º e 3º melhores segundos se enfrentam. O vencedor encara o 1º melhor segundo pela vaga restante na Semifinal 1!
          </div>
        )}
      </M3Card>
    </div>
  );
};
