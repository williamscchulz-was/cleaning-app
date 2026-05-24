import {
  addDoc, collection, deleteDoc, doc, serverTimestamp, Timestamp, updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export async function createTask({ name, areas, frequencyKey, notes, assignedTo, uid }) {
  return addDoc(collection(db, 'tasks'), {
    name,
    areas: areas && areas.length ? areas : [],
    frequencyKey,
    notes: notes || '',
    assignedTo: assignedTo || 'simone',
    createdBy: uid,
    createdAt: serverTimestamp(),
    active: true,
  });
}

export async function updateTask(taskId, { name, areas, frequencyKey, notes, assignedTo }) {
  return updateDoc(doc(db, 'tasks', taskId), {
    name,
    areas: areas && areas.length ? areas : [],
    frequencyKey,
    notes: notes || '',
    assignedTo: assignedTo || 'simone',
  });
}

// Soft delete — preserves completion history
export async function deactivateTask(taskId) {
  return updateDoc(doc(db, 'tasks', taskId), { active: false });
}

export async function markCompletion({ taskId, status, uid, performedAt }) {
  return addDoc(collection(db, 'completions'), {
    taskId,
    status, // 'done' | 'skipped'
    performedAt: performedAt ? Timestamp.fromDate(performedAt) : serverTimestamp(),
    performedBy: uid,
  });
}

export async function deleteCompletion(completionId) {
  return deleteDoc(doc(db, 'completions', completionId));
}
