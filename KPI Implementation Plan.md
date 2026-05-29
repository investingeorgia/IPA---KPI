# KPI Hub — Implementation Plan
Enterprise Georgia / IPA

---

## Project Context

- **Existing repo**: https://github.com/investingeorgia/IPA---KPI
- **Existing files to extract from**:
  - `app-a.jsx` (~700 lines React) — primary source for component logic and UI patterns
  - `shared.jsx` — data shapes, translation strings, helper functions
  - `styles.css` — complete stylesheet; copy as-is, do not modify
  - `KPI Hub - Sidebar.html` — prototype entry point; use as visual reference only
- **Stack**: Vite + React, React Router, Firebase (Auth + Firestore), Vercel
- **Auth and Firebase are deferred to Chunks 9–10.** Everything before uses mock/placeholder data. Do not install or configure Firebase before Chunk 9.

---

## Naming Conventions

Read this section before writing any code. All contributors must follow these conventions consistently.

| Category | Convention | Examples |
|---|---|---|
| Component files | PascalCase | `KpiCard.jsx`, `LogProgressModal.jsx` |
| Hook files | camelCase with `use` prefix | `useKPIs.js`, `useTodos.js` |
| Util files | camelCase | `formatters.js`, `statusCalculators.js` |
| Mock functions | `getMock` prefix | `getMockKPIs()`, `getMockUsers()` |
| Context names | noun + "Context" suffix | `AuthContext`, `LanguageContext` |
| Page components | noun + "Page" suffix | `KpiListPage`, `DashboardPage` |
| Module folders | lowercase plural | `kpis/`, `todos/`, `team/`, `database/` |
| CSS classes | kebab-case, module-prefixed | `kpi-card`, `todo-board-column` |
| Constants | SCREAMING_SNAKE_CASE | `ACTIVITY_TYPES`, `KPI_PROGRAMS` |
| Translation keys | dot notation matching route | `kpis.detail.logProgress` |

**Additional rules:**
- Never use default exports for hooks or utilities — always named exports
- Never import from `mockData.js` directly inside page components — always through a hook
- Each module folder has an `index.js` that exports its routes and page components
- Keep component files under 200 lines — split into sub-components if longer

---

## Full Folder Structure

```
IPA---KPI/
├── public/
│   └── favicon.ico
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── index.js
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── KpiSummaryCards.jsx
│   │   │   │   ├── TeamProgressOverview.jsx
│   │   │   │   └── RecentActivityFeed.jsx
│   │   │   └── index.js
│   │   ├── kpis/
│   │   │   ├── KpiListPage.jsx
│   │   │   ├── KpiDetailPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── KpiCard.jsx
│   │   │   │   ├── KpiProgressBar.jsx
│   │   │   │   ├── LogProgressModal.jsx
│   │   │   │   ├── TaskList.jsx
│   │   │   │   └── SubtaskItem.jsx
│   │   │   └── index.js
│   │   ├── todos/
│   │   │   ├── TodosPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── TodoListView.jsx
│   │   │   │   ├── TodoBoardView.jsx
│   │   │   │   ├── TodoTimelineView.jsx
│   │   │   │   ├── TodoItem.jsx
│   │   │   │   └── ViewSwitcher.jsx
│   │   │   └── index.js
│   │   ├── team/
│   │   │   ├── TeamPage.jsx
│   │   │   ├── MemberDetailPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── MemberTable.jsx
│   │   │   │   └── MemberProgressSummary.jsx
│   │   │   └── index.js
│   │   ├── database/
│   │   │   ├── DatabaseLayout.jsx
│   │   │   ├── companies/
│   │   │   │   ├── CompaniesPage.jsx
│   │   │   │   ├── CompanyDetailPage.jsx
│   │   │   │   └── CompanyDetailSidebar.jsx
│   │   │   ├── articles/
│   │   │   │   ├── ArticlesPage.jsx
│   │   │   │   ├── ArticleDetailPage.jsx
│   │   │   │   └── ArticleDetailSidebar.jsx
│   │   │   └── index.js
│   │   ├── profile/
│   │   │   ├── ProfilePage.jsx
│   │   │   └── index.js
│   │   └── reports/
│   │       ├── ReportsPage.jsx
│   │       ├── components/
│   │       │   ├── ReportPreview.jsx
│   │       │   └── ReportFilters.jsx
│   │       └── index.js
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── MainSidebar.jsx
│   │   │   │   └── RightSidebar.jsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   ├── SearchInput.jsx
│   │   │   │   └── Table.jsx
│   │   │   └── guards/
│   │   │       ├── ProtectedRoute.jsx
│   │   │       └── AdminRoute.jsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── LanguageContext.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useKPIs.js
│   │   │   ├── useTodos.js
│   │   │   ├── useTeam.js
│   │   │   ├── useDatabase.js
│   │   │   └── useCurrentUser.js
│   │   └── utils/
│   │       ├── formatters.js
│   │       ├── statusCalculators.js
│   │       ├── exportPDF.js
│   │       └── urlMetadata.js
│   │
│   ├── data/
│   │   ├── mockData.js
│   │   └── translations.js
│   │
│   └── styles/
│       └── styles.css
│
├── index.html
├── vite.config.js
├── .env.example
├── package.json
└── README.md
```

---

## Chunk Dependency Map

```
Chunk 1 (Scaffold)
  └── Chunk 2 (UI Library)
        └── Chunk 3 (Mock Data & Hooks)
              ├── Chunk 4 (Dashboard + KPI List)  ─┐
              │     └── Chunk 5 (KPI Detail)        │ can start
              ├── Chunk 6 (Todos)                   │ in parallel
              └── Chunk 7 (Team + Database)        ─┘
                    └── Chunk 8 (Detail Pages + Profile + Reports)
                          └── Chunk 9 (Firebase Auth)
                                └── Chunk 10 (Firestore Data)
                                      └── Chunk 11 (Deploy)
```

