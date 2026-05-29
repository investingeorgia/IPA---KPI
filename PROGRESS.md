# KPI Hub — Development Progress

> This file is updated after every chunk. A new session should read this + `KPI Implementation Plan.md` to resume work immediately.

---

## Current Status

**Last completed:** Chunk 8 — Full detail pages, Profile & Reports  
**Next up:** Chunk 9 — Firebase Authentication  
**Dev server:** Running via `D:\Claude\start-dev.cmd` → `http://localhost:5173`  
**Node.js:** Installed at `C:\nodejs` (portable zip, v20.18.1) — NOT on system PATH, use full path `C:\nodejs\node.exe` / `C:\nodejs\npm.cmd`

---

## Completed Chunks

### ✅ Chunk 1 — Project Scaffold & Routing Shell
**Commit:** `7f54e52`

- Vite + React project initialized (`package.json`, `vite.config.js`, `index.html`)
- Full `src/` folder structure created per implementation plan
- `src/main.jsx` — entry point, mounts AuthProvider + LanguageProvider
- `src/App.jsx` — all 13 routes defined using `ProtectedLayout` / `AdminLayout` / `DatabaseWrapper`
- `AuthContext` — mock admin user: Nino Beridze, `role: 'admin'` (swap point for Chunk 9)
- `LanguageContext` — EN/GE toggle with `t(key)` resolver
- `src/data/translations.js` — all UI strings extracted from `hub-data.jsx`
- `ProtectedRoute` / `AdminRoute` guards
- 13 placeholder pages (each labelled with build chunk)
- `styles.css` copied to `src/styles/`

### ✅ Chunk 2 — Shared UI Component Library
**Commit:** `1da89ba` + fixes `64dbfa3`, `c262b57`

**Layout:**
- `AppLayout` — root shell: sidebar + topbar (search, lang toggle, logout) + content + optional RightSidebar
- `MainSidebar` — nav links (admin-gated), Quick Log button, EN/GE toggle, user card
- `RightSidebar` — 360px slide-in panel (used by Database module)

**UI Primitives:**
- `Icon` — 22 SVG icons inline
- `Avatar` — initials avatar, 4 sizes
- `Button` — 4 variants, 3 sizes, loading state
- `Card` — optional title/actions header, soft variant
- `Modal` — portal-based, Escape + overlay click to close, 3 sizes
- `Badge` — 5 color variants + dot
- `ProgressBar` — auto-color from value, 3 sizes, label option
- `StatusBadge` — maps KPI status → localized Badge
- `SearchInput` — icon left, clear button right
- `Table` — sortable, custom cell renderers, row click, empty state

**Verified live** (preview snapshot confirmed):
- Sidebar renders: "IPA KPI Hub / Georgian Investment Agency", all 6 nav links, user card
- Topbar: search, EN/GE toggle, logout
- Dashboard placeholder loads, no JS errors
- React Router v7 warnings silenced

---

## Key Decisions & Notes

| Topic | Decision |
|---|---|
| Org name | "Georgian Investment Agency" (EN) / "საქართველოს საინვესტიციო სააგენტო" (GE) |
| Mock admin user | Nino Beridze, `u0`, `nino.beridze@enterprise.gov.ge` |
| Node.js location | `C:\nodejs` (portable) — start server via `D:\Claude\start-dev.cmd` |
| Preview launch config | `D:\Claude\.claude\launch.json` |
| Alias paths | `@shared/` `@modules/` `@data/` configured in `vite.config.js` |
| Auth swap point | `src/shared/contexts/AuthContext.jsx` — replace in Chunk 9 |
| Data swap point | All hooks in `src/shared/hooks/` — replace in Chunk 10 |

---

## Environment

```
Repo:      D:\Claude\IPA-KPI-repo
Node:      C:\nodejs\node.exe  (v20.18.1)
npm:       C:\nodejs\npm.cmd   (v10.8.2)
Start dev: D:\Claude\start-dev.cmd  → localhost:5173
```

