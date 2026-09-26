import React from 'react';
import { ProjectParameters, ProjectType, ComplexityLevel, UrgencyLevel, PricingConfig } from '../../types/pricing';
import { ALL_WORK_ITEMS } from '../../config/defaultPricing';
import { formatCurrency } from '../../utils/currency';
import { 
  Globe, 
  Building2, 
  ShoppingBag, 
  Bot, 
  Layers, 
  Palette, 
  Sparkles,
  GraduationCap,
  Clock,
  Gauge,
  HelpCircle,
  Check,
  Zap,
  Crown
} from 'lucide-react';

interface StandardModeFormProps {
  params: ProjectParameters;
  config: PricingConfig;
  onChange: (updated: ProjectParameters) => void;
}

export const StandardModeForm: React.FC<StandardModeFormProps> = ({
  params,
  config,
  onChange,
}) => {
  const updateField = <K extends keyof ProjectParameters>(key: K, value: ProjectParameters[K]) => {
    onChange({
      ...params,
      [key]: value,
    });
  };

  const toggleWork = (id: string) => {
    const exists = params.selectedWorks.includes(id);
    const updated = exists
      ? params.selectedWorks.filter((w) => w !== id)
      : [...params.selectedWorks, id];
    updateField('selectedWorks', updated);
  };

  const applyPresetPackage = (pkg: 'start' | 'pro' | 'premium') => {
    if (pkg === 'start') {
      onChange({
        ...params,
        pagesCount: Math.min(params.pagesCount, 3),
        screensCount: Math.min(params.screensCount, 4),
        componentsCount: 1,
        complexity: 'simple',
        urgency: 'normal',
        selectedWorks: ['work_frontend', 'work_responsive', 'work_crm_leads', 'work_qa_testing'],
      });
    } else if (pkg === 'pro') {
      onChange({
        ...params,
        pagesCount: Math.max(params.pagesCount, 6),
        screensCount: Math.max(params.screensCount, 8),
        componentsCount: 3,
        complexity: 'medium',
        urgency: 'fast',
        selectedWorks: [
          'work_ui_design',
          'work_frontend',
          'work_responsive',
          'work_cms',
          'work_crm_leads',
          'work_seo',
          'work_qa_testing',
        ],
      });
    } else if (pkg === 'premium') {
      onChange({
        ...params,
        pagesCount: Math.max(params.pagesCount, 10),
        screensCount: Math.max(params.screensCount, 14),
        componentsCount: 5,
        complexity: 'hard',
        urgency: 'fast',
        selectedWorks: [
          'work_ui_design',
          'work_prototype',
          'work_frontend',
          'work_responsive',
          'work_animations',
          'work_backend',
          'work_database',
          'work_cms',
          'work_crm_leads',
          'work_seo',
          'work_analytics',
          'work_qa_testing',
        ],
      });
    }
  };

  const projectTypes: { id: ProjectType; label: string; icon: React.ElementType; base: number; note: string }[] = [
    { id: 'landing', label: 'Сайт / Лендинг', icon: Globe, base: config.baseRates.landing, note: 'Одностраничник под ключ' },
    { id: 'corporate', label: 'Корпоративный сайт', icon: Building2, base: config.baseRates.corporate, note: 'Многостраничный портал' },
    { id: 'ecommerce', label: 'Каталог / Магазин', icon: ShoppingBag, base: config.baseRates.ecommerce, note: 'Товары, фильтры' },
    { id: 'telegram_bot', label: 'Telegram-бот & AI', icon: Bot, base: config.baseRates.telegram_bot, note: 'AI-ассистент / Лид-бот' },
    { id: 'webapp_mvp', label: 'Веб-сервис & MVP', icon: Layers, base: config.baseRates.webapp_mvp, note: 'Кабинеты, БД Supabase' },
    { id: 'ui_ux_design', label: 'UI/UX Дизайн в Figma', icon: Palette, base: config.baseRates.ui_ux_design, note: 'Прототипы & дизайн-система' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Quick Package Presets */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Пакет студии:</span>
          <span className="text-[11px] text-slate-500">быстрое переключение шаблона сметы</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => applyPresetPackage('start')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-98"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Старт</span>
          </button>
          <button
            type="button"
            onClick={() => applyPresetPackage('pro')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-950/80 hover:bg-violet-900 text-violet-200 border border-violet-700/50 flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-98"
          >
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>Pro</span>
          </button>
          <button
            type="button"
            onClick={() => applyPresetPackage('premium')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/80 hover:bg-cyan-900 text-cyan-200 border border-cyan-700/50 flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-98"
          >
            <Crown className="w-3 h-3 text-cyan-400" />
            <span>Премиум</span>
          </button>
        </div>
      </div>

      {/* 1. Project & Client Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Название проекта / Задача
          </label>
          <input
            type="text"
            value={params.projectName}
            onChange={(e) => updateField('projectName', e.target.value)}
            placeholder="Например: Корпоративный сайт строительной компании"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Заказчик / Компания
          </label>
          <input
            type="text"
            value={params.clientName}
            onChange={(e) => updateField('clientName', e.target.value)}
            placeholder="Например: ООО «Хаус Гард»"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* 2. Project Type Grid */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Тип решения (Базовый тариф студии)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {projectTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = params.projectType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => updateField('projectType', type.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-500 shadow-md shadow-violet-500/10 ring-1 ring-violet-500'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-violet-400' : 'text-slate-400'}`} />
                    <span className="text-[11px] font-mono text-slate-400">
                      от {formatCurrency(type.base)}
                    </span>
                  </div>
                  <h4 className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {type.label}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{type.note}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Scale Sliders (Pages, Screens, Components) */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Масштаб и объем разработки</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Pages */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Страниц:</span>
              <span className="font-mono text-cyan-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {params.pagesCount}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={params.pagesCount}
              onChange={(e) => updateField('pagesCount', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 стр</span>
              <span>15</span>
              <span>30 стр</span>
            </div>
          </div>

          {/* Screens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Экранов в Figma:</span>
              <span className="font-mono text-violet-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {params.screensCount}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={40}
              value={params.screensCount}
              onChange={(e) => updateField('screensCount', parseInt(e.target.value, 10))}
              className="w-full accent-violet-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 экран</span>
              <span>20</span>
              <span>40 экранов</span>
            </div>
          </div>

          {/* Components */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Интерактивных виджетов:</span>
              <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {params.componentsCount}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={params.componentsCount}
              onChange={(e) => updateField('componentsCount', parseInt(e.target.value, 10))}
              className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (базовые)</span>
              <span>7</span>
              <span>15 виджетов</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Categorized Additional Works */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Состав работ и модулей (Выбрано: {params.selectedWorks.length})
          </label>
          <span className="text-[11px] text-slate-500">
            Каждая позиция прозрачно аргументируется в смете
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ALL_WORK_ITEMS.map((work) => {
            const isChecked = params.selectedWorks.includes(work.id);
            const price = config.additionalWorks[work.id] ?? work.defaultPrice;
            return (
              <div
                key={work.id}
                onClick={() => toggleWork(work.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'bg-slate-900 border-violet-500/80 shadow-md ring-1 ring-violet-500/30'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    isChecked
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'border-slate-700 bg-slate-800/90'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-medium ${isChecked ? 'text-white font-semibold' : 'text-slate-300'}`}>
                      {work.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 shrink-0">
                      +{formatCurrency(price)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {work.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Complexity, Urgency, Student Track */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Complexity */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Сложность задач</span>
            </span>
            <span className="font-mono text-cyan-400 text-[11px]">
              ×{config.complexityMultipliers[params.complexity]}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['simple', 'medium', 'hard'] as ComplexityLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => updateField('complexity', lvl)}
                className={`py-1.5 px-2 text-[11px] font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  params.complexity === lvl
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 font-semibold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl === 'simple' ? 'Simple' : lvl === 'medium' ? 'Medium' : 'Hard'}
              </button>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Срочность дедлайна</span>
            </span>
            <span className="font-mono text-amber-400 text-[11px]">
              ×{config.urgencyMultipliers[params.urgency]}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['normal', 'fast', 'urgent'] as UrgencyLevel[]).map((urg) => (
              <button
                key={urg}
                type="button"
                onClick={() => updateField('urgency', urg)}
                className={`py-1.5 px-2 text-[11px] font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  params.urgency === urg
                    ? 'bg-amber-950 text-amber-300 border border-amber-700/60 font-semibold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {urg === 'normal' ? 'Normal' : urg === 'fast' ? 'Fast (+20%)' : 'Urgent (+40%)'}
              </button>
            ))}
          </div>
        </div>

        {/* Student Track */}
        <div 
          onClick={() => updateField('isStudentTrack', !params.isStudentTrack)}
          className={`p-3.5 rounded-xl border space-y-1.5 cursor-pointer transition-all select-none flex flex-col justify-between ${
            params.isStudentTrack
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <GraduationCap className="w-4 h-4" />
              <span>Студенческий трек</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
              params.isStudentTrack ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {params.isStudentTrack ? 'АКТИВЕН (-35%)' : 'ВЫКЛ'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">
            Бесплатная 30-мин консультация и разработка по себестоимости для стартапов и ВУЗов.
          </p>
        </div>

      </div>

    </div>
  );
};
