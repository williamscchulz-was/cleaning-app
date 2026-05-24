import { useMemo } from 'react';
import { Check, ChevronLeft, Sparkles } from 'lucide-react';
import { ProgressBar, TitleHeader } from '../components/ui';
import TaskRow from '../components/TaskRow';
import { AREAS, PEOPLE } from '../lib/constants';
import { formatDateBR } from '../lib/dates';

// Shared "today" view. Used by:
// - Simone (always sees her own assigned tasks)
// - Admin "Minhas tarefas" (sees tasks assigned to their role)
// - Admin "Espiar Simone" (read-only, assignedToRole='simone')
export default function TodayScreen({
  items,
  assignedToRole,
  onToggle,
  onSkipRequest,
  readOnly = false,
  title,
  onBack,
}) {
  const today = useMemo(() => new Date(), []);
  const date = useMemo(() => formatDateBR(today), [today]);

  // Only consider tasks for this role.
  const scoped = useMemo(
    () => items.filter(({ task }) => task.assignedTo === assignedToRole),
    [items, assignedToRole],
  );

  // Due-and-not-skipped OR already done today (kept so user can untoggle).
  const visible = useMemo(
    () => scoped.filter(({ isDue, doneToday, skippedToday }) =>
      (isDue && !skippedToday) || doneToday,
    ),
    [scoped],
  );

  const total = visible.length;
  const done = visible.filter((i) => i.doneToday).length;
  const remaining = total - done;
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);

  // Group by area; tasks with multiple areas appear in each.
  const grouped = useMemo(() => {
    const g = {};
    visible.forEach((it) => {
      const areas = it.task.areas?.length ? it.task.areas : ['—'];
      areas.forEach((a) => { (g[a] ||= []).push(it); });
    });
    return Object.entries(g).sort(([a], [b]) => AREAS.indexOf(a) - AREAS.indexOf(b));
  }, [visible]);

  const person = PEOPLE[assignedToRole];
  const resolvedTitle = title ?? 'Tarefas';

  return (
    <div className="pb-12">
      {onBack && (
        <div className="px-3 pt-2">
          <button onClick={onBack} className="flex items-center gap-1 px-1 h-9 rounded-full active:scale-95 transition txt-accent">
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span className="text-[15px] font-medium">Início</span>
          </button>
        </div>
      )}

      <TitleHeader
        kicker={`${date.weekday}, ${date.day} de ${date.month}`}
        title={resolvedTitle}
      />

      {total > 0 && (
        <div className="px-5 mt-3 flex items-center gap-3">
          <div className="flex-1">
            <ProgressBar pct={pct} />
          </div>
          <span className="text-[14px] tabular-nums font-medium txt-muted shrink-0">
            {done}/{total}
          </span>
        </div>
      )}

      <div className="space-y-7 mt-7 pb-2">
        {grouped.map(([area, areaItems]) => {
          const areaDone = areaItems.filter((i) => i.doneToday).length;
          return (
            <section key={area} className="px-4 fade-slide">
              <div className="flex items-baseline justify-between px-4 mb-1.5">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider txt-muted">
                  {area}
                </h3>
                <span className="text-[12px] tabular-nums txt-muted">
                  {areaDone}/{areaItems.length}
                </span>
              </div>
              <div className="surf-card rounded-xl overflow-hidden">
                {areaItems.map(({ task, doneToday }, i) => (
                  <TaskRow
                    key={task.id + '@' + area}
                    task={task}
                    done={doneToday}
                    onToggle={readOnly ? undefined : () => onToggle?.(task.id)}
                    onSkip={readOnly || !onSkipRequest ? undefined : () => onSkipRequest(task)}
                    isLast={i === areaItems.length - 1}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {grouped.length === 0 && (
          <div className="px-5 pt-12 text-center">
            <div className="w-14 h-14 rounded-full surf-accent-soft mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6 txt-accent" strokeWidth={2} />
            </div>
            <p className="text-[18px] font-semibold mt-3">
              Dia tranquilo
            </p>
            <p className="text-[14px] txt-muted mt-1">
              {person ? `Nada pendente pra ${person.name} hoje` : 'Nada pendente hoje'}
            </p>
          </div>
        )}

        {total > 0 && remaining === 0 && (
          <div className="px-5 mt-2 text-center fade-slide">
            <div className="w-14 h-14 rounded-full surf-accent mx-auto flex items-center justify-center">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
            <p className="text-[20px] font-bold mt-3 txt-primary">
              Tudo prontinho!
            </p>
            <p className="text-[14px] txt-muted mt-1 px-6">
              {assignedToRole === 'simone'
                ? 'Obrigado, Simone — a casa fica linda quando você passa.'
                : 'Tudo em dia por hoje.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
