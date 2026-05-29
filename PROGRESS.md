# KPI Hub — Development Progress

> This file is updated after every chunk. A new session should read this + `KPI Implementation Plan.md` to resume work immediately.

---

## Current Status

**Last completed:** Chunk 2 — Shared UI Component Library  
**Next up:** Chunk 3 — Mock Data & Hooks Layer  
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
| 3 | Mock Data & Hooks Layer | ⏳ Next |
| 4 | Dashboard + KPI List pages | ⬜ |
| 5 | KPI Detail + Progress Logging | ⬜ |
| 6 | Todos (List / Board / Timeline) | ⬜ |
| 7 | Team + Database modules | ⬜ |
| 8 | Full detail pages + Profile + Reports | ⬜ |
| 9 | Firebase Authentication | ⬜ |
| 10 | Firestore Data Layer | ⬜ |
| 11 | Deploy to Vercel | ⬜ |

---

## How to Resume in a New Session

1. Read this file
2. Read `KPI Implementation Plan.md` for the next chunk's full spec
3. Start the dev server: run `D:\Claude\start-dev.cmd` (or use the preview tool with `D:\Claude\.claude\launch.json`)
4. Pick up from **Chunk 3** below

### Chunk 3 — What to build next

Files to create:
- `src/data/mockData.js` — extract all seed data from `hub-data.jsx` (USERS, KPIS, COMPANIES, ARTICLES, PROGRESS_LOGS, TODOS, ATYPES constants)
- `src/shared/hooks/useAuth.js`
- `src/shared/hooks/useCurrentUser.js`
- `src/shared/hooks/useKPIs.js`
- `src/shared/hooks/useTodos.js`
- `src/shared/hooks/useTeam.js`
- `src/shared/hooks/useDatabase.js`
- `src/shared/utils/formatters.js`
- `src/shared/utils/statusCalculators.js`

Source of truth for mock data: `hub-data.jsx` in repo root (the `SEED` object: USERS, KPIS, COMPANIES, ARTICLES, PROGRESS_LOGS, TODOS).

Run parallel subagents: Subagent A extracts `mockData.js` + `translations.js` (translations already done). Subagent B writes hooks + utils.
