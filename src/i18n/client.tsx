'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import i18next from 'i18next';
import { initReactI18next, useTranslation as useTranslationOrg } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { usePathname } from 'next/navigation';

// Initialize i18next once for client-side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    supportedLngs: ['ru', 'en', 'es'],
    fallbackLng: 'ru',
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',
    detection: {
      order: ['cookie', 'navigator'],
      lookupCookie: 'NEXT_LOCALE',
      caches: ['cookie'],
    },
    react: {
      useSuspense: false,
    },
  });

export interface I18nProviderProps {
  children: ReactNode;
}

const I18nContext = createContext({ i18n: i18next });

export function I18nProvider({ children }: I18nProviderProps) {
  const pathname = usePathname();

  // Get locale from path: /en/path -> 'en'
  const locale = pathname.split('/')[1];

  useEffect(() => {
    if (locale && i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }
  }, [locale]);

  return <I18nContext.Provider value={{ i18n: i18next }}>{children}</I18nContext.Provider>;
}

export function useTranslation(ns: string = 'common') {
  const { i18n } = useContext(I18nContext);
  const { t, ready } = useTranslationOrg(ns);

  return {
    t,
    i18n,
    ready,
  };
}
