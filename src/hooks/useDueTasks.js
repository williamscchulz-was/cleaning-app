import { useMemo } from 'react';
import { FREQUENCIES } from '../lib/constants';
import { daysBetween, isSameDay } from '../lib/dates';
import { useTasks } from './useTasks';
import { useCompletions } from './useCompletions';

// Composes tasks + completions into per-task derived state for "today".
// A task is due if its latest completion (done OR skipped) is older than
// frequencyWeeks * 7 days, or if it has never been acknowledged.
export function useDueTasks() {
  const { tasks, loading: tLoading } = useTasks();
  const { completions, loading: cLoading } = useCompletions(120);

  const today = useMemo(() => new Date(), []);

  const items = useMemo(() => {
    const lastByTask = new Map();
    for (const c of completions) {
      if (!c.performedAt) continue;
      const prev = lastByTask.get(c.taskId);
      if (!prev || c.performedAt > prev.performedAt) {
        lastByTask.set(c.taskId, c);
      }
    }

    return tasks.map((task) => {
      const last = lastByTask.get(task.id) || null;
      const freq = FREQUENCIES[task.frequencyKey];
      const isDue = !last || daysBetween(today, last.performedAt) >= freq.weeks * 7;
      const doneToday   = !!last && last.status === 'done'    && isSameDay(last.performedAt, today);
      const skippedToday= !!last && last.status === 'skipped' && isSameDay(last.performedAt, today);
      return { task, last, isDue, doneToday, skippedToday };
    });
  }, [tasks, completions, today]);

  return {
    items,
    loading: tLoading || cLoading,
    completions,
    tasks,
  };
}
