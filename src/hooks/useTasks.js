import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AREAS, LEGACY_AREA_MAP } from '../lib/constants';

// Reads in either old or new shape; the rest of the app only sees the
// normalized shape (`areas: string[]`, `assignedTo: string`).
function normalize(raw) {
  let areas = Array.isArray(raw.areas)
    ? raw.areas
    : raw.area
      ? [raw.area]
      : [];
  areas = areas.map((a) => LEGACY_AREA_MAP[a] || a).filter((a) => AREAS.includes(a));
  // De-dupe in case legacy mapping collapses two old areas into one.
  areas = Array.from(new Set(areas));
  return {
    ...raw,
    areas,
    assignedTo: raw.assignedTo || 'simone',
  };
}

// Returns active tasks (active === true). Re-renders on any change.
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), where('active', '==', true));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => normalize({ id: d.id, ...d.data() }));
        setTasks(items);
        setLoading(false);
      },
      (err) => {
        console.error('useTasks snapshot failed', err);
        setLoading(false);
      },
    );
    return unsub;
  }, []);

  return { tasks, loading };
}
