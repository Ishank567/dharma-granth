/**
 * Editorial learning aids that sit beside a verse: teaching flow, context
 * timeline, misunderstanding card, modern-example tabs, "verse in 30 seconds".
 *
 * Everything here is editorial. It is never scripture, and the components
 * label it that way. Every field is optional: a verse only shows the sections
 * it actually has, so nothing is forced into a template.
 */

export type ExampleContext = 'student' | 'career' | 'creator' | 'relationships' | 'family' | 'sport' | 'discipline';

export const EXAMPLE_CONTEXT_LABELS: Record<ExampleContext, { en: string; hi: string }> = {
  student: { en: 'Student', hi: 'विद्यार्थी' },
  career: { en: 'Career', hi: 'कार्यक्षेत्र' },
  creator: { en: 'Creator', hi: 'सृजन' },
  relationships: { en: 'Relationships', hi: 'संबंध' },
  family: { en: 'Family', hi: 'परिवार' },
  sport: { en: 'Sport', hi: 'खेल' },
  discipline: { en: 'Discipline', hi: 'अनुशासन' },
};

export interface ContextStep {
  text: string;
  textHi?: string;
  /** Marks the step that is this verse. */
  current?: boolean;
}

export interface UnderstandingExtras {
  /** Quick mode: the situation, the action, the question. (The one-liner comes from the pedagogical data.) */
  quick: {
    situation: string;
    situationHi?: string;
    action: string;
    actionHi?: string;
    question: string;
    questionHi?: string;
  };
  /** "Verse in 30 seconds". */
  thirtySeconds: { situation: string; teaching: string; clarification: string; tryThis: string };
  /** Ordered steps of the teaching, rendered as a flow with a plain-text twin. */
  teachingFlow?: Array<{ label: string; detail: string }>;
  beforeAfter?: { before: string; after: string };
  contextTimeline?: {
    steps: ContextStep[];
    passageHref?: string;
    /** For narrative or dialogue scriptures: who speaks, who listens, and what is being answered. */
    dialogue?: { speaker: string; listener: string; situation: string; question: string };
  };
  misunderstanding?: { claim: string; better: string };
  /** Only contexts that genuinely relate to the verse. */
  examples?: Array<{ context: ExampleContext; text: string }>;
}

const GITA_2_11: UnderstandingExtras = {
  quick: {
    situation:
      'You are facing an unavoidable, difficult duty or confrontation, and finding yourself constructing elaborate logical arguments to justify delaying or avoiding it.',
    situationHi:
      'आप किसी कठिन या असहज कर्तव्य का सामना करने से बचने के लिए मन ही मन चतुर तर्कों और बहानों का जाल बुन रहे हैं।',
    action:
      'Distinguish between genuine wisdom and defensive rationalization. Recognize that temporal circumstances change, but the core conscious truth does not perish.',
    actionHi:
      'सच्चे विवेक और भय से उपजे खोखले तर्कों में भेद करें। यह समझें कि बाहरी परिस्थितियां अनित्य हैं, पर अंतरात्मा अमर है।',
    question: 'Am I speaking from grounded clarity, or am I using intellectual analysis to hide my fear of stepping forward?',
    questionHi: 'क्या मैं सच्चे विवेक से सोच रहा हूँ, या केवल असहज कर्तव्य से बचने के लिए तर्कों का सहारा ले रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'You are using intellectual arguments to avoid confronting an uncomfortable reality.',
    teaching: 'The wise mourn neither for the living nor the dead; cut through rationalized fear to see what is real.',
    clarification: 'This is not callous indifference to sorrow; it is removing intellectual illusions that paralyze rightful duty.',
    tryThis: 'Before offering another reason why an uncomfortable duty cannot be done today, take 60 seconds of silent self-honesty.',
  },
  teachingFlow: [
    { label: 'The Intellectual Trap (Prajñāvādān)', detail: 'Using learned sounding words to disguise an emotional panic or reluctance to act.' },
    { label: 'The Metaphysical Reality', detail: 'Realizing that biological life and death are surface transitions of temporal matter.' },
    { label: 'The Perspective of the Wise (Paṇḍitāḥ)', detail: 'Those who know the eternal Self do not despair over inevitable temporal change.' },
    { label: 'Clarity of Purpose', detail: 'Dissolving false justifications clears the way for principled, fearless action.' },
  ],
  beforeAfter: {
    before: 'If I can debate and articulate enough intellectual complexities, I can justify not taking action.',
    after: 'I see through my own clever rationalizations and act with courage grounded in truth.',
  },
  contextTimeline: {
    steps: [
      { text: 'Arjuna collapses in despair on the battlefield, refusing to fight (1.28–1.46).' },
      { text: 'Arjuna surrenders to Krishna as his disciple, pleading for instruction (2.7–2.8).' },
      { text: 'Krishna begins speaking for the first time as teacher, exposing Arjuna’s grief as unfounded.', current: true },
      { text: 'Krishna explains the eternal nature of the soul across childhood, youth, old age, and rebirth (2.12–2.13).' },
      { text: 'Krishna teaches forbearance of sensory dualities (2.14).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Arjuna has concluded his emotional arguments against fighting and placed his spiritual trust in Krishna.',
      question: 'Why is it wrong to grieve over the impending loss of relatives in a battle for justice?',
    },
  },
  misunderstanding: {
    claim: 'Krishna is telling Arjuna to be cold, ruthless, and without sorrow for human tragedy.',
    better: 'Krishna is dismantling the philosophical error underlying Arjuna’s despair: confusing mortal form with conscious essence and abandoning sacred duty out of personal attachment.',
  },
  examples: [
    {
      context: 'student',
      text: 'A student facing a difficult exam cycle spends hours writing online essays arguing why formal grading systems are fundamentally flawed, instead of opening the textbook. Recognizing this as avoidance helps them get to work.',
    },
    {
      context: 'career',
      text: 'A manager must communicate a difficult structural decision. Instead of delivering it clearly, they stall behind complex corporate memos to soften personal discomfort. Grounded leadership requires cutting through hesitation.',
    },
    {
      context: 'family',
      text: 'When family conflict requires setting clear boundaries, we often tell ourselves elaborate stories about keeping the peace, when in truth we are simply terrified of momentary discomfort.',
    },
  ],
};

const GITA_2_13: UnderstandingExtras = {
  quick: {
    situation:
      'You are unsettled by aging, bodily decline, the passing of eras, or the fear of transitions that feel like endings.',
    situationHi:
      'आप उम्र बढ़ने, शारीरिक परिवर्तनों, जीवन के पुराने अध्यायों के समाप्त होने या भविष्य की अनिश्चितता से भयभीत हैं।',
    action:
      'Observe that just as you moved from childhood to youth and maturity without losing your conscious self, future transitions cannot destroy the witness within.',
    actionHi:
      'पहचानें कि जैसे बचपन से जवानी में आने पर आपका मूल अस्तित्व नहीं बदला, वैसे ही आगे के परिवर्तन भी आपकी अंतरात्मा को नष्ट नहीं कर सकते।',
    question: 'Why am I terrified of outer change when my inner awareness has serenely outlived every previous physical stage?',
    questionHi: 'जब मेरी आंतरिक चेतना ने जीवन के हर पिछले बदलाव को सहज पार कर लिया, तो मैं वर्तमान बदलाव से क्यों घबरा रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Anxiety over aging, physical decline, or major life passages.',
    teaching: 'The conscious soul moves through childhood, youth, and old age, and transitions to another body; the steady are not bewildered.',
    clarification: 'This is not trivializing the passage of time; it is anchoring identity in the indestructible observer that witnesses time.',
    tryThis: 'Look at an old photo of yourself from years ago; feel the unchanged awareness that connects that moment to this breath.',
  },
  teachingFlow: [
    { label: 'Bodily Flux (Kaumāraṁ Yauvanaṁ Jarā)', detail: 'Within one lifespan, infancy, youth, and aging flow continuously without stopping.' },
    { label: 'Continuous Observer (Dehī)', detail: 'The indwelling conscious witness remains identical while the biology transforms completely.' },
    { label: 'The Natural Transition (Dehāntara-prāptiḥ)', detail: 'Departing this body and assuming another is just the next natural passage in cosmic law.' },
    { label: 'Undeluded Serenity (Dhīra)', detail: 'The steady thinker recognizes this order and remains free from existential panic.' },
  ],
  beforeAfter: {
    before: 'Every gray hair or milestone transition reminds me that I am decaying and heading toward oblivion.',
    after: 'I am the ageless witness observing the biological seasons of this body with dignity and gratitude.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna declares that the wise mourn neither the living nor the dead (2.11).' },
      { text: 'Krishna affirms that there was never a time when he, Arjuna, or the kings did not exist (2.12).' },
      { text: 'Krishna uses the life stages of childhood, youth, and old age to prove the soul’s continuity (2.13).', current: true },
      { text: 'Krishna introduces sensory contacts (mātrā-sparśāḥ) and the need for titikṣā (2.14).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna is reframing Arjuna’s fear of death from a catastrophic finality to an orderly progression of consciousness.',
      question: 'What happens to the conscious person when the physical body dies?',
    },
  },
  misunderstanding: {
    claim: 'This teaching encourages neglecting healthcare and fitness because the body is going to change anyway.',
    better: 'Understanding the body’s seasons encourages mindful, dignified stewardship of health without panic-driven vanity or fear of inevitable aging.',
  },
  examples: [
    {
      context: 'student',
      text: 'Transitioning from high school to university or from student life to professional responsibilities can induce imposter syndrome. Seeing identity as continuous across changing roles restores confidence.',
    },
    {
      context: 'career',
      text: 'When a long-held career phase comes to an end due to technology shifts or retirement, recognizing that professional titles are just stages of life allows graceful reinvention.',
    },
    {
      context: 'family',
      text: 'Watching parents age or children grow up and leave home brings bittersweet nostalgia. The wise see these transformations as sacred seasons of life, meeting each stage with presence rather than resistance.',
    },
  ],
};