Chunks 4, 6, and 7 can be built in parallel once Chunk 3 is complete.

---

## CHUNK 1 — Project Scaffold & Routing Shell

**Goal:** Working Vite app with all routes defined, layout shell, mock auth, language context — app runs in the browser with no errors.

**Files created:**
`package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`,
`src/shared/contexts/AuthContext.jsx`, `src/shared/contexts/LanguageContext.jsx`,
`src/shared/components/guards/ProtectedRoute.jsx`, `src/shared/components/guards/AdminRoute.jsx`,
`src/styles/styles.css`, placeholder `index.js` for each module folder

**Parallel subagents:** None — must be sequential foundation.

**Steps:**
1. Run `npm create vite@latest . -- --template react` inside repo root (overwrites index.html, package.json — this is intended)
2. Install dependencies: `npm install react-router-dom`
3. Create the full folder structure (all directories from the tree above)
4. Copy existing `styles.css` from repo root → `src/styles/styles.css`
5. Write `src/main.jsx` — mounts `<App />`, wraps with `<AuthContext>` and `<LanguageContext>` providers, imports `src/styles/styles.css`
6. Write `src/App.jsx` — `BrowserRouter` with all routes defined. Each route points to a placeholder page that renders `<h1>PageName</h1>`. All routes:
   - `/login` → `LoginPage`
   - `/dashboard` → `DashboardPage`
   - `/kpis` → `KpiListPage`
   - `/kpis/:id` → `KpiDetailPage`
   - `/todos` → `TodosPage`
   - `/team` → `TeamPage` (wrapped in `AdminRoute`)
   - `/team/:userId` → `MemberDetailPage` (wrapped in `AdminRoute`)
   - `/profile` → `ProfilePage`
   - `/database` → redirect to `/database/companies`
   - `/database/companies` → `CompaniesPage`
   - `/database/companies/:id` → `CompanyDetailPage`
   - `/database/articles` → `ArticlesPage`
   - `/database/articles/:id` → `ArticleDetailPage`
   - `/reports` → `ReportsPage` (wrapped in `AdminRoute`)
7. Write `src/shared/contexts/AuthContext.jsx`:
   - Exports `AuthContext` and `useAuth()` hook
   - Hardcoded mock user: `{ id: 'user-1', name: 'Ana Kalandadze', email: 'ana@ipa.ge', role: 'admin', language: 'en' }`
   - Exports `login()` and `logout()` as no-ops for now
8. Write `src/shared/contexts/LanguageContext.jsx`:
   - Exports `LanguageContext` and `useLanguage()` hook
   - State: `lang` (default `'en'`), `setLang`
   - Exports `t(key)` function that resolves dot-notation keys against translations object (stub until Chunk 3 provides translations)
9. Write `ProtectedRoute.jsx` — reads `user` from `AuthContext`. Currently always passes (mock user always exists). Ready to redirect to `/login` when auth is real.
10. Write `AdminRoute.jsx` — reads `user.role` from `AuthContext`. Redirects to `/dashboard` if role is not `'admin'`. Currently passes because mock user is admin.

**Verification checklist:**
- [ ] `npm run dev` starts with zero errors in terminal and browser console
- [ ] Navigating to each route renders the correct placeholder `<h1>`
- [ ] `useAuth()` called in any component returns the mock admin user object
- [ ] `useLanguage()` returns `{ lang: 'en', setLang, t }` without throwing
- [ ] `ProtectedRoute` and `AdminRoute` pass through without redirect (mock admin user)
- [ ] No TypeScript errors (project is plain JS throughout)

**Notes:**
- Keep mock user as `role: 'admin'` until Chunk 9 — this lets all routes stay accessible throughout development
- Do not install Firebase in this chunk
- `LanguageContext` `t()` function should fail gracefully (return the key string) if translations are not yet loaded

---

## CHUNK 2 — Shared UI Component Library

**Goal:** All reusable UI primitives and layout components built and verified before any page work begins.

**Files created:**
`src/shared/components/layout/AppLayout.jsx`,
`src/shared/components/layout/MainSidebar.jsx`,
`src/shared/components/layout/RightSidebar.jsx`,
`src/shared/components/ui/Button.jsx`,
`src/shared/components/ui/Card.jsx`,
`src/shared/components/ui/Modal.jsx`,
`src/shared/components/ui/Badge.jsx`,
`src/shared/components/ui/ProgressBar.jsx`,
`src/shared/components/ui/StatusBadge.jsx`,
`src/shared/components/ui/SearchInput.jsx`,
`src/shared/components/ui/Table.jsx`

**Parallel subagents:** YES — split into two agents running simultaneously:
- **Subagent A**: Layout components (`AppLayout`, `MainSidebar`, `RightSidebar`)
- **Subagent B**: UI primitives (`Button`, `Card`, `Modal`, `Badge`, `ProgressBar`, `StatusBadge`, `SearchInput`, `Table`)

After both complete, integrate and verify together.

**Subagent A — Layout:**

1. `AppLayout.jsx` — flex row layout: `MainSidebar` (fixed 240px) + `<main>` (flex-1, scrollable) + optional `RightSidebar` (fixed 320px, conditionally rendered). Accepts `rightSidebarContent` prop — if truthy, renders `RightSidebar`. Used by every page.

2. `MainSidebar.jsx` — vertical navigation column:
   - Logo / app name at top
   - Nav links using `NavLink` from react-router-dom (active state styling):
     - Dashboard → `/dashboard`
     - KPIs → `/kpis`
     - To-Dos → `/todos`
     - Team → `/team` (only if `user.role === 'admin'`)
     - Database → `/database`
     - Reports → `/reports` (only if `user.role === 'admin'`)
     - Profile → `/profile`
   - User avatar + name at bottom
   - Language toggle (EN / GE) at bottom — calls `setLang` from `useLanguage()`
   - Uses `useAuth()` and `useLanguage()`

