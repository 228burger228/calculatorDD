import React from 'react';
import { MissingWorkSuggestion } from '../../core/missingWorksDetector';
import { AlertTriangle, Plus, Check } from 'lucide-react';

interface MissingWorksAlertProps {
  suggestions: MissingWorkSuggestion[];
  onAddWork: (workItemId: string) => void;
  alreadyAddedIds: string[];
}

export const MissingWorksAlert: React.FC<MissingWorksAlertProps> = ({
  suggestions,
  onAddWork,
  alreadyAddedIds,
}) => {
  const activeSuggestions = suggestions.filter(
    (s) => !alreadyAddedIds.includes(s.workItemId)
  );

  if (activeSuggestions.length === 0) return null;

  return (
    <div className="rounded-2xl bg-amber-950/30 border border-amber-500/30 p-4 space-y-3 shadow-lg">
      <div className="flex items-center gap-2 text-amber-300 font-medium text-xs sm:text-sm">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>AI обнаружил потенциально пропущенные работы в брифе ({activeSuggestions.length}):</span>
      </div>

      <div className="space-y-2.5">
        {activeSuggestions.map((item) => (
          <div
            key={item.workItemId}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs"
          >
            <div className="space-y-1">
              <span className="font-semibold text-slate-200">{item.title}</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">{item.reason}</p>
            </div>

            <button
              type="button"
              onClick={() => onAddWork(item.workItemId)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{item.actionText}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
