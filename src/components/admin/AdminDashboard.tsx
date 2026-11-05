import React, { useState } from 'react';
import {
  Match,
  Modality,
  CollectiveTeam,
  Campus,
  IndividualParticipant,
  IndividualPodium,
  Notice,
  DistanceRecord,
} from '../../types/database';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { MatchManager } from './MatchManager';
import { TeamManager } from './TeamManager';
import { IndividualManager } from './IndividualManager';
import { NewsManager } from './NewsManager';
import { BackupExport } from './BackupExport';
import { M3Button } from '../m3/M3Button';
import {
  Swords,
  Users,
  Trophy,
  HardDrive,
  LogOut,
  Newspaper,
  Database,
  CheckCircle2,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AdminDashboardProps {
  matches: Match[];
  modalities: Modality[];
  teams: CollectiveTeam[];
  campuses: Campus[];
  participants: IndividualParticipant[];
  podiums: IndividualPodium[];
  notices: Notice[];
  distances: DistanceRecord[];
  onRefreshData: () => void;
  onSyncRegulations: () => Promise<boolean>;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  matches,
  modalities,
  teams,
  campuses,
  participants,
  podiums,
  notices,
  distances,
  onRefreshData,
  onSyncRegulations,
  onLogout,
}) => {
  const [activeSection, setActiveSection] = useState<'matches' | 'teams' | 'individuals' | 'notices' | 'backup'>('matches');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [isSyncingRegulations, setIsSyncingRegulations] = useState<boolean>(false);

  const hasSupabase = isSupabaseConfigured();

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleDataChangedWithFeedback = (entityName: string) => {
    onRefreshData();
    const destination = hasSupabase ? 'na Nuvem Supabase (PostgreSQL)' : 'no Banco Local (Persistência Ativa)';
    const now = new Date().toLocaleTimeString('pt-BR');
    showNotification(`✅ ${entityName} atualizado(a) com sucesso ${destination} às ${now}!`);
  };

  const handleTestDatabase = async () => {
    setIsTestingConnection(true);
    try {
      if (hasSupabase && supabase) {
        const { error } = await supabase.from('matches').select('*', { count: 'exact', head: true });
        if (error) throw error;
        showNotification(`🟢 Conexão com o Supabase 100% ativa e respondendo! (${matches.length} partidas sincronizadas)`);
      } else {
        showNotification(`💾 Banco Local ativo e 100% operacional no seu navegador! (${matches.length} partidas salvas)`);
      }
    } catch (err: any) {
      showNotification(`⚠️ Erro ao comunicar com o Supabase: ${err.message || 'Verifique as credenciais no .env'}`);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSyncRegulationsClick = async () => {
    setIsSyncingRegulations(true);
    try {
      const ok = await onSyncRegulations();
      if (ok) {
        showNotification('📜 Regulamento oficial completo (22 Seções: Capítulos I a X e Anexos I a XII) sincronizado no Supabase com sucesso!');
      } else {
        showNotification('⚠️ Não foi possível sincronizar o regulamento no Supabase remoto. Verifique a conexão.');
      }
    } catch (e: any) {
      showNotification(`⚠️ Erro ao sincronizar regulamento: ${e.message}`);
    } finally {
      setIsSyncingRegulations(false);
    }
  };

  const navItems = [
    { id: 'matches', label: 'Partidas & Placares', icon: <Swords size={16} /> },
    { id: 'teams', label: 'Equipes & Avatars', icon: <Users size={16} /> },
    { id: 'individuals', label: 'Individuais, Pódios & KM', icon: <Trophy size={16} /> },
    { id: 'notices', label: 'Notícias & Fotos', icon: <Newspaper size={16} /> },
    { id: 'backup', label: 'Relatórios & Backup', icon: <HardDrive size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notificação de Gravação */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-m3-lg bg-emerald-800 text-white shadow-m3-3 border border-emerald-500/40 flex items-center gap-3 text-xs sm:text-sm font-semibold max-w-md"
          >
            <CheckCircle2 size={20} className="text-emerald-300 flex-shrink-0" />
            <div className="flex-1">{toastMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner Superior do Admin com Status Explícito da Base de Dados */}
      <div className="p-4 sm:p-5 rounded-m3-lg bg-slate-900 text-white shadow-m3-2 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-jis.png"
              alt="JIS IFB"
              className="w-12 h-12 rounded-full object-contain bg-white border-2 border-white/20 flex-shrink-0"
            />
            <div>
              <h2 className="text-base sm:text-lg font-bold font-['Outfit'] flex items-center gap-2">
                Painel da Comissão Organizadora • JIS-IFB 2026
              </h2>
              <p className="text-xs text-slate-400">
                Acesso autorizado com senha mestra • Gestão oficial dos jogos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <M3Button variant="tonal" size="sm" icon={<LogOut size={15} />} onClick={onLogout}>
              Sair da Sessão
            </M3Button>
          </div>
        </div>

        {/* Card de Diagnóstico e Confirmação da Base de Dados */}
        <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-slate-400">Status da Base de Dados: </span>
              <span className="font-bold text-white">
                {hasSupabase ? '🟢 Nuvem Supabase (PostgreSQL)' : '💾 Memória Local Persistente (Ativa)'}
              </span>
              <span className="text-slate-400 ml-2">
                ({matches.length} jogos, {teams.length} equipes, {podiums.length} pódios, {notices.length} notícias, {distances.length} distâncias)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleSyncRegulationsClick}
              disabled={isSyncingRegulations}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-slate-700 transition-colors"
            >
              <BookOpen size={13} className={isSyncingRegulations ? 'animate-pulse' : ''} />
              <span>Sincronizar Regulamento no Banco (22 Seções)</span>
            </button>

            <button
              type="button"
              onClick={handleTestDatabase}
              disabled={isTestingConnection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold border border-slate-700 transition-colors"
            >
              <RefreshCw size={13} className={isTestingConnection ? 'animate-spin' : ''} />
              <span>Testar Gravação no Banco</span>
            </button>
          </div>
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
          onMatchesChanged={() => handleDataChangedWithFeedback('Partida / Placar')}
        />
      )}

      {activeSection === 'teams' && (
        <TeamManager
          teams={teams}
          modalities={modalities}
          campuses={campuses}
          onTeamsChanged={() => handleDataChangedWithFeedback('Equipe / Avatar')}
        />
      )}

      {activeSection === 'individuals' && (
        <IndividualManager
          modalities={modalities}
          campuses={campuses}
          participants={participants}
          podiums={podiums}
          distances={distances}
          onDataChanged={() => handleDataChangedWithFeedback('Participante / Pódio / Distância')}
        />
      )}

      {activeSection === 'notices' && (
        <NewsManager
          notices={notices}
          onDataChanged={() => handleDataChangedWithFeedback('Notícia / Comunicado')}
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