3. `RightSidebar.jsx` — slide-in panel from right side:
   - Props: `title` (string), `children`, `onClose` (function)
   - Close button (×) in top-right corner
   - Used exclusively in the Database module

**Subagent B — UI Primitives:**

1. `Button.jsx`
   - Props: `variant` (`primary`|`secondary`|`ghost`|`danger`), `size` (`sm`|`md`|`lg`), `onClick`, `disabled`, `loading`, `icon` (renders left of label)
   - `loading` prop shows spinner and disables interaction

2. `Card.jsx`
   - Props: `title` (optional header text), `children`, `actions` (optional JSX rendered top-right)
   - Consistent padding and border radius matching design system

3. `Modal.jsx`
   - Props: `isOpen`, `onClose`, `title`, `children`, `footer` (optional JSX for action buttons)
   - Renders as overlay + centered dialog
   - Closes on overlay click and `Escape` key press
   - Traps focus while open

4. `Badge.jsx`
   - Props: `label`, `color` (`green`|`yellow`|`red`|`gray`|`blue`)
   - Small colored pill, inline display

5. `ProgressBar.jsx`
   - Props: `value` (0–100 number), `color` (optional override), `showLabel` (boolean)
   - Auto-color if no override: green ≥ 70, yellow ≥ 40, red < 40
   - `showLabel` shows percentage text alongside bar

6. `StatusBadge.jsx`
   - Wraps `Badge`, maps status strings to display:
     - `'on-track'` → green, label "On Track"
     - `'at-risk'` → yellow, label "At Risk"
     - `'behind'` → red, label "Behind"
   - Uses `useLanguage()` for translated labels

7. `SearchInput.jsx`
   - Props: `value`, `onChange`, `placeholder`
   - Controlled input with search icon on left
   - Clears on × button click

8. `Table.jsx`
   - Props: `columns` (array of `{ key, label, sortable, render }`), `data` (array of objects), `onRowClick` (optional)
   - `render(value, row)` — optional custom cell renderer per column
   - Click on sortable column header toggles asc/desc sort
   - `onRowClick(row)` — makes rows hoverable and clickable

**Integration (after both subagents):**
1. Import `AppLayout` in `App.jsx`, wrap all route elements
2. Verify `MainSidebar` renders on all pages
3. Create a temporary `ComponentTestPage` at `/test` that renders one of each UI primitive with sample props — verify visually, then delete the route

**Verification checklist:**
- [ ] App renders with sidebar visible on all routes
- [ ] All nav links navigate correctly, active link is highlighted
- [ ] Admin-only links (Team, Reports) visible (mock user is admin)
- [ ] Language toggle renders in sidebar
- [ ] `<Modal>` opens and closes via button, overlay click, and Escape key
- [ ] `<Table>` renders with sample column/data, column sort works
- [ ] `<RightSidebar>` renders and closes
- [ ] `<ProgressBar>` shows correct auto-colors at 30, 55, 80 values
- [ ] `<StatusBadge>` shows correct colors for each status string
- [ ] No console errors on any route

**Notes:**
- All components must use CSS classes from `styles.css` where applicable — do not add inline styles
- Components must work without any props (sensible defaults for everything)

---

## CHUNK 3 — Mock Data & Hooks Layer

**Goal:** All data hooks return correctly-shaped mock data. Pages never import from `mockData.js` directly — only through hooks.

**Files created:**
`src/data/mockData.js`, `src/data/translations.js`,
`src/shared/hooks/useAuth.js`, `src/shared/hooks/useKPIs.js`,
`src/shared/hooks/useTodos.js`, `src/shared/hooks/useTeam.js`,
`src/shared/hooks/useDatabase.js`, `src/shared/hooks/useCurrentUser.js`,
`src/shared/utils/formatters.js`, `src/shared/utils/statusCalculators.js`

**Parallel subagents:** YES — split into two agents:
- **Subagent A**: Extract and write `mockData.js` and `translations.js` (read from `shared.jsx` and `app-a.jsx`)
- **Subagent B**: Write all hooks and utils (uses known data shapes)

**Subagent A — Data Extraction:**

`mockData.js` must export:

```js
export const ACTIVITY_TYPES = ['meeting', 'call', 'article', 'other']
export const KPI_PROGRAMS = ['investment-attraction', 'awareness', 'aftercare', 'fdi-grant']

export function getMockUsers()        // 11 users: 1 admin + 10 members
// Shape: { id, name, email, role, avatar, language }

export function getMockKPIs()         // KPIs distributed across 4 programs
// Shape: { id, title, program, target, unit, deadline, assignees[], status }

export function getMockTasks(kpiId)   // tasks for a given KPI with subtasks
// Shape: { id, kpiId, title, assignedTo, dueDate, status, subtasks[] }
// subtasks shape: { id, title, done }

export function getMockTodos()        // personal and team todos
// Shape: { id, title, type('personal'|'team'), ownerId, assignees[], status, dueDate, subtasks[] }

export function getMockProgressLogs() // activity logs across KPIs
// Shape: { id, kpiId, userId, activityType, count, entityType('company'|'article'), entityId, date }

export function getMockCompanies()    // companies referenced in logs
// Shape: { id, name, website, description, createdAt }

export function getMockArticles()     // articles referenced in logs
// Shape: { id, url, title, description, createdAt }
```

`translations.js` must export `{ en: {...}, ge: {...} }` extracted fully from `shared.jsx`, covering all UI strings. Keys use dot notation: `dashboard.title`, `kpis.status.onTrack`, `todos.views.board`, etc.

**Subagent B — Hooks & Utils:**

Each hook manages its own local state (mock data copied into `useState` on mount) so writes work within the session:

