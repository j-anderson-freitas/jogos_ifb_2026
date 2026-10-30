import React, { useState } from 'react';
import { Match, Modality, CollectiveTeam, Campus, IndividualParticipant, IndividualPodium } from '../../types/database';
import { MatchManager } from './MatchManager';
import { TeamManager } from './TeamManager';
import { IndividualManager } from './IndividualManager';
import { BackupExport } from './BackupExport';
import { M3Button } from '../m3/M3Button';
import { Swords, Users, Trophy, HardDrive, LogOut, ShieldCheck } from 'lucide-react';

export interface AdminDashboardProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
  campuses: Campus[];
  participants: IndividualParticipant[];
  podiums: IndividualPodium[];
  onRefreshData: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  matches,
  modalities,
  teams,
  campuses,
  participants,
  podiums,
  onRefreshData,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<'matches' | 'teams' | 'individuals' | 'backup'>('matches');

  const navItems = [
    { id: 'matches', label: 'Partidas & Placares', icon: <Swords size={16} /> },
    { id: 'teams', label: 'Equipes & Avatars', icon: <Users size={16} /> },
    { id: 'individuals', label: 'Individuais & Pódios', icon: <Trophy size={16} /> },
    { id: 'backup', label: 'Relatórios & Backup', icon: <HardDrive size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Superior do Admin */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-m3-lg bg-slate-900 text-white shadow-m3-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-['Outfit']">
              Painel de Controle da Comissão Organizadora
            </h2>
            <p className="text-xs text-slate-400">
              Acesso autorizado • Permissões completas de Inserção, Consulta, Edição e Exclusão (CRUD)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <M3Button variant="tonal" size="sm" icon={<LogOut size={15} />} onClick={onLogout}>
            Sair da Sessão
          </M3Button>
        </div>
      </div>

      {/* Tabs de Navegação Interna do Painel Admin */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-m3-outline-variant/30">
        {navItems.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-m3-md text-xs sm:text-sm font-bold border-b-2 transition-all select-none whitespace-nowrap ${
                active
                  ? 'border-m3-primary text-m3-primary dark:text-m3-primary-dark bg-m3-primary/10'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo da Seção Ativa */}
      {activeSection === 'matches' && (
        <MatchManager
          matches={matches}
          modalities={modalities}
          teams={teams}
          onMatchesChanged={onRefreshData}
        />
      )}

      {activeSection === 'teams' && (
        <TeamManager
          teams={teams}
          modalities={modalities}
          campuses={campuses}
          onTeamsChanged={onRefreshData}
        />
      )}

      {activeSection === 'individuals' && (
        <IndividualManager
          modalities={modalities}
          campuses={campuses}
          participants={participants}
          podiums={podiums}
          onDataChanged={onRefreshData}
        />
      )}

      {activeSection === 'backup' && (
        <BackupExport
          matches={matches}
          teams={teams}
          campuses={campuses}
          podiums={podiums}
        />
      )}
    </div>
  );
};

