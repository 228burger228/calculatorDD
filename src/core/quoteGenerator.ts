import { ProjectParameters, CalculationResult } from '../types/pricing';
import { ALL_WORK_ITEMS } from '../config/defaultPricing';
import { DMITRY_DIMA_STUDIO } from '../types/studio';
import { formatCurrency, pluralizeDays } from '../utils/currency';
import { getProjectTypeName } from './pricingEngine';

export interface GeneratedQuote {
  plainText: string;
  markdown: string;
  telegramText: string;
  summary: {
    title: string;
    client: string;
    investment: string;
    range: string;
    timeline: string;
    scope: string[];
    stages: string[];
  };
}

export function generateClientQuote(
  params: ProjectParameters,
  result: CalculationResult
): GeneratedQuote {
  const selectedWorks = ALL_WORK_ITEMS.filter((item) =>
    params.selectedWorks.includes(item.id)
  );

  const projectName = params.projectName.trim() || 'Разработка цифрового продукта';
  const clientName = params.clientName.trim() || 'Партнер';
  const projectTypeName = getProjectTypeName(params.projectType);
  const investment = formatCurrency(result.finalPrice);
  const range = `${formatCurrency(result.rangeMin)} — ${formatCurrency(result.rangeMax)}`;
  const timeline = `${result.estimatedDays.min}–${result.estimatedDays.max} ${pluralizeDays(result.estimatedDays.max).split(' ').slice(1).join(' ')}`;

  const deliverables: string[] = [
    `Тип решения: ${projectTypeName}`,
    params.pagesCount > 1 ? `Количество уникальных страниц/разделов: ${params.pagesCount}` : `Одностраничный конверсионный формат (Landing)`,
    `Адаптивная верстка: смартфоны, планшеты и десктоп`,
    ...selectedWorks.map((w) => w.name),
  ];

  const stages: string[] = [
    'Этап 1: Экспресс-бриф, структура и фиксация ТЗ (1–2 дня)',
    'Этап 2: Проектирование и авторский дизайн в Figma (спринт дизайна)',
    'Этап 3: Чистая фронтенд/бэкенд разработка и интеграция сервисов',
    'Этап 4: Комплексное тестирование, деплой на боевой сервер и передача исходников',
  ];

  // Telegram formatted text (Clean markdown with emojis and Business Cool tone)
  const studentNotice = params.isStudentTrack
    ? `\n🎓 *Специальные условия:* применен студенческий трек (разработка по себестоимости без коммерческой наценки студии).\n`
    : '';

  const telegramText = `⚡️ *Предложение по разработке проекта*
*Проект:* ${projectName}
*Клиент:* ${clientName}
${studentNotice}
💼 *Что входит в решение:*
${deliverables.map((d) => `• ${d}`).join('\n')}

⏱ *Сроки реализации:* ${timeline}
💰 *Инвестиция в проект:* ${investment} _(ориентировочный диапазон: ${range})_

🛡 *Принципы и условия студии Dmitry & Dima:*
• Поэтапная оплата по спринтам после демонстрации результатов каждого этапа
• Фиксированная цена закрепляется до старта работ и не растет в процессе
• Чистый код без лишних конструкторов, моментальная скорость загрузки
• Официальный договор / чеки самозанятого

🔗 *Портфолио и кейсы:* ${DMITRY_DIMA_STUDIO.portfolioUrl}
💬 *Для запуска и обсуждения деталей:* ${DMITRY_DIMA_STUDIO.leadDmitry.telegram} (Дмитрий)`;

  // Full Markdown document suitable for export or reading
  const markdown = `# Коммерческое предложение: ${projectName}
**Клиент:** ${clientName}  
**Исполнитель:** ${DMITRY_DIMA_STUDIO.name}  
**Ведущий лид:** ${DMITRY_DIMA_STUDIO.leadDmitry.name} (${DMITRY_DIMA_STUDIO.leadDmitry.telegram})  
**Дата расчета:** ${new Date().toLocaleDateString('ru-RU')}  

---

## 1. Концепция и состав решения

${deliverables.map((d) => `- **${d}**`).join('\n')}

---

## 2. Стоимость и сроки реализации

- **Рекомендуемый бюджет проекта:** **${investment}**
- **Рабочий диапазон сметы:** ${range}
- **Срок выполнения под ключ:** ${timeline}

> **Манифест студии:** *«${DMITRY_DIMA_STUDIO.manifest}»*

---

## 3. Этапы реализации (Спринты)

${stages.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

## 4. Гарантии и финансовые условия

1. **Оплата строго по спринтам:** расчет производится поэтапно после демонстрации рабочего результата каждого этапа.
2. **Фиксированная смета:** стоимость закрепляется до старта и не пересматривается в одностороннем порядке.
3. **Чистый результат:** передача всех макетов Figma, исходного кода репозитория и доступов к хостингу.

Для старта работы напишите Дмитрию в Telegram: **[${DMITRY_DIMA_STUDIO.leadDmitry.telegram}](https://t.me/${DMITRY_DIMA_STUDIO.leadDmitry.telegram.replace('@', '')})**.
`;

  return {
    plainText: telegramText.replace(/[*_]/g, ''),
    markdown,
    telegramText,
    summary: {
      title: projectName,
      client: clientName,
      investment,
      range,
      timeline,
      scope: deliverables,
      stages,
    },
  };
}
