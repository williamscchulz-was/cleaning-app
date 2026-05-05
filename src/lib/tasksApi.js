import {
  addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export async function createTask({ name, area, frequencyKey, notes, uid }) {
  return addDoc(collection(db, 'tasks'), {
    name,
    area,
    frequencyKey,
    notes: notes || '',
    createdBy: uid,
    createdAt: serverTimestamp(),
    active: true,
  });
}

export async function updateTask(taskId, { name, area, frequencyKey, notes }) {
  return updateDoc(doc(db, 'tasks', taskId), {
    name,
    area,
    frequencyKey,
    notes: notes || '',
  });
}

// Soft delete — preserves completion history
export async function deactivateTask(taskId) {
  return updateDoc(doc(db, 'tasks', taskId), { active: false });
}

export async function markCompletion({ taskId, status, uid }) {
  return addDoc(collection(db, 'completions'), {
    taskId,
    status, // 'done' | 'skipped'
    performedAt: serverTimestamp(),
    performedBy: uid,
  });
}

export async function deleteCompletion(completionId) {
  return deleteDoc(doc(db, 'completions', completionId));
}
