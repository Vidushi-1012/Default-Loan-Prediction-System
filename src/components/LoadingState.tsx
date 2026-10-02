import React from 'react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Retrieving risk portfolio records...',
  rows = 4,
}) => {
  return (
    <div className="w-full py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl space-y-3">
        <div className="flex items-center justify-center gap-2 mb-4 text-xs font-medium text-slate-500 dark:text-slate-400">
          <div className="w-3.5 h-3.5 border-2 border-slate-300 dark:border-slate-700 border-t-slate-800 dark:border-t-slate-300 rounded-full animate-spin" />
          <span>{message}</span>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-10 bg-slate-100 dark:bg-slate-800/60 rounded-md animate-pulse border border-slate-200/50 dark:border-slate-700/50"
          />
        ))}
      </div>
    </div>
  );
};
