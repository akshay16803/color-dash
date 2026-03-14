/**
 * Tests for i18n locale completeness.
 * Ensures all locale files have the same keys as English.
 */
import en from '../../i18n/locales/en';
import ar from '../../i18n/locales/ar';
import de from '../../i18n/locales/de';
import es from '../../i18n/locales/es';
import fr from '../../i18n/locales/fr';
import hi from '../../i18n/locales/hi';
import it from '../../i18n/locales/it';
import ja from '../../i18n/locales/ja';
import ko from '../../i18n/locales/ko';
import pt from '../../i18n/locales/pt';
import ru from '../../i18n/locales/ru';
import zh from '../../i18n/locales/zh';

const enKeys = Object.keys(en).sort();
const locales = { ar, de, es, fr, hi, it, ja, ko, pt, ru, zh };

describe('i18n locales', () => {
  it('English has all required keys', () => {
    expect(enKeys.length).toBeGreaterThan(0);
    expect(en.home_title).toBe('Color Dash');
  });

  it('all locales have the same keys as English', () => {
    Object.entries(locales).forEach(([lang, strings]) => {
      const keys = Object.keys(strings).sort();
      expect(keys).toEqual(enKeys);
    });
  });

  it('no locale has empty string values', () => {
    Object.entries(locales).forEach(([lang, strings]) => {
      Object.entries(strings).forEach(([key, value]) => {
        expect(value).not.toBe('');
      });
    });
  });
});
