export interface PathwayStep {
  id: string;
  title: string;
  titleSanskrit?: string;
  description: string;
  /** Link to the scripture chapter or external resource */
  href: string;
  /** Estimated reading time in minutes */
  estimatedMinutes: number;
  /** Optional key concepts to focus on */
  focusConcepts?: string[];
}

export interface Pathway {
  id: string;
  title: string;
  titleSanskrit?: string;
  description: string;
  /** Difficulty level */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** Category icon emoji or lucide name */
  icon: string;
  /** Gradient color classes for the card */
  gradient: string;
  /** Ordered list of steps */
  steps: PathwayStep[];
  /** What you'll gain from this pathway */
  learningOutcomes: string[];
}

export const pathways: Pathway[] = [
  /* ── 7-Day Beginner Course ────────────────────────────────────────── */
  {
    id: 'beginner-7day',
    title: 'Seven-Day Beginner Course',
    titleSanskrit: 'सप्तदिन प्रारम्भिक पाठ्यक्रम',
    description:
      'A structured 7-day introduction to the core teachings of Hindu scriptures. Each day covers one foundational concept with curated verses and reflections.',
    level: 'beginner',
    icon: '🌱',
    gradient: 'from-emerald-500 to-teal-600',
    learningOutcomes: [
      'Understand the core concepts of Dharma, Karma, and Moksha',
      'Read your first verses from the Bhagavad Gita',
      'Learn how Sanskrit verses are structured',
      'Connect ancient wisdom to modern daily life',
    ],
    steps: [
      {
        id: 'day1',
        title: 'Day 1 — What is Dharma?',
        titleSanskrit: 'धर्म क्या है?',
        description:
          'Explore the concept of Dharma — righteous duty — the foundation of Hindu philosophy. Read the opening verses of the Bhagavad Gita where Arjuna faces his moral crisis.',
        href: '/scripture/bhagavadgita/chapter/1',
        estimatedMinutes: 15,
        focusConcepts: ['Dharma', 'Arjuna\'s dilemma', 'Duty vs. emotion'],
      },
      {
        id: 'day2',
        title: 'Day 2 — The Eternal Self (Atman)',
        titleSanskrit: 'आत्मा — अनादि और अनंत',
        description:
          'Discover the concept of Atman — the immortal soul. Chapter 2 of the Gita introduces the idea that the soul is neither born nor does it die.',
        href: '/scripture/bhagavadgita/chapter/2',
        estimatedMinutes: 20,
        focusConcepts: ['Atman', 'Reincarnation', 'Energy conservation'],
      },
      {
        id: 'day3',
        title: 'Day 3 — Karma Yoga: The Path of Action',
        titleSanskrit: 'कर्म योग — कर्म का मार्ग',
        description:
          'Learn about selfless action — performing your duty without attachment to results. The famous verse "Karmaṇyevādhikāraste" is explained in detail.',
        href: '/scripture/bhagavadgita/chapter/2',
        estimatedMinutes: 20,
        focusConcepts: ['Nishkama Karma', 'Detachment', 'Flow state'],
      },
      {
        id: 'day4',
        title: 'Day 4 — The Three Gunas',
        titleSanskrit: 'त्रिगुण — सत्त्व, रजस्, तमस्',
        description:
          'Understand the three qualities of nature — Sattva (harmony), Rajas (activity), and Tamas (inertia) — and how they shape our behavior and consciousness.',
        href: '/scripture/bhagavadgita/chapter/14',
        estimatedMinutes: 18,
        focusConcepts: ['Sattva', 'Rajas', 'Tamas', 'Mental qualities'],
      },
      {
        id: 'day5',
        title: 'Day 5 — Bhakti: The Path of Devotion',
        titleSanskrit: 'भक्ति योग — प्रेम का मार्ग',
        description:
          'Explore Bhakti Yoga — the path of love and devotion. Chapter 12 of the Gita describes the qualities of a true devotee and the power of surrender.',
        href: '/scripture/bhagavadgita/chapter/12',
        estimatedMinutes: 15,
        focusConcepts: ['Bhakti', 'Devotion', 'Surrender', 'Love'],
      },
      {
        id: 'day6',
        title: 'Day 6 — The Upanishadic Vision',
        titleSanskrit: 'उपनिषद् दर्शन',
        description:
          'Dive into the Isha Upanishad — one of the shortest yet most profound Upanishads. Discover the concept of "the Self in all and all in the Self."',
        href: '/scripture/isha-upanishad/chapter/1',
        estimatedMinutes: 20,
        focusConcepts: ['Brahman', 'Atman = Brahman', 'Unity'],
      },
      {
        id: 'day7',
        title: 'Day 7 — Integration & Reflection',
        titleSanskrit: 'एकीकरण और प्रतिबिंब',
        description:
          'Review the week\'s learning, reflect on how these concepts apply to your life, and take a quiz to test your understanding. Celebrate your journey!',
        href: '/learn',
        estimatedMinutes: 15,
        focusConcepts: ['Reflection', 'Application', 'Self-assessment'],
      },
    ],
  },

  /* ── Start Studying the Gītā ──────────────────────────────────────── */
  {
    id: 'gita-pathway',
    title: 'Start Studying the Gītā',
    titleSanskrit: 'भगवद्गीता अध्ययन मार्ग',
    description:
      'A complete pathway through the Bhagavad Gita, chapter by chapter. From Arjuna\'s despair to Krishna\'s supreme revelation, walk the entire 18-chapter journey.',
    level: 'intermediate',
    icon: '🔥',
    gradient: 'from-saffron-500 to-amber-600',
    learningOutcomes: [
      'Read all 18 chapters of the Bhagavad Gita',
      'Understand the four yogas: Karma, Bhakti, Jnana, Raja',
      'Grasp the concept of Dharma in action',
      'Apply Gita wisdom to modern ethical dilemmas',
    ],
    steps: [
      {
        id: 'g1',
        title: 'Chapter 1 — Arjuna\'s Despair',
        titleSanskrit: 'अर्जुनविषादयोग',
        description: 'The setting: the battlefield of Kurukshetra. Arjuna collapses in moral crisis.',
        href: '/scripture/bhagavadgita/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'g2',
        title: 'Chapter 2 — Sankhya Yoga',
        titleSanskrit: 'सांख्ययोग',
        description: 'Krishna begins teaching: the immortality of the soul and the principle of action.',
        href: '/scripture/bhagavadgita/chapter/2',
        estimatedMinutes: 30,
      },
      {
        id: 'g3',
        title: 'Chapter 3 — Karma Yoga',
        titleSanskrit: 'कर्मयोग',
        description: 'The path of selfless action — performing duty without attachment to fruits.',
        href: '/scripture/bhagavadgita/chapter/3',
        estimatedMinutes: 25,
      },
      {
        id: 'g4',
        title: 'Chapter 4 — Jnana Yoga',
        titleSanskrit: 'ज्ञानयोग',
        description: 'The path of knowledge — understanding the nature of action and inaction.',
        href: '/scripture/bhagavadgita/chapter/4',
        estimatedMinutes: 25,
      },
      {
        id: 'g5',
        title: 'Chapter 5 — Karma Renunciation',
        titleSanskrit: 'कर्मसंन्यासयोग',
        description: 'Reconciling the paths of action and renunciation — both lead to the same goal.',
        href: '/scripture/bhagavadgita/chapter/5',
        estimatedMinutes: 20,
      },
      {
        id: 'g6',
        title: 'Chapter 6 — Dhyana Yoga',
        titleSanskrit: 'ध्यानयोग',
        description: 'The path of meditation — controlling the mind and attaining inner stillness.',
        href: '/scripture/bhagavadgita/chapter/6',
        estimatedMinutes: 25,
      },
      {
        id: 'g7',
        title: 'Chapters 7-12 — Bhakti & the Divine',
        titleSanskrit: 'भक्ति और परम तत्त्व',
        description: 'Krishna reveals his divine nature and the path of devotion.',
        href: '/scripture/bhagavadgita/chapter/11',
        estimatedMinutes: 40,
      },
      {
        id: 'g8',
        title: 'Chapters 13-18 — Knowledge & Liberation',
        titleSanskrit: 'ज्ञान और मोक्ष',
        description: 'The field and the knower, the three gunas, and the final teaching of surrender.',
        href: '/scripture/bhagavadgita/chapter/18',
        estimatedMinutes: 45,
      },
    ],
  },

  /* ── Upaniṣad Reading Pathway ─────────────────────────────────────── */
  {
    id: 'upanishad-pathway',
    title: 'Upaniṣad Reading Pathway',
    titleSanskrit: 'उपनिषद् अध्ययन मार्ग',
    description:
      'Journey through the philosophical crown jewels of Hindu thought. From the Isha to the Katha to the Mandukya, explore the foundational texts of Vedanta.',
    level: 'intermediate',
    icon: '📖',
    gradient: 'from-indigo-500 to-purple-600',
    learningOutcomes: [
      'Understand the core Vedantic teaching: "Tat Tvam Asi"',
      'Explore the concept of Brahman as universal consciousness',
      'Read key verses from major Upanishads',
      'Connect Upanishadic philosophy to modern consciousness studies',
    ],
    steps: [
      {
        id: 'u1',
        title: 'Isha Upanishad',
        titleSanskrit: 'ईशावास्योपनिषद्',
        description: 'The shortest Upanishad — "All this is enveloped by the Divine." A meditation on unity.',
        href: '/scripture/isha-upanishad/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'u2',
        title: 'Katha Upanishad',
        titleSanskrit: 'कठोपनिषद्',
        description: 'Nachiketa\'s dialogue with Yama (Death) about the nature of the Self.',
        href: '/scripture/katha-upanishad/chapter/1',
        estimatedMinutes: 30,
      },
      {
        id: 'u3',
        title: 'Kena Upanishad',
        titleSanskrit: 'केनोपनिषद्',
        description: '"By whom does the mind think?" — an inquiry into the source of consciousness.',
        href: '/scripture/kena-upanishad/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'u4',
        title: 'Mandukya Upanishad',
        titleSanskrit: 'माण्डूक्योपनिषद्',
        description: 'The analysis of OM and the four states of consciousness — waking, dream, deep sleep, and Turiya.',
        href: '/scripture/mandukya-upanishad/chapter/1',
        estimatedMinutes: 25,
      },
      {
        id: 'u5',
        title: 'Chandogya Upanishad — Tat Tvam Asi',
        titleSanskrit: 'छान्दोग्योपनिषद्',
        description: 'The great declaration "That Thou Art" — the identity of the individual self with the universal Self.',
        href: '/scripture/chandogya-upanishad/chapter/6',
        estimatedMinutes: 30,
      },
      {
        id: 'u6',
        title: 'Brihadaranyaka Upanishad',
        titleSanskrit: 'बृहदारण्यकोपनिषद्',
        description: 'The largest Upanishad — Yajnavalkya\'s teachings on the Self, "Neti Neti" (not this, not this).',
        href: '/scripture/brihadaranyaka-upanishad/chapter/1',
        estimatedMinutes: 35,
      },
    ],
  },

  /* ── Dharma and Ethics Pathway ────────────────────────────────────── */
  {
    id: 'dharma-pathway',
    title: 'Dharma and Ethics Pathway',
    titleSanskrit: 'धर्म और नीति मार्ग',
    description:
      'Explore the ethical framework of Hindu philosophy — from the concept of Dharma in the Gita to the moral teachings of the Ramayana and Manusmriti.',
    level: 'intermediate',
    icon: '⚖️',
    gradient: 'from-rose-500 to-pink-600',
    learningOutcomes: [
      'Understand Dharma as ethical duty in different life contexts',
      'Explore the four Purusharthas: Dharma, Artha, Kama, Moksha',
      'Learn ethical decision-making from the Ramayana',
      'Apply ancient ethical frameworks to modern moral dilemmas',
    ],
    steps: [
      {
        id: 'd1',
        title: 'Dharma in the Bhagavad Gita',
        titleSanskrit: 'गीता में धर्म',
        description: 'How Krishna defines Dharma as svadharma — one\'s own righteous duty based on nature and position.',
        href: '/scripture/bhagavadgita/chapter/2',
        estimatedMinutes: 25,
      },
      {
        id: 'd2',
        title: 'Dharma in the Ramayana',
        titleSanskrit: 'रामायण में धर्म',
        description: 'Rama as the embodiment of Dharma — ethical kingship, family duty, and sacrifice.',
        href: '/scripture/ramayana/chapter/1',
        estimatedMinutes: 30,
      },
      {
        id: 'd3',
        title: 'The Four Purusharthas',
        titleSanskrit: 'चतुर्विध पुरुषार्थ',
        description: 'The four aims of human life: Dharma (duty), Artha (prosperity), Kama (desire), Moksha (liberation).',
        href: '/scripture/manusmriti/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'd4',
        title: 'Ethical Dilemmas in the Mahabharata',
        titleSanskrit: 'महाभारत के नैतिक द्वंद्व',
        description: 'Complex moral situations from the Mahabharata — when duty conflicts with emotion.',
        href: '/scripture/mahabharata/chapter/1',
        estimatedMinutes: 30,
      },
      {
        id: 'd5',
        title: 'Yama and Niyama — Ethical Precepts',
        titleSanskrit: 'यम और नियम',
        description: 'The ten ethical precepts of Patanjali: non-violence, truth, non-stealing, continence, non-possessiveness.',
        href: '/scripture/yogasutra/chapter/2',
        estimatedMinutes: 25,
      },
      {
        id: 'd6',
        title: 'Modern Application of Dharma',
        titleSanskrit: 'धर्म का आधुनिक अनुप्रयोग',
        description: 'How to apply Dharma-based ethics to contemporary issues — work, relationships, and society.',
        href: '/learn',
        estimatedMinutes: 15,
      },
    ],
  },

  /* ── Yoga Philosophy Pathway ──────────────────────────────────────── */
  {
    id: 'yoga-pathway',
    title: 'Yoga Philosophy Pathway',
    titleSanskrit: 'योग दर्शन मार्ग',
    description:
      'Go beyond physical postures into the philosophical foundations of Yoga. Study Patanjali\'s Yoga Sutras, the eight limbs, and the science of consciousness.',
    level: 'advanced',
    icon: '🧘',
    gradient: 'from-blue-500 to-cyan-600',
    learningOutcomes: [
      'Understand the eight limbs of Yoga (Ashtanga)',
      'Study Patanjali\'s Yoga Sutras systematically',
      'Explore the psychology of mind according to Yoga',
      'Connect Yoga philosophy to modern neuroscience',
    ],
    steps: [
      {
        id: 'y1',
        title: 'Introduction to Yoga Sutras',
        titleSanskrit: 'योगसूत्र परिचय',
        description: 'Patanjali\'s definition of Yoga: "Yogas chitta vritti nirodhah" — calming the fluctuations of mind.',
        href: '/scripture/yogasutra/chapter/1',
        estimatedMinutes: 25,
      },
      {
        id: 'y2',
        title: 'The Eight Limbs (Ashtanga)',
        titleSanskrit: 'अष्टांग योग',
        description: 'Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi — the complete path.',
        href: '/scripture/yogasutra/chapter/2',
        estimatedMinutes: 30,
      },
      {
        id: 'y3',
        title: 'Kriya Yoga — The Yoga of Action',
        titleSanskrit: 'क्रिया योग',
        description: 'Tapas (discipline), Svadhyaya (self-study), Ishvara Pranidhana (surrender) — the three practices.',
        href: '/scripture/yogasutra/chapter/2',
        estimatedMinutes: 20,
      },
      {
        id: 'y4',
        title: 'The Obstacles (Vighnas)',
        titleSanskrit: 'योग के विघ्न',
        description: 'The nine obstacles to meditation and how to overcome them through focus and practice.',
        href: '/scripture/yogasutra/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'y5',
        title: 'Samadhi — The Goal of Yoga',
        titleSanskrit: 'समाधि',
        description: 'The states of absorption — from Savitarka to Nirbija Samadhi — the culmination of yogic practice.',
        href: '/scripture/yogasutra/chapter/3',
        estimatedMinutes: 30,
      },
      {
        id: 'y6',
        title: 'Yoga and Modern Neuroscience',
        titleSanskrit: 'योग और आधुनिक तंत्रिका विज्ञान',
        description: 'How modern neuroscience validates ancient yogic insights about meditation and consciousness.',
        href: '/learn',
        estimatedMinutes: 15,
      },
    ],
  },
];

export function getPathway(id: string): Pathway | undefined {
  return pathways.find((p) => p.id === id);
}
