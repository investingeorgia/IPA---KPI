import React, { useState } from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { calcTodoStatus } from '@shared/utils/statusCalculators';
import { TodoItem } from './TodoItem';

const todayStr = new Date().toISOString().slice(0, 10);

function getDaysDiff(dateStr) {
  const today = new Date(todayStr);
  const due = new Date(dateStr);
  return Math.round((due - today) / (1000 * 60 * 60 * 24));
}

export function TodoListView({ todos, onToggle, onToggleSubtask }) {
  const { t } = useLanguage();

  const [openSections, setOpenSections] = useState({
    overdue: true,
    today: true,
    thisWeek: true,
    later: true,
    done: false,
  });

  const groups = {
    overdue: todos.filter(td => calcTodoStatus(td) === 'overdue'),
    today: todos.filter(td =>
      td.dueDate === todayStr &&
      calcTodoStatus(td) !== 'done' &&
      calcTodoStatus(td) !== 'overdue'
    ),
    thisWeek: todos.filter(td => {
      const diff = td.dueDate ? getDaysDiff(td.dueDate) : null;
      const status = calcTodoStatus(td);
      return diff !== null && diff >= 1 && diff <= 7 && status !== 'done' && status !== 'overdue';
    }),
    later: todos.filter(td => {
      const diff = td.dueDate ? getDaysDiff(td.dueDate) : null;
      const status = calcTodoStatus(td);
      return diff !== null && diff > 7 && status !== 'done';
    }),
    done: todos.filter(td => calcTodoStatus(td) === 'done'),
  };

  const sectionMeta = [
    { key: 'overdue',  label: 'Overdue',       color: 'var(--red)' },
    { key: 'today',    label: 'Due Today',      color: 'var(--amber, #B45309)' },
    { key: 'thisWeek', label: 'This Week',      color: 'var(--ink)' },
    { key: 'later',    label: 'Later',          color: 'var(--ink-3)' },
    { key: 'done',     label: t('done'),        color: 'var(--ink-3)' },
  ];

  const toggle = key =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      {sectionMeta.map(({ key, label, color }) => {
        const items = groups[key];
        if (!items || items.length === 0) return null;
        const isOpen = openSections[key];

        return (
          <div key={key}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', cursor: 'pointer' }}
              onClick={() => toggle(key)}
            >
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color,
              }}>
                {label} ({items.length})
              </span>
              <span style={{ fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && items.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onToggleSubtask={onToggleSubtask}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default TodoListView;
