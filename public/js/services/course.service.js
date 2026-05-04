// =====================================================================
// EnrollmentPRO — Course Service
// Centralizes all Firestore queries related to courses.
// =====================================================================

import { db } from '../firebase-config.js';
import {
  collection, query, where, getDocs, addDoc,
  deleteDoc, doc, orderBy
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/**
 * Get all courses from the catalog.
 * @returns {Promise<Array<{id: string, name: string, createdAt: string}>>}
 */
export async function getAllCourses() {
  const snap = await getDocs(collection(db, 'courses'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Add a new course.
 * @param {string} name
 * @returns {Promise<string>} new course document ID
 */
export async function addCourse(name) {
  const ref = await addDoc(collection(db, 'courses'), {
    name,
    createdAt: new Date().toISOString()
  });
  return ref.id;
}

/**
 * Delete a course by ID.
 * @param {string} courseId
 */
export async function deleteCourse(courseId) {
  await deleteDoc(doc(db, 'courses', courseId));
}

/**
 * Get courses assigned to a specific faculty member via courseFaculty.
 * @param {string} facultyId
 * @returns {Promise<Array<{courseId: string, assignmentId: string}>>}
 */
export async function getCoursesForFaculty(facultyId) {
  const snap = await getDocs(
    query(collection(db, 'courseFaculty'), where('facultyId', '==', facultyId))
  );
  return snap.docs.map(d => ({ assignmentId: d.id, ...d.data() }));
}

/**
 * Build a map of courseId → course object from a list of courses.
 * Useful for efficient name resolution in tables.
 * @param {Array} courses Optional list of courses to use.
 * @returns {Promise<Object>}
 */
export async function buildCourseMap(courses) {
  const list = courses || await getAllCourses();
  const map = {};
  list.forEach(c => { map[c.id] = c; });
  return map;
}
