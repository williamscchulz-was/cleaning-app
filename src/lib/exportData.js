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

// Build a WhatsApp-friendly plain-text version of the list. Uses WhatsApp
// markdown (*bold*) and a white-box emoji as a checkbox so it reads cleanly
// right inside the chat — no download needed.
export function buildDailyText({ dateLabel, note, groups, assigneeName = 'Simone' }) {
  const lines = [];
  lines.push('*Tarefas do dia* 🧹');
  lines.push(dateLabel);
  if (note && note.trim()) {
    lines.push('');
    lines.push(note.trim());
  }
  for (const [area, items] of groups) {
    lines.push('');
    lines.push(`*${area.toUpperCase()}*`);
    for (const t of items) {
      lines.push(`◻️ ${t.name}`);
      if (t.notes) lines.push(`     ↳ ${t.notes}`);
    }
  }
  const count = groups.reduce((n, [, items]) => n + items.length, 0);
  lines.push('');
  lines.push(`_${count} ${count === 1 ? 'tarefa' : 'tarefas'} pra hoje · enviado pelo Lumen 💜_`);
  return lines.join('\n');
}

// Share plain text. On mobile, the native sheet lets you pick WhatsApp and
// the text lands in the message. Falls back to a wa.me link (opens WhatsApp
// Web / app with the text prefilled), then to clipboard.
// Returns 'shared' | 'whatsapp' | 'copied' | 'cancelled' | 'failed'.
export async function shareTextMessage(text) {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text });
      return 'shared';
    } catch (err) {
      if (err?.name === 'AbortError') return 'cancelled';
      // fall through
    }
  }
  try {
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const w = window.open(url, '_blank', 'noopener');
    if (w) return 'whatsapp';
  } catch {}
  try {
    await navigator.clipboard.writeText(text);
    return 'copied';
  } catch {
    return 'failed';
  }
}
