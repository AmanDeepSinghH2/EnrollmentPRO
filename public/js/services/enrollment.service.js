// =====================================================================
// EnrollmentPRO — Enrollment Service
// Centralizes all Firestore queries related to enrollments.
// =====================================================================

import { db } from '../firebase-config.js';
import {
  collection, query, where, getDocs, addDoc,
  updateDoc, deleteDoc, doc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/**
 * Get all enrollments for a specific student.
 * @param {string} studentId
 * @returns {Promise<Array<{id: string, data: object}>>}
 */
export async function getStudentEnrollments(studentId) {
  const snap = await getDocs(
    query(collection(db, 'enrollments'), where('studentId', '==', studentId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get all enrollments (faculty view).
 * @returns {Promise<Array<{id: string, data: object}>>}
 */
export async function getAllEnrollments() {
  const snap = await getDocs(collection(db, 'enrollments'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Enroll a student in a course (pending status).
 * @param {string} studentId
 * @param {string} courseId
 * @param {string} semester
 * @returns {Promise<string>} new enrollment document ID
 */
export async function enrollStudent(studentId, courseId, semester) {
  const ref = await addDoc(collection(db, 'enrollments'), {
    studentId,
    courseId,
    status: 'Pending',
    enrollmentDate: new Date().toISOString(),
    semester: semester || '1',
    createdAt: new Date().toISOString()
  });
  return ref.id;
}

/**
 * Approve a pending enrollment.
 * @param {string} enrollmentId
 */
export async function approveEnrollment(enrollmentId) {
  await updateDoc(doc(db, 'enrollments', enrollmentId), { status: 'Enrolled' });
}

/**
 * Drop / delete an enrollment.
 * @param {string} enrollmentId
 */
export async function dropEnrollment(enrollmentId) {
  await deleteDoc(doc(db, 'enrollments', enrollmentId));
}

/**
 * Get enrollment statistics for the faculty dashboard.
 * @returns {Promise<{total: number, pending: number, enrolled: number}>}
 */
export async function getEnrollmentStats() {
  const snap = await getDocs(collection(db, 'enrollments'));
  let total = 0, pending = 0, enrolled = 0;
  snap.forEach(d => {
    total++;
    if (d.data().status === 'Pending') pending++;
    if (d.data().status === 'Enrolled') enrolled++;
  });
  return { total, pending, enrolled };
}

/**
 * Check if a student is already enrolled in a course.
 * @param {string} studentId
 * @param {string} courseId
 * @returns {Promise<boolean>}
 */
export async function isAlreadyEnrolled(studentId, courseId) {
  const snap = await getDocs(
    query(
      collection(db, 'enrollments'),
      where('studentId', '==', studentId),
      where('courseId', '==', courseId)
    )
  );
  return !snap.empty;
}
