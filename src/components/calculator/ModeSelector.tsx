import React from 'react';
import { Zap, SlidersHorizontal, Sparkles } from 'lucide-react';

export type CalculationMode = 'quick' | 'standard' | 'ai_analysis';

interface ModeSelectorProps {
  currentMode: CalculationMode;
  onModeChange: (mode: CalculationMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/80 inline-flex flex-wrap sm:flex-nowrap gap-1 w-full max-w-2xl shadow-inner">
      
      {/* Quick Mode */}
      <button
        type="button"
        onClick={() => onModeChange('quick')}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
          currentMode === 'quick'
            ? 'bg-slate-800 text-white shadow border border-slate-700/60'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
        }`}
      >
        <Zap className={`w-4 h-4 ${currentMode === 'quick' ? 'text-amber-400' : 'text-slate-500'}`} />
        <span>⚡️ QUICK (5 вопросов)</span>
      </button>

      {/* Standard Mode */}
      <button
        type="button"
        onClick={() => onModeChange('standard')}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
          currentMode === 'standard'
            ? 'bg-slate-800 text-white shadow border border-slate-700/60'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
        }`}
      >
        <SlidersHorizontal className={`w-4 h-4 ${currentMode === 'standard' ? 'text-cyan-400' : 'text-slate-500'}`} />
        <span>🛠 STANDARD (Полная форма)</span>
      </button>

      {/* AI Analysis Mode */}
      <button
        type="button"
        onClick={() => onModeChange('ai_analysis')}
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer relative ${
          currentMode === 'ai_analysis'
            ? 'bg-gradient-to-r from-violet-900/80 to-indigo-900/80 text-white shadow border border-violet-500/50'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
        }`}
      >
        <Sparkles className={`w-4 h-4 ${currentMode === 'ai_analysis' ? 'text-violet-400 animate-spin' : 'text-slate-500'}`} />
        <span>🧠 AI АНАЛИЗ</span>
        <span className="hidden md:inline text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 px-1 rounded">
          Сообщение
        </span>
      </button>

    </div>
  );
};