- `useAuth.js` — re-exports from `AuthContext`. Returns `{ user, login, logout }`.
- `useCurrentUser.js` — returns `useAuth().user`. Shorthand alias.
- `useKPIs.js` — accepts optional `filters` object (`{ program, status, assigneeId }`). Returns:
  `{ kpis, loading, getKpiById(id), addProgressLog(kpiId, logData), updateTask(taskId, changes), toggleSubtask(taskId, subtaskId) }`
- `useTodos.js` — accepts `type` (`'personal'|'team'|'all'`). Returns:
  `{ todos, loading, createTodo(data), updateTodo(id, changes), deleteTodo(id), toggleSubtask(todoId, subtaskId) }`
- `useTeam.js` — returns `{ members, loading, getMemberById(id), createUser(data), deactivateUser(id) }`
- `useDatabase.js` — returns `{ companies, articles, loading, getCompanyById(id), getArticleById(id), updateCompany(id, changes), updateArticle(id, changes), findOrCreateCompany(name), findOrCreateArticle(url) }`

Utils:
- `formatters.js`:
  - `formatDate(dateString)` → localized date string
  - `formatProgress(logged, target)` → `"42%"` string
  - `formatActivityType(type)` → display label e.g. `"Meeting"`
  - `truncateUrl(url, maxLength)` → shortened URL for display
- `statusCalculators.js`:
  - `calcKpiStatus(kpi)` → `'on-track'|'at-risk'|'behind'` based on progress vs deadline

**Verification checklist:**
- [ ] `getMockKPIs()` returns array with at least 8 KPIs across all 4 programs
- [ ] `getMockUsers()` returns exactly 11 users (1 admin, 10 with role 'user')
- [ ] `getMockProgressLogs()` returns logs that reference valid company/article IDs
- [ ] `translations.js` has both `en` and `ge` keys with matching structure
- [ ] `useKPIs({ program: 'awareness' })` returns only awareness program KPIs
- [ ] `useTodos('personal')` returns only todos with `type: 'personal'`
- [ ] `calcKpiStatus` returns `'behind'` for a KPI with 10% progress and 5 days to deadline
- [ ] `useLanguage().t('dashboard.title')` returns correct English string
- [ ] All hooks return `loading: false` once data is ready

---

## CHUNK 4 — Dashboard & KPI List Pages

**Goal:** Two fully functional pages with real mock data, role differences working.

**Files created:**
`src/modules/dashboard/DashboardPage.jsx`,
`src/modules/dashboard/components/KpiSummaryCards.jsx`,
`src/modules/dashboard/components/TeamProgressOverview.jsx`,
`src/modules/dashboard/components/RecentActivityFeed.jsx`,
`src/modules/kpis/KpiListPage.jsx`,
`src/modules/kpis/components/KpiCard.jsx`

**Parallel subagents:** YES
- **Subagent A**: Dashboard page and its components
- **Subagent B**: KPI list page and KpiCard

**Subagent A — Dashboard:**

1. `KpiSummaryCards.jsx` — row of 3 stat cards using shared `Card`:
   - Total KPIs (assigned to current user, or all for admin)
   - On Track count (green)
   - At Risk + Behind count (yellow/red)
   - Uses `useKPIs()` and `calcKpiStatus()`

2. `TeamProgressOverview.jsx` — only renders if `user.role === 'admin'`:
   - Table showing each team member: name, KPI count, last activity date, overall status
   - Uses `useTeam()` and `useKPIs()`

3. `RecentActivityFeed.jsx` — last 10 progress logs for current user:
   - Each row: date, KPI name, activity type, count, company/article name
   - "Log activity" quick button — opens `LogProgressModal` (placeholder `alert()` for now)

4. `DashboardPage.jsx` — assembles components in a responsive grid layout

**Subagent B — KPI List:**

1. `KpiCard.jsx` — clickable card showing:
   - KPI title and program badge
   - `ProgressBar` (logged count vs target)
   - `StatusBadge`
   - Deadline date
   - Assigned member avatars (stack up to 3, +N for more)
   - Click navigates to `/kpis/:id`

2. `KpiListPage.jsx`:
   - Header: "KPIs" title + "Create KPI" button (admin only, placeholder modal)
   - Filter bar: program selector + status selector (both multi-select)
   - Grid of `KpiCard` components
   - Admin: `useKPIs()` unfiltered. User: `useKPIs({ assigneeId: user.id })`
   - Empty state when filters return no results

**Verification checklist:**
- [ ] Dashboard renders all 3 sections for mock admin user
- [ ] `KpiSummaryCards` shows correct counts derived from mock data
- [ ] `TeamProgressOverview` renders for admin, is absent for user role
- [ ] KPI list shows all KPIs for admin
- [ ] Program and status filters reduce the list correctly
- [ ] KpiCard click navigates to `/kpis/:id`
- [ ] Temporarily set mock user role to `'user'` — TeamProgressOverview hidden, KPI list shows only assigned KPIs
- [ ] "Create KPI" button visible for admin, hidden for user

---

## CHUNK 5 — KPI Detail Page & Progress Logging

**Goal:** Full KPI detail view with 2-step progress logging and task management.

**Files created:**
`src/modules/kpis/KpiDetailPage.jsx`,
`src/modules/kpis/components/KpiProgressBar.jsx`,
`src/modules/kpis/components/LogProgressModal.jsx`,
`src/modules/kpis/components/TaskList.jsx`,
`src/modules/kpis/components/SubtaskItem.jsx`

**Parallel subagents:** None — components build on each other.

**Steps:**

1. `KpiProgressBar.jsx` — enhanced progress display:
   - Shows `logged / target unit` text (e.g. "42 / 100 meetings")
   - Percentage number
   - Color-coded `ProgressBar`
   - `StatusBadge` inline

2. `SubtaskItem.jsx` — single subtask row:
   - Checkbox (calls `toggleSubtask` on change)
   - Label with strike-through when done
   - Assignee name
   - Due date (red if overdue)

