import { ProjectParameters } from '../types/pricing';

export interface MissingWorkSuggestion {
  workItemId: string;
  title: string;
  reason: string;
  actionText: string;
}

export function detectMissingWorks(
  text: string,
  params: ProjectParameters
): MissingWorkSuggestion[] {
  const lower = text.toLowerCase();
  const suggestions: MissingWorkSuggestion[] = [];

  // Check 1: Catalog / Blog / News mentioned, but no CMS selected
  const mentionsCatalogOrBlog =
    lower.includes('каталог') ||
    lower.includes('товары') ||
    lower.includes('блог') ||
    lower.includes('статьи') ||
    lower.includes('объект') ||
    lower.includes('новости');
  if (mentionsCatalogOrBlog && !params.selectedWorks.includes('work_cms')) {
    suggestions.push({
      workItemId: 'work_cms',
      title: 'Панель управления (CMS)',
      reason:
        'В описании упоминается динамический контент (каталог / блог / объекты), но CMS не выбрана. Без админки заказчику придется обращаться к программисту для каждой правки.',
      actionText: '+ Добавить CMS в смету (+15 000 ₽)',
    });
  }

  // Check 2: Mentions online sales / payments / orders, but no payments selected
  const mentionsPayments =
    lower.includes('оплат') ||
    lower.includes('купить') ||
    lower.includes('эквайринг') ||
    lower.includes('корзин') ||
    lower.includes('юkassa') ||
    lower.includes('чек');
  if (mentionsPayments && !params.selectedWorks.includes('work_payments')) {
    suggestions.push({
      workItemId: 'work_payments',
      title: 'Интеграция онлайн-оплаты',
      reason:
        'Клиент планирует принимать деньги онлайн. Требуется настройка защищенного платежного шлюза, фискализация и вебхуки.',
      actionText: '+ Подключить онлайн-оплату (+18 000 ₽)',
    });
  }

  // Check 3: Mentions personal cabinet / users / roles, but no auth selected
  const mentionsAuth =
    lower.includes('кабинет') ||
    lower.includes('профиль') ||
    lower.includes('авторизац') ||
    lower.includes('вход') ||
    lower.includes('роли') ||
    lower.includes('ученик');
  if (mentionsAuth && !params.selectedWorks.includes('work_auth')) {
    suggestions.push({
      workItemId: 'work_auth',
      title: 'Авторизация и личные кабинеты',
      reason:
        'Проект предполагает разграничение доступа пользователей или личные профили. Необходим защищенный модуль аутентификации (JWT/OAuth).',
      actionText: '+ Добавить модуль авторизации (+16 000 ₽)',
    });
  }

  // Check 4: Commercial landing/corporate without analytics
  const isCommercial =
    params.projectType === 'landing' ||
    params.projectType === 'corporate' ||
    params.projectType === 'ecommerce';
  if (isCommercial && !params.selectedWorks.includes('work_analytics')) {
    suggestions.push({
      workItemId: 'work_analytics',
      title: 'Настройка веб-аналитики (Яндекс Метрика + цели)',
      reason:
        'Для коммерческого проекта критично измерять стоимость лида и конверсию кнопок, иначе бюджет на рекламу будет расходоваться вслепую.',
      actionText: '+ Добавить аналитику (+6 000 ₽)',
    });
  }

  // Check 5: Fast deadline without QA testing
  if (
    (params.urgency === 'fast' || params.urgency === 'urgent') &&
    !params.selectedWorks.includes('work_qa_testing')
  ) {
    suggestions.push({
      workItemId: 'work_qa_testing',
      title: 'Комплексное QA-тестирование',
      reason:
        'При сжатых сроках риск пропустить баг на разных диагоналях смартфонов возрастает в 3 раза. Необходим обязательный этап приемки.',
      actionText: '+ Включить QA-тестирование (+9 000 ₽)',
    });
  }

  return suggestions;
}
