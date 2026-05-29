import React, { useState } from 'react';
import Avatar from '@shared/components/ui/Avatar';
import Badge from '@shared/components/ui/Badge';
import Table from '@shared/components/ui/Table';
import { useLanguage } from '@shared/contexts/LanguageContext';

export function MemberTable({ members, onRowClick }) {
  const { t } = useLanguage();

  const columns = [
    {
      key: 'name',
      label: t('assignees'),
      width: '2fr',
      render: (val, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar user={row} size="sm" />
          <span style={{ fontWeight: 500 }}>{row.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      width: '2fr',
      render: (val) => (
        <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{val}</span>
      ),
    },
    {
      key: 'role',
      label: t('status'),
      width: '80px',
      render: (val) => (
        <Badge label={val} color={val === 'admin' ? 'blue' : 'gray'} />
      ),
    },
  ];

  return (
    <Table
      data={members}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
}

export default MemberTable;
