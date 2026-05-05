import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Returns active tasks (active === true). Re-renders on any change.
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tasks'), where('active', '==', true));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
