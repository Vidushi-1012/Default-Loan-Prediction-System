import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  changePct?: number;
  changeLabel?: string;
  caption?: string;
  icon?: React.ReactNode;
  isSimulated?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  changePct,
  changeLabel = 'vs previous period',
  caption,
  icon,
  isSimulated = false,
}) => {
  const isPositive = changePct !== undefined && changePct > 0;
  const isNegative = changePct !== undefined && changePct < 0;
  const isNeutral = changePct === 0;

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200/90 dark:border-slate-800/90 rounded-lg p-5 shadow-xs relative overflow-hidden transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">
          {label}
        </span>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
          {value}
        </span>
        {isSimulated && (
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">dev mock</span>
        )}
      </div>

      {changePct !== undefined ? (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center font-medium font-mono tabular-nums ${
              isPositive
                ? 'text-emerald-700 dark:text-emerald-400'
                : isNegative
                ? 'text-rose-700 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {isPositive && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {isNegative && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {isNeutral && <Minus className="w-3 h-3 mr-0.5" />}
            {isPositive ? `+${changePct.toFixed(1)}%` : `${changePct.toFixed(1)}%`}
          </span>
          <span className="text-slate-400 dark:text-slate-500">{changeLabel}</span>
        </div>
      ) : caption ? (
        <div className="mt-2.5 text-xs text-slate-500 dark:text-slate-400">{caption}</div>
      ) : null}
    </div>
  );
};
