'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enMessages from '@/messages/en.json';
import hiMessages from '@/messages/hi.json';
import mrMessages from '@/messages/mr.json';

export type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (path: string, fallback?: string) => string;
}

const messagesMap: Record<Language, any> = {
  en: enMessages,
  hi: hiMessages,
  mr: mrMessages,
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (path: string, fallback?: string) => fallback || path,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('entitletrace_lang') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('entitletrace_lang', newLang);
    } catch (e) {
      // localStorage may fail in private mode
    }
  };

  const t = (path: string, fallback?: string): string => {
    const keys = path.split('.');
    let current = messagesMap[lang];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to English if translation is missing in current language
        let enCurrent = messagesMap.en;
        for (const enKey of keys) {
          if (enCurrent && typeof enCurrent === 'object' && enKey in enCurrent) {
            enCurrent = enCurrent[enKey];
          } else {
            return fallback !== undefined ? fallback : path;
          }
        }
        return typeof enCurrent === 'string' ? enCurrent : (fallback !== undefined ? fallback : path);
      }
    }

    return typeof current === 'string' ? current : (fallback !== undefined ? fallback : path);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
