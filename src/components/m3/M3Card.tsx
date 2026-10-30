import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface M3CardProps extends HTMLMotionProps<'div'> {
  variant?: 'elevated' | 'filled' | 'outlined';
  children: React.ReactNode;
}

export const M3Card: React.FC<M3CardProps> = ({
  variant = 'elevated',
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-m3-lg transition-shadow overflow-hidden p-4 sm:p-5';

  const variantClasses = {
    elevated:
      'bg-m3-surface-container-low shadow-m3-1 hover:shadow-m3-2 dark:bg-m3-surface-container-low-dark dark:shadow-none dark:border dark:border-white/5',
    filled:
      'bg-m3-surface-container dark:bg-m3-surface-container-dark',
    outlined:
      'bg-m3-surface border border-m3-outline-variant dark:bg-m3-surface-dark dark:border-m3-outline-variant-dark',
  }[variant];

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
