import React, { useState } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useTeam } from '@shared/hooks/useTeam';
import Button from '@shared/components/ui/Button';
import Modal from '@shared/components/ui/Modal';
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
  const { members } = useTeam();

  const [programFilter, setProgramFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newProgram, setNewProgram] = useState('invest');
  const [newTarget, setNewTarget] = useState('');
  const [newUnit, setNewUnit] = useState('#');
  const [newDeadline, setNewDeadline] = useState('');
  const [newAssignees, setNewAssignees] = useState([]);

  const { kpis: allKpis, createKpi } = useKPIs();
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

  function handleCreate() {
    if (!newTitle.trim() || !newTarget) return;
    createKpi({
      title: { en: newTitle, ge: newTitle },
      program: newProgram,
      target: Number(newTarget),
      unit: newUnit || '#',
      deadline: newDeadline || null,
      assignees: newAssignees,
    });
    setNewTitle('');
    setNewProgram('invest');
    setNewTarget('');
    setNewUnit('#');
    setNewDeadline('');
    setNewAssignees([]);
    setCreateOpen(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>{t('kpis')}</h1>
        {user?.role === 'admin' && (
          <Button variant="primary" onClick={() => setCreateOpen(true)}>
            {t('createKpi')}
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <SearchInput value={search} onChange={setSearch} placeholder={t('search')} style={{ width: 200 }} />
        <select className="input" value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} style={{ width: 160 }}>
          <option value="">{t('all')} — {t('program')}</option>
          {KPI_PROGRAMS.map((p) => <option key={p} value={p}>{t(p)}</option>)}
        </select>
        <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 160 }}>
          <option value="">{t('all')} — {t('status')}</option>
          {STATUS_OPTIONS.map(({ value, tKey }) => <option key={value} value={value}>{t(tKey)}</option>)}
        </select>
      </div>

      {filteredKpis.length === 0 ? (
        <div className="empty">No KPIs match these filters.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredKpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('createKpi')}
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>{t('cancel')}</Button>
            <Button variant="primary" onClick={handleCreate} disabled={!newTitle.trim() || !newTarget}>{t('save')}</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="field-label">{t('title')}</label>
            <input className="input" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="KPI title..." autoFocus />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="field-label">{t('program')}</label>
              <select className="input" value={newProgram} onChange={e => setNewProgram(e.target.value)}>
                {KPI_PROGRAMS.map(p => <option key={p} value={p}>{t(p)}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Unit</label>
              <input className="input" value={newUnit} onChange={e => setNewUnit(e.target.value)} placeholder="#" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field">
              <label className="field-label">{t('target')}</label>
              <input className="input" type="number" min="1" value={newTarget} onChange={e => setNewTarget(e.target.value)} placeholder="100" />
            </div>
            <div className="field">
              <label className="field-label">{t('deadline')}</label>
              <input className="input" type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label className="field-label">{t('assignees')}</label>
            <select multiple className="input" value={newAssignees} onChange={e => setNewAssignees(Array.from(e.target.selectedOptions, o => o.value))} style={{ height: 90 }}>
              {(members || []).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default KpiListPage;