3. `TaskList.jsx` — list of tasks, each expandable to show subtasks:
   - Task header: title, assignee, due date, status badge
   - Click to expand/collapse subtasks
   - Admin only: "Add Task" button, edit (✏) and delete (🗑) icons per task
   - Both roles: `SubtaskItem` components within expanded task

4. `LogProgressModal.jsx` — 2-step modal using shared `Modal`:

   **Step 1:**
   - Activity type selector (buttons or select): `ACTIVITY_TYPES` constant
   - Count input (number, min 1)
   - "Next →" button

   **Step 2 (conditional on type):**
   - If `article`: URL text input with validation (must start with http)
   - If `meeting` or `call`: Company name input with autocomplete dropdown showing existing companies from `useDatabase()`
   - If `other`: free text label input
   - "← Back" and "Submit" buttons

   On submit:
   - Calls `addProgressLog(kpiId, { activityType, count, entityType, entityId, date: new Date() })`
   - Calls `findOrCreateCompany(name)` or `findOrCreateArticle(url)` to get/create `entityId`
   - Closes modal and refreshes log history

5. `KpiDetailPage.jsx`:
   - Header: KPI title, program badge, assigned members
   - `KpiProgressBar`
   - "Log Progress" button → opens `LogProgressModal`
   - Progress log history table: date, user name, activity type, count, company/article link
   - Admin only: delete row button per log entry
   - `TaskList`

**Verification checklist:**
- [ ] KPI detail page renders header, progress, history, and tasks from mock data
- [ ] "Log Progress" button opens modal
- [ ] Step 1 → Step 2 transition works for all 4 activity types
- [ ] Company name autocomplete shows existing mock companies as user types
- [ ] Submitting the modal adds a new row to the progress log history (local state)
- [ ] Company entered in modal appears in `useDatabase().companies` (findOrCreate worked)
- [ ] Task list renders with subtasks, expand/collapse works
- [ ] Checking a subtask marks it done inline (strike-through)
- [ ] Admin sees task add/edit/delete controls
- [ ] Temporarily set mock user to non-admin — task controls hidden, subtasks still checkable

---

## CHUNK 6 — Todos Module

**Goal:** Full todos page with list, board, and timeline views, personal/team toggle, all role logic.

**Files created:**
`src/modules/todos/TodosPage.jsx`,
`src/modules/todos/components/ViewSwitcher.jsx`,
`src/modules/todos/components/TodoItem.jsx`,
`src/modules/todos/components/TodoListView.jsx`,
`src/modules/todos/components/TodoBoardView.jsx`,
`src/modules/todos/components/TodoTimelineView.jsx`

**Parallel subagents:** YES
- **Subagent A**: `TodoListView` + `TodoItem`
- **Subagent B**: `TodoBoardView` + `TodoTimelineView`

Both subagents receive this shared interface for view components:
```js
// Props every view component accepts:
// todos: array of todo objects
// onToggle: (todoId) => void          — mark todo complete/incomplete
// onToggleSubtask: (todoId, subtaskId) => void
// onStatusChange: (todoId, newStatus) => void  — used by board view
```

**Subagent A:**

1. `TodoItem.jsx` — single todo row:
   - Checkbox (calls `onToggle`)
   - Title (strike-through if done)
   - Due date chip — red background if overdue, yellow if due today
   - Subtask count (e.g. "2/5 subtasks")
   - Assignee avatars (for team todos)
   - Expandable: click to show subtask list inline with individual checkboxes

2. `TodoListView.jsx` — groups todos into sections:
   - **Overdue** (red header)
   - **Due Today**
   - **This Week**
   - **Later**
   - **Completed** (collapsed by default)
   - Each section renders `TodoItem` components

**Subagent B:**

1. `TodoBoardView.jsx` — kanban board with 3 columns:
   - "To Do" | "In Progress" | "Done"
   - Each column shows todo cards (title, due date, assignees)
   - "→" button on each card advances status to next column (calls `onStatusChange`)
   - Column card count in header
   - No drag-and-drop required — button-based movement only

2. `TodoTimelineView.jsx` — horizontal Gantt-style:
   - Month columns across the top (current month ± 2 months)
   - Each todo is a horizontal row with a bar spanning its due date position
   - Bars are color-coded: red (overdue), yellow (due soon), green (on track), gray (done)
   - Todo titles shown left of the bar area
   - Today marker (vertical line)

**`TodosPage.jsx` (written after both subagents complete):**
1. Toggle tabs: **My Todos** / **Team Todos**
   - My Todos: `useTodos('personal')` filtered to current user's own todos
   - Team Todos: `useTodos('team')` — shows team todos, assignee visible
2. `ViewSwitcher.jsx` — 3-button toggle: List | Board | Timeline (stores in `localStorage` so preference persists)
3. Filter bar: status filter (All / Open / Done / Overdue)
4. "Create Todo" button:
   - Always visible in My Todos tab
   - Visible in Team Todos tab only for admin
   - Opens `Modal` with: title input, due date, optional subtasks (add/remove rows), assignees (team todos only)
5. Renders the active view component, passing filtered todos and handlers

**Verification checklist:**
- [ ] All 3 views render with mock todos
- [ ] Switching views preserves the current filter
- [ ] My Todos tab shows only personal todos for current user
- [ ] Team Todos tab shows team todos
- [ ] Status filter reduces visible todos in all 3 views
- [ ] Creating a todo (via modal) appends it to the list immediately
- [ ] Overdue todos highlighted red in all views
- [ ] Board view "→" button moves todo to next column
- [ ] Timeline view shows todos on approximately correct date positions
- [ ] "Create" button in Team Todos hidden when mock user set to non-admin

---

## CHUNK 7 — Team Module & Database Module

**Goal:** Team management pages (admin only) and the database module with central + right-sidebar layout.

