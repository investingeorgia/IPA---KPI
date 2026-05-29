import React, { useState } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useKPIs } from '@shared/hooks/useKPIs';
import Button from '@shared/components/ui/Button';
import SearchInput from '@shared/components/ui/SearchInput';
import { getLabel } from '@shared/utils/formatters';
import KpiCard from './components/KpiCard';

const KPI_PROGRAMS = ['invest', 'awareness', 'aftercare', 'fdi'];
const STATUS_OPTIONS = [
  { value: 'on-track', tKey: 'onTrack' },
  { value: 'at-risk',  tKey: 'atRisk'  },
  { value: 'behind',   tKey: 'behind'  },
  { value: 'done',     tKey: 'done'    },
];

export function KpiListPage() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [programFilter, setProgramFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const { kpis: allKpis } = useKPIs();
  const { kpis: myKpis } = useKPIs({ assigneeId: user?.id });

  const baseKpis = user?.role === 'admin' ? allKpis : myKpis;

  const filteredKpis = (baseKpis || []).filter((kpi) => {
    if (programFilter && kpi.program !== programFilter) return false;
    if (statusFilter && kpi.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const title = getLabel(kpi.title, lang).toLowerCase();
      if (!title.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>{t('kpis')}</h1>
        {user?.role === 'admin' && (
          <Button variant="primary" onClick={() => alert('Create KPI — Chunk 5')}>
            {t('createKpi')}
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={t('search')}
          style={{ width: 200 }}
        />
        <select
          className="input"
          value={programFilter}
          onChange={(e) => setProgramFilter(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">{t('all')} — {t('program')}</option>
          {KPI_PROGRAMS.map((p) => (
            <option key={p} value={p}>{t(p)}</option>
          ))}
        </select>
        <select
          className="input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">{t('all')} — {t('status')}</option>
          {STATUS_OPTIONS.map(({ value, tKey }) => (
            <option key={value} value={value}>{t(tKey)}</option>
          ))}
        </select>
      </div>

      {filteredKpis.length === 0 ? (
        <div className="empty">No KPIs match these filters.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredKpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      )}
    </div>
  );
}

export default KpiListPage;
