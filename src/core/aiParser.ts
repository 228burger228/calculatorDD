import { GoogleGenAI } from '@google/genai';
import { ProjectParameters, ProjectType, ComplexityLevel, UrgencyLevel } from '../types/pricing';
import { detectMissingWorks, MissingWorkSuggestion } from './missingWorksDetector';

export interface AIAnalysisResult {
  projectName: string;
  clientName: string;
  projectType: ProjectType;
  pagesCount: number;
  screensCount: number;
  componentsCount: number;
  complexity: ComplexityLevel;
  urgency: UrgencyLevel;
  isStudentTrack: boolean;
  selectedWorks: string[];
  explanation: string;
  missingSuggestions: MissingWorkSuggestion[];
  source: 'gemini' | 'heuristic';
}

/**
 * Smart local heuristic parser that immediately extracts structured parameters
 * from Russian language client messages without requiring any external network or API key.
 */
export function parseClientMessageLocally(rawText: string): AIAnalysisResult {
  const text = rawText.toLowerCase();

  // 1. Detect Project Type
  let projectType: ProjectType = 'landing';
  const pageMatch = text.match(/(\d+)\s*(?:стран|стр|страниц)/i);
  const detectedPages = pageMatch ? parseInt(pageMatch[1], 10) : 1;

  if (text.includes('бот') || text.includes('чат-бот') || text.includes('ai-ассистент') || text.includes('телеграм бот') || text.includes('telegram-бот')) {
    projectType = 'telegram_bot';
  } else if (text.includes('платформ') || text.includes('сервис') || text.includes('mvp') || text.includes('веб-приложен')) {
    projectType = 'webapp_mvp';
  } else if (text.includes('интернет-магазин') || text.includes('магазин') || (text.includes('каталог') && text.includes('товаров'))) {
    projectType = 'ecommerce';
  } else if (text.includes('корпоративн') || text.includes('портал') || text.includes('компани') || text.includes('фирм') || detectedPages > 2) {
    projectType = 'corporate';
  } else if (text.includes('figma') || text.includes('дизайн') || text.includes('макет')) {
    projectType = 'ui_ux_design';
  } else if (text.includes('брендинг') || text.includes('логотип')) {
    projectType = 'branding';
  }

  // 2. Detect Pages Count
  let pagesCount = detectedPages;
  if (!pageMatch) {
    pagesCount = 6;
  } else if (projectType === 'ecommerce') {
    pagesCount = 8;
  } else if (projectType === 'webapp_mvp') {
    pagesCount = 5;
  }

  // 3. Detect Screens Count
  let screensCount = Math.max(pagesCount, Math.round(pagesCount * 1.3));
  const screenMatch = text.match(/(\d+)\s*(?:экран|макет)/i);
  if (screenMatch) {
    screensCount = Math.max(pagesCount, parseInt(screenMatch[1], 10));
  }

  // 4. Detect Interactive Components
  let componentsCount = 2;
  if (text.includes('калькулятор') || text.includes('расчет')) componentsCount += 1;
  if (text.includes('карусель') || text.includes('слайдер')) componentsCount += 1;
  if (text.includes('фильтр') || text.includes('поиск')) componentsCount += 1;
  if (text.includes('видео') || text.includes('плеер')) componentsCount += 1;

  // 5. Detect Urgency
  let urgency: UrgencyLevel = 'normal';
  if (text.includes('срочн') || text.includes('быстро') || text.includes('горит') || text.includes('дедлайн') || text.includes('дней за') || text.includes('за 10') || text.includes('за 7') || text.includes('за 5')) {
    urgency = 'fast';
  }
  if (text.includes('очень срочно') || text.includes('за 2-3') || text.includes('за пару дней')) {
    urgency = 'urgent';
  }

  // 6. Detect Complexity
  let complexity: ComplexityLevel = 'medium';
  if (text.includes('прост') || text.includes('базов') || text.includes('визитк')) {
    complexity = 'simple';
  } else if (text.includes('сложн') || text.includes('интеграци') || text.includes('платформ') || text.includes('ai') || text.includes('нейросет')) {
    complexity = 'hard';
  }

  // 7. Detect Student Track
  const isStudentTrack =
    text.includes('студент') ||
    text.includes('учеб') ||
    text.includes('вуз') ||
    text.includes('диплом') ||
    text.includes('волонтер') ||
    text.includes('некоммерческ');

  // 8. Detect Selected Works
  const selectedWorks: string[] = ['work_frontend', 'work_responsive'];

  if (text.includes('дизайн') || text.includes('figma') || text.includes('макет') || projectType !== 'telegram_bot') {
    selectedWorks.push('work_ui_design');
  }
  if (text.includes('анимац') || text.includes('карусель') || text.includes('эффект') || text.includes('интерактив')) {
    selectedWorks.push('work_animations');
  }
  if (text.includes('админк') || text.includes('cms') || text.includes('панель')) {
    selectedWorks.push('work_cms');
  }
  if (text.includes('бэкенд') || text.includes('сервер') || text.includes('api') || projectType === 'telegram_bot' || projectType === 'webapp_mvp') {
    selectedWorks.push('work_backend');
  }
  if (text.includes('баз') || text.includes('бд') || text.includes('данных') || text.includes('supabase') || text.includes('postgres') || projectType === 'webapp_mvp') {
    selectedWorks.push('work_database');
  }
  if (text.includes('кабинет') || text.includes('авторизац') || text.includes('вход') || text.includes('профиль')) {
    selectedWorks.push('work_auth');
  }
  if (text.includes('оплат') || text.includes('купить') || text.includes('эквайринг')) {
    selectedWorks.push('work_payments');
  }
  if (text.includes('заявк') || text.includes('форм') || text.includes('telegram') || text.includes('тг') || text.includes('crm') || text.includes('лид')) {
    selectedWorks.push('work_crm_leads');
  }
  if (text.includes('seo') || text.includes('поиск') || text.includes('яндекс') || text.includes('гугл')) {
    selectedWorks.push('work_seo');
  }
  if (text.includes('аналитик') || text.includes('метрик') || text.includes('цели')) {
    selectedWorks.push('work_analytics');
  }
  // By default include QA for quality assurance
  selectedWorks.push('work_qa_testing');

  // Extract rough project title
  let projectName = 'Цифровой проект для клиента';
  if (text.includes('строительн')) projectName = 'Корпоративный сайт строительной компании';
  else if (text.includes('курсов') || text.includes('школ')) projectName = 'Образовательная веб-платформа';
  else if (text.includes('магазин')) projectName = 'Интернет-магазин с каталогом товаров';
  else if (text.includes('ассистент') || text.includes('бот')) projectName = 'Интеллектуальный Telegram AI-бот';
  else if (text.includes('лендинг')) projectName = 'Конверсионный лендинг продукта';

  const mockParams: ProjectParameters = {
    projectName,
    clientName: 'Потенциальный заказчик',
    projectType,
    pagesCount,
    screensCount,
    componentsCount,
    complexity,
    urgency,
    isStudentTrack,
    selectedWorks,
    notes: rawText,
  };

  const missingSuggestions = detectMissingWorks(rawText, mockParams);

  const explanation = `На основе входящего сообщения определен тип решения "${projectType}" объемом ${pagesCount} стр. и ${screensCount} макетов. Включены ключевые работы по фронтенду, дизайну и интеграциям.`;

  return {
    projectName,
    clientName: 'Новый клиент',
    projectType,
    pagesCount,
    screensCount,
    componentsCount,
    complexity,
    urgency,
    isStudentTrack,
    selectedWorks,
    explanation,
    missingSuggestions,
    source: 'heuristic',
  };
}