const GITA_2_14: UnderstandingExtras = {
  quick: {
    situation:
      'You are overwhelmed by changing conditions—praise and criticism, comfort and discomfort, or unexpected disruptions to your routine.',
    situationHi:
      'आप बदलती परिस्थितियों—अनुकूलता-प्रतिकूलता, सुख-दुःख या अप्रत्याशित बाधाओं से विचलित और अशांत हो रहे हैं।',
    action:
      'Recognize that sensory and emotional impressions arrive, stay briefly, and pass away. Practice enduring them (titikṣā) without losing inner poise.',
    actionHi:
      'यह पहचानें कि सुख-दुःख की अनुभूतियाँ आती-जाती हैं और अनित्य हैं। बिना अपना संतुलन खोए उन्हें धैर्यपूर्वक सहन (तितिक्षा) करें।',
    question: 'Am I confusing a temporary sensation or emotional turbulence with my permanent self?',
    questionHi: 'क्या मैं किसी क्षणिक सुख-दुःख या अशांति को ही अपनी स्थायी पहचान मान रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Sensory pleasures and pains are constantly shifting your mood.',
    teaching: 'Physical and emotional impacts have a beginning and an end; practice titikṣā (dignified forbearance).',
    clarification:
      'Titikṣā is not passive resignation or enduring abuse; it is mental fortitude amidst unavoidable worldly dualities.',
    tryThis:
      'When encountering heat, cold, frustration, or discomfort today, pause for 30 seconds and observe the physical sensation before reacting.',
  },
  teachingFlow: [
    {
      label: 'Sense Contact (Mātrā-sparśāḥ)',
      detail: 'Senses contact their worldly objects, producing sensations of cold, heat, pleasure, and pain.',
    },
    {
      label: 'Impermanence (Āgamāpāyinaḥ)',
      detail: 'These experiences inevitably have a point of arrival, duration, and departure; they are transient.',
    },
    {
      label: 'The Shift in Perspective',
      detail: 'Realise that the observing awareness within remains separate from the sensation experienced.',
    },
    {
      label: 'Patient Forbearance (Titikṣasva)',
      detail: 'Bear them with steady composure instead of being tossed around by emotional volatility.',
    },
  ],
  beforeAfter: {
    before: 'Whenever discomfort or emotional friction strikes, I must immediately react or complain to find relief.',
    after: 'I can observe uncomfortable sensations and emotions as passing weather patterns while staying anchored in calm.',
  },
  contextTimeline: {
    steps: [
      { text: 'Arjuna collapses in despair on the battlefield, refusing to fight (1.28–1.46).' },
      { text: 'Krishna notices his dejection and speaks for the first time, challenging his despondency (2.2–2.3).' },
      { text: 'Arjuna surrenders as a student and asks for clear guidance on dharma (2.7–2.8).' },
      {
        text: 'Krishna begins his spiritual instruction, stating that the wise grieve neither for the living nor the dead (2.11–2.13).',
      },
      {
        text: 'Krishna teaches that sensory contacts (mātrā-sparśāḥ) are transient and must be endured with fortitude.',
        current: true,
      },
      {
        text: 'Krishna explains that one who remains steady through pleasure and pain is fit for liberation (2.15).',
      },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation:
        'At the outset of the Kurukshetra war, Arjuna is overwhelmed by grief and bodily trembling at the thought of losing loved ones.',
      question:
        'How should one cope with the inevitable physical and emotional pains of life in this mortal world?',
    },
  },
  misunderstanding: {
    claim: 'Titikṣā means suppressing your feelings or tolerating injustice and cruelty without objection.',
    better:
      'Titikṣā is conscious psychological resilience against natural dualities (climate, fatigue, fleeting criticism), not passive submission to wrongdoing or emotional dissociation.',
  },
  examples: [
    {
      context: 'student',
      text: 'When preparing for long exams, uncomfortable posture, tiredness, or noisy surroundings can provoke irritability. Treating fatigue as a transient physical sensation rather than an emotional crisis keeps study focused.',
    },
    {
      context: 'career',
      text: 'A professional faces sharp client feedback or market turbulence. Rather than swinging between euphoria on success and panic on setbacks, they remain steady and address the facts calmly.',
    },
    {
      context: 'family',
      text: 'In family life, small disagreements, mood swings, and domestic friction occur routinely. Responding with patient forbearance prevents minor everyday discomforts from escalating into lasting conflict.',
    },
  ],
};

const GITA_2_20: UnderstandingExtras = {
  quick: {
    situation: 'You are troubled by existential anxiety, thoughts of aging, bodily decline, or fear of mortality.',
    situationHi: 'आप जीवन की नश्वरता, वृद्धावस्था, शारीरिक बीमारी या मृत्यु और वियोग के भय से चिंतित और व्यथित हैं।',
    action:
      'Ground your identity in the uncreated, unchanging consciousness (Ātman) that observes all bodily changes without being altered by them.',
    actionHi:
      'अपनी पहचान को शरीर के परिवर्तनों से परे, उस नित्य और अजन्मा चैतन्य (आत्मा) में स्थिर करें जो सभी अवस्थाओं का साक्षी है।',
    question: 'Am I mistaking the temporary body-mind vehicle for the eternal conscious witness within?',
    questionHi: 'क्या मैं शरीर और मन के नाशवान रूप को ही अपना अंतिम और शाश्वत अस्तित्व समझ रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'You feel trapped by the fragility and mortality of the physical body.',
    teaching: 'The conscious Self (Ātman) is unborn, deathless, and untouched by physical destruction.',
    clarification:
      'This teaching does not demean physical life or health; it reveals the immortal foundation of existence.',
    tryThis:
      'Notice the quiet witness inside that has observed your childhood, youth, and present moment—unchanged throughout all physical changes.',
  },
  teachingFlow: [
    { label: 'Unborn (Ajaḥ)', detail: 'The true Self does not come into being when the biological body is formed.' },
    { label: 'Eternal (Nityaḥ)', detail: 'It exists continuously beyond temporal beginnings, durations, and ends.' },
    {
      label: 'Ever-Fresh (Śāśvataḥ Purāṇaḥ)',
      detail: 'Ancient yet never aging; physical decrepitude does not affect conscious essence.',
    },
    {
      label: 'Unslain (Na hanyate)',
      detail: 'When the physical organism perishes, the core conscious witness remains entirely intact.',
    },
  ],
  beforeAfter: {
    before:
      'My entire identity is limited to this mortal body; when it weakens or dies, everything that I am is extinguished.',
    after:
      'My body is a temporary, precious instrument, but my deepest essence is uncreated, deathless consciousness.',
  },
  contextTimeline: {
    steps: [
      { text: 'Arjuna fears the slaughter of venerated elders and kinfolk (1.31–1.37).' },
      { text: 'Krishna begins teaching the distinction between the mortal body and the immortal Self (2.11–2.17).' },
      {
        text: 'Krishna declares that while physical bodies have an end, the indwelling Self is indestructible (2.18–2.19).',
      },
      {
        text: 'Krishna declares the famous sixfold negation of change: the Atman is never born, never dies, and remains unslain.',
        current: true,
      },
      {
        text: 'Krishna compares the casting off of worn-out bodies to a person discarding old garments for new ones (2.22).',
      },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation:
        'Arjuna is weeping, dreading that performing his duty on the battlefield will extinguish the souls of his teachers and relatives.',
      question:
        'What is the true nature of human consciousness, and does physical death extinguish the conscious self?',
    },
  },
  misunderstanding: {
    claim: 'Because the soul is immortal, physical life is meaningless and we can be indifferent to death and violence.',
    better:
      'The immortality of the Self liberates one from existential fear so they can act righteously (Dharma) with courage, not as an excuse for callous cruelty or recklessness.',
  },
  examples: [
    {
      context: 'student',
      text: 'A student suffering from intense anxiety over career failure or life uncertainty realizes that external worldly labels do not define their essential worth or consciousness, bringing mental grounding.',
    },
    {
      context: 'career',
      text: 'A professional navigating major career displacement or health challenges recognizes that life shifts affect roles and bodily conditions, but the core dignity of the self remains whole.',
    },
    {
      context: 'family',
      text: 'During times of mourning or attending to aging parents, this verse provides deep comfort: physical departure is the natural shedding of an aging vessel, not the destruction of consciousness.',
    },
  ],
};

