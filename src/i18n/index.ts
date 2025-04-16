import { createInstance, i18n, TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { cookies } from 'next/headers';

const DEFAULT_LOCALE = 'ru';
const COOKIE_NAME = 'NEXT_LOCALE';

export async function getI18nInstance(): Promise<i18n> {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: await getLangFromCookies(),
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: ['ru', 'en', 'es'],
      defaultNS: 'common',
      fallbackNS: 'common',
      react: {
        useSuspense: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18nInstance;
}

export async function getTranslation(ns: string | string[] = 'common'): Promise<TFunction> {
  const i18nInstance = await getI18nInstance();
  return i18nInstance.getFixedT(null, ns);
}

export async function getLangFromCookies(): Promise<string> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value || DEFAULT_LOCALE;
  } catch {
    // Fallback if cookies() fails (e.g., during static rendering)
    return DEFAULT_LOCALE;
  }
}

export function setLanguage(lang: string) {
  if (typeof document !== 'undefined') {
    document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    window.location.reload();
  }
}
