'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { LANGUAGES, DEFAULT_LANGUAGE, getLanguage, isValidLanguage } from './languages';
import { translations } from './translations';
import { userProfileService } from '@/lib/userProfileService';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'pathfinders_preferred_language';

/**
 * Key mapping aliases to ensure grouped area keys and short keys resolve seamlessly
 */
const KEY_ALIASES = {
  'nav.': 'navigation.',
  'navigation.': 'nav.',
};

/**
 * Helper to safely resolve dot-notated keys in a nested object.
 * e.g., resolveKey(obj, 'hero.title')
 */
function resolveKey(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      current = undefined;
      break;
    }
  }

  if (typeof current === 'string') return current;

  // Try alias if not found
  for (const [from, to] of Object.entries(KEY_ALIASES)) {
    if (path.startsWith(from)) {
      const altPath = to + path.slice(from.length);
      const altParts = altPath.split('.');
      let altCurrent = obj;
      for (const p of altParts) {
        if (altCurrent && typeof altCurrent === 'object' && p in altCurrent) {
          altCurrent = altCurrent[p];
        } else {
          altCurrent = undefined;
          break;
        }
      }
      if (typeof altCurrent === 'string') return altCurrent;
    }
  }

  return undefined;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language on client mount from localStorage, user profile, or query param
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const queryLang = urlParams.get('lang');
        const storedLang = window.localStorage.getItem(STORAGE_KEY);
        const profile = userProfileService.getProfile();
        const profileLang = profile?.preferredLanguage;

        const candidate = queryLang || profileLang || storedLang || DEFAULT_LANGUAGE;
        if (isValidLanguage(candidate)) {
          setLanguageState(candidate);
          document.documentElement.lang = candidate;
          document.documentElement.dir = getLanguage(candidate).dir || 'ltr';
        } else {
          setLanguageState(DEFAULT_LANGUAGE);
          document.documentElement.lang = DEFAULT_LANGUAGE;
          document.documentElement.dir = 'ltr';
        }
      }
    } catch {
      // LocalStorage might be disabled or restricted in certain environments
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const changeLanguage = useCallback((code, role = null) => {
    if (!isValidLanguage(code)) return;
    setLanguageState(code);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, code);
        document.documentElement.lang = code;
        document.documentElement.dir = getLanguage(code).dir || 'ltr';

        // Persist language to user profile for independent role preference
        const activeRole = role || userProfileService.getProfile()?.role || 'student';
        userProfileService.setLanguageForRole(activeRole, code);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const currentLanguage = useMemo(() => getLanguage(language), [language]);

  /**
   * Translate function
   * @param {string} key - Dot-separated translation key, e.g. "hero.titlePart1"
   * @param {object} [params] - Optional parameters for interpolation, e.g. { name: 'Priya' }
   * @param {string} [defaultText] - Optional fallback text if key is missing in both current & default language
   */
  const t = useCallback(
    (key, params = {}, defaultText = '') => {
      if (!key) return defaultText || '';

      // 1. Try active language
      const activeDict = translations[language];
      let text = resolveKey(activeDict, key);

      // 2. Fallback to English if not found, and log in development
      if (text === undefined && language !== DEFAULT_LANGUAGE) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[i18n] Missing translation key: "${key}" in language "${language}". Showing English fallback.`);
        }
        const fallbackDict = translations[DEFAULT_LANGUAGE];
        text = resolveKey(fallbackDict, key);
      }

      // 3. Fallback to provided default text or key name (never blank)
      if (text === undefined || text === '') {
        text = defaultText || key;
      }

      // 4. Interpolate parameters if any provided
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }

      return text;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      currentLanguage,
      languages: LANGUAGES,
      setLanguage: changeLanguage,
      t,
      isInitialized,
    }),
    [language, currentLanguage, changeLanguage, t, isInitialized]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Alias for convenience
export const useTranslation = useLanguage;

