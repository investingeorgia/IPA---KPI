# Handoff: IPA KPI Hub — Enterprise Georgia

## Overview
Internal platform for **Enterprise Georgia's** Investment Promotion Agency (IPA) to track KPIs
against quarterly targets, log activity, coordinate to-dos, and auto-build a company/article
database from that activity. **11 users: 1 admin + 10 members** across 4 programs — Investment
Attraction, Awareness, Aftercare, FDI Grant. Bilingual **English / Georgian** throughout
(language preference per user; also controls report export language).

This handoff implements the uploaded **`IPA-KPI-sitemap.md`** (included in this folder) — that file
is the source of truth for routes, role matrix, and the Firestore data model. This README adds the
visual + interaction spec.

## About the Design Files
These files are a **working design reference built in React via in-browser Babel** (no build step) —
a high-fidelity, fully interactive prototype. They are **not the production codebase**. Recreate this
in the target stack described in the sitemap: **React (Vite) + Firebase (Firestore + Auth) +
Vercel**, using the module architecture the sitemap lays out (`src/modules/*`, `src/shared/*`,
`src/data/mockData.js`). All state here is in-memory mock data (`hub-data.jsx` → `SEED`) standing in
for Firestore; swap it for real collections + auth.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, and interactions are final and should be matched
closely (tokens under **Design Tokens**). Replace the hand-rolled primitives (inline-SVG icons,
progress bars, avatars, modal) with the codebase's component library where one exists.

---

## Global structure
- **Auth gate**: logged-out → `/login`. Logged-in → app shell.
- **App shell**: persistent **236px left sidebar** (logo, Quick-log button, nav, profile chip) + main
  column (top bar + scrolling content). The top bar has search, a **role/user switcher** (prototype
  convenience to impersonate any of the 11 users — in production this is just the authenticated user),
  EN/ქა language toggle, notifications, and log-out.
- **Routing**: hash-based in the prototype (`#/dashboard`, `#/kpis/:id`, …). In production use the
  router from the sitemap's route list. Admin-only routes (`/team*`, `/reports`) redirect members to
  `/dashboard`; admin-only nav items are hidden for members.
- **Role-gating** follows the sitemap's **Role Matrix** exactly (e.g. members see only their assigned
  KPIs and only their own progress logs; only admin can create/edit/archive KPIs, manage users,
  delete logs, create team to-dos, or export reports).

## Screens / Views

### `/login`
Split screen. Left: logo, "Sign in", email + password (42px tall inputs), full-width primary button,
and a prototype-only "pick a role" card (Admin / Member). Right: `--green-900` panel with a 40px
headline and 3 stats (Programs / KPIs / Team). Copy: "Accounts are created by your administrator."

### `/dashboard`
Header "Hello, {firstName}". **Summary cards** (4-col `1.3fr 1fr 1fr 1fr`): Total KPIs (accent green
card) + On track / At risk / Behind counts. Then a 2-col region:
- **Member**: a compact list of their KPIs (name, progress bar, current/target, status badge).
- **Admin**: "Team KPI health" — per-program average progress bars + a "no recent activity" amber
  badge counting KPIs with no log in the last 7 days.
- **Right rail (both)**: "My open tasks" (count, overdue badge, top 4 with checkboxes) + "Recent
  activity" feed (avatar dot, "{user} logged +N {type} · {KPI}", entity, date). Members see only their
  own activity; admin sees the team's.

### `/kpis` + `/kpis/:id`
- **List**: program filter segmented control + (admin) "New KPI". Table columns: KPI, program pill,
  progress bar + %, assignee avatar stack, deadline (amber if <14 days), status badge, chevron.
  Members see only assigned KPIs.
- **Detail**: hero card (program pill + status badge, title, deadline, assignee stack, big
  current/target + %, large progress bar) with **Log progress** (both roles) and **Edit** (admin).
  Below: **Progress log** (each entry: activity icon, +count, linked company/article, comment, user,
  date; admin gets a delete button) and **Tasks** (each task: title, assignee, due; inline-checkable
  subtasks with a done/total counter; admin can add tasks).

