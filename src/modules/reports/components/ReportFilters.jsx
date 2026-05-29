import React from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';

const KPI_PROGRAMS = ['invest', 'awareness', 'aftercare', 'fdi'];

const labelStyle = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--ink-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'block',
  marginBottom: 6,
};

export function ReportFilters({ filters, onChange, onGenerate, members = [] }) {
  const { t } = useLanguage();

  return (
    <Card>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-end' }}>
        {/* Language */}
        <div>
          <label style={labelStyle}>{t('language')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['en', 'ge'].map(l => (
              <button
                key={l}
                onClick={() => onChange({ lang: l })}
                style={{
                  padding: '5px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  cursor: 'pointer',
                  background: filters.lang === l ? 'var(--green)' : '#fff',
                  color: filters.lang === l ? '#fff' : 'var(--ink)',
                  fontWeight: filters.lang === l ? 600 : 400,
                }}
              >
                {l === 'en' ? 'English' : 'Georgian'}
              </button>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div>
          <label style={labelStyle}>{t('scope')}</label>
          <select
            className="input"
            value={filters.scope}
            onChange={e => onChange({ scope: e.target.value, programId: '', memberId: '' })}
          >
            <option value="all">{t('allKpis')}</option>
            <option value="program">{t('program')}</option>
            <option value="member">{t('individual')}</option>
          </select>
        </div>

        {/* Conditional sub-selector */}
        {filters.scope === 'program' && (
          <div>
            <label style={labelStyle}>{t('program')}</label>
            <select
              className="input"
              value={filters.programId}
              onChange={e => onChange({ programId: e.target.value })}
            >
              <option value="">All programs</option>
              {KPI_PROGRAMS.map(p => (
                <option key={p} value={p}>{t(p)}</option>
              ))}
            </select>
          </div>
        )}

        {filters.scope === 'member' && (
          <div>
            <label style={labelStyle}>Member</label>
            <select
              className="input"
              value={filters.memberId}
              onChange={e => onChange({ memberId: e.target.value })}
            >
              <option value="">Select member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Date range */}
        <div>
          <label style={labelStyle}>{t('dateRange')}</label>
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              type="date"
              className="input"
              value={filters.dateFrom}
              onChange={e => onChange({ dateFrom: e.target.value })}
            />
            <span style={{ alignSelf: 'center', color: 'var(--ink-3)' }}>—</span>
            <input
              type="date"
              className="input"
              value={filters.dateTo}
              onChange={e => onChange({ dateTo: e.target.value })}
            />
          </div>
        </div>

        {/* Generate button */}
        <Button variant="primary" onClick={onGenerate}>
          {t('preview')} →
        </Button>
      </div>
    </Card>
  );
}

export default ReportFilters;
