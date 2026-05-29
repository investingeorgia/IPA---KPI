# Handoff: Enterprise Georgia — KPI Hub (Sidebar)

## Overview
KPI Hub is an internal platform for **Enterprise Georgia** where a team tracks
Key Performance Indicators against quarterly targets, updates progress, and
coordinates work through a shared to-do list. It serves **11 users: 1 admin +
10 team members**, organized into 4 programs:

- **Investment Attraction** (`invest`)
- **Awareness** (`awareness`)
- **Aftercare** (`aftercare`)
- **FDI Grant** (`fdi`)

The interface is **bilingual (English / Georgian)** with a live language toggle.

## About the Design Files
The files in this bundle are **design references created in HTML/React (via in-browser Babel)** —
a working prototype showing the intended look and behavior. They are **not production
code to ship directly**. Your task is to **recreate this design in the target codebase's
existing environment** (React/Vue/Svelte/etc.) using its established component library,
routing, state management, and styling conventions. If no front-end environment exists
yet, pick the most appropriate framework (a React + Vite + TypeScript SPA is a sound
default for this kind of dashboard) and implement the design there.

The prototype keeps all state in-memory (React `useState`) with seeded mock data. In
production this should be backed by a real API and database (see **State Management** and
**Data Model**).

## Fidelity
**High-fidelity.** Colors, typography, spacing, border-radii, and interactions are final
and intended to be matched closely. Exact tokens are listed under **Design Tokens**.
Recreate the UI faithfully, but swap the hand-rolled primitives (icons, progress bars,
avatars) for the codebase's equivalents where they exist.

---

## Screens / Views

The app is a single authenticated workspace with a persistent **240px left sidebar** +
a main content column (top bar + scrolling body). Navigation switches between 5 views.
There is no separate routing in the prototype — in production each view should be a route
(e.g. `/dashboard`, `/me`, `/todo`, `/team`, `/kpi/:id`).

### Global chrome

**Sidebar (240px, fixed, white, 1px right border `--line`)**
- Logo lockup: 32×32 rounded-9px green (`--green-900`) tile with a target icon, "KPI Hub"
  (700, 14px) + "Enterprise Georgia" (11px, `--ink-3`).
- Nav items (10px vertical gap, each `padding:10px`, `border-radius:10px`): Admin (grid icon,
  badge "10"), My Dashboard (user icon), To-do (list icon, badge "13"), Team (users icon,
  badge "11"), KPI Detail (target icon). Active item: `--green-50` bg, `--green-900` text.
  Inactive: transparent, `--ink-2` text. Badges: 10px text, `--cream-2` pill.
- Bottom block: quarter card ("Q2 · 2026", "34 days", "days left in quarter") on `--green-50`
  with `--green-100` border, radius 14px; then the EN/KA language toggle.

**Top bar (main column header, `padding:20px 28px 12px`, 1px bottom border)**
- Left: view title (22px, 600) + optional subtitle (13px, `--ink-3`).
- Right: search input (pill, 220px, 36px tall, `--cream` bg, leading search icon),
  bell icon button, user switcher chip.
- **User switcher**: `--cream-2` pill with avatar + name + chevron. Opens a dropdown
  (220px, white, radius 14px, shadow-2) listing all 11 members; selecting one changes the
  "current user" lens. Admin row shows an "ADMIN" badge.

### 1. Admin — Team overview (`admin`)
- **Purpose**: org-wide KPI health at a glance.
- **Layout**: vertical stack, 20px gap.
  - **Stat row**: 4-col grid `1.4fr 1fr 1fr 1fr`, 14px gap.
    - Card 1 (accent, `--green-900` bg, white text): "Overall progress", big % (32px), a large
      progress bar, subtitle "N KPIs · across team".
    - Cards 2–4 (white): On track / At risk / Behind counts, with a category-colored dot.
  - **By-category panel** (white card, radius 18px): header row with "By category" / "By member"
    toggle buttons; then one row per program — `220px 1fr 140px 60px` grid: program dot+name+"N KPIs",
    progress bar, avatar stack (up to 3) + "N members", right-aligned mono percentage.
  - **All indicators table** (white card): column header row (uppercase 10.5px labels) then up to 10
    KPI rows. Grid `1.7fr 1fr 110px 1fr 90px 110px 32px`: indicator name, category pill, assignee
    avatar+first-name, progress bar, mono `current/target`, status pill, chevron. Clicking a row opens
    KPI Detail for that KPI.

