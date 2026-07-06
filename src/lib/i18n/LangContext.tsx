'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import he from '@/locales/he.json';
import en from '@/locales/en.json';

export type Lang = 'he' | 'en';
export type Translations = typeof he;

interface LangContextValue {
  lang: Lang;
  t: Translations;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('he');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (lang === 'he' ? he : en) as Translations;

  return (
    <LangContext.Provider value={{ lang, t, toggleLang: () => setLang(l => l === 'he' ? 'en' : 'he') }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
