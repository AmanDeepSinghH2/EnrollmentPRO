// =====================================================================
// EnrollmentPRO — Toast Notification Component
// =====================================================================

let containerEl = null;

function ensureContainer() {
  if (!containerEl) {
    containerEl = document.createElement('div');
    containerEl.className = 'toast-container';
    document.body.appendChild(containerEl);
  }
  return containerEl;
}

/**
 * Show a toast notification.
 * @param {string} message — The message to display
 * @param {"success"|"error"|"warning"|"info"} type — Toast type
 * @param {number} duration — Auto-dismiss time in ms (0 = no auto-dismiss)
 */
export function showToast(message, type = 'info', duration = 4000) {
  const container = ensureContainer();

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ'}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">×</button>
  `;

  // Bind close button
  toast.querySelector('.toast-close').addEventListener('click', () => dismissToast(toast));

  container.appendChild(toast);

  // Auto-dismiss
  if (duration > 0) {
    setTimeout(() => dismissToast(toast), duration);
  }

  return toast;
}

function dismissToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', () => {
    toast.remove();
  });
}