**Parallel subagents:** YES — completely independent modules:
- **Subagent A**: Team module
- **Subagent B**: Database module

**Subagent A — Team:**

**Files:** `TeamPage.jsx`, `MemberDetailPage.jsx`, `MemberTable.jsx`, `MemberProgressSummary.jsx`

1. `MemberTable.jsx` — uses shared `Table` component:
   - Columns: avatar, name, email, role badge, active KPI count, last activity date
   - `onRowClick(member)` → navigate to `/team/:userId`

2. `MemberProgressSummary.jsx` — used on member detail page:
   - Row of cards, one per KPI assigned to the member
   - Each card: KPI title, progress bar, logged vs target, last activity date

3. `TeamPage.jsx`:
   - Wrapped in `AdminRoute`
   - Header: "Team" title + "Add User" button (placeholder modal with name/email/role fields)
   - `SearchInput` to filter members by name
   - `MemberTable` using `useTeam()`

4. `MemberDetailPage.jsx`:
   - Wrapped in `AdminRoute`
   - Back link to `/team`
   - Member header: avatar, name, email, role badge
   - `MemberProgressSummary` for their KPIs
   - Their recent progress logs (read-only table)
   - Their open todos (read-only list)
   - "Reassign KPIs" button (placeholder — opens modal listing all KPIs with checkboxes)

**Subagent B — Database:**

**Files:** `DatabaseLayout.jsx`, `CompaniesPage.jsx`, `CompanyDetailSidebar.jsx`, `ArticlesPage.jsx`, `ArticleDetailSidebar.jsx`

1. `DatabaseLayout.jsx`:
   - Extends `AppLayout` with `RightSidebar` slot
   - Maintains state: `selectedRecord` (company or article object) and `sidebarOpen`
   - Provides `DatabaseContext` with `{ selectedRecord, setSelectedRecord, closeSidebar }` so child pages can open the sidebar
   - Renders `<Outlet>` for sub-routes in central area
   - Renders `RightSidebar` when `sidebarOpen && selectedRecord`

2. `CompaniesPage.jsx`:
   - Heading: "Companies" + record count
   - `SearchInput` filtering by name
   - `Table` columns: name, website (clickable link), total activity count, last mentioned date, KPI tags
   - Row click → calls `setSelectedRecord(company)` to open sidebar
   - Uses `useDatabase()`

3. `CompanyDetailSidebar.jsx` — content rendered inside `RightSidebar`:
   - Company name (inline-editable — click to edit, blur to save)
   - Website URL (editable input + clickable link icon)
   - Notes / description (textarea, auto-saves on blur)
   - Activity history: last 10 logs mentioning this company — date, user, KPI name, type, count
   - "Open full page →" link to `/database/companies/:id`
   - Edits call `updateCompany(id, changes)` from `useDatabase()`

4. `ArticlesPage.jsx` — same pattern as `CompaniesPage`:
   - Table columns: title (truncated), URL (clickable), total mentions, last mentioned, KPI tags
   - Row click opens sidebar

5. `ArticleDetailSidebar.jsx` — same pattern as `CompanyDetailSidebar`:
   - Article title (editable)
   - URL (editable + clickable, opens in new tab)
   - Notes textarea
   - Activity history
   - "Open full page →" link

**Verification checklist:**
- [ ] `/team` renders member table, admin-only guard redirects non-admin
- [ ] Clicking a member navigates to `/team/:userId`
- [ ] Member detail shows their KPI summary, logs, and todos
- [ ] `/database/companies` shows companies table with data from mock
- [ ] Clicking a company row opens right sidebar with that company's data
- [ ] Editing company name in sidebar updates displayed name (local state)
- [ ] "Open full page →" link navigates to `/database/companies/:id` (placeholder for now)
- [ ] Same flow works for articles
- [ ] Sidebar close button (×) hides the sidebar
- [ ] Switching from companies to articles route closes any open sidebar

---

## CHUNK 8 — Full Detail Pages, Profile & Reports

**Goal:** Database full-page detail views, user profile, and report generation with PDF export.

**Parallel subagents:** YES
- **Subagent A**: `CompanyDetailPage`, `ArticleDetailPage`
- **Subagent B**: `ProfilePage`, `ReportsPage`, `ReportPreview`, `ReportFilters`

**Subagent A — Database Full Pages:**

1. `CompanyDetailPage.jsx` — full-width page at `/database/companies/:id`:
   - Two-column layout:
     - **Left column**: company name (editable), website (editable + link), notes textarea, "Save" button
     - **Right column**: full activity history table with filters — filter by user (dropdown), filter by KPI (dropdown), date range pickers
   - Uses `useDatabase().getCompanyById(id)` and `useDatabase().updateCompany()`
   - Breadcrumb: Database › Companies › [Company Name]

2. `ArticleDetailPage.jsx` — identical structure for articles:
   - Left: title, URL, notes
   - Right: full filterable activity history
   - Breadcrumb: Database › Articles › [Article Title]

**Subagent B — Profile & Reports:**

1. `ProfilePage.jsx`:
   - Display name input (pre-filled from `useCurrentUser()`)
   - Avatar: shows current avatar, "Change" button (placeholder — no upload yet)
   - Password section: Current password / New password / Confirm new password (all disabled placeholder fields until Chunk 9)
   - Language preference: EN / GE toggle — calls `setLang` from `useLanguage()` and updates local display
   - "Save Changes" button — updates local user state

2. `ReportFilters.jsx` — filter form component:
   - Language selector: English / Georgian (radio buttons)
   - Scope selector:
     - By Member (dropdown of team members) — admin only
     - By Program (dropdown of 4 programs)
     - All KPIs
   - Date range: start date + end date pickers
   - "Generate Report" button

