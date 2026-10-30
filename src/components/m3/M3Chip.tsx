import React from 'react';
import { motion } from 'motion/react';

export interface M3ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  count?: number;
  className?: string;
}

export const M3Chip: React.FC<M3ChipProps> = ({
  label,
  selected = false,
  onClick,
  icon,
  count,
  className = '',
}) => {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-m3-sm text-xs sm:text-sm font-medium transition-all select-none border ${
        selected
          ? 'bg-m3-primary-container text-m3-primary-on-container border-m3-primary/30 dark:bg-m3-primary-container-dark dark:text-m3-primary-on-container-dark shadow-sm'
          : 'bg-m3-surface text-slate-700 dark:text-slate-300 border-m3-outline-variant hover:bg-slate-100 dark:bg-m3-surface-dark dark:border-m3-outline-variant-dark dark:hover:bg-slate-800'
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
            selected
              ? 'bg-m3-primary text-white dark:bg-m3-primary-dark dark:text-black'
              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
          }`}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
};
