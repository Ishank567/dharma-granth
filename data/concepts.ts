export type ConceptCategory = 'core' | 'metaphysics' | 'practice' | 'psychology' | 'cosmology';

export interface Concept {
  id: string;
  label: string;
  sanskrit: string;
  transliteration: string;
  category: ConceptCategory;
  shortDesc: string;
  description: string;
  connections: string[];
  scriptureRefs?: string[];
}

export const conceptCategories: {
  key: ConceptCategory;
  label: string;
  sanskrit: string;
  gradient: string;
  border: string;
  text: string;
  icon: string;
}[] = [
  { key: 'core', label: 'Core', sanskrit: 'मूल', gradient: 'from-saffron-500 to-amber-600', border: 'border-saffron-400', text: 'text-saffron-700', icon: '🕉️' },
  { key: 'metaphysics', label: 'Metaphysics', sanskrit: 'तत्त्वज्ञान', gradient: 'from-indigo-500 to-blue-600', border: 'border-indigo-400', text: 'text-indigo-700', icon: '🌌' },
  { key: 'practice', label: 'Practice', sanskrit: 'अभ्यास', gradient: 'from-emerald-500 to-green-600', border: 'border-emerald-400', text: 'text-emerald-700', icon: '🧘' },
  { key: 'psychology', label: 'Psychology', sanskrit: 'मनोविज्ञान', gradient: 'from-rose-500 to-pink-600', border: 'border-rose-400', text: 'text-rose-700', icon: '🧠' },
  { key: 'cosmology', label: 'Cosmology', sanskrit: 'ब्रह्माण्ड', gradient: 'from-purple-500 to-violet-600', border: 'border-purple-400', text: 'text-purple-700', icon: '✨' },
];

