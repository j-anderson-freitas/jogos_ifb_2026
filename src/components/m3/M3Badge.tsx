import React from 'react';
import { motion } from 'motion/react';

export interface M3BadgeProps {
  status: 'Ao Vivo' | 'Agendado' | 'Finalizado' | 'Adiado';
  className?: string;
}

export const M3Badge: React.FC<M3BadgeProps> = ({ status, className = '' }) => {
  if (status === 'Ao Vivo') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-m3-full text-xs font-bold uppercase tracking-wider bg-m3-tertiary text-white shadow-sm ${className}`}>
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full bg-white inline-block"
        />
        AO VIVO
      </span>
    );
  }

  if (status === 'Finalizado') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-m3-full text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ${className}`}>
        Encerrado
      </span>
    );
  }

  if (status === 'Adiado') {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-m3-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 ${className}`}>
        Adiado
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-m3-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40 ${className}`}>
      Agendado
    </span>
  );
};

