function getStatCards() {
  const orders = DB.load("orders", SEED_ORDERS);
  const users = DB.load("users", SEED_USERS);
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return [
    { label: "Total Revenue", value: formatCurrency(revenue), delta: "+12.4%", up: true,  icon: "💰", color: "var(--color-accent)", bg: "var(--color-accent-100)" },
    { label: "Total Orders",  value: formatNumber(orders.length * 87), delta: "+8.1%", up: true,  icon: "📦", color: "var(--color-teal)", bg: "var(--color-teal-100)" },
    { label: "Active Users",  value: formatNumber(users.filter(u => u.status === "Active").length * 132), delta: "+4.6%", up: true,  icon: "👥", color: "var(--color-blue)", bg: "var(--color-blue-100)" },
    { label: "Conversion Rate", value: "3.42%", delta: "-0.8%", up: false, icon: "📉", color: "var(--color-amber)", bg: "var(--color-amber-100)" },
  ];
}

/** Renders the four statistic cards into #stats-grid */
function renderStatCards() {
  const grid = qs("#stats-grid");
  grid.innerHTML = getStatCards().map(s => `
    <div class="card stat-card" style="--stat-color:${s.color}; --stat-bg:${s.bg};">
      <div class="top">
        <div class="ico">${s.icon}</div>
        <span class="delta ${s.up ? "up" : "down"}">${s.up ? "▲" : "▼"} ${s.delta}</span>
      </div>
      <div class="value">${s.value}</div>
      <div class="label">${s.label}</div>
    </div>
  `).join("");
}

/** Line chart: Revenue vs Visitors over the last 7 months */
function renderLineChart() {
  new Chart(qs("#chart-line"), {
    type: "line",
    data: {
      labels: MONTH_LABELS,
      datasets: [
        {
          label: "Revenue ($)", data: SALES_SERIES,
          borderColor: "#5B5FEF", backgroundColor: "rgba(91,95,239,.12)",
          tension: .4, fill: true, pointRadius: 3, yAxisID: "y",
        },
        {
          label: "Visitors", data: VISITORS_SERIES,
          borderColor: "#14B8A6", backgroundColor: "rgba(20,184,166,.08)",
          tension: .4, fill: true, pointRadius: 3, yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { position: "bottom" } },
      scales: {
        y:  { position: "left",  grid: { color: "rgba(138,143,163,.12)" } },
        y1: { position: "right", grid: { display: false } },
      },
    },
  });
}

/** Pie chart: sales share by product category */
function renderPieChart() {
  new Chart(qs("#chart-pie"), {
    type: "pie",
    data: {
      labels: Object.keys(CATEGORY_SALES),
      datasets: [{
        data: Object.values(CATEGORY_SALES),
        backgroundColor: ["#5B5FEF", "#14B8A6", "#F59E0B", "#3B82F6", "#EF4444"],
        borderWidth: 0,
      }],
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { boxWidth: 10 } } } },
  });
}

/** Bar chart: order counts grouped by status */
function renderBarChart() {
  new Chart(qs("#chart-bar"), {
    type: "bar",
    data: {
      labels: Object.keys(ORDER_STATUS_COUNTS),
      datasets: [{
        label: "Orders",
        data: Object.values(ORDER_STATUS_COUNTS),
        backgroundColor: ["#14B8A6", "#F59E0B", "#8A8FA3", "#3B82F6", "#EF4444"],
        borderRadius: 6, maxBarThickness: 46,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, grid: { color: "rgba(138,143,163,.12)" } }, x: { grid: { display: false } } },
    },
  });
}

/** Fills the "Recent Orders" table with the 5 most recent orders */
function renderRecentOrders() {
  const orders = DB.load("orders", SEED_ORDERS).slice(-5).reverse();
  qs("#dash-recent-orders").innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer}</td>
      <td>${formatDate(o.date)}</td>
      <td>${formatCurrency(o.total)}</td>
      <td>${badgeHTML(o.status)}</td>
    </tr>
  `).join("");
}

/** Fills the "Recent Users" list with the 5 most recently joined users */
function renderRecentUsers() {
  const users = DB.load("users", SEED_USERS).slice(-5).reverse();
  qs("#dash-recent-users").innerHTML = users.map(u => `
    <div class="flex-between" style="padding:10px 0; border-bottom:1px solid var(--border);">
      <div class="cell-user">
        <div class="avatar" style="background:${avatarColor(u.name)}">${getInitials(u.name)}</div>
        <div>
          <div style="font-weight:600; font-size:var(--fs-sm);">${u.name}</div>
          <div class="muted" style="font-size:var(--fs-xs);">${u.email}</div>
        </div>
      </div>
      ${badgeHTML(u.status)}
    </div>
  `).join("");
}

/** Fills the embedded notifications card with the same data as the navbar dropdown */
function renderDashboardNotifications() {
  const list = DB.load("notifications", SEED_NOTIFICATIONS);
  qs("#dash-notifications").innerHTML = list.map(n => `
    <div class="notif-item ${n.unread ? "unread" : ""}">
      <div class="ico" style="background:var(--color-accent-100); color:var(--color-accent);">${n.icon}</div>
      <div class="body"><p>${n.text}</p><span>${n.time}</span></div>
    </div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initLayout();
  renderStatCards();
  renderLineChart();
  renderPieChart();
  renderBarChart();
  renderRecentOrders();
  renderRecentUsers();
  renderDashboardNotifications();
});
