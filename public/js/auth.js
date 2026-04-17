// =====================================================================
// EnrollmentPRO — Authentication Module
// =====================================================================

import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/**
 * Sign up a new user and create their Firestore profile.
 * @param {string} email
 * @param {string} password
 * @param {object} profileData — { name, role, phone, dob, semester?, address? }
 * @returns {Promise<object>} Firebase user credential
 */
export async function signup(email, password, profileData) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), {
    ...profileData,
    email: email,
    createdAt: new Date().toISOString()
  });
  return cred;
}

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Firebase user credential
 */
export async function signin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out the current user — actually destroys the session.
 */
export async function logout() {
  return signOut(auth);
}

/**
 * Get the role of a user from Firestore.
 * @param {string} uid
 * @returns {Promise<string>} "student" or "faculty"
 */
export async function getUserRole(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) throw new Error('User profile not found');
  return userDoc.data().role;
}

/**
 * Get the full profile of a user from Firestore.
 * @param {string} uid
 * @returns {Promise<object>}
 */
export async function getUserProfile(uid) {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) throw new Error('User profile not found');
  return { uid, ...userDoc.data() };
}

/**
 * Listen for auth state changes.
 * @param {function} callback — receives (user) or (null)
 */
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