### 2. My Dashboard — member view (`member`)
- **Purpose**: the signed-in (or impersonated) member sees their own KPIs and updates them.
- **Layout**:
  - Header: 56px avatar + "Hello, {firstName}", "N active KPIs · {category pill}".
  - 2-col grid of **KPI cards** (white, radius 18px, 18px padding):
    - Category pill, KPI name (15px, 600), "Goal: {goal}", status pill (top-right).
    - `current / target {unit}` (mono, 22px) + right-aligned mono % colored by status.
    - Progress bar.
    - Action row: `−1`, `+1`, `+5` ghost buttons, then "Push update" (opens an inline numeric
      input + confirm/cancel), and a chevron to open KPI Detail.
- If the member owns no KPIs, fall back to showing the first 4 KPIs in their program.

### 3. To-do (`todo`)
- **Purpose**: shared task list for the whole team, **grouped by deadline bucket** (single page,
  not kanban).
- **Layout**: `1fr 280px` grid (list + right rail).
  - **Filter row**: category chips (All / Investment / Awareness / Aftercare / FDI). Active chip:
    `--green-900` bg, white. "Add task" primary button (right-aligned) toggles an inline composer.
  - **Inline composer** (`--green-50` card): `2fr 1fr 1fr 1fr auto` grid — title input, category select,
    assignee select (members only), due select (Today / Tomorrow / in 3 days / in 1 week), Add button.
  - **Buckets** in fixed order, each shown only if non-empty: **Overdue** (flag, `--danger`), **Today**
    (dot, green), **Tomorrow**, **This week**, **Next week**, **Later** (calendar icons). Each bucket: a
    header (icon + label + count) then task cards.
  - **Task card** (white, radius 18px, `padding:12px 14px`): a 20px checkbox (checked = `--green-900`
    fill + white check), title (strikethrough + 55% opacity when done), a relative-date pill (red when
    overdue) + category pill, and assignee avatar + first name. Toggling the checkbox flips `done`.
  - **Right rail**: "This week" card (open-task count + overdue/today/done mini-list) and a "Team" card
    (per-member open-task counts).

### 4. Team management (`team`) — admin
- **Purpose**: roster + per-member load and performance.
- **Layout**:
  - 4 stat cards: Members (accent, "11", "10 member · 1 admin"), Programs ("4"), KPIs owned ("19"),
    Open tasks (live count).
  - **Roster table** (white card): header "Team management" + "Invite member" primary button. Column
    header row, then one row per member. Grid `1.6fr 90px 1fr 110px 100px 90px 32px`: avatar+name,
    role pill (Admin = green pill, Member = gray pill), program pill, KPIs-owned (mono, centered),
    open-tasks (mono, centered), avg-progress (small bar + mono %, or "—" if none), chevron. Clicking a
    row switches the current user to that member and opens My Dashboard.

### 5. KPI Detail (`kpi`)
- **Purpose**: drill into one indicator; see history and push an update.
- **Layout**: `1.5fr 1fr` grid.
  - **Left column**:
    - **Hero card** (white): category pill + "Goal: {goal}", KPI name (24px), a row with Current (mono
      38px), Target (mono 18px), and right-aligned status pill + big mono % (28px). Large progress bar
      with 0 / target end labels.
    - **History card**: header "History" + "Weekly velocity: +N/wk" + 1M/3M/Q range toggle. A 140px-tall
      bar chart of 6 fake datapoints with a dashed target line; last bar is `--green-900`, others
      `--green-200`. Date labels below.
    - **Related tasks card**: tasks from the same category (reuses the to-do card).
  - **Right column**:
    - **Push-update panel** (`--green-900` bg, white): "New value" numeric input (large mono),
      "Comment (optional)" textarea, "Push update" white confirm button. Submitting sets the KPI's
      current value.
    - **Contributors card**: lead owner (40px avatar) + "Lead · {updated}".
    - **Recent updates card**: timeline of update events (avatar, text, time, optional green delta pill).

