// =====================================================================
// EnrollmentPRO — Shared Utilities
// =====================================================================

/**
 * Sanitize a string to prevent XSS when inserting into DOM.
 * @param {string} str
 * @returns {string}
 */
export function sanitize(str) {
  if (str == null) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Format a date string or Firestore timestamp to a readable format.
 * @param {string|object|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return '—';
  try {
    // Handle Firestore Timestamp
    if (date.toDate) date = date.toDate();
    // Handle ISO strings
    const d = new Date(date);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return '—';
  }
}

/**
 * Format a phone number for display.
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '—';
  return String(phone).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
}

/**
 * Debounce a function call.
 * @param {function} fn
 * @param {number} ms — delay in milliseconds
 * @returns {function}
 */
export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/**
 * Get initials from a name (for avatar).
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Capitalize first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a friendly error message from Firebase error codes.
 * @param {Error} error
 * @returns {string}
 */
export function getFriendlyError(error) {
  const code = error?.code || '';
  const map = {
    'auth/email-already-in-use': 'This email is already registered. Try signing in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.'
  };
  return map[code] || error?.message || 'Something went wrong. Please try again.';
}

/**
 * Set a cell's text content safely (no XSS).
 * @param {HTMLElement} row
 * @param {string} text
 * @returns {HTMLElement} the created td
 */
export function addCell(row, text) {
  const td = document.createElement('td');
  td.textContent = text || '—';
  row.appendChild(td);
  return td;
}

/**
 * Add a badge cell to a table row.
 * @param {HTMLElement} row
 * @param {string} text
 * @param {string} type — "success", "warning", "error", "info", "neutral"
 * @returns {HTMLElement}
 */
export function addBadgeCell(row, text, type = 'neutral') {
  const td = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = `badge badge-${type}`;
  badge.textContent = text || '—';
  td.appendChild(badge);
  row.appendChild(td);
  return td;
}
