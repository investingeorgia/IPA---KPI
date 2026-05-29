import React from 'react';
import { useLanguage } from '@shared/contexts/LanguageContext';

const VIEWS = [
  { key: 'list',     tKey: 'list' },
  { key: 'board',    tKey: 'board' },
  { key: 'timeline', tKey: 'timeline' },
];

export function ViewSwitcher({ view, onChange }) {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: 2, background: 'var(--ink-6, #F3F4F6)', borderRadius: 6, padding: 2 }}>
      {VIEWS.map(({ key, tKey }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          style={{
            padding: '5px 14px',
            fontSize: 13,
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
            fontWeight: view === key ? 600 : 400,
            background: view === key ? '#fff' : 'transparent',
            color: view === key ? 'var(--ink)' : 'var(--ink-3)',
            boxShadow: view === key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.15s',
          }}
        >
          {t(tKey)}
        </button>
      ))}
    </div>
  );
}

export default ViewSwitcher;
