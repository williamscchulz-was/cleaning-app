import { useMemo } from 'react';
import { Check, Sparkles } from 'lucide-react';
import NuHeader from '../components/NuHeader';
import TaskRow from '../components/TaskRow';
import { ProgressBar } from '../components/primitives';
import { AREAS, AREA_ICONS, ICON_FALLBACK, PEOPLE } from '../lib/constants';
import { formatDateBR } from '../lib/dates';

// `items` comes from useDueTasks: array of { task, isDue, doneToday, skippedToday }
export default function SimoneToday({ items, onToggle, onSkipRequest, readOnly = false }) {
  const today = useMemo(() => new Date(), []);
  const date = useMemo(() => formatDateBR(today), [today]);

  // Tasks that need attention today: due AND not skipped today.
  // Done-today tasks stay in the list (with check) so Simone can undo.
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

  const subtitle = useMemo(() => {
    if (total === 0) return 'Hoje tá tudo em dia';
    if (done === 0) return `${total} tarefa${total > 1 ? 's' : ''} pra hoje`;
    if (remaining === 0) return 'Tudo prontinho ✨';
    return `Faltam ${remaining} de ${total}`;
  }, [total, done, remaining]);

  return (
    <>
      <NuHeader
        person={PEOPLE.simone}
        subtitle={`${date.weekday}, ${date.day} de ${date.month}`}
      />

      <div className="px-5 -mt-5 fade-slide">
        <div className="surf-card rounded-2xl shadow-card p-5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="font-display font-extrabold text-[26px] txt-primary leading-none tnum">
                {done}<span className="txt-muted font-normal">/{total}</span>
              </div>
              <div className="font-body text-[13px] txt-muted mt-1">
                {subtitle}
              </div>
            </div>
            <div className="font-display font-extrabold txt-accent text-[28px] tnum leading-none">
              {pct}%
            </div>
          </div>
          <div className="mt-4">
            <ProgressBar pct={pct} />
          </div>
        </div>
      </div>

      <div className="pb-10">
        {grouped.map(([area, areaItems], gi) => {
          const Icon = AREA_ICONS[area] || ICON_FALLBACK;
          const allDone = areaItems.every((i) => i.doneToday);
          return (
            <section key={area} className="fade-slide" style={{ animationDelay: `${gi * 40}ms` }}>
              <div className="flex items-center justify-between px-5 mt-7 mb-2.5">
                <div className="flex items-center gap-2">
                  <Icon className="w-[15px] h-[15px] txt-muted" strokeWidth={2.2} />
                  <h3 className="font-display font-extrabold text-[13px] uppercase tracking-wider txt-primary">
                    {area}
                  </h3>
                </div>
                <span className="font-body text-[11.5px] tnum txt-muted font-semibold">
                  {areaItems.filter((i) => i.doneToday).length}/{areaItems.length}{allDone && ' ✓'}
                </span>
              </div>
              <div className="mx-5 surf-card rounded-2xl shadow-card overflow-hidden">
                <ul>
                  {areaItems.map(({ task, doneToday }, i) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      done={doneToday}
                      onToggle={readOnly ? undefined : () => onToggle?.(task.id)}
                      onSkip={readOnly || !onSkipRequest ? undefined : () => onSkipRequest(task)}
                      last={i === areaItems.length - 1}
                    />
                  ))}
                </ul>
              </div>
            </section>
          );
        })}

        {grouped.length === 0 && (
          <div className="px-5 pt-12 text-center">
            <div className="w-14 h-14 rounded-full surf-tint mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6 txt-accent" strokeWidth={2} />
            </div>
            <p className="font-display font-bold text-[18px] txt-primary mt-3">
              Dia tranquilo
            </p>
            <p className="font-body text-[14px] txt-muted mt-1">
              Nada pendente hoje
            </p>
          </div>
        )}

        {total > 0 && remaining === 0 && (
          <div className="px-5 mt-8 text-center fade-slide">
            <div className="w-14 h-14 rounded-full surf-accent mx-auto flex items-center justify-center">
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
            <p className="font-display font-extrabold text-[20px] txt-primary mt-3">
              Tudo prontinho!
            </p>
            <p className="font-body text-[14px] txt-muted mt-1 px-6">
              Obrigado, Simone — a casa fica linda quando você passa por aqui
            </p>
          </div>
        )}
      </div>
    </>
  );
}
