# Pulse Admin — Admin Analytics Dashboard

A complete, multi-page admin analytics dashboard built with **plain HTML5,
CSS3 (Flexbox + Grid) and vanilla JavaScript (ES6+)**, plus **Chart.js** for
charts. No React/Angular/Vue/Bootstrap/jQuery anywhere in the project.

## How to run it

No build step needed — it's static files.

1. Unzip / copy the `admin-dashboard` folder anywhere.
2. Open `index.html` in a browser (double-click, or serve it with any static
   server, e.g. `npx serve` or VS Code's "Live Server").
3. Log in with the demo credentials shown on the login screen:
   - **Email:** `admin@dashboard.com`
   - **Password:** `Admin@123`
   (or click "Autofill")

> Login uses a client-side session flag in `sessionStorage` — there's no real
> backend. Users/Products/Orders CRUD is persisted to `localStorage` so your
> edits survive page navigation and refreshes (use your browser's dev tools
> → Application → Storage to reset it, or just use a private window).

## Folder structure

```
admin-dashboard/
├── index.html            # Page 1: Login
├── dashboard.html         # Page 2: Dashboard
├── users.html              # Page 3: Users
├── products.html            # Page 4: Products
├── orders.html                # Page 5: Orders
├── analytics.html               # Page 6: Analytics
├── reports.html                    # Page 7: Reports
├── settings.html                      # Page 8: Settings
├── css/
│   ├── variables.css     # Design tokens: colors, spacing, type scale, dark theme overrides
│   ├── base.css           # Reset + reusable atoms: buttons, inputs, badges, tables, modal, toast
│   ├── login.css            # Login page only
│   ├── layout.css             # Sidebar + Navbar + Notifications dropdown (shared, all inner pages)
│   ├── dashboard.css            # Dashboard page only (stat cards, chart grid, welcome banner)
│   ├── tables-page.css            # Shared "list + toolbar" pattern: Users, Products, Orders
│   ├── analytics-reports.css        # Shared by Analytics + Reports pages
│   └── settings.css                   # Settings page only (tabs, toggle rows)
└── js/
    ├── data.js            # Dummy JSON "database" (users, products, orders, notifications, chart series) + localStorage helpers
    ├── utils.js             # Reusable helpers: formatters, badges, toasts, modals, pagination, CSV export, debounce
    ├── auth.js                # Login form handling + session guard (requireAuth/logout)
    ├── layout.js                 # Sidebar collapse/mobile drawer, navbar, notifications, dark mode — shared by every inner page
    ├── dashboard.js                # Dashboard page: stat cards + 3 charts + recent tables + notifications
    ├── users.js                       # Users page: search/filter/pagination/CRUD
    ├── products.js                       # Products page: card grid/search/filter/CRUD
    ├── orders.js                            # Orders page: filter/pagination/CSV export
    ├── analytics.js                            # Analytics page: 3 charts
    ├── reports.js                                 # Reports page: summary + chart + downloadable report list
    └── settings.js                                   # Settings page: tabs, profile/password forms, dark mode + notification toggles
```

## Where each requirement lives

- **Sidebar / Navbar / Notifications panel** — markup is repeated (semantically identical) at the top of every inner-page HTML file; all behaviour lives in `js/layout.js` and styling in `css/layout.css`, so it only had to be written once.
- **Statistic cards, Line/Bar/Pie charts, Recent Orders/Users tables** — `dashboard.html` + `js/dashboard.js` + `css/dashboard.css`.
- **Users: search, filter, pagination, Add/Edit/Delete, status badges** — `users.html` + `js/users.js`.
- **Products: cards, search, category filter, Add/Edit/Delete** — `products.html` + `js/products.js`.
- **Orders: table, status filter, payment status, Export to CSV** — `orders.html` + `js/orders.js` (CSV export helper lives in `js/utils.js` so Reports can reuse it too).
- **Analytics** — `analytics.html` + `js/analytics.js`.
- **Reports: revenue summary, monthly sales, download report** — `reports.html` + `js/reports.js`.
- **Settings: profile, change password, dark mode toggle, notification settings** — `settings.html` + `js/settings.js`.

## Notes on approach

- **Reusability first.** `utils.js` centralizes formatting, badge rendering, toasts, modal open/close, pagination and CSV export so every page script stays short and only contains page-specific logic. `layout.js` does the same for the sidebar/navbar/notifications/dark-mode behaviour that's identical across all 7 inner pages.
- **Responsive layout** uses CSS Grid for card/chart grids and Flexbox for the sidebar/navbar/toolbars, with breakpoints at 1200px, 960px (sidebar becomes an off-canvas drawer) and 640px.
- **Dark mode** is a single `data-theme="dark"` attribute on `<html>` that flips the CSS custom properties defined in `variables.css`; the toggle lives on the Settings → Appearance tab and the preference is remembered via `localStorage`.
- **Dummy data** for all entities lives in `js/data.js` and is seeded into `localStorage` on first load via the small `DB` helper, which is what makes Add/Edit/Delete feel persistent in this front-end-only demo.
