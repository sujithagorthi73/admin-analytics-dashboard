/* ==========================================================================
   analytics.js - logic specific to analytics.html
   ========================================================================== */

const TRAFFIC_SOURCES = { Organic: 38, Direct: 24, Social: 19, Referral: 12, Email: 7 };

function renderVisitorsChart() {
  new Chart(qs("#chart-visitors"), {
    type: "line",
    data: {
      labels: MONTH_LABELS,
      datasets: [{
        label: "Visitors", data: VISITORS_SERIES,
        borderColor: "#5B5FEF", backgroundColor: "rgba(91,95,239,.12)",
        tension: .4, fill: true, pointRadius: 3,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { grid: { color: "rgba(138,143,163,.12)" } }, x: { grid: { display: false } } },
    },
  });
}

function renderTrafficChart() {
  new Chart(qs("#chart-traffic"), {
    type: "doughnut",
    data: {
      labels: Object.keys(TRAFFIC_SOURCES),
      datasets: [{
        data: Object.values(TRAFFIC_SOURCES),
        backgroundColor: ["#5B5FEF", "#14B8A6", "#F59E0B", "#3B82F6", "#EF4444"],
        borderWidth: 0,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: "62%", plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } } },
  });
}

function renderCategoryTrendChart() {
  const categories = Object.keys(CATEGORY_SALES);
  const colors = ["#5B5FEF", "#14B8A6", "#F59E0B", "#3B82F6", "#EF4444"];
  // Build a plausible per-month split per category from the overall share
  const datasets = categories.map((cat, i) => ({
    label: cat,
    data: MONTH_LABELS.map((_, m) => Math.round((CATEGORY_SALES[cat] / 100) * SALES_SERIES[m] / 60)),
    backgroundColor: colors[i],
    borderRadius: 4,
  }));

  new Chart(qs("#chart-category-trend"), {
    type: "bar",
    data: { labels: MONTH_LABELS, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } },
      scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: { color: "rgba(138,143,163,.12)" } } },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  renderVisitorsChart();
  renderTrafficChart();
  renderCategoryTrendChart();
});
