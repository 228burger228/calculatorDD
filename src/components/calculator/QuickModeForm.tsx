import React from 'react';
import { ProjectParameters, ProjectType, UrgencyLevel, PricingConfig } from '../../types/pricing';
import { Zap, CheckCircle2, ArrowRight } from 'lucide-react';

interface QuickModeFormProps {
  params: ProjectParameters;
  config: PricingConfig;
  onChange: (updated: ProjectParameters) => void;
  onSwitchToStandard: () => void;
}

export const QuickModeForm: React.FC<QuickModeFormProps> = ({
  params,
  onChange,
  onSwitchToStandard,
}) => {
  // 1. Project Type
  const selectType = (type: ProjectType) => {
    let pages = params.pagesCount;
    if (type === 'landing') pages = 1;
    else if (type === 'corporate') pages = 6;
    else if (type === 'telegram_bot') pages = 1;
    else if (type === 'webapp_mvp') pages = 5;

    onChange({
      ...params,
      projectType: type,
      pagesCount: pages,
      screensCount: Math.max(pages, Math.round(pages * 1.3)),
    });
  };

  // 2. Scale
  const selectScale = (pages: number) => {
    onChange({
      ...params,
      pagesCount: pages,
      screensCount: Math.max(pages, Math.round(pages * 1.3)),
    });
  };

  // 3. Design scope
  const selectDesign = (hasDesign: boolean, hasPrototype: boolean) => {
    let works = params.selectedWorks.filter(
      (w) => w !== 'work_ui_design' && w !== 'work_prototype'
    );
    if (hasDesign) works.push('work_ui_design');
    if (hasPrototype) works.push('work_prototype');

    onChange({
      ...params,
      selectedWorks: works,
    });
  };

  // 4. Backend & CMS
  const selectBackend = (hasCms: boolean, hasDbAndAuth: boolean) => {
    let works = params.selectedWorks.filter(
      (w) =>
        w !== 'work_cms' &&
        w !== 'work_backend' &&
        w !== 'work_database' &&
        w !== 'work_auth'
    );
    if (hasCms) works.push('work_cms');
    if (hasDbAndAuth) {
      works.push('work_backend', 'work_database', 'work_auth');
    }
    onChange({
      ...params,
      selectedWorks: works,
    });
  };

  // 5. Urgency
  const selectUrgency = (urgency: UrgencyLevel) => {
    onChange({
      ...params,
      urgency,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-violet-950/20 border border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Экспресс-смета за 30 секунд</h3>
            <p className="text-xs text-slate-400">
              Ответьте на 5 быстрых вопросов во время созвона с клиентом. Стоимость пересчитывается мгновенно.
            </p>
          </div>
        </div>
      </div>

      {/* Question 1: Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          1. Какой тип продукта требуется?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'landing' as ProjectType, label: 'Одностраничник', sub: 'Конверсионный лендинг' },
            { id: 'corporate' as ProjectType, label: 'Многостраничник', sub: 'Корпоративный сайт' },
            { id: 'telegram_bot' as ProjectType, label: 'Telegram-бот', sub: 'AI-ассистент / лиды' },
            { id: 'webapp_mvp' as ProjectType, label: 'Веб-сервис / MVP', sub: 'Личный кабинет, БД' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectType(item.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                params.projectType === item.id
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold text-xs">{item.label}</div>
              <div className="text-[11px] text-slate-500">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Question 2: Scale */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          2. Примерный масштаб проекта (страницы)?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { pages: 1, label: '1 страница', sub: 'Одноэкранный или лендинг' },
            { pages: 4, label: '3–5 страниц', sub: 'Базовый сайт компании' },
            { pages: 8, label: '6–10 страниц', sub: 'Разветвленный портал' },
            { pages: 15, label: '12+ страниц', sub: 'Масштабный проект' },
          ].map((item) => {
            const isSelected =
              item.pages === 1
                ? params.pagesCount === 1
                : item.pages === 4
                ? params.pagesCount >= 3 && params.pagesCount <= 5
                : item.pages === 8
                ? params.pagesCount >= 6 && params.pagesCount <= 10
                : params.pagesCount > 10;
            return (
              <button
                key={item.pages}
                type="button"
                onClick={() => selectScale(item.pages)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="font-semibold text-xs">{item.label}</div>
                <div className="text-[11px] text-slate-500">{item.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 3: Design */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          3. Требуется ли дизайн в Figma с нуля?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            {
              hasDesign: true,
              hasPrototype: false,
              label: 'Да, авторский дизайн в Figma',
              sub: 'Адаптивные макеты под мобайл и ПК',
            },
            {
              hasDesign: true,
              hasPrototype: true,
              label: 'Дизайн + интерактивный кликабельный прототип',
              sub: 'Полная дизайн-система и CJM',
            },
            {
              hasDesign: false,
              hasPrototype: false,
              label: 'Нет, есть готовый макет',
              sub: 'Только чистая верстка и программирование',
            },
          ].map((item, idx) => {
            const isDesignSelected = params.selectedWorks.includes('work_ui_design');
            const isProtoSelected = params.selectedWorks.includes('work_prototype');
            const isSelected =
              item.hasDesign === isDesignSelected &&
              item.hasPrototype === isProtoSelected;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => selectDesign(item.hasDesign, item.hasPrototype)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="font-semibold text-xs">{item.label}</div>
                <div className="text-[11px] text-slate-500">{item.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 4: CMS / DB */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          4. Нужна ли админка (CMS) или авторизация?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            {
              hasCms: false,
              hasDbAndAuth: false,
              label: 'Только формы и Telegram',
              sub: 'Быстрый сбор заявок без сложной админки',
            },
            {
              hasCms: true,
              hasDbAndAuth: false,
              label: 'Нужна CMS / Админка',
              sub: 'Самостоятельное добавление статей, товаров, портфолио',
            },
            {
              hasCms: true,
              hasDbAndAuth: true,
              label: 'CMS + Авторизация + База данных',
              sub: 'Личные кабинеты, PostgreSQL / Supabase',
            },
          ].map((item, idx) => {
            const isCms = params.selectedWorks.includes('work_cms');
            const isAuth = params.selectedWorks.includes('work_auth');
            const isSelected = item.hasCms === isCms && item.hasDbAndAuth === isAuth;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => selectBackend(item.hasCms, item.hasDbAndAuth)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div className="font-semibold text-xs">{item.label}</div>
                <div className="text-[11px] text-slate-500">{item.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question 5: Urgency */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
          5. Сроки и темп реализации?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { urgency: 'normal' as UrgencyLevel, label: 'Стандартный комфортный срок', sub: 'Без доплаты за срочность (1.0x)' },
            { urgency: 'fast' as UrgencyLevel, label: 'Срочно (ускоренный спринт)', sub: '+20% к смете, приоритет в графике' },
            { urgency: 'urgent' as UrgencyLevel, label: 'Экстренно («горит» дедлайн)', sub: '+40% к смете, работа в выходные' },
          ].map((item) => (
            <button
              key={item.urgency}
              type="button"
              onClick={() => selectUrgency(item.urgency)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                params.urgency === item.urgency
                  ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <div className="font-semibold text-xs">{item.label}</div>
              <div className="text-[11px] text-slate-500">{item.sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onSwitchToStandard}
          className="inline-flex items-center gap-2 text-xs text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
        >
          <span>Нужна тонкая настройка каждого компонента? Открыть полную форму</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
