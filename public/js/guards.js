// =====================================================================
// EnrollmentPRO — Route Guards (Firebase Edition)
// =====================================================================

import { onAuth, getUserProfile } from './auth.js';

/**
 * Protect a page — requires authentication and a specific role.
 * Redirects to signin if not authenticated.
 * Redirects to correct dashboard if wrong role.
 *
 * @param {string} requiredRole — "student", "faculty", or "admin"
 * @returns {Promise<{user: object, profile: object}>}
 */
export function requireAuth(requiredRole) {
  return new Promise((resolve) => {
    const unsubscribe = onAuth(async (user) => {
      if (!user) {
        unsubscribe();
        window.location.href = '/auth/signin.html';
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        
        if (profile.role !== requiredRole) {
          unsubscribe();
          // Redirect to their correct dashboard
          const dashboardMap = {
            student: '/student/dashboard.html',
            faculty: '/faculty/dashboard.html',
            admin: '/admin/dashboard.html'
          };
          window.location.href = dashboardMap[profile.role] || '/index.html';
          return;
        }

        unsubscribe();
        resolve({ user, profile });
      } catch (err) {
        console.error('Guard error:', err);
        unsubscribe();
        window.location.href = '/auth/signin.html';
      }
    });
  });
}

/**
 * Public only guard — redirects authenticated users to their dashboard.
 */
export function publicOnly() {
  return new Promise((resolve) => {
    const unsubscribe = onAuth(async (user) => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          unsubscribe();
          const dashboardMap = {
            student: '/student/dashboard.html',
            faculty: '/faculty/dashboard.html',
            admin: '/admin/dashboard.html'
          };
          window.location.href = dashboardMap[profile.role] || '/index.html';
        } catch {
          unsubscribe();
          resolve();
        }
      } else {
        unsubscribe();
        resolve();
      }
    });
  });
}
