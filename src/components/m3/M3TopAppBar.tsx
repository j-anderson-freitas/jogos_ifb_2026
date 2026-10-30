import React from 'react';
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
    { id: 'jogos', label: 'Jogos & Ao Vivo' },
    { id: 'chaveamento', label: 'Chaveamento' },
    { id: 'classificacao', label: 'Classificação' },
    { id: 'pontuacao', label: 'Pontuação Geral' },
    { id: 'cronograma', label: 'Cronograma' },
    { id: 'regulamento', label: 'Regulamento' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-m3-surface-container/95 dark:bg-m3-surface-container-dark/95 backdrop-blur-md border-b border-m3-outline-variant/30 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-22 gap-4 py-2">
          {/* Logos Oficiais: JIS-IFB & Instituto Federal Brasília */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Logo dos Jogos de Integração */}
            <img
              src="/images/logo-jis.jpg"
              alt="Jogos de Integração dos Servidores IFB"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-m3-1 flex-shrink-0 border-2 border-white dark:border-slate-700 bg-white"
            />

            {/* Separador vertical elegante */}
            <div className="hidden sm:block h-10 w-[1px] bg-slate-300 dark:bg-slate-700" />

            {/* Logo do IFB */}
            <img
              src="/images/logo-ifb.png"
              alt="Instituto Federal de Brasília"
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

          {/* Action Buttons: Theme Toggle & Admin */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Dark Mode Toggle (Tema Claro por padrão) */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
              className="p-2 sm:p-2.5 rounded-full text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
            >
              {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Admin Panel Toggle */}
            <M3Button
              variant={isAdminView ? 'tonal' : 'filled'}
              size="sm"
              icon={isAdminView ? <ArrowLeft size={16} /> : <Shield size={16} />}
              onClick={onToggleAdmin}
            >
              <span className="hidden sm:inline">{isAdminView ? 'Portal Público' : 'Área da Comissão'}</span>
              <span className="sm:hidden">{isAdminView ? 'Público' : 'Admin'}</span>
            </M3Button>
          </div>
        </div>

        {/* Public Navigation Tabs (when not in Admin view) */}
        {!isAdminView && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1.5 no-scrollbar border-t border-m3-outline-variant/20">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-m3-full whitespace-nowrap transition-all select-none ${
                    active
                      ? 'bg-m3-primary text-white shadow-sm dark:bg-m3-primary-dark dark:text-black font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
