import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'System Query Notice',
  message = 'Unable to load application data. Please verify your connection or retry.',
  onRetry,
}) => {
  return (
    <div className="py-8 px-6 flex flex-col items-center justify-center text-center bg-rose-50/50 dark:bg-rose-950/20 rounded-lg border border-rose-200 dark:border-rose-900/60">
      <div className="p-2.5 bg-rose-100/60 dark:bg-rose-900/40 rounded-md text-rose-700 dark:text-rose-400 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">{title}</h3>
      <p className="mt-1 text-xs text-rose-700/90 dark:text-rose-400/90 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-800 dark:text-rose-300 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