const GITA_2_22: UnderstandingExtras = {
  quick: {
    situation:
      'You are grappling with the fragility of physical existence, recovering from physical illness, or mourning the departure of a loved one.',
    situationHi:
      'आप शारीरिक दुर्बलता, बीमारी या किसी प्रियजन के देहावसान के बाद गहरे शोक और नश्वरता के विचार से व्यथित हैं।',
    action:
      'Contemplate the relationship between the garment and its wearer. Care for the body with respect, but anchor your identity in the indestructible soul that wears it.',
    actionHi:
      'वस्त्र और उसे पहनने वाले के अंतर को समझें। शरीर की यत्नपूर्वक देखभाल करें, किंतु अपनी पहचान अविनाशी आत्मा में स्थापित करें।',
    question: 'Am I confusing the clothes I wear with the conscious being who puts them on?',
    questionHi: 'क्या मैं शरीर रूपी वस्त्र को ही अपना अंतिम अस्तित्व मानकर भयभीत हो रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Overwhelming dread of mortality or sorrow over physical deterioration.',
    teaching: 'As a person casts off worn-out garments and puts on new ones, the soul casts off worn-out bodies and enters new ones.',
    clarification: 'This is not devaluing the physical body; it is liberating consciousness from somatic claustrophobia and existential terror.',
    tryThis: 'When changing your clothes today, pause for 30 seconds to reflect: "I am the conscious wearer, not the fabric."',
  },
  teachingFlow: [
    { label: 'Everyday Metaphor (Vāsāṁsi Jīrṇāni)', detail: 'Discarding threadbare clothing to wear fresh attire is routine, harmless, and necessary.' },
    { label: 'The Embodied Soul (Dehī)', detail: 'The indwelling conscious self is the permanent occupant, not the temporary biological suit.' },
    { label: 'Shedding the Vessel', detail: 'When physical organs exhaust their vitality, the soul naturally releases the worn frame.' },
    { label: 'Continuity of the Journey', detail: 'Consciousness continues into fresh expressions under the rhythm of cosmic law.' },
  ],
  beforeAfter: {
    before: 'If my body breaks down or ceases to exist, my entire existence is completely extinguished.',
    after: 'My body is an entrusted vehicle worn by consciousness; its end is simply the shedding of a garment.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna declares the Self to be unborn, eternal, and unslain when the body is slain (2.20).' },
      { text: 'Krishna asks how one who knows this truth could ever kill or cause another to be killed (2.21).' },
      { text: 'Krishna offers the famous metaphor of changing worn-out garments for new ones (2.22).', current: true },
      { text: 'Krishna declares that weapons cannot cleave the Self, fire cannot burn it, water cannot wet it (2.23).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna gives a vivid, unforgettable analogy to dismantle the terror of physical death.',
      question: 'How should one conceptualize the relationship between human consciousness and bodily mortality?',
    },
  },
  misunderstanding: {
    claim: 'The garment metaphor means the physical body is worthless or should be treated with contempt.',
    better: 'Just as we mend, wash, and protect good clothes, the body is honored as a sacred vehicle for spiritual duty; we simply do not mistake the clothing for the person.',
  },
  examples: [
    {
      context: 'career',
      text: 'A retiring professional struggles to separate their personal identity from their corporate title and credentials. Recognizing titles as professional garments worn during a specific season helps them step into the next chapter with dignity.',
    },
    {
      context: 'family',
      text: 'Supporting an elderly family member whose mobility is failing. Seeing them as the unchanging soul wearing a weary garment helps caregivers maintain deep reverence and compassion rather than viewing them as a burden.',
    },
    {
      context: 'creator',
      text: 'An artist finishes a long phase of creative expression and feels empty when the medium or tool changes. The creative essence is the artist, not the canvas; new forms await.',
    },
  ],
};

const GITA_2_47: UnderstandingExtras = {
  quick: {
    situation: 'You are waiting on a result (an exam mark, a launch, a decision) and cannot stop thinking about it.',
    situationHi: 'आप किसी परिणाम (परीक्षा, लॉन्च, निर्णय) की प्रतीक्षा में हैं और उसके बारे में सोचना बंद नहीं कर पा रहे।',
    action: 'Pick the one piece of work that is yours today and do it fully, without checking the outcome while you work.',
    actionHi: 'आज का वह एक कार्य चुनें जो आपके हाथ में है, और परिणाम देखे बिना उसे पूरे मन से करें।',
    question: 'Which part of this is mine to do, and which part am I only worrying about?',
    questionHi: 'इसमें मेरे करने का भाग कौन-सा है, और किस भाग की मैं केवल चिंता कर रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'You are worried about a result.',
    teaching: 'Your responsibility is the action, done with care.',
    clarification: 'The verse does not reject goals, planning or evaluation.',
    tryThis: 'Spend 15 focused minutes on the next useful action.',
  },
  teachingFlow: [
    { label: 'What can I influence?', detail: 'My effort, my choices, my preparation and how I respond.' },
    { label: 'What can I not fully control?', detail: 'Other people, competition, circumstances and the final outcome.' },
    { label: 'Where does attention go?', detail: 'To the action in front of me, done sincerely.' },
    { label: 'A balanced approach', detail: 'Plan seriously, act sincerely, and accept that some uncertainty remains.' },
  ],
  beforeAfter: {
    before: 'If I cannot control the final result, then my effort is worth nothing.',
    after: 'I can prepare seriously and act well, while recognising that not every part of the outcome is up to me.',
  },
  contextTimeline: {
    steps: [
      { text: 'Arjuna faces a serious moral conflict on the battlefield (Chapter 1).' },
      { text: 'He becomes uncertain about taking any action at all (2.1–2.10).' },
      { text: 'Krishna begins to explain the self, duty and wise action (from 2.11).' },
      { text: 'He introduces action done with a steady mind, buddhi-yoga (2.39).' },
      { text: 'This verse speaks about action and attachment to results.', current: true },
      { text: 'The teaching continues in the next verse on balance, samatvam (2.48).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'On the battlefield of Kurukshetra, before the war, Arjuna is troubled and unsure whether to act.',
      question: 'How can one act wholeheartedly without being bound by the fruits of the action?',
    },
  },
  misunderstanding: {
    claim: 'Results do not matter, so planning and goals are unnecessary.',
    better:
      'The verse does not reject planning, goals or honest evaluation. It warns against letting attachment to an outcome become the only reason for acting, and it does not recommend giving up action (the last line says so).',
  },
  examples: [
    {
      context: 'student',
      text: 'A student prepares well for an exam and then notices that revising has turned into refreshing the results page. Returning attention to the next chapter of revision is the verse in practice.',
    },
    {
      context: 'career',
      text: 'Someone preparing a presentation can control the research and the practice. They cannot control how the room reacts. Their preparation stays complete either way.',
    },
    {
      context: 'creator',
      text: 'A writer publishes an essay and can improve the next draft. They cannot decide how many people read it. Attention returns to the craft.',
    },
  ],
};

const GITA_2_48: UnderstandingExtras = {
  quick: {
    situation: 'A deadline went well, or badly, and your mood swung with it for the whole day.',
    situationHi: 'कोई कार्य अच्छा या बुरा हुआ, और उसके साथ आपका मन पूरे दिन ऊपर-नीचे होता रहा।',
    action: 'Do the next task with full attention, then notice how you feel about the result without acting on that feeling straight away.',
    actionHi: 'अगला कार्य पूरे ध्यान से करें, फिर परिणाम के प्रति अपनी भावना को देखें, उसी क्षण उस पर प्रतिक्रिया न करें।',
    question: 'When did a success or a setback last decide my mood more than it needed to?',
    questionHi: 'पिछली बार कब किसी सफलता या असफलता ने मेरे मन को आवश्यकता से अधिक प्रभावित किया?',
  },
  thirtySeconds: {
    situation: 'Your calm rises and falls with every result.',
    teaching: 'Act steadily, and let balance of mind (samatvam) be the practice.',
    clarification: 'Balance is not coldness. You can care about the work and still stay steady.',
    tryThis: 'Before reacting to news about your work today, take three slow breaths.',
  },
  teachingFlow: [
    { label: 'Act', detail: 'Do the work that is yours to do.' },
    { label: 'Loosen the grip', detail: 'Let go of clinging to how it will turn out.' },
    { label: 'Meet either result evenly', detail: 'Success or setback, keep the mind steady.' },
    { label: 'Equanimity', detail: 'The verse names this evenness of mind as yoga.' },
  ],
  beforeAfter: {
    before: 'To stay motivated I have to feel anxious about every outcome.',
    after: 'I can stay committed to the work while keeping my balance whether it goes well or not.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna begins to explain the self, duty and wise action (from 2.11).' },
      { text: 'He introduces action done with a steady mind, buddhi-yoga (2.39).' },
      { text: 'The previous verse says the right is to the action, not its fruits (2.47).' },
      { text: 'This verse names evenness of mind in success and failure as yoga.', current: true },
      { text: 'The next verse ranks action done with a steady mind above action driven by results (2.49).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna is continuing his teaching on acting with a steady mind, on the battlefield of Kurukshetra.',
      question: 'What does it mean to act without being pulled between success and failure?',
    },
  },
  misunderstanding: {
    claim: 'Staying even-minded means not caring about the result.',
    better:
      'The verse asks for steadiness, not indifference. You can care deeply about the work and still keep your balance when the result arrives, in either direction.',
  },
  examples: [
    {
      context: 'student',
      text: 'After a poor test result, a student studies the mistakes and prepares for the next one, rather than deciding that one mark describes their ability.',
    },
    {
      context: 'sport',
      text: 'A player who loses a match reviews it calmly. A player who wins keeps training. Neither result changes the routine.',
    },
    {
      context: 'career',
      text: 'After praise or criticism of a project, a professional listens to the useful part and returns to the work with the same attention.',
    },
  ],
};

