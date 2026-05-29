import React, { useEffect } from 'react';
import { getLabel, formatDate, formatActivityType } from '@shared/utils/formatters';
import { calcPct } from '@shared/utils/statusCalculators';

const PROGRAM_LABELS = {
  invest:    { en: 'Investment Attraction', ge: 'ინვესტიციების მოზიდვა' },
  awareness: { en: 'Awareness',             ge: 'ცნობადობა' },
  aftercare: { en: 'Aftercare',             ge: 'Aftercare' },
  fdi:       { en: 'FDI Grant',             ge: 'FDI გრანტი' },
};

export function ReportPreview({ kpis, logs, members, reportLang, dateFrom, dateTo }) {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = '__report-print-style';
    style.textContent = `@media print {
      body > * { display: none !important; }
      #report-preview-root { display: block !important; }
      #report-preview-root * { display: revert !important; }
    }`;
    if (!document.getElementById('__report-print-style')) {
      document.head.appendChild(style);
    }
    return () => {
      document.getElementById('__report-print-style')?.remove();
    };
  }, []);

  return (
    <div id="report-preview-root" style={{ fontFamily: 'Georgia, serif', color: '#111', padding: 8 }}>
      {/* Agency header */}
      <div style={{ borderBottom: '2px solid #000', paddingBottom: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>
          {reportLang === 'ge' ? 'საქართველოს საინვესტიციო სააგენტო' : 'Georgian Investment Agency'}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
          {reportLang === 'ge' ? 'KPI ანგარიში' : 'KPI Performance Report'}
        </h1>
        {(dateFrom || dateTo) && (
          <div style={{ fontSize: 12, color: '#444' }}>
            {dateFrom && formatDate(dateFrom)} — {dateTo && formatDate(dateTo)}
          </div>
        )}
        <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
          {reportLang === 'ge' ? 'შექმნილია:' : 'Generated:'}{' '}
          {formatDate(new Date().toISOString().slice(0, 10))}
        </div>
      </div>

      {/* KPI sections */}
      {(kpis || []).map(kpi => {
        const pct = calcPct(kpi.current, kpi.target);
        const kpiLogs = (logs || []).filter(l => l.kpiId === kpi.id);

        const byType = {};
        for (const log of kpiLogs) {
          byType[log.activityType] = (byType[log.activityType] || 0) + log.count;
        }

        const tasks = kpi.tasks || [];
        const doneTasks = tasks.filter(t => t.status === 'done').length;

        return (
          <div key={kpi.id} style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '1px solid #ddd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>
                  {getLabel(PROGRAM_LABELS[kpi.program] || { en: kpi.program, ge: kpi.program }, reportLang)}
                </div>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>
                  {getLabel(kpi.title, reportLang)}
                </h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{pct}%</div>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {kpi.current} / {kpi.target} {kpi.unit}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: '#eee', borderRadius: 4, height: 6, marginBottom: 12 }}>
              <div
                style={{
                  background: pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444',
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 4,
                }}
              />
            </div>

            {/* Activity breakdown */}
            {Object.keys(byType).length > 0 && (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 4 }}>
                  {reportLang === 'ge' ? 'აქტივობები' : 'Activity breakdown'}
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  {Object.entries(byType).map(([type, count]) => (
                    <span key={type} style={{ fontSize: 12 }}>
                      {formatActivityType(type, reportLang)}: <strong>{count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Task completion */}
            {tasks.length > 0 && (
              <div style={{ fontSize: 12, color: '#666' }}>
                {reportLang === 'ge' ? 'დავალებები:' : 'Tasks:'} {doneTasks}/{tasks.length}{' '}
                {reportLang === 'ge' ? 'შესრულებული' : 'complete'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ReportPreview;
