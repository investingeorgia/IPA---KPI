import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useTeam } from '@shared/hooks/useTeam';
import { useDatabase } from '@shared/hooks/useDatabase';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import Button from '@shared/components/ui/Button';
import Avatar from '@shared/components/ui/Avatar';
import KpiProgressBar from './components/KpiProgressBar';
import LogProgressModal from './components/LogProgressModal';
import TaskList from './components/TaskList';
import { getLabel, formatDate, formatActivityType } from '@shared/utils/formatters';

const PROGRAM_COLOR = { invest: 'blue', awareness: 'green', aftercare: 'yellow', fdi: 'gray' };
const LOG_COLS = '90px 1fr 110px 50px 1fr 36px';

export function KpiDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const { getKpiById, getLogsForKpi, deleteLog } = useKPIs();
  const { getMemberById } = useTeam();
  const { getCompanyById, getArticleById } = useDatabase();

  const [logModalOpen, setLogModalOpen] = useState(false);

  const kpi = getKpiById(id);

  if (!kpi) {
    return (
      <div style={{ padding: 40 }}>
        <button
          onClick={() => navigate('/kpis')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13, padding: 0, marginBottom: 16 }}
        >
          ← {t('kpis')}
        </button>
        <p style={{ color: 'var(--ink-3)' }}>KPI not found.</p>
      </div>
    );
  }

  const logs = [...getLogsForKpi(id)].sort((a, b) => (b.date > a.date ? 1 : -1));
  const assignees = (kpi.assignees || []).map(getMemberById).filter(Boolean);

  function entityName(log) {
    if (!log.entityId) return '—';
    if (log.entityType === 'company') return getCompanyById(log.entityId)?.name ?? '—';
    if (log.entityType === 'article') {
      const a = getArticleById(log.entityId);
      return a?.title || a?.url || '—';
    }
    return '—';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      <button
        onClick={() => navigate('/kpis')}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 13, padding: 0, alignSelf: 'flex-start' }}
      >
        ← {t('kpis')}
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <Badge label={t(kpi.program)} color={PROGRAM_COLOR[kpi.program] ?? 'gray'} />
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: '8px 0 0' }}>
            {getLabel(kpi.title, lang)}
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex' }}>
            {assignees.map((m, i) => (
              <div key={m.id} style={{ marginLeft: i > 0 ? -6 : 0 }}>
                <Avatar user={m} size="sm" />
              </div>
            ))}
          </div>
          <Button variant="primary" onClick={() => setLogModalOpen(true)}>
            {t('logProgress')}
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <KpiProgressBar kpi={kpi} />
      </Card>

      {/* Progress log */}
      <Card title={t('progressLog')}>
        {logs.length === 0 ? (
          <div className="empty">{t('stale')}</div>
        ) : (
          <div className="tbl">
            <div className="tbl-head" style={{ gridTemplateColumns: LOG_COLS }}>
              <div>Date</div>
              <div>{t('assignedTo')}</div>
              <div>{t('activityType')}</div>
              <div>{t('count')}</div>
              <div>{t('company')}</div>
              <div />
            </div>
            {logs.map((log) => {
              const member = getMemberById(log.userId);
              return (
                <div key={log.id} className="tbl-row" style={{ gridTemplateColumns: LOG_COLS }}>
                  <div style={{ color: 'var(--ink-3)', fontSize: 12 }}>{formatDate(log.date)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {member && <Avatar user={member} size="sm" />}
                    <span style={{ fontSize: 13 }}>{member?.name ?? '—'}</span>
                  </div>
                  <div style={{ fontSize: 13 }}>{formatActivityType(log.activityType, lang)}</div>
                  <div style={{ fontWeight: 600 }}>+{log.count}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {entityName(log)}
                  </div>
                  <div>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => deleteLog(log.id)}
                        title="Delete log"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 18, lineHeight: 1, padding: '0 4px' }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Tasks */}
      <Card>
        <TaskList kpiId={kpi.id} tasks={kpi.tasks || []} />
      </Card>

      <LogProgressModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        kpiId={kpi.id}
      />
    </div>
  );
}

export default KpiDetailPage;
