import React, { useState } from 'react';
import { PricingConfig, ProjectType } from '../../types/pricing';
import { formatCurrency } from '../../utils/currency';
import { Settings2, RotateCcw, Key, Save, Check, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { testGeminiApiKey } from '../../core/aiParser';

interface PricingSettingsFormProps {
  config: PricingConfig;
  onSaveConfig: (updated: PricingConfig) => void;
  onResetToDefaults: () => void;
}

export const PricingSettingsForm: React.FC<PricingSettingsFormProps> = ({
  config,
  onSaveConfig,
  onResetToDefaults,
}) => {
  const [localConfig, setLocalConfig] = useState<PricingConfig>(config);
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleTestKey = async () => {
    if (!localConfig.geminiApiKey) return;
    setIsTestingKey(true);
    setKeyTestStatus(null);
    try {
      const res = await testGeminiApiKey(localConfig.geminiApiKey);
      setKeyTestStatus(res);
    } catch (e: any) {
      setKeyTestStatus({ success: false, message: e?.message || 'Ошибка соединения' });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleBaseRateChange = (type: ProjectType, value: number) => {
    setLocalConfig({
      ...localConfig,
      baseRates: {
        ...localConfig.baseRates,
        [type]: Math.max(0, value),
      },
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(localConfig);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Сбросить все тарифы к официальным базовым пакетам студии Dmitry & Dima v4.0?')) {
      onResetToDefaults();
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-violet-400" />
            <span>Персональная тарифная сетка («MY PRICING»)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Настройте собственные базовые ставки, постраничную стоимость и множители сложности под свои расценки.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium border border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить к D&D v4.0</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            {savedNotice ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{savedNotice ? 'Сохранено!' : 'Сохранить тарифы'}</span>
          </button>
        </div>
      </div>

      {/* 1. Gemini API Key Configuration */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-950/30 to-indigo-950/20 border border-violet-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Google Gemini API (Опционально)</h3>
          </div>
          <span className="text-[11px] text-slate-400">
            {localConfig.geminiApiKey ? 'Ключ подключен' : 'Работает локальный NLP-движок'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Калькулятор на 100% работает автономно без API-ключа благодаря встроенному эвристическому парсеру. Если вы хотите подключить оригинальный Gemini 3.8 Flash для глубокого понимания нестандартных сообщений — введите ваш ключ.
        </p>

        <div className="space-y-2">
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={localConfig.geminiApiKey || ''}
              onChange={(e) => setLocalConfig({ ...localConfig, geminiApiKey: e.target.value })}
              placeholder="Вставьте ваш Google Gemini API Key (AIzaSy...)"
              className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-violet-500"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-violet-400 hover:text-violet-300 underline underline-offset-2 flex items-center gap-1"
            >
              <span>Получить бесплатный Gemini API ключ (aistudio.google.com)</span>
            </a>

            <button
              type="button"
              disabled={isTestingKey || !localConfig.geminiApiKey}
              onClick={handleTestKey}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all cursor-pointer ${
                isTestingKey
                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                  : 'bg-violet-950/80 hover:bg-violet-900 text-violet-200 border-violet-700/60'
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isTestingKey ? 'Проверяю соединение...' : '⚡️ Проверить соединение'}
            </button>
          </div>

          {keyTestStatus && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                keyTestStatus.success
                  ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-600/40 text-rose-300'
              }`}
            >
              <span>{keyTestStatus.success ? '✅' : '❌'}</span>
              <span>{keyTestStatus.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Base Rates for Project Types */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Базовые ставки пакетов (Base Rates)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'landing' as ProjectType, label: 'Сайт / Лендинг' },
            { id: 'corporate' as ProjectType, label: 'Корпоративный сайт' },
            { id: 'ecommerce' as ProjectType, label: 'Интернет-магазин / Каталог' },
            { id: 'telegram_bot' as ProjectType, label: 'Telegram-бот & AI' },
            { id: 'webapp_mvp' as ProjectType, label: 'Веб-сервис & MVP' },
            { id: 'ui_ux_design' as ProjectType, label: 'UI/UX Дизайн в Figma' },
          ].map((item) => (
            <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <label className="text-xs text-slate-400 block">{item.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step={1000}
                  value={localConfig.baseRates[item.id] || 0}
                  onChange={(e) => handleBaseRateChange(item.id, parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-violet-500"
                />
                <span className="text-xs text-slate-500">₽</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Volume Unit Rates */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Постраничные и поэкранные расценки (Volume Rates)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <label className="text-xs text-slate-400 block">За доп. страницу сайта</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={500}
                value={localConfig.perPageRate}
                onChange={(e) => setLocalConfig({ ...localConfig, perPageRate: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-500">₽</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <label className="text-xs text-slate-400 block">За уникальный экран в Figma</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={500}
                value={localConfig.perScreenRate}
                onChange={(e) => setLocalConfig({ ...localConfig, perScreenRate: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-violet-400 text-xs font-mono font-bold focus:outline-none focus:border-violet-500"
              />
              <span className="text-xs text-slate-500">₽</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <label className="text-xs text-slate-400 block">За сложный компонент/виджет</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={500}
                value={localConfig.perComponentRate}
                onChange={(e) => setLocalConfig({ ...localConfig, perComponentRate: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-slate-500">₽</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Thresholds & Multipliers */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Ограничения и коэффициенты
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <label className="text-xs text-slate-400 block">Минимальный порог проекта</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={1000}
                value={localConfig.minimumProjectPrice}
                onChange={(e) => setLocalConfig({ ...localConfig, minimumProjectPrice: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-violet-500"
              />
              <span className="text-xs text-slate-500">₽</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <label className="text-xs text-slate-400 block">Референсный почасовой рейт</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={100}
                value={localConfig.hourlyReferenceRate}
                onChange={(e) => setLocalConfig({ ...localConfig, hourlyReferenceRate: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs font-mono font-bold focus:outline-none focus:border-violet-500"
              />
              <span className="text-xs text-slate-500">₽/час</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
            <label className="text-xs text-slate-400 block">Множитель студ. трека (себестоимость)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step={0.05}
                min={0.1}
                max={1.0}
                value={localConfig.studentDiscountMultiplier}
                onChange={(e) => setLocalConfig({ ...localConfig, studentDiscountMultiplier: parseFloat(e.target.value) || 0.65 })}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
              />
              <span className="text-xs text-slate-500">x</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Сохранить тарифы для всех расчетов</span>
        </button>
      </div>

    </form>
  );
};
