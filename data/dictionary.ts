export type TermCategory = 'cosmic' | 'self' | 'action' | 'liberation' | 'practice' | 'truth';

export interface DictionaryTerm {
  id: string;
  term: string;
  sanskrit: string;
  transliteration: string;
  category: TermCategory;
  shortDef: string;
  definition: string;
  etymology: string;
  keyTexts: string[];
  relatedTerms: string[];
  crossTradition: {
    tradition: string;
    view: string;
  }[];
  verses: {
    sanskrit: string;
    transliteration?: string;
    translation: string;
    reference: string;
  }[];
}

export const termCategories: { key: TermCategory; label: string; sanskrit: string; gradient: string }[] = [
  { key: 'cosmic', label: 'Cosmic Order', sanskrit: 'ऋत', gradient: 'from-indigo-500 to-blue-600' },
  { key: 'self', label: 'Self & Reality', sanskrit: 'आत्मन्', gradient: 'from-saffron-500 to-amber-600' },
  { key: 'action', label: 'Action & Consequence', sanskrit: 'कर्म', gradient: 'from-emerald-500 to-teal-600' },
  { key: 'liberation', label: 'Liberation', sanskrit: 'मोक्ष', gradient: 'from-violet-500 to-purple-600' },
  { key: 'practice', label: 'Practice & Discipline', sanskrit: 'तपस्', gradient: 'from-rose-500 to-pink-600' },
  { key: 'truth', label: 'Truth & Faith', sanskrit: 'सत्य', gradient: 'from-amber-500 to-orange-600' },
];

