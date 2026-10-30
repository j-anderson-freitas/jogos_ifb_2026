import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface M3ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'filled' | 'tonal' | 'outlined' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const M3Button: React.FC<M3ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors select-none focus:outline-none focus:ring-2 focus:ring-offset-2';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-m3-full gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-m3-full gap-2',
    lg: 'text-base px-6 py-3 rounded-m3-full gap-2.5',
  }[size];

  const variantClasses = {
    filled:
      'bg-m3-primary text-white shadow-m3-1 hover:shadow-m3-2 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-m3-primary-dark dark:text-m3-primary-on-container-dark',
    tonal:
      'bg-m3-primary-container text-m3-primary-on-container hover:bg-emerald-200 dark:bg-m3-primary-container-dark dark:text-m3-primary-on-container-dark',
    outlined:
      'border border-m3-outline text-m3-primary hover:bg-m3-primary/10 dark:border-m3-outline-dark dark:text-m3-primary-dark',
    text:
      'text-m3-primary hover:bg-m3-primary/10 dark:text-m3-primary-dark dark:hover:bg-m3-primary-dark/10',
    danger:
      'bg-m3-tertiary text-white hover:bg-red-700 active:bg-red-800 shadow-m3-1',
  }[variant];

  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '';

  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </motion.button>
  );
};
