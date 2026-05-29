import React, { useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useData } from '@shared/contexts/DataContext';
import { useKPIs } from '@shared/hooks/useKPIs';
import { formatDate, formatActivityType, getLabel } from '@shared/utils/formatters';

export function RecentActivityFeed() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const { logs } = useData();
  const { getKpiById } = useKPIs();
  const isAdmin = user?.role === 'admin';

  const recentLogs = useMemo(() => {
    const filtered = isAdmin
      ? (logs || [])
      : (logs || []).filter((l) => l.userId === user?.id);
    return [...filtered]
      .sort((a, b) => (a.date > b.date ? -1 : 1))
      .slice(0, 10);
  }, [logs, isAdmin, user?.id]);

  const actions = (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => alert('Log progress — Chunk 5')}
    >
      {t('quickLog')}
    </Button>
  );

  return (
    <Card title={t('recentActivity')} actions={actions}>
      {recentLogs.length === 0 ? (
        <div className="empty">{t('stale')}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {recentLogs.map((log) => {
            const kpi = getKpiById(log.kpiId);
            const kpiName = kpi ? getLabel(kpi.title, lang) : '—';
            return (
              <div
                key={log.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 90px 40px',
                  gap: 8,
                  alignItems: 'center',
                  fontSize: 13,
                  padding: '6px 0',
                  borderBottom: '1px solid var(--ink-5)',
                }}
              >
                <span style={{ color: 'var(--ink-3)' }}>{formatDate(log.date)}</span>
                <span style={{ fontWeight: 500 }}>{kpiName}</span>
                <span style={{ color: 'var(--ink-3)' }}>
                  {formatActivityType(log.activityType, lang)}
                </span>
                <span style={{ textAlign: 'right' }}>+{log.count}</span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default RecentActivityFeed;
