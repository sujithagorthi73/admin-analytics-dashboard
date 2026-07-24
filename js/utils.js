/* ==========================================================================
   utils.js
   Small reusable helper functions shared by every page script. Keeping
   these in one place is what lets dashboard.js / users.js / products.js
   etc. stay short and focused on their own page logic.
   ========================================================================== */

/** Shorthand query selectors */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/** Format a number as USD currency, e.g. formatCurrency(1234.5) -> "$1,234.50" */
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

/** Format a number with thousands separators, e.g. formatNumber(12500) -> "12,500" */
function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Format an ISO date string ("2026-07-20") into "Jul 20, 2026" */
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Return initials from a full name, e.g. "Ava Thompson" -> "AT" */
function getInitials(name) {
  return name.split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase();
}

/** Deterministically pick an avatar background color from a name so it stays stable */
const AVATAR_COLORS = ["#5B5FEF", "#14B8A6", "#F59E0B", "#3B82F6", "#EF4444", "#8B5CF6"];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/** Map a status string to a badge CSS class, reused by Users/Orders tables */
function statusBadgeClass(status) {
  const map = {
    Active: "badge-success", Delivered: "badge-success", Paid: "badge-success",
    Pending: "badge-warning", Processing: "badge-warning", Unpaid: "badge-warning",
    Inactive: "badge-neutral", Shipped: "badge-info",
    Banned: "badge-danger", Cancelled: "badge-danger", Refunded: "badge-danger",
  };
  return map[status] || "badge-neutral";
}

/**
 * Build a <span class="badge ..."> element as an HTML string.
 * Reused anywhere a status/payment pill needs to be rendered in a table.
 */
function badgeHTML(status) {
  return `<span class="badge ${statusBadgeClass(status)}">${status}</span>`;
}

/**
 * Show a temporary toast notification in the bottom-right corner.
 * type: "success" (default) or "danger"
 */
function showToast(message, type = "success") {
  let stack = qs(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type === "danger" ? "toast-danger" : ""}`;
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/** Open a modal overlay by id */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("open");
}

/** Close a modal overlay by id */
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("open");
}

/** Wire up every element with [data-close-modal] to close its parent modal */
function bindModalDismiss() {
  qsa("[data-close-modal]").forEach(btn => {
    btn.addEventListener("click", () => closeModal(btn.closest(".modal-overlay").id));
  });
  qsa(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
  });
}

/**
 * Generic client-side paginator.
 * items: full array, page: 1-based page number, perPage: rows per page.
 * Returns { pageItems, totalPages }.
 */
function paginate(items, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { pageItems: items.slice(start, start + perPage), totalPages, page: safePage };
}

/**
 * Render pagination buttons into a container element.
 * onPageChange(newPage) is called when a page button is clicked.
 */
function renderPagination(container, currentPage, totalPages, onPageChange) {
  container.innerHTML = "";
  const mkBtn = (label, page, opts = {}) => {
    const b = document.createElement("button");
    b.textContent = label;
    if (opts.active) b.classList.add("active");
    if (opts.disabled) b.disabled = true;
    b.addEventListener("click", () => onPageChange(page));
    return b;
  };
  container.appendChild(mkBtn("‹", currentPage - 1, { disabled: currentPage === 1 }));
  for (let p = 1; p <= totalPages; p++) {
    container.appendChild(mkBtn(String(p), p, { active: p === currentPage }));
  }
  container.appendChild(mkBtn("›", currentPage + 1, { disabled: currentPage === totalPages }));
}

/** Export an array of flat objects to a CSV file and trigger a download */
function exportToCSV(filename, rows) {
  if (!rows.length) { showToast("Nothing to export", "danger"); return; }
  const headers = Object.keys(rows[0]);
  const escapeCell = (val) => `"${String(val).replace(/"/g, '""')}"`;
  const csvLines = [
    headers.join(","),
    ...rows.map(row => headers.map(h => escapeCell(row[h])).join(","))
  ];
  const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Simple debounce helper - used on search inputs */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