### Log Progress — 2-step modal (the core interaction)
Opened from the sidebar **Quick log** or a KPI's **Log progress**.
- **Step 1**: choose KPI (defaults to the one in context), pick **activity type** (Meeting / Call /
  Article / Other — 2×… icon-card selector), set **count** (−/+ stepper + numeric input).
- **Step 2**: if type = Article → an **article link** field; otherwise a **company name** field
  (with autocomplete datalist of existing companies). A live hint states whether the entry will
  **link to an existing record** or **create a new one**. Optional comment. On submit: the log is
  saved, the KPI's `current` increments by the count, and the company/article is **auto-created in the
  database if it doesn't already exist** (matched case-insensitively by company name / article URL).
  This is the only way DB records are created — no manual data entry.

### `/todos`
Header with open/done counts + (admin or personal scope) "New to-do". Controls: **My to-dos /
Team to-dos** toggle, **List / Board / Timeline** view switch, and an **All / Open / Done / Overdue**
status filter.
- **List**: cards with a checkbox, title (strike-through when done), inline subtasks, due pill (red if
  overdue), team badge, assignee stack, delete.
- **Board**: 3 Kanban columns (To do / In progress / Done); clicking a card advances it to the next
  column.
- **Timeline**: horizontal Gantt — one row per open item, a colored bar positioned by due date
  (red = overdue, amber = ≤3 days, green otherwise) against a "today" gridline.
- **My to-dos** = personal items owned by the current user. **Team to-dos** = `type:'team'` items;
  admin creates them and picks assignees; members see only those assigned to them and can complete
  their items.

### `/team` + `/team/:userId` (admin only)
- **Team management**: roster table (avatar+name, email, role badge, active-KPI count, last-activity
  date — amber if >7 days) + "New user" (name, email, role, program; temp password emailed). Row →
  member detail.
- **Member detail**: profile header with KPI/activity/open-task stat trio; their assigned KPIs (with
  progress + a Reassign action), their full progress-log history, and their open to-dos.

### `/profile`
Avatar + name edit, **language preference** (English / ქართული — also controls export language),
and a change-password card.

### `/database` (→ `/database/companies` by default)
Three-pane: **Companies / Articles** tabs → searchable central table → **right detail sidebar** that
opens on row-click *without navigating*.
- **Companies table**: name, website, total mentions, last mentioned, KPIs it appears in.
- **Articles table**: title, mentions, last mentioned, appears-in.
- **Detail sidebar**: editable name/title, editable website or clickable URL, editable notes,
  appears-in KPI pills, and an **activity history** feed (every log mentioning this record). An
  "Open full page" link → the dedicated route.
- **`/database/companies/:id` & `/database/articles/:id`**: full-width detail + the activity history
  as a **filterable table** (filter by user and by KPI). Records are never manually created or deleted
  by users — they're a byproduct of progress logging.

### `/reports` (admin only)
Left config panel: report **language** (EN/ქა), **scope** (All KPIs / a program / an individual
member), **date range**, and **Export PDF** (browser print-to-PDF — only the report sheet prints, via
the `@media print` rule + `#report-sheet`). Right: a **live A4-style preview** — letterhead, a 4-stat
summary band (KPIs, activities, avg progress, task-completion rate), a KPI breakdown table
(name, program, progress, target, status), and an activity-type summary. Content reflects the chosen
scope/range live.

## Interactions & Behavior
- KPI `current` is incremented by progress logs (prototype stores `current` directly; production may
  derive it from the sum of `progress_logs.count`). Status is derived: ≥95 done, ≥70 on-track, ≥40
  at-risk, else behind. Progress-bar tint: <40 red, <70 amber, else green.
- Checkboxes (subtasks, to-dos) toggle immediately. Board cards advance status on click.
- Database auto-population on log submit (see Log modal). Existing-record match is case-insensitive on
  company name / article URL.
- Language toggle re-renders all labels from the `L` dictionary (`tr(key, lang)`); `lang-ge` swaps the
  font to Noto Sans Georgian.
- Admin guards: visiting `/team*` or `/reports` as a member redirects to `/dashboard`.