const GITA_2_55: UnderstandingExtras = {
  quick: {
    situation:
      'You are exhausted by the endless loop of desires: wanting the next upgrade, seeking social validation, and feeling chronically dissatisfied despite achieving your goals.',
    situationHi:
      'आप निरंतर नई इच्छाओं, सोशल मीडिया लाइक्स और भौतिक उपलब्धियों के पीछे भागते-भागते मानसिक रूप से थक चुके हैं।',
    action:
      'Relinquish compulsive mental fantasies and discover the self-sufficient contentment of being present in your own conscious awareness.',
    actionHi:
      'मन की काल्पनिक और स्वार्थपूर्ण कामनाओं को त्यागकर अपनी अंतरात्मा में ही पूर्ण शांति और संतोष का अनुभव करें।',
    question: 'Why am I outsourcing my happiness to conditions outside of myself when peace is already present within?',
    questionHi: 'मैं अपनी शांति को बाहरी वस्तुओं पर क्यों निर्भर कर रहा हूँ, जब संतोष का स्रोत मेरे अपने भीतर है?',
  },
  thirtySeconds: {
    situation: 'Mental exhaustion from chasing external validation and endless material upgrades.',
    teaching: 'Abandoning mental desires and remaining content in the Self alone marks steady wisdom (sthitaprajña).',
    clarification: 'This does not mean living without goals or joy; it means stopping the frantic dependency that makes your peace hostage to outcomes.',
    tryThis: 'When you feel a sudden impulse to scroll feeds or buy something for a quick dopamine hit today, pause and breathe for 60 seconds.',
  },
  teachingFlow: [
    { label: 'Arjuna’s Inquiry', detail: 'Arjuna asks for the observable characteristics of a person who has attained steady wisdom.' },
    { label: 'Relinquishing Mental Craving (Prajahāti Kāmān)', detail: 'Discarding the endless phantom cravings concocted by obsessive mental projection.' },
    { label: 'Inner Contentment (Ātmanyevātmanā Tuṣṭaḥ)', detail: 'Finding complete, self-sustaining fulfillment within the silence of the Self.' },
    { label: 'Steady Wisdom (Sthitaprajña)', detail: 'Wisdom becomes unwavering when it no longer wobbles under external winds.' },
  ],
  beforeAfter: {
    before: 'I will finally be at peace as soon as I acquire that object, title, or external approval.',
    after: 'I am already whole in my awareness; I act in the world from fullness rather than from deficit.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna concludes his exposition of Buddhi Yoga and freeing oneself from scriptural rites (2.49–2.53).' },
      { text: 'Arjuna asks the famous fourfold question: What are the marks of a Sthitaprajna, how do they speak, sit, and walk? (2.54).' },
      { text: 'Krishna answers the first question: abandoning all mental desires and content in the Self alone (2.55).', current: true },
      { text: 'Krishna describes emotional equanimity across sorrow and joy (2.56).' },
      { text: 'Krishna uses the turtle metaphor to describe withdrawing the senses (2.58).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Arjuna has asked how to recognize a person whose discernment is firmly established in divine consciousness.',
      question: 'What is the foundational internal state of a person of steady wisdom?',
    },
  },
  misunderstanding: {
    claim: 'Abandoning desire means living a dreary, ambitionless life with zero motivation or joy.',
    better: 'Renouncing selfish craving frees tremendous mental energy; you act with greater enthusiasm, mastery, and joy because your inner peace is never on the line.',
  },
  examples: [
    {
      context: 'student',
      text: 'A student stops obsessing over competing with peers for bragging rights and studies out of pure curiosity and devotion to knowledge. Study sessions become deeply engaging rather than anxiety-ridden.',
    },
    {
      context: 'career',
      text: 'An entrepreneur works diligently to build useful software without checking valuation metrics every hour. They operate from steady craft rather than frantic insecurity.',
    },
    {
      context: 'creator',
      text: 'A writer writes their book for the love of truth and storytelling, refusing to tailor every chapter to algorithmic trends or audience applause. The work gains timeless depth.',
    },
  ],
};

const GITA_2_56: UnderstandingExtras = {
  quick: {
    situation:
      'You are swung wildly between emotional highs when things go well and deep depression or anger when obstacles arise.',
    situationHi:
      'अनुकूल स्थिति में आप उत्तेजित और अहंकारी हो जाते हैं, और प्रतिकूल स्थिति में अत्यधिक निराश या क्रोधित हो जाते हैं।',
    action:
      'Meet sorrows without panic (anudvigna-manāḥ), greet pleasures without clinging (vigata-spṛhaḥ), and release the triad of passion, fear, and anger.',
    actionHi:
      'कष्टों में बिना घबराए शांत रहें, सुखों में लालसा न रखें, और राग, भय तथा क्रोध को अपने ऊपर हावी न होने दें।',
    question: 'Is my emotional thermostat controlled by external circumstances, or am I anchored in steady presence?',
    questionHi: 'क्या मेरी मानसिक शांति बाहरी घटनाओं की मोहताज है, या मैं अपने भीतर शांत और स्थिर हूँ?',
  },
  thirtySeconds: {
    situation: 'Emotional volatility caused by life’s unpredictable dualities of success and hardship.',
    teaching: 'Unshaken in sorrow, free from craving in pleasures, and released from passion, fear, and anger—this is the steady sage.',
    clarification: 'This is not turning into an unfeeling robot; it is keeping your higher intellect calm and clear through life’s storms.',
    tryThis: 'When encountering unexpected irritation or bad news today, name the emotion: "Is this passion, fear, or anger?" Then let it pass.',
  },
  teachingFlow: [
    { label: 'Poise in Distress (Duḥkheṣv Anudvigna-manāḥ)', detail: 'Remaining unpanicked and clear-minded when setbacks or losses strike.' },
    { label: 'Freedom from Craving (Sukheṣu Vigata-spṛhaḥ)', detail: 'Enjoying good fortune without becoming addictively dependent on it.' },
    { label: 'Clearing the Triad (Vīta-rāga-bhaya-krodhaḥ)', detail: 'Uprooting selfish attachment (rāga), insecurity (bhaya), and wrath (krodha).' },
    { label: 'The Steady Sage (Sthitadhīḥ Muniḥ)', detail: 'Attaining the enduring equilibrium of a contemplative seer.' },
  ],
  beforeAfter: {
    before: 'When crisis hits, I fall apart; when good luck hits, I lose my humility and crave more.',
    after: 'I maintain the same clear, grounded presence whether the day brings victory or tribulation.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna defines the internal state of the Sthitaprajna as contentment in the Self (2.55).' },
      { text: 'Krishna defines their responsive equanimity amidst outer pleasure, pain, and emotions (2.56).', current: true },
      { text: 'Krishna explains freedom from praise and blame across good and bad fortune (2.57).' },
      { text: 'Krishna describes withdrawing the senses like a tortoise draws in its limbs (2.58).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna describes how a person of steady wisdom responds to the inevitable emotional dualities of worldly existence.',
      question: 'How does an enlightened person experience and respond to pain, pleasure, and emotional turbulence?',
    },
  },
  misunderstanding: {
    claim: 'Being unperturbed means pretending sorrow does not hurt or suppressing all natural human feeling.',
    better: 'Pain is acknowledged honestly, but the mind does not add layers of panic, victimhood, resentment, or rage on top of it.',
  },
  examples: [
    {
      context: 'career',
      text: 'A company faces a critical system outage. The lead engineer remains completely focused and calm, methodically diagnosing the root cause while others panic or assign blame.',
    },
    {
      context: 'family',
      text: 'During a family financial pinch, a parent stays steady, encouraging constructive budgeting without despair, and when bonuses arrive, saves prudently without reckless indulgence.',
    },
    {
      context: 'sport',
      text: 'An athlete concedes an early penalty. Instead of letting anger shatter their focus, they reset immediately and play the rest of the match with cold precision.',
    },
  ],
};

