import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Single source of truth for the current user's identity + role.
// On boot: sign in anonymously (idempotent), watch users/{uid} for role.
// If no user doc exists, role stays null and the app shows PickerScreen.
export function useAuth() {
  const [uid, setUid] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        signInAnonymously(auth).catch((err) => {
          console.error('signInAnonymously failed', err);
          setLoading(false);
        });
      }
    });
    return unsubAuth;
  }, []);

  useEffect(() => {
    if (!uid) return;
    const unsub = onSnapshot(
      doc(db, 'users', uid),
      (snap) => {
        setRole(snap.exists() ? snap.data().role : null);
        setLoading(false);
      },
      (err) => {
        console.error('users/{uid} snapshot failed', err);
        setLoading(false);
      },
    );
    return unsub;
  }, [uid]);

  async function pickRole(nextRole) {
    if (!uid) return;
    await setDoc(doc(db, 'users', uid), {
      role: nextRole,
      createdAt: serverTimestamp(),
    });
  }

  // Clears the role so the picker shows again. We update instead of delete
  // because the security rules only permit create/update on users/{uid}.
  async function clearRole() {
    if (!uid) return;
    await updateDoc(doc(db, 'users', uid), { role: deleteField() });
  }

  return { uid, role, loading, pickRole, clearRole };
}