export const concepts: Concept[] = [
  // ── Core ──────────────────────────────────────────────────────
  {
    id: 'brahman',
    label: 'Brahman',
    sanskrit: 'ब्रह्मन्',
    transliteration: 'brahman',
    category: 'core',
    shortDesc: 'The Ultimate Reality — infinite, unchanging ground of all existence.',
    description: 'Brahman is the Absolute — the formless, infinite, eternal reality that underlies all phenomena. It is described as Sat-Chit-Ananda (Being-Consciousness-Bliss). "All this is Brahman" (Chandogya Upanishad). Beyond name and form, yet the source of all names and forms.',
    connections: ['atman', 'maya', 'om', 'ishvara', 'moksha'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'atman',
    label: 'Atman',
    sanskrit: 'आत्मन्',
    transliteration: 'ātman',
    category: 'core',
    shortDesc: 'The inner Self — the immortal witness consciousness within all beings.',
    description: 'Atman is the true Self, distinct from body, mind, and ego. It is eternal, unborn, and undying. The Upanishads declare "Tat Tvam Asi" — "That thou art" — identifying Atman with Brahman. Realizing this unity is the goal of Vedanta.',
    connections: ['brahman', 'samsara', 'moksha', 'purusha', 'viveka'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'karma',
    label: 'Karma',
    sanskrit: 'कर्म',
    transliteration: 'karma',
    category: 'core',
    shortDesc: 'The universal law of action and its consequences across lifetimes.',
    description: 'Karma is the moral law of cause and effect. Every action — physical, verbal, or mental — creates impressions (samskaras) that shape future experiences. Karma binds the soul to samsara but can also be a path to liberation when performed selflessly.',
    connections: ['samsara', 'dharma', 'karma-yoga', 'vasana'],
    scriptureRefs: ['bhagavadgita', 'upanishads'],
  },
  {
    id: 'dharma',
    label: 'Dharma',
    sanskrit: 'धर्म',
    transliteration: 'dharma',
    category: 'core',
    shortDesc: 'Cosmic order, righteousness, and one\'s sacred duty in life.',
    description: 'Dharma is the eternal law that upholds the universe — the moral and ethical framework that sustains cosmic and social order. It encompasses duty, righteousness, justice, and the right way of living. "Better to fail in one\'s own dharma than succeed in another\'s" (Bhagavad Gita 3.35).',
    connections: ['karma', 'yoga', 'bhakti', 'avatar', 'yuga'],
    scriptureRefs: ['bhagavadgita', 'manusmriti', 'mahabharata'],
  },

  // ── Metaphysics ───────────────────────────────────────────────
  {
    id: 'maya',
    label: 'Maya',
    sanskrit: 'माया',
    transliteration: 'māyā',
    category: 'metaphysics',
    shortDesc: 'The cosmic power that veils the true nature of reality, creating the illusion of separateness.',
    description: 'Maya is the divine power of Brahman that projects the appearance of the material world. It is neither real nor unreal — it is "neither this nor that." Maya makes the One appear as many, the Infinite as finite. Overcoming maya through knowledge leads to liberation.',
    connections: ['avidya', 'prakriti', 'brahman'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'moksha',
    label: 'Moksha',
    sanskrit: 'मोक्ष',
    transliteration: 'mokṣa',
    category: 'metaphysics',
    shortDesc: 'Liberation from the cycle of samsara — the supreme goal of human life.',
    description: 'Moksha is the ultimate liberation — freedom from the cycle of birth, death, and rebirth. It is the direct realization of one\'s identity with Brahman. Moksha is not a place or state to be reached, but the recognition of what has always been true: the Self is already free.',
    connections: ['atman', 'brahman', 'samsara', 'jnana', 'viveka', 'yoga'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'samsara',
    label: 'Samsara',
    sanskrit: 'संसार',
    transliteration: 'saṃsāra',
    category: 'metaphysics',
    shortDesc: 'The endless cycle of birth, death, and rebirth driven by karma.',
    description: 'Samsara is the wheel of existence — the continuous cycle of birth, death, and rebirth that all beings undergo. It is fueled by karma and desire. Liberation (moksha) is the exit from this cycle, achieved through self-knowledge and the dissolution of attachments.',
    connections: ['karma', 'moksha', 'atman', 'vasana', 'yuga'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'prakriti',
    label: 'Prakriti',
    sanskrit: 'प्रकृति',
    transliteration: 'prakṛti',
    category: 'metaphysics',
    shortDesc: 'Primordial Nature — the material cause of the universe, composed of three gunas.',
    description: 'Prakriti is the fundamental material nature — the primal substance from which the entire physical universe evolves. It is composed of the three gunas (sattva, rajas, tamas) in various combinations. In Samkhya philosophy, prakriti is the counterpart to purusha (consciousness).',
    connections: ['guna', 'maya', 'purusha'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'purusha',
    label: 'Purusha',
    sanskrit: 'पुरुष',
    transliteration: 'puruṣa',
    category: 'metaphysics',
    shortDesc: 'Pure consciousness — the silent witness that observes but does not act.',
    description: 'Purusha is the transcendental subject — pure awareness that is the witness of all experience. Unlike prakriti (which acts and evolves), purusha is inactive, eternal, and unchanging. In Vedanta, purusha is identified with Atman, the inner Self.',
    connections: ['atman', 'prakriti', 'moksha'],
    scriptureRefs: ['upanishads', 'samkhya'],
  },

  // ── Practice ──────────────────────────────────────────────────
  {
    id: 'yoga',
    label: 'Yoga',
    sanskrit: 'योग',
    transliteration: 'yoga',
    category: 'practice',
    shortDesc: 'Union with the divine — the science of spiritual discipline and integration.',
    description: 'Yoga means "union" — the joining of the individual self with the Universal Self. It encompasses multiple paths: Karma Yoga (action), Bhakti Yoga (devotion), Jnana Yoga (knowledge), and Dhyana Yoga (meditation). "Yoga is skill in action" (Bhagavad Gita 2.50).',
    connections: ['moksha', 'dhyana', 'dharma', 'karma-yoga'],
    scriptureRefs: ['bhagavadgita', 'yogasutras'],
  },
  {
    id: 'bhakti',
    label: 'Bhakti',
    sanskrit: 'भक्ति',
    transliteration: 'bhakti',
    category: 'practice',
    shortDesc: 'Devotion and love for the divine — the path of the heart.',
    description: 'Bhakti is intense, selfless love and devotion toward the divine. It is considered the easiest path in the Kali Yuga. Through singing, prayer, worship, and surrender, the devotee dissolves the ego and merges with the beloved. "Whoever offers Me a leaf, a flower, fruit or water with devotion — I accept" (Bhagavad Gita 9.26).',
    connections: ['moksha', 'ishvara', 'dharma'],
    scriptureRefs: ['bhagavadgita', 'ramcharitmanas'],
  },
  {
    id: 'jnana',
    label: 'Jnana',
    sanskrit: 'ज्ञान',
    transliteration: 'jñāna',
    category: 'practice',
    shortDesc: 'Spiritual knowledge — the direct realization of the truth of one\'s being.',
    description: 'Jnana is the path of knowledge — the philosophical inquiry into the nature of reality. It involves sravana (hearing), manana (reflection), and nididhyasana (meditation) on the great truths. The jnani seeks to directly realize "I am Brahman" through discrimination between the real and the unreal.',
    connections: ['moksha', 'avidya', 'viveka'],
    scriptureRefs: ['upanishads', 'bhagavadgita'],
  },
  {
    id: 'karma-yoga',
    label: 'Karma Yoga',
    sanskrit: 'कर्म योग',
    transliteration: 'karma yoga',
    category: 'practice',
    shortDesc: 'The path of selfless action — performing duties without attachment to results.',
    description: 'Karma Yoga is the discipline of acting without desire for the fruits of action. "You have a right to action alone, never to its fruits" (Bhagavad Gita 2.47). By dedicating all actions to the divine and renouncing attachment, the karma yogi purifies the mind and attains liberation.',
    connections: ['karma', 'moksha', 'yoga', 'dharma'],
    scriptureRefs: ['bhagavadgita'],
  },
  {
    id: 'dhyana',
    label: 'Dhyana',
    sanskrit: 'ध्यान',
    transliteration: 'dhyāna',
    category: 'practice',
    shortDesc: 'Meditation — the practice of stilling the mind to reveal the Self.',
    description: 'Dhyana is sustained, unbroken meditation — the seventh limb of Patanjali\'s eightfold yoga. It is the state of continuous awareness without the meditator being aware of the process. From dhyana arises samadhi, the state of complete absorption in the object of meditation.',
    connections: ['yoga', 'om', 'manas'],
    scriptureRefs: ['bhagavadgita', 'yogasutras'],
  },

  // ── Psychology ────────────────────────────────────────────────
  {
    id: 'guna',
    label: 'Gunas',
    sanskrit: 'गुण',
    transliteration: 'guṇa',
    category: 'psychology',
    shortDesc: 'The three qualities of nature: sattva (harmony), rajas (activity), tamas (inertia).',
    description: 'The three gunas are the fundamental qualities that constitute prakriti and govern all material and mental phenomena. Sattva is purity, clarity, and harmony. Rajas is passion, activity, and restlessness. Tamas is ignorance, inertia, and darkness. "The gunas act on the gunas" (Bhagavad Gita 3.28) — they bind the embodied soul through attachment.',
    connections: ['prakriti', 'manas', 'vasana'],
    scriptureRefs: ['bhagavadgita', 'samkhya'],
  },
  {
    id: 'avidya',
    label: 'Avidya',
    sanskrit: 'अविद्या',
    transliteration: 'avidyā',
    category: 'psychology',
    shortDesc: 'Spiritual ignorance — the root cause of suffering and bondage.',
    description: 'Avidya is the fundamental ignorance of one\'s true nature — mistaking the body-mind complex for the Self. It is the root cause of all suffering and the primary obstacle to liberation. Avidya is not lack of information but a deep misperception of reality. It is destroyed by jnana (spiritual knowledge).',
    connections: ['maya', 'jnana', 'samsara', 'manas'],
    scriptureRefs: ['upanishads', 'yogasutras'],
  },
  {
    id: 'viveka',
    label: 'Viveka',
    sanskrit: 'विवेक',
    transliteration: 'viveka',
    category: 'psychology',
    shortDesc: 'Discrimination — the capacity to distinguish the real from the unreal.',
    description: 'Viveka is the faculty of spiritual discrimination — the ability to distinguish between the permanent and the impermanent, the Self and the not-Self, the real and the apparent. It is the first of the four qualifications (sadhana chatushtaya) required for the path of jnana. Without viveka, liberation is impossible.',
    connections: ['jnana', 'moksha', 'atman'],
    scriptureRefs: ['upanishads', 'vivekachudamani'],
  },
  {
    id: 'manas',
    label: 'Manas',
    sanskrit: 'मनस्',
    transliteration: 'manas',
    category: 'psychology',
    shortDesc: 'The mind — the faculty of thought, deliberation, and emotion.',
    description: 'Manas is the thinking faculty — the part of the inner instrument (antahkarana) responsible for deliberation, doubt, and emotion. It receives input from the senses and processes it. "The mind is restless, turbulent, obstinate, and very strong, O Krishna — to subdue it is more difficult than controlling the wind" (Bhagavad Gita 6.34).',
    connections: ['guna', 'dhyana', 'avidya'],
    scriptureRefs: ['bhagavadgita', 'upanishads'],
  },
  {
    id: 'vasana',
    label: 'Vasana',
    sanskrit: 'वासना',
    transliteration: 'vāsanā',
    category: 'psychology',
    shortDesc: 'Subtle desires and tendencies — the deep impressions that drive behavior across lifetimes.',
    description: 'Vasanas are subtle, unconscious desires and tendencies — the deep-rooted impressions (samskaras) left by past actions and experiences. They shape personality, drive behavior, and propel the cycle of rebirth. Eradicating vasanas through self-knowledge and detachment is essential for liberation.',
    connections: ['karma', 'guna', 'samsara'],
    scriptureRefs: ['upanishads', 'yogasutras'],
  },

  // ── Cosmology ─────────────────────────────────────────────────
  {
    id: 'om',
    label: 'Om',
    sanskrit: 'ॐ',
    transliteration: 'oṃ',
    category: 'cosmology',
    shortDesc: 'The primordial sound — the sonic representation of Brahman.',
    description: 'Om (Pranava) is the most sacred sound in Hinduism — the primordial vibration from which the universe arises. It is composed of three syllables (A-U-M) representing the three states of consciousness and the trimurti. "The syllable Om is Brahman. This is the highest support" (Katha Upanishad).',
    connections: ['brahman', 'dhyana', 'ishvara'],
    scriptureRefs: ['upanishads', 'bhagavadgita', 'yogasutras'],
  },
  {
    id: 'ishvara',
    label: 'Ishvara',
    sanskrit: 'ईश्वर',
    transliteration: 'īśvara',
    category: 'cosmology',
    shortDesc: 'The Lord — the personal aspect of the divine who governs the universe.',
    description: 'Ishvara is the personal God — the supreme ruler and cosmic governor. While Brahman is the impersonal Absolute, Ishvara is Brahman with attributes (saguna) — the creator, preserver, and destroyer. In Patanjali\'s Yoga Sutras, Ishvara is a special purusha, untouched by ignorance and karma.',
    connections: ['brahman', 'bhakti', 'avatar', 'om'],
    scriptureRefs: ['bhagavadgita', 'yogasutras'],
  },
  {
    id: 'avatar',
    label: 'Avatar',
    sanskrit: 'अवतार',
    transliteration: 'avatāra',
    category: 'cosmology',
    shortDesc: 'Divine incarnation — the descent of the divine into human form.',
    description: 'An avatar is a divine incarnation — the descent of the supreme into the world of matter. Avatars appear to restore dharma when it declines. "Whenever dharma declines and adharma rises, I manifest Myself" (Bhagavad Gita 4.7). The ten avatars of Vishnu (Dashavatara) are the most well-known.',
    connections: ['ishvara', 'dharma', 'yuga'],
    scriptureRefs: ['bhagavadgita', 'puranas'],
  },
  {
    id: 'yuga',
    label: 'Yugas',
    sanskrit: 'युग',
    transliteration: 'yuga',
    category: 'cosmology',
    shortDesc: 'The four cosmic ages — cycles of time that repeat endlessly.',
    description: 'The Yugas are the four ages of a cosmic cycle (Mahayuga): Satya (golden age of truth), Treta (silver age), Dvapara (bronze age), and Kali (iron age of decline). Each yuga sees a progressive decline in dharma, lifespan, and spiritual awareness. We are currently in Kali Yuga, which lasts 432,000 years.',
    connections: ['dharma', 'avatar', 'samsara'],
    scriptureRefs: ['manusmriti', 'puranas', 'mahabharata'],
  },
];

export function getConcept(id: string): Concept | undefined {
  return concepts.find((c) => c.id === id);
}

export function getConnectedConcepts(id: string): Concept[] {
  const concept = getConcept(id);
  if (!concept) return [];
  return concept.connections
    .map((connId) => getConcept(connId))
    .filter((c): c is Concept => c !== undefined);
}

