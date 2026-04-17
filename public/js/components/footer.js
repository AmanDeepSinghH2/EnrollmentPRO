// =====================================================================
// EnrollmentPRO — Footer Component
// =====================================================================

/**
 * Render the shared footer into an element with id="site-footer".
 */
export function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  footer.innerHTML = `
    <div class="container footer-content">
      <div class="footer-brand">EnrollmentPRO</div>
      <p class="footer-tagline">Empowering student enrollment, the smart way.</p>
      <div class="footer-links">
        <a href="/index.html">Home</a>
        <a href="/about.html">About Us</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
      <p class="footer-copy">© ${new Date().getFullYear()} EnrollmentPRO · SRMIST · All rights reserved.</p>
    </div>
  `;
}
