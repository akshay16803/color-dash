/**
 * Translation hook for i18n support.
 * Supports 12 locales with interpolation and fallback to English.
 */
import { useState, useCallback, useEffect } from 'react';
import { getLocales } from 'expo-localization';
import { loadLocale, saveLocale } from '@/utils/storage';

// Import all locale files
import en from '@/i18n/locales/en';
import ar from '@/i18n/locales/ar';
import de from '@/i18n/locales/de';
import es from '@/i18n/locales/es';
import fr from '@/i18n/locales/fr';
import hi from '@/i18n/locales/hi';
import it from '@/i18n/locales/it';
import ja from '@/i18n/locales/ja';
import ko from '@/i18n/locales/ko';
import pt from '@/i18n/locales/pt';
import ru from '@/i18n/locales/ru';
import zh from '@/i18n/locales/zh';

type TranslationStrings = typeof en;
type TranslationKey = keyof TranslationStrings;

const LOCALES: Record<string, TranslationStrings> = {
  en, ar, de, es, fr, hi, it, ja, ko, pt, ru, zh,
};

export const SUPPORTED_LOCALES = Object.keys(LOCALES);

/** Get the device's preferred locale, limited to supported ones */
function getDeviceLocale(): string {
  try {
    const deviceLocales = getLocales();
    if (deviceLocales.length > 0) {
      const lang = deviceLocales[0].languageCode ?? 'en';
      if (lang in LOCALES) return lang;
    }
  } catch {
    // Fall through
  }
  return 'en';
}

/** Current active locale (module-level for sharing across hooks) */
let _activeLocale = 'en';
let _initialized = false;
const _listeners = new Set<() => void>();

export function useTranslation() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    _listeners.add(listener);

    // Initialize locale on first mount
    if (!_initialized) {
      _initialized = true;
      loadLocale().then((saved) => {
        _activeLocale = saved ?? getDeviceLocale();
        _listeners.forEach((l) => l());
      });
    }

    return () => {
      _listeners.delete(listener);
    };
  }, []);

  /**
   * Translate a key with optional interpolation.
   * Usage: t('gameOver_allTimeBest', { highScore: 100, gamesPlayed: 5 })
   */
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>): string => {
      const strings = LOCALES[_activeLocale] ?? en;
      let text = (strings[key] as string) ?? (en[key] as string) ?? key;

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }

      return text;
    },
    []
  );

  /** Change the active locale */
  const setLocale = useCallback(async (locale: string) => {
    if (locale in LOCALES) {
      _activeLocale = locale;
      await saveLocale(locale);
      _listeners.forEach((l) => l());
    }
  }, []);

  return {
    t,
    locale: _activeLocale,
    setLocale,
    supportedLocales: SUPPORTED_LOCALES,
  };
}
