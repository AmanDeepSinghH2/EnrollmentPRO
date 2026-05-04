// =====================================================================
// EnrollmentPRO — Authentication Module (Firebase Edition)
// =====================================================================

import { auth, db } from './firebase-config.js';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { 
  doc, 
  setDoc, 
  getDoc 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/**
 * Register a new user and create their profile in Firestore.
 */
export async function register(email, password, role, name, extraData = {}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create profile in Firestore
    const profile = {
      uid: user.uid,
      email: email,
      role: role,
      name: name,
      createdAt: new Date().toISOString(),
      ...extraData
    };

    await setDoc(doc(db, 'users', user.uid), profile);
    return { user, profile };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Log in an existing user.
 */
export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Fetch profile to get role
    const profile = await getUserProfile(user.uid);
    return { user, profile };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Log out the current user.
 */
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}

/**
 * Get user profile from Firestore.
 */
export async function getUserProfile(uid) {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error('No such profile!');
  }
}

/**
 * Real-time listener for auth state changes.
 */
export function onAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get the currently logged in user (Promise based).
 */
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
}
