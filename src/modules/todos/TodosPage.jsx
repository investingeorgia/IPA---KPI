import React, { useState } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useTodos } from '@shared/hooks/useTodos';
import { useTeam } from '@shared/hooks/useTeam';
import Button from '@shared/components/ui/Button';
import Modal from '@shared/components/ui/Modal';
import { calcTodoStatus } from '@shared/utils/statusCalculators';
import { getLabel } from '@shared/utils/formatters';
import ViewSwitcher from './components/ViewSwitcher';
import TodoListView from './components/TodoListView';
import TodoBoardView from './components/TodoBoardView';
import TodoTimelineView from './components/TodoTimelineView';

const STATUS_OPTS = ['', 'open', 'overdue', 'done'];

function matchesFilter(todo, statusFilter) {
  if (!statusFilter) return true;
  const s = calcTodoStatus(todo);
  if (statusFilter === 'open') return s === 'open' || s === 'in-progress';
  return s === statusFilter;
}

export function TodosPage() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const { members } = useTeam();

  const [tab, setTab] = useState('personal');
  const [view, setView] = useState(() => localStorage.getItem('todo-view') || 'list');
  const [statusFilter, setStatusFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newAssignees, setNewAssignees] = useState([]);

  const { todos: personal, createTodo, updateTodo, toggleTodoSubtask } = useTodos('personal', user?.id);
  const { todos: team } = useTodos('team');

  const baseTodos = tab === 'personal' ? personal : team;
  const filtered = baseTodos.filter(td => matchesFilter(td, statusFilter));

  const canCreate = tab === 'personal' || user?.role === 'admin';

  function handleViewChange(v) {
    setView(v);
    localStorage.setItem('todo-view', v);
  }

  function handleToggle(todoId) {
    const todo = baseTodos.find(td => td.id === todoId);
    if (!todo) return;
    updateTodo(todoId, { status: todo.status === 'done' ? 'open' : 'done' });
  }

  function handleStatusChange(todoId, newStatus) {
    updateTodo(todoId, { status: newStatus });
  }

  function handleCreate() {
    if (!newTitle.trim()) return;
    createTodo({
      title: { en: newTitle, ge: newTitle },
      type: tab,
      ownerId: user?.id,
      assignees: tab === 'team' ? newAssignees : [user?.id],
      dueDate: newDueDate || null,
      status: 'open',
      subtasks: [],
    });
    setNewTitle('');
    setNewDueDate('');
    setNewAssignees([]);
    setCreateOpen(false);
  }

  const tabStyle = (key) => ({
    padding: '6px 16px',
    fontSize: 14,
    border: 'none',
    borderBottom: tab === key ? '2px solid var(--green)' : '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontWeight: tab === key ? 600 : 400,
    color: tab === key ? 'var(--ink)' : 'var(--ink-3)',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{t('todos')}</h1>
        {canCreate && (
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            + {t('newTodo')}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        <button style={tabStyle('personal')} onClick={() => setTab('personal')}>{t('myTodos')}</button>
        <button style={tabStyle('team')} onClick={() => setTab('team')}>{t('teamTodos')}</button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <select
          className="input"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 140 }}
        >
          {STATUS_OPTS.map(s => (
            <option key={s} value={s}>
              {s ? t(s === 'open' ? 'open' : s === 'overdue' ? 'overdue' : 'done') : t('all')}
            </option>
          ))}
        </select>
        <ViewSwitcher view={view} onChange={handleViewChange} />
      </div>

      {/* View */}
      {filtered.length === 0 ? (
        <div className="empty">{t('stale')}</div>
      ) : view === 'list' ? (
        <TodoListView todos={filtered} onToggle={handleToggle} onToggleSubtask={toggleTodoSubtask} onStatusChange={handleStatusChange} />
      ) : view === 'board' ? (
        <TodoBoardView todos={filtered} onToggle={handleToggle} onToggleSubtask={toggleTodoSubtask} onStatusChange={handleStatusChange} />
      ) : (
        <TodoTimelineView todos={filtered} onToggle={handleToggle} onToggleSubtask={toggleTodoSubtask} onStatusChange={handleStatusChange} />
      )}

      {/* Create modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('newTodo')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>{t('cancel')}</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!newTitle.trim()}>{t('save')}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 13 }}>Title</div>
            <input
              className="input"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Todo title..."
              autoFocus
            />
          </div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 13 }}>{t('deadline')}</div>
            <input
              type="date"
              className="input"
              value={newDueDate}
              onChange={e => setNewDueDate(e.target.value)}
            />
          </div>
          {tab === 'team' && (
            <div>
              <div style={{ fontWeight: 500, marginBottom: 6, fontSize: 13 }}>{t('assignees')}</div>
              <select
                multiple
                className="input"
                value={newAssignees}
                onChange={e => setNewAssignees(Array.from(e.target.selectedOptions, o => o.value))}
                style={{ height: 100 }}
              >
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default TodosPage;
