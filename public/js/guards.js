// =====================================================================
// EnrollmentPRO — Route Guards
// =====================================================================

import { auth, db } from './firebase-config.js';
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  doc, getDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

/**
 * Protect a page — requires authentication and a specific role.
 * Redirects to signin if not authenticated.
 * Redirects to correct dashboard if wrong role.
 *
 * @param {string} requiredRole — "student" or "faculty"
 * @returns {Promise<{user: object, profile: object}>}
 */
export function requireAuth(requiredRole) {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = '/auth/signin.html';
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          window.location.href = '/auth/signin.html';
          return;
        }

        const profile = userDoc.data();
        if (profile.role !== requiredRole) {
          // Redirect to correct dashboard
          window.location.href = profile.role === 'student'
            ? '/student/dashboard.html'
            : '/faculty/dashboard.html';
          return;
        }

        resolve({ user, profile });
      } catch (err) {
        console.error('Guard error:', err);
        window.location.href = '/auth/signin.html';
      }
    });
  });
}

/**
 * Redirect authenticated users away from auth pages (signin/signup).
 * Call this on auth pages to prevent already-logged-in users from seeing them.
 */
export function redirectIfAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        resolve(null);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const role = userDoc.data().role;
          window.location.href = role === 'student'
            ? '/student/dashboard.html'
            : '/faculty/dashboard.html';
          return;
        }
      } catch (err) {
        console.error('Redirect check error:', err);
      }
      
      resolve(null);
    });
  });
}
