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
        "The 12-mantra Upanishad on AUM and the four states of consciousness. Gaudapada's Karika expanded these 12 mantras into one of the foundational texts of non-dualism.",
      verses: [
        {
          id: 1,
          sanskrit:
            'ॐ इत्येतदक्षरमिदं सर्वं तस्योपव्याख्यानं भूतं भवद्भविष्यदिति सर्वमोङ्कार एव | यच्चान्यत्त्रिकालातीतं तदप्योङ्कार एव ||',
          transliteration:
            'oṃ ityetadakṣaramidaṃ sarvaṃ tasyopavyākhyānaṃ bhūtaṃ bhavadbhaviṣyaditi sarvamoṅkāra eva | yaccānyattrikālātītaṃ tadapyoṅkāra eva ||',
          translation:
            'The syllable AUM is all this. Its further explanation is: what has been, what is, and what will be — all is AUM. And what is beyond the three times — that too is AUM.',
          hindi:
            'ॐ — यह अक्षर ही सब कुछ है। इसकी व्याख्या यह है: जो हो चुका है, जो है, और जो होगा — सब ॐ ही है। और जो त्रिकाल से परे है, वह भी ॐ ही है।',
          explanation:
            'The Upanishad opens with the radical thesis that all of existence — past, present, future, and even what transcends time — is AUM. AUM is not just a sound; it is the substrate of reality.',
          science:
            "Information theory and physics increasingly point to a single underlying substrate (the quantum vacuum, the holographic principle). The Upanishad's claim that all reality reduces to a single primordial sound mirrors the modern intuition that all physical phenomena reduce to vibration patterns in fundamental fields.",
          lifeLesson:
            'Chant AUM with the awareness that you are sounding the substrate of the universe. The practice is not symbolic — it is a tuning of your nervous system to a frequency that includes everything.',
          keywords: ['AUM', 'Substrate', 'Time', 'Sound'],
        },
        {
          id: 2,
          sanskrit: 'सर्वं ह्येतद् ब्रह्मायमात्मा ब्रह्म सोऽयमात्मा चतुष्पात् ||',
          transliteration: "sarvaṃ hyetad brahmāyamātmā brahma so'yamātmā catuṣpāt ||",
          translation:
            'All this is verily Brahman. This Self is Brahman. This Self has four quarters (states).',
          hindi:
            'यह सब वास्तव में ब्रह्म ही है। यह आत्मा ब्रह्म है। यह आत्मा चार पाद (अवस्थाओं) वाला है।',
          explanation:
            'The mahāvākya "ayam ātmā brahma" — "this Self is Brahman." The Upanishad then enumerates the four states (pādas): waking, dream, deep sleep, and turīya (the fourth).',
          science:
            "Neuroscience confirms the existence of four distinct states of consciousness, each with measurably different EEG signatures: beta-dominant waking, REM-dominant dreaming, delta-dominant deep sleep. The fourth state (turīya) corresponds to long-term meditation states (gamma coherence, default-mode-network deactivation) that integrate awareness across the other three.",
          lifeLesson:
            'Notice that you are present in all four states — even in deep sleep, "you" emerge from it. That continuity-of-witness is what the Upanishad calls turīya. Meditation is the gradual recognition of this fourth state.',
          keywords: ['Mahavakya', 'Atman', 'Brahman', 'FourStates'],
        },
        {
          id: 3,
          sanskrit:
            'जागरितस्थानो बहिष्प्रज्ञः सप्ताङ्ग एकोनविंशतिमुखः स्थूलभुग्वैश्वानरः प्रथमः पादः ||',
          transliteration:
            'jāgaritasthāno bahiṣprajñaḥ saptāṅga ekonaviṃśatimukhaḥ sthūlabhugvaiśvānaraḥ prathamaḥ pādaḥ ||',
          translation:
            'The first quarter is Vaiśvānara — the waking state, outward-knowing, with seven limbs and nineteen mouths, enjoyer of gross objects.',
          hindi:
            'पहला पाद वैश्वानर है — जागृत अवस्था, बाह्य-ज्ञान वाला, सात अंगों और उन्नीस मुखों वाला, स्थूल भोगों का भोक्ता।',
          explanation:
            'The waking state (jāgrat) is named Vaiśvānara — "common to all men." Its seven limbs are the cosmic body (heaven, sun, air, space, water, earth, sacrificial fire). Its nineteen mouths are the five senses of knowledge, five of action, five prāṇas, mind, intellect, ego, and citta. It feeds on gross objects.',
          science:
            "Modern cognitive science identifies precisely these nineteen 'channels' of waking awareness: five exteroceptive senses, five motor outputs, five autonomic-nervous-system modes (roughly the prāṇas), and four cognitive faculties (perception, reasoning, self-modeling, memory). Waking is computation across all nineteen.",
          lifeLesson:
            'When you are awake, you are consuming the world — through every sense and every action. Notice that "you" in waking is constituted by what you take in. Curate your inputs: what you see, hear, eat, and do becomes the substance of your waking self.',
          keywords: ['Vaishvanara', 'Waking', 'Gross', 'Senses'],
        },
        {
          id: 4,
          sanskrit:
            "स्वप्नस्थानोऽन्तःप्रज्ञः सप्ताङ्ग एकोनविंशतिमुखः प्रविविक्तभुक्तैजसो द्वितीयः पादः ||",
          transliteration:
            "svapnasthāno'ntaḥprajñaḥ saptāṅga ekonaviṃśatimukhaḥ pravivikta-bhuktaijaso dvitīyaḥ pādaḥ ||",
          translation:
            'The second quarter is Taijasa — the dream state, inward-knowing, with seven limbs and nineteen mouths, enjoyer of the subtle.',
          hindi:
            'दूसरा पाद तैजस है — स्वप्न अवस्था, अन्तर-ज्ञान वाला, सात अंगों और उन्नीस मुखों वाला, सूक्ष्म (मनोनिर्मित) भोगों का भोक्ता।',
          explanation:
            'The dream state (svapna) is named Taijasa — "made of light." Here the mind itself illuminates its own objects without external input. The same nineteen faculties operate, but on internally-generated content rather than external stimuli.',
          science:
            "REM-sleep neuroscience confirms this with precision: during dreams the visual cortex, motor cortex, and emotional centers all activate as in waking, but external sensory input is gated off (sensory thalamus is offline). The brain runs the same nineteen 'channels' on its own stored imagery — exactly the Upanishad's 'inner-knower of the subtle.'",
          lifeLesson:
            "Your dream-self is built from yesterday's residues. What you brood on by day becomes the architecture of your night. Tend to your waking inputs as if they were seeds — because in dream they germinate.",
          keywords: ['Taijasa', 'Dream', 'Subtle', 'Mind'],
        },
        {
          id: 5,
          sanskrit:
            'यत्र सुप्तो न कञ्चन कामं कामयते न कञ्चन स्वप्नं पश्यति तत् सुषुप्तम् | सुषुप्तस्थान एकीभूतः प्रज्ञानघन एवानन्दमयो ह्यानन्दभुक् चेतोमुखः प्राज्ञस्तृतीयः पादः ||',
          transliteration:
            'yatra supto na kañcana kāmaṃ kāmayate na kañcana svapnaṃ paśyati tat suṣuptam | suṣuptasthāna ekībhūtaḥ prajñānaghana evānandamayo hyānandabhuk cetomukhaḥ prājñastṛtīyaḥ pādaḥ ||',
          translation:
            'Where one asleep desires no desire and sees no dream — that is deep sleep. The third quarter is Prājña — unified, a mass of consciousness, full of bliss, enjoyer of bliss, with awareness as its mouth.',
          hindi:
            'जहाँ सोया हुआ व्यक्ति किसी कामना की कामना नहीं करता और कोई स्वप्न नहीं देखता — वह सुषुप्ति है। तीसरा पाद प्राज्ञ है — एकीभूत, प्रज्ञानघन, आनन्दमय, आनन्द का भोक्ता, चेतना ही जिसका मुख है।',
          explanation:
            'Deep sleep (suṣupti) is named Prājña — "the knower." There is no division between subject and object, no desire, no dream-imagery. The nineteen faculties dissolve into a single undifferentiated awareness. The Upanishad calls this state "ānandamaya" — full of bliss — because the absence of all conflict is bliss.',
          science:
            'Slow-wave (delta) sleep is measurably the most restorative state: growth hormone peaks, neural debris is flushed by the glymphatic system, the default mode network falls silent. Subjects awakened from deep sleep consistently report "nothing" — yet feel refreshed. The Upanishad anticipates this: the absence of objects is not nothingness but undivided awareness.',
          lifeLesson:
            'You touch bliss every night without doing anything — in dreamless sleep, all your problems vanish, and you wake restored. That bliss is your own nature, not the absence of life. Meditation is learning to abide there while awake.',
          keywords: ['Prajna', 'DeepSleep', 'Bliss', 'Unity'],
        },
        {
          id: 6,
          sanskrit:
            "एष सर्वेश्वर एष सर्वज्ञ एषोऽन्तर्याम्येष योनिः सर्वस्य प्रभवाप्ययौ हि भूतानाम् ||",
          transliteration:
            "eṣa sarveśvara eṣa sarvajña eṣo'ntaryāmyeṣa yoniḥ sarvasya prabhavāpyayau hi bhūtānām ||",
          translation:
            'This (Prājña) is the Lord of all, the all-knowing, the inner controller, the source of all — the origin and end of all beings.',
          hindi:
            'यह (प्राज्ञ) सब का ईश्वर है, सर्वज्ञ है, अन्तर्यामी है, सबका मूल है — सभी प्राणियों की उत्पत्ति और प्रलय का स्थान है।',
          explanation:
            'Prājña — the consciousness of deep sleep — is identified with Īśvara, the cosmic Lord. The same undifferentiated awareness in which the individual dissolves each night is the womb from which all beings emerge and to which they return.',
          science:
            'In information-theoretic terms: a system with no internal differentiation has maximum potential — like a field of pure energy not yet structured into matter. Cosmologists describe the pre-Big-Bang singularity in nearly identical terms: undivided, all-pervading, the source of all subsequent forms. The Upanishad locates this cosmic source inside your nightly experience.',
          lifeLesson:
            "Every night you visit the source of the universe. Sleep is sacred — not waste, but communion. Honor it. The same ground from which galaxies emerge is the ground you return to in dreamless rest.",
          keywords: ['Ishvara', 'Source', 'InnerController', 'Origin'],
        },
        {
          id: 7,
          sanskrit:
            'नान्तःप्रज्ञं न बहिष्प्रज्ञं नोभयतःप्रज्ञं न प्रज्ञानघनं न प्रज्ञं नाप्रज्ञम् | अदृष्टमव्यवहार्यमग्राह्यमलक्षणमचिन्त्यमव्यपदेश्यमेकात्मप्रत्ययसारं प्रपञ्चोपशमं शान्तं शिवमद्वैतं चतुर्थं मन्यन्ते स आत्मा स विज्ञेयः ||',
          transliteration:
            "nāntaḥprajñaṃ na bahiṣprajñaṃ nobhayataḥprajñaṃ na prajñānaghanaṃ na prajñaṃ nāprajñam | adṛṣṭamavyavahāryamagrāhyamalakṣaṇamacintyamavyapadeśyamekātmapratyayasāraṃ prapañcopaśamaṃ śāntaṃ śivamadvaitaṃ caturthaṃ manyante sa ātmā sa vijñeyaḥ ||",
          translation:
            'Not inward-conscious, not outward-conscious, not both, not a mass of consciousness, not conscious, not unconscious — unseen, beyond action, ungraspable, indefinable, unthinkable, unnameable, the essence of the conviction of the one Self, the cessation of all phenomena, peaceful, blessed, non-dual — this they consider the fourth. That is the Self. That is to be known.',
          hindi:
            'न अन्तर-ज्ञान, न बाह्य-ज्ञान, न दोनों, न ज्ञानघन, न ज्ञान, न अज्ञान — अदृश्य, अव्यवहार्य, अग्राह्य, अलक्षण, अचिन्त्य, अव्यपदेश्य; एक आत्मा के बोध का सार, प्रपञ्च की उपशान्ति, शान्त, शिव, अद्वैत — यही चतुर्थ है। वही आत्मा है। उसी को जानना है।',
          explanation:
            'The famous "seven negations" describing turīya. The fourth state cannot be characterized — every positive description would limit it. The Upanishad uses pure negation: it is none of these, and yet it is the essence of the conviction "I am."',
          science:
            "Apophatic theology and modern phenomenology both arrive at the same conclusion: the deepest layer of consciousness cannot be objectified. Thomas Metzinger's 'phenomenal self-model' theory similarly proposes a layer of pure awareness that resists every objective description.",
          lifeLesson:
            'Stop trying to describe your deepest Self. Every adjective you reach for ("I am calm," "I am awake," "I am present") is already one level removed. Just be — and notice that beneath all qualities, something noticeable remains.',
          keywords: ['Turiya', 'Negation', 'Advaita', 'Self'],
        },
        {
          id: 8,
          sanskrit:
            "सोऽयमात्माध्यक्षरमोङ्कारोऽधिमात्रं पादा मात्रा मात्राश्च पादा अकार उकारो मकार इति ||",
          transliteration:
            "so'yamātmādhyakṣaramoṅkāro'dhimātraṃ pādā mātrā mātrāśca pādā akāra ukāro makāra iti ||",
          translation:
            'This same Self, considered as the syllable AUM, is the letter; considered as letters, the parts (mātrās) are the quarters, and the quarters are the parts — namely A, U, and M.',
          hindi:
            'यही आत्मा अक्षर ॐ है। मात्राओं की दृष्टि से इसकी मात्राएँ ही (आत्मा के) पाद हैं और पाद ही मात्राएँ हैं — अकार, उकार, मकार।',
          explanation:
            'The bridge verse: the four states (catuṣpāt) are now mapped onto the four mātrās of AUM. The Self has four quarters in experience and four parts in sound — A, U, M, and the silence beyond.',
          science:
            'Cymatics — the study of sound-induced patterns in matter — shows that distinct phonemes produce distinct geometric patterns. A, U, and M each generate measurably different resonant signatures in the human vocal tract (a opens, u rounds, m closes). The Upanishad uses this physical structure as a map of inner experience.',
          lifeLesson:
            'AUM is not chanted with the mouth alone — it is chanted with the whole self. Let each part move through you: A in the chest, U in the throat, M in the head, silence in the heart. The whole sound is a microcosm of the whole psyche.',
          keywords: ['AUM', 'Matras', 'Mapping', 'Sound'],
        },
        {
          id: 9,
          sanskrit:
            'जागरितस्थानो वैश्वानरोऽकारः प्रथमा मात्राऽऽप्तेरादिमत्त्वाद्वाऽऽप्नोति ह वै सर्वान् कामानादिश्च भवति य एवं वेद ||',
          transliteration:
            "jāgaritasthāno vaiśvānaro'kāraḥ prathamā mātrā''pterādimattvādvā''pnoti ha vai sarvān kāmānādiśca bhavati ya evaṃ veda ||",
          translation:
            'Vaiśvānara, the waking state, is the letter A, the first mātrā — because of pervasion (āpti) and being first (ādimattva). He who knows this verily attains all desires and becomes first (foremost).',
          hindi:
            'जागृत अवस्था का वैश्वानर "अ" है — प्रथम मात्रा। यह "आप्ति" (व्यापन) और "आदिमत्त्व" (प्रथमता) से जुड़ी है। जो इसे ऐसा जानता है, वह सभी कामनाओं को प्राप्त करता है और प्रथम (अग्रणी) बनता है।',
          explanation:
            'A is the first sound — the open vowel that pervades all speech (every consonant takes A implicitly). It corresponds to waking, which is the first and most pervasive state of human experience. The fruit of this contemplation: leadership and fulfilment of desires.',
          science:
            'Phonetically, A is the most universal vowel — present in virtually every human language as the default vowel. The mouth in its rest position produces "a." Linguists call it the "schwa basin." This makes A the natural symbol for waking awareness: the default, ever-present state from which all other states are modulations.',
          lifeLesson:
            'Master your waking state first. Do not rush past it toward "higher" states. Excellence in daily life — clarity, presence, integrity — is the foundation. He who is master of the waking is by that very fact a leader of those still half-asleep.',
          keywords: ['A', 'Vaishvanara', 'Pervasion', 'Leadership'],
        },
        {
          id: 10,
          sanskrit:
            'स्वप्नस्थानस्तैजस उकारो द्वितीया मात्रोत्कर्षादुभयत्वाद्वोत्कर्षति ह वै ज्ञानसन्ततिं समानश्च भवति नास्याब्रह्मवित्कुले भवति य एवं वेद ||',
          transliteration:
            "svapnasthānastaijasa ukāro dvitīyā mātrotkarṣādubhayatvādvotkarṣati ha vai jñānasantatiṃ samānaśca bhavati nāsyābrahmavitkule bhavati ya evaṃ veda ||",
          translation:
            'Taijasa, the dream state, is the letter U, the second mātrā — because of exaltation (utkarṣa) and being between (ubhayatva, of both A and M). He who knows this exalts the continuity of knowledge and is equal-minded; none in his lineage will be ignorant of Brahman.',
          hindi:
            'स्वप्न अवस्था का तैजस "उ" है — द्वितीय मात्रा। यह "उत्कर्ष" (उन्नति) और "उभयत्व" (दो के बीच होने) से जुड़ी है। जो इसे ऐसा जानता है, वह ज्ञान-सन्तति को बढ़ाता है, समान-बुद्धि होता है, और उसके कुल में कोई अब्रह्मवित् नहीं होता।',
          explanation:
            'U is articulated by raising the tongue from A toward M — it is between, and it elevates. Dream is between waking (gross) and deep sleep (causal). The fruit: a refined and rising stream of knowledge, equanimity, and a lineage of seekers.',
          science:
            'Dream is now understood as the brain\'s "between state" — consolidating waking experience into long-term memory, building bridges between disparate ideas. REM sleep measurably enhances creative problem-solving and abstract pattern recognition. The Upanishad\'s metaphor of "exaltation" and "between-ness" is empirically accurate.',
          lifeLesson:
            'Honor your dreams — not as omens but as the mind\'s integration work. Pay attention to recurring images; they are signals from the layer between waking and depths. A practice of dream-journaling for thirty days will visibly raise the clarity of your waking thought.',
          keywords: ['U', 'Taijasa', 'Exaltation', 'Integration'],
        },
        {
          id: 11,
          sanskrit:
            'सुषुप्तस्थानः प्राज्ञो मकारस्तृतीया मात्रा मितेरपीतेर्वा मिनोति ह वा इदं सर्वमपीतिश्च भवति य एवं वेद ||',
          transliteration:
            'suṣuptasthānaḥ prājño makārastṛtīyā mātrā miterapītervā minoti ha vā idaṃ sarvamapītiśca bhavati ya evaṃ veda ||',
          translation:
            'Prājña, the deep-sleep state, is the letter M, the third mātrā — because of measuring (miti) and absorption (apīti). He who knows this measures (comprehends) all this and becomes its absorption.',
          hindi:
            'सुषुप्ति का प्राज्ञ "म्" है — तृतीय मात्रा। यह "मिति" (मापन) और "अपीति" (विलय) से जुड़ी है। जो इसे ऐसा जानता है, वह इस सबको मापता (समझता) है और सबका विलय-स्थान बन जाता है।',
          explanation:
            'M closes the mouth — the sound dissolves into the body, into silence. It is the final phoneme of AUM, just as deep sleep is the final phase of nightly experience. The contemplative who knows M comprehends the totality and becomes the place where all returns.',
          science:
            'Phonetically, M is a nasal that resonates through the entire skull cavity (the "nāda" vibration). EEG studies of long chanters show M-resonance increases parasympathetic activation and produces measurable delta-wave coherence — the same EEG signature as deep sleep. M is literally the sound of suṣupti.',
          lifeLesson:
            'Practice ending things well. The close of a sentence, a conversation, a day, a project — closure is where wisdom integrates. The contemplative who learns to dissolve gracefully becomes the still point others come to rest in.',
          keywords: ['M', 'Prajna', 'Dissolution', 'Closure'],
        },
        {
          id: 12,
          sanskrit:
            "अमात्रश्चतुर्थोऽव्यवहार्यः प्रपञ्चोपशमः शिवोऽद्वैत एवमोङ्कार आत्मैव संविशत्यात्मनाऽऽत्मानं य एवं वेद ||",
          transliteration:
            "amātraścaturtho'vyavahāryaḥ prapañcopaśamaḥ śivo'dvaita evamoṅkāra ātmaiva saṃviśatyātmanā''tmānaṃ ya evaṃ veda ||",
          translation:
            'The fourth is without measure (amātra) — beyond action, the cessation of phenomena, blessed, non-dual. Thus AUM is verily the Self. He who knows this enters the Self with the Self.',
          hindi:
            'चतुर्थ अमात्र (मात्रा-रहित) है — अव्यवहार्य, प्रपञ्च की उपशान्ति, शिव, अद्वैत। ऐसा ॐ ही आत्मा है। जो इसे ऐसा जानता है, वह आत्मा द्वारा आत्मा में प्रवेश करता है।',
          explanation:
            'The closing mantra. The four mātrās of AUM (A, U, M, and silence) correspond to the four states. The silence after the M is the fourth — pure, unmeasured awareness. To chant AUM with this knowledge is to enter the Self with the Self.',
          science:
            "When you chant AUM and let the M-resonance fade into silence, MRI studies show distinctive deactivation of the default mode network — the brain's 'self-narrative' system. The post-chant silence is where the brain stops generating 'I'-thoughts and rests in pure perception. This is the neurological signature of turīya.",
          lifeLesson:
            "When you chant AUM, the silence after is where the practice actually happens. Sit in that silence. Let it lengthen. The Upanishad's entire teaching is encoded in the pause after the sound.",
          keywords: ['AUM', 'Turiya', 'Silence', 'Self'],
        },
      ],
    },
  ],
};
