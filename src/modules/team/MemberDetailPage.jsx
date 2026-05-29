import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useData } from '@shared/contexts/DataContext';
import { useTeam } from '@shared/hooks/useTeam';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useTodos } from '@shared/hooks/useTodos';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Button from '@shared/components/ui/Button';
import Avatar from '@shared/components/ui/Avatar';
import { getLabel, formatDate, formatActivityType } from '@shared/utils/formatters';
import MemberProgressSummary from './components/MemberProgressSummary';

// --- Due-date chip helper ---
function DueDateChip({ dueDate }) {
  if (!dueDate) return null;
  const today = new Date().toISOString().slice(0, 10);
  const color =
    dueDate < today ? 'red' : dueDate === today ? 'amber' : 'gray';
  const colorMap = { red: '#fde8e8', amber: '#fef3c7', gray: '#f3f4f6' };
  const textMap = { red: '#b91c1c', amber: '#92400e', gray: '#4b5563' };
  return (
    <span
      style={{
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 4,
        background: colorMap[color],
        color: textMap[color],
        marginLeft: 8,
      }}
    >
      {dueDate}
    </span>
  );
}

export function MemberDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const { lang, t } = useLanguage();
  const { getMemberById } = useTeam();
  const { logs } = useData();
  const { kpis } = useKPIs({ assigneeId: userId });
  const { todos } = useTodos('personal', userId);

  const member = getMemberById(userId);

  if (!member) {
    return (
      <div style={{ padding: 40 }}>
        <p>Member not found.</p>
        <a href="/team" onClick={(e) => { e.preventDefault(); navigate('/team'); }}>
          ← Back to Team
        </a>
      </div>
    );
  }

  const memberLogs = (logs || [])
    .filter((l) => l.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  const openTodos = (todos || [])
    .filter((td) => td.status !== 'done')
    .slice(0, 5);

  const isAdmin = authUser?.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
      {/* Back + header */}
      <div>
        <button
          onClick={() => navigate('/team')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13, padding: 0 }}
        >
          ← {t('team')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}>
          <Avatar user={member} size="xl" />
          <div>
            <h1 style={{ margin: 0, fontSize: 20 }}>{member.name}</h1>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{member.email}</div>
            <Badge label={member.role} color={member.role === 'admin' ? 'blue' : 'gray'} style={{ marginTop: 6 }} />
          </div>
        </div>
      </div>

      {/* KPI progress */}
      <Card title={t('kpis')}>
        <MemberProgressSummary userId={userId} />
      </Card>

      {/* Recent activity */}
      <Card title={t('recentActivity')}>
        {memberLogs.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>No recent activity.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {memberLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 60px',
                  gap: 12,
                  fontSize: 13,
                  padding: '6px 0',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--ink-3)' }}>{formatDate(log.date)}</span>
                <span>{formatActivityType(log.activityType)}</span>
                <span style={{ textAlign: 'right', color: 'var(--ink-2)', fontWeight: 500 }}>
                  {log.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Open todos */}
      <Card title={t('todos')}>
        {openTodos.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>No open todos.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {openTodos.map((todo) => (
              <div key={todo.id} style={{ display: 'flex', alignItems: 'center', fontSize: 13 }}>
                <span>{getLabel(todo.title, lang)}</span>
                <DueDateChip dueDate={todo.dueDate} />
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Admin: reassign */}
      {isAdmin && (
        <div>
          <Button variant="secondary" onClick={() => alert('Reassign KPIs — placeholder')}>
            Reassign KPIs
          </Button>
        </div>
      )}
    </div>
  );
}

export default MemberDetailPage;
