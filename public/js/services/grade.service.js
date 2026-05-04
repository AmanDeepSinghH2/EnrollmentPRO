// =====================================================================
// EnrollmentPRO — Grade Service
// Centralizes all Firestore queries related to grades.
// Uses setDoc with deterministic IDs to prevent duplicate grades.
// =====================================================================

import { db } from '../firebase-config.js';
import {
  collection, query, where, getDocs,
  setDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/**
 * Assign (or update) a grade for a student in a course.
 * Uses a deterministic document ID (studentId_courseId) to prevent duplicates.
 * @param {string} studentId
 * @param {string} courseId
 * @param {string} grade
 * @param {string} gradeDate  ISO date string
 */
export async function setGrade(studentId, courseId, grade, gradeDate) {
  const gradeDocId = `${studentId}_${courseId}`;
  await setDoc(doc(db, 'grades', gradeDocId), {
    studentId,
    courseId,
    grade,
    gradeDate: gradeDate || new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString()
  });
}

/**
 * Get all grades for a specific student.
 * @param {string} studentId
 * @returns {Promise<Array<{id: string, courseId: string, grade: string}>>}
 */
export async function getStudentGrades(studentId) {
  const snap = await getDocs(
    query(collection(db, 'grades'), where('studentId', '==', studentId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Build a map of courseId → grade for a student.
 * @param {string} studentId
 * @returns {Promise<Object>}
 */
export async function buildStudentGradeMap(studentId) {
  const grades = await getStudentGrades(studentId);
  const map = {};
  grades.forEach(g => { map[g.courseId] = g.grade; });
  return map;
}

/**
 * Get all grades (faculty view).
 * @returns {Promise<Array>}
 */
export async function getAllGrades() {
  const snap = await getDocs(collection(db, 'grades'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Delete a grade record.
 * @param {string} gradeId
 */
export async function deleteGrade(gradeId) {
  await deleteDoc(doc(db, 'grades', gradeId));
}
