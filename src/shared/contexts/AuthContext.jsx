// ============================================================
// AuthContext.jsx — authentication state
// CHUNK 1: hardcoded mock admin user
// CHUNK 9: replace with Firebase Auth + Firestore user doc
// ============================================================
import { createContext, useContext, useState } from 'react';

// Mock user — stays as admin throughout development until Chunk 9
const MOCK_USER = {
  id:       'u0',
  name:     'Nino Beridze',
  email:    'nino.beridze@enterprise.gov.ge',
  role:     'admin',   // 'admin' | 'user'
  initials: 'NB',
  color:    '#0B3D2E',
  language: 'en',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(MOCK_USER);

  // CHUNK 9: replace with signInWithEmailAndPassword
  function login(email, _password) {
    console.warn('[AuthContext] Mock login — replace in Chunk 9');
    setUser(MOCK_USER);
  }

  // CHUNK 9: replace with Firebase signOut
  function logout() {
    console.warn('[AuthContext] Mock logout — replace in Chunk 9');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook — returns { user, login, logout } */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
