export type ProjectType = 
  | 'landing'           // Лендинг под ключ (Старт от 12к / Pro 39к)
  | 'corporate'         // Корпоративный сайт (от 39к)
  | 'ecommerce'         // Интернет-магазин / Каталог
  | 'telegram_bot'      // Telegram-бот & AI автоматизация (Старт 10к / Pro 35к)
  | 'webapp_mvp'        // Веб-сервисы, платформы & MVP (Старт 35к / Pro 85к)
  | 'ui_ux_design'      // UI/UX дизайн в Figma (Старт 8к / Pro 25к)
  | 'branding';         // Фирменный стиль & айдентика

export type ComplexityLevel = 'simple' | 'medium' | 'hard';
export type UrgencyLevel = 'normal' | 'fast' | 'urgent';

export interface WorkItem {
  id: string;
  name: string;
  category: 'design' | 'frontend' | 'backend' | 'cms_integrations' | 'marketing_qa';
  description: string;
  defaultPrice: number;
}

export interface ProjectParameters {
  projectName: string;
  clientName: string;
  projectType: ProjectType;
  pagesCount: number;
  screensCount: number;
  componentsCount: number;
  selectedWorks: string[]; // List of WorkItem IDs
  complexity: ComplexityLevel;
  urgency: UrgencyLevel;
  isStudentTrack: boolean;
  notes: string;
}

export interface PricingConfig {
  baseRates: Record<ProjectType, number>;
  perPageRate: number;
  perScreenRate: number;
  perComponentRate: number;
  additionalWorks: Record<string, number>;
  complexityMultipliers: Record<ComplexityLevel, number>;
  urgencyMultipliers: Record<UrgencyLevel, number>;
  minimumProjectPrice: number;
  studentDiscountMultiplier: number; // e.g. 0.6 (40% discount / at-cost)
  hourlyReferenceRate: number;
  geminiApiKey?: string;
}

export interface BreakdownCategory {
  title: string;
  cost: number;
  items: { name: string; cost: number }[];
}

export interface CalculationResult {
  basePrice: number;
  volumeCost: {
    pagesCost: number;
    screensCost: number;
    componentsCost: number;
    total: number;
  };
  additionalWorksCost: number;
  subtotal: number;
  complexityMultiplier: number;
  urgencyMultiplier: number;
  studentDiscountMultiplier: number;
  rawPrice: number;
  finalPrice: number;        // e.g. 147 000 ₽ (rounded to nearest 1000)
  rangeMin: number;          // e.g. 130 000 ₽
  rangeMax: number;          // e.g. 165 000 ₽
  estimatedDays: {
    min: number;
    max: number;
  };
  categories: BreakdownCategory[];
  drivers: string[];         // Key drivers for "Why this price?"
}

export interface TierComparison {
  basic: {
    name: string;
    price: number;
    days: string;
    features: string[];
    scope: string;
  };
  standard: {
    name: string;
    price: number;
    days: string;
    features: string[];
    scope: string;
  };
  premium: {
    name: string;
    price: number;
    days: string;
    features: string[];
    scope: string;
  };
}
