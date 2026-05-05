import { useMemo } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { FREQUENCIES } from '../lib/constants';
import { daysBetween, formatDateBR, startOfWeek } from '../lib/dates';

// Group completions by Monday-week. For each week, count distinct done tasks
// vs the number of tasks that were due that week.
// "Due that week" = task whose freqWeeks puts a cycle end on or before that Monday.
// Approximation: any active task counts as due if (weeks since createdAt) % freq === 0
// — but we don't reliably have createdAt timing. Simpler: "total" = #active tasks in the week
// whose frequency.weeks divides the # of weeks ago.
// For now we use: total = unique tasks with at least one expected occurrence in that week,
// approximated as all active tasks whose freqWeeks <= weeksAgo+1. This isn't perfect
// but it's a reasonable display until we track per-task cycle state explicitly.
function buildWeeks(completions, tasks, weeks = 12) {
  const today = new Date();
  const result = [];

  for (let i = 0; i < weeks; i++) {
    const monday = startOfWeek(today);
    monday.setDate(monday.getDate() - i * 7);
    const nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);

    const weekCompletions = completions.filter(
      (c) => c.performedAt && c.performedAt >= monday && c.performedAt < nextMonday,
    );
    const doneTaskIds = new Set(
      weekCompletions.filter((c) => c.status === 'done').map((c) => c.taskId),
    );
    // Total tasks expected this week: any active task whose cycle aligns with `i` weeks ago.
    // Cycle "i" hits when i % freqWeeks === 0. Trimestral (12) hits only on the oldest Monday.
    const expectedIds = new Set(
      tasks
        .filter((t) => {
          const w = FREQUENCIES[t.frequencyKey]?.weeks ?? 1;
          return i % w === 0;
        })
        .map((t) => t.id),
    );
    const total = expectedIds.size;
    const done = [...doneTaskIds].filter((id) => expectedIds.has(id)).length;

    result.push({ date: monday, count: done, total });
  }

  // Drop empty trailing weeks (no expectations and no completions) only at the end.
  while (result.length > 1) {
    const tail = result[result.length - 1];
    if (tail.total === 0 && tail.count === 0) result.pop();
    else break;
  }
  return result;
}

export default function Historico({ completions, tasks, onBack }) {
  const history = useMemo(() => buildWeeks(completions, tasks, 12), [completions, tasks]);

  return (
    <>
      <div className="surf-accent px-5 pt-2 pb-7">
        <button
          onClick={onBack}
          className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full active:bg-white/10 transition"
        >
          <ArrowLeft className="w-5 h-5 text-white" strokeWidth={2.2} />
        </button>
        <div className="mt-5">
          <div className="font-display font-extrabold text-white text-[24px] leading-tight">
            Histórico
          </div>
          <div className="font-body text-white/85 text-[14px] mt-0.5">
            Últimas segundas-feiras
          </div>
        </div>
      </div>

      {history.every((h) => h.count === 0 && h.total === 0) ? (
        <div className="px-5 pt-12 text-center">
          <p className="font-display font-bold text-[16px] txt-primary">
            Nada por aqui ainda
          </p>
          <p className="font-body text-[13px] txt-muted mt-1.5">
            Conforme as tarefas forem sendo feitas, o histórico vai aparecer.
          </p>
        </div>
      ) : (
        <div className="px-5 pt-5 pb-24 space-y-3">
          {history.map((h, i) => {
            const f = formatDateBR(h.date);
            const allDone = h.total > 0 && h.count === h.total;
            return (
              <div
                key={h.date.toISOString()}
                className="surf-card rounded-2xl shadow-card p-4 flex items-center gap-4 fade-slide"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="w-12 h-12 rounded-xl surf-tint flex flex-col items-center justify-center shrink-0">
                  <span className="font-body text-[10px] uppercase tracking-wider txt-accent font-bold leading-none">
                    {f.month.slice(0, 3)}
                  </span>
                  <span className="font-display font-extrabold txt-primary text-[18px] leading-none mt-0.5 tnum">
                    {f.day}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-[15px] txt-primary">
                    {f.weekday}
                  </div>
                  <div className="font-body text-[13px] txt-muted mt-0.5">
                    {h.count} de {h.total} feitas {allDone && '·  ✓'}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 txt-subtle" strokeWidth={2} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
