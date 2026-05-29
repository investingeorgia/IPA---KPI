# IPA KPI Hub — Site Map & Functionality Spec

## Stack
- React (Vite)
- Firebase (Firestore + Auth)
- Vercel (hosting)

---

## Routes

```
/login

/dashboard

/kpis
/kpis/:id

/todos

/team
/team/:userId

/profile

/database
/database/companies
/database/companies/:id
/database/articles
/database/articles/:id

/reports
```

---

## `/login`

- Email + password form
- Redirects to `/dashboard` on success
- No self-registration — admin creates all accounts

---

## `/dashboard`

**Both roles:**
- Summary cards: total KPIs, on track / at risk / behind counts
- Personal to-do count (overdue highlighted)
- Quick-log shortcut — log activity without navigating to KPI page
- Recent personal activity feed

**Admin also:**
- Team-wide KPI health overview
- Each member's progress at a glance
- KPIs with no recent activity flagged

---

## `/kpis` — KPI List

**Admin:**
- Full list of all KPIs across 4 programs: Investment Attraction, Awareness, Aftercare, FDI Grant
- Create new KPI: title, program, target number, unit, deadline, assign to one or more users
- Edit / archive KPI
- Status badge per KPI: on track / at risk / behind

**User:**
- Only sees KPIs assigned to them
- Status badges, read-only targets

---

## `/kpis/:id` — KPI Detail

**Both roles:**
- KPI title, target, unit, deadline, program, assigned members
- Progress bar (logged vs target)
- Log Progress button → 2-step modal:
  - Step 1: select activity type (meeting / call / article / other) + enter count
  - Step 2: enter company name OR paste article link depending on type — auto-creates or links existing database record
- Progress log history: date, user, activity type, count, company/article linked
- Tasks section: list of tasks with subtasks, assignee, due date, status — check off subtasks inline

**Admin also:**
- Edit KPI metadata: target, deadline, assignees, program
- Add / edit / delete tasks and subtasks
- View progress logs from all assigned users, not just own
- Delete individual progress log entries

---

## `/todos` — To-Do

**Both roles:**
- Toggle: **My Todos** / **Team Todos**
- 3 view switcher: **List | Board | Timeline**
- Filter by status: open / done / overdue

**My Todos (both roles):**
- Personal list, only visible to the owner
- Create todo: title, due date, subtasks
- Mark todo and subtasks complete

**Team Todos:**
- Created by admin, visible to all or specific assignees
- Members can mark their assigned items complete
- Admin can create, edit, delete team todos

**List view:** flat list with checkboxes and due dates
**Board view:** columns — To Do / In Progress / Done, click to move between columns
**Timeline view:** horizontal Gantt-style, items positioned by due date

---

## `/team` — Team Management (admin only)

- Redirect non-admins to `/dashboard`
- Table: all members with name, email, active KPI count, last activity date
- Create new user: name, email, temporary password, role
- Deactivate user
- Click row → `/team/:userId`

---

## `/team/:userId` — Member Detail (admin only)

- Member's assigned KPIs and individual progress on each
- Full progress log history for that member
- Their open todos
- Reassign KPIs from this page

---

## `/profile` — User Profile

**Both roles:**
- Edit display name and avatar
- Change password
- Language preference: English / Georgian (controls export language)

---

## `/database` — Company & Article Database

Redirects to `/database/companies` by default.

**Layout on all database pages:**
```
[ Main Sidebar ] [ Central List ] [ Right Detail Sidebar ]
```
Clicking a record in the central list opens its detail in the right sidebar without navigating away. "Open full page" link expands to the dedicated route.

**How records are created:**
When a user logs progress and enters a company name or article link in step 2 of the log modal:
- System checks if the record already exists
- If yes → links the log to the existing record
- If no → creates a new record automatically
- No manual data entry required — database populates from activity logging

---

### `/database/companies`

**Central area:**
- Searchable, sortable table: name, website, total activity count, last mentioned, KPIs it appears in
- Click row → right sidebar opens

**Right sidebar:**
- Company name (editable)
- Website link (editable, clickable)
- Notes / description (editable text area)
- Activity history: every progress log mentioning this company — date, user, KPI, activity type, count

**`/database/companies/:id` — Full Page:**
- All right sidebar content at full width
- Activity history as full filterable table: filter by user, KPI, date range

---

### `/database/articles`

**Central area:**
- Searchable, sortable table: title (auto-pulled from URL), link, total mentions, last mentioned, KPIs it appears in
- Click row → right sidebar opens

**Right sidebar:**
- Article title (editable)
- URL (clickable, opens in new tab)
- Notes / description (editable text area)
- Activity history: every progress log linking this article — date, user, KPI, activity type, count

**`/database/articles/:id` — Full Page:**
- All right sidebar content at full width
- Activity history as full filterable table: filter by user, KPI, date range

---

## `/reports` — Export Report (admin only)

- Redirect non-admins to `/dashboard`
- Select language: English / Georgian
- Select scope: individual member / program / all KPIs
- Select date range
- In-page report preview before export
- Export as PDF

**Report contents:**
- KPI name, target, current progress, status
- Progress log summary: total activities broken down by type
- Task completion rate
- Period covered

---

## Role Matrix

| Feature | Admin | User |
|---|---|---|
| Create / edit / archive KPIs | ✓ | ✗ |
| Assign KPIs to users | ✓ | ✗ |
| View KPIs | all | own only |
| Log progress on KPIs | ✓ | ✓ |
| View progress logs | all users | own only |
| Delete progress log entries | ✓ | ✗ |
| Add / edit / delete tasks & subtasks on KPI | ✓ | ✗ |
| Check off subtasks | ✓ | ✓ |
| Create personal todos | ✓ | ✓ |
| Create team todos | ✓ | ✗ |
| Complete assigned team todos | ✓ | ✓ |
| View `/team` | ✓ | ✗ |
| Create / deactivate users | ✓ | ✗ |
| View member detail page | ✓ | ✗ |
| Reassign KPIs | ✓ | ✗ |
| View `/database` | ✓ | ✓ |
| Edit database record notes & links | ✓ | ✓ |
| Delete database records | ✗ | ✗ |
| Export reports | ✓ | ✗ |

---

## Data Model

```
users/
  { id, name, email, role: 'admin'|'user', avatar, language: 'en'|'ge' }

kpis/
  { id, title, program, target, unit, deadline, assignees[], status }
  └── tasks/
        { id, title, assignedTo, dueDate, status }
        └── subtasks/
              { id, title, done }

progress_logs/
  { id, kpiId, userId, activityType, count,
    entityType: 'company'|'article', entityId, date }

todos/
  { id, title, type: 'personal'|'team', ownerId, assignees[],
    status, dueDate }
  └── subtasks/
        { id, title, done }

companies/
  { id, name, website, description, createdAt }

articles/
  { id, url, title, description, createdAt }
```

---

## Architecture

```
src/
├── modules/
│   ├── auth/
│   ├── dashboard/
│   ├── kpis/
│   ├── todos/
│   ├── team/
│   ├── profile/
│   ├── database/
│   └── reports/
│
├── shared/
│   ├── components/
│   ├── contexts/       # AuthContext, LanguageContext
│   ├── hooks/          # useAuth, useCurrentUser
│   └── utils/          # formatters, exportPDF
│
├── data/
│   └── mockData.js     # placeholder until Firebase
│
└── App.jsx
```

Each module owns its own routes, components, and data hooks.
Auth and database are placeholder/mock until Firebase is connected.
