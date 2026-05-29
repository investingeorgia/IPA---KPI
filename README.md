# KPI Hub — Enterprise Georgia / IPA

An internal performance tracking platform for the Investment Promotion Agency of Georgia (IPA / Enterprise Georgia). Built for a team of approximately 11 people to monitor, log, and report on key performance indicators across the agency's core programs.

---

## Key Features

- **KPI Tracking** — Monitor performance across 4 programs: Investment Attraction, Awareness, Aftercare, and FDI Grant. Each KPI has a target, deadline, and assigned team members.
- **Activity Logging** — Team members log activities (meetings, calls, published articles) directly against their KPIs in a two-step entry: record the count, then specify the company name or article link.
- **Company & Article Database** — A reference database that builds automatically as users log activities. Each company and article gets its own page with notes, website links, and a full history of every time it was mentioned across KPI logs.
- **To-Dos** — Personal to-dos for all members. Admins can also create team-wide to-dos. Three views available: List, Board (kanban), and Timeline (Gantt-style).
- **Admin Controls** — Admins set KPI targets, assign KPIs to team members, manage user accounts, and view team-wide progress across all programs.
- **Performance Reports** — Admins can generate and export PDF reports showing KPI status, activity breakdowns, and task completion. Reports are available in English or Georgian.
- **Bilingual Interface** — Full English and Georgian language support throughout the application.

---

## User Roles

**Admin** — Full access. Can create and edit KPIs, set targets, assign team members, create team to-dos, view all team progress, manage user accounts, and export reports.

**User** — Can view their assigned KPIs, log progress, manage personal to-dos, complete assigned team to-dos, and access the company/article database.

---

## Tech Stack

- **React** (Vite) — Frontend framework and build tool
- **Firebase** — Authentication (email/password) and Firestore database
- **Vercel** — Hosting and deployment

---

For implementation details, architecture decisions, and the phased build plan see [`KPI Implementation Plan.md`](./KPI%20Implementation%20Plan.md).
