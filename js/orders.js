let ordersState = { all: [], page: 1, perPage: 7 };

function loadOrders() {
  ordersState.all = DB.load("orders", SEED_ORDERS);
}

function getFilteredOrders() {
  const term = qs("#order-search").value.trim().toLowerCase();
  const status = qs("#order-status-filter").value;
  const payment = qs("#order-payment-filter").value;

  return ordersState.all.filter(o => {
    const matchesTerm = !term || o.id.toLowerCase().includes(term) || o.customer.toLowerCase().includes(term);
    const matchesStatus = !status || o.status === status;
    const matchesPayment = !payment || o.payment === payment;
    return matchesTerm && matchesStatus && matchesPayment;
  });
}

function renderOrdersTable() {
  const filtered = getFilteredOrders();
  const { pageItems, totalPages, page } = paginate(filtered, ordersState.page, ordersState.perPage);
  ordersState.page = page;

  const tbody = qs("#orders-table-body");
  const emptyState = qs("#orders-empty");

  if (!pageItems.length) {
    tbody.innerHTML = "";
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
    tbody.innerHTML = pageItems.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>${formatDate(o.date)}</td>
        <td>${formatCurrency(o.total)}</td>
        <td>${badgeHTML(o.status)}</td>
        <td>${badgeHTML(o.payment)}</td>
      </tr>
    `).join("");
  }

  renderPagination(qs("#orders-pagination"), page, totalPages, (newPage) => {
    ordersState.page = newPage;
    renderOrdersTable();
  });
}

/** Exports the currently filtered set of orders (not just the visible page) to CSV */
function handleExportOrders() {
  const rows = getFilteredOrders().map(o => ({
    OrderID: o.id, Customer: o.customer, Date: o.date,
    Total: o.total.toFixed(2), Status: o.status, Payment: o.payment,
  }));
  exportToCSV("orders-export.csv", rows);
  showToast(`Exported ${rows.length} orders to CSV`);
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  loadOrders();
  renderOrdersTable();

  qs("#order-search").addEventListener("input", debounce(() => { ordersState.page = 1; renderOrdersTable(); }, 200));
  qs("#order-status-filter").addEventListener("change", () => { ordersState.page = 1; renderOrdersTable(); });
  qs("#order-payment-filter").addEventListener("change", () => { ordersState.page = 1; renderOrdersTable(); });
  qs("#btn-export-orders").addEventListener("click", handleExportOrders);
});
