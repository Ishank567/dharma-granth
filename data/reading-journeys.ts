/**
 * Theme-based reading journeys. Each lesson points to one verse in the
 * library; the verse text itself is read from the library at build time, never
 * copied here. Everything written in this file (context, explanation,
 * reflection, activity) is editorial, not scripture, and every journey carries
 * a review state. `expect` is a fragment of the Sanskrit that must appear in
 * the library's verse (checked by scripts/check-journeys.ts) so a numbering
 * change cannot silently point a lesson at the wrong verse.
 */

import type { ReviewStatus } from './study-content';

export interface JourneyLesson {
  id: string;
  scriptureId: string;
  chapter: number;
  verse: number;
  expect: string;
  context: string;
  explanation: string;
  reflection: string;
  activity?: string;
}

export interface ReadingJourney {
  id: string;
  title: string;
  titleHi: string;
  objective: string;
  audience: string;
  minutesPerLesson: number;
  curator: string;
  /** ISO date of the last editorial review, or null if never reviewed. */
  reviewedOn: string | null;
  review: ReviewStatus;
  lessons: JourneyLesson[];
  related: Array<{ label: string; href: string }>;
  sources: string[];
}

const GITA = 'bhagavadgita';
const CURATOR = 'Dharma Granth editorial team (draft)';
const SOURCES = ['Sanskrit text: as given in the Dharma Granth library edition (see each verse page, “Sources and edition”).', 'Context, explanation, reflection and activity: editorial notes, not scripture.'];