---

## Interactions & Behavior
- **Navigation**: sidebar items switch the active view (prototype: local state; production: routes).
  Clicking a KPI row (Admin table, member card chevron, related-KPI) opens KPI Detail for that KPI.
  Clicking a Team row switches the impersonated user and navigates to My Dashboard.
- **Language toggle (EN/KA)**: flips every label via the `T` dictionary and `t(key, lang)` helper;
  the root element also gets `lang-ka` which switches the font stack to Noto Sans Georgian.
- **User switcher**: changes which member's data the "My Dashboard" lens shows. (In production this is
  the authenticated user; admin impersonation is optional.)
- **KPI updates**: `−1 / +1 / +5` increment buttons mutate `current` immediately (clamped at ≥ 0);
  "Push update" / the detail panel set an exact value. Progress bars and percentages animate
  (`width .4s cubic-bezier(.3,.7,.2,1)`).
- **Add task**: composer appends a new task with a generated id, chosen category/assignee/due bucket,
  `done:false`.
- **Toggle task**: checkbox flips `done`; done tasks render struck-through at 55% opacity and drop out
  of "open" counts.
- **Status derivation** (`statusOf(current, target)` on the % completion): ≥95 `done`, ≥70 `onTrack`,
  ≥40 `atRisk`, else `behind`. Progress-bar tint: <40% red, <70% amber, else green.
- **Hover/focus**: ghost buttons → `--cream-2` bg; icon buttons → `--cream-2` bg + darker icon; inputs
  on focus → `--green-500` border + 3px `--green-100` ring. (Add subtle row hover backgrounds on the
  clickable table rows in production — the prototype leaves them transparent.)

## State Management
Prototype state (all `useState` in `AppA`):
- `lang` — `'en' | 'ka'`
- `view` — `'admin' | 'member' | 'todo' | 'team' | 'kpi'`
- `currentUser` — member id (the dashboard/impersonation lens; default `'m0'` = admin)
- `categories` — the KPI tree (mutated on every value update)
- `todos` — task array (mutated on add/toggle)
- `selectedKpi` — KPI id shown in detail
- `filterCat` — active to-do category filter
- assorted local UI flags (composer open, inline-edit open, dropdown open)

**Production guidance**: replace seeded arrays with API-backed queries; KPI updates and task
mutations should be optimistic writes to the server. Auth determines the real current user and role;
the admin-only views (Admin overview, Team management) must be gated by role. Each KPI value update
should create an immutable **update event** (value, author, comment, timestamp) — the "Recent updates"
and "History" UIs are designed to render exactly that event stream.

## Data Model
```
Member   { id, name_en, name_ka, role: 'admin'|'member', program, initials, color }
Category { id, name{en,ka}, kpis: KPI[] }
KPI      { id, name{en,ka}, goal, current, target, unit ('#' | 'M' | ''), owner: MemberId, updated }
Todo     { id, title{en,ka}, dueDays (rel. to today; <0 overdue), assignee: MemberId, category, done }
UpdateEvent (recommended) { id, kpiId, value, delta, authorId, comment, createdAt }
```
Seed data for all of the above lives in `shared.jsx` (`MEMBERS`, `CATEGORIES`, `INITIAL_TODOS`) and
can be used as realistic fixtures. Deadlines use a relative `dueDays` int in the prototype; production
should store real ISO dates and compute the bucket client-side (`bucketOf`).

## Design Tokens
All defined as CSS custom properties in `styles.css` (`:root`).

