/* ==========================================================================
   settings.js - logic specific to settings.html
   ========================================================================== */

function bindSettingsTabs() {
  qsa(".settings-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      qsa(".settings-tab").forEach(t => t.classList.remove("active"));
      qsa(".settings-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = qs(`#panel-${tab.dataset.tab}`);
      if (panel) panel.classList.add("active");
    });
  });
}

/** Fills the Profile form inputs from the current saved CURRENT_USER */
function populateProfileForm() {
  const nameField = qs("#profile-name");
  const emailField = qs("#profile-email");
  if (nameField) nameField.value = CURRENT_USER.name;
  if (emailField) emailField.value = CURRENT_USER.email;
  // phone / title / bio aren't part of CURRENT_USER, so they keep
  // whatever value is already in the HTML (or a previously saved one, see below)
}

function bindProfileForm() {
  const form = qs("#profile-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = qs("#profile-name").value.trim();
    const email = qs("#profile-email").value.trim();
    const phone = qs("#profile-phone")?.value.trim() ?? "";
    const title = qs("#profile-title")?.value.trim() ?? "";
    const bio = qs("#profile-bio")?.value.trim() ?? "";

    if (!name || !email) {
      showToast("Name and email are required", "danger");
      return;
    }

    // Update the shared CURRENT_USER object in place
    CURRENT_USER.name = name;
    CURRENT_USER.email = email;
    CURRENT_USER.initials = getInitials(name);

    // Persist core identity fields
    DB.save("profile", CURRENT_USER);

    // Persist the extra profile-only fields separately
    DB.save("profile_extra", { phone, title, bio });

    // Refresh every navbar/sidebar element that shows the user's name/initials
    renderCurrentUser();

    showToast("Profile updated successfully");
  });
}

/** Restores phone/title/bio from localStorage if previously saved */
function populateProfileExtraFields() {
  const extra = DB.load("profile_extra", {
    phone: qs("#profile-phone")?.value ?? "",
    title: qs("#profile-title")?.value ?? "",
    bio: qs("#profile-bio")?.value ?? "",
  });
  if (qs("#profile-phone")) qs("#profile-phone").value = extra.phone;
  if (qs("#profile-title")) qs("#profile-title").value = extra.title;
  if (qs("#profile-bio")) qs("#profile-bio").value = extra.bio;
}

function bindPasswordForm() {
  const form = qs("#password-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPass = qs("#new-password")?.value ?? "";
    const confirmPass = qs("#confirm-password")?.value ?? "";

    if (newPass !== confirmPass) {
      showToast("New password and confirmation do not match", "danger");
      return;
    }
    showToast("Password updated successfully");
    e.target.reset();
  });
}

function bindAppearanceToggles() {
  const darkToggle = qs("#dark-mode-toggle");
  if (darkToggle) {
    darkToggle.checked = document.documentElement.getAttribute("data-theme") === "dark";
    darkToggle.addEventListener("change", () => {
      toggleDarkMode(darkToggle.checked);
      showToast(darkToggle.checked ? "Dark mode enabled" : "Dark mode disabled");
    });
  }

  const compactToggle = qs("#compact-sidebar-toggle");
  if (compactToggle) {
    compactToggle.checked = localStorage.getItem("admin_dash_sidebar_collapsed") === "1";
    compactToggle.addEventListener("change", () => {
      localStorage.setItem("admin_dash_sidebar_collapsed", compactToggle.checked ? "1" : "0");
      document.body.classList.toggle("sidebar-collapsed", compactToggle.checked);
      showToast("Preference saved");
    });
  }
}

function bindNotificationToggles() {
  qsa("#panel-notifications .toggle input").forEach(input => {
    input.addEventListener("change", () => showToast("Notification preference saved"));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  populateProfileForm();
  populateProfileExtraFields();
  bindSettingsTabs();
  bindProfileForm();
  bindPasswordForm();
  bindAppearanceToggles();
  bindNotificationToggles();
});