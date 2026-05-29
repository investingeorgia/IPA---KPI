import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useTeam } from '@shared/hooks/useTeam';
import Button from '@shared/components/ui/Button';
import SearchInput from '@shared/components/ui/SearchInput';
import MemberTable from './components/MemberTable';

export function TeamPage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { members } = useTeam();

  const filtered = (members || []).filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h1 style={{ margin: 0 }}>{t('team')}</h1>
        <Button variant="primary" onClick={() => alert('Add user — Chunk 9')}>
          + Add user
        </Button>
      </div>
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder={t('search')}
      />
      <MemberTable
        members={filtered}
        onRowClick={(member) => navigate(`/team/${member.id}`)}
      />
    </div>
  );
}

export default TeamPage;
