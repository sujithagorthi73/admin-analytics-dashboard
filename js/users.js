/* ==========================================================================
   users.js - logic specific to users.html
   ========================================================================== */

let usersState = {
  all: [],
  page: 1,
  perPage: 6,
};

function loadUsers() {
  usersState.all = DB.load("users", SEED_USERS);
}

function saveUsers() {
  DB.save("users", usersState.all);
}

/** Applies the search box + role/status filters, returns the filtered array */
function getFilteredUsers() {
  const term = qs("#user-search").value.trim().toLowerCase();
  const role = qs("#user-role-filter").value;
  const status = qs("#user-status-filter").value;

  return usersState.all.filter(u => {
    const matchesTerm = !term || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    const matchesRole = !role || u.role === role;
    const matchesStatus = !status || u.status === status;
    return matchesTerm && matchesRole && matchesStatus;
  });
}

/** Re-renders the table body + pagination for the current filter/page state */
function renderUsersTable() {
  const filtered = getFilteredUsers();
  const { pageItems, totalPages, page } = paginate(filtered, usersState.page, usersState.perPage);
  usersState.page = page;

  const tbody = qs("#users-table-body");
  const emptyState = qs("#users-empty");

  if (!pageItems.length) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    tbody.innerHTML = pageItems.map(u => `
      <tr>
        <td>
          <div class="cell-user">
            <div class="avatar" style="background:${avatarColor(u.name)}">${getInitials(u.name)}</div>
            <div>
              <div style="font-weight:600;">${u.name}</div>
              <div class="muted" style="font-size:var(--fs-xs);">${u.email}</div>
            </div>
          </div>
        </td>
        <td>${u.role}</td>
        <td>${badgeHTML(u.status)}</td>
        <td>${formatDate(u.joined)}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-ghost btn-sm" data-edit="${u.id}">Edit</button>
            <button class="btn btn-danger btn-sm" data-delete="${u.id}">Delete</button>
          </div>
        </td>
      </tr>
    `).join("");
  }

  renderPagination(qs("#users-pagination"), page, totalPages, (newPage) => {
    usersState.page = newPage;
    renderUsersTable();
  });

  bindRowActions();
}

/** Wires the per-row Edit/Delete buttons (re-run after every table render) */
function bindRowActions() {
  qsa("[data-edit]").forEach(btn => btn.addEventListener("click", () => openUserModal(Number(btn.dataset.edit))));
  qsa("[data-delete]").forEach(btn => btn.addEventListener("click", () => openDeleteModal(Number(btn.dataset.delete))));
}

/** Opens the Add/Edit modal. Pass a userId to edit, or omit to add a new user. */
function openUserModal(userId) {
  const isEdit = typeof userId === "number";
  qs("#user-modal-title").textContent = isEdit ? "Edit User" : "Add User";
  const user = isEdit ? usersState.all.find(u => u.id === userId) : null;

  qs("#user-id").value = isEdit ? user.id : "";
  qs("#user-name").value = isEdit ? user.name : "";
  qs("#user-email").value = isEdit ? user.email : "";
  qs("#user-role").value = isEdit ? user.role : "Customer";
  qs("#user-status").value = isEdit ? user.status : "Active";

  openModal("user-modal");
}

let userPendingDeleteId = null;
function openDeleteModal(userId) {
  const user = usersState.all.find(u => u.id === userId);
  userPendingDeleteId = userId;
  qs("#delete-user-name").textContent = user.name;
  openModal("delete-user-modal");
}

/** Handles the Add/Edit form submit - creates or updates a user record */
function handleUserFormSubmit(e) {
  e.preventDefault();
  const id = qs("#user-id").value;
  const payload = {
    name: qs("#user-name").value.trim(),
    email: qs("#user-email").value.trim(),
    role: qs("#user-role").value,
    status: qs("#user-status").value,
  };

  if (id) {
    const target = usersState.all.find(u => u.id === Number(id));
    Object.assign(target, payload);
    showToast("User updated successfully");
  } else {
    const newId = Math.max(0, ...usersState.all.map(u => u.id)) + 1;
    usersState.all.unshift({ id: newId, joined: new Date().toISOString().slice(0, 10), ...payload });
    showToast("User added successfully");
  }

  saveUsers();
  closeModal("user-modal");
  renderUsersTable();
}

function handleConfirmDelete() {
  usersState.all = usersState.all.filter(u => u.id !== userPendingDeleteId);
  saveUsers();
  closeModal("delete-user-modal");
  showToast("User deleted", "danger");
  renderUsersTable();
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  loadUsers();
  renderUsersTable();

  qs("#user-search").addEventListener("input", debounce(() => { usersState.page = 1; renderUsersTable(); }, 200));
  qs("#user-role-filter").addEventListener("change", () => { usersState.page = 1; renderUsersTable(); });
  qs("#user-status-filter").addEventListener("change", () => { usersState.page = 1; renderUsersTable(); });

  qs("#btn-add-user").addEventListener("click", () => openUserModal());
  qs("#user-form").addEventListener("submit", handleUserFormSubmit);
  qs("#confirm-delete-user").addEventListener("click", handleConfirmDelete);
  bindModalDismiss();
});