/**
 * Intelligent parser using Google Gemini 3.8 Flash SDK when API key is provided,
 * otherwise falling back gracefully to the heuristic parser.
 */
export async function analyzeClientMessageWithAI(
  rawText: string,
  apiKey?: string
): Promise<AIAnalysisResult> {
  if (!apiKey || !apiKey.trim()) {
    return parseClientMessageLocally(rawText);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const prompt = `Ты — ведущий AI-консультант студии Dmitry & Dima.
Твоя задача — проанализировать входящее сообщение клиента и преобразовать его в структурированные параметры для расчета сметы.

Сообщение клиента:
"""
${rawText}
"""

Верни СТРОГО валидный JSON следующей структуры (без лишнего текста вокруг):
{
  "projectName": "краткое название проекта (например: Сайт строительной компании)",
  "clientName": "имя или название клиента, если есть (иначе 'Заказчик')",
  "projectType": "landing" | "corporate" | "ecommerce" | "telegram_bot" | "webapp_mvp" | "ui_ux_design" | "branding",
  "pagesCount": число (целое, минимум 1),
  "screensCount": число (уникальные экраны UI, минимум 1),
  "componentsCount": число (сложные интерактивные модули, калькуляторы, формы),
  "complexity": "simple" | "medium" | "hard",
  "urgency": "normal" | "fast" | "urgent",
  "isStudentTrack": true/false (если упоминается учеба, студенты, волонтерство),
  "selectedWorkKeys": ["work_ui_design", "work_frontend", "work_responsive", "work_animations", "work_backend", "work_database", "work_auth", "work_cms", "work_crm_leads", "work_payments", "work_external_api", "work_seo", "work_analytics", "work_qa_testing"],
  "explanation": "краткое профессиональное объяснение на 2 предложения, почему выбраны именно такие параметры"
}`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });
    } catch (modelErr) {
      // Fallback to latest flash alias if needed
      response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
      });
    }

    const outputText = response.text || '';
    const cleanJson = outputText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const mockParams: ProjectParameters = {
      projectName: parsed.projectName || 'Новый проект',
      clientName: parsed.clientName || 'Заказчик',
      projectType: parsed.projectType || 'landing',
      pagesCount: Number(parsed.pagesCount) || 1,
      screensCount: Number(parsed.screensCount) || 1,
      componentsCount: Number(parsed.componentsCount) || 2,
      complexity: parsed.complexity || 'medium',
      urgency: parsed.urgency || 'normal',
      isStudentTrack: Boolean(parsed.isStudentTrack),
      selectedWorks: Array.isArray(parsed.selectedWorkKeys) ? parsed.selectedWorkKeys : [],
      notes: rawText,
    };

    const missingSuggestions = detectMissingWorks(rawText, mockParams);

    return {
      projectName: parsed.projectName || 'Новый проект',
      clientName: parsed.clientName || 'Заказчик',
      projectType: parsed.projectType || 'landing',
      pagesCount: Number(parsed.pagesCount) || 1,
      screensCount: Number(parsed.screensCount) || 1,
      componentsCount: Number(parsed.componentsCount) || 2,
      complexity: parsed.complexity || 'medium',
      urgency: parsed.urgency || 'normal',
      isStudentTrack: Boolean(parsed.isStudentTrack),
      selectedWorks: mockParams.selectedWorks,
      explanation: parsed.explanation || 'Параметры успешно извлечены нейросетью Gemini.',
      missingSuggestions,
      source: 'gemini',
    };
  } catch (error) {
    console.warn('Gemini API call failed, falling back to local heuristic parser:', error);
    const fallback = parseClientMessageLocally(rawText);
    return fallback;
  }
}

/**
 * Validate and test a Gemini API key by making a minimal ping request
 */
export async function testGeminiApiKey(
  apiKey: string
): Promise<{ success: boolean; message: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'Ключ не введен' };
  }
  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    let res;
    try {
      res = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping',
      });
    } catch (e) {
      res = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: 'Ping',
      });
    }

    if (res && res.text) {
      return { success: true, message: 'Ключ валиден! Соединение с Google Gemini успешно установлено.' };
    }
    return { success: true, message: 'Соединение установлено успешно.' };
  } catch (err: any) {
    const errorMsg = err?.message || String(err);
    if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('400') || errorMsg.includes('403')) {
      return { success: false, message: 'Неверный или неактивный API ключ (получите ключ на aistudio.google.com)' };
    }
    return { success: false, message: `Ошибка API: ${errorMsg.slice(0, 120)}` };
  }
}

