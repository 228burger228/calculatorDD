import React from 'react';
import { CalculationResult } from '../../types/pricing';
import { CheckCircle2, HelpCircle, TrendingUp } from 'lucide-react';

interface WhyThisPriceProps {
  result: CalculationResult;
}

export const WhyThisPrice: React.FC<WhyThisPriceProps> = ({ result }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          <span>Почему такая цена? (Аргументация для переговоров)</span>
        </h3>
        <span className="text-[11px] text-slate-500 font-mono">
          {result.drivers.length} ключевых факторов
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Смета основана на честной математической модели без скрытых наценок. Используйте эти тезисы на созвоне с клиентом для обоснования бюджета:
      </p>

      <ul className="space-y-2 pt-1">
        {result.drivers.map((driver, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60"
          >
            <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{driver}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
