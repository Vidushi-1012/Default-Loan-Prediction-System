import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showIndicator?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showIndicator = true,
}) => {
  const styles = {
    Low: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200/80 dark:border-emerald-800/80',
      dot: 'bg-emerald-500 dark:bg-emerald-400',
    },
    Medium: {
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200/80 dark:border-amber-800/80',
      dot: 'bg-amber-500 dark:bg-amber-400',
    },
    High: {
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      text: 'text-rose-800 dark:text-rose-300',
      border: 'border-rose-200/80 dark:border-rose-800/80',
      dot: 'bg-rose-500 dark:bg-rose-400',
    },
  }[level] || {
    bg: 'bg-slate-50 dark:bg-slate-800/60',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400 dark:bg-slate-500',
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium tracking-tight ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses}`}
    >
      {showIndicator && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{level} Risk</span>
    </span>
  );
};
