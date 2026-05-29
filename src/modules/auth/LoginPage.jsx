import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';
import { useLanguage } from '@shared/contexts/LanguageContext';
import Button from '@shared/components/ui/Button';

export function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const code = err?.code || '';
      if (code.includes('user-not-found'))   setError('No account found for this email.');
      else if (code.includes('wrong-password')) setError('Incorrect password.');
      else if (code.includes('invalid-email'))  setError('Invalid email address.');
      else setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--cream)',
    }}>
      <div style={{ width: 360 }}>
        {/* Logo / title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 4 }}>
            {t('org')}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            {t('appName')}
          </h1>
        </div>

        {/* Card */}
        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>
                {t('email')}
              </label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@enterprise.gov.ge"
                autoFocus
                autoComplete="email"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)', display: 'block', marginBottom: 5 }}>
                {t('password')}
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div style={{ fontSize: 13, color: 'var(--red)', background: 'var(--red-bg, #FEE2E2)', padding: '8px 12px', borderRadius: 6 }}>
                {error}
              </div>
            )}

            <Button variant="primary" type="submit" loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
              {t('signIn')}
            </Button>
          </form>

          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 16, marginBottom: 0, textAlign: 'center' }}>
            {t('signInSub')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
