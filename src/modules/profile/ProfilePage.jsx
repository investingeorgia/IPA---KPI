import React, { useState } from 'react';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import Card from '@shared/components/ui/Card';
import Button from '@shared/components/ui/Button';
import Avatar from '@shared/components/ui/Avatar';
import Badge from '@shared/components/ui/Badge';

const fieldLabel = {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--ink-3)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'block',
  marginBottom: 6,
};

export function ProfilePage() {
  const { user } = useAuth();
  const { lang, setLang, t } = useLanguage();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>{t('profile')}</h1>

      <Card style={{ marginBottom: 20 }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <Avatar user={user} size="xl" />
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{user?.name}</div>
            <div style={{ color: 'var(--ink-3)', fontSize: 13 }}>{user?.email}</div>
            <Badge
              label={user?.role}
              color={user?.role === 'admin' ? 'blue' : 'gray'}
              style={{ marginTop: 6 }}
            />
          </div>
        </div>

        {/* Display name */}
        <div style={{ marginBottom: 16 }}>
          <label style={fieldLabel}>Display name</label>
          <input
            className="input"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
          />
        </div>

        {/* Language preference */}
        <div style={{ marginBottom: 20 }}>
          <label style={fieldLabel}>{t('language')}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['en', 'ge'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  padding: '6px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  cursor: 'pointer',
                  background: lang === l ? 'var(--green)' : '#fff',
                  color: lang === l ? '#fff' : 'var(--ink)',
                  fontWeight: lang === l ? 600 : 400,
                }}
              >
                {l === 'en' ? 'English' : 'ქართული'}
              </button>
            ))}
          </div>
        </div>

        <Button variant="primary" onClick={handleSave}>
          {saved ? '✓ Saved' : t('save')}
        </Button>
      </Card>

      {/* Password section — disabled until Chunk 9 */}
      <Card title="Password">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.5, pointerEvents: 'none' }}>
          <input type="password" className="input" placeholder="Current password" disabled />
          <input type="password" className="input" placeholder="New password" disabled />
          <input type="password" className="input" placeholder="Confirm new password" disabled />
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 10 }}>
          Password management available after authentication setup.
        </div>
      </Card>
    </div>
  );
}

export default ProfilePage;
