import { ProjectParameters, PricingConfig, CalculationResult, BreakdownCategory } from '../types/pricing';
import { ALL_WORK_ITEMS } from '../config/defaultPricing';

export function calculateProjectEstimate(
  params: ProjectParameters,
  config: PricingConfig
): CalculationResult {
  // 1. Base price for the selected project type
  const basePrice = config.baseRates[params.projectType] || 20000;

  // 2. Volume-based calculations (pages, screens, components beyond base 1 page)
  const extraPages = Math.max(0, params.pagesCount - 1);
  const extraScreens = Math.max(0, params.screensCount - 1);
  const components = Math.max(0, params.componentsCount);

  const pagesCost = extraPages * config.perPageRate;
  const screensCost = extraScreens * config.perScreenRate;
  const componentsCost = components * config.perComponentRate;
  const volumeCostTotal = pagesCost + screensCost + componentsCost;

  // 3. Additional works total
  let additionalWorksCost = 0;
  const selectedWorkObjects = ALL_WORK_ITEMS.filter((item) =>
    params.selectedWorks.includes(item.id)
  );

  selectedWorkObjects.forEach((work) => {
    const cost = config.additionalWorks[work.id] ?? work.defaultPrice;
    additionalWorksCost += cost;
  });

  // 4. Subtotal calculation
  const subtotal = basePrice + volumeCostTotal + additionalWorksCost;

  // 5. Multipliers
  const complexityMultiplier = config.complexityMultipliers[params.complexity] || 1.0;
  const urgencyMultiplier = config.urgencyMultipliers[params.urgency] || 1.0;
  const studentDiscountMultiplier = params.isStudentTrack
    ? config.studentDiscountMultiplier
    : 1.0;

  // 6. Final Raw Price
  const rawPrice =
    subtotal * complexityMultiplier * urgencyMultiplier * studentDiscountMultiplier;

  // 7. Apply Minimum Threshold and Rounding (nearest 1 000 ₽ or 500 ₽ to avoid false precision)
  const thresholdPrice = Math.max(config.minimumProjectPrice, rawPrice);
  const finalPrice = Math.round(thresholdPrice / 1000) * 1000;

  // 8. Range calculation: realistic commercial buffer (min ~88%, max ~114%)
  const rangeMin = Math.max(
    config.minimumProjectPrice,
    Math.round((finalPrice * 0.88) / 1000) * 1000
  );
  const rangeMax = Math.round((finalPrice * 1.14) / 1000) * 1000;

  // 9. Timeline Estimation in Working Days
  let baseDays = 4;
  if (params.projectType === 'landing') baseDays = 4;
  else if (params.projectType === 'corporate') baseDays = 8;
  else if (params.projectType === 'ecommerce') baseDays = 12;
  else if (params.projectType === 'telegram_bot') baseDays = 5;
  else if (params.projectType === 'webapp_mvp') baseDays = 14;
  else if (params.projectType === 'ui_ux_design') baseDays = 5;

  const extraDays = Math.ceil(extraPages * 0.4 + extraScreens * 0.3 + selectedWorkObjects.length * 0.4);
  let totalMinDays = Math.max(2, baseDays + extraDays - 2);
  let totalMaxDays = baseDays + extraDays + 3;

  if (params.urgency === 'fast') {
    totalMinDays = Math.max(2, Math.round(totalMinDays * 0.75));
    totalMaxDays = Math.max(3, Math.round(totalMaxDays * 0.8));
  } else if (params.urgency === 'urgent') {
    totalMinDays = Math.max(2, Math.round(totalMinDays * 0.55));
    totalMaxDays = Math.max(3, Math.round(totalMaxDays * 0.6));
  }

  // 10. Cost Breakdown by Category
  const categories: BreakdownCategory[] = [];

  // Group: Base & Volume
  categories.push({
    title: 'Базовый стек & Архитектура',
    cost: basePrice,
    items: [
      {
        name: `Базовый пакет (${getProjectTypeName(params.projectType)})`,
        cost: basePrice,
      },
    ],
  });

  if (volumeCostTotal > 0) {
    const volumeItems = [];
    if (pagesCost > 0) {
      volumeItems.push({ name: `${extraPages} доп. страниц (по ${config.perPageRate} ₽)`, cost: pagesCost });
    }
    if (screensCost > 0) {
      volumeItems.push({ name: `${extraScreens} уникальных экранов UI/UX (по ${config.perScreenRate} ₽)`, cost: screensCost });
    }
    if (componentsCost > 0) {
      volumeItems.push({ name: `${components} интерактивных компонентов (по ${config.perComponentRate} ₽)`, cost: componentsCost });
    }

    categories.push({
      title: 'Объем и масштабирование',
      cost: volumeCostTotal,
      items: volumeItems,
    });
  }

  // Group selected works by category
  const categoryMap: Record<string, { title: string; items: { name: string; cost: number }[]; cost: number }> = {
    design: { title: 'UI/UX Дизайн & Прототипирование', items: [], cost: 0 },
    frontend: { title: 'Фронтенд & Адаптивная верстка', items: [], cost: 0 },
    backend: { title: 'Бэкенд & Базы данных (PostgreSQL/Supabase)', items: [], cost: 0 },
    cms_integrations: { title: 'CMS, Лиды & Интеграции', items: [], cost: 0 },
    marketing_qa: { title: 'SEO, Аналитика & QA Тестирование', items: [], cost: 0 },
  };

  selectedWorkObjects.forEach((work) => {
    const cost = config.additionalWorks[work.id] ?? work.defaultPrice;
    categoryMap[work.category].items.push({ name: work.name, cost });
    categoryMap[work.category].cost += cost;
  });

  Object.values(categoryMap).forEach((cat) => {
    if (cat.items.length > 0) {
      categories.push(cat);
    }
  });

  // 11. Cost Drivers ("Why this price?")
  const drivers: string[] = [];

  if (params.pagesCount > 3) {
    drivers.push(`Объем разработки: ${params.pagesCount} уникальных страниц с индивидуальной проработкой`);
  }
  if (params.screensCount > 4) {
    drivers.push(`Проектирование: ${params.screensCount} детальных адаптивных экранов в Figma`);
  }
  if (params.selectedWorks.includes('work_cms')) {
    drivers.push('Интеграция CMS панели: клиент сможет автономно управлять контентом без программиста');
  }
  if (params.selectedWorks.includes('work_backend') || params.selectedWorks.includes('work_database')) {
    drivers.push('Масштабируемый бэкенд и структура БД (PostgreSQL / Supabase / Cloudflare Workers)');
  }
  if (params.selectedWorks.includes('work_auth')) {
    drivers.push('Система авторизации с защищенными личными кабинетами пользователей');
  }
  if (params.selectedWorks.includes('work_payments')) {
    drivers.push('Финансовый шлюз: прием онлайн-оплаты с фискализацией чеков');
  }
  if (params.selectedWorks.includes('work_crm_leads')) {
    drivers.push('Автоматизация лидогенерации: мгновенная отправка заявок в Telegram и Google Таблицы');
  }
  if (params.complexity === 'medium') {
    drivers.push('Уровень сложности Medium (×1.15): нестандартные пользовательские сценарии');
  } else if (params.complexity === 'hard') {
    drivers.push('Высокая инженерная сложность Hard (×1.35): распределенная архитектура или сложные расчеты');
  }
  if (params.urgency === 'fast') {
    drivers.push('Ускоренный спринт (×1.20): сокращение сроков запуска до минимума');
  } else if (params.urgency === 'urgent') {
    drivers.push('Экстренный запуск (×1.40): приоритетная работа команды в режиме сжатого дедлайна');
  }
  if (params.isStudentTrack) {
    drivers.push('Студенческий / волонтерский трек: применение специальной цены без коммерческой наценки студии');
  }

  if (drivers.length === 0) {
    drivers.push(`Оптимальный базовый пакет студии для быстрого запуска`);
    drivers.push(`Чистый код без раздутых фреймворков и агентской наценки`);
  }

  return {
    basePrice,
    volumeCost: {
      pagesCost,
      screensCost,
      componentsCost,
      total: volumeCostTotal,
    },
    additionalWorksCost,
    subtotal,
    complexityMultiplier,
    urgencyMultiplier,
    studentDiscountMultiplier,
    rawPrice,
    finalPrice,
    rangeMin,
    rangeMax,
    estimatedDays: {
      min: totalMinDays,
      max: totalMaxDays,
    },
    categories,
    drivers,
  };
}

export function getProjectTypeName(type: string): string {
  switch (type) {
    case 'landing':
      return 'Сайт / Лендинг под ключ';
    case 'corporate':
      return 'Корпоративный портал / Многостраничник';
    case 'ecommerce':
      return 'Интернет-магазин / Каталог';
    case 'telegram_bot':
      return 'Telegram-бот & AI-автоматизация';
    case 'webapp_mvp':
      return 'Веб-сервис, платформа & MVP';
    case 'ui_ux_design':
      return 'UI/UX Дизайн в Figma';
    case 'branding':
      return 'Брендинг & Айдентика';
    default:
      return 'Цифровой проект';
  }
}
