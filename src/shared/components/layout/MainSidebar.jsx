import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth }     from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import Icon   from '@shared/components/ui/Icon';
import Avatar from '@shared/components/ui/Avatar';

const navItems = [
  { path: '/dashboard', icon: 'grid',  labelKey: 'dashboard' },
  { path: '/kpis',      icon: 'target', labelKey: 'kpis' },
  { path: '/todos',     icon: 'list',   labelKey: 'todos' },
  { path: '/team',      icon: 'users',  labelKey: 'team',    adminOnly: true },
  { path: '/database',  icon: 'db',     labelKey: 'database' },
  { path: '/reports',   icon: 'doc',    labelKey: 'reports', adminOnly: true },
];

export default function MainSidebar({ onQuickLog }) {
  const { user }         = useAuth();
  const { lang, setLang, t } = useLanguage();
  const navigate         = useNavigate();
  const location         = useLocation();

  const isActive = (path) =>
    path === '/database'
      ? location.pathname.startsWith('/database')
      : location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside
      style={{
        width: 236,
        height: '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        borderRight: '1px solid var(--line)',
        padding: '18px 14px',
        gap: 16,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 2 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9,
            background: 'var(--green-900)',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Icon name="target" className="icon-sm" style={{ color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
            IPA KPI Hub
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', lineHeight: 1.2 }}>
            {t('org')}
          </div>
        </div>
      </div>

      {/* Quick Log button */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
        onClick={onQuickLog}
      >
        <Icon name="bolt" className="icon-sm" />
        {t('quickLog')}
      </button>

      {/* Nav links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map((item) => {
          if (item.adminOnly && user?.role !== 'admin') return null;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '9px 10px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 13,
                fontWeight: 500,
                textAlign: 'left',
                width: '100%',
                background: active ? 'var(--green-50)' : 'transparent',
                color: active ? 'var(--green-900)' : 'var(--ink-2)',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              <Icon name={item.icon} className="icon-sm" />
              {t(item.labelKey)}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ marginTop: 'auto' }} />

      {/* Language toggle */}
      <div className="seg" style={{ alignSelf: 'flex-start' }}>
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

      {/* User card */}
      {user && (
        <div
          onClick={() => navigate('/profile')}
          style={{
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            cursor: 'pointer',
          }}
        >
          <Avatar user={user} size="sm" />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--ink)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user.name}
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'capitalize' }}>
              {user.role}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
