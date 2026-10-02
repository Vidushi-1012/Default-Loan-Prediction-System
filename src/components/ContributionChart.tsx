import React from 'react';
import { ModelContribution } from '../types';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface ContributionChartProps {
  contributions: ModelContribution[];
  showLegend?: boolean;
}

export const ContributionChart: React.FC<ContributionChartProps> = ({
  contributions,
  showLegend = true,
}) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
            Model Contributions
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Factors that influenced this model prediction (SHAP/gradient log-odds attribution)
          </p>
        </div>

        {showLegend && (
          <div className="flex items-center gap-4 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 dark:bg-rose-400 inline-block" />
              <span>Elevates Predicted Risk</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 dark:bg-emerald-400 inline-block" />
              <span>Mitigates Predicted Risk</span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-1">
        {contributions.map((item) => {
          const isElevating = item.impact > 0;
          const barWidth = Math.max(8, item.relativeWeight);

          return (
            <div key={item.feature} className="group">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                  <span>{item.label}</span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal">
                    ({item.valueFormatted})
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums text-xs">
                  <span
                    className={`inline-flex items-center gap-0.5 font-semibold ${
                      isElevating ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isElevating ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {item.impact > 0 ? `+${item.impact.toFixed(3)}` : item.impact.toFixed(3)}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {item.relativeWeight}% weight
                  </span>
                </div>
              </div>

              {/* Progress bar track */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-xs overflow-hidden flex items-center">
                <div
                  className={`h-full rounded-xs transition-all duration-500 ease-out ${
                    isElevating ? 'bg-rose-500 dark:bg-rose-400' : 'bg-emerald-500 dark:bg-emerald-400'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-start gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          Attribution values reflect local gradient-boosted feature shapley proxies. This is a model explanation, not a causal or guaranteed explanation.
        </span>
      </div>
    </div>
  );
};
