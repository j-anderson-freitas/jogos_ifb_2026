import React, { useState } from 'react';
import { Shield, KeyRound, AlertCircle } from 'lucide-react';
import { M3Card } from '../m3/M3Card';
import { M3Button } from '../m3/M3Button';

export interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const expectedPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'jis2026ifb';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === expectedPassword) {
      sessionStorage.setItem('jis_admin_auth', 'true');
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <M3Card variant="elevated" className="p-6 sm:p-8">
        <div className="text-center space-y-3 mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/images/logo-jis.jpg"
              alt="JIS IFB 2026"
              className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
            />
            <img
              src="/images/logo-ifb.png"
              alt="Instituto Federal de Brasília"
              className="h-14 object-contain"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-900 dark:text-white">
            Acesso da Comissão Organizadora
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Ambiente restrito com controle de acesso para inserção, modificação e remoção de dados dos jogos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Senha Mestra da Comissão (.env)
            </label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Digite a senha mestra..."
                className="w-full pl-10 pr-3 py-2.5 rounded-m3-md bg-m3-surface dark:bg-m3-surface-dark border border-m3-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-m3-primary text-slate-900 dark:text-white"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2">
                <AlertCircle size={14} />
                <span>Senha incorreta. Verifique a chave VITE_ADMIN_PASSWORD configurada.</span>
              </div>
            )}
          </div>

          <M3Button type="submit" variant="filled" className="w-full py-3 text-sm">
            Entrar no Painel de Controle
          </M3Button>
        </form>

        <div className="mt-6 pt-4 border-t border-m3-outline-variant/30 text-center text-xs text-slate-400">
          Jogos de Integração dos Servidores • Instituto Federal de Brasília
        </div>
      </M3Card>
    </div>
  );
};

