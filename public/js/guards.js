// =====================================================================
// EnrollmentPRO — Route Guards (Flask + MySQL)
// =====================================================================

import { checkAuth } from './auth.js';

/**
 * Protect a page — requires authentication and a specific role.
 * Redirects to signin if not authenticated.
 * Redirects to correct dashboard if wrong role.
 *
 * @param {string} requiredRole — "student" or "faculty"
 * @returns {Promise<{user: object, profile: object}>}
 */
export async function requireAuth(requiredRole) {
  const user = await checkAuth();

  if (!user) {
    window.location.href = '/auth/signin.html';
    return;
  }

  // Normalize response keys to match frontend expectations (lowercase)
  const profile = {
    uid: user.UserID,
    name: user.Name,
    email: user.Email,
    role: user.Role.toLowerCase(),
    phone: user.PhoneNumber,
    dob: user.DOB,
    semester: user.Semester,
    address: user.Address
  };

  if (profile.role !== requiredRole) {
    // Redirect to correct dashboard
    window.location.href = profile.role === 'student'
      ? '/student/dashboard.html'
      : '/faculty/dashboard.html';
    return;
  }

  return { user, profile };
}

/**
 * Redirect authenticated users away from auth pages (signin/signup).
 * Call this on auth pages to prevent already-logged-in users from seeing them.
 */
export async function redirectIfAuth() {
  const user = await checkAuth();

  if (user) {
    window.location.href = user.role === 'student'
      ? '/student/dashboard.html'
      : '/faculty/dashboard.html';
  }
}
