// =====================================================================
// EnrollmentPRO — Notice Service
// Centralizes all Firestore queries related to notices/announcements.
// =====================================================================

import { db } from '../firebase-config.js';
import {
  collection, query, getDocs, addDoc,
  deleteDoc, doc, orderBy
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/**
 * Get all notices, ordered by newest first.
 * @returns {Promise<Array<{id: string, title: string, content: string, link: string, authorId: string, createdAt: string}>>}
 */
export async function getAllNotices() {
  const snap = await getDocs(
    query(collection(db, 'notices'), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Create a new notice.
 * @param {string} title
 * @param {string} content
 * @param {string} link (optional)
 * @param {string} authorId
 * @returns {Promise<string>} new notice document ID
 */
export async function createNotice(title, content, link, authorId) {
  const ref = await addDoc(collection(db, 'notices'), {
    title,
    content,
    link: link || '',
    authorId,
    createdAt: new Date().toISOString()
  });
  return ref.id;
}

/**
 * Delete a notice by ID.
 * @param {string} noticeId
 */
export async function deleteNotice(noticeId) {
  await deleteDoc(doc(db, 'notices', noticeId));
}
