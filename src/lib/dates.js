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
