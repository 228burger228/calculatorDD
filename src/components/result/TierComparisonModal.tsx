import React from 'react';
import { TierComparison } from '../../types/pricing';
import { formatCurrency } from '../../utils/currency';
import { Check, Sparkles, X, Layers, Clock } from 'lucide-react';

interface TierComparisonViewProps {
  comparison: TierComparison;
  onSelectTier?: (tier: 'basic' | 'standard' | 'premium') => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const TierComparisonView: React.FC<TierComparisonViewProps> = ({
  comparison,
  onSelectTier,
  onClose,
  isModal = false,
}) => {
  const tiers = [
    {
      id: 'basic' as const,
      data: comparison.basic,
      badge: 'Минимальный жизнеспособный MVP',
      border: 'border-slate-800',
      bg: 'bg-slate-900/60',
      priceColor: 'text-slate-200',
      isPopular: false,
    },
    {
      id: 'standard' as const,
      data: comparison.standard,
      badge: 'Рекомендуемый выбор студии',
      border: 'border-violet-500 ring-1 ring-violet-500',
      bg: 'bg-gradient-to-b from-violet-950/40 via-slate-900/90 to-slate-950',
      priceColor: 'text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-white to-cyan-300',
      isPopular: true,
    },
    {
      id: 'premium' as const,
      data: comparison.premium,
      badge: 'Максимальный охват & Поддержка',
      border: 'border-cyan-500/40',
      bg: 'bg-slate-900/60',
      priceColor: 'text-cyan-300',
      isPopular: false,
    },
  ];

  const content = (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            <span>Сравнение сценариев (BASIC / STANDARD / PREMIUM)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Предложите клиенту выбор по объему задач вместо споров о скидках.
          </p>
        </div>

        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 3-Column Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-2xl p-6 border ${tier.border} ${tier.bg} flex flex-col justify-between relative shadow-xl space-y-6`}
          >
            {tier.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-lg shadow-violet-600/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Оптимально</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  {tier.data.name}
                </span>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">
                  {tier.data.scope}
                </p>
              </div>

              {/* Price & Days */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className={`text-3xl font-extrabold font-mono tracking-tight ${tier.priceColor}`}>
                  {formatCurrency(tier.data.price)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Срок: {tier.data.days}</span>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
                  Что входит в пакет:
                </span>
                <ul className="space-y-2 text-xs text-slate-300">
                  {tier.data.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {onSelectTier && (
              <button
                type="button"
                onClick={() => onSelectTier(tier.id)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  tier.isPopular
                    ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                Выбрать этот пакет
              </button>
            )}
          </div>
        ))}
      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <div className="max-w-5xl w-full p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
