import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@shared/components/ui/Card';
import Badge from '@shared/components/ui/Badge';
import StatusBadge from '@shared/components/ui/StatusBadge';
import ProgressBar from '@shared/components/ui/ProgressBar';
import Avatar from '@shared/components/ui/Avatar';
import { useTeam } from '@shared/hooks/useTeam';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { getLabel, formatRelativeDate } from '@shared/utils/formatters';
import { calcPct } from '@shared/utils/statusCalculators';

const PROGRAM_COLOR = {
  invest: 'blue',
  awareness: 'green',
  aftercare: 'yellow',
  fdi: 'gray',
};

function isOverdue(dateString) {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateString) < today;
}

export function KpiCard({ kpi }) {
  const navigate = useNavigate();
  const { getMemberById } = useTeam();
  const { lang } = useLanguage();

  const pct = calcPct(kpi.current, kpi.target);
  const title = getLabel(kpi.title, lang);
  const relDate = formatRelativeDate(kpi.deadline, lang);
  const overdue = isOverdue(kpi.deadline);
  const programColor = PROGRAM_COLOR[kpi.program] ?? 'gray';

  const visibleAssignees = (kpi.assignees || []).slice(0, 3).map(getMemberById);
  const extraCount = Math.max(0, (kpi.assignees || []).length - 3);

  return (
    <Card onClick={() => navigate(`/kpis/${kpi.id}`)} style={{ cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Badge label={kpi.program} color={programColor} />
        <StatusBadge status={kpi.status} />
      </div>

      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 10, lineHeight: 1.4 }}>
        {title}
      </div>

      <ProgressBar value={pct} size="sm" style={{ marginBottom: 4 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>
          {kpi.current} / {kpi.target} {kpi.unit}
        </span>
        <span style={{ fontSize: 11, color: overdue ? 'var(--red)' : 'var(--ink-3)', fontWeight: overdue ? 600 : 400 }}>
          {relDate}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {visibleAssignees.map((member, i) => (
          <div key={(kpi.assignees || [])[i]} style={{ marginLeft: i > 0 ? -6 : 0 }}>
            <Avatar user={member} size="sm" />
          </div>
        ))}
        {extraCount > 0 && (
          <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 4 }}>
            +{extraCount}
          </span>
        )}
      </div>
    </Card>
  );
}

export default KpiCard;
