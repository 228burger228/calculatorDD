import React, { useState } from 'react';
import { GeneratedQuote } from '../../core/quoteGenerator';
import { Copy, Check, Printer, X, Send, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ClientQuoteModalProps {
  quote: GeneratedQuote;
  onClose: () => void;
}

export const ClientQuoteModal: React.FC<ClientQuoteModalProps> = ({
  quote,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState<'telegram' | 'document'>('telegram');

  const handleCopyTelegram = async () => {
    try {
      await navigator.clipboard.writeText(quote.telegramText);
      setCopied(true);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
      });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print">
      <div className="max-w-3xl w-full p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6 my-6 max-h-[92vh] flex flex-col justify-between overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-950 text-violet-300 border border-violet-800/40">
                CLIENT QUOTE
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Клиентское коммерческое предложение
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Без внутренних коэффициентов. Готово к отправке в Telegram или на печать.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher: Telegram vs Document */}
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveView('telegram')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeView === 'telegram'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Формат для Telegram
            </button>
            <button
              type="button"
              onClick={() => setActiveView('document')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                activeView === 'document'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Документ для печати / PDF
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Печать / PDF</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTelegram}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-600/30'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Скопировано!' : 'Копировать для Telegram'}</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeView === 'telegram' ? (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
              {quote.telegramText}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white text-slate-900 shadow-inner space-y-5 text-xs sm:text-sm">
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Коммерческое предложение
                  </h2>
                  <p className="text-slate-600 font-semibold">{quote.summary.title}</p>
                  <p className="text-xs text-slate-500">Заказчик: {quote.summary.client}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-violet-700 block">Dmitry & Dima Studio</span>
                  <span className="text-[11px] text-slate-500">Telegram: @aimovl</span>
                </div>
              </div>

              {/* Price & Timeline Highlights */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Инвестиция в проект:</span>
                  <span className="text-xl font-bold text-violet-950">{quote.summary.investment}</span>
                  <span className="text-[11px] text-slate-500 block">Диапазон: {quote.summary.range}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Срок реализации под ключ:</span>
                  <span className="text-base font-bold text-slate-900">{quote.summary.timeline}</span>
                  <span className="text-[11px] text-slate-500 block">Поэтапно по спринтам</span>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Состав работ и функционал:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
                  {quote.summary.scope.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Stages */}
              <div className="space-y-2 border-t border-slate-200 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Этапы разработки:
                </h4>
                <ol className="space-y-1 text-xs text-slate-600 list-decimal pl-4">
                  {quote.summary.stages.map((stage, sIdx) => (
                    <li key={sIdx}>{stage}</li>
                  ))}
                </ol>
              </div>

              <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 flex justify-between">
                <span>Гарантия фиксированной цены и чистого кода</span>
                <span>Связь: t.me/aimovl</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <span>Студия цифровой разработки Dmitry & Dima v4.0</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
