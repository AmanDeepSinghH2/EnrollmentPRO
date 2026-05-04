// =====================================================================
// EnrollmentPRO — Authentication Module (Flask + MySQL)
// =====================================================================

const API_BASE_URL = 'http://localhost:5000/auth';

/**
 * Sign up a new user via Flask API.
 * @param {string} email
 * @param {string} password
 * @param {object} profileData — { username, name, role }
 */
export async function signup(email, password, profileData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      username: profileData.username,
      name: profileData.name,
      role: profileData.role
    })
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Registration failed');
  return result;
}

/**
 * Sign in an existing user via Flask API.
 * @param {string} username
 * @param {string} password
 */
export async function signin(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Login failed');
  
  // Store user in localStorage for persistence (simplified session)
  localStorage.setItem('user', JSON.stringify(result.user));
  return result;
}

/**
 * Sign out the current user.
 */
export async function logout() {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST'
  });
  localStorage.removeItem('user');
  return response.json();
}

/**
 * Verify session with the server.
 */
export async function checkAuth() {
  try {
    const response = await fetch(`${API_BASE_URL}/me`);
    if (!response.ok) {
      localStorage.removeItem('user');
      return null;
    }
    const user = await response.json();
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  } catch (err) {
    localStorage.removeItem('user');
    return null;
  }
}

/**
 * Get the current user from localStorage.
 */
export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Check if the user is authenticated (via local state).
 */
export function isAuthenticated() {
  return !!localStorage.getItem('user');
}

/**
 * Get the role of the current user.
 */
export function getUserRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}
