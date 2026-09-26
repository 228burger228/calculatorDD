import React, { useEffect, useState } from 'react';
import { CalculationResult } from '../../types/pricing';
import { formatCurrency, formatCurrencyCompact, pluralizeDays } from '../../utils/currency';
import { Sparkles, FileText, BookmarkPlus, Layers, Calendar, Check, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PriceDisplayProps {
  result: CalculationResult;
  onOpenQuote: () => void;
  onOpenComparison: () => void;
  onSaveProject: () => void;
  isSaved?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  result,
  onOpenQuote,
  onOpenComparison,
  onSaveProject,
  isSaved = false,
}) => {
  // Smooth animated counter state
  const [displayPrice, setDisplayPrice] = useState(result.finalPrice);

  useEffect(() => {
    let start = displayPrice;
    const end = result.finalPrice;
    if (start === end) return;

    const duration = 400; // ms
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(start + (end - start) * eased);
      setDisplayPrice(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [result.finalPrice]);

  const handleQuoteClick = () => {
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (e) {}
    onOpenQuote();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-violet-500/30 p-6 md:p-8 shadow-2xl shadow-violet-950/20">
      
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-950/80 border border-violet-500/40 text-violet-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Recommended Quote</span>
            </span>
            <span className="text-xs text-slate-400">
              Математическая модель сметы
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Фиксированная цена спринтов</span>
          </div>
        </div>

        {/* Main Big Price Display */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Рекомендуемая стоимость проекта
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 font-mono tracking-tight tabular-nums">
              {formatCurrency(displayPrice)}
            </span>
            
            {result.studentDiscountMultiplier < 1 && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
                Студенческий тариф применен
              </span>
            )}
          </div>

          {/* Realistic Range */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Ориентировочный диапазон:</span>
              <span className="font-mono text-cyan-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                {formatCurrency(result.rangeMin)} — {formatCurrency(result.rangeMax)}
              </span>
            </div>
            <span className="text-slate-500 text-[11px]">
              (защита от ложной точности до рубля)
            </span>
          </div>
        </div>

        {/* Timeline & Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Срок разработки под ключ:</span>
              <span className="font-semibold text-slate-200">
                {result.estimatedDays.min}–{result.estimatedDays.max} {pluralizeDays(result.estimatedDays.max).split(' ').slice(1).join(' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[11px]">Формат оплаты:</span>
              <span className="font-semibold text-slate-200">
                Поэтапно по спринтам после демонстрации
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          
          {/* Generate Quote */}
          <button
            type="button"
            onClick={handleQuoteClick}
            className="sm:col-span-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-violet-600/30 transition-all cursor-pointer active:scale-98"
          >
            <FileText className="w-4 h-4" />
            <span>Сформировать КП для клиента</span>
          </button>

          {/* Compare Tiers */}
          <button
            type="button"
            onClick={onOpenComparison}
            className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Сравнить пакеты (Basic / Pro)</span>
          </button>

          {/* Save Project */}
          <button
            type="button"
            onClick={onSaveProject}
            className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSaved
                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <BookmarkPlus className="w-4 h-4 text-slate-400" />}
            <span>{isSaved ? 'Сохранено!' : 'В историю смет'}</span>
          </button>

        </div>

      </div>

    </div>
  );
};
