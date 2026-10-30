import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useJISData } from './hooks/useJISData';
import { M3TopAppBar } from './components/m3/M3TopAppBar';
import { LiveScoreboard } from './components/public/LiveScoreboard';
import { StandingsTable } from './components/public/StandingsTable';
import { BracketTree } from './components/public/BracketTree';
import { HybridMedalsTable } from './components/public/HybridMedalsTable';
import { ScheduleView } from './components/public/ScheduleView';
import { RegulationViewer } from './components/public/RegulationViewer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Trophy } from 'lucide-react';

export const App: React.FC = () => {
  // Tema Dark / Light (Padrão: Claro)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('jis_theme') === 'dark';
  });

  // Navegação e Autenticação da Comissão
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('jis_admin_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<string>('jogos');

  // Dados reativos consolidados via Custom Hook
  const {
    campuses,
    modalities,
    teams,
    matches,
    regulations,
    participants,
    podiums,
    isLoading,
    refreshData,
  } = useJISData();

  // Aplicação da classe dark no HTML raiz
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jis_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jis_theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    sessionStorage.removeItem('jis_admin_auth');
    setIsAdminAuthenticated(false);
    setIsAdminView(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-m3-surface text-slate-800 dark:bg-m3-surface-dark dark:text-slate-100 transition-colors">
      {/* Top App Bar M3 com navegação fluida */}
      <M3TopAppBar
        isAdminView={isAdminView}
        onToggleAdmin={() => setIsAdminView((prev) => !prev)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex flex-col items-center justify-center min-h-[50vh] gap-3"
          >
            <div className="w-10 h-10 border-4 border-m3-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-semibold text-slate-500">
              Carregando Jogos de Integração JIS-IFB 2026...
            </span>
          </div>
        ) : isAdminView ? (
          /* Painel da Comissão com Acesso Controlado */
          !isAdminAuthenticated ? (
            <AdminLogin onLoginSuccess={() => setIsAdminAuthenticated(true)} />
          ) : (
            <AdminDashboard
              matches={matches}
              modalities={modalities}
              teams={teams}
              campuses={campuses}
              participants={participants}
              podiums={podiums}
              onRefreshData={refreshData}
              onLogout={handleLogout}
            />
          )
        ) : (
          /* Portal Público dos Jogos */
          <AnimatePresence mode="wait">
            <motion.section
              key={activeTab}
              id={`tabpanel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeTab === 'jogos' && (
                <LiveScoreboard
                  matches={matches}
                  modalities={modalities}
                  teams={teams}
                />
              )}

              {activeTab === 'chaveamento' && (
                <BracketTree
                  matches={matches}
                  modalities={modalities}
                  teams={teams}
                />
              )}

              {activeTab === 'classificacao' && (
                <StandingsTable
                  matches={matches}
                  modalities={modalities}
                  teams={teams}
                />
              )}

              {activeTab === 'pontuacao' && (
                <HybridMedalsTable
                  campuses={campuses}
                  podiums={podiums}
                  matches={matches}
                  teams={teams}
                  participants={participants}
                />
              )}

              {activeTab === 'cronograma' && (
                <ScheduleView
                  matches={matches}
                  modalities={modalities}
                  teams={teams}
                />
              )}

              {activeTab === 'regulamento' && (
                <RegulationViewer regulations={regulations} />
              )}
            </motion.section>
          </AnimatePresence>
        )}
      </main>

      {/* Footer Institucional Oficial */}
      <footer className="mt-12 bg-m3-surface-container-high dark:bg-m3-surface-container-high-dark border-t border-m3-outline-variant/30 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
            <Trophy className="w-4 h-4 text-m3-primary" />
            <span>Jogos de Integração dos Servidores do IFB • JIS-IFB 2026</span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            Promovido pela Pró-Reitoria de Gestão de Pessoas (PRGP)
          </p>
          <div className="text-[11px] text-slate-400 pt-2 border-t border-m3-outline-variant/20 flex flex-col sm:flex-row items-center justify-center gap-4">
            <span>© 2026 Instituto Federal de Brasília (IFB)</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
