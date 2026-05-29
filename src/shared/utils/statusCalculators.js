// ============================================================
// statusCalculators.js — KPI and todo status logic
// ============================================================

export function calcKpiStatus(kpi) {
  if (!kpi || !kpi.target) return 'behind';
  const pct = (kpi.current / kpi.target) * 100;
  if (pct >= 95) return 'done';
  if (pct >= 70) return 'on-track';
  if (pct >= 40) return 'at-risk';
  return 'behind';
}

export function calcPct(current, target) {
  if (!target) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

// Returns: 'done' | 'overdue' | 'in-progress' | 'open'
export function calcTodoStatus(todo) {
  if (todo.status === 'done') return 'done';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (todo.dueDate && new Date(todo.dueDate) < today) return 'overdue';
  if (todo.status === 'inProgress') return 'in-progress';
  return 'open';
}

export function isOverdue(dateString) {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString) < today;
}
