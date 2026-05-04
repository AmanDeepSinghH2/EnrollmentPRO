// =====================================================================
// EnrollmentPRO — Semester Service
// Handles the official registration of a student for a specific semester.
// =====================================================================

import { db } from '../firebase-config.js';
import {
  collection, query, where, getDocs, addDoc,
  updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

export async function getStudentSemesterRegistrations(studentId) {
  const snap = await getDocs(
    query(collection(db, 'semesterEnrollments'), where('studentId', '==', studentId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAllSemesterRegistrations() {
  const snap = await getDocs(collection(db, 'semesterEnrollments'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function applyForSemester(studentId, semester) {
  // Check if already applied
  const existing = await getStudentSemesterRegistrations(studentId);
  if (existing.some(r => r.semester === semester.toString())) {
    throw new Error('Already applied for this semester.');
  }

  const ref = await addDoc(collection(db, 'semesterEnrollments'), {
    studentId,
    semester: semester.toString(),
    status: 'Pending Approval', // Faculty needs to approve
    appliedAt: new Date().toISOString()
  });
  return ref.id;
}

// Faculty action
export async function approveSemesterRegistration(id) {
  await updateDoc(doc(db, 'semesterEnrollments', id), { status: 'Approved (Requires Confirmation)' });
}

// Student action
export async function confirmSemesterRegistration(id) {
  await updateDoc(doc(db, 'semesterEnrollments', id), { status: 'Officially Enrolled' });
}

export async function deleteSemesterRegistration(id) {
  await deleteDoc(doc(db, 'semesterEnrollments', id));
}
