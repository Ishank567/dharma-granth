export type SearchResultGroup =
  | 'verse'
  | 'scripture'
  | 'chapter'
  | 'concept'
  | 'topic'
  | 'commentary'
  | 'learning'
  | 'practice';

// Backward compatibility category type for existing code
export type SearchCategory =
  | SearchResultGroup
  | 'concept'
  | 'character'
  | 'location'
  | 'dictionary'
  | 'festival'
  | 'ritual'
  | 'pathway';

export interface GroupDefinition {
  id: SearchResultGroup;
  label: string;
  hindiLabel: string;
  fullLabel: string;
  description: string;
}

export const SEARCH_GROUPS: ReadonlyArray<GroupDefinition> = [
  {
    id: 'verse',
    label: 'Exact Verses',
    hindiLabel: 'श्लोक',
    fullLabel: 'श्लोक · Exact Verses',
    description: 'Direct scripture shlokas & mantras',
  },
  {
    id: 'scripture',
    label: 'Scriptures',
    hindiLabel: 'ग्रंथ',
    fullLabel: 'ग्रंथ · Scriptures',
    description: 'Complete sacred texts & collections',
  },
  {
    id: 'chapter',
    label: 'Chapters',
    hindiLabel: 'अध्याय',
    fullLabel: 'अध्याय · Chapters',
    description: 'Specific chapters & adhyayas',
  },
  {
    id: 'concept',
    label: 'Concepts',
    hindiLabel: 'अवधारणाएँ',
    fullLabel: 'अवधारणाएँ · Concepts',
    description: 'Core philosophical concepts (Dharma, Karma, Atman, Brahman...)',
  },
  {
    id: 'topic',
    label: 'Topics',
    hindiLabel: 'विषय',
    fullLabel: 'विषय · Topics',
    description: 'Living wisdom topics & life situations',
  },
  {
    id: 'commentary',
    label: 'Commentaries',
    hindiLabel: 'टीका व व्याख्या',
    fullLabel: 'टीका व व्याख्या · Commentaries',
    description: 'Traditional tikas, bhashyas & insights',
  },
  {
    id: 'learning',
    label: 'Learning Resources',
    hindiLabel: 'अध्ययन सामग्री',
    fullLabel: 'अध्ययन सामग्री · Learning Resources',
    description: 'Study pathways, characters, dictionary & quizzes',
  },
  {
    id: 'practice',
    label: 'Daily Practices',
    hindiLabel: 'नित्य साधना',
    fullLabel: 'नित्य साधना · Daily Practices',
    description: 'Japa, meditation timer, daily reflection & rituals',
  },
];

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  group: SearchResultGroup;
  groupLabel: string;
  // For backwards compatibility with older SearchResultItem interface
  category?: SearchCategory;
  categoryLabel?: string;
  href: string;
  reference?: string;
  matchingText?: string;
  translationExcerpt?: string;
  commentaryExcerpt?: string;
  /** Which text matched, so the dialog can highlight it in the right script. */
  matchedField?: 'sanskrit' | 'roman' | 'english' | 'hindi' | 'explanation';
  /** The matched text is an AI-drafted explanation (shown with a label). */
  aiDrafted?: boolean;
  /** The translation excerpt is machine-translated (shown with a label). */
  translationIsAi?: boolean;
  matchReason: string;
  languageLabel: string;
  actionLabel: string;
  description?: string;
  extra?: string;
  score?: number;
}

export interface SearchOptions {
  group?: SearchResultGroup | null;
  category?: SearchCategory | null;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  groupedResults: Record<SearchResultGroup, SearchResultItem[]>;
  totalMatches: number;
  groupCounts: Partial<Record<SearchResultGroup, number>>;
  categoryCounts: Partial<Record<SearchCategory, number>>;
  suggestion?: string | null;
  isTypoCorrected?: boolean;
  didYouMean?: string | null;
  matchedTheme?: string | null;
}
