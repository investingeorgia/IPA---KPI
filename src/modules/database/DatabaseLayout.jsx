import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import RightSidebar from '@shared/components/layout/RightSidebar';
import { useLanguage } from '@shared/contexts/LanguageContext';
import CompanyDetailSidebar from './companies/CompanyDetailSidebar';
import ArticleDetailSidebar from './articles/ArticleDetailSidebar';

export const DatabaseContext = createContext(null);

export function useDatabaseContext() {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error('useDatabaseContext must be inside DatabaseLayout');
  return ctx;
}

const navLinkStyle = ({ isActive }) => ({
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: isActive ? 600 : 400,
  color: isActive ? 'var(--green)' : 'var(--ink-3)',
  borderBottom: isActive ? '2px solid var(--green)' : '2px solid transparent',
  textDecoration: 'none',
  display: 'inline-block',
});

export default function DatabaseLayout() {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    setSelectedRecord(null);
  }, [location.pathname]);

  const contextValue = {
    selectedRecord,
    setSelectedRecord,
    closeSidebar: () => setSelectedRecord(null),
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Central area */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Sub-nav */}
          <div
            style={{
              padding: '0 28px',
              borderBottom: '1px solid var(--line)',
              background: '#fff',
              flexShrink: 0,
              display: 'flex',
              gap: 4,
            }}
          >
            <NavLink to="/database/companies" style={navLinkStyle}>
              Companies
            </NavLink>
            <NavLink to="/database/articles" style={navLinkStyle}>
              Articles
            </NavLink>
          </div>

          {/* Page content */}
          <div style={{ padding: '24px 28px', flex: 1 }}>
            <Outlet />
          </div>
        </div>

        {/* Right sidebar */}
        {selectedRecord && (
          <RightSidebar
            title={
              selectedRecord.type === 'company'
                ? selectedRecord.data.name
                : selectedRecord.data.title || 'Article'
            }
            onClose={() => setSelectedRecord(null)}
          >
            {selectedRecord.type === 'company' ? (
              <CompanyDetailSidebar companyId={selectedRecord.data.id} />
            ) : (
              <ArticleDetailSidebar articleId={selectedRecord.data.id} />
            )}
          </RightSidebar>
        )}
      </div>
    </DatabaseContext.Provider>
  );
}
