// =====================================================================
// EnrollmentPRO — User Service
// Centralizes all Firestore queries related to users.
// Includes in-memory caching to avoid redundant reads across pages.
// =====================================================================

import { db } from '../firebase-config.js';
import {
  collection, query, where, getDocs, doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// In-memory cache for this page session
let _studentsCache = null;
let _facultyCache = null;

/**
 * Get all students (cached within the page session).
 * @returns {Promise<Array<{id: string, name: string, email: string, ...}>>}
 */
export async function getAllStudents() {
  if (_studentsCache) return _studentsCache;
  const snap = await getDocs(
    query(collection(db, 'users'), where('role', '==', 'student'))
  );
  _studentsCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return _studentsCache;
}

/**
 * Get all faculty members (cached within the page session).
 * @returns {Promise<Array<{id: string, name: string, email: string, ...}>>}
 */
export async function getAllFaculty() {
  if (_facultyCache) return _facultyCache;
  const snap = await getDocs(
    query(collection(db, 'users'), where('role', '==', 'faculty'))
  );
  _facultyCache = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return _facultyCache;
}

/**
 * Get a user by UID from Firestore.
 * @param {string} uid
 * @returns {Promise<object|null>}
 */
export async function getUserById(uid) {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  return null;
}

/**
 * Build a map of userId → userName for efficient name lookup in tables.
 * @param {'student'|'faculty'} role
 * @returns {Promise<Object>}
 */
export async function buildUserMap(role) {
  const users = role === 'student' ? await getAllStudents() : await getAllFaculty();
  const map = {};
  users.forEach(u => { map[u.id] = u.name; });
  return map;
}

/**
 * Invalidate caches (call if users are added/removed).
 */
export function clearUserCache() {
  _studentsCache = null;
  _facultyCache = null;
}
