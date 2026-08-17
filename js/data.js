const SEED_USERS = [
  { id: 1, name: "Ava Thompson",  email: "ava.thompson@mailbox.com",  role: "Admin",     status: "Active",   joined: "2024-01-12" },
  { id: 2, name: "Liam Chen",     email: "liam.chen@mailbox.com",     role: "Editor",    status: "Active",   joined: "2024-02-03" },
  { id: 3, name: "Sophia Rossi",  email: "sophia.rossi@mailbox.com",  role: "Customer",  status: "Inactive", joined: "2024-02-19" },
  { id: 4, name: "Noah Williams", email: "noah.williams@mailbox.com", role: "Customer",  status: "Active",   joined: "2024-03-01" },
  { id: 5, name: "Mia Johansson", email: "mia.johansson@mailbox.com", role: "Editor",    status: "Pending",  joined: "2024-03-15" },
  { id: 6, name: "Ethan Brooks",  email: "ethan.brooks@mailbox.com",  role: "Customer",  status: "Active",   joined: "2024-03-22" },
  { id: 7, name: "Olivia Martin", email: "olivia.martin@mailbox.com", role: "Customer",  status: "Banned",   joined: "2024-04-02" },
  { id: 8, name: "Lucas Meyer",   email: "lucas.meyer@mailbox.com",   role: "Admin",     status: "Active",   joined: "2024-04-18" },
  { id: 9, name: "Isabella Ford", email: "isabella.ford@mailbox.com", role: "Customer",  status: "Active",   joined: "2024-05-05" },
  { id: 10, name: "James Carter", email: "james.carter@mailbox.com",  role: "Customer",  status: "Inactive", joined: "2024-05-20" },
  { id: 11, name: "Amelia Novak", email: "amelia.novak@mailbox.com",  role: "Editor",    status: "Active",   joined: "2024-06-01" },
  { id: 12, name: "Benjamin Lee", email: "benjamin.lee@mailbox.com",  role: "Customer",  status: "Active",   joined: "2024-06-14" },
  { id: 13, name: "Charlotte Kim",email: "charlotte.kim@mailbox.com", role: "Customer",  status: "Pending",  joined: "2024-06-29" },
  { id: 14, name: "Henry Adams",  email: "henry.adams@mailbox.com",   role: "Customer",  status: "Active",   joined: "2024-07-09" },
  { id: 15, name: "Grace Muller", email: "grace.muller@mailbox.com",  role: "Admin",     status: "Active",   joined: "2024-07-21" },
];

const SEED_PRODUCTS = [
  { id: 1, name: "Aurora Wireless Headphones", category: "Electronics", price: 129.99, stock: 42,  icon: "🎧" },
  { id: 2, name: "Nimbus Running Shoes",       category: "Apparel",     price: 89.5,   stock: 120, icon: "👟" },
  { id: 3, name: "Terra Ceramic Mug Set",      category: "Home",        price: 24.0,   stock: 0,   icon: "☕" },
  { id: 4, name: "Pulse Fitness Tracker",      category: "Electronics", price: 59.99,  stock: 76,  icon: "⌚" },
  { id: 5, name: "Cascade Backpack",           category: "Accessories", price: 74.25,  stock: 18,  icon: "🎒" },
  { id: 6, name: "Lumen Desk Lamp",            category: "Home",        price: 39.99,  stock: 54,  icon: "💡" },
  { id: 7, name: "Drift Sunglasses",           category: "Accessories", price: 45.0,   stock: 8,   icon: "🕶️" },
  { id: 8, name: "Orbit Bluetooth Speaker",    category: "Electronics", price: 69.0,   stock: 33,  icon: "🔊" },
  { id: 9, name: "Willow Yoga Mat",            category: "Sports",      price: 32.5,   stock: 61,  icon: "🧘" },
  { id: 10, name: "Basecamp Tent (2P)",        category: "Sports",      price: 149.0,  stock: 12,  icon: "⛺" },
  { id: 11, name: "Meadow Cotton Hoodie",      category: "Apparel",     price: 54.0,   stock: 0,   icon: "🧥" },
  { id: 12, name: "Halo Table Mirror",         category: "Home",        price: 27.75,  stock: 40,  icon: "🪞" },
];

