import React, { useMemo } from 'react';
import Card from '@shared/components/ui/Card';
import Table from '@shared/components/ui/Table';
import Avatar from '@shared/components/ui/Avatar';
import StatusBadge from '@shared/components/ui/StatusBadge';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useTeam } from '@shared/hooks/useTeam';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useData } from '@shared/contexts/DataContext';
import { formatDate } from '@shared/utils/formatters';

function majorityStatus(statuses) {
  if (!statuses.length) return null;
  const counts = {};
  for (const s of statuses) counts[s] = (counts[s] || 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function TeamProgressOverview() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { members } = useTeam();
  const { kpis } = useKPIs();
  const { logs } = useData();

  if (user?.role !== 'admin') return null;

  const tableData = useMemo(() => {
    return members.map((member) => {
      const memberKpis = kpis.filter(
        (k) => Array.isArray(k.assignees) && k.assignees.includes(member.id)
      );
      const memberLogs = (logs || []).filter((l) => l.userId === member.id);
      const latestLog = memberLogs.length
        ? memberLogs.reduce((a, b) => (a.date > b.date ? a : b))
        : null;
      const status = majorityStatus(memberKpis.map((k) => k.status));

      return {
        id: member.id,
        name: member.name,
        initials: member.initials,
        color: member.color,
        kpiCount: memberKpis.length,
        lastActivity: latestLog?.date ?? null,
        status,
      };
    });
  }, [members, kpis, logs]);

  const columns = [
    {
      key: 'name',
      label: t('assignees') ?? 'Assignees',
      width: '2fr',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar user={{ initials: row.initials, color: row.color }} size="sm" />
          <span>{row.name}</span>
        </div>
      ),
    },
    { key: 'kpiCount', label: t('kpis'), sortable: true, width: '80px' },
    {
      key: 'lastActivity',
      label: t('recentActivity'),
      sortable: true,
      width: '1fr',
      render: (val) => (val ? formatDate(val) : '—'),
    },
    {
      key: 'status',
      label: t('status'),
      width: '120px',
      render: (val) => (val ? <StatusBadge status={val} /> : null),
    },
  ];

  return (
    <Card title={t('teamHealth')}>
      <Table columns={columns} data={tableData} />
    </Card>
  );
}

export default TeamProgressOverview;
