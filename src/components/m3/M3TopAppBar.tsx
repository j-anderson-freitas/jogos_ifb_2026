import React from 'react';
import { Sun, Moon, Shield, Radio, Trophy, ArrowLeft, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
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
  const hasSupabase = isSupabaseConfigured();

  const navItems = [
    { id: 'jogos', label: 'Jogos & Ao Vivo' },
    { id: 'chaveamento', label: 'Chaveamento' },
    { id: 'classificacao', label: 'Classificação' },
    { id: 'pontuacao', label: 'Pontuação Geral' },
    { id: 'cronograma', label: 'Cronograma' },
    { id: 'regulamento', label: 'Regulamento' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-m3-surface-container/95 dark:bg-m3-surface-container-dark/95 backdrop-blur-md border-b border-m3-outline-variant/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Official Brand */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-m3-md bg-gradient-to-br from-emerald-600 to-m3-primary flex items-center justify-center shadow-m3-1 text-white flex-shrink-0">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-m3-tertiary text-white uppercase tracking-wider">
                  Oficial
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                  PRGP • IFB
                </span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white font-['Outfit']">
                JIS-IFB <span className="text-m3-primary dark:text-m3-primary-dark">2026</span>
              </h1>
            </div>
          </div>

          {/* Action Buttons: Status, Theme, Admin */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Status Pill */}
            <div
              title={
                hasSupabase
                  ? 'Conectado à nuvem Supabase com WebSockets Realtime ativos'
                  : 'Modo Local Ativo (adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env para nuvem)'
              }
              className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-m3-full text-xs font-medium border ${
                hasSupabase
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
              }`}
            >
              <Radio size={12} className={hasSupabase ? 'animate-pulse text-emerald-600' : 'text-amber-600'} />
              <span>{hasSupabase ? 'Supabase Realtime' : 'Modo Local'}</span>
            </div>

            {/* Dark Mode Toggle */}
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
          <div className="flex items-center gap-1 overflow-x-auto pb-2 pt-1 no-scrollbar border-t border-m3-outline-variant/20">
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