---

## What's Left

| Chunk | Description | Status |
|---|---|---|
| 3 | Mock Data & Hooks Layer | ✅ Done |
| 4 | Dashboard + KPI List pages | ✅ Done |
| 5 | KPI Detail + Progress Logging | ✅ Done |
| 6 | Todos (List / Board / Timeline) | ✅ Done |
| 7 | Team + Database modules | ✅ Done |
| 8 | Full detail pages + Profile + Reports | ✅ Done |
| 9 | Firebase Authentication | ⏳ Next |
| 10 | Firestore Data Layer | ⬜ |
| 11 | Deploy to Vercel | ⬜ |

---

### ✅ Chunk 3 — Mock Data & Hooks Layer
**Commit:** (see git log)

- `src/data/mockData.js` — all seed data extracted from `hub-data.jsx`: 11 users, 12 KPIs (bilingual titles), 5 companies, 3 articles, 7 progress logs, 8 todos. Uses `new Date()` for relative dates.
- `src/shared/contexts/DataContext.jsx` — single shared state store replacing prototype's `StoreProvider`. Holds all state slices, exposes all actions. `addProgressLog` auto-creates company/article records. `deleteLog` reverses KPI count.
- `src/main.jsx` — `DataProvider` added wrapping the whole app
- **Hooks** (all in `src/shared/hooks/`):
  - `useAuth.js` — re-export from AuthContext
  - `useCurrentUser.js` — returns `useAuth().user`
  - `useKPIs.js` — filters by program/assigneeId/archived, injects `status` via `calcKpiStatus`, `getKpiById` searches full list
  - `useTodos.js` — filters by type ('personal'/'team'/'all') and optional userId
  - `useTeam.js` — all users + `getMemberById`
  - `useDatabase.js` — companies + articles with search filter, `getLogsForEntity`
- **Utils** (all in `src/shared/utils/`):
  - `formatters.js` — `getLabel` (bilingual obj resolver), `formatDate`, `formatRelativeDate`, `formatProgress`, `formatCount`, `formatActivityType`, `truncateUrl`, `getProgramColor`
  - `statusCalculators.js` — `calcKpiStatus`, `calcPct`, `calcTodoStatus`, `isOverdue`

**Verified:** No console errors. App still loads correctly.

---

## How to Resume in a New Session

1. Read this file
2. Read `KPI Implementation Plan.md` for the next chunk's full spec
3. Start the dev server: `cd D:\Claude\IPA-KPI-repo && /c/nodejs/node.exe node_modules/vite/bin/vite.js` → `http://localhost:5173`
4. Pick up from **Chunk 9** (Firebase Authentication)

---

### ✅ LoginPage (pre-built, no chunk number)

**File:** `src/modules/auth/LoginPage.jsx`

Built the login form UI ahead of Chunk 9 so that chunk only needs to swap AuthContext (not the page). Form: email + password inputs, error display (maps Firebase error codes to human-readable messages), loading state on submit button, calls `useAuth().login()` → redirects to `/dashboard`. Currently works with the mock login (always succeeds).

---

### ✅ Chunk 8 — Full detail pages, Profile & Reports

**Files created:**

*Database detail pages:*
- `src/modules/database/companies/CompanyDetailPage.jsx` — breadcrumb, h1, two-column layout: left Card (controlled name/website/notes with Save + "✓ Saved" flash), right Card (activity history with user/KPI/date-range filters)
- `src/modules/database/articles/ArticleDetailPage.jsx` — same structure for articles (title/URL/notes)

*Profile:*
- `src/modules/profile/ProfilePage.jsx` — avatar header, display name input, language toggle (wired to setLang), "✓ Saved" feedback, disabled password fields (placeholder until Chunk 9)

