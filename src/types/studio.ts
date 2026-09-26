export interface StudioInfo {
  name: string;
  version: string;
  manifest: string;
  leadDmitry: {
    name: string;
    alias: string;
    role: string;
    telegram: string;
    competencies: string[];
  };
  architectDima: {
    name: string;
    role: string;
    telegram: string;
    competencies: string[];
  };
  portfolioUrl: string;
  clientBot: string;
  trustFacts: {
    launchedCount: string;
    activeUsers: string;
    officialLetter: string;
    keyCases: {
      title: string;
      description: string;
      url: string;
    }[];
  };
  packagesSummary: {
    title: string;
    start: { price: number; time: string; desc: string };
    pro: { price: number; time: string; desc: string };
  }[];
}

export const DMITRY_DIMA_STUDIO: StudioInfo = {
  name: "Студия цифровой разработки Dmitry & Dima",
  version: "4.0",
  manifest: "Clarity бьёт визуальный шум. Быстрая загрузка, удобная мобильная верстка и чистый код — стандарт каждого проекта. Мы работаем на результат и не берем агентских наценок за статус — только честная прозрачная стоимость.",
  leadDmitry: {
    name: "Дмитрий",
    alias: "Burger",
    role: "Design-Driven Product & Technical Lead",
    telegram: "@aimovl",
    competencies: [
      "UI/UX в Figma & Дизайн-системы",
      "Чистый семантический фронтенд",
      "AI-агенты и LLM интеграции",
      "Продуктовая аналитика & Управление проектами"
    ]
  },
  architectDima: {
    name: "Дима",
    role: "Full-Stack Developer & Systems Architect",
    telegram: "@mikerrofan",
    competencies: [
      "Масштабируемый бэкенд",
      "Базы данных (PostgreSQL, Supabase)",
      "API-интеграции и платежные шлюзы",
      "Серверлесс-архитектура на Cloudflare Workers"
    ]
  },
  portfolioUrl: "https://228burger228.github.io/portfelDD/",
  clientBot: "@dmitryB_studio_bot",
  trustFacts: {
    launchedCount: "15+ успешных проектов в продакшне",
    activeUsers: "10 000+ активных пользователей",
    officialLetter: "Официальное благодарственное письмо от ООО «Хаус Гард» (smr.hgstroy.ru)",
    keyCases: [
      {
        title: "HgStroy (smr.hgstroy.ru)",
        description: "Корпоративный портал строительной компании с официальной благодарностью",
        url: "https://smr.hgstroy.ru/index.html"
      },
      {
        title: "Study Up",
        description: "MVP образовательной платформы для онлайн-школы",
        url: "https://228burger228.github.io/StudyUp/index.html"
      },
      {
        title: "vertical.team (aNdreyTT)",
        description: "Конверсионный лендинг для AI-креаторов с интерактивной drag-каруселью",
        url: "https://228burger228.github.io/aNdreyTT/"
      },
      {
        title: "Warpath Wiki",
        description: "Интерактивный портал комьюнити с 10k+ пользователей (Vue 3 + Supabase)",
        url: "https://228burger228.github.io/WarpathYTwiki/index.html"
      },
      {
        title: "Dmitry OS Agent",
        description: "Серверлесс AI-ассистент на Cloudflare Workers + Google Gemini + KV",
        url: "https://228burger228.github.io/portfelDD/"
      }
    ]
  },
  packagesSummary: [
    {
      title: "Сайты & Лендинги под ключ",
      start: { price: 12000, time: "3–5 рабочих дней", desc: "Конверсионный одностраничник, адаптив, заявки в Telegram, SEO, без конструкторов" },
      pro: { price: 39000, time: "7–10 рабочих дней", desc: "Авторский дизайн с нуля в Figma, сложные анимации, калькуляторы, аналитика" }
    },
    {
      title: "Telegram-боты & AI-автоматизация",
      start: { price: 10000, time: "2–4 рабочих дня", desc: "Лид-бот с кнопочным меню, сбор заявок, CRM в Google Таблицах" },
      pro: { price: 35000, time: "5–8 рабочих дней", desc: "Интеллектуальный AI-ассистент на Gemini/Claude, БД, онлайн-оплата, Cloudflare Workers" }
    },
    {
      title: "UI/UX дизайн в Figma",
      start: { price: 8000, time: "2–4 рабочих дня", desc: "Проектирование ключевых экранов, подбор типографики, адаптив под смартфоны" },
      pro: { price: 25000, time: "4–7 рабочих дней", desc: "Полноценная дизайн-система, интерактивный прототип в Figma, CJM, UI Kit" }
    },
    {
      title: "Веб-сервисы, платформы & MVP",
      start: { price: 35000, time: "1–2 недели", desc: "Первый рабочий MVP, авторизация, профиль пользователя, Supabase/PostgreSQL" },
      pro: { price: 85000, time: "3–4 недели", desc: "Полнофункциональная платформа, личные кабинеты, роли доступа, внешние API, платежи" }
    }
  ]
};