const GITA_2_62: UnderstandingExtras = {
  quick: {
    situation:
      'You catch yourself endlessly daydreaming about a temptation, brooding over an argument, or obsessively researching a luxury item you do not need.',
    situationHi:
      'आप किसी भोग-विलास, विवाद या भौतिक वस्तु के बारे में बार-बार सोच रहे हैं और मन की बेचैनी बढ़ती जा रही है।',
    action:
      'Recognize that casual mental dwelling is the spark that ignites compulsive desire and reactive rage. Snip the thought loop at the root.',
    actionHi:
      'यह समझें कि विचारों का यह हल्का सा भटकाव ही आगे चलकर तीव्र वासना और क्रोध का कारण बनेगा। शुरुआत में ही ध्यान हटा लें।',
    question: 'What innocent-looking daydream am I entertaining that is quietly growing into a compulsive attachment?',
    questionHi: 'मैं किस इच्छा या विचार को मन में दोहरा रहा हूँ, जो आगे चलकर मेरे मानसिक संतुलन को बिगाड़ देगा?',
  },
  thirtySeconds: {
    situation: 'Casual mental fixation escalating into craving and frustration.',
    teaching: 'Dwelling on sense objects breeds attachment; attachment breeds desire; thwarted desire breeds anger.',
    clarification: 'Objects are not the enemy; the danger lies in unconscious mental rumination that hijacks your autonomy.',
    tryThis: 'The moment you notice yourself looping on a craving or resentment today, say "stop" and focus on three mindful breaths.',
  },
  teachingFlow: [
    { label: 'Contemplation (Dhyāyataḥ Viṣayān)', detail: 'Repeatedly visualizing, daydreaming about, or researching sensory stimuli.' },
    { label: 'Attachment (Saṅgaḥ Upajāyate)', detail: 'The mind forms an emotional bond and feels incomplete without the object.' },
    { label: 'Compulsive Craving (Kāmaḥ)', detail: 'Attachment intensifies into an urgent, demanding desire that demands satisfaction.' },
    { label: 'Eruption of Anger (Krodhaḥ)', detail: 'When the desire meets resistance, obstacle, or delay, it instantly transforms into fury.' },
  ],
  beforeAfter: {
    before: 'My sudden anger at my family or coworkers came out of nowhere; they caused it.',
    after: 'I trace my anger back to its true source: a hidden craving formed by daydreaming that was thwarted.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna explains that controlling the senses requires anchoring the mind in higher spiritual consciousness (2.61).' },
      { text: 'Krishna traces the first four steps of downfall: dwelling → attachment → desire → anger (2.62).', current: true },
      { text: 'Krishna completes the cascade of ruin: anger → delusion → memory loss → destruction of intellect → fall (2.63).' },
      { text: 'Krishna reveals the path of freedom: moving among objects with senses free from likes and dislikes (2.64).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna warns Arjuna of the subtle psychological mechanism through which even an intelligent person falls into ruin.',
      question: 'How does mental agitation and moral downfall begin in an ordinary human mind?',
    },
  },
  misunderstanding: {
    claim: 'The Gita is condemning the physical world and saying we should never look at or enjoy anything pleasant.',
    better: 'The warning is against obsessive psychological rumination and dependent attachment, not healthy perception and dharmic enjoyment.',
  },
  examples: [
    {
      context: 'student',
      text: 'Continuously looking at video game clips during study breaks. The thoughts linger, turning into craving, and when a parent asks them to do chores, they lash out with disproportionate anger.',
    },
    {
      context: 'career',
      text: 'Fixating on a peer’s high salary or promotion. The dwelling breeds envy and craving for that exact status; when reviews come back ordinary, bitter resentment poisons workplace relationships.',
    },
    {
      context: 'creator',
      text: 'Obsessively refreshing view counters. Dwelling on numbers creates compulsive craving for virality, and when a piece underperforms, bitter anger dries up creative inspiration.',
    },
  ],
};

const GITA_2_63: UnderstandingExtras = {
  quick: {
    situation:
      'You are blinded by a flash of rage, about to send an explosive message, make a rash decision, or say something you cannot take back.',
    situationHi:
      'आप तीव्र गुस्से में हैं और कोई ऐसा कड़ा कदम उठाने या कटु शब्द बोलने जा रहे हैं, जिसके बाद केवल पछतावा बचेगा।',
    action:
      'Implement an immediate emergency freeze. Understand that anger obliterates moral memory and critical judgment.',
    actionHi:
      'तुरंत एक विराम लें। यह पहचानें कि क्रोध में विवेक और मर्यादा की स्मृति समाप्त हो जाती है, जिससे बुद्धि का नाश होता है।',
    question: 'Am I willing to wreck my long-term integrity and life over a temporary surge of adrenaline?',
    questionHi: 'क्या मैं क्षणिक गुस्से के कारण अपने जीवन की मर्यादा, संबंधों और विवेक को नष्ट करने जा रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Blinding anger about to trigger catastrophic impulsive behavior.',
    teaching: 'From anger comes delusion; from delusion confusion of memory; from lost memory the ruin of intellect; and from ruin of intellect, one perishes.',
    clarification: 'Ruin is not physical death; it is the destruction of moral discernment and the ability to live a purposeful, noble life.',
    tryThis: 'Apply the 15-minute freeze: never hit "Send" or speak in wrath until heart rate normalizes and intellect returns.',
  },
  teachingFlow: [
    { label: 'Anger (Krodha)', detail: 'Frustrated desire boils into aggressive emotional reactivity.' },
    { label: 'Delusion (Sammoha)', detail: 'Loss of perspective; right and wrong become completely blurred.' },
    { label: 'Memory Confusion (Smṛti-vibhrama)', detail: 'Forgetting past lessons, ethical commitments, and love for others.' },
    { label: 'Ruin of Intellect (Buddhi-nāśa)', detail: 'The rational executive function collapses; foolish choices take over.' },
    { label: 'Downfall (Praṇaśyati)', detail: 'The human falls from character, peace, and spiritual purpose.' },
  ],
  beforeAfter: {
    before: 'When I am furious, I have every right to unleash my wrath and destroy whatever stands in my way.',
    after: 'I recognize rage as a temporary intoxicant that disables my intellect; I refuse to act while intoxicated by wrath.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna shows how contemplating objects sparks desire and anger (2.62).' },
      { text: 'Krishna completes the ladder of downfall from anger to the ruin of the intellect (2.63).', current: true },
      { text: 'Krishna explains the alternative: moving among sensory objects with disciplined senses brings serenity (2.64).' },
      { text: 'Krishna states that in peace, all sorrows are dissolved and intellect becomes steady (2.65).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna completes the psychological ladder of downfall, demonstrating how unchecked anger destroys humanity’s highest faculty.',
      question: 'What happens to human intellect and life when anger is allowed to run its full course?',
    },
  },
  misunderstanding: {
    claim: 'This means that getting angry once destroys your soul forever.',
    better: 'The verse diagnoses a progressive psychological cycle; catching the spiral at any stage halts the destruction and restores discernment.',
  },
  examples: [
    {
      context: 'career',
      text: 'A senior executive receives an unfair email critique. Enraged, they type a blistering, personal reply forgetting company policy, their own stature, and the legal consequences. Pausing until morning saves their career.',
    },
    {
      context: 'family',
      text: 'In a heated domestic argument, words are spoken that cannot be taken back, fracturing years of trust. Recognizing that anger causes memory loss of love helps partners step away before speaking.',
    },
    {
      context: 'student',
      text: 'A student who is reprimanded by a teacher reacts with explosive defiance, getting suspended right before board examinations. Remembering the ladder of downfall protects their future.',
    },
  ],
};

