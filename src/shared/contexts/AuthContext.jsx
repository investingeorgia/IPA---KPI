import { createContext, useContext, useState, useEffect } from 'react';
import { loginWithEmail, logout as firebaseLogout, onAuthChanged } from '../../firebase/authService';

// Profile data keyed by Firebase UID (or email fallback).
// In Chunk 10 this will come from a Firestore /users/{uid} doc.
const PROFILES = {
  'dtavlalashvili@enterprise.gov.ge': {
    id:       'u0',
    name:     'D. Tavlalashvili',
    role:     'admin',
    initials: 'DT',
    color:    '#0B3D2E',
    language: 'en',
  },
};

function buildUser(firebaseUser) {
  const profile = PROFILES[firebaseUser.email] ?? {
    name:     firebaseUser.displayName || firebaseUser.email,
    role:     'user',
    initials: (firebaseUser.displayName || firebaseUser.email).slice(0, 2).toUpperCase(),
    color:    '#555',
    language: 'en',
  };
  return {
    id:          profile.id || firebaseUser.uid,
    firebaseUid: firebaseUser.uid,
    email:       firebaseUser.email,
    ...profile,
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChanged((firebaseUser) => {
      setUser(firebaseUser ? buildUser(firebaseUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email, password) {
    await loginWithEmail(email, password);
    // onAuthChanged fires automatically and sets user
  }

  async function logout() {
    await firebaseLogout();
    // onAuthChanged fires automatically and sets user to null
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading…
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
