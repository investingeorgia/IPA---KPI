import React from 'react'
import { useLanguage } from '@shared/contexts/LanguageContext'
import { getLabel } from '@shared/utils/formatters'

export function SubtaskItem({ subtask, kpiId, taskId, onToggle }) {
  const { lang } = useLanguage()

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      <input
        type="checkbox"
        checked={subtask.done}
        onChange={() => onToggle(kpiId, taskId, subtask.id)}
        style={{ cursor: 'pointer', width: 14, height: 14, flexShrink: 0 }}
      />
      <span style={{
        fontSize: 13,
        color: subtask.done ? 'var(--ink-3)' : 'var(--ink)',
        textDecoration: subtask.done ? 'line-through' : 'none',
      }}>
        {getLabel(subtask.title, lang)}
      </span>
    </div>
  )
}

export default SubtaskItem