*Reports:*
- `src/shared/utils/exportPDF.js` — stub: `export function exportToPDF() { window.print() }`
- `src/modules/reports/components/ReportFilters.jsx` — language toggle, scope selector (All/Program/Member) with conditional sub-selectors, date range inputs, Generate button
- `src/modules/reports/components/ReportPreview.jsx` — printable report with `useEffect`-injected `@media print` CSS isolating `#report-preview-root`; agency header, per-KPI sections (progress bar, activity breakdown by type, task completion ratio); fully bilingual via `reportLang` prop
- `src/modules/reports/ReportsPage.jsx` — assembles filters + preview + "Export PDF" button; `handleGenerate` applies scope/date filters then sets `reportData` state

**Verified:** `vite build` — 94 modules, zero errors.

**Key decisions:**
- CompanyDetailPage uses controlled state (not uncontrolled `defaultValue`) so Save is explicit, not on-blur
- Print CSS uses `body > * { display: none }` + `#report-preview-root { display: block }` pattern — no class knowledge of outer layout needed
- ReportPreview renders plain HTML `<div>` progress bars (not the shared ProgressBar component) for print compatibility
- Language in ReportFilters is independent of the app's UI language — report can be generated in GE while the UI is in EN

---

### ✅ Chunk 7 — Team + Database modules

**Files created:**

*Team module:*
- `src/modules/team/TeamPage.jsx` — admin-gated, search filter, MemberTable, "+ Add user" placeholder
- `src/modules/team/MemberDetailPage.jsx` — avatar header, KPI progress summary, last 10 logs, open todos with due-date chips, admin "Reassign KPIs" placeholder
- `src/modules/team/components/MemberTable.jsx` — shared Table with avatar+name, email, role badge columns
- `src/modules/team/components/MemberProgressSummary.jsx` — auto-fill grid of soft cards per KPI (progress bar, current/target, last activity date)

*Database module:*
- `src/modules/database/DatabaseLayout.jsx` — exports DatabaseContext + useDatabaseContext hook; flex row layout (central Outlet + optional RightSidebar); sub-nav (Companies / Articles) with NavLink active styling; closes sidebar on route change
- `src/modules/database/companies/CompaniesPage.jsx` — search, Table with name/website/activity count, row click opens right sidebar
- `src/modules/database/companies/CompanyDetailSidebar.jsx` — inline-editable name/website/notes (auto-save on blur), last 10 activity logs, "Open full page →" link
- `src/modules/database/articles/ArticlesPage.jsx` — same pattern, title/URL/mentions columns
- `src/modules/database/articles/ArticleDetailSidebar.jsx` — same structure as company sidebar

**Verified:** `vite build` — 91 modules, zero errors.

**Key decisions:**
- DatabaseLayout owns sidebar state; child pages call `useDatabaseContext().setSelectedRecord()`
- `useEffect` on `location.pathname` closes sidebar when switching Companies ↔ Articles
- Sidebar detail components pull live data via `getCompanyById`/`getArticleById` (not stale prop) — stays in sync after edits
- `defaultValue` (not `value`) on editable inputs so they're uncontrolled; `onBlur` saves the patch

---

### ✅ Chunk 6 — Todos Module

**Files created:**
- `src/modules/todos/TodosPage.jsx` — My/Team tabs, List/Board/Timeline view switcher, status filter, "New Todo" modal (title, due date, assignees for team), role-gated create button
- `src/modules/todos/components/ViewSwitcher.jsx` — 3-button pill toggle (List/Board/Timeline), persists to localStorage
- `src/modules/todos/components/TodoItem.jsx` — checkbox row, strikethrough when done, due date chip (red/amber/gray), subtask count, team assignee avatars, expandable subtask checkboxes
- `src/modules/todos/components/TodoListView.jsx` — 5 sections (Overdue/Today/This Week/Later/Done), collapsible, Done closed by default
- `src/modules/todos/components/TodoBoardView.jsx` — 3-column kanban (To Do/In Progress/Done), "→ next status" button per card
- `src/modules/todos/components/TodoTimelineView.jsx` — horizontal Gantt, 75-day window, colored dot at due date, today line, month header labels