const GITA_3_9: UnderstandingExtras = {
  quick: {
    situation:
      'Feeling weighed down by tasks, experiencing work as a stressful chore driven purely by anxiety for promotion, bonus, or praise.',
    situationHi:
      'काम को एक बोझ या तनाव की तरह महसूस करना, जहाँ हर प्रयास केवल पद, प्रशंसा या लाभ पाने की चिंता से संचालित हो रहा हो।',
    action:
      'Reframe action into yajña: dedicate your craftsmanship wholeheartedly to the collective good without selfish clutching.',
    actionHi:
      'कर्म को यज्ञ बनाइए: संकीर्ण स्वार्थ छोड़कर अपने कार्य को समाज, प्रकृति और ईश्वर के प्रति निःस्वार्थ समर्पण मानकर कीजिए।',
    question: 'Am I working to feed narrow personal anxiety, or am I offering my honest energy for something greater?',
    questionHi: 'क्या मैं केवल अपने संकीर्ण स्वार्थ और भय के लिए काम कर रहा हूँ, या लोककल्याण के लिए अपनी ऊर्जा समर्पित कर रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Exhausted by work and feeling that every responsibility is a trap.',
    teaching: 'Work creates psychological bondage unless performed as sacrifice; act for that purpose free from selfish clutching.',
    clarification: 'Yajña is not just ritual fire; it is any cooperative, generous action performed without grasping.',
    tryThis: 'Dedicate the first 30 minutes of your workday entirely to helping a colleague or improving a process without expecting credit.',
  },
  teachingFlow: [
    { label: 'Self-Centered Effort (Anyatra)', detail: 'Working purely for personal gain creates an endless cycle of anxiety, possessiveness, and fear.' },
    { label: 'The Principle of Yajña (Yajñārthāt)', detail: 'Aligning individual action with cosmic reciprocity and collective welfare.' },
    { label: 'Freedom from Attachment (Mukta-saṅgaḥ)', detail: 'Giving complete attention to the craft while loosening attachment to personal praise.' },
    { label: 'Harmonious Execution (Samācara)', detail: 'Acting thoroughly and conscientiously with inner freedom.' },
  ],
  beforeAfter: {
    before: 'I must extract maximum personal profit from every action, or else my labor was completely wasted.',
    after: 'I perform my duty with wholehearted excellence as an offering to life; the work itself is my liberation.',
  },
  contextTimeline: {
    steps: [
      { text: 'Arjuna asks why Krishna urges him to terrible action if knowledge is superior (3.1).' },
      { text: 'Krishna explains the two steadfast paths: Jnana Yoga for the contemplative and Karma Yoga for men of action (3.3).' },
      { text: 'Krishna reveals that action performed as yajna liberates rather than binds (3.9).', current: true },
      { text: 'Krishna describes the wheel of cosmic sacrifice linking rain, food, action, and the Supreme (3.14-16).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/3',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna shows how work transforms from a binding burden into an engine of spiritual freedom when offered selflessly.',
      question: 'How can an active person engage in worldly responsibilities without becoming entangled in stress and karma?',
    },
  },
  misunderstanding: {
    claim: 'Yajna in modern life requires ancient fire altars and sacrificial rituals.',
    better: 'Yajna represents the cosmic law of mutual support and selfless contribution; any honest work done for the common good is authentic yajna.',
  },
  examples: [
    {
      context: 'career',
      text: 'An engineer burned out by corporate metrics shifts their mental posture: instead of obsessing over quarterly bonuses, they focus on building software that genuinely protects user privacy and supports their teammates.',
    },
    {
      context: 'student',
      text: 'A student studying medicine stops viewing exams as a competitive rat race and remembers the future patients whose lives will depend on their diligence.',
    },
    {
      context: 'creator',
      text: 'An artist stops tailoring every painting to social media algorithms and returns to the joy of offering beauty to the community.',
    },
  ],
};

const GITA_3_21: UnderstandingExtras = {
  quick: {
    situation:
      'Wondering whether your everyday conduct really matters to those around you, or tempted to cut ethical corners because "nobody is looking."',
    situationHi:
      'यह सोचना कि आपके व्यक्तिगत आचरण से दूसरों पर क्या फर्क पड़ता है, या यह सोचकर मर्यादा छोड़ना कि मुझे कौन देख रहा है।',
    action:
      'Recognize that leadership is continuous demonstration. The standards you set in daily integrity become the blueprint others naturally follow.',
    actionHi:
      'पहचानें कि नेतृत्व उपदेश में नहीं, आचरण में है। आप जैसा प्रामाणिक व्यवहार करेंगे, अन्य लोग स्वतः उसी मार्ग का अनुसरण करेंगे।',
    question: 'If those who look up to me adopted my exact work ethic and ethical standards today, would our community flourish or decline?',
    questionHi: 'यदि मेरे साथी या परिवारजन मेरे वर्तमान आचरण को अपना आदर्श बना लें, तो क्या वे उन्नति करेंगे या पतन की ओर जाएंगे?',
  },
  thirtySeconds: {
    situation: 'Feeling tempted to relax ethical standards because you have already achieved senior status.',
    teaching: 'Whatever a great person does, ordinary people follow; whatever standard they set, the world lives by.',
    clarification: 'Exemplary leadership is not about perfection or pride, but the humble responsibility of conscious example.',
    tryThis: 'Model the exact punctuality, honesty, and humility you wish to see across your entire team today.',
  },
  teachingFlow: [
    { label: 'The Leader’s Action (Śreṣṭhaḥ)', detail: 'Those in positions of influence, maturity, or responsibility teach constantly through their conduct.' },
    { label: 'Natural Emulation (Itaro Janaḥ)', detail: 'People do not listen to spoken theories; they unconsciously imitate lived behavior.' },
    { label: 'Setting the Standard (Pramāṇam)', detail: 'High personal integrity establishes a rising moral tide for the entire environment.' },
    { label: 'Social Cohesion (Lokasaṅgraha)', detail: 'Preserving societal trust and inspiring excellence across generations.' },
  ],
  beforeAfter: {
    before: 'Now that I am senior, rules no longer apply to me; I can preach discipline while doing whatever I want.',
    after: 'The greater my responsibility, the more impeccable and gentle my personal discipline must be.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna shows that the wise act without personal craving to guide the world (3.20).' },
      { text: 'Krishna explains that leaders set the ethical benchmark by their personal actions (3.21).', current: true },
      { text: 'Krishna notes that even He, having nothing to gain, remains tirelessly engaged in duty (3.22).' },
      { text: 'Krishna warns of the ruin of society if the enlightened abandon duty (3.24).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/3',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna reminds Arjuna that as a prince and warrior, his personal choices set a public precedent for millions.',
      question: 'Why must an enlightened or accomplished person still bother following social and moral duties?',
    },
  },
  misunderstanding: {
    claim: 'This implies only top politicians and corporate CEOs are "shreshtha" (leaders).',
    better: 'Every parent, elder sibling, teacher, and senior colleague is a "shreshtha" whose actions shape the emotional weather of others.',
  },
  examples: [
    {
      context: 'career',
      text: 'A tech lead refuses to rush unverified code through deployment, demonstrating to junior engineers that software safety is sacred even when deadlines loom.',
    },
    {
      context: 'family',
      text: 'A parent puts down their phone during family dinner, demonstrating digital moderation far more effectively than shouting at their children to study.',
    },
    {
      context: 'student',
      text: 'A class leader turns in found study materials to the campus lost-and-found, establishing a culture of honesty throughout the student cohort.',
    },
  ],
};

const GITA_3_30: UnderstandingExtras = {
  quick: {
    situation:
      'Paralyzed by performance anxiety, feeling suffocated by possessive attachment to outcomes, and burning with mental fever (jvara).',
    situationHi:
      'भविष्य के परिणामों की चिंता से ग्रस्त होना, ममता और "यह मेरा है" की भावना में जलना तथा मानसिक व्याकुलता महसूस करना।',
    action:
      'Surrender all actions to the Supreme Consciousness, cast off selfish ownership and personal craving, and engage in battle free from mental fever.',
    actionHi:
      'समस्त कर्मों को अंतर्यामी परमात्मा में समर्पित करें, अहंकार और ममता को छोड़ें और मानसिक ताप (ज्वर) से मुक्त होकर कर्तव्य में जुट जाएं।',
    question: 'Can I release the obsessive need to micro-manage the universe, and act with undivided presence right now?',
    questionHi: 'क्या मैं परिणामों पर अपना एकाधिकार जताने की ज़िद छोड़कर शांत भाव से वर्तमान कर्म में पूरी निष्ठा लगा सकता हूँ?',
  },
  thirtySeconds: {
    situation: 'Experiencing severe work burnout and chronic emotional anxiety.',
    teaching: 'Dedicating all actions to Me, with mind centered on the Self, free from hope and possessiveness, fight released from fever.',
    clarification: 'Vigata-jvara (free from fever) is psychological serenity: intense engagement without emotional burning.',
    tryThis: 'Before entering a challenging meeting, mentally dedicate the outcome to cosmic order and step in with quiet presence.',
  },
  teachingFlow: [
    { label: 'Offering to the Supreme (Mayi Sarvāṇi)', detail: 'Recognizing that all physical and mental faculties belong to cosmic nature.' },
    { label: 'Inner Grounding (Adhyātma-cetasā)', detail: 'Anchor the mind in the timeless witness rather than transient external circumstances.' },
    { label: 'Free from Craving & Ownership (Nirāśīr Nirmamaḥ)', detail: 'Drop neurotic entitlement and anxious possessiveness over results.' },
    { label: 'Action Without Fever (Vigata-jvaraḥ)', detail: 'Execute necessary duty with cool clarity, calm stamina, and boundless energy.' },
  ],
  beforeAfter: {
    before: 'I must bear the solitary burden of making everything succeed, and every bump in the road is a personal catastrophe.',
    after: 'I am a dedicated instrument of the Divine; I act with full excellence while surrendering the outcome with peace.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna explains that actions are driven by nature’s modes, not by the ego (3.27-28).' },
      { text: 'Krishna gives the supreme formula of dedicated action free from fever (3.30).', current: true },
      { text: 'Krishna declares that those who follow this teaching with faith are freed from bondage (3.31).' },
      { text: 'Krishna warns of the loss of discernment for those who ignore this truth (3.32).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/3',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna delivers the psychological and spiritual formula to completely eliminate burnout, anxiety, and defeatism in duty.',
      question: 'With what state of mind should a warrior engage in fierce, high-stakes responsibility?',
    },
  },
  misunderstanding: {
    claim: 'Being "free from hope" (nirāśīḥ) means becoming pessimistic and expecting failure.',
    better: 'It means freeing the mind from obsessive fantasy about future rewards, so that 100% of cognitive bandwidth is available for the task.',
  },
  examples: [
    {
      context: 'career',
      text: 'A founder pitching to investors releases the frantic desperate desire to be approved; they present the product with calm, transparent honesty, free from anxious desperation.',
    },
    {
      context: 'sport',
      text: 'A runner standing at the starting line stops obsessing over winning a medal and immerses their mind completely into their breath, stride, and technique.',
    },
    {
      context: 'discipline',
      text: 'A practitioner commits to daily meditation without measuring whether each session was "enlightening," resting in the quiet offering of practice.',
    },
  ],
};

