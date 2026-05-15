import { Scripture } from '../types';

export const mandukya: Scripture = {
  id: 'mandukya',
  title: 'Mandukya Upanishad',
  titleSanskrit: 'माण्डूक्योपनिषद्',
  category: 'upanishad',
  description:
    "The shortest of the principal Upanishads — just 12 mantras. The heart of Advaita Vedanta. Expounds the four states of consciousness (jāgrat, svapna, suṣupti, turīya) and identifies the Self with the syllable AUM.",
  totalVerses: 12,
  tags: ['Upanishad', 'Advaita', 'AUM', 'Consciousness', 'Turiya'],
  chapters: [
    {
      id: 1,
      title: 'Mandukya Upanishad',
      titleSanskrit: 'माण्डूक्योपनिषद्',
      summary:
        'The 12-mantra Upanishad on AUM and the four states of consciousness. Gaudapada\'s Karika expanded these 12 mantras into one of the foundational texts of non-dualism.',
      verses: [
        {
          id: 1,
          sanskrit: 'ॐ इत्येतदक्षरमिदं सर्वं तस्योपव्याख्यानं भूतं भवद्भविष्यदिति सर्वमोङ्कार एव | यच्चान्यत्त्रिकालातीतं तदप्योङ्कार एव ||',
          transliteration: 'oṃ ityetadakṣaramidaṃ sarvaṃ tasyopavyākhyānaṃ bhūtaṃ bhavadbhaviṣyaditi sarvamoṅkāra eva | yaccānyattrikālātītaṃ tadapyoṅkāra eva ||',
          translation:
            'The syllable AUM is all this. Its further explanation is: what has been, what is, and what will be — all is AUM. And what is beyond the three times — that too is AUM.',
          hindi:
            'ॐ — यह अक्षर ही सब कुछ है। इसकी व्याख्या यह है: जो हो चुका है, जो है, और जो होगा — सब ॐ ही है। और जो त्रिकाल से परे है, वह भी ॐ ही है।',
          explanation:
            'The Upanishad opens with the radical thesis that all of existence — past, present, future, and even what transcends time — is AUM. AUM is not just a sound; it is the substrate of reality.',
          science:
            'Information theory and physics increasingly point to a single underlying substrate (the quantum vacuum, the holographic principle). The Upanishad\'s claim that all reality reduces to a single primordial sound mirrors the modern intuition that all physical phenomena reduce to vibration patterns in fundamental fields.',
          lifeLesson:
            'Chant AUM with the awareness that you are sounding the substrate of the universe. The practice is not symbolic — it is a tuning of your nervous system to a frequency that includes everything.',
          keywords: ['AUM', 'Substrate', 'Time', 'Sound'],
        },
        {
          id: 2,
          sanskrit: 'सर्वं ह्येतद् ब्रह्मायमात्मा ब्रह्म सोऽयमात्मा चतुष्पात् ||',
          transliteration: 'sarvaṃ hyetad brahmāyamātmā brahma so\'yamātmā catuṣpāt ||',
          translation:
            'All this is verily Brahman. This Self is Brahman. This Self has four quarters (states).',
          hindi:
            'यह सब वास्तव में ब्रह्म ही है। यह आत्मा ब्रह्म है। यह आत्मा चार पाद (अवस्थाओं) वाला है।',
          explanation:
            'The mahāvākya "ayam ātmā brahma" — "this Self is Brahman." The Upanishad then enumerates the four states (pādas): waking, dream, deep sleep, and turīya (the fourth).',
          science:
            'Neuroscience confirms the existence of four distinct states of consciousness, each with measurably different EEG signatures: beta-dominant waking, REM-dominant dreaming, delta-dominant deep sleep. The fourth state (turīya) corresponds to long-term meditation states (gamma coherence, default-mode-network deactivation) that integrate awareness across the other three.',
          lifeLesson:
            'Notice that you are present in all four states — even in deep sleep, "you" emerge from it. That continuity-of-witness is what the Upanishad calls turīya. Meditation is the gradual recognition of this fourth state.',
          keywords: ['Mahavakya', 'Atman', 'Brahman', 'FourStates'],
        },
        {
          id: 7,
          sanskrit:
            'नान्तःप्रज्ञं न बहिष्प्रज्ञं नोभयतःप्रज्ञं न प्रज्ञानघनं न प्रज्ञं नाप्रज्ञम् | अदृष्टमव्यवहार्यमग्राह्यमलक्षणमचिन्त्यमव्यपदेश्यमेकात्मप्रत्ययसारं प्रपञ्चोपशमं शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः ||',
          transliteration:
            'nāntaḥprajñaṃ na bahiṣprajñaṃ nobhayataḥprajñaṃ na prajñānaghanaṃ na prajñaṃ nāprajñam | adṛṣṭamavyavahāryamagrāhyamalakṣaṇamacintyamavyapadeśyamekātmapratyayasāraṃ prapañcopaśamaṃ śāntaṃ śivamadvaitaṃ caturthaṃ manyante sa ātmā sa vijñeyaḥ ||',
          translation:
            'Not inward-conscious, not outward-conscious, not both, not a mass of consciousness, not conscious, not unconscious — unseen, beyond action, ungraspable, indefinable, unthinkable, unnameable, the essence of the conviction of the one Self, the cessation of all phenomena, peaceful, blessed, non-dual — this they consider the fourth. That is the Self. That is to be known.',
          hindi:
            'न अन्तर-ज्ञान, न बाह्य-ज्ञान, न दोनों, न ज्ञानघन, न ज्ञान, न अज्ञान — अदृश्य, अव्यवहार्य, अग्राह्य, अलक्षण, अचिन्त्य, अव्यपदेश्य; एक आत्मा के बोध का सार, प्रपञ्च की उपशान्ति, शान्त, शिव, अद्वैत — यही चतुर्थ है। वही आत्मा है। उसी को जानना है।',
          explanation:
            'The famous "seven negations" describing turīya. The fourth state cannot be characterized — every positive description would limit it. The Upanishad uses pure negation: it is none of these, and yet it is the essence of the conviction "I am."',
          science:
            'Apophatic theology and modern phenomenology both arrive at the same conclusion: the deepest layer of consciousness cannot be objectified. Thomas Metzinger\'s "phenomenal self-model" theory similarly proposes a layer of pure awareness that resists every objective description.',
          lifeLesson:
            'Stop trying to describe your deepest Self. Every adjective you reach for ("I am calm," "I am awake," "I am present") is already one level removed. Just be — and notice that beneath all qualities, something noticeable remains.',
          keywords: ['Turiya', 'Negation', 'Advaita', 'Self'],
        },
        {
          id: 12,
          sanskrit:
            'अमात्रश्चतुर्थोऽव्यवहार्यः प्रपञ्चोपशमः शिवोऽद्वैत एवमोङ्कार आत्मैव संविशत्यात्मनाऽऽत्मानं य एवं वेद ||',
          transliteration:
            'amātraścaturtho\'vyavahāryaḥ prapañcopaśamaḥ śivo\'dvaita evamoṅkāra ātmaiva saṃviśatyātmanā\'\'tmānaṃ ya evaṃ veda ||',
          translation:
            'The fourth is without measure (amātra) — beyond action, the cessation of phenomena, blessed, non-dual. Thus AUM is verily the Self. He who knows this enters the Self with the Self.',
          hindi:
            'चतुर्थ अमात्र (मात्रा-रहित) है — अव्यवहार्य, प्रपञ्च की उपशान्ति, शिव, अद्वैत। ऐसा ॐ ही आत्मा है। जो इसे ऐसा जानता है, वह आत्मा द्वारा आत्मा में प्रवेश करता है।',
          explanation:
            'The closing mantra. The four mātrās of AUM (A, U, M, and silence) correspond to the four states. The silence after the M is the fourth — pure, unmeasured awareness. To chant AUM with this knowledge is to enter the Self with the Self.',
          science:
            'When you chant AUM and let the M-resonance fade into silence, MRI studies show distinctive deactivation of the default mode network — the brain\'s "self-narrative" system. The post-chant silence is where the brain stops generating "I"-thoughts and rests in pure perception. This is the neurological signature of turīya.',
          lifeLesson:
            'When you chant AUM, the silence after is where the practice actually happens. Sit in that silence. Let it lengthen. The Upanishad\'s entire teaching is encoded in the pause after the sound.',
          keywords: ['AUM', 'Turiya', 'Silence', 'Self'],
        },
      ],
    },
  ],
};
