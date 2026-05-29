import React, { useState } from 'react';
import Card from '@shared/components/ui/Card';
import ProgressBar from '@shared/components/ui/ProgressBar';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useData } from '@shared/contexts/DataContext';
import { useKPIs } from '@shared/hooks/useKPIs';
import { getLabel, formatDate } from '@shared/utils/formatters';
import { calcPct } from '@shared/utils/statusCalculators';

export function MemberProgressSummary({ userId }) {
  const { lang } = useLanguage();
  const { kpis } = useKPIs({ assigneeId: userId });
  const { logs } = useData();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 12,
      }}
    >
      {(kpis || []).map((kpi) => {
        const memberLogs = (logs || [])
          .filter((l) => l.kpiId === kpi.id && l.userId === userId)
          .sort((a, b) => b.date.localeCompare(a.date));
        const lastLog = memberLogs[0];

        return (
          <Card key={kpi.id} variant="soft">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontWeight: 500, fontSize: 13 }}>
                {getLabel(kpi.title, lang)}
              </div>
              <ProgressBar value={calcPct(kpi.current, kpi.target)} showLabel />
              <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                {kpi.current} / {kpi.target} {kpi.unit}
              </div>
              {lastLog && (
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                  Last activity: {formatDate(lastLog.date)}
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default MemberProgressSummary;
