import React, { useState } from 'react';
import { useDatabase } from '@shared/hooks/useDatabase';
import { useLanguage } from '@shared/contexts/LanguageContext';
import SearchInput from '@shared/components/ui/SearchInput';
import Table from '@shared/components/ui/Table';
import { truncateUrl } from '@shared/utils/formatters';
import { useDatabaseContext } from '../DatabaseLayout';

function CompaniesPage() {
  const [search, setSearch] = useState('');
  const { companies, getLogsForEntity } = useDatabase(search);
  const { selectedRecord, setSelectedRecord } = useDatabaseContext();
  const { t } = useLanguage();

  const columns = [
    { key: 'name', label: 'Name', width: '2fr', sortable: true },
    {
      key: 'website',
      label: 'Website',
      width: '1fr',
      render: (val) =>
        val ? (
          <a
            href={`https://${val}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: 'var(--green)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {truncateUrl(val, 30)}
          </a>
        ) : (
          '—'
        ),
    },
    { key: 'activityCount', label: 'Activities', width: '80px', sortable: true },
  ];

  const tableData = companies.map((c) => ({
    ...c,
    activityCount: getLogsForEntity('company', c.id).length,
  }));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Companies ({companies.length})</h2>
      </div>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search companies…"
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table
        columns={columns}
        data={tableData}
        onRowClick={(row) => setSelectedRecord({ type: 'company', data: row })}
        selectedId={selectedRecord?.data?.id}
      />
    </div>
  );
}

export { CompaniesPage };
export default CompaniesPage;