const GITA_3_35: UnderstandingExtras = {
  quick: {
    situation:
      'Pressured by social prestige, parental demands, or viral trends to pursue a path that conflicts with your natural disposition and authentic calling.',
    situationHi:
      'सामाजिक दिखावे, साथियों की देखादेखी या दबाव में आकर अपने स्वाभाविक स्वभाव और प्रतिभा के विरुद्ध किसी अन्य मार्ग पर चलना।',
    action:
      'Embrace your authentic duty (Svadharma) even if performed imperfectly; imitating someone else’s nature breeds internal dread and friction.',
    actionHi:
      'अपनी स्वाभाविक प्रतिभा और स्वभाव के अनुसार स्वधर्म का पालन करें, भले ही उसमें कमियाँ हों; दूसरों की नकल करना आत्मग्लानि और भय पैदा करता है।',
    question: 'Am I choosing this path because it genuinely aligns with my nature, or am I trying to wear someone else’s mask for status?',
    questionHi: 'क्या मैं यह कार्य अपनी स्वाभाविक प्रकृति और रुचि से कर रहा हूँ, या केवल प्रतिष्ठा पाने के लिए दूसरों की नकल कर रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Suffering from imposter syndrome by forcing yourself into a career that feels utterly alien to your soul.',
    teaching: 'Better is one’s own duty imperfectly performed than another’s duty performed well; another’s duty brings peril.',
    clarification: 'Svadharma is not a rigid caste mandate; it is honoring your authentic psychosocial makeup and ethical responsibilities.',
    tryThis: 'Write down what you do that produces energized focus rather than chronic exhaustion; build your daily vocation around it.',
  },
  teachingFlow: [
    { label: 'Authentic Calling (Svadharmo Viguṇaḥ)', detail: 'Living in alignment with one’s genuine disposition, even when early execution is clumsy.' },
    { label: 'Synthetic Imitation (Paradharmāt Svanuṣṭhitāt)', detail: 'Flawlessly mimicking another’s lifestyle or career while suffering internal deadness.' },
    { label: 'Honorable Growth (Svadharme Nidhanaṁ Śreyaḥ)', detail: 'Dedication to one’s authentic purpose builds genuine human dignity and resilience.' },
    { label: 'The Peril of Disconnection (Paradharmo Bhayāvahaḥ)', detail: 'Living an inauthentic life produces chronic anxiety, alienation, and spiritual decay.' },
  ],
  beforeAfter: {
    before: 'I must copy the most fashionable, high-status careers so everyone approves of me, even if it destroys my soul.',
    after: 'I honor the gifts and disposition given to me; I would rather be an honest apprentice in my true vocation than a fake in another’s.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna shows that even wise beings follow their nature, so mere suppression is futile (3.33).' },
      { text: 'Krishna warns against being swayed by attachment and aversion towards sensory objects (3.34).' },
      { text: 'Krishna declares that one’s own authentic duty is infinitely superior to an alien path (3.35).', current: true },
      { text: 'Arjuna asks what mysterious force compels a person to commit error against their will (3.36).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/3',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Arjuna contemplates abandoning his warrior duty to become a forest ascetic; Krishna exposes this as romanticized escapism.',
      question: 'Should an individual abandon their difficult duty in favor of a seemingly more peaceful life suited for someone else?',
    },
  },
  misunderstanding: {
    claim: 'This means people should never try to learn new skills or evolve beyond their childhood upbringing.',
    better: 'It means growth must be rooted in your real nature; developing your authentic potential is growth, while living someone else’s life is self-betrayal.',
  },
  examples: [
    {
      context: 'student',
      text: 'A gifted writer resists intense peer pressure to join an engineering cram school, choosing instead literature and journalism where their natural aptitude shines.',
    },
    {
      context: 'career',
      text: 'A quiet, analytical individual turns down a loud sales management role to become a master systems architect, thriving in their zone of natural depth.',
    },
    {
      context: 'creator',
      text: 'An artist stops imitating hyper-commercial pop trends and returns to their genuine minimalist aesthetic, finding an enthusiastic, loyal audience.',
    },
  ],
};

const GITA_3_42: UnderstandingExtras = {
  quick: {
    situation:
      'Feeling completely enslaved by sensory cravings, digital dopamine loops, or sudden irrational emotional urges.',
    situationHi:
      'इंद्रियों के आकर्षण, मोबाइल की लत या अचानक उठने वाले भावनात्मक आवेगों के सामने खुद को असहाय महसूस करना।',
    action:
      'Map your inner hierarchy: Senses are subtler than the body; Mind is higher than senses; Intellect is higher than mind; the conscious Self (Atman) is supreme.',
    actionHi:
      'अपनी चेतना के स्तरों को पहचानें: शरीर से श्रेष्ठ इंद्रियां हैं, इंद्रियों से श्रेष्ठ मन है, मन से श्रेष्ठ बुद्धि है, और बुद्धि से भी परे साक्षात् आत्मा है।',
    question: 'Am I identifying with the temporary impulse of the senses, or am I anchoring in the silent, conscious witness within?',
    questionHi: 'क्या मैं इंद्रियों के क्षणिक खिंचाव में बह रहा हूँ, या अपने भीतर साक्षी रूप में स्थित विवेक और आत्म-चेतना से निर्णय ले रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Struggling with impulse control and feeling overpowered by sudden desires.',
    teaching: 'Senses are subtle; higher than senses is mind; higher than mind is intellect; and beyond intellect is the Self.',
    clarification: 'Desire does not have absolute power; you possess higher faculties (Buddhi and Atman) that can command and quiet lower impulses.',
    tryThis: 'When an urge hits, pause for 10 seconds: move attention from the sensory itch to the breath (mind), then to your values (intellect), then to the quiet watcher (Self).',
  },
  teachingFlow: [
    { label: 'Physical Realm (Śarīra)', detail: 'The external body and matter; heavy, gross, and largely reactive.' },
    { label: 'Sensory Gates (Indriyāṇi)', detail: 'The five senses that perceive external stimuli; subtler and more powerful than the body.' },
    { label: 'Mental Faculty (Manas)', detail: 'The seat of desires, doubts, feelings, and impulses; subtler and faster than the senses.' },
    { label: 'Discerning Intellect (Buddhi)', detail: 'The higher faculty of wisdom, values, evaluation, and decision-making; master of the mind.' },
    { label: 'The Pure Self (Ātman)', detail: 'The unconditioned witness of all faculties; infinite, untouched, and supreme.' },
  ],
  beforeAfter: {
    before: 'My cravings and mood swings dictate who I am; I have no choice but to surrender to every impulse.',
    after: 'I am the conscious witness that observes cravings; my intellect and Self have the sovereign authority to choose nobility.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna identifies desire (Kāma) and wrath (Krodha) as the all-devouring enemies born of Rajas (3.37).' },
      { text: 'Krishna shows how wisdom is enveloped by desire like fire by smoke (3.38-39).' },
      { text: 'Krishna reveals the hierarchical faculties of consciousness through which desire is conquered (3.42).', current: true },
      { text: 'Krishna instructs Arjuna to steady the self by the higher Self and slay the formidable enemy of desire (3.43).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/3',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna gives Arjuna the psychological blueprint of human consciousness to conquer compulsive desires.',
      question: 'Where does destructive craving hide, and how can the human being systematically master it?',
    },
  },
  misunderstanding: {
    claim: 'This teaching encourages brutal suppression of the senses and hatred of the body.',
    better: 'It provides a constructive structural hierarchy: when higher intellect and spiritual awareness lead, the mind and senses become peaceful, faithful allies.',
  },
  examples: [
    {
      context: 'student',
      text: 'A student tempted to play video games instead of studying notices the impulse in the senses and mind, but uses their Buddhi (intellect) to choose their academic dream.',
    },
    {
      context: 'discipline',
      text: 'A person breaking a sugar addiction pauses when seeing pastries: they observe the tongue’s craving as sensory weather and align with their higher health resolve.',
    },
    {
      context: 'career',
      text: 'A negotiator insulted by an adversary feels hot rage in the body and senses, but anchors in Buddhi to respond with strategic calm.',
    },
  ],
};

