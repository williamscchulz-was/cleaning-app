import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TitleHeader } from '../components/ui';
import { FREQUENCIES } from '../lib/constants';
import { formatDateBR, startOfWeek } from '../lib/dates';

// A task was "expected" in a given week if, at the start of that week:
//   1. It already existed (createdAt < weekStart), AND
//   2. Its previous acknowledgement (done OR skipped) was older than its
//      frequency cycle — i.e., it would have shown up as due that Monday.
// This is the same definition as the live `isDue` used in TodayScreen,
// just evaluated at a historical point in time.
function wasExpectedInWeek(task, completionsForTask, weekStart) {
  const createdAtMs = task.createdAt?.toDate?.()?.getTime?.() ?? 0;
  if (createdAtMs >= weekStart.getTime()) return false;

  const prior = completionsForTask
    .filter((c) => c.performedAt && c.performedAt < weekStart)
    .reduce((latest, c) => (!latest || c.performedAt > latest.performedAt ? c : latest), null);

  const cycleMs = (FREQUENCIES[task.frequencyKey]?.weeks ?? 1) * 7 * 86400000;
  if (!prior) return true; // never acknowledged before this week
  return weekStart.getTime() - prior.performedAt.getTime() >= cycleMs;
}

function buildWeeks(completions, tasks, weeks = 12) {
  const today = new Date();

  // Index completions by taskId once.
  const byTask = new Map();
  for (const c of completions) {
    if (!byTask.has(c.taskId)) byTask.set(c.taskId, []);
    byTask.get(c.taskId).push(c);
  }

  const result = [];
  for (let i = 0; i < weeks; i++) {
    const monday = startOfWeek(today);
    monday.setDate(monday.getDate() - i * 7);
    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);

    const expectedIds = new Set(
      tasks
        .filter((t) => wasExpectedInWeek(t, byTask.get(t.id) || [], monday))
        .map((t) => t.id),
    );

    const doneTaskIds = new Set(
      completions
        .filter((c) =>
          c.status === 'done' &&
          c.performedAt && c.performedAt >= monday && c.performedAt < nextMonday,
        )
        .map((c) => c.taskId),
    );

    const total = expectedIds.size;
    const done = [...doneTaskIds].filter((id) => expectedIds.has(id)).length;

    result.push({ date: monday, count: done, total });
  }

  // Trim trailing weeks with nothing expected and nothing done.
  while (result.length > 1) {
    const tail = result[result.length - 1];
    if (tail.total === 0 && tail.count === 0) result.pop();
    else break;
  }
  return result;
}

export default function Historico({ completions, tasks, onBack }) {
  const history = useMemo(() => buildWeeks(completions, tasks, 12), [completions, tasks]);
  const empty = history.every((h) => h.count === 0 && h.total === 0);

  return (
    <div className="pb-8">
      <div className="px-3 pt-2">
        <button onClick={onBack} className="flex items-center gap-1 px-1 h-9 rounded-full active:scale-95 transition txt-accent">
          <ChevronLeft size={20} strokeWidth={2.5} />
          <span className="text-[15px] font-medium">Início</span>
        </button>
      </div>

      <TitleHeader
        kicker="Últimas segundas-feiras"
        title="Histórico"
      />

      {empty ? (
        <div className="px-5 pt-12 text-center">
          <p className="text-[16px] font-semibold txt-primary">
            Nada por aqui ainda
          </p>
          <p className="text-[13px] txt-muted mt-1.5">
            Conforme as tarefas forem sendo feitas, o histórico vai aparecer.
          </p>
        </div>
      ) : (
        <div className="px-4 mt-5 space-y-2.5">
          {history.map((h, i) => {
            const f = formatDateBR(h.date);
            const allDone = h.total > 0 && h.count === h.total;
            return (
              <div
                key={h.date.toISOString()}
                className="surf-card rounded-xl p-3.5 flex items-center gap-4 shadow-sm-token fade-slide"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="w-12 h-12 rounded-lg surf-accent-soft flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase tracking-wider txt-accent font-bold leading-none">
                    {f.month.slice(0, 3)}
                  </span>
                  <span className="text-[18px] font-bold leading-none mt-0.5 tabular-nums txt-primary">
                    {f.day}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold txt-primary">
                    {f.weekday}
                  </div>
                  <div className="text-[13px] txt-muted mt-0.5">
                    {h.count} de {h.total} feitas {allDone && '· ✓'}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 txt-subtle" strokeWidth={2} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
