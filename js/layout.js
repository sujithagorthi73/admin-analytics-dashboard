function applyStoredTheme() {
  const theme = localStorage.getItem("admin_dash_theme") || "light";

  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}


function toggleDarkMode(forceState) {
  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";

  const next =
    typeof forceState === "boolean"
      ? forceState
      : !isDark;

  if (next) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("admin_dash_theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("admin_dash_theme", "light");
  }

  qsa("[data-dark-toggle]").forEach(t => {
    t.checked = next;
  });
}


function highlightActiveNavLink() {
  const current =
    window.location.pathname.split("/").pop() || "dashboard.html";

  qsa(".sidebar-link").forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}


function renderNotifications() {
  const list = DB.load("notifications", SEED_NOTIFICATIONS);

  const panel = qs("#notif-panel-list");
  const bellDot = qs("#notif-bell-dot");

  if (!panel) return;

  panel.innerHTML = list.map(n => `
    <div class="notif-item ${n.unread ? "unread" : ""}">
      <div class="ico"
        style="background:var(--color-accent-100);
        color:var(--color-accent);">
        ${n.icon}
      </div>

      <div class="body">
        <p>${n.text}</p>
        <span>${n.time}</span>
      </div>
    </div>
  `).join("");

  const hasUnread = list.some(n => n.unread);

  if (bellDot) {
    bellDot.style.display = hasUnread ? "block" : "none";
  }
}


function ensureSidebarBackdrop() {
  if (qs(".sidebar-backdrop")) return;

  const backdrop = document.createElement("div");

  backdrop.className = "sidebar-backdrop";

  document.body.appendChild(backdrop);

  backdrop.addEventListener("click", () => {
    document.body.classList.remove("sidebar-mobile-open");
  });
}


function bindMobileNavAutoClose() {
  qsa(".sidebar-link").forEach(link => {
    link.addEventListener("click", () => {
      document.body.classList.remove("sidebar-mobile-open");
    });
  });
}


function bindLayoutInteractions() {

  const collapseBtn = qs("#sidebar-collapse-btn");

  if (collapseBtn) {

    if (
      localStorage.getItem(
        "admin_dash_sidebar_collapsed"
      ) === "1"
    ) {
      document.body.classList.add("sidebar-collapsed");
    }

    collapseBtn.addEventListener("click", () => {

      document.body.classList.toggle("sidebar-collapsed");

      localStorage.setItem(
        "admin_dash_sidebar_collapsed",

        document.body.classList.contains("sidebar-collapsed")
          ? "1"
          : "0"
      );
    });
  }


  const burger = qs("#navbar-burger");

  if (burger) {
    burger.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-mobile-open");
    });
  }


  ensureSidebarBackdrop();

  bindMobileNavAutoClose();


  const bell = qs("#notif-bell");

  const notifPanel = qs("#notif-panel");

  if (bell && notifPanel) {

    bell.addEventListener("click", (e) => {

      e.stopPropagation();

      notifPanel.classList.toggle("open");
    });


    document.addEventListener("click", (e) => {

      if (!notifPanel.contains(e.target)) {
        notifPanel.classList.remove("open");
      }

    });
  }


  qsa("[data-logout]").forEach(btn => {
    btn.addEventListener("click", logout);
  });
}


function renderCurrentUser() {

  qsa("[data-user-name]").forEach(el => {
    el.textContent = CURRENT_USER.name;
  });


  qsa("[data-user-role]").forEach(el => {
    el.textContent = CURRENT_USER.role;
  });


  qsa("[data-user-initials]").forEach(el => {
    el.textContent = CURRENT_USER.initials;
  });

}


/* ===============================
   INITIALIZE LAYOUT
   =============================== */

function initLayout() {

  requireAuth();

  highlightActiveNavLink();

  bindLayoutInteractions();

  renderNotifications();

  renderCurrentUser();


  /* Set toggle according to current theme */

  const isDark =
    document.documentElement.getAttribute("data-theme") === "dark";


  qsa("[data-dark-toggle]").forEach(toggle => {
    toggle.checked = isDark;

    toggle.addEventListener("change", () => {
      toggleDarkMode(toggle.checked);
    });
  });

}


/* Apply saved theme when page loads */

applyStoredTheme();