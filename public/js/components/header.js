// =====================================================================
// EnrollmentPRO — Header Component
// =====================================================================

import { logout } from '../auth.js';
import { showToast } from './toast.js';

/**
 * Render the site header dynamically based on auth state and role.
 * @param {object|null} user — Firebase auth user (null = public)
 * @param {string|null} role — "student", "faculty", or null
 * @param {string} activePage — current page identifier for highlighting
 */
export function renderHeader(user = null, role = null, activePage = '') {
  const header = document.getElementById('site-header');
  if (!header) return;

  let navLinks = '';

  if (!user) {
    // Public navigation
    navLinks = `
      <a href="/index.html" class="nav-link ${activePage === 'home' ? 'nav-link--active' : ''}">Home</a>
      <a href="/about.html" class="nav-link ${activePage === 'about' ? 'nav-link--active' : ''}">About</a>
      <a href="/auth/signin.html" class="nav-link ${activePage === 'signin' ? 'nav-link--active' : ''}">Sign In</a>
      <a href="/auth/signup.html" class="nav-link nav-link--cta">Get Started</a>
    `;
  } else if (role === 'student') {
    navLinks = `
      <a href="/student/dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'nav-link--active' : ''}">Dashboard</a>
      <a href="/student/my-courses.html" class="nav-link ${activePage === 'courses' ? 'nav-link--active' : ''}">My Courses</a>
      <a href="/student/enrollment-status.html" class="nav-link ${activePage === 'enrollment' ? 'nav-link--active' : ''}">Status</a>
      <button class="nav-link nav-link--logout" id="logout-btn">Logout</button>
    `;
  } else if (role === 'faculty') {
    navLinks = `
      <a href="/faculty/dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'nav-link--active' : ''}">Dashboard</a>
      <div class="nav-dropdown">
        <button class="nav-link" id="tools-toggle">Management ▾</button>
        <div class="nav-dropdown-menu" id="tools-menu">
          <a href="/faculty/manage/students.html" class="nav-dropdown-link">📋 Students</a>
          <a href="/faculty/manage/courses.html" class="nav-dropdown-link">📚 Courses</a>
          <a href="/faculty/manage/enrollments.html" class="nav-dropdown-link">📝 Enrollments</a>
          <a href="/faculty/manage/grades.html" class="nav-dropdown-link">🎓 Grades</a>
        </div>
      </div>
      <button class="nav-link nav-link--logout" id="logout-btn">Logout</button>
    `;
  } else if (role === 'admin') {
    navLinks = `
      <a href="/admin/dashboard.html" class="nav-link ${activePage === 'dashboard' ? 'nav-link--active' : ''}">Admin Panel</a>
      <button class="nav-link nav-link--logout" id="logout-btn">Logout</button>
    `;
  }

  header.innerHTML = `
    <div class="container flex-between">
      <a href="/index.html" class="header-logo">EnrollmentPRO</a>
      <button class="mobile-menu-btn" id="mobile-menu-toggle" aria-label="Toggle menu">☰</button>
      <nav class="header-nav" id="header-nav">
        ${navLinks}
      </nav>
    </div>
  `;

  // Bind logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await logout();
        window.location.href = '/auth/signin.html';
      } catch (err) {
        showToast('Failed to logout', 'error');
      }
    });
  }

  // Bind dropdown toggle
  const toolsToggle = document.getElementById('tools-toggle');
  const toolsMenu = document.getElementById('tools-menu');
  if (toolsToggle && toolsMenu) {
    toolsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toolsMenu.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!toolsToggle.contains(e.target) && !toolsMenu.contains(e.target)) {
        toolsMenu.classList.remove('open');
      }
    });
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const headerNav = document.getElementById('header-nav');
  if (mobileToggle && headerNav) {
    mobileToggle.addEventListener('click', () => {
      headerNav.classList.toggle('open');
      mobileToggle.textContent = headerNav.classList.contains('open') ? '✕' : '☰';
    });
  }
}
