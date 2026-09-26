import { ProjectParameters, PricingConfig, TierComparison } from '../types/pricing';
import { calculateProjectEstimate } from './pricingEngine';
import { pluralizeDays } from '../utils/currency';

export function buildScenarioComparison(
  params: ProjectParameters,
  config: PricingConfig
): TierComparison {
  // 1. Basic (MVP / Старт): Core essentials only
  const basicWorks = params.selectedWorks.filter((w) =>
    ['work_ui_design', 'work_frontend', 'work_responsive', 'work_crm_leads'].includes(w)
  );
  if (basicWorks.length === 0) {
    basicWorks.push('work_frontend', 'work_responsive');
  }

  const basicParams: ProjectParameters = {
    ...params,
    pagesCount: Math.max(1, Math.min(params.pagesCount, 3)),
    screensCount: Math.max(1, Math.min(params.screensCount, 4)),
    componentsCount: Math.max(1, Math.min(params.componentsCount, 2)),
    selectedWorks: basicWorks,
    complexity: 'simple',
    urgency: 'normal',
  };
  const basicCalc = calculateProjectEstimate(basicParams, config);

  // 2. Standard (Current parameters)
  const standardCalc = calculateProjectEstimate(params, config);

  // 3. Premium: Extended package with advanced animations, SEO, QA, and security
  const premiumWorksSet = new Set([
    ...params.selectedWorks,
    'work_ui_design',
    'work_prototype',
    'work_frontend',
    'work_responsive',
    'work_animations',
    'work_seo',
    'work_analytics',
    'work_qa_testing',
  ]);
  const premiumParams: ProjectParameters = {
    ...params,
    pagesCount: Math.max(params.pagesCount, 5),
    screensCount: Math.max(params.screensCount, 8),
    componentsCount: Math.max(params.componentsCount, 5),
    selectedWorks: Array.from(premiumWorksSet),
    complexity: 'medium',
  };
  const premiumCalc = calculateProjectEstimate(premiumParams, config);

  return {
    basic: {
      name: 'БАЗОВЫЙ (СТАРТ)',
      price: basicCalc.finalPrice,
      days: `${basicCalc.estimatedDays.min}–${basicCalc.estimatedDays.max} ${pluralizeDays(basicCalc.estimatedDays.max).split(' ').slice(1).join(' ')}`,
      scope: 'Быстрый запуск необходимого ядра',
      features: [
        `До ${basicParams.pagesCount} ключевых страниц`,
        'Адаптивная верстка (Mobile & Desktop)',
        'Форма сбора заявок в Telegram / CRM',
        'Чистый семантический код без тяжелых конструкторов',
        'Базовая гарантия и передача исходников',
      ],
    },
    standard: {
      name: 'СТАНДАРТ (PRO / ОПТИМАЛЬНО)',
      price: standardCalc.finalPrice,
      days: `${standardCalc.estimatedDays.min}–${standardCalc.estimatedDays.max} ${pluralizeDays(standardCalc.estimatedDays.max).split(' ').slice(1).join(' ')}`,
      scope: 'Сбалансированное решение для бизнеса',
      features: [
        `${params.pagesCount} уникальных страниц / модулей`,
        'Индивидуальный дизайн в Figma с нуля',
        params.selectedWorks.includes('work_cms')
          ? 'Удобная панель управления (CMS) для контента'
          : 'Модульная архитектура с легким масштабированием',
        params.selectedWorks.includes('work_backend') || params.selectedWorks.includes('work_database')
          ? 'Бэкенд на Cloudflare Workers / Supabase'
          : 'Быстрая интеграция заявок и уведомлений',
        'Комплексное тестирование и мобильная адаптация',
      ],
    },
    premium: {
      name: 'ПРЕМИУМ (ВСЁ ВКЛЮЧЕНО)',
      price: premiumCalc.finalPrice,
      days: `${premiumCalc.estimatedDays.min}–${premiumCalc.estimatedDays.max} ${pluralizeDays(premiumCalc.estimatedDays.max).split(' ').slice(1).join(' ')}`,
      scope: 'Максимальный охват, скорость и анимации',
      features: [
        `${premiumParams.pagesCount}+ страниц с глубокой проработкой`,
        'Кликабельный прототип в Figma + UI Kit дизайн-системы',
        'Интерактивные микро-анимации и плавные переходы',
        'Полная SEO-оптимизация и настройка веб-аналитики с целями',
        'Стресс-тестирование, аудит скорости Lighthouse 95+',
        'Приоритетная поддержка 30 дней после релиза',
      ],
    },
  };
}
