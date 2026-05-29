import React, { useState } from 'react'
import { useAuth } from '@shared/contexts/AuthContext'
import { useLanguage } from '@shared/contexts/LanguageContext'
import { useKPIs } from '@shared/hooks/useKPIs'
import { useTeam } from '@shared/hooks/useTeam'
import Button from '@shared/components/ui/Button'
import StatusBadge from '@shared/components/ui/StatusBadge'
import Avatar from '@shared/components/ui/Avatar'
import { getLabel, formatDate } from '@shared/utils/formatters'
import { isOverdue } from '@shared/utils/statusCalculators'
import SubtaskItem from './SubtaskItem'

const STATUS_CYCLE = { open: 'inProgress', inProgress: 'done', done: 'open' }

export function TaskList({ kpiId, tasks = [] }) {
  const { user } = useAuth()
  const { lang, t } = useLanguage()
  const { updateTask, deleteTask, addTask, toggleSubtask } = useKPIs()
  const { getMemberById, members = [] } = useTeam()

  const [expandedTaskId, setExpandedTaskId] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [dueDateInput, setDueDateInput] = useState('')
  const [assignedTo, setAssignedTo] = useState('')

  const isAdmin = user?.role === 'admin'

  const handleToggleExpand = (taskId) => {
    setExpandedTaskId(prev => prev === taskId ? null : taskId)
  }

  const handleCycleStatus = (task) => {
    const next = STATUS_CYCLE[task.status] || 'open'
    updateTask(kpiId, task.id, { status: next })
  }

  const handleDelete = (taskId) => {
    deleteTask(kpiId, taskId)
  }

  const handleAddTask = () => {
    if (!titleInput.trim()) return
    addTask(kpiId, {
      title: { en: titleInput, ge: titleInput },
      assignedTo,
      dueDate: dueDateInput,
    })
    setTitleInput('')
    setDueDateInput('')
    setAssignedTo('')
    setShowAddForm(false)
  }

  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
        {t('tasks')} ({tasks.length})
      </h3>

      {tasks.map(task => {
        const member = getMemberById(task.assignedTo)
        const overdue = isOverdue(task.dueDate)
        const isExpanded = expandedTaskId === task.id

        return (
          <div key={task.id} style={{ marginBottom: 8, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
            {/* Task row */}
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', gap: 8, cursor: 'pointer', background: 'var(--surface)' }}
              onClick={() => handleToggleExpand(task.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--ink-3)', flexShrink: 0 }}>
                  {isExpanded ? '▼' : '▶'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getLabel(task.title, lang)}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                {member && <Avatar user={member} size="sm" />}

                <span style={{ fontSize: 12, color: overdue ? 'red' : 'var(--ink-2)' }}>
                  {formatDate(task.dueDate)}
                </span>

                <span style={{ cursor: 'pointer' }} onClick={() => handleCycleStatus(task)}>
                  <StatusBadge status={task.status} />
                </span>

                {isAdmin && (
                  <>
                    <Button size="xs" variant="ghost" onClick={() => handleCycleStatus(task)} title={t('edit')}>
                      ✏
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => handleDelete(task.id)} title="delete">
                      🗑
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Subtask area */}
            {isExpanded && (
              <div style={{ padding: '8px 12px 8px 32px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                {task.subtasks && task.subtasks.length > 0
                  ? task.subtasks.map(subtask => (
                      <SubtaskItem
                        key={subtask.id}
                        subtask={subtask}
                        kpiId={kpiId}
                        taskId={task.id}
                        onToggle={toggleSubtask}
                      />
                    ))
                  : <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>No subtasks</span>
                }
              </div>
            )}
          </div>
        )
      })}

      {/* Add Task form */}
      {isAdmin && (
        <div style={{ marginTop: 12 }}>
          {showAddForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, border: '1px solid var(--border)', borderRadius: 6, background: 'var(--surface)' }}>
              <input
                type="text"
                placeholder="Task title"
                value={titleInput}
                onChange={e => setTitleInput(e.target.value)}
                style={{ padding: '6px 8px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 4 }}
              />
              <input
                type="date"
                value={dueDateInput}
                onChange={e => setDueDateInput(e.target.value)}
                style={{ padding: '6px 8px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 4 }}
              />
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                style={{ padding: '6px 8px', fontSize: 13, border: '1px solid var(--border)', borderRadius: 4 }}
              >
                <option value="">{t('assignedTo')}</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button size="sm" variant="primary" onClick={handleAddTask}>{t('save')}</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>{t('cancel')}</Button>
              </div>
            </div>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => setShowAddForm(true)}>
              + {t('addTask')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default TaskList
