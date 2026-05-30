import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, Sparkles } from 'lucide-react';
import { ProgressBar, TitleHeader } from '../components/ui';
import TaskRow from '../components/TaskRow';
import AnimatedNumber from '../components/AnimatedNumber';
import Celebration from '../components/Celebration';
import { AREAS, PEOPLE } from '../lib/constants';
import { formatDateBR } from '../lib/dates';
import { haptics } from '../lib/haptics';

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

  const scoped = useMemo(
    () => items.filter(({ task }) => task.assignedTo === assignedToRole),
    [items, assignedToRole],
  );

  const visible = useMemo(
    () => scoped.filter(({ isDue, doneToday, skippedToday }) =>
      (isDue && !skippedToday) || doneToday,
    ),
    [scoped],
  );

  const total = visible.length;
  const done = visible.filter((i) => i.doneToday).length;
  const remaining = total - done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  const grouped = useMemo(() => {
    const g = {};
    visible.forEach((it) => {
      const areas = it.task.areas?.length ? it.task.areas : ['—'];
      areas.forEach((a) => { (g[a] ||= []).push(it); });
    });
    return Object.entries(g).sort(([a], [b]) => AREAS.indexOf(a) - AREAS.indexOf(b));
  }, [visible]);

  // Celebration: fire once when remaining transitions to 0 with tasks present.
  const [celebrateKey, setCelebrateKey] = useState(0);
  const prevRemaining = useRef(remaining);
  useEffect(() => {
    if (readOnly) return;
    if (prevRemaining.current > 0 && remaining === 0 && total > 0) {
      setCelebrateKey((k) => k + 1);
      haptics.success();
    }
    prevRemaining.current = remaining;
  }, [remaining, total, readOnly]);

  const person = PEOPLE[assignedToRole];
  const resolvedTitle = title ?? 'Tarefas';

  return (
    <div className="pb-12">
      {celebrateKey > 0 && <Celebration key={celebrateKey} />}

      {onBack && (
        <div className="px-3 pt-2">
          <button onClick={onBack} className="pressable flex items-center gap-1 px-1 h-9 rounded-full txt-accent">
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
          <span className="text-[14px] tabular-nums font-semibold txt-muted shrink-0">
            <AnimatedNumber value={done} />/{total}
          </span>
        </div>
      )}

      <div className="space-y-7 mt-7 pb-2 stagger">
        {grouped.map(([area, areaItems], gi) => {
          const areaDone = areaItems.filter((i) => i.doneToday).length;
          const allAreaDone = areaDone === areaItems.length;
          return (
            <section key={area} className="px-4" style={{ '--i': gi }}>
              <div className="flex items-baseline justify-between px-4 mb-1.5">
                <h3 className="text-[13px] font-semibold uppercase tracking-wider txt-muted">
                  {area}
                </h3>
                <span
                  className="text-[12px] tabular-nums shrink-0 transition-colors"
                  style={{ color: allAreaDone ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {areaDone}/{areaItems.length}{allAreaDone ? ' ✓' : ''}
                </span>
              </div>
              <div className="surf-card rounded-xl overflow-hidden shadow-sm-token">
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
          <div className="px-5 pt-12 text-center fade-slide">
            <div className="w-16 h-16 rounded-2xl surf-accent-soft mx-auto flex items-center justify-center">
              <Sparkles className="w-7 h-7 txt-accent" strokeWidth={2} />
            </div>
            <p className="text-[19px] font-bold mt-4 txt-primary">
              Dia tranquilo
            </p>
            <p className="text-[14px] txt-muted mt-1">
              {person ? `Nada pendente pra ${person.name} hoje` : 'Nada pendente hoje'}
            </p>
          </div>
        )}

        {total > 0 && remaining === 0 && (
          <div className="px-5 mt-2 text-center fade-slide">
            <div
              className="w-16 h-16 rounded-2xl surf-accent mx-auto flex items-center justify-center"
              style={{ boxShadow: '0 12px 28px -8px var(--accent)' }}
            >
              <Check className="w-8 h-8 text-white check-pop" strokeWidth={3} />
            </div>
            <p className="text-[22px] font-bold mt-4 txt-primary">
              Tudo prontinho! 🎉
            </p>
            <p className="text-[14px] txt-muted mt-1 px-6 leading-relaxed">
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