**Verified:** `vite build` — 87 modules, zero errors.

**Key decisions:**
- `useTodos('personal', user.id)` + `useTodos('team')` called unconditionally, selected by tab
- View preference persisted to `localStorage` key `'todo-view'`
- `handleToggle` toggles between `'open'` and `'done'` (not through inProgress)
- Board view uses `onStatusChange` to advance: `open → inProgress → done`
- Timeline uses a 75-day window (today −14 to +60) with absolute-positioned dot markers

---

### ✅ Chunk 5 — KPI Detail + Progress Logging

**Files created:**
- `src/modules/kpis/KpiDetailPage.jsx` — header with program badge + assignee avatars, KpiProgressBar, log history table (with admin delete), TaskList, LogProgressModal wired up
- `src/modules/kpis/components/KpiProgressBar.jsx` — `current / target unit` display, percentage, ProgressBar, StatusBadge
- `src/modules/kpis/components/LogProgressModal.jsx` — 2-step modal: step 1 picks activity type + count; step 2 shows company autocomplete (meeting/call), URL input (article), or free text (other); resets on open
- `src/modules/kpis/components/TaskList.jsx` — expandable tasks with subtasks, status cycling (click badge), admin add/delete controls
- `src/modules/kpis/components/SubtaskItem.jsx` — checkbox row, strikethrough when done

**Verified:** `vite build` — 81 modules, zero errors.

**Key decisions:**
- Company autocomplete uses `useDatabase(companySearch)` at component top level — hook filters as user types
- `onMouseDown` (not `onClick`) in autocomplete dropdown prevents input blur from firing before selection
- `LogProgressModal` resets all state on `isOpen` via `useEffect`
- `KpiDetailPage` calls `getLogsForKpi` then sorts client-side descending
- Admin delete log button calls `deleteLog(id)` which reverses KPI current count in DataContext

---

### ✅ Chunk 4 — Dashboard + KPI List pages

**Files created:**
- `src/modules/dashboard/DashboardPage.jsx` — assembles KpiSummaryCards + TeamProgressOverview + RecentActivityFeed
- `src/modules/dashboard/components/KpiSummaryCards.jsx` — 3 stat cards (Total / On Track / At Risk)
- `src/modules/dashboard/components/TeamProgressOverview.jsx` — admin-only team health table (member × KPI count × last activity × status)
- `src/modules/dashboard/components/RecentActivityFeed.jsx` — last 10 logs with Quick Log placeholder button
- `src/modules/kpis/KpiListPage.jsx` — program + status + search filters, role-gated "New KPI" button
- `src/modules/kpis/components/KpiCard.jsx` — program badge, status badge, progress bar, deadline, avatar stack

**Verified:** `vite build` passes clean — 75 modules, zero errors.

**Key decisions:**
- `KpiListPage` calls `useKPIs()` and `useKPIs({ assigneeId })` unconditionally (hooks can't be conditional), picks by role
- `KpiCard` uses local `isOverdue()` helper rather than importing from statusCalculators to keep it self-contained
- `TeamProgressOverview` uses majority-vote over member's KPI statuses for the per-member status badge

---

### Chunk 3 — What to build next (old note, kept for reference)
- `src/shared/hooks/useKPIs.js`
- `src/shared/hooks/useTodos.js`
- `src/shared/hooks/useTeam.js`
- `src/shared/hooks/useDatabase.js`
- `src/shared/utils/formatters.js`
- `src/shared/utils/statusCalculators.js`

Source of truth for mock data: `hub-data.jsx` in repo root (the `SEED` object: USERS, KPIS, COMPANIES, ARTICLES, PROGRESS_LOGS, TODOS).

Run parallel subagents: Subagent A extracts `mockData.js` + `translations.js` (translations already done). Subagent B writes hooks + utils.