const SEED_ORDERS = [
  { id: "ORD-1001", customer: "Ava Thompson",  date: "2026-07-01", total: 189.98, status: "Delivered",  payment: "Paid" },
  { id: "ORD-1002", customer: "Liam Chen",     date: "2026-07-03", total: 64.0,   status: "Processing", payment: "Paid" },
  { id: "ORD-1003", customer: "Sophia Rossi",  date: "2026-07-04", total: 149.0,  status: "Pending",    payment: "Unpaid" },
  { id: "ORD-1004", customer: "Noah Williams", date: "2026-07-05", total: 27.75,  status: "Delivered",  payment: "Paid" },
  { id: "ORD-1005", customer: "Mia Johansson", date: "2026-07-06", total: 99.5,   status: "Cancelled",  payment: "Refunded" },
  { id: "ORD-1006", customer: "Ethan Brooks",  date: "2026-07-08", total: 234.49, status: "Shipped",    payment: "Paid" },
  { id: "ORD-1007", customer: "Olivia Martin", date: "2026-07-09", total: 45.0,   status: "Pending",    payment: "Unpaid" },
  { id: "ORD-1008", customer: "Lucas Meyer",   date: "2026-07-10", total: 129.99, status: "Delivered",  payment: "Paid" },
  { id: "ORD-1009", customer: "Isabella Ford", date: "2026-07-12", total: 78.25,  status: "Processing", payment: "Paid" },
  { id: "ORD-1010", customer: "James Carter",  date: "2026-07-13", total: 32.5,   status: "Shipped",    payment: "Paid" },
  { id: "ORD-1011", customer: "Amelia Novak",  date: "2026-07-15", total: 59.99,  status: "Delivered",  payment: "Paid" },
  { id: "ORD-1012", customer: "Benjamin Lee",  date: "2026-07-17", total: 214.0,  status: "Pending",    payment: "Unpaid" },
  { id: "ORD-1013", customer: "Charlotte Kim", date: "2026-07-18", total: 69.0,   status: "Cancelled",  payment: "Refunded" },
  { id: "ORD-1014", customer: "Henry Adams",   date: "2026-07-19", total: 149.0,  status: "Processing", payment: "Paid" },
  { id: "ORD-1015", customer: "Grace Muller",  date: "2026-07-20", total: 54.0,   status: "Delivered",  payment: "Paid" },
];

const SEED_NOTIFICATIONS = [
  { id: 1, type: "order",  icon: "🛒", text: "New order ORD-1015 placed by Grace Muller",     time: "5 min ago",  unread: true },
  { id: 2, type: "user",   icon: "👤", text: "Mia Johansson's account is pending approval",    time: "1 hr ago",   unread: true },
  { id: 3, type: "stock",  icon: "📦", text: "Terra Ceramic Mug Set is out of stock",           time: "3 hrs ago",  unread: true },
  { id: 4, type: "payment",icon: "💳", text: "Payment refunded for ORD-1005",                   time: "Yesterday",  unread: false },
  { id: 5, type: "system", icon: "⚙️", text: "Weekly analytics report is ready to download",    time: "2 days ago", unread: false },
];

const MONTH_LABELS = ["Jan","Feb","Mar","Apr","May","Jun","Jul"];
const SALES_SERIES   = [12500, 15200, 14100, 18900, 21500, 19800, 24300];
const VISITORS_SERIES= [3200, 3800, 3600, 4400, 5100, 4700, 5600];
const CATEGORY_SALES = { Electronics: 42, Apparel: 23, Home: 15, Accessories: 12, Sports: 8 };
const ORDER_STATUS_COUNTS = { Delivered: 6, Processing: 3, Pending: 3, Shipped: 2, Cancelled: 2 };

const SEED_CURRENT_USER = { name: "Grace Muller", role: "Super Admin", email: "grace.muller@mailbox.com", initials: "GM" };

/* ---------------------------------------------------------------------- */
/* Local "database" helpers                                               */
/* ---------------------------------------------------------------------- */
const DB = {
  _key(name) { return `admin_dash_${name}`; },

  load(name, seed) {
    const raw = localStorage.getItem(this._key(name));
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { /* fall through to reseed */ }
    }
    this.save(name, seed);
    return JSON.parse(JSON.stringify(seed));
  },

  save(name, data) {
    localStorage.setItem(this._key(name), JSON.stringify(data));
  },

  reset(name, seed) {
    this.save(name, seed);
    return JSON.parse(JSON.stringify(seed));
  }
};

/* CURRENT_USER now loads any saved profile from localStorage, falling
   back to the seed values on first run. Mutated in place (not reassigned)
   so every file that already references CURRENT_USER keeps working. */
const CURRENT_USER = DB.load("profile", SEED_CURRENT_USER);