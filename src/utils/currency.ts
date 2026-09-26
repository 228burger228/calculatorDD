/**
 * Format numbers as clean Russian Rubles: 147 000 ₽ or 147k ₽
 */
export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return new Intl.NumberFormat('ru-RU').format(rounded) + ' ₽';
}

/**
 * Format short representation: 147k ₽ or 1.2M ₽
 */
export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1).replace('.0', '') + 'M ₽';
  }
  if (amount >= 1_000) {
    return Math.round(amount / 1_000) + 'k ₽';
  }
  return formatCurrency(amount);
}

/**
 * Helper to pluralize days in Russian: 1 рабочий день, 4 рабочих дня, 10 рабочих дней
 */
export function pluralizeDays(days: number): string {
  const abs = Math.abs(days) % 100;
  const num = abs % 10;
  if (abs > 10 && abs < 20) return `${days} рабочих дней`;
  if (num > 1 && num < 5) return `${days} рабочих дня`;
  if (num === 1) return `${days} рабочий день`;
  return `${days} рабочих дней`;
}
