import { Scripture } from '../types';

export const yogavasishtha: Scripture = {
  id: 'yogavasishtha',
  title: 'Yoga Vasishtha',
  titleSanskrit: 'योगवासिष्ठ',
  titleIast: 'Yoga Vāsiṣṭha',
  category: 'other',
  description:
    'The Yoga Vasistha Maharamayana (~32,000 verses, 6 Prakaranas) — the most philosophically sophisticated non-dual text in Sanskrit. Sage Vasistha instructs the despondent young Prince Rama through vivid stories and dialogues, teaching that the world is consciousness projecting itself, and that jivan-mukti (liberation while living) is attainable through self-enquiry (vichara) and the dissolution of vasanas.',
  totalVerses: 32000,
  isCurated: true,
  canonicalTotalVerses: 32000,
  tags: [
    'Advaita',
    'NonDual',
    'Consciousness',
    'JnanaYoga',
    'Vasistha',
    'Vasishtha',
    'Rama',
    'JivanMukti',
    'Vasana',
    'SelfEnquiry',
    'Brahman',
    'Vairagya',
    'Viveka',
    'Mumukshutva',
    'Maya',
    'YogaVasistha',
  ],
  chapters: [
    {
      id: 1,
      title: 'Vairagya Prakarana — The Arising of Dispassion',
      titleSanskrit: 'वैराग्यप्रकरण',
      summary:
        'Rama returns from a pilgrimage and falls into profound existential despair — the clear-eyed recognition that nothing in the phenomenal world can provide lasting fulfilment. Sage Vishwamitra and Vasishtha recognize that this existential crisis is the necessary precondition for wisdom and non-dual realization.',
      verses: [
        {
          id: 1,
          number: 1,
          sanskrit: 'जगज्जालं मनोजालं मनः संसारकारणम् | तन्मनः शोधयाम्यद्य बोधेन परमात्मनः ||',
          transliteration: 'jagajjālaṃ manojālaṃ manaḥ saṃsārakāraṇam | tanmanaḥ śodhayāmyadya bodhena paramātmanaḥ ||',
          translation: 'The web of the world is the web of the mind — the mind is the cause of samsara. That mind I purify today through the knowledge of the supreme Self.',
          hindi: 'जगत् का जाल मन का जाल है — मन ही संसार का कारण है। उस मन को मैं आज परमात्मा के बोध से शुद्ध करता हूँ।',
          explanation:
            '"Jagajjālaṃ manojālaṃ" — the web of the world is the web of the mind. The world-as-experienced is identical to the mind\'s own projections. The web catches because we take it for something external and independent. "Manaḥ saṃsārakāraṇam" — the mind, by its habitual structures of desire and aversion, creates the experience of bondage. Solution: "bodhena paramātmanaḥ" — not repression of the mind but its illumination through knowledge of the Self.',
          science:
            'Predictive processing (Karl Friston): the brain constructs perceptual experience by matching sensory signals against prior predictions. What we experience as "the world" is ~90% the brain\'s own predictive model. "Jagajjālaṃ manojālaṃ" is the phenomenological statement of what predictive processing describes neurologically: we live primarily inside our own mental models.',
          lifeLesson:
            'The next time you feel trapped by a circumstance — a pattern that keeps repeating — ask the Yoga Vasistha\'s question: is this circumstance the problem, or is this my mind\'s habitual relationship to circumstances? The web of the world is the web of the mind. When the mind-web is seen for what it is, the catching stops.',
          keywords: ['MindAsWorld', 'SamsaraCause', 'PredictiveProcessing', 'Vairagya'],
        },
        {
          id: 2,
          number: 2,
          sanskrit: 'चिद्भित्तौ चित्रमिव ब्रह्मात्मनोर्भेदः स्फुरत्यदः | भेदाभेदावुभौ नास्तः सत्तास्फूर्तिः पुनः पुनः ||',
          transliteration: 'cidbhittau citramiva brahmātmanorbhedaḥ sphuratyādaḥ | bhedābhedāvubhau nāstaḥ sattāsphūrtiḥ punaḥ punaḥ ||',
          translation:
            'Like a picture on a wall of consciousness, the apparent difference between Brahman and the individual Self shines forth. But neither difference nor non-difference truly exists — only pure Being-Consciousness shines again and again.',
          hindi: 'जैसे दीवार पर चित्र बना होता है, वैसे ही चेतना की भित्ति पर ब्रह्म और आत्मा का भेद प्रकट होता है। परंतु न तो भेद सत्य है, न अभेद — केवल सत्-चित् बार-बार स्फुरित होती रहती है।',
          explanation:
            'The Yoga Vasishtha teaches through metaphor. Consciousness is the wall; the apparent duality between Brahman (universal Self) and Atman (individual self) is like a picture painted on that wall — it appears real but has no substance of its own. The picture does not exist apart from the wall; the individual self does not exist apart from universal consciousness.',
          science:
            'Holographic principle in physics: the entire information content of a 3D volume can be encoded on its 2D boundary surface. The "picture on the wall" metaphor anticipated this idea — the three-dimensional world of experience is a projection on the 2D "screen" of consciousness. Physicist Lee Smolin and others have argued that reality may be fundamentally informational rather than material — precisely the insight of Yoga Vasishtha.',
          lifeLesson:
            'Your sense of being a separate individual "me" — with its anxieties, its desires, its story — is like a picture on a wall. It is appearing within consciousness, not outside it. When you touch the deepest part of yourself, you touch the wall itself, not just the picture. This is not a technique; it is the recognition that liberates.',
          keywords: ['Consciousness', 'NonDuality', 'HolographicReality'],
        },
      ],
    },
    {
      id: 2,
      title: "Mumukshu Vyavahara — The Seeker's Conduct & Four Qualifications",
      titleSanskrit: 'मुमुक्षुव्यवहारप्रकरण',
      summary:
        'Vasishtha outlines the inner qualifications (Sadhana-chatushtaya) and the four great gatekeepers of liberation — Shama (self-control), Vichara (self-inquiry), Santosha (contentment), and Sadhu-sanga (noble company). Befriending even one opens the gateway to freedom.',
      verses: [
        {
          id: 1,
          number: 1,
          sanskrit: 'विवेकः प्रथमं साधनं वैराग्यं द्वितीयं स्मृतम् | षट्सम्पत्तिस्तृतीयं च मुमुक्षुत्वं चतुर्थकम् ||',
          transliteration: 'vivekaḥ prathamaṃ sādhanaṃ vairāgyaṃ dvitīyaṃ smṛtam | ṣaṭsampattiḥ tṛtīyaṃ ca mumukṣutvaṃ caturtham ||',
          translation: 'Viveka is the first qualification; Vairagya the second; Shatsampatti the third; Mumukshutva the fourth.',
          hindi: 'विवेक पहला साधन; वैराग्य दूसरा; षट्सम्पत्ति तीसरी; और मुमुक्षुत्व चौथा।',
          explanation:
            'Viveka: capacity to distinguish the permanent from impermanent — consciousness alone is constant. Vairagya: withdrawal of the conviction that worldly objects provide permanent satisfaction. Shatsampati: six disciplines (shama, dama, uparati, titiksha, shraddha, samadhana) that bring the mind to stable, alert quietness. Mumukshutva: genuine burning desire for freedom — not luxury but necessity. Without this desire, the teaching produces only intellectual entertainment.',
          science:
            'Metacognition and readiness for learning (Flavell; Dweck on growth mindset): the capacity to benefit from a teaching depends not on intelligence but on these same prerequisites — discrimination (viveka), freedom from competing motivations (vairagya), emotional regulation (shatsampati), and genuine motivation (mumukshutva). Students with genuine desire to understand learn dramatically more than those merely going through motions.',
          lifeLesson:
            'Self-assessment: (1) Can you consistently distinguish permanently satisfying from merely promising? (2) Do you still believe getting a specific external thing will permanently resolve dissatisfaction? (3) Is your mind calm enough to hear something subtle? (4) Do you genuinely want to be free — not just comfortable, but free? Honesty about where you are is itself the beginning of viveka.',
          keywords: ['FourfoldQualification', 'Viveka', 'Vairagya', 'Mumukshutva', 'SadhanaChatus'],
        },
        {
          id: 2,
          number: 2,
          sanskrit: 'शमो विचारः सन्तोषश्चतुर्थः साधुसङ्गमः | एते मोक्षस्य द्वारे च द्वारपालाश्चतुर्विधाः ||',
          transliteration: 'śamo vicāraḥ santoṣaścaturthaḥ sādhu-saṅgamaḥ | ete mokṣasya dvāre ca dvārapālāścaturvidhāḥ ||',
          translation: 'Shama (self-control), Vichara (self-inquiry), Santosha (contentment), and Sadhu-sanga (good company) — these four are the gatekeepers of liberation.',
          hindi: 'शम (मन का निग्रह), विचार (आत्म-विचार), संतोष और साधु-संग — ये चार मोक्ष के द्वार के चार द्वारपाल हैं।',
          explanation:
            'One of the most practical frameworks in all Indian wisdom literature. You do not need to master all four simultaneously — befriending even one opens the door. Shama (calm mind) allows inquiry. Vichara (inquiry into "who am I?") leads to contentment. Contentment makes one seek authentic company. And good company deepens shama. They are mutually reinforcing.',
          science:
            'These four map onto the pillars of psychological wellbeing: Shama = emotion regulation (prefrontal cortex development); Vichara = self-reflective capacity (meta-cognition); Santosha = hedonic adaptation and positive baseline (research: gratitude practices elevate set-point); Sadhu-sanga = social connection (Holt-Lunstad: isolation is as deadly as smoking 15 cigarettes/day). All four are empirically validated wellbeing practices.',
          lifeLesson:
            'Of these four gatekeepers, which one do you have most access to right now? Start there. Even one conscious practice — daily stillness (shama), genuine self-questioning (vichara), a gratitude practice (santosha), or seeking one authentic mentor or community (satsang) — can begin the opening. You do not need all four to start. One is enough.',
          keywords: ['Shama', 'Vichara', 'FourGatekeepers'],
        },
      ],
    },
    {
      id: 3,
      title: 'Utpatti Prakarana — Consciousness Projecting the World',
      titleSanskrit: 'उत्पत्तिप्रकरण',
      summary:
        'The cosmos is not created by an external God shaping physical matter from outside — it is pure consciousness projecting upon itself. Vasishtha demonstrates this through parables including Queen Leela and the crow-and-palm fallacy (Kakataliiya Nyaya).',
      verses: [
        {
          id: 1,
          number: 1,
          sanskrit: 'सर्गादौ सर्गमध्ये च सर्गान्ते च महामते | चिन्मात्रमेव विद्यते नान्यत्किञ्चिदपि स्थितम् ||',
          transliteration: 'sargādau sargamadhye ca sargānte ca mahāmate | cinmātrameva vidyate nānyatkiñcidapi sthitam ||',
          translation: 'At the beginning, middle, and end of creation, O great-minded one — consciousness alone exists. Nothing else whatsoever stands.',
          hindi: 'हे महामते! सृष्टि के आदि, मध्य और अंत में — चिन्मात्र ही विद्यमान है। इससे अलग कुछ भी स्थित नहीं।',
          explanation:
            '"Cinmātrameva vidyate" — consciousness alone exists, without remainder, at every stage of cosmic time. This removes the possibility of a pre-conscious primordial matter from which consciousness later emerges — the standard materialist story. The Yoga Vasistha reverses this: consciousness is primary; matter, time, and space are its appearances. "Nānyatkiñcidapi sthitam" — nothing else whatsoever stands.',
          science:
            'The measurement problem and quantum idealism (von Neumann; Wigner): in quantum mechanics, the measurement chain cannot be stopped at any physical level — it must terminate in a consciousness. Von Neumann\'s mathematics showed that physics presupposes consciousness rather than producing it. "Cinmātrameva vidyate" is the philosophical statement of what the measurement problem forces as a mathematical conclusion.',
          lifeLesson:
            'Notice right now: you are aware of this text, the sounds in the room, your body\'s sensations, background thoughts. Each object is different. But the awareness in which they all appear is the same awareness. That single awareness — your most direct and constant experience — is what the Yoga Vasistha calls Brahman. You do not need to attain it. Rest as that awareness for sixty seconds without chasing any of its contents.',
          keywords: ['CinmatraAlone', 'ConsciousnessFirst', 'QuantumMeasurement', 'NonDualVision'],
        },
        {
          id: 2,
          number: 2,
          sanskrit: 'यथा काकतालीयन्यायेन शाखापातफलद्वयम् | आकस्मिकमपि भूतं हि बुद्धिमन्नायतेऽन्यथा ||',
          transliteration: 'yathā kākatālīyanyāyena śākhāpātaphala-dvayam | ākasmikamapi bhūtaṃ hi buddhimānnāyate\'nyathā ||',
          translation: 'Just as by the "crow-and-palm" logic — when a crow lands on a palm tree and the fruit falls simultaneously — the intelligent person does not conclude that one caused the other.',
          hindi: 'जैसे काकतालीय न्याय में — जब कौआ बैठता है और उसी समय ताड़ का फल गिरता है — बुद्धिमान व्यक्ति यह नहीं मानता कि एक दूसरे का कारण था।',
          explanation:
            'The Yoga Vasishtha introduces the Kakataliiya Nyaya (crow-and-palm fallacy) — the logical error of assuming that temporal coincidence implies causation. Events happen in the universe; the mind constructs causal stories about them. Most of our suffering comes from incorrect causal attributions: "This happened BECAUSE of that person, that choice, that circumstance."',
          science:
            'Post hoc ergo propter hoc fallacy — "after this, therefore because of this" — is one of the most documented cognitive biases in psychology. Correlation vs causation errors underlie superstition, prejudice, and bad decision-making. Daniel Kahneman\'s System 1 thinking is specifically prone to this error: the storytelling brain constructs causal narratives from coincidental data. The Yoga Vasishtha identified this cognitive bias 1500+ years before cognitive psychology.',
          lifeLesson:
            'How many of your beliefs about yourself, others, or the world are based on coincidence mistaken for causation? "I failed because I tried that." "They don\'t like me because I did this." Question your causal stories. Events happen; the meaning-making is yours. Change the story, change the suffering.',
          keywords: ['Causation', 'CognitiveBias', 'Kakataliiya'],
        },
      ],
    },
    {
      id: 4,
      title: 'Sthiti Prakarana — The Persistence of the World',
      titleSanskrit: 'स्थितिप्रकरण',
      summary:
        'Why does the world keep appearing even after recognizing its illusory nature? Vasishtha answers: vasanas (deep subconscious impressions) sustain the appearance. Freedom comes through steady vichara, not aggressive rejection.',
      verses: [
        {
          id: 1,
          number: 1,
          sanskrit: 'चित्तं वासनारूपं वासनैव हि सृष्टिः | वासनाक्षयमेव मोक्ष इति निश्चयः ||',
          transliteration: 'cittaṃ vāsanārūpaṃ vāsanaiva hi sṛṣṭiḥ | vāsanākṣayameva mokṣa iti niścayaḥ ||',
          translation: 'The mind is composed of vasanas (impressions); creation itself is nothing but vasana. The exhaustion of vasanas alone is liberation — this is the conclusion.',
          hindi: 'चित्त वासना-रूप ही है; सृष्टि भी वासना ही है। वासनाओं का क्षय ही मोक्ष है — यही निश्चय है।',
          explanation:
            'A staggering claim of the Yoga Vasishtha: the world we see is nothing other than the vasanas (deep tendencies, impressions, samskaras) within the mind. As long as vasanas operate, the world keeps appearing exactly as the vasanas demand it to appear. Two people in the same room inhabit different worlds because they project their respective vasanas onto the same scene. Liberation is not destruction of the world; it is the exhaustion of the impressions that produce it.',
          science:
            'Predictive processing in neuroscience (Andy Clark, Karl Friston): perception is largely top-down — the brain predicts what it expects to see based on prior impressions and updates only when discrepancies arise. The "world we see" is genuinely a construction from accumulated priors. The Yoga Vasishtha\'s "vasana eva srishtih" — vasanas alone are creation — maps onto this neuroscientific view of perception with remarkable precision.',
          lifeLesson:
            'The next time you find yourself reacting strongly to a situation, pause and ask: how much of this reaction is from the present situation, and how much is from accumulated impressions of similar situations? Most of our suffering is the echo of yesterday\'s impressions onto today\'s screen. Recognising this is the first step toward freedom from it.',
          keywords: ['Vasanas', 'Mind', 'Construction'],
        },
      ],
    },
    {
      id: 5,
      title: 'Upashama Prakarana — The Dissolution of Vasanas & Quieting of the Mind',
      titleSanskrit: 'उपशमप्रकरण',
      summary:
        'The mechanism of liberation: vasanas dissolve through the withdrawal of belief and self-enquiry (vichara), not by forceful repression. When the thinker is recognized as an appearance within awareness, the agitation subsides effortlessly.',
      verses: [
        {
          id: 1,
          number: 1,
          sanskrit: 'वासनैव हि संसारो वासनाक्षयमुक्तिदम् | तस्माद्वासनया शुद्ध्या संसारविनिवर्तनम् ||',
          transliteration: 'vāsanaiva hi saṃsāro vāsanākṣayamuktidaṃ | tasmādvāsanayā śuddhyā saṃsāravinivarttanam ||',
          translation: 'Vasana alone is samsara. The destruction of vasana is liberation. Therefore, through the purification of vasana comes the cessation of samsara.',
          hindi: 'वासना ही संसार है। वासनाक्षय ही मुक्ति है। इसलिए वासना की शुद्धि से संसार की निवृत्ति होती है।',
          explanation:
            '"Vāsanaiva hi saṃsāraḥ" — vasana alone is samsara. Not the world itself but the habitual patterns of desire, aversion, and identification that structure experience. The world appears as bondage only because it is experienced through the lens of accumulated vasanas. "Vāsanākṣayamuktidaṃ" — the destruction of vasana is liberation. Not a different world, not a different body — the same world, experienced without the vasana-lens, is liberation. This is why jivan-mukti is possible: liberation in the body, while living, because the bondage was never in the world but in the vasanas.',
          science:
            'Default mode network and the narrative self (Brewer on habit loops; Killingsworth on mind-wandering): the default mode network generates the continuous narrative of the "self" — a stream of habitual associations, self-referential thoughts, and predictive patterns that constitute what the Yoga Vasistha calls vasanas. Research on mindfulness (Brewer) shows that the DMN\'s grip weakens not through suppression but through clear seeing — noticing the structure of the habit loop without being caught in it. "Vāsanayā śuddhyā" — through the purification of vasana — is the neuroscientific process of deconditioning the DMN through metacognitive awareness.',
          lifeLesson:
            'Pick one recurring pattern in your life — a type of situation that consistently produces the same reaction in you. This is a vasana. The Yoga Vasistha\'s method: do not fight it, do not indulge it — simply observe it with complete clarity. "What is this pattern? Where does it arise? What does it feel like in the body?" The moment you can observe a vasana clearly and dispassionately, you are no longer identified with it. That gap between the vasana and the awareness of it is the beginning of freedom.',
          keywords: ['VasanaSamsara', 'VasanaDestruction', 'JivanMukti', 'SelfEnquiry', 'HabitLoop', 'DefaultModeNetwork'],
        },
        {
          id: 2,
          number: 2,
          sanskrit: 'न मनो मानवो हन्तुं शक्यते परमेणपि | विचारेणैव सुलभं मनसो मरणं स्मृतम् ||',
          transliteration: 'na mano mānavo hantuṃ śakyate parameṇapi | vicāreṇaiva sulabhaṃ manaso maraṇaṃ smṛtam ||',
          translation: 'The mind cannot be killed by a human being, however supreme his effort. By inquiry alone, the death of the mind is easily attained — so it has been said.',
          hindi: 'कितने भी प्रयास से कोई मनुष्य मन को नहीं मार सकता। केवल विचार (आत्म-विचार) से ही मन की मृत्यु सुलभता से होती है — ऐसा कहा गया है।',
          explanation:
            'A liberating reversal: you cannot suppress the mind into stillness through willpower. The harder you fight thoughts, the more they multiply. But through vichara — patient, honest inquiry into the nature of the thinker — the mind subsides effortlessly. Why? Because the agitated mind is sustained by misidentification ("I am these thoughts"). When the misidentification ends through inquiry, the agitation has no fuel.',
          science:
            'Research on thought suppression (Wegner\'s "white bear" experiments): trying not to think of something makes it more present. Conversely, mindful observation of thoughts — without engagement or suppression — leads to their natural dissolution. Cognitive behavioural science confirms what Vasishtha taught: the way out is not force but understanding.',
          lifeLesson:
            'Right now, if your mind is restless, do not fight it. Instead, gently ask: who is aware of this restlessness? Hold the question without forcing an answer. Notice what happens. The restlessness was an attempt to be solved by the very mind producing it — an impossibility. Inquiry from a deeper place dissolves what struggle cannot.',
          keywords: ['Vichara', 'MindQuieting', 'NonStruggle'],
        },
      ],
    },
    {
      id: 6,
      title: 'Nirvana Prakarana — Jivan-Mukti & Final Liberation',
      titleSanskrit: 'निर्वाणप्रकरण',
      summary:
        'The culmination: liberation is not posthumous — it is available here and now in the living body (jivan-mukti). The liberated sage acts spontaneously in the world without the adhesion of reactivity or personal ego.',
      verses: [
        {
          id: 1,
          number: 1,
          sanskrit: 'जीवन्मुक्तः स विज्ञेयो बद्धमुक्ताभिमानवान् | यो न हृष्यति न द्वेष्टि न शोचति न काङ्क्षति ||',
          transliteration: 'jīvanmuktaḥ sa vijñeyo baddhamuktābhimānavān | yo na hṛṣyati na dveṣṭi na śocati na kāṅkṣati ||',
          translation: 'He is to be known as jivan-mukta — free while apparently bound — who neither exults, nor hates, nor grieves, nor desires.',
          hindi: 'वह जीवन्मुक्त जाना जाए — बंधे हुए में भी मुक्त — जो न हर्षित होता है, न द्वेष करता है, न शोक करता है, न इच्छा करता है।',
          explanation:
            'The Yoga Vasistha\'s portrait of the jivan-mukta — the one liberated in life. The four negatives are not emotional suppression: "na hṛṣyati" — no exultation at gain; "na dveṣṭi" — no hatred of opposition; "na śocati" — no grief at loss; "na kāṅkṣati" — no craving for what is absent. These are not achieved by willpower but by the natural consequence of seeing through the vasana-lens. When the vasanas are dissolved, the automatic emotional reactivity they generate dissolves with them. The jivan-mukta is not cold or detached — they are fully alive, but without the compulsive quality that makes ordinary life feel like bondage.',
          science:
            'Equanimity and the prefrontal-amygdala circuit (Davidson on the neuroscience of equanimity; Lutz on long-term meditators): research on long-term meditators shows structural changes in the prefrontal cortex\'s regulatory connection to the amygdala — the brain\'s threat-response system. Advanced meditators show normal amygdala responses to stimuli but dramatically faster recovery — the amygdala fires, but the "stickiness" that prolongs reactivity is absent. This is neurologically close to what the Yoga Vasistha describes: the jivan-mukta is not without response but without the prolonged adhesion of response that constitutes suffering.',
          lifeLesson:
            'The four qualities of the jivan-mukta are a daily diagnostic: (1) When something goes well today — do you exult in a way that makes you fear its loss? (2) When something opposes you — do you hate it, or simply notice it? (3) When something is lost — do you grieve proportionally or adhesively? (4) When something is absent — do you crave it compulsively or simply prefer it? The gaps between event and reaction are widening — that is the direction of jivan-mukti. Not a distant goal but a quality that is either present or absent in this moment.',
          keywords: ['JivanMukta', 'Equanimity', 'VasanaFreedom', 'PrefrontalAmygdala', 'LibertationInLife'],
        },
        {
          id: 2,
          number: 2,
          sanskrit: 'व्यवहारन्तु जीवन्मुक्तानां स्वच्छन्दतः सदा | सर्वत्र समदर्शित्वान्न रागद्वेषलक्षणम् ||',
          transliteration: 'vyavahārantu jīvanmuktānāṃ svacchandataḥ sadā | sarvatra samadarśitvānna rāgadveṣalakṣaṇam ||',
          translation: 'The conduct of the jivanmuktas is ever free and natural. Seeing all things equally, they show neither attachment nor aversion.',
          hindi: 'जीवन्मुक्तों का व्यवहार सदा स्वच्छंद और सहज होता है। सर्वत्र समदर्शी होने के कारण उनमें न राग है, न द्वेष।',
          explanation:
            'The jivanmukta — one who has attained liberation while still in the body — is not withdrawn from life. Vasishtha\'s description: their actions are natural, free, spontaneous. They neither cling to pleasure nor flee from pain. This is not indifference; it is a quality of presence in which the inner reactivity (raga-dvesha) has been exhausted. They participate fully in life without being captured by it.',
          science:
            'Research on long-term meditators (Davidson, Lutz, Ricard): the neural correlates of seasoned contemplatives show dramatically reduced amygdala reactivity, greater frontal-limbic integration, and what researchers call "trait equanimity" — a stable disposition that persists outside of meditation. The state Vasishtha describes is empirically documented in the brains of those who have practised for decades.',
          lifeLesson:
            'The goal of the Yoga Vasishtha is not to escape life but to live it without bondage. The jivanmukta is the most engaged of beings — but no longer at the mercy of every passing wind of like and dislike. You can begin moving in this direction immediately: notice one moment today when you would normally react with strong like or dislike, and instead simply observe. Each such moment is a step toward jivanmukti.',
          keywords: ['Jivanmukta', 'LiberationInLife', 'Equanimity'],
        },
        {
          id: 3,
          number: 3,
          sanskrit: 'चिन्मात्र प्राणः प्राणेश्चैव चिन्मात्र सर्वेषु भूतेषु | यो चिन्मात्रं प्राणरूपेण जानाति स मुक्तो भवति ||',
          transliteration: 'cinmātra prāṇaḥ prāṇeścaiva cinmātra sarveṣu bhūteṣu | yo cinmātraṃ prāṇarūpeṇa jānāti sa mukto bhavati ||',
          translation: 'Pure consciousness is prana, pure consciousness is the lord of prana, pure consciousness is in all beings. He who knows pure consciousness as the form of prana becomes liberated.',
          hindi: 'चिन्मात्र प्राण हैं, चिन्मात्र प्राणेश हैं, चिन्मात्र सभी प्राणियों में हैं। जो चिन्मात्र को प्राण-रूप में जानता है, वह मुक्त हो जाता है।',
          explanation:
            'The Yoga Vasistha identifies pure consciousness with prana — the life breath. "Cinmātra prāṇaḥ" — pure consciousness is prana. "Cinmātra prāṇeśaḥ" — pure consciousness is the lord of prana. "Cinmātra sarveṣu bhūteṣu" — pure consciousness is in all beings. The verse then states that knowing pure consciousness as the form of prana leads to liberation. This is the Yoga Vasistha\'s core teaching: pure consciousness is not a distant deity but the very breath that animates all life. Recognising pure consciousness in the breath is the most direct spiritual practice.',
          science:
            'Research on the neural correlates of breath awareness (Travis on TM; Lazar on mindfulness): practices that focus on the breath produce specific changes in brain regions associated with attention, emotion regulation, and self-awareness. The Yoga Vasistha\'s "cinmātraṃ prāṇarūpeṇa jānāti" — knowing pure consciousness as the form of prana — maps onto what neuroscience recognises: breath awareness is a powerful method for altering consciousness and accessing states of liberation.',
          lifeLesson:
            'The Yoga Vasistha teaches that pure consciousness is your breath. The practice is to recognise pure consciousness in each breath. When you inhale, recognise that pure consciousness is entering. When you exhale, recognise that pure consciousness is leaving. When the breath rests, recognise that pure consciousness is resting. This recognition transforms breathing from a physiological function into a continuous spiritual practice.',
          keywords: ['CinmatraAsPrana', 'BreathAsDivine', 'PranaRecognition', 'CinmatraInBreath'],
        },
        {
          id: 4,
          number: 4,
          sanskrit: 'चिन्मात्र सर्वस्वरूपो चिन्मात्र सर्वगतः सर्वव्यापी | चिन्मात्रं यो जानाति तत्त्वेन स चिन्मात्रः स स्वयं भवति ||',
          transliteration: 'cinmātra sarvasvarūpo cinmātra sarvagataḥ sarvavyāpī | cinmātraṃ yo jānāti tattvena sa cinmātraḥ sa svayaṃ bhavati ||',
          translation: 'Pure consciousness is the form of all, pure consciousness is everywhere, pure consciousness is all-pervading. He who knows pure consciousness in truth becomes pure consciousness himself.',
          hindi: 'चिन्मात्र सभी का स्वरूप है, चिन्मात्र सर्वत्र है, चिन्मात्र सर्वव्यापी है। जो चिन्मात्र को तत्व से जानता है, वह स्वयं चिन्मात्र हो जाता है।',
          explanation:
            'The Yoga Vasistha declares that pure consciousness is the form of all, everywhere, all-pervading. "Cinmātra sarvasvarūpaḥ" — pure consciousness is the form of all. "Cinmātra sarvagataḥ" — pure consciousness is everywhere. "Cinmātra sarvavyāpī" — pure consciousness is all-pervading. The verse then states that knowing pure consciousness in truth leads to becoming pure consciousness oneself. This is the Yoga Vasistha\'s ultimate teaching: liberation is the recognition that you are pure consciousness — the awareness that animates all existence. When you know pure consciousness in truth, you become pure consciousness.',
          science:
            'Physics of the universe and consciousness: the universe exhibits a fundamental unity at the quantum level — all particles are excitations of underlying fields. The Yoga Vasistha\'s "cinmātra sarvavyāpī" — pure consciousness is all-pervading — maps onto what physics recognises: the universe is a single, interconnected system. The breath is the individual expression of this cosmic consciousness.',
          lifeLesson:
            'The Yoga Vasistha teaches that you are pure consciousness — the awareness that animates all existence. The practice is to recognise yourself as the movement of awareness, not as the body that is aware. When you identify with pure consciousness, you identify with the all-pervading awareness that animates all existence. This identification is liberation.',
          keywords: ['CinmatraAsAll', 'AllPervading', 'CosmicConsciousness', 'BecomeCinmatra'],
        },
      ],
    },
  ],
};