export const READING_JOURNEYS: ReadingJourney[] = [
  {
    id: 'seven-days-of-focus',
    title: 'Seven Days of Focus',
    titleHi: 'एकाग्रता के सात दिन',
    objective: 'Read seven verses from the Gita on a steady, gathered mind, one a day.',
    audience: 'Anyone who finds their attention scattered and wants a calm place to start.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'f1', scriptureId: GITA, chapter: 2, verse: 41, expect: 'व्यवसायात्मिका',
        context: 'Krishna has begun teaching Arjuna about acting with understanding. Here he contrasts a resolved mind with a scattered one.',
        explanation: 'A mind with one clear resolve is steady. A mind pulled in many directions has many branching aims and little rest.',
        reflection: 'What is one aim you could name today so that the rest of your attention has somewhere to settle?',
        activity: 'Write one sentence naming the single thing you most want to finish today.',
      },
      {
        id: 'f2', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Krishna tells Arjuna where his responsibility lies when the outcome of a task is uncertain.',
        explanation: 'The verse points the mind at the action in front of you, and away from worry about results you cannot fully control.',
        reflection: 'Where does your attention go while you work: to the task, or to how it will turn out?',
        activity: 'Give 15 minutes to the next useful step of one task, without checking how it is going.',
      },
      {
        id: 'f3', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'The next verse continues the same teaching and names the balance it asks for.',
        explanation: 'Acting from steadiness, and not from clinging, lets success and failure be received with equal calm.',
        reflection: 'How does your work feel when you are not gripping the outcome?',
      },
      {
        id: 'f4', scriptureId: GITA, chapter: 6, verse: 5, expect: 'उद्धरेदात्मनाऽऽत्मानं',
        context: 'In the chapter on meditation, Krishna speaks about the mind as both helper and obstacle.',
        explanation: 'One’s own mind can lift a person up or pull them down, so the work of steadiness begins with how one relates to it.',
        reflection: 'In what ways has your own mind been a friend to you this week?',
      },
      {
        id: 'f5', scriptureId: GITA, chapter: 6, verse: 26, expect: 'यतो यतो निश्चरति',
        context: 'Arjuna has said the mind is restless. Here Krishna offers a practical instruction.',
        explanation: 'Whenever the mind wanders, bring it back gently. The practice is returning, not never wandering.',
        reflection: 'What usually pulls your attention away, and what could help you return?',
        activity: 'Sit for three minutes. Each time you notice you have drifted, return to your breath.',
      },
      {
        id: 'f6', scriptureId: GITA, chapter: 6, verse: 35, expect: 'अभ्यासेन तु कौन्तेय',
        context: 'Krishna agrees the mind is hard to hold, then names two supports.',
        explanation: 'Steady practice and a loosening of grasping make it possible to steady the mind over time.',
        reflection: 'Which small practice could you repeat daily, even for a few minutes?',
      },
      {
        id: 'f7', scriptureId: GITA, chapter: 2, verse: 70, expect: 'आपूर्यमाणमचलप्रतिष्ठं',
        context: 'Near the end of the chapter, Krishna describes the person of steady wisdom with an image of the sea.',
        explanation: 'Waters flow into a full, unmoving ocean without disturbing it. A steady mind receives its experiences in the same way.',
        reflection: 'What would it feel like to let today’s demands arrive without being carried off by them?',
      },
    ],
    related: [
      { label: 'Wisdom for Life: Concentration', href: '/wisdom-for-life/concentration' },
      { label: 'Wisdom for Life: Discipline', href: '/wisdom-for-life/discipline' },
    ],
    sources: SOURCES,
  },
  {
    id: 'understanding-karma-yoga',
    title: 'Understanding Karma Yoga',
    titleHi: 'कर्मयोग को समझें',
    objective: 'Follow the Gita’s teaching on acting without being bound by results, across six verses.',
    audience: 'New readers of the Gita, and students of work, duty and effort.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'k1', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'The teaching begins as Krishna answers Arjuna’s grief with a view of action.',
        explanation: 'Your responsibility is the action itself. The verse does not reject goals or planning; it warns against being ruled by one outcome.',
        reflection: 'Which of your efforts today could you do well whatever the result?',
      },
      {
        id: 'k2', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Krishna defines the balance in a single line.',
        explanation: 'Evenness toward success and failure is called yoga here.',
        reflection: 'When did you last act well and stay level about how it went?',
      },
      {
        id: 'k3', scriptureId: GITA, chapter: 3, verse: 9, expect: 'यज्ञार्थात्कर्मणो',
        context: 'In chapter 3 Arjuna asks about action and knowledge, and Krishna widens the meaning of action.',
        explanation: 'Action done as an offering, beyond one’s own gain, does not bind. Action done only for oneself does.',
        reflection: 'Who beyond you benefits from your work?',
      },
      {
        id: 'k4', scriptureId: GITA, chapter: 3, verse: 19, expect: 'तस्मादसक्तः सततं',
        context: 'Krishna draws the conclusion of this part of the teaching.',
        explanation: 'Do what has to be done without attachment, and the person reaches the highest through action itself.',
        reflection: 'What would change if you did one task today without needing credit for it?',
      },
      {
        id: 'k5', scriptureId: GITA, chapter: 4, verse: 18, expect: 'कर्मण्यकर्म',
        context: 'In chapter 4 Krishna speaks about seeing action more deeply.',
        explanation: 'The verse says the wise see inaction within action and action within inaction. Readers and commentators interpret this in several ways; read the commentary alongside it.',
        reflection: 'Where might stillness exist inside your busiest moments?',
      },
      {
        id: 'k6', scriptureId: GITA, chapter: 5, verse: 10, expect: 'ब्रह्मण्याधाय',
        context: 'In chapter 5 Krishna returns to action offered with release from attachment.',
        explanation: 'One who acts, offering the action and giving up attachment, is not stained by it, as a lotus leaf is untouched by water.',
        reflection: 'What would it mean to stay unmarked by what you do?',
      },
    ],
    related: [
      { label: 'Concept: Karma', href: '/concepts/karma' },
      { label: 'Wisdom for Life: Duty and decision-making', href: '/wisdom-for-life/duty-and-decision-making' },
    ],
    sources: SOURCES,
  },
  {
    id: 'understanding-the-self',
    title: 'Understanding the Self',
    titleHi: 'आत्मा को समझें',
    objective: 'Read four verses from the Gita’s second chapter on the Self (Atman).',
    audience: 'Readers curious about what the Gita says about the self and change.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 's1', scriptureId: GITA, chapter: 2, verse: 13, expect: 'देहिनोऽस्मिन्',
        context: 'Krishna begins to answer Arjuna’s sorrow by speaking about who we are.',
        explanation: 'As a person passes through childhood, youth and age in this body, so the embodied self passes to another. The steady person is not shaken by it.',
        reflection: 'What in you has stayed the same while everything else changed?',
      },
      {
        id: 's2', scriptureId: GITA, chapter: 2, verse: 20, expect: 'न जायते म्रियते',
        context: 'The teaching on the Self deepens.',
        explanation: 'The Self is described as never born and never dying, not ended when the body is.',
        reflection: 'How does this view change what you hold on to?',
      },
      {
        id: 's3', scriptureId: GITA, chapter: 2, verse: 22, expect: 'वासांसि जीर्णानि',
        context: 'Krishna uses an image to make the teaching concrete.',
        explanation: 'As a person puts on new clothes and sets aside worn ones, so the embodied self takes up new bodies.',
        reflection: 'What image helps you think about change without fear?',
      },
      {
        id: 's4', scriptureId: GITA, chapter: 2, verse: 23, expect: 'नैनं छिन्दन्ति',
        context: 'The images continue.',
        explanation: 'Weapons do not cut the Self, fire does not burn it, water does not wet it. The verse speaks of what cannot be harmed.',
        reflection: 'What feels unharmed in you even on hard days?',
      },
    ],
    related: [
      { label: 'Concept: Atman', href: '/concepts/atman' },
      { label: 'Wisdom for Life: Self-knowledge', href: '/wisdom-for-life/self-knowledge' },
    ],
    sources: SOURCES,
  },
  {
    id: 'gita-in-18-lessons',
    title: 'Gita in 18 Lessons',
    titleHi: 'अठारह पाठों में गीता',
    objective: 'Read one verse from each of the Gita’s eighteen chapters, in order, to follow the shape of the whole teaching.',
    audience: 'New readers who want a map of the Gita before reading it in full.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'g1', scriptureId: GITA, chapter: 1, verse: 1, expect: 'धर्मक्षेत्रे',
        context: "The Gita opens inside the larger epic. A blind king asks his narrator what is happening on the battlefield.",
        explanation: "The question names the field a field of dharma, so the setting is moral as well as military. Everything that follows answers a human crisis that begins here.",
        reflection: "What is a situation in your own life that is practical and moral at the same time?",
      },
      {
        id: 'g2', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: "Arjuna has asked for guidance. Krishna now speaks about action.",
        explanation: "Your responsibility is the action itself. The verse does not reject goals or planning; it warns against being ruled by one outcome.",
        reflection: "Which of your efforts today could you do well whatever the result?",
        activity: "Give 15 minutes to the next useful step of one task.",
      },
      {
        id: 'g3', scriptureId: GITA, chapter: 3, verse: 35, expect: 'श्रेयान्स्वधर्मो',
        context: "Arjuna has asked why one should act at all, and whether another path might be easier.",
        explanation: "The verse says it is better to do one’s own duty imperfectly than another’s duty well. Traditions explain “one’s own duty” in different ways, so read the commentary alongside it.",
        reflection: "What does doing your own part, and not someone else’s, ask of you at the moment?",
      },
      {
        id: 'g4', scriptureId: GITA, chapter: 4, verse: 7, expect: 'यदा यदा हि धर्मस्य',
        context: "Krishna speaks about the source of this teaching and about his own presence in the world.",
        explanation: "The verse says that whenever dharma declines, he manifests. Many readers take this as the idea of a divine descent; others stress the assurance that moral order is renewed.",
        reflection: "Where have you seen order restored after a time of confusion?",
      },
      {
        id: 'g5', scriptureId: GITA, chapter: 5, verse: 18, expect: 'विद्याविनयसंपन्ने',
        context: "The chapter compares renouncing action with acting without attachment, and then describes the steady person’s view.",
        explanation: "The wise are said to look on a learned and humble person, a cow, an elephant, a dog and an outcaste with an equal eye. The verse is about the quality of one’s vision, not about erasing differences of role.",
        reflection: "Whom do you find it hardest to look at with an even mind?",
      },
      {
        id: 'g6', scriptureId: GITA, chapter: 6, verse: 17, expect: 'युक्ताहारविहारस्य',
        context: "In the chapter on meditation, Krishna speaks about the way of life that supports steadiness.",
        explanation: "Moderation in food, recreation, effort, sleep and waking is described as making yoga a remover of sorrow. The teaching is balance, not strictness.",
        reflection: "Which of your daily habits would feel steadier with a little more moderation?",
        activity: "Choose one habit to adjust gently this week.",
      },
      {
        id: 'g7', scriptureId: GITA, chapter: 7, verse: 7, expect: 'मत्तः परतरं नान्यत्',
        context: "Krishna begins to speak about his own nature and about knowledge combined with its realisation.",
        explanation: "The verse says there is nothing higher than him, and that all is strung on him like gems on a thread. It uses an image of one thread holding many different things together.",
        reflection: "What is something that holds the different parts of your life together?",
      },
      {
        id: 'g8', scriptureId: GITA, chapter: 8, verse: 7, expect: 'तस्मात्सर्वेषु कालेषु',
        context: "Arjuna has asked about what one should hold in mind, especially at the end of life.",
        explanation: "Remember at all times and still do the work in front of you. The verse joins steady remembrance with ordinary action instead of separating them.",
        reflection: "How can what matters most to you stay present while you do everyday tasks?",
      },
      {
        id: 'g9', scriptureId: GITA, chapter: 9, verse: 22, expect: 'अनन्याश्चिन्तयन्तो',
        context: "The ninth chapter is a teaching on devotion and trust.",
        explanation: "For those who think of him with undivided mind, he is said to bring what they lack and keep safe what they have. Commentators discuss what this promise means and for whom.",
        reflection: "Where in your life do you want trust and not control?",
      },
      {
        id: 'g10', scriptureId: GITA, chapter: 10, verse: 8, expect: 'अहं सर्वस्य प्रभवो',
        context: "Krishna describes how his presence shows in the world.",
        explanation: "The verse says everything arises from him, and that those who understand this worship with love. It states a view of the world as having one source.",
        reflection: "What changes in how you treat people if everything shares one source?",
      },
      {
        id: 'g11', scriptureId: GITA, chapter: 11, verse: 32, expect: 'कालोऽस्मि',
        context: "Arjuna has asked to see a vision of the whole, and he is frightened by what he sees.",
        explanation: "Krishna answers as Time, the force that brings all things to their end. The verse is spoken inside a vision, and readers interpret it in several ways, so it is best read in its full context.",
        reflection: "How do you respond to the passing of time?",
      },
      {
        id: 'g12', scriptureId: GITA, chapter: 12, verse: 13, expect: 'अद्वेष्टा सर्वभूतानां',
        context: "Arjuna asks who is dearer: those who worship with devotion, or those who follow the path of the unmanifest. Krishna then describes his devotees.",
        explanation: "The verse begins a description of a person without hatred toward any being: friendly, compassionate, free from possessiveness and ego. It describes character rather than ritual.",
        reflection: "Which of these qualities do you most want to grow?",
      },
      {
        id: 'g13', scriptureId: GITA, chapter: 13, verse: 29, expect: 'समं पश्यन्हि',
        context: "The thirteenth chapter distinguishes the field from its knower. In this library’s numbering the verse is 13.29; some editions number it 13.28.",
        explanation: "Seeing the same Lord present in all, a person does not harm himself by himself and reaches the highest state. The verse links insight to non-harm.",
        reflection: "How does seeing others as part of one whole change how you act?",
      },
      {
        id: 'g14', scriptureId: GITA, chapter: 14, verse: 5, expect: 'सत्त्वं रजस्तम',
        context: "Krishna describes the three qualities of nature.",
        explanation: "Sattva, rajas and tamas are presented as the qualities that bind the embodied self to the body. The verse names the framework used in the rest of the chapter.",
        reflection: "Which quality do you notice most in how you spend a typical day?",
      },
      {
        id: 'g15', scriptureId: GITA, chapter: 15, verse: 15, expect: 'सर्वस्य चाहं हृदि',
        context: "The fifteenth chapter uses the image of a tree to describe the world and what lies beyond it.",
        explanation: "He says he is seated in every heart, and that memory, knowledge and their loss come from him. It places the source of understanding within.",
        reflection: "When has an understanding arrived in you without being taught?",
      },
      {
        id: 'g16', scriptureId: GITA, chapter: 16, verse: 21, expect: 'त्रिविधं नरकस्येदं',
        context: "Krishna contrasts divine and demonic tendencies.",
        explanation: "The verse names desire, anger and greed as a threefold gate to ruin, and advises letting go of them. It is advice about patterns of the mind, not a verdict on people.",
        reflection: "Which of the three comes up most for you, and what usually sets it off?",
      },
      {
        id: 'g17', scriptureId: GITA, chapter: 17, verse: 15, expect: 'अनुद्वेगकरं वाक्यं',
        context: "The seventeenth chapter describes faith, food, sacrifice and austerity in their different forms.",
        explanation: "Speech that does not distress, that is truthful, pleasant and beneficial, is called austerity of speech. The test is what the words do to the listener.",
        reflection: "What is one conversation where gentler and truer speech was possible?",
        activity: "Notice your words in one conversation today.",
      },
      {
        id: 'g18', scriptureId: GITA, chapter: 18, verse: 66, expect: 'सर्वधर्मान्परित्यज्य',
        context: "The last chapter gathers the teaching and ends with Krishna’s closing instruction to Arjuna.",
        explanation: "The verse says to give up all dharmas and take refuge in him alone, and not to grieve. Traditions interpret “all dharmas” in different ways, and the commentaries differ, so it should be read with them.",
        reflection: "What would it mean for you to put down something you have been carrying?",
      },
    ],
    related: [
      { label: 'Bhagavad Gita learning path', href: '/learn/bhagavad-gita' },
      { label: 'Wisdom for Life: Duty and decision-making', href: '/wisdom-for-life/duty-and-decision-making' },
    ],
    sources: SOURCES,
  },
  {
    id: 'introduction-to-bhakti',
    title: 'Introduction to Bhakti',
    titleHi: 'भक्ति का परिचय',
    objective: 'Read five verses in which the Gita speaks about devotion, to see how it presents bhakti.',
    audience: 'Readers new to the idea of bhakti, as the Gita describes it. Other bhakti traditions are in the Bhakti learning path.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'b1', scriptureId: GITA, chapter: 9, verse: 26, expect: 'पत्रं पुष्पं फलं तोयं',
        context: "In the chapter on devotion, Krishna says what he looks for in an offering.",
        explanation: "A leaf, a flower, a fruit or water, offered with devotion, is accepted. The emphasis is on the spirit of the offering, not its size.",
        reflection: "What small thing could you offer with full attention today?",
      },
      {
        id: 'b2', scriptureId: GITA, chapter: 12, verse: 8, expect: 'मय्येव मन आधत्स्व',
        context: "Arjuna has asked which path is better. Krishna answers by describing the path of devotion first.",
        explanation: "He asks Arjuna to fix his mind and understanding on him. The verse describes devotion as a steady turning of attention.",
        reflection: "Where does your attention settle when it is free?",
      },
      {
        id: 'b3', scriptureId: GITA, chapter: 11, verse: 54, expect: 'भक्त्या त्वनन्यया',
        context: "After showing the vision of the whole, Krishna explains how it can be known.",
        explanation: "The verse says that by undivided devotion he can be known, seen and entered. Devotion is presented as a way of knowing as well as a feeling.",
        reflection: "How is loving something different from only knowing about it?",
      },
      {
        id: 'b4', scriptureId: GITA, chapter: 18, verse: 55, expect: 'भक्त्या मामभिजानाति',
        context: "In the closing chapter, Krishna sums up the path of devotion.",
        explanation: "By devotion one comes to know him in truth, and having known him, enters into him. The verse joins devotion and understanding.",
        reflection: "What do you understand better because you care about it?",
      },
      {
        id: 'b5', scriptureId: GITA, chapter: 9, verse: 34, expect: 'मन्मना भव मद्भक्तो',
        context: "Krishna ends the chapter on the royal knowledge with an invitation.",
        explanation: "Fix your mind on me, be devoted, worship, and bow. The verse gathers devotion into a few simple acts.",
        reflection: "Which one simple act could express what matters most to you?",
      },
    ],
    related: [
      { label: 'Bhakti traditions learning path', href: '/learn/bhakti-traditions' },
      { label: 'Wisdom for Life: Devotion', href: '/wisdom-for-life/devotion' },
    ],
    sources: SOURCES,
  },
  {
    id: 'gita-for-beginners',
    title: 'Bhagavad Gita for Beginners',
    titleHi: 'गीता: आरंभिक पाठ',
    objective: 'Read six short verses that introduce the Gita’s main ideas, in the order a first-time reader meets them.',
    audience: 'Someone opening the Gita for the first time.',
    minutesPerLesson: 6,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'n1', scriptureId: GITA, chapter: 2, verse: 7, expect: 'शिष्यस्तेऽहं',
        context: "Arjuna has put down his bow in grief. He turns to Krishna for help, and the teaching of the Gita begins here.",
        explanation: "Arjuna says he is confused about his duty and asks to be taught as a student. The teaching starts when he admits he does not know.",
        reflection: "When has saying “I am not sure” helped you learn?",
      },
      {
        id: 'n2', scriptureId: GITA, chapter: 2, verse: 13, expect: 'देहिनोऽस्मिन्',
        context: "Krishna answers the grief with a view of who we are.",
        explanation: "As a person passes through childhood, youth and age, the embodied self passes to another body. The steady person is not shaken by it.",
        reflection: "What in you has stayed the same while everything else changed?",
      },
      {
        id: 'n3', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: "Krishna turns from knowledge to action.",
        explanation: "Your responsibility is the action itself. The verse does not reject goals or planning; it warns against being ruled by one outcome.",
        reflection: "Which of your efforts today could you do well whatever the result?",
        activity: "Give 15 minutes to the next useful step of one task.",
      },
      {
        id: 'n4', scriptureId: GITA, chapter: 3, verse: 19, expect: 'तस्मादसक्तः सततं',
        context: "In chapter 3, Arjuna asks why he should act at all if knowledge is higher.",
        explanation: "Do what has to be done without attachment. The verse presents action done in this way as a path in itself.",
        reflection: "What would change if you did one task today without needing credit for it?",
      },
      {
        id: 'n5', scriptureId: GITA, chapter: 6, verse: 5, expect: 'उद्धरेदात्मनाऽऽत्मानं',
        context: "In the chapter on meditation, Krishna speaks about the mind as both helper and obstacle.",
        explanation: "One’s own mind can lift a person up or pull them down, so steadiness begins with how one relates to it.",
        reflection: "In what ways has your own mind been a friend to you this week?",
      },
      {
        id: 'n6', scriptureId: GITA, chapter: 12, verse: 13, expect: 'अद्वेष्टा सर्वभूतानां',
        context: "Krishna describes the qualities of a person he calls dear.",
        explanation: "The verse begins a description of someone without hatred, friendly and compassionate, free from possessiveness and ego. It describes character rather than ritual.",
        reflection: "Which of these qualities do you most want to grow?",
      },
    ],
    related: [
      { label: 'Gita in 18 Lessons', href: '/journeys/gita-in-18-lessons' },
      { label: 'Bhagavad Gita learning path', href: '/learn/bhagavad-gita' },
    ],
    sources: SOURCES,
  },
  {
    id: 'wisdom-for-students',
    title: 'Wisdom for Students',
    titleHi: 'विद्यार्थियों के लिए',
    objective: 'Read five verses from the Gita about learning, steadiness and effort.',
    audience: 'Students, and anyone learning something new.',
    minutesPerLesson: 6,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 's1', scriptureId: GITA, chapter: 4, verse: 34, expect: 'तद्विद्धि प्रणिपातेन',
        context: "Krishna speaks about knowledge and how it is gained.",
        explanation: "The verse advises learning by humble respect, by asking questions and by serving the teacher. It describes a manner of learning, not a method of study.",
        reflection: "Whom could you ask a real question this week?",
        activity: "Write down one question you have been holding back.",
      },
      {
        id: 's2', scriptureId: GITA, chapter: 4, verse: 38, expect: 'न हि ज्ञानेन सदृशं',
        context: "The same chapter continues to praise knowledge.",
        explanation: "Nothing here is said to purify like knowledge, and one finds it in oneself in time. The verse links understanding with patience.",
        reflection: "What is something you understand now that once confused you?",
      },
      {
        id: 's3', scriptureId: GITA, chapter: 6, verse: 17, expect: 'युक्ताहारविहारस्य',
        context: "In the chapter on meditation, Krishna speaks about the way of life that supports steadiness.",
        explanation: "Moderation in food, recreation, effort, sleep and waking is described as making yoga a remover of sorrow. The teaching is balance, not strictness.",
        reflection: "Which of your study habits would feel steadier with a little more moderation?",
        activity: "Adjust one habit, such as sleep or breaks, for a week.",
      },
      {
        id: 's4', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: "Krishna defines the balance he asks for in a single line.",
        explanation: "Evenness toward success and failure is called yoga here. It suggests working well and receiving results calmly.",
        reflection: "How do you feel after a result that did not match your effort?",
      },
      {
        id: 's5', scriptureId: GITA, chapter: 6, verse: 35, expect: 'अभ्यासेन तु कौन्तेय',
        context: "Arjuna says the mind is hard to hold. Krishna agrees and names two supports.",
        explanation: "Steady practice and a loosening of grasping make it possible to steady the mind over time. The teaching is patient repetition.",
        reflection: "Which small practice could you repeat daily, even for a few minutes?",
      },
    ],
    related: [
      { label: 'Wisdom for Life: Concentration', href: '/wisdom-for-life/concentration' },
      { label: 'Wisdom for Life: Discipline', href: '/wisdom-for-life/discipline' },
    ],
    sources: SOURCES,
  },
  {
    id: 'introduction-to-the-upanishads',
    title: 'Introduction to the Upanishads',
    titleHi: 'उपनिषद् परिचय',
    objective: 'Read five well-known verses from the Isha, Katha, Mundaka and Brihadaranyaka Upanishads.',
    audience: 'Readers new to the Upanishads. Chapter and verse numbers follow this library’s edition and may differ from other editions.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'u1', scriptureId: 'ishavasya', chapter: 1, verse: 1, expect: 'ईशा वास्यमिदं',
        context: "The Isha Upanishad opens with this verse, which names its theme.",
        explanation: "Everything that moves in the world is said to be pervaded by the Lord. The verse goes on to advise enjoying through renunciation and not coveting what belongs to another.",
        reflection: "What would you treat differently if you saw it as pervaded by something greater?",
      },
      {
        id: 'u2', scriptureId: 'katha', chapter: 2, verse: 2, expect: 'श्रेयश्च प्रेयश्च',
        context: "Nachiketa has been offered every pleasure by Yama, the lord of death, and has asked instead for knowledge of the Self. Yama explains the choice.",
        explanation: "The good and the pleasant come to a person together, and the wise tell them apart and choose. The verse sets out a choice that returns in many forms.",
        reflection: "Where do you feel a gap between what is pleasant and what is good?",
      },
      {
        id: 'u3', scriptureId: 'katha', chapter: 3, verse: 14, expect: 'उत्तिष्ठत जाग्रत',
        context: "The chapter has described the self as a rider, the body as a chariot and the mind as the reins.",
        explanation: "The verse calls the reader to rise and awake, and says the path is as hard to walk as the edge of a razor. It encourages effort and does not promise ease.",
        reflection: "What is one thing you have been putting off that you could begin?",
      },
      {
        id: 'u4', scriptureId: 'mundaka', chapter: 5, verse: 6, expect: 'सत्यमेव जयते',
        context: "The Mundaka Upanishad distinguishes the higher knowledge from the lower. This verse comes in the section on truth.",
        explanation: "Truth alone prevails, not falsehood. The verse says the way that leads to the highest is spread out by truth.",
        reflection: "Where is telling the truth hardest for you, and why?",
      },
      {
        id: 'u5', scriptureId: 'brihadaranyaka', chapter: 3, verse: 28, expect: 'असतो मा सद्गमय',
        context: "A short prayer in the Brihadaranyaka Upanishad, still recited today.",
        explanation: "It asks to be led from the unreal to the real, from darkness to light, and from death to immortality. The three lines are read as one request in three forms.",
        reflection: "Which of the three requests feels closest to what you need now?",
      },
    ],
    related: [
      { label: 'Upanishads learning path', href: '/learn/upanishads' },
      { label: 'Concept: Atman', href: '/concepts/atman' },
    ],
    sources: SOURCES,
  },
];

export const getJourney = (id: string) => READING_JOURNEYS.find((j) => j.id === id);
