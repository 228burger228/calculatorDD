import { PricingConfig, WorkItem, ProjectParameters } from '../types/pricing';

export const ALL_WORK_ITEMS: WorkItem[] = [
  // Design (снижено на 30–37%)
  {
    id: 'work_ui_design',
    name: 'Авторский UI/UX дизайн в Figma',
    category: 'design',
    description: 'Индивидуальная дизайн-система, адаптивные сетки, компоненты и состояния',
    defaultPrice: 12000,
  },
  {
    id: 'work_prototype',
    name: 'Интерактивный кликабельный прототип',
    category: 'design',
    description: 'Проработка пользовательских сценариев (CJM) и микро-взаимодействий в Figma',
    defaultPrice: 5000,
  },
  {
    id: 'work_branding',
    name: 'Базовый брендинг & айдентика',
    category: 'design',
    description: 'Логотип, фирменные цвета, типографика и гайдлайн оформления',
    defaultPrice: 9000,
  },

  // Frontend (снижено на 35–44%)
  {
    id: 'work_frontend',
    name: 'Фронтенд-разработка (React / Vite / чистый код)',
    category: 'frontend',
    description: 'Семантическая быстрая верстка, модульные компоненты, zero-bloat архитектура',
    defaultPrice: 14000,
  },
  {
    id: 'work_responsive',
    name: 'Углубленная мобильная адаптация',
    category: 'frontend',
    description: 'Pixel-perfect отображение на смартфонах, планшетах и нестандартных экранах',
    defaultPrice: 5000,
  },
  {
    id: 'work_animations',
    name: 'Интерактивные анимации & микро-интеракции',
    category: 'frontend',
    description: 'Smooth scroll, drag-слайдеры, появление блоков и интерактивные эффекты',
    defaultPrice: 6000,
  },

  // Backend & Databases (снижено на 30–40%)
  {
    id: 'work_backend',
    name: 'Бэкенд-логика & API',
    category: 'backend',
    description: 'Серверлесс на Cloudflare Workers или Node.js, безопасная бизнес-логика',
    defaultPrice: 14000,
  },
  {
    id: 'work_database',
    name: 'База данных (PostgreSQL / Supabase / KV)',
    category: 'backend',
    description: 'Проектирование схемы данных, миграции, индексы и защита Row Level Security',
    defaultPrice: 9000,
  },
  {
    id: 'work_auth',
    name: 'Система авторизации & личные кабинеты',
    category: 'backend',
    description: 'JWT/OAuth, безопасный вход по email/Telegram/Google, разграничение прав',
    defaultPrice: 10000,
  },

  // CMS & Integrations (снижено на 33–37%)
  {
    id: 'work_cms',
    name: 'Панель управления контентом (CMS / Админка)',
    category: 'cms_integrations',
    description: 'Удобное добавление статей, товаров, портфолио без вмешательства в код',
    defaultPrice: 10000,
  },
  {
    id: 'work_crm_leads',
    name: 'Интеграция заявок (Telegram Bot + CRM / Sheets)',
    category: 'cms_integrations',
    description: 'Мгновенные уведомления о лидах в Telegram и сохранение в Google Таблицу',
    defaultPrice: 5000,
  },
  {
    id: 'work_payments',
    name: 'Подключение онлайн-оплаты (ЮKassa / CloudPayments)',
    category: 'cms_integrations',
    description: 'Фискализация чеков, эквайринг, вебхуки подтверждения оплаты',
    defaultPrice: 12000,
  },
  {
    id: 'work_external_api',
    name: 'Интеграция внешних API / Сервисов',
    category: 'cms_integrations',
    description: 'Подключение карт, рассылок, складских систем или сторонних платформ',
    defaultPrice: 8000,
  },

  // Marketing & QA (снижено на 33–44%)
  {
    id: 'work_seo',
    name: 'Базовая SEO-оптимизация & микроразметка',
    category: 'marketing_qa',
    description: 'OpenGraph, метатеги, sitemap.xml, Schema.org и быстрая индексация',
    defaultPrice: 5000,
  },
  {
    id: 'work_analytics',
    name: 'Веб-аналитика (Яндекс Метрика + цели)',
    category: 'marketing_qa',
    description: 'Настройка счетчиков, отслеживание кликов по кнопкам и конверсий',
    defaultPrice: 4000,
  },
  {
    id: 'work_qa_testing',
    name: 'Комплексное QA-тестирование & аудит скорости',
    category: 'marketing_qa',
    description: 'Кроссбраузерное тестирование, стресс-тесты, проверка на Lighthouse 95+',
    defaultPrice: 5000,
  },
];

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  baseRates: {
    landing: 12000,          // Базовый пакет лендинга (пакет Старт по базе знаний v4.0)
    corporate: 26000,        // Корпоративный сайт (снижено с 38 000)
    ecommerce: 34000,        // Интернет-магазин / Каталог (снижено с 48 000)
    telegram_bot: 10000,     // Telegram-бот / AI (пакет Старт по базе знаний v4.0)
    webapp_mvp: 35000,       // Полноценный веб-сервис / MVP (пакет Старт по базе знаний v4.0)
    ui_ux_design: 8000,      // Дизайн в Figma (пакет Старт по базе знаний v4.0)
    branding: 10000,         // Айдентика (снижено с 15 000)
  },
  perPageRate: 2000,         // За каждую дополнительную страницу (снижено с 3 500, -42%)
  perScreenRate: 1200,       // За каждый уникальный экран UI/UX (снижено с 2 000, -40%)
  perComponentRate: 1000,    // За сложный интерактивный компонент (снижено с 1 500, -33%)
  additionalWorks: ALL_WORK_ITEMS.reduce((acc, item) => {
    acc[item.id] = item.defaultPrice;
    return acc;
  }, {} as Record<string, number>),
  complexityMultipliers: {
    simple: 1.0,
    medium: 1.10,            // снижено с 1.15
    hard: 1.25,              // снижено с 1.35
  },
  urgencyMultipliers: {
    normal: 1.0,             // Стандартные сроки
    fast: 1.15,              // Срочно (+15%, снижено с +20%)
    urgent: 1.30,            // Экстренно (+30%, снижено с +40%)
  },
  minimumProjectPrice: 10000,// Минимальный порог студии (пакет Старт)
  studentDiscountMultiplier: 0.65, // 35% скидка (разработка по себестоимости)
  hourlyReferenceRate: 1500, // Референсный почасовой рейт (снижено с 2 200)
};

export const INITIAL_PROJECT_PARAMETERS: ProjectParameters = {
  projectName: "Корпоративный сайт строительной компании",
  clientName: "ООО «Хаус Гард»",
  projectType: "corporate",
  pagesCount: 7,
  screensCount: 8,
  componentsCount: 3,
  selectedWorks: [
    'work_ui_design',
    'work_frontend',
    'work_responsive',
    'work_cms',
    'work_crm_leads',
    'work_seo',
    'work_qa_testing',
  ],
  complexity: 'medium',
  urgency: 'fast',
  isStudentTrack: false,
  notes: "Каталог объектов с фильтрами, форма расчета сметы, отправка заявок в Telegram директору.",
};
