import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Shield, ArrowLeft } from 'lucide-react';
import { M3Button } from './M3Button';

export interface M3TopAppBarProps {
  isAdminView: boolean;
  onToggleAdmin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const M3TopAppBar: React.FC<M3TopAppBarProps> = ({
  isAdminView,
  onToggleAdmin,
  isDarkMode,
  onToggleDarkMode,
  activeTab,
  onTabChange,
}) => {
  const navItems = [
    { id: 'jogos', label: 'Jogos & Programação' },
    { id: 'noticias', label: 'Notícias' },
    { id: 'chaveamento', label: 'Chaveamento' },
    { id: 'classificacao', label: 'Classificação' },
    { id: 'pontuacao', label: 'Pontuação Geral' },
    { id: 'regulamento', label: 'Regulamento' },
  ];

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 bg-m3-surface-container/95 dark:bg-m3-surface-container-dark/95 backdrop-blur-md border-b border-m3-outline-variant/30 transition-colors shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-22 gap-4 py-2">
          {/* Logos Oficiais: JIS-IFB & Instituto Federal Brasília */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Logo dos Jogos de Integração (alta definição PNG) */}
            <img
              src="/images/logo-jis.png"
              alt="Logo oficial dos Jogos de Integração dos Servidores do IFB"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-contain shadow-m3-1 flex-shrink-0 border-2 border-white dark:border-slate-700 bg-white"
            />

            {/* Separador vertical elegante */}
            <div className="hidden sm:block h-10 w-[1px] bg-slate-300 dark:bg-slate-700" aria-hidden="true" />

            {/* Logo do IFB */}
            <img
              src="/images/logo-ifb.png"
              alt="Logo oficial do Instituto Federal de Brasília"
              className="h-10 sm:h-14 object-contain hidden sm:block flex-shrink-0"
            />

            {/* Título Oficial */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-m3-tertiary text-white uppercase tracking-wider">
                  Oficial
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
                  PRGP • Reitoria & Campi
                </span>
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white font-['Outfit'] truncate">
                JIS-IFB <span className="text-m3-primary dark:text-m3-primary-dark">2026</span>
              </h1>
            </div>
          </div>

          {/* Ações: Alternância de Tema & Acesso da Comissão */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Dark/Light Mode Toggle */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
              title={isDarkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
              className="p-2 sm:p-2.5 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-m3-primary focus:outline-none"
            >
              {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Alternador do Painel da Comissão */}
            <M3Button
              variant={isAdminView ? 'tonal' : 'filled'}
              size="sm"
              icon={isAdminView ? <ArrowLeft size={16} /> : <Shield size={16} />}
              onClick={onToggleAdmin}
              aria-label={isAdminView ? 'Retornar ao portal público' : 'Acessar área restrita da comissão organizadora'}
            >
              <span className="hidden sm:inline">{isAdminView ? 'Portal Público' : 'Área da Comissão'}</span>
              <span className="sm:hidden">{isAdminView ? 'Público' : 'Admin'}</span>
            </M3Button>
          </div>
        </div>

        {/* Abas de Navegação Pública com Motion Animated Pill */}
        {!isAdminView && (
          <nav
            role="tablist"
            aria-label="Seções principais dos Jogos de Integração"
            className="flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1.5 no-scrollbar border-t border-m3-outline-variant/20"
          >
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  id={`tab-${item.id}`}
                  aria-selected={active}
                  aria-controls={`tabpanel-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-m3-full whitespace-nowrap transition-colors select-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:outline-none ${
                    active
                      ? 'text-white dark:text-black font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Motion.dev active sliding pill indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-m3-primary dark:bg-m3-primary-dark rounded-m3-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
};
