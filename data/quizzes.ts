export interface QuizQuestion {
  id: string;
  question: string;
  questionSanskrit?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  titleSanskrit?: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    id: 'gita-basics',
    title: 'Bhagavad Gita — Basics',
    titleSanskrit: 'भगवद्गीता — मूल अवधारणाएँ',
    description: 'Test your understanding of the foundational concepts from the Bhagavad Gita.',
    category: 'Bhagavad Gita',
    difficulty: 'beginner',
    questions: [
      {
        id: 'q1',
        question: 'On which battlefield was the Bhagavad Gita spoken?',
        options: ['Kurukshetra', 'Ayodhya', 'Dwarka', 'Hastinapur'],
        correctIndex: 0,
        explanation: 'The Gita was spoken on the battlefield of Kurukshetra, just before the great Mahabharata war.',
      },
      {
        id: 'q2',
        question: 'Who is the speaker (teacher) in the Bhagavad Gita?',
        options: ['Arjuna', 'Krishna', 'Vyasa', 'Sanjaya'],
        correctIndex: 1,
        explanation: 'Lord Krishna is the divine teacher who imparts the wisdom of the Gita to Arjuna.',
      },
      {
        id: 'q3',
        question: 'What does "Karma Yoga" mean?',
        options: [
          'Meditation and breath control',
          'Selfless action without attachment to results',
          'Devotion and prayer',
          'Study of scriptures',
        ],
        correctIndex: 1,
        explanation: 'Karma Yoga is the path of selfless action — performing one\'s duty without attachment to the fruits of action.',
      },
      {
        id: 'q4',
        question: 'Which verse contains the teaching "You have a right only to action, never to its fruits"?',
        options: [
          'Chapter 2, Verse 47',
          'Chapter 1, Verse 1',
          'Chapter 11, Verse 32',
          'Chapter 18, Verse 66',
        ],
        correctIndex: 0,
        explanation: 'BG 2.47: "Karmaṇyevādhikāraste mā phaleṣu kadācana" — one of the most famous verses in the Gita.',
      },
      {
        id: 'q5',
        question: 'What are the three Gunas (qualities of nature) described in the Gita?',
        options: [
          'Sattva, Rajas, Tamas',
          'Dharma, Artha, Kama',
          'Yama, Niyama, Asana',
          'Brahma, Vishnu, Shiva',
        ],
        correctIndex: 0,
        explanation: 'Sattva (harmony/purity), Rajas (activity/passion), and Tamas (inertia/darkness) are the three Gunas.',
      },
      {
        id: 'q6',
        question: 'What is the central teaching of Chapter 11 (Vishvarupa Darshana)?',
        options: [
          'The path of meditation',
          'Krishna reveals his universal cosmic form',
          'The nature of the three Gunas',
          'The concept of Svadharma',
        ],
        correctIndex: 1,
        explanation: 'In Chapter 11, Krishna grants Arjuna divine vision to see His Vishvarupa — the universal form containing all of creation.',
      },
      {
        id: 'q7',
        question: 'What does Krishna say about the soul (Atman) in Chapter 2?',
        options: [
          'It is born and dies with the body',
          'It is eternal — never born, never dies',
          'It exists only in humans',
          'It is created by karma',
        ],
        correctIndex: 1,
        explanation: 'BG 2.20: "Na jāyate mriyate vā kadācin" — the soul is never born and never dies. It is eternal and unchanging.',
      },
      {
        id: 'q8',
        question: 'What is the final teaching Krishna gives in Chapter 18?',
        options: [
          'Abandon all dharmas and surrender to Me alone',
          'Perform all rituals perfectly',
          'Renounce the world completely',
          'Worship only through sacrifice',
        ],
        correctIndex: 0,
        explanation: 'BG 18.66: "Sarvadharmān parityajya mām ekaṃ śaraṇaṃ vraja" — surrender to God alone, and He will free you from all sins.',
      },
    ],
  },
  {
    id: 'upanishad-basics',
    title: 'Upaniṣads — Foundations of Vedanta',
    titleSanskrit: 'उपनिषद् — वेदान्त की नींव',
    description: 'Test your knowledge of the philosophical concepts from the major Upanishads.',
    category: 'Upanishads',
    difficulty: 'intermediate',
    questions: [
      {
        id: 'u1',
        question: 'What does "Tat Tvam Asi" mean?',
        options: [
          'You are the body',
          'That Thou Art — you are the infinite',
          'Truth alone triumphs',
          'The world is an illusion',
        ],
        correctIndex: 1,
        explanation: 'From the Chandogya Upanishad — one of the four Mahavakyas, declaring the identity of the individual self with Brahman.',
      },
      {
        id: 'u2',
        question: 'Which Upanishad contains the dialogue between Nachiketa and Yama (Death)?',
        options: ['Isha Upanishad', 'Katha Upanishad', 'Mandukya Upanishad', 'Kena Upanishad'],
        correctIndex: 1,
        explanation: 'The Katha Upanishad narrates the story of young Nachiketa who visits Yama, the lord of death, to learn about the Self.',
      },
      {
        id: 'u3',
        question: 'What are the four states of consciousness described in the Mandukya Upanishad?',
        options: [
          'Waking, Dream, Deep Sleep, and Turiya (the fourth)',
          'Body, Mind, Intellect, and Soul',
          'Sattva, Rajas, Tamas, and Gunatita',
          'Birth, Life, Death, and Rebirth',
        ],
        correctIndex: 0,
        explanation: 'The Mandukya Upanishad analyzes OM (A-U-M) as corresponding to waking, dream, deep sleep, and Turiya (pure consciousness).',
      },
      {
        id: 'u4',
        question: 'What does "Aham Brahmasmi" mean?',
        options: [
          'I am the body',
          'I am Brahman — the infinite consciousness',
          'I am a servant of God',
          'I am the universe',
        ],
        correctIndex: 1,
        explanation: 'From the Brihadaranyaka Upanishad — a Mahavakya declaring the identity of the individual self with the ultimate reality.',
      },
      {
        id: 'u5',
        question: 'How many principal Upanishads are traditionally recognized?',
        options: ['4', '10', '13', '108'],
        correctIndex: 2,
        explanation: '13 principal Upanishads are traditionally recognized as the foundation of Vedanta philosophy, though 108 are known to exist.',
      },
      {
        id: 'u6',
        question: 'What is the meaning of "Neti Neti"?',
        options: [
          'This is the way',
          'Not this, not this — the Divine is beyond description',
          'Thus it is',
          'I am that',
        ],
        correctIndex: 1,
        explanation: 'From the Brihadaranyaka Upanishad — a method of negation (apavada) where Brahman is described by what It is NOT, as It transcends all concepts.',
      },
    ],
  },
  {
    id: 'dharma-ethics',
    title: 'Dharma and Ethics',
    titleSanskrit: 'धर्म और नीति',
    description: 'Test your understanding of Dharma as an ethical framework in Hindu philosophy.',
    category: 'Ethics',
    difficulty: 'intermediate',
    questions: [
      {
        id: 'd1',
        question: 'What are the four Purusharthas (aims of human life)?',
        options: [
          'Dharma, Artha, Kama, Moksha',
          'Yoga, Jnana, Bhakti, Karma',
          'Sattva, Rajas, Tamas, Gunatita',
          'Satya, Ahimsa, Tapas, Svadhyaya',
        ],
        correctIndex: 0,
        explanation: 'The four aims: Dharma (righteous duty), Artha (prosperity), Kama (desire/fulfillment), and Moksha (liberation).',
      },
      {
        id: 'd2',
        question: 'Who is considered the embodiment of Dharma in the Ramayana?',
        options: ['Ravana', 'Hanuman', 'Rama', 'Lakshmana'],
        correctIndex: 2,
        explanation: 'Lord Rama is called "Maryada Purushottam" — the ideal man who perfectly upheld Dharma in every situation, even at great personal cost.',
      },
      {
        id: 'd3',
        question: 'What is "Svadharma"?',
        options: [
          'Universal duty for all',
          'One\'s own personal duty based on nature and position',
          'Duty towards the guru',
          'Duty towards ancestors',
        ],
        correctIndex: 1,
        explanation: 'Svadharma is one\'s own righteous duty, determined by one\'s nature (svabhava) and stage of life. The Gita emphasizes following one\'s Svadharma over another\'s.',
      },
      {
        id: 'd4',
        question: 'What are the five Yamas (ethical restraints) in Patanjali\'s Yoga Sutras?',
        options: [
          'Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha',
          'Dharma, Artha, Kama, Moksha, Yoga',
          'Sattva, Rajas, Tamas, Tapas, Svadhyaya',
          'Asana, Pranayama, Pratyahara, Dharana, Dhyana',
        ],
        correctIndex: 0,
        explanation: 'The five Yamas: non-violence (Ahimsa), truthfulness (Satya), non-stealing (Asteya), continence (Brahmacharya), and non-possessiveness (Aparigraha).',
      },
      {
        id: 'd5',
        question: 'In the Gita, what does Krishna say about performing another\'s Dharma?',
        options: [
          'It is better than one\'s own',
          'It is dangerous — better to fail at one\'s own than succeed at another\'s',
          'It is required for liberation',
          'It is the highest form of service',
        ],
        correctIndex: 1,
        explanation: 'BG 3.35: "Śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt" — better to fail at one\'s own Dharma than succeed at another\'s.',
      },
    ],
  },
  {
    id: 'yoga-philosophy',
    title: 'Yoga Philosophy — Beyond Asanas',
    titleSanskrit: 'योग दर्शन — आसन से परे',
    description: 'Test your knowledge of the philosophical foundations of Yoga from Patanjali\'s Yoga Sutras.',
    category: 'Yoga',
    difficulty: 'advanced',
    questions: [
      {
        id: 'y1',
        question: 'What is Patanjali\'s definition of Yoga?',
        options: [
          'Union of body and mind',
          'Calming the fluctuations of the mind (Yogas chitta vritti nirodhah)',
          'Physical postures for health',
          'Breath control techniques',
        ],
        correctIndex: 1,
        explanation: 'Yoga Sutra 1.2: "Yogaś citta vṛtti nirodhaḥ" — Yoga is the cessation of the modifications of the mind.',
      },
      {
        id: 'y2',
        question: 'How many limbs (anga) are there in Ashtanga Yoga?',
        options: ['4', '6', '8', '12'],
        correctIndex: 2,
        explanation: 'Eight limbs: Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, and Samadhi.',
      },
      {
        id: 'y3',
        question: 'What are the three components of Kriya Yoga?',
        options: [
          'Tapas, Svadhyaya, Ishvara Pranidhana',
          'Asana, Pranayama, Pratyahara',
          'Yama, Niyama, Asana',
          'Dharana, Dhyana, Samadhi',
        ],
        correctIndex: 0,
        explanation: 'Kriya Yoga (Yoga Sutra 2.1) consists of Tapas (discipline/austerity), Svadhyaya (self-study), and Ishvara Pranidhana (surrender to the Divine).',
      },
      {
        id: 'y4',
        question: 'What is the state of "Samadhi"?',
        options: [
          'A physical posture for meditation',
          'Complete absorption where the meditator and object of meditation merge',
          'A breathing technique',
          'A type of ethical observance',
        ],
        correctIndex: 1,
        explanation: 'Samadhi is the eighth and final limb — a state of complete absorption where the distinction between meditator, meditation, and object dissolves.',
      },
      {
        id: 'y5',
        question: 'Which of these is NOT one of the nine obstacles (antarayas) to Yoga?',
        options: [
          'Vyadhi (illness)',
          'Styana (laziness)',
          'Samshaya (doubt)',
          'Moksha (liberation)',
        ],
        correctIndex: 3,
        explanation: 'Moksha is the goal of Yoga, not an obstacle. The nine obstacles are: illness, laziness, doubt, negligence, laziness, craving, erroneous perception, failure to achieve steadiness, and instability.',
      },
      {
        id: 'y6',
        question: 'What does "Ishvara Pranidhana" mean?',
        options: [
          'Self-study through scriptures',
          'Surrender to the Divine / Supreme Lord',
          'Physical purification',
          'Control of breath',
        ],
        correctIndex: 1,
        explanation: 'Ishvara Pranidhana is surrendering all actions to the Divine — a key practice in both Kriya Yoga and the Niyamas.',
      },
    ],
  },
];

export function getQuiz(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id);
}
