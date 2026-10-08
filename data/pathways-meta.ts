export interface PathwaySummary {
  id: string;
  title: string;
  titleSanskrit?: string;
  icon: string;
  gradient: string;
  stepsCount: number;
}

export const PATHWAY_SUMMARIES: PathwaySummary[] = [
  {
    id: 'beginner',
    title: 'Complete Beginner: Foundation of Sanatana Dharma',
    titleSanskrit: 'सनातन धर्म: प्रारम्भिक स्वाध्याय',
    icon: '🌱',
    gradient: 'from-emerald-700 via-teal-800 to-amber-950',
    stepsCount: 6,
  },
  {
    id: 'bhagavad-gita',
    title: 'Bhagavad Gita: The Yoga of Action & Wisdom',
    titleSanskrit: 'श्रीमद्भगवद्गीता स्वाध्याय',
    icon: '🔥',
    gradient: 'from-saffron-700 via-amber-800 to-red-950',
    stepsCount: 7,
  },
  {
    id: 'upanishads',
    title: 'The Principal Upanishads: Vedantic Inquiries',
    titleSanskrit: 'मुख्य उपनिषद् दर्शन',
    icon: '📖',
    gradient: 'from-indigo-800 via-purple-900 to-slate-950',
    stepsCount: 6,
  },
  {
    id: 'vedas-overview',
    title: 'The Four Vedas: The Primordial Shruti',
    titleSanskrit: 'चतुर्वेद परिचय एवं संहिता दर्शन',
    icon: '⚡',
    gradient: 'from-amber-700 via-orange-800 to-stone-950',
    stepsCount: 6,
  },
  {
    id: 'ramayana',
    title: 'Ramayana: The Epic Path of Maryada & Dharma',
    titleSanskrit: 'वाल्मीकि रामायण: मर्यादा पुरुषोत्तम',
    icon: '🏹',
    gradient: 'from-amber-700 via-yellow-800 to-stone-900',
    stepsCount: 6,
  },
  {
    id: 'mahabharata',
    title: 'Mahabharata: The Web of Human Destiny & Dharma',
    titleSanskrit: 'महाभारत: सूक्ष्म धर्म एवं नीति',
    icon: '🛡️',
    gradient: 'from-stone-800 via-red-950 to-neutral-950',
    stepsCount: 6,
  },
  {
    id: 'bhakti-traditions',
    title: 'Bhakti Traditions: Pathways of Divine Love',
    titleSanskrit: 'भक्ति परम्परा: प्रेम और समर्पण',
    icon: '🪷',
    gradient: 'from-rose-700 via-pink-800 to-amber-950',
    stepsCount: 6,
  },
  {
    id: 'vedanta-foundations',
    title: 'Vedanta Foundations: Prasthanatrayi & Non-Duality',
    titleSanskrit: 'वेदान्त आधार: प्रस्थानत्रयी एवं अद्वैत',
    icon: '☀️',
    gradient: 'from-amber-600 via-yellow-700 to-stone-950',
    stepsCount: 6,
  },
];

export const TOTAL_QUIZZES_COUNT = 8;
