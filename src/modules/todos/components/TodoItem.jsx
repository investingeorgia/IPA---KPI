import React, { useState } from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useTeam } from '@shared/hooks/useTeam';
import Avatar from '@shared/components/ui/Avatar';
import { getLabel, formatDate } from '@shared/utils/formatters';
import { calcTodoStatus } from '@shared/utils/statusCalculators';

export function TodoItem({ todo, onToggle, onToggleSubtask }) {
  const [expanded, setExpanded] = useState(false);
  const { lang, t } = useLanguage();
  const { getMemberById } = useTeam();

  const status = calcTodoStatus(todo);
  const todayStr = new Date().toISOString().slice(0, 10);
  const isDueToday = todo.dueDate === todayStr;
  const isDone = status === 'done';
  const isOverdue = status === 'overdue';

  const subtasks = todo.subtasks ?? [];
  const doneSubs = subtasks.filter(s => s.done).length;

  const dueDateChipStyle = (() => {
    if (!todo.dueDate) return null;
    if (isOverdue) return { background: 'var(--red-bg, #FEE2E2)', color: 'var(--red)' };
    if (isDueToday) return { background: 'var(--amber-bg, #FFF8E1)', color: 'var(--amber, #B45309)' };
    return { background: 'var(--ink-6, #F3F4F6)', color: 'var(--ink-3)' };
  })();

  const chipBase = {
    display: 'inline-block',
    fontSize: 11,
    borderRadius: 999,
    padding: '2px 8px',
    whiteSpace: 'nowrap',
  };

  const assignees = todo.type === 'team'
    ? (todo.assignees ?? []).slice(0, 3).map(id => getMemberById(id)).filter(Boolean)
    : [];

  return (
    <div style={{ borderBottom: '1px solid var(--ink-5)', padding: '10px 0' }}>
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input
          type="checkbox"
          checked={todo.status === 'done'}
          onChange={() => onToggle(todo.id)}
          style={{ flexShrink: 0, cursor: 'pointer' }}
        />

        {/* Title — clickable to expand */}
        <span
          onClick={() => setExpanded(prev => !prev)}
          style={{
            flex: 1,
            cursor: 'pointer',
            textDecoration: isDone ? 'line-through' : 'none',
            color: isDone ? 'var(--ink-3)' : 'var(--ink)',
            fontSize: 14,
          }}
        >
          {getLabel(todo.title, lang)}
        </span>

        {/* Subtask count */}
        {subtasks.length > 0 && (
          <span style={{ fontSize: 12, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
            {doneSubs}/{subtasks.length} {t('subtasks')}
          </span>
        )}

        {/* Assignee avatars (team only) */}
        {assignees.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {assignees.map(member => (
              <Avatar key={member.id} user={member} size="sm" />
            ))}
          </div>
        )}

        {/* Due date chip */}
        {todo.dueDate && dueDateChipStyle && (
          <span style={{ ...chipBase, ...dueDateChipStyle }}>
            {formatDate(todo.dueDate)}
          </span>
        )}
      </div>

      {/* Expanded subtask list */}
      {expanded && subtasks.length > 0 && (
        <div style={{ paddingLeft: 24, marginTop: 6 }}>
          {subtasks.map(sub => (
            <div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0' }}>
              <input
                type="checkbox"
                checked={sub.done}
                onChange={() => onToggleSubtask(todo.id, sub.id)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{
                fontSize: 13,
                textDecoration: sub.done ? 'line-through' : 'none',
                color: sub.done ? 'var(--ink-3)' : 'var(--ink)',
              }}>
                {getLabel(sub.title, lang)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoItem;
