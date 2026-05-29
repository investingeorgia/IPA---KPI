import React from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useTeam } from '@shared/hooks/useTeam';
import Avatar from '@shared/components/ui/Avatar';
import { getLabel, formatDate } from '@shared/utils/formatters';
import { isOverdue } from '@shared/utils/statusCalculators';

const COLUMNS = [
  { status: 'open',       labelKey: 'todo' },
  { status: 'inProgress', labelKey: 'inProgress' },
  { status: 'done',       labelKey: 'done' },
];

function TodoCard({ todo, lang, t, getMemberById, onStatusChange }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: 12, marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{getLabel(todo.title, lang)}</div>
      {todo.dueDate && (
        <div style={{ fontSize: 11, color: isOverdue(todo.dueDate) && todo.status !== 'done' ? 'var(--red)' : 'var(--ink-3)', marginBottom: 6 }}>
          {formatDate(todo.dueDate)}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 2 }}>
          {(todo.assignees || []).slice(0, 3).map(uid => {
            const m = getMemberById(uid);
            return m ? <Avatar key={uid} user={m} size="sm" /> : null;
          })}
        </div>
        {todo.status !== 'done' && (
          <button
            onClick={() => onStatusChange(todo.id, todo.status === 'open' ? 'inProgress' : 'done')}
            style={{ fontSize: 11, background: 'var(--ink-6,#F3F4F6)', border: 'none', borderRadius: 4, padding: '3px 8px', cursor: 'pointer' }}
          >
            → {todo.status === 'open' ? t('inProgress') : t('done')}
          </button>
        )}
      </div>
    </div>
  );
}

export function TodoBoardView({ todos = [], onToggle, onToggleSubtask, onStatusChange }) {
  const { lang, t } = useLanguage();
  const { getMemberById } = useTeam();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'start' }}>
      {COLUMNS.map(col => {
        const colTodos = todos.filter(td => td.status === col.status);
        return (
          <div key={col.status}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span>{t(col.labelKey)}</span>
              <span style={{ color: 'var(--ink-3)', fontWeight: 400 }}>{colTodos.length}</span>
            </div>
            {colTodos.map(todo => (
              <TodoCard
                key={todo.id}
                todo={todo}
                lang={lang}
                t={t}
                getMemberById={getMemberById}
                onStatusChange={onStatusChange}
              />
            ))}
            {colTodos.length === 0 && (
              <div style={{ color: 'var(--ink-3)', fontSize: 12, padding: '8px 0' }}>—</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TodoBoardView;
