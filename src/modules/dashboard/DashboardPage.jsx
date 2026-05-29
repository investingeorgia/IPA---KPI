import React from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';
import KpiSummaryCards from './components/KpiSummaryCards';
import TeamProgressOverview from './components/TeamProgressOverview';
import RecentActivityFeed from './components/RecentActivityFeed';

export function DashboardPage() {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--ink)', marginBottom: 0 }}>
        {t('dashboard')}
      </h1>
      <KpiSummaryCards />
      <TeamProgressOverview />
      <RecentActivityFeed />
    </div>
  );
}

export default DashboardPage;
