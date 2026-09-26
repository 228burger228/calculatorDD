export interface SamplePrompt {
  id: string;
  title: string;
  badge: string;
  clientMessage: string;
  expectedParams: {
    projectType: string;
    pagesCount: number;
    screensCount: number;
    componentsCount: number;
    complexity: 'simple' | 'medium' | 'hard';
    urgency: 'normal' | 'fast' | 'urgent';
    isStudentTrack: boolean;
    suggestedWorks: string[];
    potentialMissedWorks: {
      id: string;
      reason: string;
    }[];
  };
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'hgstroy',
    title: 'Строительный портал (кейс HgStroy)',
    badge: 'Корпоративный сайт',
    clientMessage: 'Приветствую! Мы строительная компания, строим коттеджи и загородные дома. Нам нужен солидный современный сайт примерно на 7 страниц: главная, каталог готовых объектов с карточками домов, страница услуг, о компании, отзывы, блог и контакты. Обязательно нужен адаптив под смартфоны, форма расчета стоимости фундамента и заявка прямо в наш Telegram. Нужно успеть сделать быстро, дней за 10-12 к началу сезона.',
    expectedParams: {
      projectType: 'corporate',
      pagesCount: 7,
      screensCount: 9,
      componentsCount: 3,
      complexity: 'medium',
      urgency: 'fast',
      isStudentTrack: false,
      suggestedWorks: [
        'work_ui_design',
        'work_frontend',
        'work_responsive',
        'work_crm_leads',
        'work_seo',
        'work_qa_testing',
      ],
      potentialMissedWorks: [
        {
          id: 'work_cms',
          reason: 'Клиент упомянул каталог объектов и блог, но не указал CMS. Без админки добавление новых домов потребует правок в коде.',
        },
        {
          id: 'work_analytics',
          reason: 'Для строительной компании критически важно отслеживать цену лида и конверсии форм через Яндекс Метрику.',
        },
      ],
    },
  },
  {
    id: 'telegram_ai_bot',
    title: 'AI-ассистент в Telegram для продаж',
    badge: 'Telegram-бот & AI',
    clientMessage: 'Привет! Хотим автоматизировать консультации в нашем интернет-магазине. Нужен умный Telegram-бот с искусственным интеллектом, который будет отвечать клиентам по базе товаров, консультировать по наличию и принимать заказы. Хотим серверлесс без платы за сервер каждый месяц. Нужно подключить базу данных и прием оплаты.',
    expectedParams: {
      projectType: 'telegram_bot',
      pagesCount: 1,
      screensCount: 4,
      componentsCount: 2,
      complexity: 'medium',
      urgency: 'normal',
      isStudentTrack: false,
      suggestedWorks: [
        'work_backend',
        'work_database',
        'work_crm_leads',
        'work_payments',
        'work_qa_testing',
      ],
      potentialMissedWorks: [
        {
          id: 'work_cms',
          reason: 'Для удобного обновления базы знаний и ассортимента товаров боту потребуется панель управления.',
        },
      ],
    },
  },
  {
    id: 'studyup_student',
    title: 'StudyUp — Платформа онлайн-курсов',
    badge: 'Студенческий трек / MVP',
    clientMessage: 'Здравствуйте! Мы команда студентов, делаем образовательный стартап для подготовки к экзаменам. Нужен первый рабочий MVP: лендинг, личный кабинет ученика, просмотр видео-уроков, сохранение прогресса и авторизация. Бюджет у нас студенческий, ищем команду, которая поможет с архитектурой и сделает недорого.',
    expectedParams: {
      projectType: 'webapp_mvp',
      pagesCount: 5,
      screensCount: 8,
      componentsCount: 4,
      complexity: 'medium',
      urgency: 'normal',
      isStudentTrack: true,
      suggestedWorks: [
        'work_ui_design',
        'work_frontend',
        'work_backend',
        'work_database',
        'work_auth',
        'work_qa_testing',
      ],
      potentialMissedWorks: [
        {
          id: 'work_payments',
          reason: 'Для монетизации курсов студенческому стартапу скоро понадобится прием платежей.',
        },
      ],
    },
  },
  {
    id: 'vertical_team',
    title: 'vertical.team — Конверсионный лендинг',
    badge: 'Landing Pro',
    clientMessage: 'Салют! Запускаем платформу для AI-креаторов и монтажеров вертикальных рилсов. Нужен топовый одностраничник: крутой дерзкий дизайн в темной теме, интерактивная карусель с автовоспроизведением видео, микро-анимации при скролле и форма предзаписи с валидацией.',
    expectedParams: {
      projectType: 'landing',
      pagesCount: 1,
      screensCount: 6,
      componentsCount: 5,
      complexity: 'hard',
      urgency: 'fast',
      isStudentTrack: false,
      suggestedWorks: [
        'work_ui_design',
        'work_frontend',
        'work_responsive',
        'work_animations',
        'work_crm_leads',
        'work_analytics',
        'work_qa_testing',
      ],
      potentialMissedWorks: [
        {
          id: 'work_seo',
          reason: 'Для лендинга с видео важна правильная OpenGraph разметка для превью в соцсетях.',
        },
      ],
    },
  },
];
