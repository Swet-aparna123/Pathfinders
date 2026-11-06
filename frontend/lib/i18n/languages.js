/**
 * Single Configuration List for Supported Languages in PathFinders
 *
 * To add a new language later:
 * 1. Add one entry here with:
 *    - code: ISO 639-1 language code (e.g. 'mr', 'ta')
 *    - nativeName: Language name in its native script (e.g. 'मराठी', 'தமிழ்')
 *    - englishName: English name of the language (e.g. 'Marathi', 'Tamil')
 *    - script: Writing script (e.g. 'Devanagari', 'Tamil')
 *    - dir: 'ltr' (or 'rtl')
 * 2. Create the corresponding JSON translation file under ./translations/{code}.json
 * 3. Register the file in ./translations/index.js
 *
 * No screens or UI components need to be edited!
 */

export const LANGUAGES = [
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    script: 'Latin',
    dir: 'ltr',
  },
  {
    code: 'hi',
    nativeName: 'हिन्दी',
    englishName: 'Hindi',
    script: 'Devanagari',
    dir: 'ltr',
  },
  {
    code: 'or',
    nativeName: 'ଓଡ଼ିଆ',
    englishName: 'Odia',
    script: 'Odia',
    dir: 'ltr',
  },
  {
    code: 'bn',
    nativeName: 'বাংলা',
    englishName: 'Bengali',
    script: 'Bengali',
    dir: 'ltr',
  },
  {
    code: 'te',
    nativeName: 'తెలుగు',
    englishName: 'Telugu',
    script: 'Telugu',
    dir: 'ltr',
  },
  {
    code: 'mr',
    nativeName: 'मराठी',
    englishName: 'Marathi',
    script: 'Devanagari',
    dir: 'ltr',
  },
  {
    code: 'gu',
    nativeName: 'ગુજરાતી',
    englishName: 'Gujarati',
    script: 'Gujarati',
    dir: 'ltr',
  },
  {
    code: 'ur',
    nativeName: 'اردو',
    englishName: 'Urdu',
    script: 'Perso-Arabic',
    dir: 'rtl',
  },
  {
    code: 'kn',
    nativeName: 'ಕನ್ನಡ',
    englishName: 'Kannada',
    script: 'Kannada',
    dir: 'ltr',
  },
  {
    code: 'ml',
    nativeName: 'മലയാളം',
    englishName: 'Malayalam',
    script: 'Malayalam',
    dir: 'ltr',
  },
];

export const DEFAULT_LANGUAGE = 'en';

export function getLanguage(code) {
  return LANGUAGES.find((lang) => lang.code === code) || LANGUAGES[0];
}

export function isValidLanguage(code) {
  return LANGUAGES.some((lang) => lang.code === code);
}

