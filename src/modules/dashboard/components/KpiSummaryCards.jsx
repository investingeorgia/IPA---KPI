import React from 'react';
import Card from '@shared/components/ui/Card';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';

export function KpiSummaryCards() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const isAdmin = user?.role === 'admin';

  const filters = isAdmin ? {} : { assigneeId: user?.id };
  const { kpis } = useKPIs(filters);

  const total = kpis.length;
  const onTrack = kpis.filter((k) => k.status === 'on-track' || k.status === 'done').length;
  const atRisk = kpis.filter((k) => k.status === 'at-risk' || k.status === 'behind').length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Card>
        <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
          {total}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
          {t('totalKpis')}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--green)', lineHeight: 1 }}>
          {onTrack}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
          {t('onTrack')}
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>
          {atRisk}
        </div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 6 }}>
          {t('atRisk')} / {t('behind')}
        </div>
      </Card>
    </div>
  );
}

export default KpiSummaryCards;
