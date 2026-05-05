import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Subscribe to completions in the last `rangeDays` days. Default 90 covers
// the home screen and history view (~12 weeks); plenty for ~30 tasks.
export function useCompletions(rangeDays = 90) {
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - rangeDays);
    d.setHours(0, 0, 0, 0);
    return Timestamp.fromDate(d);
  }, [rangeDays]);

  useEffect(() => {
    const q = query(
      collection(db, 'completions'),
      where('performedAt', '>=', cutoff),
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            performedAt: data.performedAt?.toDate?.() ?? null,
          };
        });
        setCompletions(items);
        setLoading(false);
      },
      (err) => {
        console.error('useCompletions snapshot failed', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [cutoff]);

  return { completions, loading };
}
