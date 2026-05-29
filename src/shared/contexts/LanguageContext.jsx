// ============================================================
// LanguageContext.jsx — app-wide language state (EN / GE)
// ============================================================
import { createContext, useContext, useState } from 'react';
import { tr } from '@data/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en'); // 'en' | 'ge'

  /** Translate a key in the current language */
  const t = (key) => tr(key, lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Hook — use in any component */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