3. `ReportPreview.jsx` — renders a styled HTML report:
   - Header: agency name, report title, date range, generated date — all in selected language
   - Per KPI section:
     - KPI name, program, target, current progress, status badge
     - Activity breakdown table: activity type, total count
     - Task completion: X of Y tasks complete
   - All labels in selected language (uses `t()` from `useLanguage()`)
   - Print-friendly styling

4. `ReportsPage.jsx`:
   - Wrapped in `AdminRoute`
   - Heading: "Reports"
   - Renders `ReportFilters`
   - On "Generate Report": filters KPI data from `useKPIs()` and renders `ReportPreview` below
   - "Export PDF" button — calls `window.print()` with print CSS that hides sidebar and filters
   - `exportPDF.js` stub: `export function exportToPDF() { window.print() }` (real PDF library in future iteration)

**Verification checklist:**
- [ ] `/database/companies/:id` renders company detail with left/right layout
- [ ] Company notes save (local state update) on button click
- [ ] Activity history filters work (by user, by KPI, by date range)
- [ ] Same for `/database/articles/:id`
- [ ] "Open full page →" link in sidebar navigates to correct detail page
- [ ] Profile page renders with mock user data pre-filled
- [ ] Language toggle on profile page switches the UI language globally
- [ ] `/reports` redirects non-admin to dashboard
- [ ] Selecting filters and clicking "Generate Report" renders `ReportPreview`
- [ ] Switching language in filters changes report preview language
- [ ] "Export PDF" triggers browser print dialog
- [ ] Report content renders clearly in print preview

---

## CHUNK 9 — Firebase Authentication

**Goal:** Replace mock `AuthContext` with real Firebase Auth. Login page works with real credentials.

**Pre-requisite (human step before starting this chunk):**
1. Create Firebase project at console.firebase.google.com
2. Enable Authentication → Email/Password provider
3. Create at least one user in Firebase Authentication console
4. Copy Firebase config keys into `.env` file (see `.env.example`)

**Files created/modified:**
`.env`, `.env.example`,
`src/firebase/firebaseConfig.js` (new),
`src/firebase/authService.js` (new),
`src/shared/contexts/AuthContext.jsx` (replace),
`src/modules/auth/LoginPage.jsx` (replace placeholder)

**Steps:**

1. Install Firebase: `npm install firebase`

2. `src/firebase/firebaseConfig.js`:
   ```js
   import { initializeApp } from 'firebase/app'
   import { getAuth } from 'firebase/auth'
   import { getFirestore } from 'firebase/firestore'

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     // ... rest of config
   }

   export const app = initializeApp(firebaseConfig)
   export const auth = getAuth(app)
   export const db = getFirestore(app)
   ```

3. `.env.example` — template file committed to repo:
   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

4. `src/firebase/authService.js` — exports:
   - `signIn(email, password)` → `signInWithEmailAndPassword(auth, email, password)`
   - `signOut()` → `firebaseSignOut(auth)`
   - `onAuthChange(callback)` → `onAuthStateChanged(auth, callback)`

5. Replace `AuthContext.jsx`:
   - `onAuthChange` listener sets Firebase user
   - On user change: fetch Firestore doc `users/{uid}` to get `name`, `role`, `language`
   - Loading state while auth resolves (show spinner, not a redirect)
   - `login(email, password)` calls `signIn()` and handles errors
   - `logout()` calls `signOut()`

6. Replace `LoginPage.jsx`:
   - Email + password form
   - Calls `useAuth().login(email, password)`
   - Shows error messages: "Invalid email", "Wrong password", "User not found"
   - Loading state on submit button
   - Redirects to `/dashboard` on success

7. Update `ProtectedRoute.jsx` — now redirects to `/login` if no Firebase user
8. Update `AdminRoute.jsx` — reads real role from Firestore user doc

**Verification checklist:**
- [ ] Login form with correct credentials redirects to `/dashboard`
- [ ] Login form with wrong password shows error message
- [ ] Logged-in state persists after page refresh
- [ ] Logout button in sidebar clears session and redirects to `/login`
- [ ] Navigating to protected route while logged out redirects to `/login`
- [ ] `useAuth().user` has correct `name`, `role`, `language` from Firestore `users/` doc
- [ ] Firebase user with `role: 'user'` is redirected away from `/team` and `/reports`

---

## CHUNK 10 — Firestore Data Layer

**Goal:** Replace all mock data hooks with real Firestore reads and writes. All data persists across sessions.

**Pre-requisite (human step):**
1. Enable Firestore in Firebase console
2. Start in test mode initially (open rules), then apply security rules from this chunk

**Files created/modified:**
`src/firebase/firestoreService.js` (new),
`src/firebase/seedData.js` (new),
`firestore.rules` (new),
all files in `src/shared/hooks/` (modify to use Firestore)

**Steps:**

1. `src/firebase/firestoreService.js` — one function per operation:

   KPIs:
   - `subscribeToKPIs(userId, role, callback)` — `onSnapshot` on `kpis` collection. Admin gets all; user gets where `assignees` array contains `userId`
   - `addProgressLog(logData)` — adds doc to `progress_logs` collection
   - `updateTask(taskId, changes)` — updates task doc
   - `toggleSubtask(kpiId, taskId, subtaskId, done)` — updates nested subtask

   Todos:
   - `subscribeToTodos(userId, type, callback)` — personal: `ownerId == userId`; team: `type == 'team'` and `assignees` contains userId or no assignees (visible to all)
   - `createTodo(data)` — adds doc to `todos`
   - `updateTodo(id, changes)` — updates doc
   - `toggleSubtask(todoId, subtaskId, done)` — updates subtask

   Users:
   - `subscribeToUsers(callback)` — `onSnapshot` on `users` (admin only)
   - `createUser(data)` — adds doc to `users` (Firebase Auth user creation handled separately)
   - `updateUser(id, changes)`

   Database:
   - `subscribeToCompanies(callback)` / `subscribeToArticles(callback)` — `onSnapshot`
   - `findOrCreateCompany(name)` — query by name, create if not found, return id
   - `findOrCreateArticle(url)` — query by url, create if not found, return id
   - `updateCompany(id, changes)` / `updateArticle(id, changes)`

