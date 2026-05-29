import React, { useState } from 'react';
import { useDatabase } from '@shared/hooks/useDatabase';
import SearchInput from '@shared/components/ui/SearchInput';
import Table from '@shared/components/ui/Table';
import { truncateUrl } from '@shared/utils/formatters';
import { useDatabaseContext } from '../DatabaseLayout';

function ArticlesPage() {
  const [search, setSearch] = useState('');
  const { articles, getLogsForEntity } = useDatabase(search);
  const { selectedRecord, setSelectedRecord } = useDatabaseContext();

  const columns = [
    { key: 'title', label: 'Title', width: '2fr', sortable: true },
    {
      key: 'url',
      label: 'URL',
      width: '2fr',
      render: (val) =>
        val ? (
          <a
            href={val}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, color: 'var(--green)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {truncateUrl(val, 35)}
          </a>
        ) : (
          '—'
        ),
    },
    { key: 'activityCount', label: 'Mentions', width: '80px', sortable: true },
  ];

  const tableData = articles.map((a) => ({
    ...a,
    activityCount: getLogsForEntity('article', a.id).length,
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
        <h2 style={{ margin: 0 }}>Articles ({articles.length})</h2>
      </div>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search articles…"
        style={{ marginBottom: 16, maxWidth: 300 }}
      />
      <Table
        columns={columns}
        data={tableData}
        onRowClick={(row) => setSelectedRecord({ type: 'article', data: row })}
        selectedId={selectedRecord?.data?.id}
      />
    </div>
  );
}

export { ArticlesPage };
export default ArticlesPage;