export const dictionary: DictionaryTerm[] = [
  {
    id: 'dharma',
    term: 'Dharma',
    sanskrit: 'धर्म',
    transliteration: 'dharma',
    category: 'cosmic',
    shortDef: 'The eternal law that upholds the universe — duty, righteousness, and the proper order of life.',
    definition: 'Dharma is one of the most fundamental and multi-layered concepts in Hindu philosophy. At its core, it refers to the cosmic law that upholds and sustains the universe. It encompasses duty, righteousness, moral law, justice, virtue, and the proper conduct appropriate to one\'s stage of life (ashrama) and social role (varna). Dharma is not a fixed code but a dynamic principle — what is dharma in one context may be adharma in another. It is the duty that falls to each person by virtue of their nature and circumstances. "Better to fail in one\'s own dharma than succeed in another\'s" (Gita 3.35). Dharma is the first of the four purusharthas (goals of life), the foundation upon which artha (prosperity), kama (desire), and moksha (liberation) rest.',
    etymology: 'From the Sanskrit root dhṛ (धृ), meaning "to hold, bear, support, maintain." Dharma is that which holds things together — the sustaining principle of the cosmos and society.',
    keyTexts: ['Bhagavad Gita', 'Manusmriti', 'Mahabharata', 'Ramayana', 'Dharma Shastras'],
    relatedTerms: ['rita', 'satya', 'karma', 'moksha'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Dharma is the moral and ritual order that prepares the mind for jnana (knowledge). Ultimately, the highest dharma is the realization of Brahman.' },
      { tradition: 'Bhakti traditions', view: 'The highest dharma is devotion (bhakti) to God. All other duties are secondary. "Abandon all dharmas and surrender to Me alone" (Gita 18.66).' },
      { tradition: 'Buddhism', view: 'Dharma (Dhamma) refers to the teachings of the Buddha and the universal law of nature. It is the second of the Three Jewels (Buddha, Dharma, Sangha).' },
      { tradition: 'Jainism', view: 'Dharma is one of the six substances (dravyas) — the principle of motion. Ethical dharma is centered on ahimsa (non-violence) and ascetic discipline.' },
    ],
    verses: [
      { sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत', transliteration: 'yadā yadā hi dharmasya glānirbhavati bhārata', translation: 'Whenever dharma declines and adharma rises, I manifest Myself.', reference: 'Bhagavad Gita 4.7' },
      { sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्', transliteration: 'śreyānsvadharmo viguṇaḥ paradharmātsvanuṣṭhitāt', translation: 'Better is one\'s own dharma though imperfectly performed than the dharma of another well performed.', reference: 'Bhagavad Gita 3.35' },
      { sanskrit: 'धर्मो रक्षति रक्षितः', transliteration: 'dharmo rakṣati rakṣitaḥ', translation: 'Dharma protects those who protect it.', reference: 'Manusmriti 8.15' },
    ],
  },
  {
    id: 'rta',
    term: 'Ṛta',
    sanskrit: 'ऋत',
    transliteration: 'ṛta',
    category: 'cosmic',
    shortDef: 'The Vedic concept of cosmic order — the universal principle that governs all of existence.',
    definition: 'Ṛta is the most ancient Indo-Aryan concept of cosmic order, predating and underlying the later concept of dharma. In the Rig Veda, ṛta is the universal principle that maintains the regularity of nature — the rising of the sun, the flowing of rivers, the changing of seasons, the movement of stars. It is the truth that holds the cosmos together. Ṛta is both a natural and moral law: it governs both the physical universe and the moral order. The gods themselves are born of ṛta and uphold it. Varuna is the primary guardian of ṛta. When humans act in accordance with ṛta, they maintain cosmic harmony; when they violate it, they create disorder (anṛta). Ṛta is the precursor to dharma — while dharma is more specific to human duty and social order, ṛta is the universal, pre-personal principle of order.',
    etymology: 'From the Proto-Indo-European root *h₂r̥tós, meaning "fitting, joined, ordered." Related to the Greek arariskein ("to fit") and the Latin artus ("joint"). Ṛta is that which is "properly joined" — the right order of things.',
    keyTexts: ['Rig Veda', 'Atharva Veda', 'Brahmanas', 'Upanishads'],
    relatedTerms: ['dharma', 'satya', 'karma'],
    crossTradition: [
      { tradition: 'Vedic tradition', view: 'Ṛta is the supreme cosmic principle — the order that sustains the universe. Varuna and Mitra are its primary guardians. Sacrifice (yajna) maintains ṛta.' },
      { tradition: 'Later Hinduism', view: 'Ṛta evolves into the concept of dharma — the moral and social order. The cosmic dimension of ṛta is absorbed into the concept of Brahman as the ground of all order.' },
      { tradition: 'Zoroastrianism', view: 'The cognate concept is Asha (Avestan: aša) — the divine order and truth. Asha Vahishta is the Best Truth, one of the Amesha Spentas.' },
    ],
    verses: [
      { sanskrit: 'ऋतस्य गर्भा इव द्यामारुहन्त', transliteration: 'ṛtasya garbhā iva dyāmāruhanta', translation: 'The gods are like embryos of ṛta, ascending to the heavens — born of and sustained by cosmic order.', reference: 'Rig Veda 10.190.3' },
      { sanskrit: 'ऋतेन ऋतमापिहितम्', transliteration: 'ṛtena ṛtamāpihitam', translation: 'By ṛta, the truth is hidden — the order of the cosmos conceals the deepest truth from ordinary perception.', reference: 'Rig Veda 7.54.1' },
      { sanskrit: 'वरुणस्य ऋतावर्यम्', transliteration: 'varuṇasya ṛtāvaryam', translation: 'Varuna\'s supreme ṛta — the cosmic order upheld by the great guardian of truth.', reference: 'Rig Veda 8.41.7' },
    ],
  },
  {
    id: 'satya',
    term: 'Satya',
    sanskrit: 'सत्य',
    transliteration: 'satya',
    category: 'truth',
    shortDef: 'Truth — that which is real, unchanging, and eternally existent. The correspondence between thought, word, and deed.',
    definition: 'Satya is truth in its deepest sense — not merely factual accuracy but ontological reality. It is derived from sat (सत्), meaning "being, existence, the real." Satya is that which IS, as opposed to asat (non-being, illusion). In the Upanishads, satya is identified with Brahman — the ultimate reality. The Mundaka Upanishad declares "Satyameva jayate" — "Truth alone triumphs." Satya also has an ethical dimension: it means truthfulness in thought, speech, and action — the alignment (ṛta) of word with fact and of deed with word. Gandhi\'s concept of satyagraha ("truth-force" or "soul-force") draws on this tradition. In the yoga tradition, satya is one of the five yamas (ethical restraints) — the practice of speaking and living truthfully.',
    etymology: 'From sat (सत्), the present participle of the root as (अस्), "to be." Satya means "that which is truly real" — the existent, the true, the real as opposed to the illusory.',
    keyTexts: ['Upanishads', 'Bhagavad Gita', 'Yoga Sutras', 'Ramayana', 'Manusmriti'],
    relatedTerms: ['rita', 'dharma', 'brahman'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Satya is Brahman alone — the only truly real (sat). The world is "neither real nor unreal" — empirically real but ultimately sublated. "Truth" means recognizing this.' },
      { tradition: 'Gandhian philosophy', view: 'Satya is the supreme principle — God is Truth, and Truth is God. Satyagraha is the method of resisting injustice through truth-force rather than violence.' },
      { tradition: 'Yoga tradition', view: 'Satya is the second of the five yamas (ethical restraints). It means truthfulness in thought, word, and deed — speaking only what is true and beneficial.' },
    ],
    verses: [
      { sanskrit: 'सत्यमेव जयते नानृतम्', transliteration: 'satyameva jayate nānṛtam', translation: 'Truth alone triumphs, not falsehood. Truth is the path of the divine.', reference: 'Mundaka Upanishad 3.1.6' },
      { sanskrit: 'सत्यं शिवं सुन्दरम्', transliteration: 'satyaṃ śivaṃ sundaram', translation: 'Truth, auspiciousness, beauty — the three attributes of the Real.', reference: 'Traditional invocation' },
      { sanskrit: 'सत्यं वद', transliteration: 'satyaṃ vada', translation: 'Speak the truth. (Satyam vada, dharmam cara — "Speak truth, practice dharma.")', reference: 'Taittiriya Upanishad 1.11.1' },
    ],
  },
  {
    id: 'atman',
    term: 'Ātman',
    sanskrit: 'आत्मन्',
    transliteration: 'ātman',
    category: 'self',
    shortDef: 'The true Self — the eternal, unchanging consciousness that is the innermost essence of all beings.',
    definition: 'Ātman is the true Self — the innermost essence of a being, distinct from the body, mind, intellect, and ego. It is pure consciousness (caitanya), eternal (nitya), unborn (aja), and immortal (amrita). The Upanishads declare that the Ātman is identical with Brahman — "Tat tvam asi" (Thou art That). This identity (abheda) is the central insight of Advaita Vedanta. The Ātman is not the empirical self (jivatman) that reincarnates, but the transcendental Self that is always already free. Realizing the Ātman — knowing "I am not the body, not the mind, not the ego, but pure awareness" — is the goal of spiritual practice. The Gita teaches that the Ātman cannot be cut, burned, wet, or dried (2.23) — it is indestructible.',
    etymology: 'From the root an (अन्), "to breathe," or at (अत्), "to move constantly." Ātman originally meant "breath" or "life-principle" in early Vedic texts, then evolved to mean the inner Self, the conscious principle.',
    keyTexts: ['Upanishads (Brihadaranyaka, Chandogya, Katha, Mandukya)', 'Bhagavad Gita', 'Brahma Sutras'],
    relatedTerms: ['brahman', 'jiva', 'moksha', 'samsara'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Ātman is identical with Brahman. "Tat tvam asi." The individual self (jiva) is Ātman appearing limited due to ignorance (avidya). Realization of this identity is moksha.' },
      { tradition: 'Vishishtadvaita (Ramanuja)', view: 'Ātman is real and distinct from Brahman, but inseparably related as attribute to substance. The Ātman is a mode (prakara) of Brahman, not identical.' },
      { tradition: 'Dvaita (Madhva)', view: 'Ātman and Brahman (God) are eternally distinct. The Ātman is dependent on God and can never become God. Liberation is eternal communion, not identity.' },
      { tradition: 'Buddhism', view: 'The doctrine of anatman (no-self) — there is no permanent, unchanging Self. What we call "self" is a temporary aggregate of five skandhas. This is a fundamental disagreement with Hindu thought.' },
    ],
    verses: [
      { sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः', transliteration: 'na jāyate mriyate vā kadācinnāyaṃ bhūtvā bhavitā vā na bhūyaḥ', translation: 'The Self is never born and never dies. Unborn, eternal, ever-existing, it is not destroyed when the body is destroyed.', reference: 'Bhagavad Gita 2.20' },
      { sanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः', transliteration: 'nainaṃ chindanti śastrāṇi nainaṃ dahati pāvakaḥ', translation: 'Weapons cannot cut the Self, fire cannot burn it, water cannot wet it, wind cannot dry it.', reference: 'Bhagavad Gita 2.23' },
      { sanskrit: 'तत्त्वमसि', transliteration: 'tat tvam asi', translation: 'That thou art — the Self within you is identical with the Supreme Reality.', reference: 'Chandogya Upanishad 6.8.7' },
      { sanskrit: 'आत्मनि एव आत्मनः तुष्टिः', transliteration: 'ātmani eva ātmanaḥ tuṣṭiḥ', translation: 'Satisfaction is to be found in the Self alone — the Self is the supreme delight.', reference: 'Brihadaranyaka Upanishad 4.4.12' },
    ],
  },
  {
    id: 'brahman',
    term: 'Brahman',
    sanskrit: 'ब्रह्मन्',
    transliteration: 'brahman',
    category: 'self',
    shortDef: 'The Absolute — the infinite, formless, eternal reality that is the ground and substance of all existence.',
    definition: 'Brahman is the Absolute Reality in Hindu philosophy — the infinite, eternal, formless, all-pervading ground of all existence. It is described as Sat-Chit-Ananda (Existence-Consciousness-Bliss). Brahman is not a personal God but the impersonal Absolute — though it can be worshipped through personal forms (saguna Brahman / Ishvara). "Sarvam khalvidam brahma" — "All this is verily Brahman" (Chandogya Upanishad). Brahman is beyond all attributes (nirguna) and descriptions — "neti neti" (not this, not this). Yet it is the source and substance of everything. The realization of Brahman is the highest goal of the Vedanta philosophy. In Advaita, the individual Self (Ātman) is identical with Brahman. In Vishishtadvaita, the world and souls are the body of Brahman. In Dvaita, Brahman (God) is eternally distinct from souls.',
    etymology: 'From the root brh (बृह्), "to grow, expand, be great." Brahman is "the expanding one" — that which is infinitely great, all-pervading. Originally referred to the sacred power of the Vedic mantra and the priest who wields it (brahmin), then evolved to mean the ultimate Reality.',
    keyTexts: ['Upanishads (all principal)', 'Bhagavad Gita', 'Brahma Sutras'],
    relatedTerms: ['atman', 'ishvara', 'maya', 'moksha', 'om'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Brahman is the only reality. The world is maya (appearance). "Brahma satyam jaganmithya" — Brahman is real, the world is appearance. The Self is Brahman.' },
      { tradition: 'Vishishtadvaita (Ramanuja)', view: 'Brahman is the supreme reality with attributes (saguna). The world and souls are real as the body of Brahman. Brahman is Narayana (Vishnu).' },
      { tradition: 'Dvaita (Madhva)', view: 'Brahman is the supreme God (Vishnu), eternally distinct from matter and souls. Brahman is personal and endowed with infinite auspicious attributes.' },
      { tradition: 'Achintya Bhedabheda (Chaitanya)', view: 'Brahman is Krishna — simultaneously one with and different from the world and souls. Inconceivable simultaneous oneness and difference.' },
    ],
    verses: [
      { sanskrit: 'सर्वं खल्विदं ब्रह्म', transliteration: 'sarvaṃ khalvidaṃ brahma', translation: 'All this is verily Brahman. Everything emerges from, is sustained by, and dissolves into Brahman.', reference: 'Chandogya Upanishad 3.14.1' },
      { sanskrit: 'सत्यं ज्ञानमनन्तं ब्रह्म', transliteration: 'satyaṃ jñānamanantaṃ brahma', translation: 'Brahman is Truth, Knowledge, and Infinite — this is the definition of the Absolute.', reference: 'Taittiriya Upanishad 2.1.1' },
      { sanskrit: 'नेति नेति', transliteration: 'neti neti', translation: 'Not this, not this — Brahman cannot be described by any positive attribute. It is beyond all conceptualization.', reference: 'Brihadaranyaka Upanishad 3.9.26' },
      { sanskrit: 'परमं ब्रह्म परमं धाम पवित्रं परमं भवान्', transliteration: 'paraṃ brahma paraṃ dhāma pavitraṃ paraṃ bhavān', translation: 'You are the Supreme Brahman, the supreme abode, the supreme purifier.', reference: 'Bhagavad Gita 10.12' },
    ],
  },
  {
    id: 'ishvara',
    term: 'Īśvara',
    sanskrit: 'ईश्वर',
    transliteration: 'īśvara',
    category: 'self',
    shortDef: 'The Lord — the personal, qualified aspect of the divine who governs the universe.',
    definition: 'Īśvara is the personal God in Hindu philosophy — Brahman with attributes (saguna Brahman). While Brahman is the impersonal Absolute beyond all description, Īśvara is the divine with form, qualities, and agency — the creator, preserver, and destroyer of the universe. In different traditions, Īśvara is identified as Vishnu, Shiva, Shakti, or other deities. In Patanjali\'s Yoga Sutras, Īśvara is a special purusha (consciousness), untouched by ignorance and karma, who serves as the object of meditation (īśvara-praṇidhāna). In Advaita Vedanta, Īśvara is Brahman associated with maya — the efficient and material cause of the universe. Upon liberation, the distinction between Ātman and Īśvara dissolves into pure Brahman.',
    etymology: 'From the root īś (ईश्), "to own, possess, rule, control." Īśvara means "the Lord, the ruler, the master" — the one who possesses and governs all.',
    keyTexts: ['Bhagavad Gita', 'Yoga Sutras', 'Brahma Sutras', 'Shiva Sutras'],
    relatedTerms: ['brahman', 'atman', 'maya', 'bhakti', 'avatar'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Īśvara is saguna Brahman — Brahman associated with maya. He is the creator, preserver, and destroyer. Upon jnana, Īśvara is recognized as a projection of maya on Brahman.' },
      { tradition: 'Yoga Sutras (Patanjali)', view: 'Īśvara is a special purusha, eternally free, untouched by karma and ignorance. Surrender to Īśvara (īśvara-praṇidhāna) is one of the paths to samadhi.' },
      { tradition: 'Vaishnavism', view: 'Īśvara is Vishnu/Narayana/Krishna — the supreme personal God. He is not merely saguna Brahman but the highest reality, eternally personal.' },
      { tradition: 'Shaivism', view: 'Īśvara is Shiva — the supreme Lord (Maheshvara). In Kashmir Shaivism, Shiva is the only reality, and Īśvara is one of his tattvas (levels of manifestation).' },
    ],
    verses: [
      { sanskrit: 'योगिनामपि सर्वेषां मद्गतेनान्तरात्मना', transliteration: 'yogināmapi sarveṣāṃ madgatenāntarātmanā', translation: 'Of all yogis, the one who worships Me with faith, absorbed in Me — is considered the greatest.', reference: 'Bhagavad Gita 6.47' },
      { sanskrit: 'क्लेशकर्मविपाकाशयैरपरामृष्टः पुरुषविशेष ईश्वरः', transliteration: 'kleśakarmavipākāśayairaparāmṛṣṭaḥ puruṣaviśeṣa īśvaraḥ', translation: 'Īśvara is a special purusha, untouched by the residues of affliction, action, and their fruits.', reference: 'Yoga Sutras 1.24' },
      { sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज', transliteration: 'sarvadharmānparityajya māmekaṃ śaraṇaṃ vraja', translation: 'Abandon all dharmas and surrender to Me alone — I shall liberate you from all sins.', reference: 'Bhagavad Gita 18.66' },
    ],
  },
  {
    id: 'jiva',
    term: 'Jīva',
    sanskrit: 'जीव',
    transliteration: 'jīva',
    category: 'self',
    shortDef: 'The individual soul — the conscious entity that transmigrates through bodies until liberation.',
    definition: 'Jīva is the individual soul — the conscious entity that experiences the world, accumulates karma, and transmigrates from body to body across lifetimes. In Advaita Vedanta, the jīva is Ātman appearing limited due to ignorance (avidya) and the conditioning of the mind-body complex. The jīva is bound by karma and samsara until it realizes its true nature as Brahman. In Dvaita, the jīva is eternally distinct from God and can never become God — liberation is eternal communion. The jīva is characterized by consciousness (caitanya), agency (kartṛtva), and enjoyment (bhoktṛtva). It is subtler than the body and mind, and survives death to take on a new body according to its karma.',
    etymology: 'From the root jīv (जीव्), "to live, be alive." Jīva means "the living one" — that which has life, the animating principle of a being.',
    keyTexts: ['Bhagavad Gita', 'Upanishads', 'Brahma Sutras', 'Bhagavata Purana'],
    relatedTerms: ['atman', 'karma', 'samsara', 'moksha', 'ishvara'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'The jīva is Ātman plus limiting adjuncts (upadhis). In reality, there is only one Ātman appearing as many jīvas. Upon jnana, the jīva dissolves into Brahman.' },
      { tradition: 'Dvaita (Madhva)', view: 'Each jīva is eternally distinct and unique. There is a hierarchy among jīvas. Liberation is eternal bliss in communion with God, never identity.' },
      { tradition: 'Vishishtadvaita (Ramanuja)', view: 'The jīva is a real, eternal mode (prakara) of Brahman. It retains individuality even in liberation, eternally serving God.' },
      { tradition: 'Buddhism', view: 'There is no permanent jīva (anatman). What we call "soul" is a stream of consciousness (vijnana-santana) that continues but is not a fixed entity.' },
    ],
    verses: [
      { sanskrit: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि', transliteration: 'vāsāṃsi jīrṇāni yathā vihāya navāni gṛhṇāti naro\'parāṇi', translation: 'As a person casts off worn-out garments and puts on new ones, so the jīva casts off worn-out bodies and enters new ones.', reference: 'Bhagavad Gita 2.22' },
      { sanskrit: 'ममैवांशो जीवलोके जीवभूतः सनातनः', transliteration: 'mamaivāṃśo jīvaloke jīvabhūtaḥ sanātanaḥ', translation: 'The eternal jīva in this world is an eternal fragment of Myself.', reference: 'Bhagavad Gita 15.7' },
    ],
  },
  {
    id: 'karma',
    term: 'Karma',
    sanskrit: 'कर्म',
    transliteration: 'karma',
    category: 'action',
    shortDef: 'The universal law of cause and effect — every action creates consequences that shape future experience.',
    definition: 'Karma is the universal law of moral causation — every action (physical, verbal, or mental) creates consequences that shape future experience. Karma is not fate or determinism but a natural law, like gravity: actions produce results. There are three types: sanchita (accumulated karma from all past lives), prarabdha (the portion currently being experienced in this life), and agami (karma being created now). Karma binds the soul to samsara — but karma performed without attachment to results (nishkama karma) becomes a path to liberation. The Gita teaches: "You have a right to action alone, never to its fruits" (2.47). Karma is the mechanism that connects the jīva across lifetimes — the moral law that ensures justice in the cosmic order.',
    etymology: 'From the root kṛ (कृ), "to do, make, perform." Karma means "action, deed, work" — any physical, verbal, or mental activity.',
    keyTexts: ['Bhagavad Gita', 'Upanishads', 'Yoga Sutras', 'Mimamsa Sutras'],
    relatedTerms: ['dharma', 'samsara', 'moksha', 'vasana'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Karma operates within the realm of maya. It can purify the mind (karma yoga) but cannot directly produce liberation — only jnana can. Karma is beginningless but ends with jnana.' },
      { tradition: 'Mimamsa', view: 'Karma (ritual action) is the primary means of achieving heaven and spiritual merit. The performance of Vedic rituals (yajna) automatically produces results — the ritual is inherently efficacious.' },
      { tradition: 'Buddhism', view: 'Karma is intention (cetana). The law of karma operates without a permanent self — it is the stream of cause and effect that continues across lives. Liberation (nirvana) is the cessation of karma.' },
      { tradition: 'Jainism', view: 'Karma is a subtle form of matter (dravya) that sticks to the soul (jiva) due to actions. Liberation requires complete cessation of karma through asceticism and non-violence (ahimsa).' },
    ],
    verses: [
      { sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन', transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana', translation: 'You have a right to perform your prescribed duties, but never to the fruits of action.', reference: 'Bhagavad Gita 2.47' },
      { sanskrit: 'कर्मणो ह्यपि बोद्धव्यं बोद्धव्यं च विकर्मणः', transliteration: 'karmaṇo hyapi boddhavyaṃ boddhavyaṃ ca vikarmaṇaḥ', translation: 'The nature of action is difficult to understand. One must discern what action is, what wrong action is, and what inaction is.', reference: 'Bhagavad Gita 4.17' },
      { sanskrit: 'गुणा गुणेषु वर्तन्त इति मत्वा न सज्जते', transliteration: 'guṇā guṇeṣu vartanta iti matvā na sajjate', translation: 'The gunas act on the gunas — knowing this, one does not become attached. This is the key to karma yoga.', reference: 'Bhagavad Gita 3.28' },
    ],
  },
  {
    id: 'samsara',
    term: 'Saṃsāra',
    sanskrit: 'संसार',
    transliteration: 'saṃsāra',
    category: 'action',
    shortDef: 'The endless cycle of birth, death, and rebirth — driven by karma and desire.',
    definition: 'Saṃsāra is the cycle of birth, death, and rebirth — the endless wheel of existence that all beings traverse. It is driven by karma (actions) and vasana (desires): unfulfilled desires at death cause the soul to take a new body, and new actions create new karma, perpetuating the cycle. Saṃsāra encompasses all realms of existence — from the lowest hells to the highest heavens, from insects to gods. No position within saṃsāra is permanent — even the gods eventually die and are reborn. The goal of all Hindu spiritual practice is moksha — liberation from saṃsāra. The Bhagavata Purana describes saṃsāra as a banyan tree with roots above and branches below — the upside-down tree of illusion that must be cut with the axe of detachment.',
    etymology: 'From the prefix sam (सम्), "together, completely," and the root sṛ (सृ), "to flow, wander, pass." Saṃsāra means "wandering through, flowing along" — the continuous passage of the soul through successive bodies.',
    keyTexts: ['Bhagavad Gita', 'Upanishads', 'Bhagavata Purana', 'Sutta Pitaka (Buddhist)'],
    relatedTerms: ['karma', 'moksha', 'atman', 'jiva', 'vasana'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Saṃsāra is ultimately illusory — it is caused by ignorance (avidya) and sustained by desire. Upon jnana, saṃsāra is recognized to have never truly existed. "There is no bondage, no liberation."' },
      { tradition: 'Bhakti traditions', view: 'Saṃsāra is the ocean of suffering (bhava-sagara) that can only be crossed by devotion to God. God\'s grace lifts the devotee out of the cycle.' },
      { tradition: 'Buddhism', view: 'Saṃsāra is beginningless and characterized by dukkha (suffering). Liberation (nirvana) is the cessation of craving and the end of the cycle. Saṃsāra and nirvana are not two different places but two different states of seeing.' },
    ],
    verses: [
      { sanskrit: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि', transliteration: 'vāsāṃsi jīrṇāni yathā vihāya navāni gṛhṇāti naro\'parāṇi', translation: 'As a person casts off worn-out garments and puts on new ones, so the embodied soul casts off worn-out bodies and enters new ones.', reference: 'Bhagavad Gita 2.22' },
      { sanskrit: 'यं यं वापि स्मरन्भावं त्यजत्यन्ते कलेवरम्', transliteration: 'yaṃ yaṃ vāpi smaranbhāvaṃ tyajatyante kalevaram', translation: 'Whatever state of being one remembers when leaving the body, that state one attains — this is always true.', reference: 'Bhagavad Gita 8.6' },
      { sanskrit: 'ऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम्', transliteration: 'ūrdhvamūlamadhaḥśākhamśvatthaṃ prāhuravyayam', translation: 'The saṃsāra is like an eternal banyan tree with roots above and branches below — the upside-down tree of illusion.', reference: 'Bhagavad Gita 15.1' },
    ],
  },
  {
    id: 'moksha',
    term: 'Mokṣa',
    sanskrit: 'मोक्ष',
    transliteration: 'mokṣa',
    category: 'liberation',
    shortDef: 'Liberation from the cycle of saṃsāra — the supreme goal of human life.',
    definition: 'Mokṣa is liberation — freedom from the cycle of birth, death, and rebirth (saṃsāra). It is the fourth and highest of the purusharthas (goals of life), beyond dharma, artha, and kama. Mokṣa is not a place to go to but a state of being — the recognition of one\'s true nature. In Advaita Vedanta, mokṣa is the direct realization "I am Brahman" — the dissolution of ignorance (avidya) that created the illusion of bondage. In Vishishtadvaita, mokṣa is eternal communion with God in Vaikuntha. In Dvaita, it is eternal bliss in the presence of God while remaining distinct. In bhakti traditions, mokṣa is less important than pure love (prema) — the devotee seeks not liberation but eternal service. Mokṣa is achieved through jnana (knowledge), bhakti (devotion), karma yoga (selfless action), or a combination.',
    etymology: 'From the root muc (मुच्), "to free, release, liberate." Mokṣa means "release, liberation, freedom" — the freeing of the soul from bondage.',
    keyTexts: ['Upanishads', 'Bhagavad Gita', 'Brahma Sutras', 'Yoga Sutras'],
    relatedTerms: ['atman', 'brahman', 'samsara', 'karma', 'jnana', 'bhakti'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Mokṣa is jnana — the direct realization "I am Brahman." Bondage was never real; it was caused by ignorance. Liberation is not an event but the recognition of what was always true.' },
      { tradition: 'Vishishtadvaita (Ramanuja)', view: 'Mokṣa is eternal communion with God (Narayana) in Vaikuntha. The soul retains individuality and eternally serves God. Achieved through bhakti and prapatti (surrender).' },
      { tradition: 'Dvaita (Madhva)', view: 'Mokṣa is eternal bliss in the presence of God. Souls remain eternally distinct. There is a hierarchy of bliss based on the soul\'s innate capacity.' },
      { tradition: 'Bhakti traditions (Gaudiya)', view: 'Mokṣa is not the highest goal — pure devotional love (prema bhakti) is higher. The devotee rejects mokṣa in favor of eternal loving service to Krishna.' },
      { tradition: 'Buddhism', view: 'The equivalent is nirvana — the cessation of craving and the end of suffering. It is not union with a supreme Self (which Buddhism denies) but the extinguishing of the fires of greed, hatred, and delusion.' },
    ],
    verses: [
      { sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज', transliteration: 'sarvadharmānparityajya māmekaṃ śaraṇaṃ vraja', translation: 'Abandon all dharmas and surrender to Me alone. I shall liberate you from all sins — do not fear.', reference: 'Bhagavad Gita 18.66' },
      { sanskrit: 'ब्रह्मविद् ब्रह्मैव भवति', transliteration: 'brahmavid brahmaiva bhavati', translation: 'The knower of Brahman becomes Brahman itself — this is the state of liberation.', reference: 'Mundaka Upanishad 3.2.9' },
      { sanskrit: 'विद्या चाविद्या च यस्तद्वेदोभयं सह', transliteration: 'vidyā cāvidyā ca yastadvedobhayaṃ saha', translation: 'He who knows both knowledge and ignorance together — crosses death through ignorance and attains immortality through knowledge.', reference: 'Isha Upanishad 11' },
    ],
  },
  {
    id: 'shraddha',
    term: 'Śraddhā',
    sanskrit: 'श्रद्धा',
    transliteration: 'śraddhā',
    category: 'truth',
    shortDef: 'Faith — the deep, trusting conviction in the truth of the scriptures and the spiritual path.',
    definition: 'Śraddhā is faith — not blind belief but a deep, trusting conviction in the truth of the scriptures, the guru, and the spiritual path. It is the foundation of all spiritual practice. The Gita says: "The faithful one attains knowledge" (4.39). Śraddhā is the willingness to engage with the teaching with an open heart and mind, trusting that it will bear fruit. It is not intellectual assent but a wholehearted commitment. Without śraddhā, no practice can succeed. Śraddhā also refers to the funeral rites performed for ancestors (śrāddha), reflecting faith in the continuity of the soul and the efficacy of ritual. In the Katha Upanishad, Nachiketa\'s śraddhā enables him to receive the highest teaching from Yama. Śraddhā is the seed from which jnana grows.',
    etymology: 'From śrat (श्रत्), "truth, faith" (cognate with the English "heart" and Latin "credere"), and dhā (धा), "to place, put." Śraddhā means "placing one\'s heart in" — setting the heart upon truth.',
    keyTexts: ['Bhagavad Gita', 'Upanishads (Katha, Brihadaranyaka)', 'Yoga Sutras'],
    relatedTerms: ['satya', 'bhakti', 'jnana', 'dharma'],
    crossTradition: [
      { tradition: 'Advaita Vedanta', view: 'Śraddhā is the preliminary trust that leads one to seek the Self. It matures into jnana — direct realization. Without śraddhā, the Upanishadic teaching cannot take root.' },
      { tradition: 'Bhakti traditions', view: 'Śraddhā is the seed of bhakti. It grows into prema (pure love). Faith in God\'s name, form, and grace is the beginning of the devotional path.' },
      { tradition: 'Buddhism', view: 'Śraddhā (saddha) is the first of the five spiritual faculties (indriyas): faith, energy, mindfulness, concentration, wisdom. It is trust in the Buddha, Dharma, and Sangha.' },
    ],
    verses: [
      { sanskrit: 'श्रद्धावाँल्लभते ज्ञानं तत्परः संयतेन्द्रियः', transliteration: 'śraddhāvāllabhate jñānaṃ tatparaḥ saṃyatendriyaḥ', translation: 'The faithful, the devoted, the sense-controlled — such a person attains knowledge, and having attained it, quickly finds supreme peace.', reference: 'Bhagavad Gita 4.39' },
      { sanskrit: 'यो यच्छ्रद्धः स एव सः', transliteration: 'yo yacchraddhaḥ sa eva saḥ', translation: 'A person is what their faith is — faith shapes character, character shapes destiny.', reference: 'Bhagavad Gita 17.3' },
      { sanskrit: 'श्रद्धया दीयते अन्नम्', transliteration: 'śraddhayā dīyate annam', translation: 'Food is given with faith — all offerings are made fruitful by śraddhā.', reference: 'Bhagavad Gita 17.20' },
    ],
  },
  {
    id: 'tapas',
    term: 'Tapas',
    sanskrit: 'तपस्',
    transliteration: 'tapas',
    category: 'practice',
    shortDef: 'Spiritual discipline and austerity — the focused heat of practice that purifies and transforms.',
    definition: 'Tapas is spiritual discipline, austerity, and intense practice. The word literally means "heat" — the inner fire of discipline that burns away impurities and transforms the practitioner. Tapas encompasses physical austerities (fasting, standing on one leg, etc.), mental discipline (meditation, silence), and speech discipline (truthfulness, recitation). The Gita classifies tapas into three types: physical (body), verbal (speech), and mental (mind) — and further by the three gunas: sattvic (performed with faith and without desire), rajasic (performed for status or recognition), and tamasic (performed with self-torture or to harm others). Tapas is one of the five niyamas (observances) in Patanjali\'s Yoga Sutras. The highest tapas is not self-torture but the steady, joyful discipline of spiritual practice.',
    etymology: 'From the root tap (तप्), "to heat, burn, shine, suffer." Tapas is "heat" — the inner fire of discipline. The same root gives English "tepid" and "topaz."',
    keyTexts: ['Bhagavad Gita (Chapter 17)', 'Yoga Sutras', 'Upanishads', 'Ramayana'],
    relatedTerms: ['vairagya', 'dharma', 'yoga', 'shradha'],
    crossTradition: [
      { tradition: 'Yoga tradition (Patanjali)', view: 'Tapas is the second niyama — disciplined practice that purifies the body and mind, building heat (tejas) that burns away impurities.' },
      { tradition: 'Bhagavad Gita', view: 'Tapas should be sattvic — performed with faith, without desire for results, and with balance. Extreme austerities that harm the body are tamasic.' },
      { tradition: 'Buddhism', view: 'The Buddha rejected extreme tapas (self-torture) after experiencing it himself. He taught the Middle Way (madhyama pratipada) — discipline without extremes.' },
      { tradition: 'Jainism', view: 'Tapas is the primary means of liberation. Extreme austerities (including sallekhana — fasting to death) are valued as the highest expression of detachment.' },
    ],
    verses: [
      { sanskrit: 'शरीरं तपसि दीयते', transliteration: 'śarīraṃ tapasi dīyate', translation: 'The body is offered in austerity — physical tapas includes purity, straightforwardness, celibacy, and non-violence.', reference: 'Bhagavad Gita 17.14' },
      { sanskrit: 'तपः स्वाध्यायेश्वरप्रणिधानानि क्रियायोगः', transliteration: 'tapaḥ svādhyāyeśvarapraṇidhānāni kriyāyogaḥ', translation: 'Tapas, self-study, and surrender to God — this is the yoga of action.', reference: 'Yoga Sutras 2.1' },
      { sanskrit: 'कायेन मनसा बुद्ध्या तपसा च विनिर्जितः', transliteration: 'kāyena manasā buddhyā tapasā ca vinirjitaḥ', translation: 'Having conquered the body, mind, and intellect through tapas — the yogi attains purity.', reference: 'Bhagavad Gita 18.53' },
    ],
  },
  {
    id: 'vairagya',
    term: 'Vairāgya',
    sanskrit: 'वैराग्य',
    transliteration: 'vairāgya',
    category: 'practice',
    shortDef: 'Dispassion — the state of freedom from attachment and desire for worldly objects.',
    definition: 'Vairāgya is dispassion — the state of non-attachment to worldly pleasures and objects. It is not aversion or hatred of the world but a natural cooling of desire that comes from understanding the impermanence of all things. The Gita describes vairāgya as the ability to remain undisturbed by desire (raga) and aversion (dvesha) — to view pleasure and pain, gain and loss, victory and defeat with equanimity. In Patanjali\'s Yoga Sutras, vairāgya is defined as the state of mastery in which there is no thirst for any object, seen or heard. It is paired with abhyāsa (practice) as the two wings of meditation. True vairāgya is not forced renunciation but the spontaneous letting go that arises when one tastes something higher. The highest vairāgya (paravairāgya) is the desireless state that leads to samadhi.',
    etymology: 'From vi (वि), "apart, away," and rāga (राग), "passion, attachment, color." Vairāgya means "the absence of raga" — becoming colorless, free from the dye of attachment. One who has vairāgya is not "colored" by any experience.',
    keyTexts: ['Yoga Sutras', 'Bhagavad Gita', 'Upanishads', 'Vivekachudamani'],
    relatedTerms: ['tapas', 'moksha', 'karma', 'vasana', 'dhyana'],
    crossTradition: [
      { tradition: 'Yoga tradition (Patanjali)', view: 'Vairāgya is the conscious mastery of craving. It has four levels (vashikara) — control over objects, senses, life-states, and subliminal tendencies. It is one of the two means of restraining the mind (along with abhyāsa).' },
      { tradition: 'Advaita Vedanta', view: 'Vairāgya is one of the four qualifications (sadhana chatushtaya) for jnana. Without dispassion, the mind cannot turn inward to inquire into the Self.' },
      { tradition: 'Bhakti traditions', view: 'Vairāgya in bhakti means detachment from everything except God. It is not world-rejection but redirecting all attachment toward Krishna. Rupa Goswami defines it as "not rejecting anything but using everything in God\'s service."' },
    ],
    verses: [
      { sanskrit: 'दृष्टानुश्रविकविषयवितृष्णस्य वशीकारसञ्ज्ञा वैराग्यम्', transliteration: 'dṛṣṭānuśravikaviṣayavitṛṣṇasya vaśīkārasaṃjñā vairāgyam', translation: 'Vairāgya is the state of consciousness in which there is no thirst for any object, seen or unseen — the mastery of craving.', reference: 'Yoga Sutras 1.15' },
      { sanskrit: 'अभ्यासवैराग्याभ्यां निरोधः', transliteration: 'abhyāsavairāgyābhyāṃ nirodhaḥ', translation: 'The mind is restrained through practice (abhyāsa) and dispassion (vairāgya).', reference: 'Yoga Sutras 1.12' },
      { sanskrit: 'विसया विनिवर्तन्ते निराहारस्य देहिनः', transliteration: 'visayā vinivartante nirāhārasya dehinaḥ', translation: 'The senses withdraw from objects in one who abstains — but the taste remains. Even the taste ceases for one who has realized the Supreme.', reference: 'Bhagavad Gita 2.59' },
    ],
  },
];

export function getTerm(id: string): DictionaryTerm | undefined {
  return dictionary.find((t) => t.id === id);
}

export function getTermsByCategory(category: TermCategory): DictionaryTerm[] {
  return dictionary.filter((t) => t.category === category);
}