const ISHA_1: UnderstandingExtras = {
  quick: {
    situation:
      'Feeling an insatiable itch to hoard wealth, compete frantically for material trophies, and fear that resources are scarce.',
    situationHi:
      'धन-दौलत और साधनों को बटोरने की अंधी होड़ में भागना, तथा मन में यह भय रहना कि अगर मैंने नहीं छीना तो सब खत्म हो जाएगा।',
    action:
      'Recognize that this dynamic universe is enveloped by the Divine. Enjoy what is given with joyful renunciation; do not covet anyone’s wealth.',
    actionHi:
      'पहचानें कि इस गतिशील संसार में सब कुछ ईश्वर से व्याप्त है। जो मिला है, उसे त्यागभाव और कृतज्ञता से भोगें; किसी के धन का लोभ न करें।',
    question: 'Am I hoarding out of chronic insecurity, or can I experience joyful contentment in the sacred unity of life?',
    questionHi: 'क्या मैं लोभ और असुरक्षा से ग्रसित होकर संचय कर रहा हूँ, या ईश्वर की इस सृष्टि में त्यागभाव से तृप्त होकर जी रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Anxious consumerism and chronic comparison with the wealth of others.',
    teaching: 'All this transient cosmos is enveloped by the Divine; enjoy through renunciation, coveting no one’s wealth.',
    clarification: 'Tena tyaktena bhuñjīthāḥ: real joy comes from unpossessive stewardship, not grasping hoarding.',
    tryThis: 'Look around your living room today; identify five things you own, and mentally offer them back to the cosmos with profound gratitude.',
  },
  teachingFlow: [
    { label: 'Divine Pervasion (Īśā Vāsyam)', detail: 'Every transient particle of this changing universe is saturated with sacred consciousness.' },
    { label: 'The Fluid Cosmos (Jagat)', detail: 'Recognizing that material forms are in perpetual flux and cannot provide permanent security.' },
    { label: 'Enjoyment Through Renunciation (Tyaktena Bhuñjīthāḥ)', detail: 'True enjoyment is liberated from possessiveness; caring for life without clinging.' },
    { label: 'Freedom from Covetousness (Mā Gṛdhaḥ)', detail: 'Releasing envy and greed toward the wealth or possessions of anyone else.' },
  ],
  beforeAfter: {
    before: 'This world is a cold, competitive arena where I must grab and hoard as much as possible before I die.',
    after: 'This universe is a sacred home enveloped by God; I enjoy each gift as a temporary guest without greed.',
  },
  contextTimeline: {
    steps: [
      { text: 'The Upanishad declares the cosmic envelope of Divinity and the ethic of renunciation (Mantra 1).', current: true },
      { text: 'The sage instructs active engagement in duties for a full hundred years without karmic stain (Mantra 2).' },
      { text: 'The text warns of darkened realms for those who destroy their conscious awareness (Mantra 3).' },
      { text: 'The paradoxical speed and stillness of the Supreme Reality are revealed (Mantra 4-5).' },
    ],
    passageHref: '/scripture/ishavasya/chapter/1',
    dialogue: {
      speaker: 'Vedic Rishi (Yajurveda)',
      listener: 'Seeker of Truth',
      situation: 'The opening mantra of the Shukla Yajurveda 40th chapter lays down the metaphysical and ethical foundation of Vedanta.',
      question: 'What is the true nature of this material cosmos, and how should a wise person live in it without despair?',
    },
  },
  misunderstanding: {
    claim: 'This means that having any money or possessions is sinful and everyone must live in abject poverty.',
    better: 'It distinguishes between use and ownership: you may use resources with joyful stewardship, but claiming solitary, arrogant ownership destroys inner peace.',
  },
  examples: [
    {
      context: 'career',
      text: 'A business executive treats corporate profits not as personal trophies for vanity, but as trust resources to innovate, pay fair wages, and serve society.',
    },
    {
      context: 'family',
      text: 'A family stops keeping up with neighbors’ lavish renovations, discovering deep peace and abundance in a simple, harmonious home.',
    },
    {
      context: 'creator',
      text: 'A musician shares their songs freely with the world, recognizing that melody and breath are gifts of the cosmos, not personal ego-property.',
    },
  ],
};

const ISHA_2: UnderstandingExtras = {
  quick: {
    situation:
      'Feeling an urge to abandon daily duties and withdraw into lazy passive escapism under the guise of "spirituality."',
    situationHi:
      'अध्यात्म या वैराग्य के नाम पर कर्तव्यों से जी चुराना, तथा आलस्य या पलायनवाद को ही शांति समझ लेना।',
    action:
      'Perform your duties faithfully and wish to live a full hundred years. When actions are done with selflessness, work does not cling to you as karma.',
    actionHi:
      'इस संसार में निष्काम भाव से कर्म करते हुए सौ वर्ष जीने की इच्छा करें। इस भाव से जीने पर कर्म आपको बांधता नहीं है।',
    question: 'Am I avoiding hard work out of genuine enlightenment, or is it merely passive lethargy pretending to be detachment?',
    questionHi: 'क्या मैं सचमुच अनासक्त हूँ, या केवल कठिन जिम्मेदारियों से भागने के लिए वैराग्य का ढोंग कर रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'Feeling weary of daily responsibilities and tempted to quit your life’s vocation.',
    teaching: 'Doing work here, one should desire to live a hundred years; for a human so living, there is no other way—action clings not to you.',
    clarification: 'The Vedic ideal is not gloomy world-denial, but vigorous, ethical participation in the rhythm of life for a full century.',
    tryThis: 'Approach today’s most tedious task with robust energy, viewing it as a healthy expression of life rather than a curse.',
  },
  teachingFlow: [
    { label: 'Honest Action (Kurvanneva Karmāṇi)', detail: 'Commitment to continuous, dedicated activity in alignment with cosmic harmony.' },
    { label: 'Long Life with Purpose (Jījīviṣecchataṁ Samāḥ)', detail: 'Embracing a full, century-long human span with vitality, cheer, and dignity.' },
    { label: 'The Only Royal Path (Evaṁ Tvayi Nānyathā)', detail: 'For embodied human life, active ethical engagement is the only durable spiritual path.' },
    { label: 'Unclinging Freedom (Na Karma Lipyate)', detail: 'Action performed without selfish clinging leaves no psychological scar or karmic bondage.' },
  ],
  beforeAfter: {
    before: 'Life is a prison of endless chores, and the sooner I escape from working, the more peaceful I will be.',
    after: 'Work is the vibrant pulse of life; when I act with clean motives, a hundred years of labor will never stain my peace.',
  },
  contextTimeline: {
    steps: [
      { text: 'The sage establishes that the entire cosmos is enveloped by the Divine (Mantra 1).' },
      { text: 'The sage mandates a full lifetime of dedicated action without karmic stain (Mantra 2).', current: true },
      { text: 'The sage warns that denying the conscious Self leads to sunless worlds of darkness (Mantra 3).' },
      { text: 'The sage describes the swift, unmoving nature of Consciousness (Mantra 4).' },
    ],
    passageHref: '/scripture/ishavasya/chapter/1',
    dialogue: {
      speaker: 'Vedic Rishi (Yajurveda)',
      listener: 'Seeker of Truth',
      situation: 'Lest the seeker mistake renunciation in Mantra 1 for gloomy laziness, the Rishi immediately commands vigorous, century-long action.',
      question: 'Does realizing the divine unity of life mean abandoning worldly duties and sitting idle?',
    },
  },
  misunderstanding: {
    claim: 'Karma yoga is an inferior path and real sages only sit in caves doing nothing.',
    better: 'The Shukla Yajurveda proclaims that active ethical engagement (Kurvanneva) is the essential foundation for human dignity and spiritual realization.',
  },
  examples: [
    {
      context: 'career',
      text: 'A veteran surgeon in their sixties continues performing lifesaving operations with joyful vigor, finding renewal in serving patients rather than yearning for idle retirement.',
    },
    {
      context: 'student',
      text: 'A student who feels overwhelmed by a rigorous four-year degree takes heart in the ideal of lifelong vigorous learning.',
    },
    {
      context: 'discipline',
      text: 'A yogi maintains their morning asana and pranayama discipline daily into old age, viewing bodily stewardship as an act of gratitude to life.',
    },
  ],
};

const REGISTRY: Record<string, UnderstandingExtras> = {
  'bhagavadgita:2:11': GITA_2_11,
  'bhagavadgita:2:13': GITA_2_13,
  'bhagavadgita:2:14': GITA_2_14,
  'bhagavadgita:2:20': GITA_2_20,
  'bhagavadgita:2:22': GITA_2_22,
  'bhagavadgita:2:47': GITA_2_47,
  'bhagavadgita:2:48': GITA_2_48,
  'bhagavadgita:2:55': GITA_2_55,
  'bhagavadgita:2:56': GITA_2_56,
  'bhagavadgita:2:62': GITA_2_62,
  'bhagavadgita:2:63': GITA_2_63,
  'bhagavadgita:3:9': GITA_3_9,
  'bhagavadgita:3:21': GITA_3_21,
  'bhagavadgita:3:30': GITA_3_30,
  'bhagavadgita:3:35': GITA_3_35,
  'bhagavadgita:3:42': GITA_3_42,
  'ishavasya:1:1': ISHA_1,
  'ishavasya:1:2': ISHA_2,
};

export function getUnderstandingExtras(
  scriptureId: string,
  chapterId: number,
  verseId: string | number,
): UnderstandingExtras | undefined {
  return REGISTRY[`${scriptureId}:${chapterId}:${verseId}`];
}
