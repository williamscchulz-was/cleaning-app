import { useMemo } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { ProgressBar, TitleHeader } from '../components/ui';
import TaskRow from '../components/TaskRow';
import { AREAS } from '../lib/constants';
import { formatDateBR } from '../lib/dates';

export default function SimoneToday({ items, onToggle, onSkipRequest, readOnly = false }) {
  const today = useMemo(() => new Date(), []);
  const date = useMemo(() => formatDateBR(today), [today]);

  const visible = useMemo(
    () => items.filter(({ isDue, doneToday, skippedToday }) =>
      (isDue && !skippedToday) || doneToday,
    ),
    [items],
  );

  const total = visible.length;
  const done = visible.filter((i) => i.doneToday).length;
  const remaining = total - done;
  const pct = total === 0 ? 100 : Math.round((done / total) * 100);

  const grouped = useMemo(() => {
    const g = {};
    visible.forEach((it) => { (g[it.task.area] ||= []).push(it); });
    return Object.entries(g).sort(
      ([a], [b]) => AREAS.indexOf(a) - AREAS.indexOf(b),
    );
  }, [visible]);

  return (
    <div className="pb-12">
      <TitleHeader
        kicker={`${date.weekday}, ${date.day} de ${date.month}`}
        title="Tarefas"
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
                    key={task.id}
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
              Nada pendente hoje
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
              Obrigado, Simone — a casa fica linda quando você passa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
