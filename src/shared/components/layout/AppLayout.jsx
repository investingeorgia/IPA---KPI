import { useState } from 'react';
import { useAuth }     from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import MainSidebar  from '@shared/components/layout/MainSidebar';
import RightSidebar from '@shared/components/layout/RightSidebar';
import Icon         from '@shared/components/ui/Icon';

export default function AppLayout({
  children,
  rightSidebar,
  rightSidebarTitle,
  onRightSidebarClose,
  fullBleed = false,
}) {
  const { logout }           = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <div
      className={`kpi-root lang-${lang}`}
      style={{ height: '100vh', display: 'flex', background: 'var(--cream)' }}
    >
      <MainSidebar onQuickLog={() => setQuickLogOpen(true)} />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Topbar */}
        <header
          style={{
            padding: '12px 24px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            background: '#fff',
            flex: '0 0 auto',
          }}
        >
          {/* Search */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              maxWidth: 340,
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: 11,
                color: 'var(--ink-3)',
                display: 'flex',
              }}
            >
              <Icon name="search" className="icon icon-sm" />
            </span>
            <input
              className="input"
              placeholder={t('search')}
              style={{
                paddingLeft: 32,
                height: 36,
                borderRadius: 999,
                background: 'var(--cream)',
                width: '100%',
              }}
            />
          </div>

          {/* Right side */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            {/* Language toggle */}
            <div className="seg">
              <button
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={lang === 'ge' ? 'active' : ''}
                onClick={() => setLang('ge')}
              >
                GE
              </button>
            </div>

            {/* Logout */}
            <button className="btn-icon" onClick={logout} title={t('logout')}>
              <Icon name="logout" className="icon" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: fullBleed ? 'hidden' : 'auto',
          }}
        >
          {fullBleed ? (
            children
          ) : (
            <div
              style={{
                padding: '24px 28px 32px',
                maxWidth: 1320,
                margin: '0 auto',
              }}
            >
              {children}
            </div>
          )}
        </div>
      </main>

      {/* Right sidebar */}
      {rightSidebar && (
        <RightSidebar title={rightSidebarTitle} onClose={onRightSidebarClose}>
          {rightSidebar}
        </RightSidebar>
      )}
    </div>
  );
}
