import React from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { getLabel } from '@shared/utils/formatters';
import { calcTodoStatus } from '@shared/utils/statusCalculators';

const today = new Date();
today.setHours(0, 0, 0, 0);
const START_DAYS = -14;
const END_DAYS = 60;
const TOTAL_DAYS = END_DAYS - START_DAYS; // 74
const startDate = new Date(today); startDate.setDate(today.getDate() + START_DAYS);
const endDate = new Date(today); endDate.setDate(today.getDate() + END_DAYS);

function datePct(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diff = (d - startDate) / 86400000;
  return Math.max(0, Math.min(100, (diff / TOTAL_DAYS) * 100));
}

const todayPct = ((today - startDate) / 86400000 / TOTAL_DAYS) * 100;
const sevenDayPct = datePct(new Date(today.getTime() + 7 * 86400000).toISOString().slice(0, 10));

function buildMonths() {
  const months = [];
  let cur = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (cur <= endDate) {
    const pct = datePct(cur.toISOString().slice(0, 10));
    months.push({ label: cur.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }), pct });
    cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
  }
  return months;
}

const months = buildMonths();

function markerColor(status, pct) {
  if (status === 'done') return 'var(--ink-4)';
  if (status === 'overdue') return 'var(--red)';
  if (pct !== null && sevenDayPct >= pct) return '#B45309';
  return 'var(--green)';
}

export function TodoTimelineView({ todos = [] }) {
  const { lang } = useLanguage();

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ minWidth: 600 }}>
        {/* Header row */}
        <div style={{ display: 'flex', marginBottom: 8 }}>
          <div style={{ width: 160, flexShrink: 0 }} />
          <div style={{ flex: 1, position: 'relative', height: 20 }}>
            {months.map((m, i) => (
              <span key={i} style={{ position: 'absolute', left: `${m.pct}%`, fontSize: 10, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* Todo rows */}
        {todos.map(todo => {
          const pct = datePct(todo.dueDate);
          const status = calcTodoStatus(todo);
          const color = markerColor(status, pct);
          return (
            <div key={todo.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 6, minHeight: 28 }}>
              <div style={{ width: 160, flexShrink: 0, fontSize: 12, color: 'var(--ink)', paddingRight: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {getLabel(todo.title, lang)}
              </div>
              <div style={{ flex: 1, position: 'relative', height: 20 }}>
                {/* Today line */}
                <div style={{ position: 'absolute', left: `${todayPct}%`, top: 0, bottom: 0, width: 1, background: 'var(--green)', opacity: 0.6 }} />
                {/* Due date marker */}
                {pct !== null && (
                  <div style={{
                    position: 'absolute',
                    left: `${pct}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: color,
                  }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodoTimelineView;