2. `src/firebase/seedData.js` — one-time seeding script:
   - Reads from all `getMock*()` functions
   - Writes to Firestore in correct collections
   - Call once from browser console: `import { seed } from './firebase/seedData'; seed()`
   - Includes a guard to prevent double-seeding

3. `firestore.rules`:
   ```
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read their own doc; admin reads all
       match /users/{userId} {
         allow read: if request.auth.uid == userId || isAdmin();
         allow write: if isAdmin();
       }
       // KPIs: admin full access; user read if assigned
       match /kpis/{kpiId} {
         allow read: if isAdmin() || resource.data.assignees.hasAny([request.auth.uid]);
         allow write: if isAdmin();
       }
       // Progress logs: admin full; user write own, read own
       match /progress_logs/{logId} {
         allow read: if isAdmin() || resource.data.userId == request.auth.uid;
         allow create: if request.auth.uid == request.resource.data.userId;
         allow delete: if isAdmin();
       }
       // Todos: personal (owner only); team (assigned members + admin)
       match /todos/{todoId} {
         allow read, write: if isAdmin()
           || resource.data.ownerId == request.auth.uid
           || resource.data.assignees.hasAny([request.auth.uid]);
       }
       // Database: all authenticated users read; all can update (notes/description)
       match /companies/{companyId} {
         allow read, write: if request.auth != null;
       }
       match /articles/{articleId} {
         allow read, write: if request.auth != null;
       }

       function isAdmin() {
         return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

4. Replace each hook to use `firestoreService.js`:
   - Hooks use `useEffect` + `onSnapshot` subscription, return loading state
   - Write operations call Firestore directly and update local state optimistically
   - Error handling: surface errors via returned `error` field

**Verification checklist:**
- [ ] KPIs load from Firestore (verify by checking Firebase console)
- [ ] Logging progress creates a new doc in `progress_logs` collection
- [ ] Progress log appears in KPI detail history without page refresh
- [ ] Creating a todo persists after page refresh
- [ ] Checking off a subtask persists after page refresh
- [ ] Editing company notes persists after page refresh
- [ ] Open two browser tabs: action in tab 1 reflects in tab 2 in real time
- [ ] Non-admin user cannot read other users' personal todos (test rules in Firebase console)
- [ ] `seedData.js` populates all collections without duplicate guard errors on second run

---

## CHUNK 11 — Deploy & Final QA

**Goal:** Application live on Vercel, accessible via public URL, all features working end-to-end.

**Steps:**

1. Ensure all code is pushed to GitHub `main` branch
2. Go to vercel.com → "Add New Project" → Import from GitHub → select `IPA---KPI` repo
3. Framework preset: Vite (auto-detected)
4. Add all environment variables from `.env` in Vercel project settings
5. Deploy — Vercel builds and provides URL
6. In Firebase console → Authentication → Settings → Authorized domains → add the Vercel URL
7. In Firebase console → Firestore → Rules → publish `firestore.rules`

**Final E2E test sequence:**
1. Open Vercel URL → redirected to `/login` ✓
2. Login with admin credentials → `/dashboard` loads ✓
3. Navigate to KPIs → list loads from Firestore ✓
4. Open a KPI → log a progress entry with a new company name ✓
5. Go to Database → Companies → new company appears ✓
6. Create a team todo → appears in Team Todos ✓
7. Open Reports → generate and preview report in Georgian ✓
8. Print/export PDF ✓
9. Logout → redirected to `/login` ✓
10. Login with user (non-admin) credentials → Team and Reports links absent from sidebar ✓

**Verification checklist:**
- [ ] Vercel URL loads the app with no console errors
- [ ] Login works on deployed URL (Firebase authorized domain set)
- [ ] All 11 routes accessible and render correctly
- [ ] Real-time data updates work (open two tabs, confirm sync)
- [ ] Georgian language report renders correct characters
- [ ] PDF export works in production browser environment
- [ ] Non-admin user cannot access `/team` or `/reports`
- [ ] Firestore security rules block unauthorized reads (test in Firebase Rules Playground)

---

## Technology Decisions Log

| Decision | Choice | Reason |
|---|---|---|
| Build tool | Vite | Fast HMR, simple config, no ejecting needed |
| Routing | React Router v6 | Industry standard, nested routes for Database layout |
| State management | React hooks + Context | No Redux needed at this scale; Firebase provides real-time sync |
| Auth | Firebase Auth email/password | No self-registration needed; admin creates accounts |
| Database | Firestore | Real-time listeners, offline support, no server to maintain |
| PDF export | `window.print()` | Sufficient for report needs; avoids heavy PDF library |
| Styling | Existing `styles.css` | Already complete; no CSS framework added to avoid conflicts |
| Deployment | Vercel | Zero-config for Vite apps, free tier, auto-deploys from GitHub |
| Language | Plain JavaScript (no TypeScript) | Faster iteration; team familiarity |

---

## Swap Points (Mock → Real)

When Firebase is connected in Chunks 9–10, only these files change:

| File | What changes |
|---|---|
| `src/shared/contexts/AuthContext.jsx` | Mock user → `onAuthStateChanged` + Firestore user doc |
| `src/shared/hooks/useKPIs.js` | `getMockKPIs()` → `onSnapshot(collection(db, 'kpis'))` |
| `src/shared/hooks/useTodos.js` | Mock todos → Firestore query |
| `src/shared/hooks/useTeam.js` | Mock users → Firestore `users` collection |
| `src/shared/hooks/useDatabase.js` | Mock companies/articles → Firestore |

All page and component files remain untouched during the Firebase migration.
