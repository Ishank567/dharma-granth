'use client';

import { useLocalStorage } from './useLocalStorage';

export type LanguagePreference = 'bilingual' | 'hindi' | 'english' | 'sanskrit';

export interface LanguageOption {
  id: LanguagePreference;
  label: string;
  shortLabel: string;
  sub: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'bilingual', label: 'द्विभाषी (Bilingual)', shortLabel: 'द्विभाषी', sub: 'हिन्दी + English' },
  { id: 'hindi', label: 'हिन्दी (Hindi)', shortLabel: 'हिन्दी', sub: 'प्राथमिक हिन्दी' },
  { id: 'english', label: 'English', shortLabel: 'English', sub: 'English focus' },
  { id: 'sanskrit', label: 'संस्कृत (Sanskrit)', shortLabel: 'संस्कृत', sub: 'मूल संहिता व पाठ' },
];

export function useLanguagePreference() {
  const [preference, setPreference] = useLocalStorage<LanguagePreference>(
    'dharma.language_preference',
    'bilingual',
  );

  return {
    preference,
    setPreference,
    currentOption:
      LANGUAGE_OPTIONS.find((opt) => opt.id === preference) ?? LANGUAGE_OPTIONS[0],
    options: LANGUAGE_OPTIONS,
  };
}
