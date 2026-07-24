/* ==========================================================================
   auth.js
   Very small "authentication" layer for the demo. There is no real
   backend, so we accept a fixed dummy credential pair and store a
   session flag in sessionStorage. Every internal page checks this flag
   (see layout.js -> requireAuth()) and bounces back to the login page
   if it is missing, which is enough to demonstrate a protected app shell.
   ========================================================================== */

const DEMO_CREDENTIALS = { email: "admin@dashboard.com", password: "Admin@123" };

function initLoginPage() {
  const form   = qs("#login-form");
  const errBox = qs("#login-error");

  // If a session already exists, skip the login form entirely.
  if (sessionStorage.getItem("admin_dash_session")) {
    window.location.href = "dashboard.html";
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = qs("#login-email").value.trim();
    const password = qs("#login-password").value;

    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      sessionStorage.setItem("admin_dash_session", JSON.stringify({ email, loggedInAt: Date.now() }));
      window.location.href = "dashboard.html";
    } else {
      errBox.textContent = "Invalid email or password. Try the demo credentials below.";
      errBox.classList.add("show");
    }
  });

  // Quick-fill button for the demo credentials hint box
  const fillBtn = qs("#fill-demo-creds");
  if (fillBtn) {
    fillBtn.addEventListener("click", () => {
      qs("#login-email").value = DEMO_CREDENTIALS.email;
      qs("#login-password").value = DEMO_CREDENTIALS.password;
    });
  }
}

/** Redirects to the login page if there is no active session. Called by every internal page. */
function requireAuth() {
  if (!sessionStorage.getItem("admin_dash_session")) {
    window.location.href = "index.html";
  }
}

/** Clears the session and returns to the login page. Wired to the "Log out" control. */
function logout() {
  sessionStorage.removeItem("admin_dash_session");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (qs("#login-form")) initLoginPage();
});
