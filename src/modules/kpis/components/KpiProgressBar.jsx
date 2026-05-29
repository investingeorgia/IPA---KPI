import React from 'react';
import ProgressBar from '@shared/components/ui/ProgressBar';
import StatusBadge from '@shared/components/ui/StatusBadge';
import { calcPct } from '@shared/utils/statusCalculators';

export function KpiProgressBar({ kpi }) {
  const pct = calcPct(kpi.current, kpi.target);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>
          {kpi.current}{' '}
          <span style={{ fontSize: 14, fontWeight: 400, color: 'var(--ink-3)' }}>
            / {kpi.target} {kpi.unit}
          </span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{pct}%</span>
          <StatusBadge status={kpi.status} />
        </div>
      </div>
      <ProgressBar value={pct} />
    </div>
  );
}

export default KpiProgressBar;
