/* ==========================================================================
   reports.js - logic specific to reports.html
   ========================================================================== */

const AVAILABLE_REPORTS = [
  { id: 1, name: "July 2026 Sales Report",      meta: "Generated Jul 21, 2026 · CSV", icon: "📊" },
  { id: 2, name: "Q2 2026 Revenue Summary",      meta: "Generated Jul 01, 2026 · CSV", icon: "💵" },
  { id: 3, name: "Customer Growth Report",       meta: "Generated Jun 28, 2026 · CSV", icon: "👥" },
  { id: 4, name: "Inventory Status Report",      meta: "Generated Jun 15, 2026 · CSV", icon: "📦" },
];

/** Fills the 3 summary cards using the orders data set */
function renderRevenueSummary() {
  const orders = DB.load("orders", SEED_ORDERS);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const avgOrder = totalRevenue / orders.length;

  qs("#rep-total-revenue").textContent = formatCurrency(totalRevenue);
  qs("#rep-avg-order").textContent = formatCurrency(avgOrder);
  qs("#rep-total-orders").textContent = formatNumber(orders.length);
}

function renderMonthlySalesChart() {
  new Chart(qs("#chart-monthly-sales"), {
    type: "bar",
    data: {
      labels: MONTH_LABELS,
      datasets: [{
        label: "Sales ($)", data: SALES_SERIES,
        backgroundColor: "#5B5FEF", borderRadius: 6, maxBarThickness: 46,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { grid: { color: "rgba(138,143,163,.12)" } }, x: { grid: { display: false } } },
    },
  });
}

function renderReportList() {
  qs("#report-list").innerHTML = AVAILABLE_REPORTS.map(r => `
    <div class="report-row">
      <div class="left">
        <div class="ico">${r.icon}</div>
        <div><div class="name">${r.name}</div><div class="meta">${r.meta}</div></div>
      </div>
      <button class="btn btn-ghost btn-sm" data-download="${r.id}">⬇ Download</button>
    </div>
  `).join("");

  qsa("[data-download]").forEach(btn => btn.addEventListener("click", () => downloadReport(Number(btn.dataset.download))));
}

/** Downloads a report as CSV. Uses the orders data set as the underlying export content for the demo. */
function downloadReport(reportId) {
  const report = AVAILABLE_REPORTS.find(r => r.id === reportId);
  const orders = DB.load("orders", SEED_ORDERS);
  const rows = orders.map(o => ({ OrderID: o.id, Customer: o.customer, Date: o.date, Total: o.total.toFixed(2), Status: o.status }));
  exportToCSV(`${report.name.replace(/\s+/g, "-").toLowerCase()}.csv`, rows);
  showToast(`Downloading "${report.name}"`);
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  renderRevenueSummary();
  renderMonthlySalesChart();
  renderReportList();

  qs("#btn-download-report").addEventListener("click", () => downloadReport(1));
});
