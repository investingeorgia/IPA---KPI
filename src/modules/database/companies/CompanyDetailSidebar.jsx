import React from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '@shared/hooks/useDatabase';
import { useTeam } from '@shared/hooks/useTeam';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { getLabel, formatDate } from '@shared/utils/formatters';

function CompanyDetailSidebar({ companyId }) {
  const { getCompanyById, updateCompany, getLogsForEntity } = useDatabase();
  const { getMemberById } = useTeam();
  const { getKpiById } = useKPIs();
  const { lang } = useLanguage();

  const company = getCompanyById(companyId);
  if (!company) return null;

  const logs = getLogsForEntity('company', companyId).slice(0, 10);

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--ink-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  };

  return (
    <div>
      {/* Name */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Name</div>
        <input
          className="input"
          defaultValue={company.name}
          onBlur={(e) => updateCompany(companyId, { name: e.target.value })}
          style={{ width: '100%' }}
        />
      </div>

      {/* Website */}
      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>Website</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            className="input"
            defaultValue={company.website}
            onBlur={(e) => updateCompany(companyId, { website: e.target.value })}
            style={{ flex: 1 }}
          />
          {company.website && (
            <a
              href={`https://${company.website}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: 'var(--green)', fontSize: 12 }}
            >
              ↗
            </a>
          )}
        </div>
      </div>

      {/* Notes */}
      <div style={{ marginBottom: 20 }}>
        <div style={labelStyle}>Notes</div>
        <textarea
          className="input"
          rows={3}
          defaultValue={company.description}
          onBlur={(e) => updateCompany(companyId, { description: e.target.value })}
          style={{ width: '100%', resize: 'vertical' }}
        />
      </div>

      {/* Activity history */}
      <div>
        <div style={labelStyle}>Activity</div>
        {logs.length === 0 && (
          <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>No activity yet</div>
        )}
        {logs.map((log) => {
          const kpi = getKpiById(log.kpiId);
          return (
            <div
              key={log.id}
              style={{
                fontSize: 12,
                borderBottom: '1px solid var(--ink-5)',
                padding: '6px 0',
                display: 'grid',
                gridTemplateColumns: '70px 1fr 60px',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'var(--ink-3)' }}>{formatDate(log.date)}</span>
              <span>{kpi ? getLabel(kpi.title, lang) : '—'}</span>
              <span style={{ color: 'var(--ink-3)' }}>+{log.count}</span>
            </div>
          );
        })}
      </div>

      {/* Full page link */}
      <div style={{ marginTop: 20 }}>
        <Link
          to={`/database/companies/${companyId}`}
          style={{ fontSize: 13, color: 'var(--green)' }}
        >
          Open full page →
        </Link>
      </div>
    </div>
  );
}

export { CompanyDetailSidebar };
export default CompanyDetailSidebar;
