/**
 * Swaram — Language Configuration Data
 *
 * Supported languages: Telugu, Hindi, English.
 * Default: English (unless restored from localStorage preference).
 */

export const LANGUAGES = [
  {
    id: 'ENGLISH',
    code: 'en',
    label: 'English',
    nativeLabel: 'English',
  },
  {
    id: 'TELUGU',
    code: 'te',
    label: 'Telugu',
    nativeLabel: 'తెలుగు',
  },
  {
    id: 'HINDI',
    code: 'hi',
    label: 'Hindi',
    nativeLabel: 'हिन्दी',
  },
];

export const DEFAULT_LANGUAGE = 'ENGLISH';

export function getLanguageById(id) {
  return LANGUAGES.find((l) => l.id === id) || LANGUAGES[0];
}
