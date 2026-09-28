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
        href: '/scripture/ishavasya/chapter/1',
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
        href: '/scripture/ishavasya/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'u2',
        title: 'Katha Upanishad',
        titleSanskrit: 'कठोपनिषद्',
        description: 'Nachiketa\'s dialogue with Yama (Death) about the nature of the Self.',
        href: '/scripture/katha/chapter/1',
        estimatedMinutes: 30,
      },
      {
        id: 'u3',
        title: 'Kena Upanishad',
        titleSanskrit: 'केनोपनिषद्',
        description: '"By whom does the mind think?" — an inquiry into the source of consciousness.',
        href: '/scripture/kena/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'u4',
        title: 'Mandukya Upanishad',
        titleSanskrit: 'माण्डूक्योपनिषद्',
        description: 'The analysis of OM and the four states of consciousness — waking, dream, deep sleep, and Turiya.',
        href: '/scripture/mandukya/chapter/1',
        estimatedMinutes: 25,
      },
      {
        id: 'u5',
        title: 'Chandogya Upanishad — Tat Tvam Asi',
        titleSanskrit: 'छान्दोग्योपनिषद्',
        description: 'The great declaration "That Thou Art" — the identity of the individual self with the universal Self.',
        href: '/scripture/chandogya/chapter/6',
        estimatedMinutes: 30,
      },
      {
        id: 'u6',
        title: 'Brihadaranyaka Upanishad',
        titleSanskrit: 'बृहदारण्यकोपनिषद्',
        description: 'The largest Upanishad — Yajnavalkya\'s teachings on the Self, "Neti Neti" (not this, not this).',
        href: '/scripture/brihadaranyaka/chapter/1',
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
        title: 'Daivi Sampad — The Ethical Virtues',
        titleSanskrit: 'दैवी सम्पद् — नैतिक सद्गुण',
        description: 'The divine virtues taught in Chapter 16 of the Gita: Ahimsa (non-violence), Satya (truthfulness), Dana (generosity), and Dama (self-restraint).',
        href: '/scripture/bhagavadgita/chapter/16',
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
    title: 'Yoga Philosophy & Sadhana Pathway',
    titleSanskrit: 'योग दर्शन एवं साधना मार्ग',
    description:
      'Go beyond physical postures into the classical science of Yoga. Study the Shiva Samhita, breath control in Shiva Swarodaya, and Dhyana in the Bhagavad Gita.',
    level: 'advanced',
    icon: '🧘',
    gradient: 'from-blue-500 to-cyan-600',
    learningOutcomes: [
      'Understand the philosophical foundations of Yoga',
      'Study the subtle body: Nadis, Prana, and Chakras',
      'Learn the science of breath mastery (Swarodaya)',
      'Practice Dhyana Yoga and mind stillness',
    ],
    steps: [
      {
        id: 'y1',
        title: 'Foundations of Yoga — Shiva Samhita',
        titleSanskrit: 'शिवसंहिता — योग का प्रारम्भ',
        description: 'The nature of consciousness, karmic liberation, and the cosmic body as taught in Shiva Samhita Chapter 1.',
        href: '/scripture/shivasamhita/chapter/1',
        estimatedMinutes: 25,
      },
      {
        id: 'y2',
        title: 'The Subtle Body — Nadis and Prana',
        titleSanskrit: 'नाड़ी और प्राण तत्त्व',
        description: 'The 72,000 nadis, the central Sushumna, and the flow of vital breath according to classical Yogic texts.',
        href: '/scripture/shivasamhita/chapter/2',
        estimatedMinutes: 30,
      },
      {
        id: 'y3',
        title: 'Pranayama and Breath Mastery — Shiva Swarodaya',
        titleSanskrit: 'स्वरोदय — श्वास और साधना विज्ञान',
        description: 'The sacred science of Ida, Pingala, and Sushumna breaths for mental clarity, health, and spiritual alignment.',
        href: '/scripture/shivaswarodaya/chapter/1',
        estimatedMinutes: 25,
      },
      {
        id: 'y4',
        title: 'Mastering the Mind — Amritabindu Upanishad',
        titleSanskrit: 'अमृतबिन्दु — मन का नियंत्रण',
        description: 'The mind as the sole cause of bondage and liberation. Stillness achieved through Pranava (AUM) meditation.',
        href: '/scripture/amritabindu/chapter/1',
        estimatedMinutes: 20,
      },
      {
        id: 'y5',
        title: 'Dhyana Yoga and Samadhi — Bhagavad Gita',
        titleSanskrit: 'ध्यानयोग और समाधि',
        description: 'Krishna\'s step-by-step guidance on meditation posture, mental discipline, and the state of equanimous Samadhi.',
        href: '/scripture/bhagavadgita/chapter/6',
        estimatedMinutes: 30,
      },
      {
        id: 'y6',
        title: 'Yoga and Modern Neuroscience',
        titleSanskrit: 'योग और आधुनिक तंत्रिका विज्ञान',
        description: 'How modern neuroscience validates ancient yogic insights about meditation and neuroplasticity.',
        href: '/learn',
        estimatedMinutes: 15,
      },
    ],
  },

  /* ── Advaita Vedanta Fundamentals ─────────────────────────────────── */
  {
    id: 'vedanta-pathway',
    title: 'Vedānta Fundamentals: The Path of Knowledge',
    titleSanskrit: 'वेदान्त दर्शन: तत्त्वज्ञान मार्ग',
    description:
      'Explore the crowning philosophy of Hindu spirituality. Trace the non-dual truth through the foundational texts of the Prasthanatrayi and Vivekachudamani.',
    level: 'advanced',
    icon: '☀️',
    gradient: 'from-amber-600 to-yellow-600',
    learningOutcomes: [
      'Understand the three pillars of Vedanta (Prasthanatrayi)',
      'Grasp the identity of Atman and Brahman (Tat Tvam Asi)',
      'Learn the qualifications of the true seeker (Sadhana Chatushtaya)',
      'Understand the concept of Jivanmukti (living liberation)',
    ],
    steps: [
      {
        id: 'v1',
        title: 'The Search for the Ultimate: Brahma Sutras',
        titleSanskrit: 'अथातो ब्रह्मजिज्ञासा',
        description: 'Vyasa\'s opening aphorism — the inquiry into the eternal Reality from which all existence originates.',
        href: '/scripture/brahmasutra/chapter/1',
        estimatedMinutes: 25,
        focusConcepts: ['Brahman', 'Brahma Sutra', 'Jijnasa'],
      },
      {
        id: 'v2',
        title: 'The Divine Presence Everywhere: Isha Upanishad',
        titleSanskrit: 'ईशावास्यमिदं सर्वम्',
        description: 'Seeing the Self in all beings and all beings in the Self — the eradication of sorrow and delusion.',
        href: '/scripture/ishavasya/chapter/1',
        estimatedMinutes: 20,
        focusConcepts: ['Isha', 'Non-attachment', 'Equanimity'],
      },
      {
        id: 'v3',
        title: 'Tat Tvam Asi: Chandogya Upanishad',
        titleSanskrit: 'तत्त्वमसि — तुम वही हो',
        description: 'Uddalaka\'s famous teaching to Shvetaketu with nine profound analogies of clay, rivers, and salt water.',
        href: '/scripture/chandogya/chapter/6',
        estimatedMinutes: 30,
        focusConcepts: ['Mahavakya', 'Tat Tvam Asi', 'Pure Existence'],
      },
      {
        id: 'v4',
        title: 'The Four States of Consciousness: Mandukya',
        titleSanskrit: 'माण्डूक्य और तुरीय',
        description: 'Waking (Vaishvanara), Dream (Taijasa), Deep Sleep (Prajna), and Turiya — the silent witness beyond time.',
        href: '/scripture/mandukya/chapter/1',
        estimatedMinutes: 25,
        focusConcepts: ['Turiya', 'AUM', 'Consciousness'],
      },
      {
        id: 'v5',
        title: 'Discernment and Dispassion: Vivekachudamani',
        titleSanskrit: 'विवेक और वैराग्य',
        description: 'Adi Shankaracharya\'s masterwork on the crest-jewel of discrimination between the Real and the unreal.',
        href: '/scripture/vivekchudamani/chapter/1',
        estimatedMinutes: 30,
        focusConcepts: ['Viveka', 'Vairagya', 'Shatka Sampatti'],
      },
      {
        id: 'v6',
        title: 'Living Free: The State of the Jivanmukta',
        titleSanskrit: 'जीवन्मुक्ति का स्वरूप',
        description: 'The Muktika Upanishad and Gita on the marks of one who is liberated while still living in this world.',
        href: '/scripture/muktika/chapter/1',
        estimatedMinutes: 25,
        focusConcepts: ['Jivanmukti', 'Inner Freedom', 'Muktika'],
      },
    ],
  },

  /* ── Bhakti Yoga & Devotional Literature ──────────────────────────── */
  {
    id: 'bhakti-pathway',
    title: 'Bhakti Yoga: The Path of Divine Love',
    titleSanskrit: 'भक्ति योग: प्रेम और समर्पण मार्ग',
    description:
      'Immerse in the devotional heart of Sanatana Dharma. From the aphorisms of Narada and Sandilya to the nectar of the Gita and Ramcharitmanas.',
    level: 'beginner',
    icon: '🪷',
    gradient: 'from-rose-500 to-amber-600',
    learningOutcomes: [
      'Understand the definition of supreme love (Parama-Prema)',
      'Learn the 9 forms of devotion (Navadha Bhakti)',
      'Study Krishna\'s qualities of a beloved devotee',
      'Discover prayer and surrender (Sharanagati) in daily sadhana',
    ],
    steps: [
      {
        id: 'b1',
        title: 'The Nature of Supreme Love: Narada Bhakti Sutras',
        titleSanskrit: 'सा त्वस्मिन् परमप्रेमरूपा',
        description: 'Sage Narada defines divine love: nectarous, boundless, and free from selfish longing.',
        href: '/scripture/naradabhaktisutra/chapter/1',
        estimatedMinutes: 20,
        focusConcepts: ['Parama Prema', 'Narada', 'Amrita'],
      },
      {
        id: 'b2',
        title: 'The Beloved Devotee: Bhagavad Gita Chapter 12',
        titleSanskrit: 'भक्त के लक्षण',
        description: 'Krishna describes the 35 qualities of the devotee who is dearest to the Divine — peaceful, kind, and steady.',
        href: '/scripture/bhagavadgita/chapter/12',
        estimatedMinutes: 25,
        focusConcepts: ['Bhakta Lakshana', 'Samatvam', 'Devotion'],
      },
      {
        id: 'b3',
        title: 'Navadha Bhakti: Nine Paths of Devotion',
        titleSanskrit: 'नवधा भक्ति',
        description: 'Shri Rama reveals the nine expressions of devotion to Shabari in the Aranya Kanda of Ramcharitmanas.',
        href: '/scripture/ramcharitmanas/chapter/3',
        estimatedMinutes: 25,
        focusConcepts: ['Navadha Bhakti', 'Shabari', 'Satsang'],
      },
      {
        id: 'b4',
        title: 'The Soul\'s Petition: Vinaya Patrika',
        titleSanskrit: 'विनय पत्रिका — हृदय की पुकार',
        description: 'Goswami Tulsidas\'s sublime hymns of humility, surrender, and unwavering refuge at the lotus feet of the Divine.',
        href: '/scripture/vinayapatrika/chapter/1',
        estimatedMinutes: 20,
        focusConcepts: ['Dainya', 'Sharanagati', 'Tulsidas'],
      },
      {
        id: 'b5',
        title: 'The Philosophy of Faith: Sandilya Bhakti Sutras',
        titleSanskrit: 'शाण्डिल्य भक्तिसूत्र',
        description: 'The profound philosophy reconciling pure devotion with the non-dual supreme reality.',
        href: '/scripture/shandilyabhaktisutra/chapter/1',
        estimatedMinutes: 25,
        focusConcepts: ['Anurakti', 'Sandilya', 'Divine Union'],
      },
    ],
  },
];

export function getPathway(id: string): Pathway | undefined {
  return pathways.find((p) => p.id === id);
}