## State Management
Prototype: a single React context (`StoreProvider` in `hub-data.jsx`) holds `users, kpis, companies,
articles, logs, todos, currentUserId, lang` and exposes actions: `login/logout, setLang, logProgress,
deleteLog, createKpi, updateKpi, archiveKpi, addTask, toggleSubtask, updateCompany, updateArticle,
createTodo, updateTodo, deleteTodo, toggleTodoSub`. Replace with Firestore reads/writes + AuthContext;
keep the action surface as your data-hook API (`useAuth`, `useCurrentUser`, per-module hooks).

## Data Model
See **`IPA-KPI-sitemap.md` → Data Model** (Firestore collections: `users`, `kpis` + `tasks`/`subtasks`
subcollections, `progress_logs`, `todos` + `subtasks`, `companies`, `articles`). The prototype's
`SEED` object in `hub-data.jsx` mirrors that shape and is usable as realistic fixtures /
`mockData.js`.

## Design Tokens
Defined as CSS variables in `styles.css` (`:root`).
- **Color**: primary `--green-900 #0B3D2E`; greens `#1F5A45 / #3E8367 / #B9D4C7 / #DCE9E2 / #EEF5F0`;
  surfaces `--cream #FAF7F1`, `--cream-2 #F3EFE6`; ink `#1A1A17 / #4A4A45 / #8A8A82 / #C7C5BD`;
  `--line #E8E3D7`; `--warn #C77A2B`; `--danger #B14C3A`.
- **Program colors**: invest `#0B3D2E`, awareness `#C77A2B`, aftercare `#5A6FB8`, fdi `#8B4A8E` (each
  with a soft `cat-bg-*` tint for pills).
- **Status badges**: green (on-track/done), amber (at-risk/in-progress), red (behind/overdue), gray
  (open/todo).
- **Radius**: 8 / 12 / 18 (cards) / 28 (`--r-xl`); pills & avatars 999px.
- **Shadow**: `--shadow-1` (subtle), `--shadow-2` (overlays/menus).
- **Type**: UI **Inter Tight**; Georgian **Noto Sans Georgian** (via `.lang-ge`); numbers **JetBrains
  Mono** (`.mono`). Scale: 30 (page titles), 22–24 (section/detail), 14–15 (card titles), 13 (body),
  11–12 (labels), 10.5 uppercase (table headers).
- Reusable classes worth mirroring: `.btn`, `.card`, `.pill`, `.badge`, `.pb`/`.pb-fill`, `.avatar`,
  `.seg`, `.tabs`, `.tbl-head`/`.tbl-row`, `.kanban*`, `.three-pane`/`.detail-pane`, `.modal*`,
  `.cbx`, `.gantt*`, `.feed-item`.

## Assets
No external images. Icons are inline SVG in the `Icon` component (`hub-data.jsx`) — map to
Lucide/Heroicons. Fonts via Google Fonts (`styles.css`). The green concentric-circle "target" is the
logo mark.

## Files
- **`IPA-KPI-sitemap.md`** — the authoritative routes / role matrix / data model / architecture spec.
- **`IPA KPI Hub (standalone).html`** — self-contained build; **double-click to view** the live
  reference (works offline, no server).
- **`IPA KPI Hub.html`** — entry point that loads the modules below (readable source).
- **`styles.css`** — tokens + all component classes.
- **`hub-data.jsx`** — i18n (`L`/`tr`), mock data (`SEED`), helpers, store/context, hash router, UI
  primitives.
- **`hub-shell.jsx`** — Login + app shell (sidebar, top bar, router, role switcher).
- **`hub-dashboard.jsx`** · **`hub-kpis.jsx`** (list + log/create modals) · **`hub-kpi-detail.jsx`**
  (detail + edit) · **`hub-todos.jsx`** (list/board/timeline) · **`hub-team.jsx`** (team + member +
  profile) · **`hub-database.jsx`** (companies/articles 3-pane + full page) · **`hub-reports.jsx`**.

> The in-browser Babel setup is for previewing only — don't carry it into production.
