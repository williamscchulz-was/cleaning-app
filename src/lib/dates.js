export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const daysBetween = (a, b) =>
  Math.floor((startOfDay(a) - startOfDay(b)) / 86400000);

export const isSameDay = (a, b) =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

export function startOfWeek(d) {
  // Monday-based week start (matches when Simone visits)
  const x = startOfDay(d);
  const dow = x.getDay();
  const diff = (dow + 6) % 7;
  x.setDate(x.getDate() - diff);
  return x;
}

// Human-friendly "tempo desde" (no library). Returns null for null input.
export function relativeFromNow(date) {
  if (!date) return null;
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days < 0) return 'no futuro';
  if (days === 0) return 'hoje';
  if (days === 1) return 'ontem';
  if (days < 7) return `há ${days} dias`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return 'há 1 semana';
  if (weeks < 5) return `há ${weeks} semanas`;
  const months = Math.floor(days / 30);
  if (months === 1) return 'há 1 mês';
  if (months < 12) return `há ${months} meses`;
  const years = Math.floor(days / 365);
  return years === 1 ? 'há 1 ano' : `há ${years} anos`;
}

export function formatDateBR(d) {
  const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('pt-BR', { month: 'long' });
  return {
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1).replace('-feira', ''),
    weekdayShort: weekday.slice(0, 3).toLowerCase(),
    day,
    month: month.charAt(0).toUpperCase() + month.slice(1),
    monthShort: month.slice(0, 3),
  };
}