**Color**
| Token | Hex | Use |
|---|---|---|
| `--green-900` | `#0B3D2E` | primary / accent surfaces, filled progress, primary buttons |
| `--green-700` | `#1F5A45` | — |
| `--green-500` | `#3E8367` | input focus border / "done" status |
| `--green-200` | `#B9D4C7` | chart bars (non-final) |
| `--green-100` | `#DCE9E2` | green pill bg, accent card borders |
| `--green-50`  | `#EEF5F0` | active nav bg, progress track |
| `--cream`     | `#FAF7F1` | app background |
| `--cream-2`   | `#F3EFE6` | chips, ghost-button hover, badges |
| `--ink`       | `#1A1A17` | primary text |
| `--ink-2`     | `#4A4A45` | secondary text |
| `--ink-3`     | `#8A8A82` | tertiary / labels |
| `--ink-4`     | `#C7C5BD` | faint / empty |
| `--line`      | `#E8E3D7` | borders / dividers |
| `--warn`      | `#C77A2B` | amber status / "at risk" |
| `--danger`    | `#B14C3A` | red status / overdue / "behind" |

**Category colors**: invest `#0B3D2E`, awareness `#C77A2B`, aftercare `#5A6FB8`, fdi `#8B4A8E`
(each with a soft `cat-bg-*` tint for pills).

**Radius**: `--r-sm 8px`, `--r-md 12px`, `--r-lg 18px` (cards), `--r-xl 28px`; pills/avatars `999px`.

**Shadow**: `--shadow-1 0 1px 2px rgba(20,20,15,.04), 0 2px 8px rgba(20,20,15,.04)`;
`--shadow-2 0 4px 14px rgba(20,20,15,.06), 0 10px 32px rgba(20,20,15,.06)`.

**Typography**
- UI / Latin: **Inter Tight** (400/500/600/700), `letter-spacing:-0.005em`, `font-feature-settings:'ss01','cv11'`.
- Georgian: **Noto Sans Georgian** (applied via `.lang-ka`).
- Numbers / data: **JetBrains Mono** (`.mono`, `letter-spacing:-0.02em`).
- Scale in use: 32px (stat values), 22–24px (titles/detail), 15–16px (card titles), 13px (body),
  11–12px (labels), 10.5px uppercase (table headers, `letter-spacing:0.06em`).

**Spacing**: 14–20px card padding, 14–20px grid gaps, 8–12px intra-card gaps.

**Avatars**: 22 (sm) / 28 (default) / 40 (lg) / 56px (xl), circular, initials, per-member color on a
14%-tinted background; stacks overlap −6px with a 2px white ring.

**Progress bar**: track `--green-50`, fill `--green-900` (or amber/red by status), height 6 (sm) /
8 (default) / 12px (lg), fully rounded.

## Assets
No external image assets. **Icons are inline SVG** defined in the `Icon` component in `shared.jsx`
(plus, check, chevron, search, bell, grid, target, list, user, users, calendar, flag, arrow, sparkle,
x, dot, chart) — replace with the codebase's icon library (Lucide/Heroicons map cleanly). Fonts load
from Google Fonts in `styles.css`. The green "target" glyph is the de-facto logo mark.

## Files
- **`KPI Hub - Sidebar.html`** — entry point; mounts `<AppA>` full-screen. Open in a browser to view
  the live prototype.
- **`app-a.jsx`** — the entire sidebar application: layout, all 5 views, KPI cards, to-do, team table,
  KPI detail, update flows. ~700 lines.
- **`shared.jsx`** — translations (`T`/`t`), data model + seed data (`MEMBERS`, `CATEGORIES`,
  `INITIAL_TODOS`), helpers (`pct`, `statusOf`, `fmtN`, `bucketOf`, `formatRelDate`), and shared
  primitives (`Icon`, `Avatar`, `ProgressBar`, `CategoryPill`, `StatusPill`, `LangToggle`).
- **`styles.css`** — design tokens + all component classes.

> Note: the prototype uses in-browser Babel (`<script type="text/babel">`) for convenience. Do not
> carry that into production — it's for previewing the reference only.
