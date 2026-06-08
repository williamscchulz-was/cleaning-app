import { AREAS, FREQUENCIES } from './constants';
import { formatDateBR } from './dates';

// Light, dependency-free helpers (no jsPDF) so the export sheet can show the
// summary without pulling the heavy PDF lib. The jsPDF renderer lives in
// exportPdf.js and is dynamically imported only when the user exports.

// Tasks assigned to `role` that are due today and not yet done/skipped,
// grouped by area (a multi-area task appears in each of its areas).
export function buildExportGroups(items, role = 'simone') {
  const pending = items.filter(
    ({ task, isDue, doneToday, skippedToday }) =>
      task.assignedTo === role && isDue && !doneToday && !skippedToday,
  );
  const byArea = {};
  pending.forEach(({ task }) => {
    const areas = task.areas?.length ? task.areas : ['Geral'];
    areas.forEach((a) => {
      (byArea[a] ||= []).push({
        name: task.name,
        freq: FREQUENCIES[task.frequencyKey]?.label ?? '',
        notes: task.notes || '',
      });
    });
  });
  const groups = Object.entries(byArea).sort(
    ([a], [b]) => AREAS.indexOf(a) - AREAS.indexOf(b),
  );
  return { groups, count: pending.length };
}

export function todayLabel(d = new Date()) {
  const f = formatDateBR(d);
  return `${f.weekday}, ${f.day} de ${f.month}`;
}

export function pdfFilename(d = new Date()) {
  const iso = d.toISOString().slice(0, 10);
  return `Tarefas Simone ${iso}.pdf`;
}
