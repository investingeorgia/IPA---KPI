import React, { useState } from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import { useData } from '@shared/contexts/DataContext';
import { useKPIs } from '@shared/hooks/useKPIs';
import { useTeam } from '@shared/hooks/useTeam';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import { exportToPDF } from '@shared/utils/exportPDF';
import ReportFilters from './components/ReportFilters';
import ReportPreview from './components/ReportPreview';

const DEFAULT_FILTERS = {
  lang: 'en',
  scope: 'all',
  programId: '',
  memberId: '',
  dateFrom: '',
  dateTo: '',
};

export function ReportsPage() {
  const { t } = useLanguage();
  const { kpis: allKpis } = useKPIs();
  const { members } = useTeam();
  const { logs } = useData();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [reportData, setReportData] = useState(null);

  function handleGenerate() {
    let kpis = allKpis;
    if (filters.scope === 'program' && filters.programId) {
      kpis = kpis.filter(k => k.program === filters.programId);
    } else if (filters.scope === 'member' && filters.memberId) {
      kpis = kpis.filter(k => k.assignees?.includes(filters.memberId));
    }

    let filteredLogs = logs || [];
    if (filters.dateFrom) filteredLogs = filteredLogs.filter(l => l.date >= filters.dateFrom);
    if (filters.dateTo)   filteredLogs = filteredLogs.filter(l => l.date <= filters.dateTo);

    setReportData({
      kpis,
      logs: filteredLogs,
      members,
      reportLang: filters.lang,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>{t('reports')}</h1>
        {reportData && (
          <Button variant="primary" onClick={exportToPDF}>
            {t('exportPdf')}
          </Button>
        )}
      </div>

      <ReportFilters
        filters={filters}
        onChange={patch => setFilters(prev => ({ ...prev, ...patch }))}
        onGenerate={handleGenerate}
        members={members}
      />

      {reportData && (
        <Card title={t('preview')}>
          <ReportPreview {...reportData} />
        </Card>
      )}
    </div>
  );
}

export default ReportsPage;
