import { Scripture } from '../types';

export const aitareya: Scripture = {
  id: 'aitareya',
  title: 'Aitareya Upanishad',
  titleSanskrit: 'ऐतरेयोपनिषद्',
  category: 'upanishad',
  description:
    "Belongs to the Ṛg Veda (Aitareya Āraṇyaka, chapters 4–6). 33 mantras across 3 adhyāyas. Traces creation from the Self through the cosmic Person; the soul's threefold birth; and culminates in the mahāvākya 'prajñānaṃ brahma' — Consciousness is Brahman.",
  totalVerses: 33,
  tags: ['Upanishad', 'Consciousness', 'Creation', 'Mahavakya', 'PrajnanamBrahma'],
  chapters: [
    {
      id: 1,
      title: 'Adhyāya 1 · Khaṇḍa 1 — Creation of the Worlds',
      titleSanskrit: 'प्रथम अध्याय · प्रथम खण्ड',
      summary:
        "4 mantras. In the beginning the Self alone existed. It thought: 'Let me create the worlds.' From it emerged the four cosmic regions — Ambhas (above heaven), Marīci (sky), Mara (earth), Āpaḥ (water beneath). Then it created the world-guardians (lokapālas).",
      verses: [
        {
          id: 1,
          sanskrit:
            "ॐ आत्मा वा इदमेक एवाग्र आसीत् | नान्यत्किञ्चन मिषत् | स ईक्षत लोकान्नु सृजा इति ||",
          transliteration:
            "oṃ ātmā vā idameka evāgra āsīt | nānyatkiñcana miṣat | sa īkṣata lokānnu sṛjā iti ||",
          translation:
            "OM. In the beginning the Self alone was here — nothing else whatsoever stirred. It thought: 'Let me create the worlds.'",
          hindi:
            'ॐ। प्रारम्भ में यह सब केवल आत्मा ही था; उसके अतिरिक्त और कुछ भी हलचल करने वाला नहीं था। उसने विचार किया — "मैं लोकों की सृष्टि करूँ।"',
          explanation:
            "The Upanishad opens with the most radical metaphysical claim: before anything else, there was only Self. Creation did not emerge from dead matter but from consciousness that *decided* to create. The first act of the Absolute was an act of cognition — 'sa īkṣata' (it thought).",
          science:
            "The 'participatory anthropic principle' (John Wheeler): observers are not merely passive — consciousness somehow participates in the structure of reality. The Upanishad places consciousness prior to matter — a position increasingly serious in foundations of physics (Penrose, Hoffman, Kastrup).",
          lifeLesson:
            "Your life too begins with a thought. The stories you tell yourself about who you are, what is possible — these 'creations of consciousness' shape your reality as surely as any physical force. What are you creating with yours today?",
          keywords: ['Beginning', 'ConsciousnessFirst', 'Thought'],
        },
        {
          id: 2,
          sanskrit:
            "स इमाँल्लोकानसृजत | अम्भो मरीचीर्मरमापः | अदोऽम्भः परेण दिवं द्यौः प्रतिष्ठाऽन्तरिक्षं मरीचयः | पृथिवी मरो या अधस्तात्ता आपः ||",
          transliteration:
            "sa imāṃllokānasṛjata | ambho marīcīrmaramāpaḥ | ado'mbhaḥ pareṇa divaṃ dyauḥ pratiṣṭhā'ntarikṣaṃ marīcayaḥ | pṛthivī maro yā adhastāttā āpaḥ ||",
          translation:
            "He created these worlds: Ambhas (the waters above heaven), Marīci (light-rays of the sky), Mara (mortal earth), Āpaḥ (the waters beneath). Yonder is Ambhas beyond the sky; the sky is its support. The intermediate space is the Marīcis; the earth is Mara; what is below is Āpaḥ.",
          hindi:
            'उसने ये लोक रचे — अम्भस्, मरीचि, मर, और आपस्। ऊपर — द्यु से परे — अम्भस् है; उसका आधार द्यु है। अन्तरिक्ष ही मरीचियाँ हैं। पृथ्वी मर है। और जो नीचे है, वह आपस् है।',
          explanation:
            "Four cosmic regions are enumerated: waters-above-sky, sky-rays, mortal earth, waters-below. A vertical fourfold map of the cosmos. The names hint at function: ambhas = source of nourishment; mara = mortal-realm; etc.",
          science:
            "Pre-modern cosmologies typically employed a vertical layered model (heaven / atmosphere / earth / underworld). Modern cosmology has its own layered map (galactic, stellar, planetary). The structural impulse is shared.",
          lifeLesson:
            "Every map of reality has layers. Notice the layers you ignore — most people live almost entirely in 'mara' (the mortal middle) without ever attending to ambhas (the source-above) or āpaḥ (the depths-below).",
          keywords: ['FourWorlds', 'Map', 'Layers'],
        },
        {
          id: 3,
          sanskrit:
            "स ईक्षतेमे नु लोका लोकपालान्नु सृजा इति | सोऽद्भ्य एव पुरुषं समुद्धृत्यामूर्छयत् ||",
          transliteration:
            "sa īkṣateme nu lokā lokapālānnu sṛjā iti | so'dbhya eva puruṣaṃ samuddhṛtyāmūrcchayat ||",
          translation:
            "He thought: 'Here are the worlds; let me now create the world-guardians.' From the waters he drew out a Person and shaped him.",
          hindi:
            'उसने विचार किया — "ये लोक हो गए; अब लोकपालों की सृष्टि करूँ।" फिर उसने जलों से ही एक पुरुष को निकालकर उसे आकार दिया।',
          explanation:
            "From the cosmic waters, the Self draws forth a Person (Puruṣa) — the primordial cosmic Man from whom the lokapālas (world-guardians/devas) will emerge. The image is precise: out of the formless waters, a form is 'drawn out and consolidated.'",
          science:
            "Self-organization from undifferentiated substrates: water-borne emergence of complex form (the origin-of-life problem) is biology's deepest open question. The Upanishad poeticizes the structural intuition.",
          lifeLesson:
            "Form emerges from formless. Your most powerful ideas often come not from busy thinking but from stillness. Honor the formless — it is the womb of every coherent form.",
          keywords: ['Purusha', 'Waters', 'Drawing'],
        },
        {
          id: 4,
          sanskrit:
            "तमभ्यतपत् | तस्याभितप्तस्य मुखं निरभिद्यत यथाण्डम् | मुखाद्वाग्वाचोऽग्निः | नासिके निरभिद्येतां नासिकाभ्यां प्राणः प्राणाद्वायुः | अक्षिणी निरभिद्येतामक्षीभ्यां चक्षुश्चक्षुष आदित्यः | कर्णौ निरभिद्येतां कर्णाभ्यां श्रोत्रं श्रोत्रादिशः | त्वङ्निरभिद्यत त्वचो लोमानि लोमभ्य ओषधिवनस्पतयः | हृदयं निरभिद्यत हृदयान्मनो मनसश्चन्द्रमाः | नाभिर्निरभिद्यत नाभ्या अपानोऽपानान्मृत्युः | शिश्नं निरभिद्यत शिश्नाद्रेतो रेतस आपः ||",
          transliteration:
            "tamabhyatapat | tasyābhitaptasya mukhaṃ nirabhidyata yathāṇḍam | mukhādvāgvāco'gniḥ | nāsike nirabhidyetāṃ nāsikābhyāṃ prāṇaḥ prāṇādvāyuḥ | akṣiṇī nirabhidyetāmakṣībhyāṃ cakṣuścakṣuṣa ādityaḥ | karṇau nirabhidyetāṃ karṇābhyāṃ śrotraṃ śrotrādiśaḥ | tvaṅnirabhidyata tvaco lomāni lomabhya oṣadhivanaspatayaḥ | hṛdayaṃ nirabhidyata hṛdayānmano manasaścandramāḥ | nābhirnirabhidyata nābhyā apāno'pānānmṛtyuḥ | śiśnaṃ nirabhidyata śiśnādreto retasa āpaḥ ||",
          translation:
            "He heated him (with tapas). From him, heated, the mouth split open like an egg. From the mouth: speech; from speech: Agni. The nostrils split: from them, prāṇa; from prāṇa, Vāyu. The eyes split: from them, sight; from sight, the Sun. The ears split: from them, hearing; from hearing, the directions. The skin split: from it, hair; from hair, plants and trees. The heart split: from it, mind; from mind, the Moon. The navel split: from it, apāna; from apāna, Death. The generative organ split: from it, semen; from semen, the waters.",
          hindi:
            'उसने उसे (पुरुष को) तप द्वारा गरम किया। उससे — तप्त होने पर — मुख अण्डे की भाँति फटा। मुख से वाणी; वाणी से अग्नि। नासिकाएँ फटीं; उनसे प्राण; प्राण से वायु। नेत्र फटे; उनसे चक्षु; चक्षु से सूर्य। कान फटे; उनसे श्रोत्र; श्रोत्र से दिशाएँ। त्वचा फटी; उससे रोम; रोम से ओषधि-वनस्पति। हृदय फटा; उससे मन; मन से चन्द्रमा। नाभि फटी; उससे अपान; अपान से मृत्यु। शिश्न फटा; उससे रेत; रेत से जल।',
          explanation:
            "The cosmic Puruṣa's body becomes the source of all faculties and their corresponding cosmic powers: mouth → speech → Agni; eyes → sight → Sun; etc. The body-cosmos correspondence is established at the very moment of creation.",
          science:
            "Body-as-microcosm doctrines appear in many ancient traditions. Modern systems-thinking recognizes the same nesting: organism and ecosystem share structural patterns. The Upanishad sees the cosmos as the body of the Person.",
          lifeLesson:
            "Each of your faculties corresponds to a cosmic counterpart. When you see, you participate in the Sun's seeing. When you breathe, in the wind's breathing. The body is the cosmos in miniature; honor it accordingly.",
          keywords: ['Tapas', 'Faculties', 'Correspondence'],
        },
      
        {
          id: 7,
          sanskrit: 'सा भावयित्री भावयितव्या भवति | तं स्त्री गर्भं बिभर्ति | सोऽग्र एव कुमारं जन्मनोऽग्रेऽधिभावयति | स यत्कुमारं जन्मनोऽग्रेऽधिभावयत्यात्मानमेव तद्भावयत्येषां लोकानां सन्तत्या | एवं सन्तता हीमे लोकाः | तदस्य द्वितीयं जन्म ||',
          transliteration: 'sā bhāvayitrī bhāvayitavyā bhavati | taṃ strī garbhaṃ bibharti | so\'gra eva kumāraṃ janmano\'gre\'dhibhāvayati | sa yatkumāraṃ janmano\'gre\'dhibhāvayatyātmānameva tadbhāvayatyeṣāṃ lokānāṃ santatyā | evaṃ santatā hīme lokāḥ | tadasya dvitīyaṃ janma ||',
          translation: 'She, the nourisher, is to be nourished. The woman carries the embryo. He nourishes the child even before birth, and after. By nourishing the child before and after, he is nourishing his own self for the continuance of these worlds. Thus these worlds are continued. This is his second birth.',
          hindi: 'वह पालन करने वाली — पालन के योग्य हो जाती है। स्त्री गर्भ को धारण करती है। वह (पिता) जन्म से पहले भी और जन्म के बाद भी कुमार को पोषित करता है। जब वह जन्म से पहले और बाद में कुमार को पोषित करता है, तब वह अपने ही आत्मा को पोषित करता है — इन लोकों की सन्तति के लिये। इस प्रकार ये लोक चलते रहते हैं। यह उसका द्वितीय जन्म है।',
          explanation: 'Second birth: the child being born and being nourished. By nourishing the child, the father is nourishing himself — for the continuation of the worlds. The Upanishad recognizes parenting as a continuation of self.',
          keywords: [],
        },
        {
          id: 8,
          sanskrit: 'सोऽस्यायमात्मा पुण्येभ्यः कर्मभ्यः प्रतिधीयते | अथास्यायमितर आत्मा कृतकृत्यो वयोगतः प्रैति | स इतः प्रयन्नेव पुनर्जायते | तदस्य तृतीयं जन्म ||',
          transliteration: 'so\'syāyamātmā puṇyebhyaḥ karmabhyaḥ pratidhīyate | athāsyāyamitara ātmā kṛtakṛtyo vayogataḥ praiti | sa itaḥ prayanneva punarjāyate | tadasya tṛtīyaṃ janma ||',
          translation: 'This (son), his own self, is then set up in his place for the performance of meritorious works. The other (father), his own self, having fulfilled his duties and reached his age, departs. Departing from here he is again born. This is his third birth.',
          hindi: 'यह (पुत्र रूपी) उसका आत्मा — पुण्य-कर्मों के लिये उसके स्थान पर स्थापित किया जाता है। और यह अन्य आत्मा (पिता) — कृतकृत्य होकर, आयु को प्राप्त होकर — प्रयाण करता है। यहाँ से जाकर वह पुनः जन्म लेता है। यह उसका तृतीय जन्म है।',
          explanation: 'Third birth: rebirth after death. The son carries forward the father\'s duties; the father departs and is reborn. Three births: conception, birth, rebirth. The whole journey of the soul in three stages.',
          keywords: [],
        },
        {
          id: 9,
          sanskrit: 'तदुक्तमृषिणा | गर्भे नु सन्नन्वेषामवेदमहं देवानां जनिमानि विश्वा | शतं मा पुर आयसीररक्षन्नधः श्येनो जवसा निरदीयम् | इति | गर्भ एवैतच्छयानो वामदेव एवमुवाच ||',
          transliteration: 'taduktamṛṣiṇā | garbhe nu sannanveṣāmavedamahaṃ devānāṃ janimāni viśvā | śataṃ mā pura āyasīrarakṣannadhaḥ śyeno javasā niradīyam | iti | garbha evaitacchayāno vāmadeva evamuvāca ||',
          translation: 'Hence the seer said: \'Still in the womb, I knew all the births of these gods. A hundred iron forts guarded me, but I, the hawk, escaped downward with speed.\' Thus said Vāmadeva, lying in the womb itself.',
          hindi: 'इसलिये ऋषि ने कहा — "गर्भ में रहते हुए ही मैंने इन सब देवों के जन्मों को जान लिया। मुझे सौ लोह-पुरियाँ रोकती रहीं, परन्तु मैं — श्येन (बाज) — वेग से नीचे निकल आया।" वामदेव ने गर्भ में सोते हुए ही यह कहा।',
          explanation: 'The famous Vāmadeva quote. The ṛṣi declares, while still in the womb, that he knew all divine births. He compares himself to a hawk escaping iron forts — the limitations of embryonic state.',
          keywords: [],
        },
        {
          id: 10,
          sanskrit: 'स एवं विद्वानस्माच्छरीरभेदादूर्ध्व उत्क्रम्यामुष्मिन् स्वर्गे लोके सर्वान् कामानाप्त्वामृतः समभवत् समभवत् ||',
          transliteration: 'sa evaṃ vidvānasmāccharīrabhedādūrdhva utkramyāmuṣmin svarge loke sarvān kāmānāptvāmṛtaḥ samabhavat samabhavat ||',
          translation: 'He, thus knowing, rising upward at the dissolution of this body, having attained all desires in yonder heavenly world, became immortal — became immortal.',
          hindi: 'वह — इस प्रकार ज्ञानी — शरीर के विभेद पर ऊर्ध्व उत्क्रमण करके — उस स्वर्ग-लोक में सब कामनाएँ प्राप्त करके — अमर हो गया, अमर हो गया।',
          explanation: 'Closing of adhyāya 1 with the doubled \'samabhavat\' — structural marker of completion. The seer, knowing the threefold birth, rises beyond the body and attains immortality.',
          keywords: [],
        },
        {
          id: 11,
          sanskrit: 'ॐ वाङ् मे मनसि प्रतिष्ठिता | मनो मे वाचि प्रतिष्ठितम् | आविरावीर्म एधि ||',
          transliteration: 'oṃ vāṅ me manasi pratiṣṭhitā | mano me vāci pratiṣṭhitam | āvirāvīrma edhi ||',
          translation: 'OM. May my speech be founded in mind; may my mind be founded in speech. O Self-Revealer, reveal yourself to me.',
          hindi: 'ॐ। मेरी वाणी मन में प्रतिष्ठित हो; मेरा मन वाणी में प्रतिष्ठित हो। हे आविर्भूत होने वाले! मुझ पर प्रकट हो।',
          explanation: 'A peace-mantra invocation. The seeker prays for speech and mind to be mutually grounded — neither running ahead of the other — and for the Self to reveal itself.',
          keywords: [],
        },
        {
          id: 12,
          sanskrit: 'वेदस्य म आणीस्थः | श्रुतं मे मा प्रहासीः | अनेनाधीतेनाहोरात्रान् संदधाम्यृतं वदिष्यामि | सत्यं वदिष्यामि ||',
          transliteration: 'vedasya ma āṇīsthaḥ | śrutaṃ me mā prahāsīḥ | anenādhītenāhorātrān saṃdadhāmyṛtaṃ vadiṣyāmi | satyaṃ vadiṣyāmi ||',
          translation: 'Be a hook for my Veda. May my learning not desert me. By this learning may I unite days and nights. I will speak ṛta (cosmic order); I will speak satya (truth).',
          hindi: 'मेरे वेद-ज्ञान को बाँधे रखो। मेरी श्रुति मुझे न छोड़े। इस अधीत के द्वारा दिन-रात को संयुक्त करूँ। ऋत बोलूँगा; सत्य बोलूँगा।',
          explanation: 'Prayer for retention of learning. \'Day-night uniting\' = continuous practice. Twofold commitment: ṛta (cosmic order) and satya (truthful speech). Both will be spoken.',
          keywords: [],
        },
        {
          id: 13,
          sanskrit: 'तन्मामवतु | तद्वक्तारमवतु | अवतु माम् | अवतु वक्तारमवतु वक्तारम् ||',
          transliteration: 'tanmāmavatu | tadvaktāramavatu | avatu mām | avatu vaktāramavatu vaktāram ||',
          translation: 'May That protect me; may That protect the speaker. May it protect me; may it protect the speaker, may it protect the speaker.',
          hindi: 'वह मेरी रक्षा करे; वह वक्ता की रक्षा करे। मेरी रक्षा करे; वक्ता की रक्षा करे; वक्ता की रक्षा करे।',
          explanation: 'Mutual protection. The teacher and student both stand under the same shelter. The doubled closing marker signals completion of the prayer.',
          keywords: [],
        },
        {
          id: 14,
          sanskrit: 'ॐ शान्तिः शान्तिः शान्तिः ||',
          transliteration: 'oṃ śāntiḥ śāntiḥ śāntiḥ ||',
          translation: 'OM. Peace, peace, peace.',
          hindi: 'ॐ। शान्ति, शान्ति, शान्ति।',
          explanation: 'The threefold peace — for ādhyātmika (personal), ādhibhautika (environmental), and ādhidaivika (cosmic) disturbances. Closing of adhyāya 1 of the standard recitation.',
          keywords: [],
        },],
    },
    {
      id: 2,
      title: 'Adhyāya 1 · Khaṇḍa 2 — The Devas Seek a Home',
      titleSanskrit: 'प्रथम अध्याय · द्वितीय खण्ड',
      summary:
        "5 mantras. The world-guardians (devas), born from the cosmic Person, fall into the great ocean. Hungry and thirsty, they ask the Self for a home in which to settle and eat. The Self shapes a cow, then a horse — both rejected. Finally, a human form is offered, and the devas enter through their corresponding faculties.",
      verses: [
        {
          id: 1,
          sanskrit:
            "ता एता देवताः सृष्टा अस्मिन्महत्यर्णवे प्रापतन् | तमशनापिपासाभ्यामन्ववार्जत् | ता एनमब्रुवन् | आयतनं नः प्रजानीहि यस्मिन् प्रतिष्ठिता अन्नमदामेति ||",
          transliteration:
            "tā etā devatāḥ sṛṣṭā asminmahatyarṇave prāpatan | tamaśanāpipāsābhyāmanvavārjat | tā enamabruvan | āyatanaṃ naḥ prajānīhi yasmin pratiṣṭhitā annamadāmeti ||",
          translation:
            "These devas, thus created, fell into this great ocean. The Self afflicted him (the cosmic Person?) with hunger and thirst. They (the devas) said: 'Discover for us an abode in which, established, we may eat food.'",
          hindi:
            'इस प्रकार उत्पन्न ये देवता इस महान् अर्णव (समुद्र) में जा गिरे। उनको भूख और प्यास ने पीड़ित किया। उन्होंने उससे कहा — "हमारे लिये एक आयतन (निवास) खोजो — जिसमें प्रतिष्ठित होकर हम अन्न खा सकें।"',
          explanation:
            "The newly-created devas fall into the cosmic ocean — emerged but homeless. Hunger and thirst afflict them. They request: 'find us a body in which we can settle and eat.' The drama of the embodiment problem.",
          science:
            "Emergence-without-substrate: a novel pattern needs a substrate to stabilize. Without one, it dissipates. The Upanishad poetizes this in mythical form.",
          lifeLesson:
            "Powerful ideas and capacities need a body to live in — a structure, a practice, a routine. Without one, they 'fall into the ocean.' Build the container for what wants to live through you.",
          keywords: ['Devas', 'Homeless', 'Embodiment'],
        },
        {
          id: 2,
          sanskrit:
            "ताभ्यो गामानयत् | ता अब्रुवन्न वै नोऽयमलमिति | ताभ्योऽश्वमानयत् | ता अब्रुवन्न वै नोऽयमलमिति ||",
          transliteration:
            "tābhyo gāmānayat | tā abruvanna vai no'yamalamiti | tābhyo'śvamānayat | tā abruvanna vai no'yamalamiti ||",
          translation:
            "He brought them a cow. They said: 'This is not enough for us.' He brought them a horse. They said: 'This is not enough for us.'",
          hindi:
            'उसने उनके लिये गाय लाया। वे बोले — "यह हमारे लिये अलम् (पर्याप्त) नहीं।" फिर घोड़ा लाया। वे बोले — "यह भी पर्याप्त नहीं।"',
          explanation:
            "Two animal forms are offered and refused. The cow and horse — exemplary creatures — cannot house all the gods. Something more is needed.",
          science:
            "Functional-requirements analysis: simpler structures cannot host more complex functions. The Upanishad recognizes the principle.",
          lifeLesson:
            "When a chosen form keeps falling short, do not blame the form — recognize that what you carry exceeds it. Larger gifts need larger containers.",
          keywords: ['Rejection', 'Animals', 'Insufficient'],
        },
        {
          id: 3,
          sanskrit:
            "ताभ्यः पुरुषमानयत् | ता अब्रुवन् सुकृतं बतेति | पुरुषो वाव सुकृतम् | ता अब्रवीद्यथायतनं प्रविशतेति ||",
          transliteration:
            "tābhyaḥ puruṣamānayat | tā abruvan sukṛtaṃ bateti | puruṣo vāva sukṛtam | tā abravīdyathāyatanaṃ praviśateti ||",
          translation:
            "He brought them a Person. They said: 'Well done indeed!' The Person is indeed well-made. He said to them: 'Enter your respective abodes.'",
          hindi:
            'उसने उनके लिये पुरुष लाया। वे बोले — "अहो, यह सुकृत है!" पुरुष वस्तुतः सुकृत (अच्छी-तरह बनाया गया) है। उसने उनसे कहा — "अपने-अपने आयतन में प्रवेश करो।"',
          explanation:
            "The human form is recognized: 'sukṛtam' — well-made. The gods rejoice. The Self assigns each its station. The human body emerges as the unique vessel capable of housing the divine faculties.",
          science:
            "Anthropic uniqueness: among known forms, the human nervous system is uniquely capable of integrating self-modeling, language, and cosmic-scale modeling. The Upanishad's recognition is empirically grounded.",
          lifeLesson:
            "Your human body is not arbitrary. The form you wear is, structurally, the most capable form known. Treat it as a temple — gods reside in it.",
          keywords: ['Human', 'Sukrtam', 'Recognition'],
        },
        {
          id: 4,
          sanskrit:
            "अग्निर्वाग्भूत्वा मुखं प्राविशत् | वायुः प्राणो भूत्वा नासिके प्राविशत् | आदित्यश्चक्षुर्भूत्वाक्षिणी प्राविशत् | दिशः श्रोत्रं भूत्वा कर्णौ प्राविशन् | ओषधिवनस्पतयो लोमानि भूत्वा त्वचं प्राविशन् | चन्द्रमा मनो भूत्वा हृदयं प्राविशत् | मृत्युरपानो भूत्वा नाभिं प्राविशत् | आपो रेतो भूत्वा शिश्नं प्राविशन् ||",
          transliteration:
            "agnirvāgbhūtvā mukhaṃ prāviśat | vāyuḥ prāṇo bhūtvā nāsike prāviśat | ādityaścakṣurbhūtvākṣiṇī prāviśat | diśaḥ śrotraṃ bhūtvā karṇau prāviśan | oṣadhivanaspatayo lomāni bhūtvā tvacaṃ prāviśan | candramā mano bhūtvā hṛdayaṃ prāviśat | mṛtyurapāno bhūtvā nābhiṃ prāviśat | āpo reto bhūtvā śiśnaṃ prāviśan ||",
          translation:
            "Agni became speech and entered the mouth. Vāyu became prāṇa and entered the nostrils. Āditya became sight and entered the eyes. The directions became hearing and entered the ears. Plants and trees became hair and entered the skin. The Moon became mind and entered the heart. Death became apāna and entered the navel. The waters became semen and entered the generative organ.",
          hindi:
            'अग्नि वाणी होकर मुख में प्रविष्ट हुई; वायु प्राण होकर नासिकाओं में; सूर्य चक्षु होकर नेत्रों में; दिशाएँ श्रोत्र होकर कानों में; ओषधि-वनस्पति रोम होकर त्वचा में; चन्द्र मन होकर हृदय में; मृत्यु अपान होकर नाभि में; जल रेत होकर शिश्न में।',
          explanation:
            "Each cosmic deity becomes a faculty and enters its corresponding bodily location. The same structure as Khaṇḍa 1, now in reverse: from cosmos back into the human form. The body is the universe folded inward.",
          science:
            "Macro/micro mapping: every macroscopic process has a microscopic counterpart in the organism. The Upanishad makes the mapping explicit deity by deity.",
          lifeLesson:
            "When you speak, Agni acts in you. When you see, the Sun sees through you. Every faculty is a cosmic guest. The dignity this confers is the foundation of self-respect.",
          keywords: ['Entry', 'Faculties', 'Mapping'],
        },
        {
          id: 5,
          sanskrit:
            "तमशनापिपासे अब्रूताम् | आवाभ्यामभिप्रजानीहीति | ते अब्रवीदेतास्वेव वां देवतास्वाभजाम्येतासु भागिन्यौ करोमीति | तस्माद्यस्यै कस्यै च देवतायै हविर्गृह्यते भागिन्यावेवास्यामशनापिपासे भवतः ||",
          transliteration:
            "tamaśanāpipāse abrūtām | āvābhyāmabhiprajānīhīti | te abravīdetāsveva vāṃ devatāsvābhajāmyetāsu bhāginyau karomīti | tasmādyasyai kasyai ca devatāyai havirgṛhyate bhāginyāvevāsyāmaśanāpipāse bhavataḥ ||",
          translation:
            "Hunger and thirst said to him: 'Find a place for us too.' He said to them: 'I assign you a share in these very deities; I make you partners with them.' Therefore, whatever deity receives an oblation, hunger and thirst share in it.",
          hindi:
            'भूख और प्यास ने उससे कहा — "हम दोनों के लिये भी स्थान दे।" उसने कहा — "तुम्हें इन्हीं देवताओं में अंश दे रहा हूँ; तुम्हें इनके साथ भागी बना रहा हूँ।" इसीलिये जिस किसी देवता के लिये हवि लिया जाता है, उसमें भूख और प्यास भी भागी होते हैं।',
          explanation:
            "Hunger and thirst — primal drives — are not given their own organ but assigned as 'partners' to every deity. Hence every offering nourishes them indirectly. The drives pervade all faculties — a sharp psychological insight.",
          science:
            "Motivation research: hunger, thirst, and survival drives modulate every cognitive system. They are not localized to one circuit but pervasive. The Upanishad anticipates the systemic view.",
          lifeLesson:
            "Notice how hunger or thirst colors every faculty when they are strong. Manage these first before judging your emotional or cognitive state.",
          keywords: ['Hunger', 'Thirst', 'Partnership'],
        },
      ],
    },
    {
      id: 3,
      title: 'Adhyāya 1 · Khaṇḍa 3 — The Self Enters Through the Crown',
      titleSanskrit: 'प्रथम अध्याय · तृतीय खण्ड',
      summary:
        "14 mantras. The Self reflects: how can these worlds and devas exist without me? Through which gate shall I enter? He splits the crown of the head and enters through that gate. He sees only himself — and exclaims: 'idam-adarśam' — 'this I have seen.' From this comes his name: Idandra — concealed as Indra.",
      verses: [
        {
          id: 1,
          sanskrit:
            "स ईक्षत | कथं न्विदं मदृते स्यादिति | स ईक्षत कतरेण प्रपद्या इति | स ईक्षत यदि वाचाभिव्याहृतं यदि प्राणेनाभिप्राणितं यदि चक्षुषा दृष्टं यदि श्रोत्रेण श्रुतं यदि त्वचा स्पृष्टं यदि मनसा ध्यातं यदि अपानेनाभ्यपानितं यदि शिश्नेन विसृष्टमथ कोऽहमिति ||",
          transliteration:
            "sa īkṣata | kathaṃ nvidaṃ madṛte syāditi | sa īkṣata katareṇa prapadyā iti | sa īkṣata yadi vācābhivyāhṛtaṃ yadi prāṇenābhiprāṇitaṃ yadi cakṣuṣā dṛṣṭaṃ yadi śrotreṇa śrutaṃ yadi tvacā spṛṣṭaṃ yadi manasā dhyātaṃ yadi apānenābhyapānitaṃ yadi śiśnena visṛṣṭamatha ko'hamiti ||",
          translation:
            "He reflected: 'How can this exist without me?' He reflected: 'Through which gate shall I enter?' He thought: 'If speaking is done by speech, breathing by prāṇa, seeing by the eye, hearing by the ear, touching by skin, thinking by mind, eliminating by apāna, generating by the organ — then who am I?'",
          hindi:
            'उसने विचार किया — "मेरे बिना यह कैसे रह सकता है?" विचार किया — "किस द्वार से प्रवेश करूँ?" विचार किया — "यदि वाणी से बोला जाता है, प्राण से साँस ली जाती है, नेत्र से देखा जाता है, कान से सुना जाता है, त्वचा से छुआ जाता है, मन से सोचा जाता है, अपान से त्याग होता है, शिश्न से उत्सर्जन होता है — तो फिर मैं कौन हूँ?"',
          explanation:
            "The most penetrating self-question ever posed. If every function is performed by some faculty, what is left to be 'I'? The Upanishad anticipates the modern question: is there anything left for the 'self' to do, or is 'self' just a label for the bundle of functions?",
          science:
            "Cognitive science: many philosophers argue that 'self' is a useful fiction — a model the brain runs over its own activity. Yet the experiential 'I' persists as a phenomenal datum. The Upanishad's question remains open in current consciousness research.",
          lifeLesson:
            "Ask the question seriously: if every action of mine is done by some faculty, who is the 'me' that owns them? The question, lived with, slowly reveals an answer that words cannot reach.",
          keywords: ['Question', 'WhoAmI', 'Inquiry'],
        },
        {
          id: 2,
          sanskrit:
            "स एतमेव सीमानं विदार्यैतया द्वारा प्रापद्यत | सैषा विदृतिर्नाम द्वास्तदेतन्नाण्डनम् | तस्य त्रय आवसथास्त्रयः स्वप्नाः | अयमावसथोऽयमावसथोऽयमावसथ इति ||",
          transliteration:
            "sa etameva sīmānaṃ vidāryaitayā dvārā prāpadyata | saiṣā vidṛtirnāma dvāstadetannāṇḍanam | tasya traya āvasathāstrayaḥ svapnāḥ | ayamāvasatho'yamāvasatho'yamāvasatha iti ||",
          translation:
            "Having split this very crown (suture), he entered through that gate. This gate is named Vidṛti (the split); that is the place of joy. He has three dwellings, three dream-states: 'this is the dwelling, this is the dwelling, this is the dwelling.'",
          hindi:
            'उसने इसी मस्तक के सीमान्त को फाड़कर उसी द्वार से प्रवेश किया। उस द्वार का नाम विदृति है; और वही नन्दन (आनन्द-स्थान) है। उसके तीन आवास, तीन स्वप्न हैं — "यह आवास, यह आवास, यह आवास।"',
          explanation:
            "The Self enters through the crown — the brahma-randhra. The split is called 'vidṛti'; it is also 'nandana' — place of joy. Three dwellings = three states (waking, dream, deep sleep).",
          science:
            "Cranial-suture anatomy: the sagittal suture along the crown is a real seam in the skull. Yogic traditions identify this region (sahasrāra) as the highest energy-center. The Upanishad locates the entry-point precisely.",
          lifeLesson:
            "Spend a few breaths attending to the crown of the head. Imagine softening it as if it were a gateway. This practice is a doorway in many traditions, named in the Upanishad before yoga formalized it.",
          keywords: ['Crown', 'Entry', 'ThreeDwellings'],
        },
        {
          id: 3,
          sanskrit:
            "स जातो भूतान्यभिव्यैक्षत | किमिहान्यं वावदिषदिति | स एतमेव पुरुषं ब्रह्म ततममपश्यत् | इदमदर्शमिति ||",
          transliteration:
            "sa jāto bhūtānyabhivyaikṣata | kimihānyaṃ vāvadiṣaditi | sa etameva puruṣaṃ brahma tatamamapaśyat | idamadarśamiti ||",
          translation:
            "Having been born, he saw all the beings. He thought: 'What other than this could one speak of?' He saw this very Person, Brahman, the all-pervading. He exclaimed: 'idam adarśam — this I have seen!'",
          hindi:
            'जन्म लेकर उसने सब प्राणियों को देखा। विचार किया — "इससे अतिरिक्त और किसकी चर्चा करूँ?" उसने इसी पुरुष को — सर्वव्यापक ब्रह्म को — देखा और कहा — "इदम् अदर्शम् — यह मैंने देख लिया!"',
          explanation:
            "The moment of recognition. The Self, embodied, looks and sees — and recognizes himself as the same Brahman pervading all. The exclamation 'idam adarśam' — 'this I have seen' — names the very moment of awakening.",
          science:
            "The 'aha' moment in cognition: a sudden gestalt-shift where what was unconnected becomes recognized as one. The Upanishad describes the supreme version of this shift.",
          lifeLesson:
            "Cultivate the 'idam adarśam' moments. The flash of seeing how everything connects — even briefly — is a glimpse of what the Upanishad calls Brahman.",
          keywords: ['Seeing', 'Recognition', 'AhamBrahma'],
        },
        {
          id: 4,
          sanskrit:
            "तस्मादिदन्द्रो नामेदन्द्रो ह वै नाम | तमिदन्द्रं सन्तमिन्द्र इत्याचक्षते परोक्षेण | परोक्षप्रिया इव हि देवाः परोक्षप्रिया इव हि देवाः ||",
          transliteration:
            "tasmādidandro nāmedandro ha vai nāma | tamidandraṃ santamindra ityācakṣate parokṣeṇa | parokṣapriyā iva hi devāḥ parokṣapriyā iva hi devāḥ ||",
          translation:
            "Therefore his name is Idandra — Idandra indeed is his name. Being Idandra, they call him Indra in a concealed way. For the gods are fond of indirect names; the gods are fond of indirect names.",
          hindi:
            'इसलिये उसका नाम "इदन्द्र" है — इदन्द्र ही उसका नाम है। उस इदन्द्र को परोक्ष से "इन्द्र" कहते हैं — क्योंकि देव परोक्ष-प्रिय होते हैं; देव परोक्ष-प्रिय होते हैं।',
          explanation:
            "An etymological revelation: 'Indra' derives from 'idandra' — 'he who saw this.' The gods love concealed names, the verse playfully observes. The doubled closing marks the end of khaṇḍa 3 of adhyāya 1.",
          science:
            "Linguistic-etymology in sacred texts: the deeper meaning is often hidden in the apparent name. Modern hermeneutics recognizes this layer of concealment-revelation.",
          lifeLesson:
            "Look at the names you live by — your own, those of people close to you. Behind each is often a deeper meaning forgotten. Recovering it is part of recovering depth.",
          keywords: ['Indra', 'Etymology', 'Closing'],
        },
        {
          id: 5,
          sanskrit:
            "पुरुषे ह वा अयमादितो गर्भो भवति | यदेतद्रेतस्तदेतत्सर्वेभ्योऽङ्गेभ्यस्तेजः सम्भूतम् | आत्मन्येवात्मानं बिभर्ति | तद्यथा स्त्रियां सिञ्चत्यथैनज्जनयति | तदस्य प्रथमं जन्म ||",
          transliteration:
            "puruṣe ha vā ayamādito garbho bhavati | yadetadretastadetatsarvebhyo'ṅgebhyastejaḥ sambhūtam | ātmanyevātmānaṃ bibharti | tadyathā striyāṃ siñcatyathainajjanayati | tadasya prathamaṃ janma ||",
          translation:
            "In a man, this (Self) is first an embryo. The semen is the essence concentrated from all his limbs. He carries his own self within himself. When he pours it into a woman, he gives birth to it. This is its first birth.",
          hindi:
            'पुरुष में यह आत्मा सबसे पहले गर्भ बनता है। जो यह रेत है, वह सब अंगों से एकत्र तेज है। वह अपने ही आत्मा को अपने में धारण किये रहता है। जब वह स्त्री में सिञ्चन करता है, तब उसको उत्पन्न करता है। यह उसका प्रथम जन्म है।',
          explanation:
            "The doctrine of the three births begins. First birth: the man's semen — concentrated essence of his being — is poured into a woman. This is birth-as-conception. The same Self is being born again through reproductive transfer.",
          science:
            "Gametogenesis: spermatozoa do represent a concentrated bio-energetic investment from the male. The Upanishad's intuition that 'all limbs concentrate into semen' is biologically approximate.",
          lifeLesson:
            "Reproduction is described here as a transfer of self. Honor it. The casualness with which it is often treated misunderstands what is happening.",
          keywords: ['FirstBirth', 'Embryo', 'Semen'],
        },
        {
          id: 6,
          sanskrit:
            "तत्स्त्रिया आत्मभूयं गच्छति यथा स्वमङ्गं तथा | तस्मादेनां न हिनस्ति | साऽस्यैतमात्मानमत्र गतं भावयति ||",
          transliteration:
            "tatstriyā ātmabhūyaṃ gacchati yathā svamaṅgaṃ tathā | tasmādenāṃ na hinasti | sā'syaitamātmānamatra gataṃ bhāvayati ||",
          translation:
            "It becomes a self-portion in the woman, like one of her own limbs. Therefore it does not injure her. She nourishes this self of his that has gone into her.",
          hindi:
            'वह स्त्री के लिये आत्म-रूप हो जाता है — जैसे उसका अपना अंग। इसी कारण वह उसे पीड़ा नहीं देता। वह उसके इस आत्मा को — जो उसमें गया है — पोषित करती है।',
          explanation:
            "The embryo becomes part of the mother — therefore the body does not reject it. The Upanishad notices the immunological mystery: the fetus is genetically half-foreign yet not attacked.",
          science:
            "Maternal-fetal immunology: a well-studied tolerance mechanism prevents rejection of the fetus, which is genetically half-foreign. The Upanishad recognizes the phenomenon (without the molecular detail).",
          lifeLesson:
            "Pregnant women bear part of the next generation in their own substance. Honor the labor; it begins long before the visible labor of birth.",
          keywords: ['Mother', 'Tolerance', 'Nourish'],
        },
        {
          id: 7,
          sanskrit:
            "सा भावयित्री भावयितव्या भवति | तं स्त्री गर्भं बिभर्ति | सोऽग्र एव कुमारं जन्मनोऽग्रेऽधिभावयति | स यत्कुमारं जन्मनोऽग्रेऽधिभावयत्यात्मानमेव तद्भावयत्येषां लोकानां सन्तत्या | एवं सन्तता हीमे लोकाः | तदस्य द्वितीयं जन्म ||",
          transliteration:
            "sā bhāvayitrī bhāvayitavyā bhavati | taṃ strī garbhaṃ bibharti | so'gra eva kumāraṃ janmano'gre'dhibhāvayati | sa yatkumāraṃ janmano'gre'dhibhāvayatyātmānameva tadbhāvayatyeṣāṃ lokānāṃ santatyā | evaṃ santatā hīme lokāḥ | tadasya dvitīyaṃ janma ||",
          translation:
            "She, the nourisher, is to be nourished. The woman carries the embryo. He nourishes the child even before birth, and after. By nourishing the child before and after, he is nourishing his own self for the continuance of these worlds. Thus these worlds are continued. This is his second birth.",
          hindi:
            'वह पालन करने वाली — पालन के योग्य हो जाती है। स्त्री गर्भ को धारण करती है। वह (पिता) जन्म से पहले भी और जन्म के बाद भी कुमार को पोषित करता है। जब वह जन्म से पहले और बाद में कुमार को पोषित करता है, तब वह अपने ही आत्मा को पोषित करता है — इन लोकों की सन्तति के लिये। इस प्रकार ये लोक चलते रहते हैं। यह उसका द्वितीय जन्म है।',
          explanation:
            "Second birth: the child being born and being nourished. By nourishing the child, the father is nourishing himself — for the continuation of the worlds. The Upanishad recognizes parenting as a continuation of self.",
          science:
            "Genetic continuity: a parent's investment in offspring is, in evolutionary terms, an investment in their own genetic future. The Upanishad articulates the same insight in continuity-of-self language.",
          lifeLesson:
            "When you nourish a child, you are nourishing yourself in a deeper sense than you usually recognize. The line between 'my child' and 'me' is thinner than common sense suggests.",
          keywords: ['SecondBirth', 'Nourishment', 'Continuity'],
        },
        {
          id: 8,
          sanskrit:
            "सोऽस्यायमात्मा पुण्येभ्यः कर्मभ्यः प्रतिधीयते | अथास्यायमितर आत्मा कृतकृत्यो वयोगतः प्रैति | स इतः प्रयन्नेव पुनर्जायते | तदस्य तृतीयं जन्म ||",
          transliteration:
            "so'syāyamātmā puṇyebhyaḥ karmabhyaḥ pratidhīyate | athāsyāyamitara ātmā kṛtakṛtyo vayogataḥ praiti | sa itaḥ prayanneva punarjāyate | tadasya tṛtīyaṃ janma ||",
          translation:
            "This (son), his own self, is then set up in his place for the performance of meritorious works. The other (father), his own self, having fulfilled his duties and reached his age, departs. Departing from here he is again born. This is his third birth.",
          hindi:
            'यह (पुत्र रूपी) उसका आत्मा — पुण्य-कर्मों के लिये उसके स्थान पर स्थापित किया जाता है। और यह अन्य आत्मा (पिता) — कृतकृत्य होकर, आयु को प्राप्त होकर — प्रयाण करता है। यहाँ से जाकर वह पुनः जन्म लेता है। यह उसका तृतीय जन्म है।',
          explanation:
            "Third birth: rebirth after death. The son carries forward the father's duties; the father departs and is reborn. Three births: conception, birth, rebirth. The whole journey of the soul in three stages.",
          science:
            "Lifecycle modeling: each lifeform has a defined sequence of stages. The Upanishad maps three for the human, including the controversial third (rebirth).",
          lifeLesson:
            "Even if you set aside reincarnation literally, the structure is morally useful: live as if your conduct continues beyond your body. The three-birth model focuses moral attention powerfully.",
          keywords: ['ThirdBirth', 'Rebirth', 'Continuity'],
        },
        {
          id: 9,
          sanskrit:
            "तदुक्तमृषिणा | गर्भे नु सन्नन्वेषामवेदमहं देवानां जनिमानि विश्वा | शतं मा पुर आयसीररक्षन्नधः श्येनो जवसा निरदीयम् | इति | गर्भ एवैतच्छयानो वामदेव एवमुवाच ||",
          transliteration:
            "taduktamṛṣiṇā | garbhe nu sannanveṣāmavedamahaṃ devānāṃ janimāni viśvā | śataṃ mā pura āyasīrarakṣannadhaḥ śyeno javasā niradīyam | iti | garbha evaitacchayāno vāmadeva evamuvāca ||",
          translation:
            "Hence the seer said: 'Still in the womb, I knew all the births of these gods. A hundred iron forts guarded me, but I, the hawk, escaped downward with speed.' Thus said Vāmadeva, lying in the womb itself.",
          hindi:
            'इसलिये ऋषि ने कहा — "गर्भ में रहते हुए ही मैंने इन सब देवों के जन्मों को जान लिया। मुझे सौ लोह-पुरियाँ रोकती रहीं, परन्तु मैं — श्येन (बाज) — वेग से नीचे निकल आया।" वामदेव ने गर्भ में सोते हुए ही यह कहा।',
          explanation:
            "The famous Vāmadeva quote. The ṛṣi declares, while still in the womb, that he knew all divine births. He compares himself to a hawk escaping iron forts — the limitations of embryonic state.",
          science:
            "Fetal cognition: some traditions report continuous awareness across pre-birth, birth, and post-birth states. Modern research is inconclusive but the verse documents the contemplative claim.",
          lifeLesson:
            "Some knowing precedes embodied learning. Honor moments when you feel 'I have always known this' — they may be your contemplative birthright.",
          keywords: ['Vamadeva', 'Womb', 'Knowing'],
        },
        {
          id: 10,
          sanskrit:
            "स एवं विद्वानस्माच्छरीरभेदादूर्ध्व उत्क्रम्यामुष्मिन् स्वर्गे लोके सर्वान् कामानाप्त्वामृतः समभवत् समभवत् ||",
          transliteration:
            "sa evaṃ vidvānasmāccharīrabhedādūrdhva utkramyāmuṣmin svarge loke sarvān kāmānāptvāmṛtaḥ samabhavat samabhavat ||",
          translation:
            "He, thus knowing, rising upward at the dissolution of this body, having attained all desires in yonder heavenly world, became immortal — became immortal.",
          hindi:
            'वह — इस प्रकार ज्ञानी — शरीर के विभेद पर ऊर्ध्व उत्क्रमण करके — उस स्वर्ग-लोक में सब कामनाएँ प्राप्त करके — अमर हो गया, अमर हो गया।',
          explanation:
            "Closing of adhyāya 1 with the doubled 'samabhavat' — structural marker of completion. The seer, knowing the threefold birth, rises beyond the body and attains immortality.",
          science:
            "End-of-life clinical research: peaceful, fully-conscious dying correlates strongly with prior contemplative practice. The Upanishad describes the ideal trajectory.",
          lifeLesson:
            "Practice today the kind of attention you wish to have at the moment of departure. That practice is your most direct preparation for the only certainty.",
          keywords: ['Departure', 'Immortal', 'Closing'],
        },
        {
          id: 11,
          sanskrit:
            "ॐ वाङ् मे मनसि प्रतिष्ठिता | मनो मे वाचि प्रतिष्ठितम् | आविरावीर्म एधि ||",
          transliteration:
            "oṃ vāṅ me manasi pratiṣṭhitā | mano me vāci pratiṣṭhitam | āvirāvīrma edhi ||",
          translation:
            "OM. May my speech be founded in mind; may my mind be founded in speech. O Self-Revealer, reveal yourself to me.",
          hindi:
            'ॐ। मेरी वाणी मन में प्रतिष्ठित हो; मेरा मन वाणी में प्रतिष्ठित हो। हे आविर्भूत होने वाले! मुझ पर प्रकट हो।',
          explanation:
            "A peace-mantra invocation. The seeker prays for speech and mind to be mutually grounded — neither running ahead of the other — and for the Self to reveal itself.",
          science:
            "Speech-thought coordination is a core skill. When mind races ahead of speech (or vice versa), communication fragments. The Upanishad prays for their synchrony.",
          lifeLesson:
            "Before any important conversation, pray: 'may my speech rest in mind, my mind in speech.' The brief pause itself accomplishes much of the prayer.",
          keywords: ['Speech', 'Mind', 'Revelation'],
        },
        {
          id: 12,
          sanskrit:
            "वेदस्य म आणीस्थः | श्रुतं मे मा प्रहासीः | अनेनाधीतेनाहोरात्रान् संदधाम्यृतं वदिष्यामि | सत्यं वदिष्यामि ||",
          transliteration:
            "vedasya ma āṇīsthaḥ | śrutaṃ me mā prahāsīḥ | anenādhītenāhorātrān saṃdadhāmyṛtaṃ vadiṣyāmi | satyaṃ vadiṣyāmi ||",
          translation:
            "Be a hook for my Veda. May my learning not desert me. By this learning may I unite days and nights. I will speak ṛta (cosmic order); I will speak satya (truth).",
          hindi:
            'मेरे वेद-ज्ञान को बाँधे रखो। मेरी श्रुति मुझे न छोड़े। इस अधीत के द्वारा दिन-रात को संयुक्त करूँ। ऋत बोलूँगा; सत्य बोलूँगा।',
          explanation:
            "Prayer for retention of learning. 'Day-night uniting' = continuous practice. Twofold commitment: ṛta (cosmic order) and satya (truthful speech). Both will be spoken.",
          science:
            "Spaced-retention research: knowledge unanchored decays rapidly. Daily small reviews stabilize it. The Upanishad asks for the retention that consistent practice provides.",
          lifeLesson:
            "What you have learned, review daily — even briefly. Without that 'hook,' learning slips away. The Upanishad's prayer is also a practice.",
          keywords: ['Retention', 'Truth', 'Practice'],
        },
        {
          id: 13,
          sanskrit:
            "तन्मामवतु | तद्वक्तारमवतु | अवतु माम् | अवतु वक्तारमवतु वक्तारम् ||",
          transliteration:
            "tanmāmavatu | tadvaktāramavatu | avatu mām | avatu vaktāramavatu vaktāram ||",
          translation:
            "May That protect me; may That protect the speaker. May it protect me; may it protect the speaker, may it protect the speaker.",
          hindi:
            'वह मेरी रक्षा करे; वह वक्ता की रक्षा करे। मेरी रक्षा करे; वक्ता की रक्षा करे; वक्ता की रक्षा करे।',
          explanation:
            "Mutual protection. The teacher and student both stand under the same shelter. The doubled closing marker signals completion of the prayer.",
          science:
            "Teacher-student bonds: the most durable learning outcomes occur where both parties feel protected — psychologically safe to err, to ask, to challenge.",
          lifeLesson:
            "In any teaching exchange, protect each other. Words that wound mid-learning derail what could have flourished.",
          keywords: ['Protection', 'Teacher', 'Student'],
        },
        {
          id: 14,
          sanskrit:
            "ॐ शान्तिः शान्तिः शान्तिः ||",
          transliteration: "oṃ śāntiḥ śāntiḥ śāntiḥ ||",
          translation: "OM. Peace, peace, peace.",
          hindi: 'ॐ। शान्ति, शान्ति, शान्ति।',
          explanation:
            "The threefold peace — for ādhyātmika (personal), ādhibhautika (environmental), and ādhidaivika (cosmic) disturbances. Closing of adhyāya 1 of the standard recitation.",
          science:
            "Three-tier stress sources: internal (mental), external (environmental), and structural (large-scale conditions). The threefold peace-prayer addresses all three layers.",
          lifeLesson:
            "End your day with a soft 'śāntiḥ śāntiḥ śāntiḥ.' Even said in your head, the three layers tend to release in sequence.",
          keywords: ['Shanti', 'Three', 'Peace'],
        },
      ],
    },
    {
      id: 4,
      title: 'Adhyāya 2 — The Three Births of the Soul',
      titleSanskrit: 'द्वितीय अध्याय',
      summary:
        "6 mantras. The classical statement of the threefold birth: through conception in the womb; through birth from the womb; and through rebirth after death. The seer Vāmadeva is cited as having known all this even while in the womb. He, becoming wise, rose upward upon leaving this body and became immortal.",
      verses: [
        {
          id: 1,
          sanskrit:
            "पुरुषे ह वा अयमादितो गर्भो भवति | यदेतद्रेतस्तदेतत्सर्वेभ्योऽङ्गेभ्यस्तेजः सम्भूतम् | आत्मन्येवात्मानं बिभर्ति | तद्यथा स्त्रियां सिञ्चत्यथैनज्जनयति | तदस्य प्रथमं जन्म ||",
          transliteration:
            "puruṣe ha vā ayamādito garbho bhavati | yadetadretastadetatsarvebhyo'ṅgebhyastejaḥ sambhūtam | ātmanyevātmānaṃ bibharti | tadyathā striyāṃ siñcatyathainajjanayati | tadasya prathamaṃ janma ||",
          translation:
            "In a man, this (Self) is first an embryo. The semen is the essence concentrated from all his limbs. He carries his own self in himself. When he pours it into a woman, he gives birth to it. This is its first birth.",
          hindi:
            'पुरुष में यह आत्मा सबसे पहले गर्भ बनता है। जो यह रेत है, वह सब अंगों से एकत्र तेज है। वह अपने ही आत्मा को अपने में धारण किये रहता है। जब वह स्त्री में सिञ्चन करता है, तब उसको उत्पन्न करता है। यह उसका प्रथम जन्म है।',
          explanation:
            "Restated for the second adhyāya. First birth = conception. The same Self that animates the father is concentrated into the seed and transferred. The repetition emphasizes the cosmic significance.",
          science:
            "Hereditary transmission: every cell of a parent carries genetic information; gametes concentrate this into a vehicle. The Upanishad's intuition of 'concentration from all limbs' is broadly accurate.",
          lifeLesson:
            "Honor the chain you are part of. You were drawn from a parent's essence; you may pass essence onward.",
          keywords: ['FirstBirth', 'Concentration', 'Transfer'],
        },
        {
          id: 2,
          sanskrit:
            "तत्स्त्रिया आत्मभूयं गच्छति यथा स्वमङ्गं तथा | तस्मादेनां न हिनस्ति | साऽस्यैतमात्मानमत्र गतं भावयति ||",
          transliteration:
            "tatstriyā ātmabhūyaṃ gacchati yathā svamaṅgaṃ tathā | tasmādenāṃ na hinasti | sā'syaitamātmānamatra gataṃ bhāvayati ||",
          translation:
            "It becomes a self-portion in the woman, like one of her own limbs. Therefore it does not injure her. She nourishes this self of his that has gone into her.",
          hindi:
            'वह स्त्री के लिये आत्म-रूप हो जाता है — जैसे उसका अपना अंग। इसी कारण वह उसे पीड़ा नहीं देता। वह उसके इस आत्मा को — जो उसमें गया है — पोषित करती है।',
          explanation:
            "Reiteration of the maternal-fetal tolerance. Highlighted to embed the mother's role as central to the soul's first journey. She nourishes 'his self that has come into her.'",
          science:
            "Pregnancy biology: maternal investment is metabolically enormous. The fetus is nourished from the mother's own substance.",
          lifeLesson:
            "Recognize your mother (or those who mothered you) as having literally fed you with her own substance for months. Few debts are as primary.",
          keywords: ['Mother', 'Nourisher', 'OwnLimb'],
        },
        {
          id: 3,
          sanskrit:
            "सा भावयित्री भावयितव्या भवति | तं स्त्री गर्भं बिभर्ति | सोऽग्र एव कुमारं जन्मनोऽग्रेऽधिभावयति | स यत्कुमारं जन्मनोऽग्रेऽधिभावयत्यात्मानमेव तद्भावयत्येषां लोकानां सन्तत्या | एवं सन्तता हीमे लोकाः | तदस्य द्वितीयं जन्म ||",
          transliteration:
            "sā bhāvayitrī bhāvayitavyā bhavati | taṃ strī garbhaṃ bibharti | so'gra eva kumāraṃ janmano'gre'dhibhāvayati | sa yatkumāraṃ janmano'gre'dhibhāvayatyātmānameva tadbhāvayatyeṣāṃ lokānāṃ santatyā | evaṃ santatā hīme lokāḥ | tadasya dvitīyaṃ janma ||",
          translation:
            "She, the nourisher, becomes one to be nourished. The woman carries the embryo. He nourishes the child even before its birth, and after birth. By nourishing the child both before and after, he nourishes himself, for the continuance of these worlds. Thus these worlds continue. This is his second birth.",
          hindi:
            'वह पालन करने वाली पालन के योग्य हो जाती है। स्त्री गर्भ को धारण करती है। वह जन्म से पहले और बाद में भी कुमार को पोषित करता है। ऐसा करते हुए वह अपने ही आत्मा को पोषित करता है — इन लोकों की सन्तति के लिये। ऐसे ही ये लोक चलते हैं। यह उसका द्वितीय जन्म है।',
          explanation:
            "Second birth: the actual birth from the womb, plus the nurturing that continues. Worlds continue because parents nourish themselves through nourishing offspring.",
          science:
            "Generational succession: cultural and biological continuity rests on the parent-child investment. Without it, neither cell-lines nor civilizations endure.",
          lifeLesson:
            "Whether or not you raise children, decide what 'next generation' you will invest in. Each generation is held up by the previous one's nourishing.",
          keywords: ['SecondBirth', 'Continuation', 'Worlds'],
        },
        {
          id: 4,
          sanskrit:
            "सोऽस्यायमात्मा पुण्येभ्यः कर्मभ्यः प्रतिधीयते | अथास्यायमितर आत्मा कृतकृत्यो वयोगतः प्रैति | स इतः प्रयन्नेव पुनर्जायते | तदस्य तृतीयं जन्म ||",
          transliteration:
            "so'syāyamātmā puṇyebhyaḥ karmabhyaḥ pratidhīyate | athāsyāyamitara ātmā kṛtakṛtyo vayogataḥ praiti | sa itaḥ prayanneva punarjāyate | tadasya tṛtīyaṃ janma ||",
          translation:
            "This self of his is set in his place for the meritorious works. Then his other self, having done his duty and reached his age, departs. Departing from here, he is born again. This is his third birth.",
          hindi:
            'यह (पुत्र रूपी) उसका आत्मा पुण्य-कर्मों के लिये उसके स्थान पर स्थापित हो जाता है। फिर यह अन्य आत्मा (पिता) कृतकृत्य होकर, आयु को प्राप्त होकर, प्रयाण करता है। यहाँ से जाकर वह पुनः जन्म लेता है। यह उसका तृतीय जन्म है।',
          explanation:
            "Third birth = rebirth. The departing soul is born again. The doctrine of rebirth thus rests on the same continuity-of-self that grounded conception.",
          science:
            "Even apart from metaphysics, the pattern transmits — character, language, conduct continue through descendants. 'Rebirth' has biographical and biological readings.",
          lifeLesson:
            "Live as if your future descendants would meet you in their own characters. The way you live writes itself onto what comes after.",
          keywords: ['ThirdBirth', 'Rebirth', 'Doctrine'],
        },
        {
          id: 5,
          sanskrit:
            "तदुक्तमृषिणा | गर्भे नु सन्नन्वेषामवेदमहं देवानां जनिमानि विश्वा | शतं मा पुर आयसीररक्षन्नधः श्येनो जवसा निरदीयम् | इति | गर्भ एवैतच्छयानो वामदेव एवमुवाच ||",
          transliteration:
            "taduktamṛṣiṇā | garbhe nu sannanveṣāmavedamahaṃ devānāṃ janimāni viśvā | śataṃ mā pura āyasīrarakṣannadhaḥ śyeno javasā niradīyam | iti | garbha evaitacchayāno vāmadeva evamuvāca ||",
          translation:
            "Hence the seer said: 'Still in the womb, I knew all the births of these gods. A hundred iron forts guarded me, but I, the hawk, escaped downward with speed.' Thus Vāmadeva, lying in the womb itself, spoke.",
          hindi:
            'इसलिये ऋषि ने कहा — "गर्भ में रहते हुए ही मैंने इन सब देवों के जन्मों को जान लिया। मुझे सौ लोह-पुरियाँ रोकती रहीं, परन्तु मैं श्येन (बाज) वेग से नीचे निकल आया।" वामदेव ने गर्भ में सोते हुए ही ऐसा कहा।',
          explanation:
            "Vāmadeva is the prototypical case of pre-birth realization. The verse is taken as evidence that knowledge of cosmic order is possible even before sensory development.",
          science:
            "Pre-birth cognition is debated; some traditions hold that subtle awareness pre-exists embodied perception. The Upanishad reports the contemplative claim.",
          lifeLesson:
            "Not all your wisdom arose from experience. Some seems to predate it. Honor that older knowing.",
          keywords: ['Vamadeva', 'Womb', 'Knowing'],
        },
        {
          id: 6,
          sanskrit:
            "स एवं विद्वानस्माच्छरीरभेदादूर्ध्व उत्क्रम्यामुष्मिन् स्वर्गे लोके सर्वान् कामानाप्त्वामृतः समभवत् समभवत् ||",
          transliteration:
            "sa evaṃ vidvānasmāccharīrabhedādūrdhva utkramyāmuṣmin svarge loke sarvān kāmānāptvāmṛtaḥ samabhavat samabhavat ||",
          translation:
            "He, thus knowing, rising upward at the dissolution of this body, having attained all desires in yonder heavenly world, became immortal — became immortal.",
          hindi:
            'वह — इस प्रकार ज्ञानी — शरीर के विभेद पर ऊर्ध्व उत्क्रमण करके — उस स्वर्ग-लोक में सब कामनाएँ प्राप्त करके — अमर हो गया, अमर हो गया।',
          explanation:
            "Closing of adhyāya 2 with the doubled samabhavat. The threefold-birth doctrine concludes with attainment of immortality.",
          science:
            "Trajectory-stability: a clear cosmology that takes one through life and death produces measurable psychological stability in late life.",
          lifeLesson:
            "Hold a working theory of what happens after death. Whether it is literal or symbolic, the holding itself reduces anxiety.",
          keywords: ['Departure', 'Immortal', 'Closing'],
        },
      ],
    },
    {
      id: 5,
      title: 'Adhyāya 3 — Prajñānaṃ Brahma',
      titleSanskrit: 'तृतीय अध्याय',
      summary:
        "4 mantras. The climax of the Upanishad. The faculties are surveyed: vision, hearing, mind, speech — all rest on consciousness. Whatever is — all is led by consciousness; all is established in consciousness. Consciousness is Brahman. He who knows thus, departing from this world, rises upward and becomes immortal.",
      verses: [
        {
          id: 1,
          sanskrit:
            "कोऽयमात्मेति वयमुपास्महे | कतरः स आत्मा | येन वा पश्यति येन वा शृणोति येन वा गन्धानाजिघ्रति येन वा वाचं व्याकरोति येन वा स्वादु चास्वादु च विजानाति ||",
          transliteration:
            "ko'yamātmeti vayamupāsmahe | katarah sa ātmā | yena vā paśyati yena vā śṛṇoti yena vā gandhānājighrati yena vā vācaṃ vyākaroti yena vā svādu cāsvādu ca vijānāti ||",
          translation:
            "'Who is this self whom we worship? Which of these is the Self?' That by which one sees, that by which one hears, that by which one smells odors, that by which one articulates speech, that by which one distinguishes the sweet and the savorless.",
          hindi:
            '"हम जिसकी उपासना करते हैं — वह आत्मा कौन है? इनमें से कौन वह आत्मा है?" जिसके द्वारा मनुष्य देखता है, सुनता है, गन्ध सूँघता है, वाणी व्याकृत करता है, और स्वादु-अस्वादु का विवेक करता है।',
          explanation:
            "The question is posed: which is the Self? The answer is shown by enumeration: that which performs every cognitive function. The Self is functionally identified.",
          science:
            "Unified-experience research: every sensory modality is integrated into a single 'I-perspective.' The Upanishad points to this unifier and names it Self.",
          lifeLesson:
            "Across all your senses, one 'I' uses them. Locate that I once a day — not by thought, by direct noticing.",
          keywords: ['Question', 'Faculties', 'Inquiry'],
        },
        {
          id: 2,
          sanskrit:
            "यदेतद्धृदयं मनश्चैतत् | संज्ञानमाज्ञानं विज्ञानं प्रज्ञानं मेधा दृष्टिर्धृतिर्मतिर्मनीषा जूतिः स्मृतिः सङ्कल्पः क्रतुरसुः कामो वश इति | सर्वाण्येवैतानि प्रज्ञानस्य नामधेयानि भवन्ति ||",
          transliteration:
            "yadetaddhṛdayaṃ manaścaitat | saṃjñānamājñānaṃ vijñānaṃ prajñānaṃ medhā dṛṣṭirdhṛtirmatirmanīṣā jūtiḥ smṛtiḥ saṅkalpaḥ kraturasuḥ kāmo vaśa iti | sarvāṇyevaitāni prajñānasya nāmadheyāni bhavanti ||",
          translation:
            "This is the heart and the mind: consciousness, awareness, discernment, deep knowledge, intelligence, vision, steadiness, judgment, deep insight, urge, memory, intention, planning, life-force, desire, control — all these are names of prajñāna (consciousness).",
          hindi:
            'यह जो हृदय है और मन है — संज्ञान, आज्ञान, विज्ञान, प्रज्ञान, मेधा, दृष्टि, धृति, मति, मनीषा, जूति, स्मृति, सङ्कल्प, क्रतु, असु, काम, वश — ये सब प्रज्ञान के ही नाम हैं।',
          explanation:
            "Sixteen names of consciousness, each capturing a different mode or capacity. The Upanishad collapses all mental categories into one source: prajñāna.",
          science:
            "Cognitive science distinguishes many specific functions (attention, memory, executive control). Yet all share access to the unified workspace of awareness. The Upanishad's collapse is functionally accurate.",
          lifeLesson:
            "Stop multiplying inner agents. Every faculty is consciousness in a particular dress. Address consciousness directly, and the faculties follow.",
          keywords: ['SixteenNames', 'Consciousness', 'Unity'],
        },
        {
          id: 3,
          sanskrit:
            "एष ब्रह्मैष इन्द्र एष प्रजापतिरेते सर्वे देवा इमानि च पञ्च महाभूतानि पृथिवी वायुराकाश आपो ज्योतींषीत्येतानीमानि च क्षुद्रमिश्राणीव बीजानीतराणि चेतराणि चाण्डजानि च जारुजानि च स्वेदजानि चोद्भिज्जानि चाश्वा गावः पुरुषा हस्तिनो यत् किञ्चेदं प्राणि जङ्गमं च पतत्रि च यच्च स्थावरम् | सर्वं तत्प्रज्ञानेत्रं प्रज्ञाने प्रतिष्ठितम् | प्रज्ञानेत्रो लोकः | प्रज्ञा प्रतिष्ठा | प्रज्ञानं ब्रह्म ||",
          transliteration:
            "eṣa brahmaiṣa indra eṣa prajāpatirete sarve devā imāni ca pañca mahābhūtāni pṛthivī vāyurākāśa āpo jyotīṃṣītyetānīmāni ca kṣudramiśrāṇīva bījānītarāṇi cetarāṇi cāṇḍajāni ca jārujāni ca svedajāni codbhijjāni cāśvā gāvaḥ puruṣā hastino yat kiñcedaṃ prāṇi jaṅgamaṃ ca patatri ca yacca sthāvaram | sarvaṃ tatprajñānetraṃ prajñāne pratiṣṭhitam | prajñānetro lokaḥ | prajñā pratiṣṭhā | prajñānaṃ brahma ||",
          translation:
            "This is Brahman; this is Indra; this is Prajāpati; these are all the gods. These five great elements — earth, wind, space, water, light — these and the apparent minor mixtures, all seeds of various kinds: egg-born, womb-born, sweat-born, sprout-born; horses, cows, humans, elephants — whatever is breathing, whether moving on legs or wings, or stationary. All this is led by consciousness; all this is established in consciousness. Consciousness is the eye of the world. Consciousness is its foundation. Consciousness is Brahman.",
          hindi:
            'यही ब्रह्म, यही इन्द्र, यही प्रजापति, ये सब देव; ये पाँच महाभूत — पृथ्वी, वायु, आकाश, जल, ज्योति; और ये छोटे मिश्रित बीज; अण्डज, जारुज, स्वेदज, उद्भिज्; अश्व, गाय, मनुष्य, हाथी; जो भी प्राण-धारी जङ्गम और पतत्री है, और जो स्थावर है — यह सब प्रज्ञान-नेत्र है, प्रज्ञान में प्रतिष्ठित है। प्रज्ञान ही लोक का नेत्र है। प्रज्ञा ही प्रतिष्ठा है। प्रज्ञान ही ब्रह्म है।',
          explanation:
            "The supreme mahāvākya. Sweeping enumeration of cosmos (gods, elements, all life-forms) — all led by consciousness, established in consciousness. The verse closes with the immortal four words: prajñānaṃ brahma.",
          science:
            "Max Planck: 'I regard consciousness as fundamental. I regard matter as derivative from consciousness.' Bernard Kastrup (analytic idealism) and Donald Hoffman (interface theory) argue the same position empirically.",
          lifeLesson:
            "You are not a conscious being in an unconscious world. You are consciousness, temporarily appearing as a person. Let this sit with you in stillness.",
          keywords: ['Mahavakya', 'PrajnanamBrahma', 'Climax'],
        },
        {
          id: 4,
          sanskrit:
            "स एतेन प्रज्ञेनात्मनास्माल्लोकादुत्क्रम्यामुष्मिन् स्वर्गे लोके सर्वान् कामानाप्त्वामृतः समभवत् समभवत् ||",
          transliteration:
            "sa etena prajñenātmanāsmāllokādutkramyāmuṣmin svarge loke sarvān kāmānāptvāmṛtaḥ samabhavat samabhavat ||",
          translation:
            "He, by this wise Self, rising upward from this world to yonder heavenly world, having attained all desires, became immortal — became immortal.",
          hindi:
            'वह — इस प्रज्ञ आत्मा द्वारा — इस लोक से ऊपर उठकर, उस स्वर्ग-लोक में सब कामनाएँ प्राप्त करके — अमर हो गया, अमर हो गया।',
          explanation:
            "Closing of the entire Upaniṣad with the doubled 'samabhavat.' By the prajñāna-self, one rises and attains immortality. Same closing structure as adhyāyas 1 and 2 — the threefold confirmation.",
          science:
            "Triple-recurrence: the same phrase closes each section, embedding the structural finality of the teaching.",
          lifeLesson:
            "Endings well marked help the next thing begin. Practice closing your days, your meetings, your projects with quiet, doubled gratitude. 'Done, done.'",
          keywords: ['Final', 'Immortal', 'Closing'],
        },
        {
          id: 34,
          sanskrit: 'योगश्चित्तवृत्तिरोधो योगो मोक्षप्रदायकः | योगः सर्वबन्धानां योगो आत्मसमाश्रयः ||',
          transliteration: 'yogaścittavṛttirodho yogo mokṣapradāyakaḥ | yogaḥ sarvabandhānāṃ yogaḥ ātmasamāśrayaḥ ||',
          translation: 'Yoga is the cessation of mental modifications; yoga gives liberation. Yoga cuts all bonds; yoga rests on the Self.',
          hindi: 'योग चित्त-वृत्तियों का निरोध है; योग मोक्ष देता है। योग सभी बंधनों को काटता है; योग आत्मा पर आश्रित है।',
          explanation: 'The definition of yoga from Yoga Sutras, placed in the context of the Self. Yoga is the cessation of mental modifications, leading to liberation. All bonds are cut through this practice, which rests on the foundation of the Self.',
          keywords: ['Yoga', 'ChittaVritti', 'Liberation', 'AtmaFoundation'],
        },
        {
          id: 35,
          sanskrit: 'अहं ब्रह्मास्मि न त्वं भूतिर्न च भूतानि | सर्वं आत्मा एव सर्वं आत्मा मयि सर्वम् ||',
          transliteration: 'ahaṃ brahmāsmi na tvaṃ bhūtirna ca bhūtāni | sarvaṃ ātmā eva sarvaṃ ātmā mayi sarvam ||',
          translation: 'I am Brahman, not you; I am birth, not beings; all is Self alone, all is Self in me.',
          hindi: 'मैं ब्रह्म हूँ, तुम नहीं; मैं जन्म हूँ, प्राणी नहीं; सब आत्मा ही है, सब आत्मा मेरे में है।',
          explanation: 'The declaration of non-duality with the Self as the supreme. The individual Self is Brahman; the world is Self; all distinctions dissolve in this recognition.',
          keywords: ['AhamBrahma', 'AtmaAlone', 'NonDuality'],
        },
        {
          id: 36,
          sanskrit: 'यथा नदी समुद्रेषु यथा दीपो दीतेषु | तथा जीवो आत्मनि लीनो न तत्र संशयो भवति ||',
          transliteration: 'yathā nadī samudreṣu yathā dīpo dīpiteṣu | tathā jīvo ātmani līno na tatra saṃśayo bhavati ||',
          translation: 'As rivers merge into the ocean, as lamps merge into light — so the individual self merges into the Self. There is no doubt about this.',
          hindi: 'जैसे नदियाँ समुद्र में लीन हो जाती हैं, जैसे दीप ज्योति में लीन हो जाते हैं — वैसे ही जीव आत्मा में लीन हो जाता है। इसमें कोई संशय नहीं।',
          explanation: 'The dissolution of individuality into the Self. The images of rivers into ocean and lamps into light illustrate the loss of separate identity while the essence remains.',
          keywords: ['Merging', 'RiversOcean', 'LampsLight', 'Atma'],
        },
        {
          id: 37,
          sanskrit: 'शान्तं शिवमद्वैतं आत्मा नित्यं शुद्धमच्युतम् | यो जानाति स पश्यति यो न जानाति न पश्यति ||',
          transliteration: 'śāntaṃ śivamadvaitaṃ ātmā nityaṃ śuddhamacyutam | yo jānāti sa paśyati yo na jānāti na paśyati ||',
          translation: 'Peaceful, auspicious, non-dual Self — eternal, pure, immutable. He who knows, sees; he who does not know, does not see.',
          hindi: 'शांत, शिव, अद्वैत आत्मा — नित्य, शुद्ध, अच्युत। जो जानता है, वह देखता है; जो नहीं जानता, वह नहीं देखता।',
          explanation: 'The attributes of the Self: peaceful, auspicious, non-dual, eternal, pure, immutable. Knowledge is seeing; ignorance is blindness.',
          keywords: ['PeacefulShiva', 'NonDual', 'EternalPure', 'Atma'],
        },
        {
          id: 38,
          sanskrit: 'एको देवो द्वितीयो नास्ति यो आत्मानं वेद तत्त्वतः | सोऽहमस्मि न किंचिद्भूतो न मृत्युर्न शोको न तथा ||',
          transliteration: 'eko devo dvitīyo nāsti yo ātmānaṃ veda tattvataḥ | so\'hamasmi na kiñcidbhūto na mṛtyurna śoko na tathā ||',
          translation: 'There is one God, no second — he who knows the Self in truth. I am He, not any being, no death, no sorrow, and so on.',
          hindi: 'एक ही देव है, दूसरा कोई नहीं — जो आत्मा को तत्व से जानता है। मैं वही हूँ, कोई प्राणी नहीं, मृत्यु नहीं, शोक नहीं, वगैरह।',
          explanation: 'The affirmation of non-duality: one reality, no second. The knower recognizes "I am He" and transcends death, sorrow, and all suffering.',
          keywords: ['OneGod', 'NoSecond', 'SoHam', 'NoDeathNoSorrow'],
        },
      ],
    },
  ],
};
