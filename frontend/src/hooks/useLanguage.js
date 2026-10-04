import { useState, useEffect, useCallback } from 'react';
import { LANGUAGES, DEFAULT_LANGUAGE } from '../data/languages';

const STORAGE_KEY = 'swaram_language_preference';

/**
 * useLanguage — Manages active language state with localStorage persistence.
 * Allowed values: 'TELUGU' | 'HINDI' | 'ENGLISH'
 */
export function useLanguage() {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && LANGUAGES.some((l) => l.id === saved)) {
          return saved;
        }
      } catch (err) {
        console.warn('[useLanguage] Could not read from localStorage:', err);
      }
    }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (err) {
      console.warn('[useLanguage] Could not write to localStorage:', err);
    }
  }, [language]);

  const setLanguage = useCallback((langId) => {
    if (LANGUAGES.some((l) => l.id === langId)) {
      setLanguageState(langId);
    }
  }, []);

  return {
    language,
    setLanguage,
    availableLanguages: LANGUAGES,
  };
}
