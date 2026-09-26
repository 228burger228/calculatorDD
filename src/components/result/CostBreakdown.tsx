import React, { useState } from 'react';
import { CalculationResult } from '../../types/pricing';
import { formatCurrency } from '../../utils/currency';
import { ChevronDown, ChevronUp, PieChart, Layers } from 'lucide-react';

interface CostBreakdownProps {
  result: CalculationResult;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <PieChart className="w-3.5 h-3.5 text-violet-400" />
          <span>Структура стоимости и разбивка (Breakdown)</span>
        </h3>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? 'Свернуть' : 'Подробный список'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-3">
        {result.categories.map((cat, idx) => {
          const percent = result.subtotal > 0 ? Math.round((cat.cost / result.subtotal) * 100) : 0;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">{cat.title}</span>
                <span className="font-mono text-slate-400">
                  {formatCurrency(cat.cost)} <span className="text-slate-600 text-[10px]">({percent}%)</span>
                </span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/40">
                <div
                  className="bg-gradient-to-r from-violet-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
                />
              </div>

              {/* Expanded items */}
              {isExpanded && (
                <div className="pt-1.5 pl-3 border-l-2 border-slate-800/60 space-y-1 mt-1">
                  {cat.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between text-[11px] text-slate-400">
                      <span>• {item.name}</span>
                      <span className="font-mono text-slate-300">{formatCurrency(item.cost)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Multipliers Summary */}
      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span>Сложность: <strong className="text-cyan-300">×{result.complexityMultiplier}</strong></span>
          <span>Срочность: <strong className="text-amber-300">×{result.urgencyMultiplier}</strong></span>
          {result.studentDiscountMultiplier < 1 && (
            <span>Студ. скидка: <strong className="text-emerald-400">×{result.studentDiscountMultiplier}</strong></span>
          )}
        </div>
        <div className="font-mono text-slate-300">
          Subtotal: {formatCurrency(result.subtotal)}
        </div>
      </div>
    </div>
  );
};
