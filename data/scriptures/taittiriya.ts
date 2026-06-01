import { Scripture } from "../types";

export const taittiriya: Scripture = {
  id: "taittiriya",
  title: "Taittiriya Upanishad",
  titleSanskrit: "तैत्तिरीयोपनिषद्",
  category: "upanishad",
  description:
    "Belongs to the Kṛṣṇa Yajur Veda. 31 anuvākas across 3 vallīs — Śīkṣā (phonetics-and-ethics), Brahmānanda (the five-sheath doctrine and bliss-calculation), and Bhṛgu (progressive inquiry into Brahman from food to bliss). Famous for satyaṃ-vada-dharmaṃ-cara and the pañca-kośa model.",
  totalVerses: 31,
  tags: ["Upanishad", "Koshas", "Ethics", "Ananda", "SatyamVada"],
  chapters: [
    {
      id: 1,
      title: "Śīkṣā Vallī — The Phonetics and Ethics Section",
      titleSanskrit: "शिक्षावल्ली",
      summary:
        "12 anuvākas. Opens with the peace invocation 'śaṃ no mitraḥ.' Teaches phonetics (śīkṣā), correlations of letters and meditations (sambhāva-upāsanā), the heart-space, OM as Brahman, the value of svādhyāya, and the famous graduation address: satyaṃ vada, dharmaṃ cara.",
      verses: [
        {
          id: 1,
          sanskrit:
            "ॐ शं नो मित्रः शं वरुणः | शं नो भवत्वर्यमा | शं न इन्द्रो बृहस्पतिः | शं नो विष्णुरुरुक्रमः | नमो ब्रह्मणे | नमस्ते वायो | त्वमेव प्रत्यक्षं ब्रह्मासि | त्वामेव प्रत्यक्षं ब्रह्म वदिष्यामि | ऋतं वदिष्यामि | सत्यं वदिष्यामि | तन्मामवतु | तद्वक्तारमवतु | अवतु माम् | अवतु वक्तारम् | ॐ शान्तिः शान्तिः शान्तिः ||",
          transliteration:
            "oṃ śaṃ no mitraḥ śaṃ varuṇaḥ | śaṃ no bhavatvaryamā | śaṃ na indro bṛhaspatiḥ | śaṃ no viṣṇururukramaḥ | namo brahmaṇe | namaste vāyo | tvameva pratyakṣaṃ brahmāsi | tvāmeva pratyakṣaṃ brahma vadiṣyāmi | ṛtaṃ vadiṣyāmi | satyaṃ vadiṣyāmi | tanmāmavatu | tadvaktāramavatu | avatu mām | avatu vaktāram | oṃ śāntiḥ śāntiḥ śāntiḥ ||",
          translation:
            "OM. May Mitra be propitious to us; may Varuṇa be propitious; may Aryaman be propitious; may Indra and Bṛhaspati be propitious; may the far-striding Viṣṇu be propitious. Salutation to Brahman. Salutation to thee, O Vāyu — thou alone art the visible Brahman. I declare thee alone to be the visible Brahman. I will speak ṛta. I will speak satya. May That protect me; may That protect the speaker. OM. Peace, peace, peace.",
          hindi:
            'ॐ। मित्र हमारे प्रति शान्त हों, वरुण शान्त हों, अर्यमा शान्त हों, इन्द्र और बृहस्पति शान्त हों, उरुक्रम विष्णु शान्त हों। ब्रह्म को नमस्कार। हे वायु, तुम्हें नमस्कार — तुम ही प्रत्यक्ष ब्रह्म हो। तुम्हीं को प्रत्यक्ष ब्रह्म कहूँगा। मैं ऋत बोलूँगा; सत्य बोलूँगा। वह मेरी रक्षा करे; वह वक्ता की रक्षा करे। ॐ शान्तिः शान्तिः शान्तिः।',
          explanation:
            "The opening peace-invocation. Six devas are called by name — each a face of the same Brahman. The student commits to speaking both ṛta (cosmic order) and satya (truth-in-speech). The closing threefold śāntiḥ asks peace from the three classes of disturbance.",
          science:
            "Pre-task invocations measurably improve focus and ethical commitment. Ritual openings function as cognitive primers, not mere ceremony.",
          lifeLesson:
            "Open important undertakings with an invocation — your own, simple words if you wish. The brief turning of attention itself shifts what follows.",
          keywords: ["PeaceInvocation", "Vayu", "Opening"],
        },
        {
          id: 2,
          sanskrit:
            "ॐ शीक्षां व्याख्यास्यामः | वर्णः स्वरः | मात्रा बलम् | साम सन्तानः | इत्युक्तः शीक्षाध्यायः ||",
          transliteration:
            "oṃ śīkṣāṃ vyākhyāsyāmaḥ | varṇaḥ svaraḥ | mātrā balam | sāma santānaḥ | ityuktaḥ śīkṣādhyāyaḥ ||",
          translation:
            "OM. We shall expound śīkṣā (phonetics). The letter, the accent, the quantity, the effort, the modulation, the connection — thus has been stated the chapter on śīkṣā.",
          hindi:
            'ॐ। हम शिक्षा (उच्चारण-विज्ञान) की व्याख्या करते हैं — वर्ण, स्वर, मात्रा, बल, साम (मधुरता), सन्तान (सम्बन्ध) — इस प्रकार शिक्षा-अध्याय कहा गया।',
          explanation:
            "The Upanishad takes phonetics seriously. Six elements of precise speech — letter, accent, length, force, modulation, continuity. Right speech is the foundation of all teaching.",
          science:
            "Articulatory phonetics today identifies essentially the same parameters: place, manner, voice, length, stress, prosody. The Upanishad's six map onto these closely.",
          lifeLesson:
            "Pronounce mantras carefully. The instrument shapes the effect. Sloppy speech is sloppy thought made audible.",
          keywords: ["Shiksha", "Phonetics", "Speech"],
        },
        {
          id: 3,
          sanskrit:
            "सह नौ यशः | सह नौ ब्रह्मवर्चसम् | अथातः सँहिताया उपनिषदं व्याख्यास्यामः | पञ्चस्वधिकरणेषु | अधिलोकमधिज्यौतिषमधिविद्यमधिप्रजमध्यात्मम् | ता महासँहिता इत्याचक्षते | अथाधिलोकम् | पृथिवी पूर्वरूपम् | द्यौरुत्तररूपम् | आकाशः सन्धिः | वायुः सन्धानम् | इत्यधिलोकम् ||",
          transliteration:
            "saha nau yaśaḥ | saha nau brahmavarcasam | athātaḥ saṃhitāyā upaniṣadaṃ vyākhyāsyāmaḥ | pañcasvadhikaraṇeṣu | adhilokamadhijyautiṣamadhividyamadhiprajamadhyātmam | tā mahāsaṃhitā ityācakṣate | athādhilokam | pṛthivī pūrvarūpam | dyaurutararūpam | ākāśaḥ sandhiḥ | vāyuḥ sandhānam | ityadhilokam ||",
          translation:
            "May glory be ours together; may brahma-radiance be ours together. Now we expound the Upaniṣad of saṃhitā (joined utterance) — across five fields: cosmic, luminary, learning, generative, and personal. These are called the great saṃhitās. Of the cosmic: earth is the prior form; sky the latter; space the meeting; wind the joiner.",
          hindi:
            'हमारी कीर्ति साथ हो; हमारा ब्रह्म-तेज साथ हो। अब हम संहिता (समायोजन) का उपनिषद् पाँच क्षेत्रों में बताते हैं — अधिलोक, अधिज्यौतिष, अधिविद्य, अधिप्रज, अध्यात्म — ये "महासंहिता" कहलाते हैं। अधिलोक — पृथ्वी पूर्व-रूप, द्यु उत्तर-रूप, आकाश सन्धि, वायु सन्धान।',
          explanation:
            "Saṃhitā-upaniṣad: the doctrine of joining. Five fields, each with prior/latter/meeting/joiner. The first: cosmic — earth/sky meeting in ākāśa joined by wind. The principle: every duality is held together by an intermediate and a joiner.",
          science:
            "Systems thinking recognizes that polarities are usually held in dynamic balance by intermediating processes. The Upanishad codifies the principle.",
          lifeLesson:
            "When you face dualities, look for the meeting space and the joiner. Conflict resolution is usually a matter of recovering these two.",
          keywords: ["Samhita", "Joining", "Five"],
        },
        {
          id: 4,
          sanskrit:
            "यश्छन्दसामृषभो विश्वरूपः | छन्दोभ्योऽध्यमृतात्सम्बभूव | स मेन्द्रो मेधया स्पृणोतु | अमृतस्य देव धारणो भूयासम् | शरीरं मे विचर्षणम् | जिह्वा मे मधुमत्तमा | कर्णाभ्यां भूरि विश्रुवम् | ब्रह्मणः कोशोऽसि मेधया पिहितः | श्रुतं मे गोपाय |",
          transliteration:
            "yaścchandasāmṛṣabho viśvarūpaḥ | chandobhyo'dhyamṛtātsambabhūva | sa mendro medhayā spṛṇotu | amṛtasya deva dhāraṇo bhūyāsam | śarīraṃ me vicarṣaṇam | jihvā me madhumattamā | karṇābhyāṃ bhūri viśruvam | brahmaṇaḥ kośo'si medhayā pihitaḥ | śrutaṃ me gopāya |",
          translation:
            "He who is the bull of the metres, of universal form — sprung from the metres above immortal Brahman — may that Indra strengthen me with medhā (intellect). May I be a holder of the immortal, O deva. My body alert; my tongue most sweet; with both ears may I hear much. Thou art Brahman's sheath, hidden by medhā. Guard what I have heard.",
          hindi:
            'जो छन्दों का ऋषभ है — विश्वरूप — जो अमृत ब्रह्म से छन्दों के द्वारा उत्पन्न हुआ — वह इन्द्र मुझे मेधा से सम्पन्न करे। हे देव! मैं अमृत का धारक होऊँ। मेरा शरीर सजग, जिह्वा अति मधुर, कानों से बहुत सुनूँ। तू ब्रह्म का कोश है — मेधा से ढका हुआ। मेरे श्रवण की रक्षा कर।',
          explanation:
            "A prayer for medhā — the integrative intelligence by which what is heard is retained, integrated, and applied. The body, tongue, and ears are asked for fitness. OM is praised as 'Brahman's sheath.'",
          science:
            "Memory research: integration of new material requires consolidation across sleep and embodied practice. The Upanishad's prayer for 'guarding what is heard' acknowledges this requirement.",
          lifeLesson:
            "After hearing something important, do not race onward. Pause; restate; let it consolidate. Otherwise, even gold falls through your fingers.",
          keywords: ["Medhā", "Prayer", "Retention"],
        },
        {
          id: 5,
          sanskrit:
            "भूर्भुवः सुवरिति वा एतास्तिस्रो व्याहृतयः | तासामु ह स्मैतां चतुर्थीं माहाचमस्यः प्रवेदयते | मह इति | तद्ब्रह्म | स आत्मा | अङ्गान्यन्या देवताः ||",
          transliteration:
            "bhūrbhuvaḥ suvariti vā etāstisro vyāhṛtayaḥ | tāsāmu ha smaitāṃ caturthīṃ māhācamasyaḥ pravedayate | maha iti | tadbrahma | sa ātmā | aṅgānyanyā devatāḥ ||",
          translation:
            "Bhūr, Bhuvaḥ, Suvaḥ — these are the three vyāhṛtis (great utterances). Of these, Māhācamasya teaches a fourth: 'mahaḥ.' That is Brahman; that is the Self; the other deities are its limbs.",
          hindi:
            'भूः, भुवः, सुवः — ये तीन व्याहृतियाँ हैं। माहाचमस्य ने इनकी चौथी सिखाई — "महः"। वही ब्रह्म है; वही आत्मा है। अन्य देवता उसके अंग हैं।',
          explanation:
            "The three vyāhṛtis (earth, atmosphere, sky) and a hidden fourth, 'mahaḥ' (greatness). The fourth is Brahman, the Self. Other deities are limbs of the great.",
          science:
            "Hidden-fourth structures appear in many ancient systems: 'mahaḥ' is the silent integrator behind the three apparent realms. Modern Trinitarian models often imply a similar fourth.",
          lifeLesson:
            "Whenever you see threes, look for the silent fourth. It is often the unifying ground.",
          keywords: ["Vyahriti", "Mahaḥ", "Fourth"],
        },
        {
          id: 6,
          sanskrit:
            "स य एषोऽन्तर्हृदय आकाशः | तस्मिन्नयं पुरुषो मनोमयः | अमृतो हिरण्मयः | अन्तरेण तालुके | य एष स्तन इवावलम्बते | सेन्द्रयोनिः | यत्रासौ केशान्तो विवर्तते | व्यपोह्य शीर्षकपाले | भूरित्यग्नौ प्रतितिष्ठति | भुव इति वायौ | सुवरित्यादित्ये | मह इति ब्रह्मणि | आप्नोति स्वाराज्यम् ||",
          transliteration:
            "sa ya eṣo'ntarhṛdaya ākāśaḥ | tasminnayaṃ puruṣo manomayaḥ | amṛto hiraṇmayaḥ | antareṇa tāluke | ya eṣa stana ivāvalambate | sendrayoniḥ | yatrāsau keśānto vivartate | vyapohya śīrṣakapāle | bhūrityagnau pratitiṣṭhati | bhuva iti vāyau | suvarityāditye | maha iti brahmaṇi | āpnoti svārājyam ||",
          translation:
            "The space within the heart — there the Person, made of mind, immortal, golden, dwells. Between the two palates, like the uvula, that pendulum is the place of birth of Indra. Where the suture parts (at the crown) — by 'bhūḥ' one rests in Agni; by 'bhuvaḥ' in Vāyu; by 'suvaḥ' in Āditya; by 'mahaḥ' in Brahman. One attains svārājya (sovereignty).",
          hindi:
            'हृदय के भीतर का जो आकाश है — वहाँ मनोमय पुरुष — अमर, हिरण्मय — स्थित है। दो तालुओं के बीच में जो स्तन-समान लटका है — वह इन्द्र-योनि है। जहाँ केशान्त मस्तक के सीमान्त पर बँटता है — वहीं — "भूः" से अग्नि में, "भुवः" से वायु में, "सुवः" से आदित्य में, "महः" से ब्रह्म में — प्रतिष्ठित होता है। स्वाराज्य प्राप्त करता है।',
          explanation:
            "The yogic anatomy: heart-space → Person → uvula → crown-suture. The four vyāhṛtis used in sequence carry one through Agni, Vāyu, Āditya, and into Brahman. Svārājya = self-sovereignty.",
          science:
            "Yogic anatomy is meditative rather than dissectable, but corresponds remarkably to vagal, palatal, and cranial-suture regions used in modern relaxation techniques.",
          lifeLesson:
            "The path described is dense, but the gist is simple: practice ascending attention through clearly defined inner regions. Even five minutes a day rewards.",
          keywords: ["HeartSpace", "Uvula", "Svarajya"],
        },
        {
          id: 7,
          sanskrit:
            "पृथिव्यन्तरिक्षं द्यौर्दिशोऽवान्तरदिशाः | अग्निर्वायुरादित्यश्चन्द्रमा नक्षत्राणि | आप ओषधयो वनस्पतयः | आकाश आत्मा | इत्यधिभूतम् | अथाध्यात्मम् | प्राणो व्यानोऽपान उदानः समानः | चक्षुः श्रोत्रं मनो वाक् त्वक् | चर्म मांसं स्नावास्थि मज्जा | एतदधिविधाय ऋषिरवोचत् | पाङ्क्तं वा इदं सर्वम् | पाङ्क्तेनैव पाङ्क्तँ्स्पृणोतीति ||",
          transliteration:
            "pṛthivyantarikṣaṃ dyaurdiśo'vāntaradiśāḥ | agnirvāyurādityaścandramā nakṣatrāṇi | āpa oṣadhayo vanaspatayaḥ | ākāśa ātmā | ityadhibhūtam | athādhyātmam | prāṇo vyāno'pāna udānaḥ samānaḥ | cakṣuḥ śrotraṃ mano vāk tvak | carma māṃsaṃ snāvāsthi majjā | etadadhividhāya ṛṣiravocat | pāṅktaṃ vā idaṃ sarvam | pāṅktenaiva pāṅktagaṃspṛṇotīti ||",
          translation:
            "Earth, atmosphere, heaven, the directions, the intermediate directions; Agni, Vāyu, Āditya, Moon, stars; waters, plants, trees; space, the Self — this is the bhūta-level. Now the personal: prāṇa, vyāna, apāna, udāna, samāna; eye, ear, mind, speech, skin; skin, flesh, sinew, bone, marrow. Having ordered all this, the seer said: 'All this is fivefold. By the fivefold one strengthens the fivefold.'",
          hindi:
            'पृथ्वी, अन्तरिक्ष, द्यु, दिशाएँ, अवान्तर-दिशाएँ; अग्नि, वायु, आदित्य, चन्द्र, नक्षत्र; जल, ओषधि, वनस्पति; आकाश, आत्मा — यह अधिभूत है। अध्यात्म — प्राण, व्यान, अपान, उदान, समान; नेत्र, श्रोत्र, मन, वाक्, त्वक्; चर्म, मांस, स्नायु, अस्थि, मज्जा। ऋषि ने कहा — यह सब "पाङ्क्त" (पंचक) है। पाङ्क्त से ही पाङ्क्त पोषित होता है।',
          explanation:
            "Pañkta-meditation: everything is fivefold. Cosmic fives (worlds, devas, plants, etc.) match bodily fives (prāṇas, senses, tissues). 'By the fivefold one strengthens the fivefold' — alignment of inner and outer fives.",
          science:
            "Fivefold groupings recur across biology: five senses, five limbs (head + four extremities), five organ-systems in many models. The Upanishad's intuition has biological grounding.",
          lifeLesson:
            "When seeking balance, list the five components of any situation. Five is often the natural taxonomy. Adjust the weak one.",
          keywords: ["Pankta", "Fives", "Correspondence"],
        },
        {
          id: 8,
          sanskrit:
            "ॐ इति ब्रह्म | ॐ इतीदं सर्वम् | ॐ इत्येतदनुकृतिर्ह स्म वा अप्यो श्रावयेत्याश्रावयन्ति | ॐ इति सामानि गायन्ति | ॐ शोमिति शस्त्राणि शँसन्ति | ॐ इत्यध्वर्युः प्रतिगरं प्रतिगृणाति | ॐ इति ब्रह्मा प्रसौति | ॐ इत्यग्निहोत्रमनुजानाति | ॐ इति ब्राह्मणः प्रवक्ष्यन्नाह ब्रह्मोपाप्नवानीति | ब्रह्मैवोपाप्नोति ||",
          transliteration:
            "oṃ iti brahma | oṃ itīdaṃ sarvam | oṃ ityetadanukṛtirha sma vā apyo śrāvayetyāśrāvayanti | oṃ iti sāmāni gāyanti | oṃ śomiti śastrāṇi śaṃsanti | oṃ ityadhvaryuḥ pratigaraṃ pratigṛṇāti | oṃ iti brahmā prasauti | oṃ ityagnihotramanujānāti | oṃ iti brāhmaṇaḥ pravakṣyannāha brahmopāpnavānīti | brahmaivopāpnoti ||",
          translation:
            "OM — that is Brahman. OM — all this. OM is the assent of recital: 'recite!' — they reply OM. By OM the sāman is sung; with OM-Śom the śastras are recited; with OM the adhvaryu replies; with OM the brahmā priest commands; with OM the agnihotra is consented to. With OM the Brahmin says: 'May I attain Brahman!' — and he indeed attains Brahman.",
          hindi:
            'ॐ — यही ब्रह्म है। ॐ — यह सब है। ॐ ही श्रावण-अनुकरण है। ॐ से साम गाये जाते हैं; ॐ-शोम् से शस्त्र पढ़े जाते हैं; ॐ से अध्वर्यु प्रतिगर बोलता है; ॐ से ब्रह्मा प्रसौति करता है; ॐ से अग्निहोत्र की अनुज्ञा होती है; ॐ से ब्राह्मण कहता है — "मैं ब्रह्म को प्राप्त करूँ" — और वह ब्रह्म ही प्राप्त करता है।',
          explanation:
            "OM permeates every priestly function — every assent, every recital. To say OM is to invoke Brahman. The Brahmin's intention to attain Brahman, voiced as OM, is itself the attainment.",
          science:
            "Intention + symbolic act produces measurable effects in behavioral and physiological domains. The Upanishad enacts the principle through ritual structure.",
          lifeLesson:
            "Begin and end with OM, even silently. The simple syllable, used as the bookend of every important effort, slowly converts effort into worship.",
          keywords: ["OM", "Liturgy", "Attainment"],
        },
        {
          id: 9,
          sanskrit:
            "ऋतं च स्वाध्यायप्रवचने च | सत्यं च स्वाध्यायप्रवचने च | तपश्च स्वाध्यायप्रवचने च | दमश्च स्वाध्यायप्रवचने च | शमश्च स्वाध्यायप्रवचने च | अग्नयश्च स्वाध्यायप्रवचने च | अग्निहोत्रं च स्वाध्यायप्रवचने च | अतिथयश्च स्वाध्यायप्रवचने च | मानुषं च स्वाध्यायप्रवचने च | प्रजा च स्वाध्यायप्रवचने च | प्रजनश्च स्वाध्यायप्रवचने च | प्रजातिश्च स्वाध्यायप्रवचने च | सत्यमिति सत्यवचा राथीतरः | तप इति तपोनित्यः पौरुशिष्टिः | स्वाध्यायप्रवचने एवेति नाको मौद्गल्यः | तद्धि तपस्तद्धि तपः ||",
          transliteration:
            "ṛtaṃ ca svādhyāyapravacane ca | satyaṃ ca svādhyāyapravacane ca | tapaśca svādhyāyapravacane ca | damaśca svādhyāyapravacane ca | śamaśca svādhyāyapravacane ca | agnayaśca svādhyāyapravacane ca | agnihotraṃ ca svādhyāyapravacane ca | atithayaśca svādhyāyapravacane ca | mānuṣaṃ ca svādhyāyapravacane ca | prajā ca svādhyāyapravacane ca | prajanaśca svādhyāyapravacane ca | prajātiśca svādhyāyapravacane ca | satyamiti satyavacā rāthītaraḥ | tapa iti taponityaḥ pauruśiṣṭiḥ | svādhyāyapravacane eveti nāko maudgalyaḥ | taddhi tapastaddhi tapaḥ ||",
          translation:
            "Ṛta and svādhyāya-pravacana (self-study and teaching); satya and svādhyāya-pravacana; tapas and svādhyāya-pravacana; dama and svādhyāya-pravacana; śama and svādhyāya-pravacana; the fires and svādhyāya-pravacana; agnihotra and svādhyāya-pravacana; guests and svādhyāya-pravacana; the human duty and svādhyāya-pravacana; offspring and svādhyāya-pravacana; procreation and svādhyāya-pravacana; lineage and svādhyāya-pravacana. Satyavacā Rāthītara says: 'Truth is the chief.' Taponitya Pauruśiṣṭi says: 'Tapas.' Nāka Maudgalya says: 'Only svādhyāya-pravacana — for that is tapas, that is tapas.'",
          hindi:
            'ऋत और स्वाध्याय-प्रवचन; सत्य और स्वाध्याय-प्रवचन; तप और स्वाध्याय-प्रवचन; दम और स्वाध्याय-प्रवचन; शम और स्वाध्याय-प्रवचन; अग्नियाँ और स्वाध्याय-प्रवचन; अग्निहोत्र और स्वाध्याय-प्रवचन; अतिथि और स्वाध्याय-प्रवचन; मानुष-कर्तव्य और स्वाध्याय-प्रवचन; प्रजा, प्रजन, प्रजाति और स्वाध्याय-प्रवचन। सत्यवचा राथीतर — "सत्य"; तपोनित्य पौरुशिष्टि — "तप"; नाक मौद्गल्य — "केवल स्वाध्याय-प्रवचन — वही तप है, वही तप है।"',
          explanation:
            "Twelve duties paired with svādhyāya-pravacana. Three teachers disagree about which is primary: truth, tapas, or self-study-and-teaching. Nāka Maudgalya's view — that svādhyāya-pravacana itself is tapas — closes with the doubled emphasis.",
          science:
            "Educational continuity: societies that institutionalize ongoing study-and-teaching produce more durable cultural transmission. The Upanishad recognizes the central role.",
          lifeLesson:
            "Every other duty matters, but study-and-teaching is the duty that makes other duties knowable. Without it, all others fade.",
          keywords: ["Svadhyaya", "Duties", "Tapas"],
        },
        {
          id: 10,
          sanskrit:
            "अहं वृक्षस्य रेरिवा | कीर्तिः पृष्ठं गिरेरिव | ऊर्ध्वपवित्रो वाजिनीव स्वमृतमस्मि | द्रविणं सवर्चसम् | सुमेधा अमृतोऽक्षितः | इति त्रिशङ्कोर्वेदानुवचनम् ||",
          transliteration:
            "ahaṃ vṛkṣasya rerivā | kīrtiḥ pṛṣṭhaṃ gireriva | ūrdhvapavitro vājinīva svamṛtamasmi | draviṇaṃ savarcasam | sumedhā amṛto'kṣitaḥ | iti triśaṅkorvedānuvacanam ||",
          translation:
            "I am the mover of the tree (of life). My glory is like the back of a mountain. Upward-purified, like a swift mare, I am immortal essence. I am wealth full of radiance — a sage of fine intellect, immortal, undecaying. — Thus the Veda-recitation of Triśaṅku.",
          hindi:
            'मैं इस वृक्ष (संसार-वृक्ष) का प्रेरक हूँ। मेरी कीर्ति पर्वत के पृष्ठ की तरह है। ऊर्ध्व-पवित्र, वाजी-घोड़ी की तरह — मैं स्व-अमृत हूँ। द्रविण-सम्पन्न, तेजोयुक्त — सुमेधा, अमर, अक्षय हूँ। — यह त्रिशङ्कु का वेद-अनुवचन है।',
          explanation:
            "The seer Triśaṅku declares his realization: he is the mover of the tree-of-life, the immortal essence, wealth full of radiance. A first-person celebration of self-knowledge.",
          science:
            "Self-affirmation research: precise verbal articulation of one's deepest values measurably stabilizes identity. Triśaṅku's recitation is a refined form.",
          lifeLesson:
            "Compose your own brief 'declaration of being' — three or four lines that name who you really are. Recite them when you forget.",
          keywords: ["Trishanku", "Declaration", "Realization"],
        },
        {
          id: 11,
          sanskrit:
            "वेदमनूच्याचार्योऽन्तेवासिनमनुशास्ति | सत्यं वद | धर्मं चर | स्वाध्यायान्मा प्रमदः | आचार्याय प्रियं धनमाहृत्य प्रजातन्तुं मा व्यवच्छेत्सीः | सत्यान्न प्रमदितव्यम् | धर्मान्न प्रमदितव्यम् | कुशलान्न प्रमदितव्यम् | भूत्यै न प्रमदितव्यम् | स्वाध्यायप्रवचनाभ्यां न प्रमदितव्यम् | देवपितृकार्याभ्यां न प्रमदितव्यम् | मातृदेवो भव | पितृदेवो भव | आचार्यदेवो भव | अतिथिदेवो भव | यान्यनवद्यानि कर्माणि | तानि सेवितव्यानि | नो इतराणि | यान्यस्माकं सुचरितानि | तानि त्वयोपास्यानि | नो इतराणि | ये के चास्मच्छ्रेयाँसो ब्राह्मणाः | तेषां त्वयाऽऽसनेन प्रश्वसितव्यम् | श्रद्धया देयम् | अश्रद्धयाऽदेयम् | श्रिया देयम् | ह्रिया देयम् | भिया देयम् | संविदा देयम् | अथ यदि ते कर्मविचिकित्सा वा वृत्तविचिकित्सा वा स्यात् | ये तत्र ब्राह्मणाः सम्मर्शिनः | युक्ता आयुक्ताः | अलूक्षा धर्मकामाः स्युः | यथा ते तत्र वर्तेरन् | तथा तत्र वर्तेथाः | अथाभ्याख्यातेषु | ये तत्र ब्राह्मणाः सम्मर्शिनः | युक्ता आयुक्ताः | अलूक्षा धर्मकामाः स्युः | यथा ते तेषु वर्तेरन् | तथा तेषु वर्तेथाः | एष आदेशः | एष उपदेशः | एषा वेदोपनिषत् | एतदनुशासनम् | एवमुपासितव्यम् | एवमु चैतदुपास्यम् ||",
          transliteration:
            "vedamanūcyācāryo'ntevāsinamanuśāsti | satyaṃ vada | dharmaṃ cara | svādhyāyānmā pramadaḥ | ācāryāya priyaṃ dhanamāhṛtya prajātantuṃ mā vyavacchetsīḥ | satyānna pramaditavyam | dharmānna pramaditavyam | kuśalānna pramaditavyam | bhūtyai na pramaditavyam | svādhyāyapravacanābhyāṃ na pramaditavyam | devapitṛkāryābhyāṃ na pramaditavyam | mātṛdevo bhava | pitṛdevo bhava | ācāryadevo bhava | atithidevo bhava | yānyanavadyāni karmāṇi | tāni sevitavyāni | no itarāṇi | yānyasmākaṃ sucaritāni | tāni tvayopāsyāni | no itarāṇi | ye ke cāsmacchreyāṃso brāhmaṇāḥ | teṣāṃ tvayā''sanena praśvasitavyam | śraddhayā deyam | aśraddhayā'deyam | śriyā deyam | hriyā deyam | bhiyā deyam | saṃvidā deyam | atha yadi te karmavicikitsā vā vṛttavicikitsā vā syāt | ye tatra brāhmaṇāḥ sammarśinaḥ | yuktā āyuktāḥ | alūkṣā dharmakāmāḥ syuḥ | yathā te tatra varteran | tathā tatra vartethāḥ | athābhyākhyāteṣu | ye tatra brāhmaṇāḥ sammarśinaḥ | yuktā āyuktāḥ | alūkṣā dharmakāmāḥ syuḥ | yathā te teṣu varteran | tathā teṣu vartethāḥ | eṣa ādeśaḥ | eṣa upadeśaḥ | eṣā vedopaniṣat | etadanuśāsanam | evamupāsitavyam | evamu caitadupāsyam ||",
          translation:
            "Having taught the Veda, the teacher instructs the student: Speak truth. Walk dharma. Do not neglect svādhyāya. After offering the teacher the gift he values, do not cut off the thread of progeny. Do not be careless about truth, dharma, welfare, prosperity, study-and-teaching, the offerings to the gods and ancestors. Be one to whom mother is god; father is god; teacher is god; guest is god. Whatever actions are blameless — those should be practiced; not others. Whatever good conduct of ours — practice that; not the rest. Whatever brahmins are nobler than we — give them seats; breathe softly in their presence. Give with faith; do not give without faith. Give with abundance; with shyness; with awe; with friendliness. If you have doubt about an action or about conduct, those brahmins who are reflective, qualified, gentle, lovers of dharma — as they would act, so you should act. As regards those accused — same procedure. This is the order. This is the teaching. This is the Veda's upaniṣad. This is the instruction. Thus shall it be worshipped; thus indeed worshipped.",
          hindi:
            'वेद पढ़ाकर आचार्य अन्तेवासी को अनुशासित करता है — "सत्य बोलो; धर्म का आचरण करो; स्वाध्याय में प्रमाद मत करो; आचार्य को प्रिय धन देकर प्रजा-तन्तु को मत काटो; सत्य से प्रमाद मत करो; धर्म से नहीं; कुशल से नहीं; भूति से नहीं; स्वाध्याय-प्रवचन से नहीं; देव-पितृ कार्य से नहीं। माता देव; पिता देव; आचार्य देव; अतिथि देव। जो अनवद्य (निर्दोष) कर्म हैं — उन्हीं को सेवित करो; अन्य को नहीं। हमारे जो सुचरित हैं — उन्हीं की उपासना करो; अन्य की नहीं। जो हमसे श्रेष्ठ ब्राह्मण हैं — उन्हें आसन देकर शान्त-श्वास से व्यवहार करो। श्रद्धा से दो; अश्रद्धा से नहीं; श्री से दो; ह्री से दो; भय से दो; संविद् से दो। यदि कर्म-संशय या आचरण-संशय हो — वहाँ जो सम्मर्शी, युक्त, अलूक्ष, धर्म-कामी ब्राह्मण हों — वैसे ही व्यवहार करो जैसे वे करें। यह आदेश है; यह उपदेश है; यह वेद-उपनिषद् है; यह अनुशासन है। इस प्रकार उपासना करनी चाहिये; इसी प्रकार उपासित होना चाहिये।"',
          explanation:
            "The most famous convocation address in human literature. Twelve commands: speak truth; walk dharma; do not neglect study; honor mother/father/teacher/guest as gods; act only blameless actions; give with faith. When in doubt: ask reflective, gentle brahmins. The entire ethical curriculum in one anuvāka.",
          science:
            "Positive psychology (Seligman's PERMA): authenticity, meaning, growth, relationships are predictive of well-being. The Upanishad's twelve commands encode all four pillars.",
          lifeLesson:
            "Print this address. Read it slowly once a week. The complete life-curriculum is in it. Every command is a daily practice.",
          keywords: ["Convocation", "SatyamVada", "MatrDevo"],
        },
        {
          id: 12,
          sanskrit:
            "शं नो मित्रः शं वरुणः | शं नो भवत्वर्यमा | शं न इन्द्रो बृहस्पतिः | शं नो विष्णुरुरुक्रमः | नमो ब्रह्मणे | नमस्ते वायो | त्वमेव प्रत्यक्षं ब्रह्मासि | त्वामेव प्रत्यक्षं ब्रह्मावादिषम् | ऋतमवादिषम् | सत्यमवादिषम् | तन्मामावीत् | तद्वक्तारमावीत् | आवीन्माम् | आवीद्वक्तारम् | ॐ शान्तिः शान्तिः शान्तिः ||",
          transliteration:
            "śaṃ no mitraḥ śaṃ varuṇaḥ | śaṃ no bhavatvaryamā | śaṃ na indro bṛhaspatiḥ | śaṃ no viṣṇururukramaḥ | namo brahmaṇe | namaste vāyo | tvameva pratyakṣaṃ brahmāsi | tvāmeva pratyakṣaṃ brahmāvādiṣam | ṛtamavādiṣam | satyamavādiṣam | tanmāmāvīt | tadvaktāramāvīt | āvīnmām | āvīdvaktāram | oṃ śāntiḥ śāntiḥ śāntiḥ ||",
          translation:
            "May Mitra be propitious to us; may Varuṇa be propitious; Aryaman; Indra and Bṛhaspati; far-striding Viṣṇu. Salutation to Brahman. Salutation to thee, Vāyu — thou alone art the visible Brahman; I have declared thee alone the visible Brahman. I have spoken ṛta; I have spoken satya. That has protected me; that has protected the speaker. It has protected me; it has protected the speaker. OM. Peace, peace, peace.",
          hindi:
            'मित्र शान्त हों, वरुण शान्त हों, अर्यमा शान्त हों, इन्द्र-बृहस्पति शान्त हों, उरुक्रम विष्णु शान्त हों। ब्रह्म को नमस्कार। हे वायु, तुम्हें नमस्कार — तुम्हीं प्रत्यक्ष ब्रह्म हो; तुम्हीं को प्रत्यक्ष ब्रह्म कहा। मैंने ऋत बोला; सत्य बोला। उसने मेरी रक्षा की; वक्ता की भी रक्षा की। ॐ शान्तिः शान्तिः शान्तिः।',
          explanation:
            "Closing peace mantra. Same opening invocation now spoken in past tense — 'I have spoken truth' — marking completion. The threefold śāntiḥ closes the vallī.",
          science:
            "Bookending with parallel invocations is a known mnemonic and emotional-closure technique. The Upanishad uses it for the whole Śīkṣā vallī.",
          lifeLesson:
            "End in the same posture you began. Symmetry of opening and closing is itself a kind of completeness.",
          keywords: ["ClosingPeace", "Symmetry", "Completion"],
        },
      ],
    },
    {
      id: 2,
      title: "Brahmānanda Vallī — The Bliss of Brahman",
      titleSanskrit: "ब्रह्मानन्दवल्ली",
      summary:
        "9 anuvākas. Opens with the great formulation 'satyaṃ jñānam anantaṃ brahma.' The pañca-kośa doctrine: five sheaths of the Self — annamaya, prāṇamaya, manomaya, vijñānamaya, ānandamaya. The famous bliss-calculation (one human bliss × 100 = bliss of a gandharva, etc.). Closes with the verse 'yato vāco nivartante' — from which speech turns back, unattained.",
      verses: [
        {
          id: 1,
          sanskrit:
            "ॐ ब्रह्मविदाप्नोति परम् | तदेषाऽभ्युक्ता | सत्यं ज्ञानमनन्तं ब्रह्म | यो वेद निहितं गुहायां परमे व्योमन् | सोऽश्नुते सर्वान् कामान् सह | ब्रह्मणा विपश्चितेति ||",
          transliteration:
            "oṃ brahmavidāpnoti param | tadeṣā'bhyuktā | satyaṃ jñānamanantaṃ brahma | yo veda nihitaṃ guhāyāṃ parame vyoman | so'śnute sarvān kāmān saha | brahmaṇā vipaściteti ||",
          translation:
            "OM. The knower of Brahman attains the Supreme. On this it is declared: Brahman is truth, knowledge, infinite. He who knows It hidden in the cave, in the highest space — he enjoys all desires, together with the omniscient Brahman.",
          hindi:
            'ॐ। ब्रह्मवेत्ता परम को प्राप्त होता है। इस पर कहा गया — "ब्रह्म सत्य है, ज्ञान है, अनन्त है। जो उसे हृदय-गुहा में, परम आकाश में, निहित जानता है — वह सर्वज्ञ ब्रह्म के साथ सब कामनाओं को भोगता है।"',
          explanation:
            "The supreme definition: satyaṃ jñānam anantam brahma. Truth, Consciousness, Infinity. Three words for the Absolute. To know it in the cave of the heart is to enjoy everything with the all-knowing Brahman.",
          science:
            "Satyam = invariance under transformation (a property of physical laws). Jñānam = the observer-component physics cannot eliminate. Anantam = the spacetime expanse or quantum vacuum. The three-word formula is surprisingly comprehensive.",
          lifeLesson:
            "You are already what you seek. The peace and fullness you pursue in objects are reflections of what you ARE. The search ends not with finding but with recognizing.",
          keywords: ["SatyamJnanamAnantam", "Brahman", "Definition"],
        },
        {
          id: 2,
          sanskrit:
            "तस्माद्वा एतस्मादात्मन आकाशः सम्भूतः | आकाशाद्वायुः | वायोरग्निः | अग्नेरापः | अद्भ्यः पृथिवी | पृथिव्या ओषधयः | ओषधीभ्योऽन्नम् | अन्नात्पुरुषः | स वा एष पुरुषोऽन्नरसमयः | तस्येदमेव शिरः | अयं दक्षिणः पक्षः | अयमुत्तरः पक्षः | अयमात्मा | इदं पुच्छं प्रतिष्ठा ||",
          transliteration:
            "tasmādvā etasmādātmana ākāśaḥ sambhūtaḥ | ākāśādvāyuḥ | vāyoragniḥ | agnerāpaḥ | adbhyaḥ pṛthivī | pṛthivyā oṣadhayaḥ | oṣadhībhyo'nnam | annātpuruṣaḥ | sa vā eṣa puruṣo'nnarasamayaḥ | tasyedameva śiraḥ | ayaṃ dakṣiṇaḥ pakṣaḥ | ayamuttaraḥ pakṣaḥ | ayamātmā | idaṃ pucchaṃ pratiṣṭhā ||",
          translation:
            "From this Self arose space; from space, air; from air, fire; from fire, water; from water, earth; from earth, plants; from plants, food; from food, the person. He is indeed made of the essence of food (annarasamaya). His head is here; his right wing here; his left wing here; this is the self; this is the tail, the foundation.",
          hindi:
            'इस आत्मा से आकाश उत्पन्न हुआ; आकाश से वायु; वायु से अग्नि; अग्नि से जल; जल से पृथ्वी; पृथ्वी से ओषधियाँ; ओषधियों से अन्न; अन्न से पुरुष। वह पुरुष "अन्न-रस-मय" है। यह उसका शिर; यह दक्षिण पक्ष; यह उत्तर पक्ष; यह आत्मा; यह पुच्छ — प्रतिष्ठा।',
          explanation:
            "The cosmogonic cascade: Self → space → air → fire → water → earth → plants → food → person. The food-body (annamaya-kośa) is described in bird-form: head, two wings, self, tail. The first of five sheaths is introduced.",
          science:
            "The cascade is approximately correct as a physics-of-emergence sequence: vacuum → forces → matter → planetary chemistry → organic molecules → life. The Upanishad's order is structurally accurate.",
          lifeLesson:
            "You are food temporarily organized into a person. Honor what you eat — it literally becomes you. Cheap food, cheap self.",
          keywords: ["Annamaya", "Cascade", "Bird"],
        },
        {
          id: 3,
          sanskrit:
            "अन्नाद्वै प्रजाः प्रजायन्ते | याः काश्च पृथिवीँ्श्रिताः | अथो अन्नेनैव जीवन्ति | अथैनदपि यन्त्यन्ततः | अन्नँ्हि भूतानां ज्येष्ठम् | तस्मात्सर्वौषधमुच्यते | सर्वं वै तेऽन्नमाप्नुवन्ति | येऽन्नं ब्रह्मोपासते | अन्नँ्हि भूतानां ज्येष्ठम् | तस्मात्सर्वौषधमुच्यते | अन्नाद्भूतानि जायन्ते | जातान्यन्नेन वर्धन्ते | अद्यतेऽत्ति च भूतानि | तस्मादन्नं तदुच्यते ||",
          transliteration:
            "annādvai prajāḥ prajāyante | yāḥ kāśca pṛthivīṃśritāḥ | atho annenaiva jīvanti | athainadapi yantyantataḥ | annaṃhi bhūtānāṃ jyeṣṭham | tasmātsarvauṣadhamucyate | sarvaṃ vai te'nnamāpnuvanti | ye'nnaṃ brahmopāsate | annaṃhi bhūtānāṃ jyeṣṭham | tasmātsarvauṣadhamucyate | annādbhūtāni jāyante | jātānyannena vardhante | adyate'tti ca bhūtāni | tasmādannaṃ taducyate ||",
          translation:
            "From food are creatures born — all creatures that dwell on earth. By food they live; into food they finally return. Food is the eldest of beings. Therefore it is called the universal medicine. Those who worship food as Brahman attain all food. Food is the eldest; food is the medicine. From food beings are born; born, they grow by food; food is eaten and food eats beings. Therefore it is called anna (food).",
          hindi:
            'अन्न से ही प्रजाएँ उत्पन्न होती हैं — पृथ्वी पर रहने वाली। अन्न से ही जीते हैं; अन्त में अन्न में ही लौटते हैं। अन्न ही भूतों का ज्येष्ठ है; इसलिये "सर्वौषध" कहलाता है। जो अन्न को ब्रह्म-रूप में उपासते हैं — उन्हें सब अन्न मिलता है। अन्न से भूत उत्पन्न होते हैं, अन्न से बढ़ते हैं; अन्न खाया जाता है और भूतों को खाता है — इसलिये "अन्न" कहलाता है।',
          explanation:
            "Food as Brahman. Beings emerge from, live by, return to food. Food eats and is eaten — etymology of 'anna' itself. Worshipping food as Brahman is no trivial practice — it is a doorway.",
          science:
            "Trophic ecology: every ecosystem is a food-web. Everything eats and is eaten. The Upanishad's etymology captures the cycle.",
          lifeLesson:
            "Before each meal, pause briefly. You are eating — and being prepared to be eaten. Both directions deserve attention.",
          keywords: ["Anna", "Eating", "Eldest"],
        },
        {
          id: 4,
          sanskrit:
            "तस्माद्वा एतस्मादन्नरसमयात् | अन्योऽन्तर आत्मा प्राणमयः | तेनैष पूर्णः | स वा एष पुरुषविध एव | तस्य पुरुषविधताम् | अन्वयं पुरुषविधः | तस्य प्राण एव शिरः | व्यानो दक्षिणः पक्षः | अपान उत्तरः पक्षः | आकाश आत्मा | पृथिवी पुच्छं प्रतिष्ठा | तदप्येष श्लोको भवति ||",
          transliteration:
            "tasmādvā etasmādannarasamayāt | anyo'ntara ātmā prāṇamayaḥ | tenaiṣa pūrṇaḥ | sa vā eṣa puruṣavidha eva | tasya puruṣavidhatām | anvayaṃ puruṣavidhaḥ | tasya prāṇa eva śiraḥ | vyāno dakṣiṇaḥ pakṣaḥ | apāna uttaraḥ pakṣaḥ | ākāśa ātmā | pṛthivī pucchaṃ pratiṣṭhā | tadapyeṣa śloko bhavati ||",
          translation:
            "Within this food-body is another inner self, made of prāṇa — by which the food-body is full. It too is in the form of a person. Its head is prāṇa; right wing is vyāna; left wing is apāna; space is its self; earth its tail-foundation. Of this also there is a verse.",
          hindi:
            'इस अन्न-रस-मय शरीर के भीतर एक अन्य अन्तरात्मा है — प्राण-मय। इसी से यह शरीर पूर्ण है। यह भी पुरुष के आकार वाला है। प्राण ही इसका शिर; व्यान दक्षिण पक्ष; अपान उत्तर पक्ष; आकाश आत्मा; पृथ्वी पुच्छ — प्रतिष्ठा। इस पर भी एक श्लोक है।',
          explanation:
            "Second kośa: prāṇamaya. The vital-energy sheath inside the food-body. Same bird-anatomy, but now with prāṇa, vyāna, apāna as head and wings.",
          science:
            "Bioenergetics: the body is animated by metabolic energy flow. The prāṇamaya kośa is the experiential face of this energy-system.",
          lifeLesson:
            "Notice that your body is not just flesh — it is vital energy circulating through flesh. Sit and feel that circulation directly for a few breaths.",
          keywords: ["Pranamaya", "SecondSheath", "Energy"],
        },
        {
          id: 5,
          sanskrit:
            "तस्माद्वा एतस्मात्प्राणमयात् | अन्योऽन्तर आत्मा मनोमयः | तेनैष पूर्णः | स वा एष पुरुषविध एव | तस्य पुरुषविधताम् | अन्वयं पुरुषविधः | तस्य यजुरेव शिरः | ऋग्दक्षिणः पक्षः | सामोत्तरः पक्षः | आदेश आत्मा | अथर्वाङ्गिरसः पुच्छं प्रतिष्ठा | तदप्येष श्लोको भवति | यतो वाचो निवर्तन्ते | अप्राप्य मनसा सह | आनन्दं ब्रह्मणो विद्वान् | न बिभेति कुतश्चनेति ||",
          transliteration:
            "tasmādvā etasmātprāṇamayāt | anyo'ntara ātmā manomayaḥ | tenaiṣa pūrṇaḥ | sa vā eṣa puruṣavidha eva | tasya puruṣavidhatām | anvayaṃ puruṣavidhaḥ | tasya yajureva śiraḥ | ṛgdakṣiṇaḥ pakṣaḥ | sāmottaraḥ pakṣaḥ | ādeśa ātmā | atharvāṅgirasaḥ pucchaṃ pratiṣṭhā | tadapyeṣa śloko bhavati | yato vāco nivartante | aprāpya manasā saha | ānandaṃ brahmaṇo vidvān | na bibheti kutaścaneti ||",
          translation:
            "Within the prāṇamaya is another inner self, made of mind. Through this the prāṇamaya is full. It also is person-shaped. Its head is Yajus; right wing Ṛc; left wing Sāman; its self is the brāhmaṇic instruction; its tail is the Atharvāṅgirasa. About this there is a verse: 'From which words turn back, unattained, with the mind — knowing the bliss of Brahman, one fears nothing from anywhere.'",
          hindi:
            'प्राणमय के भीतर एक और अन्तरात्मा है — मनोमय। इसी से प्राणमय पूर्ण है। यह भी पुरुष-आकार वाला है। यजुस् ही इसका शिर; ऋच् दक्षिण पक्ष; साम उत्तर पक्ष; आदेश आत्मा; अथर्वाङ्गिरस् पुच्छ। इस पर श्लोक — "जिससे वाणी मन के साथ लौट आती है — उसको प्राप्त किये बिना — ब्रह्म के आनन्द को जानने वाला कहीं से नहीं डरता।"',
          explanation:
            "Third kośa: manomaya. The famous verse appears: 'yato vāco nivartante' — that from which speech turns back unable to reach, attended by mind. Knowing the bliss of Brahman: fearless.",
          science:
            "Ineffability is a feature of the deepest contemplative states. Phenomenology recognizes that direct experience can outrun any linguistic capture.",
          lifeLesson:
            "When you find a teaching that words cannot capture, do not insist on capturing. The 'cannot be said' is itself the teaching.",
          keywords: ["Manomaya", "ThirdSheath", "Ineffable"],
        },
        {
          id: 6,
          sanskrit:
            "तस्माद्वा एतस्मान्मनोमयात् | अन्योऽन्तर आत्मा विज्ञानमयः | तेनैष पूर्णः | स वा एष पुरुषविध एव | तस्य पुरुषविधताम् | अन्वयं पुरुषविधः | तस्य श्रद्धैव शिरः | ऋतं दक्षिणः पक्षः | सत्यमुत्तरः पक्षः | योग आत्मा | महः पुच्छं प्रतिष्ठा | तदप्येष श्लोको भवति | विज्ञानं यज्ञं तनुते | कर्माणि तनुतेऽपि च | विज्ञानं देवाः सर्वे | ब्रह्म ज्येष्ठमुपासते | विज्ञानं ब्रह्म चेद्वेद | तस्माच्चेन्न प्रमाद्यति | शरीरे पाप्मनो हित्वा | सर्वान् कामान् समश्नुते ||",
          transliteration:
            "tasmādvā etasmānmanomayāt | anyo'ntara ātmā vijñānamayaḥ | tenaiṣa pūrṇaḥ | sa vā eṣa puruṣavidha eva | tasya puruṣavidhatām | anvayaṃ puruṣavidhaḥ | tasya śraddhaiva śiraḥ | ṛtaṃ dakṣiṇaḥ pakṣaḥ | satyamuttaraḥ pakṣaḥ | yoga ātmā | mahaḥ pucchaṃ pratiṣṭhā | tadapyeṣa śloko bhavati | vijñānaṃ yajñaṃ tanute | karmāṇi tanute'pi ca | vijñānaṃ devāḥ sarve | brahma jyeṣṭhamupāsate | vijñānaṃ brahma cedveda | tasmāccenna pramādyati | śarīre pāpmano hitvā | sarvān kāmān samaśnute ||",
          translation:
            "Within the manomaya is another inner self, made of vijñāna (deep knowledge). Its head is śraddhā; right wing ṛta; left wing satya; its self is yoga; its tail is mahaḥ (greatness). Verse: 'Vijñāna performs sacrifice; performs deeds; all gods worship vijñāna as the eldest Brahman. If one knows vijñāna as Brahman, and does not stray from it — one leaves bodily sins behind and attains all desires.'",
          hindi:
            'मनोमय के भीतर एक और अन्तरात्मा है — विज्ञान-मय। श्रद्धा ही इसका शिर; ऋत दक्षिण पक्ष; सत्य उत्तर पक्ष; योग आत्मा; महः पुच्छ। श्लोक — "विज्ञान यज्ञ करता है; कर्म भी करता है; सब देव विज्ञान को ज्येष्ठ ब्रह्म मानकर उपासते हैं। जो विज्ञान को ब्रह्म-रूप जानकर उससे प्रमाद नहीं करता — वह शरीर के पापों को त्यागकर सब कामनाएँ प्राप्त करता है।"',
          explanation:
            "Fourth kośa: vijñānamaya. The intellect-sheath. Its head is faith; its self is yoga. Vijñāna conducts sacrifice; gods worship it as the eldest. Knowing vijñāna as Brahman, one frees from sin.",
          science:
            "Executive cognition is the highest integrative layer in cognitive hierarchy. The Upanishad's intuition of vijñāna as 'eldest among the gods' anticipates this.",
          lifeLesson:
            "Strengthen the discerning intellect (vijñāna). It is the inner judge that other faculties answer to.",
          keywords: ["Vijnanamaya", "FourthSheath", "Discernment"],
        },
        {
          id: 7,
          sanskrit:
            "तस्माद्वा एतस्माद्विज्ञानमयात् | अन्योऽन्तर आत्माऽऽनन्दमयः | तेनैष पूर्णः | स वा एष पुरुषविध एव | तस्य पुरुषविधताम् | अन्वयं पुरुषविधः | तस्य प्रियमेव शिरः | मोदो दक्षिणः पक्षः | प्रमोद उत्तरः पक्षः | आनन्द आत्मा | ब्रह्म पुच्छं प्रतिष्ठा | तदप्येष श्लोको भवति | असन्नेव स भवति | असद्ब्रह्मेति वेद चेत् | अस्ति ब्रह्मेति चेद्वेद | सन्तमेनं ततो विदुरिति ||",
          transliteration:
            "tasmādvā etasmādvijñānamayāt | anyo'ntara ātmā''nandamayaḥ | tenaiṣa pūrṇaḥ | sa vā eṣa puruṣavidha eva | tasya puruṣavidhatām | anvayaṃ puruṣavidhaḥ | tasya priyameva śiraḥ | modo dakṣiṇaḥ pakṣaḥ | pramoda uttaraḥ pakṣaḥ | ānanda ātmā | brahma pucchaṃ pratiṣṭhā | tadapyeṣa śloko bhavati | asanneva sa bhavati | asadbrahmeti veda cet | asti brahmeti cedveda | santamenaṃ tato viduriti ||",
          translation:
            "Within the vijñānamaya is yet another inner self, made of bliss (ānandamaya). Its head is priya (the pleasing); right wing moda (joy); left wing pramoda (great joy); ānanda is its self; Brahman its tail-foundation. Verse: 'He becomes non-existent who thinks Brahman is non-existent; he who knows that Brahman is — him they know to be existent.'",
          hindi:
            'विज्ञानमय के भीतर एक अन्य अन्तरात्मा है — आनन्दमय। प्रिय इसका शिर; मोद दक्षिण पक्ष; प्रमोद उत्तर पक्ष; आनन्द आत्मा; ब्रह्म पुच्छ। श्लोक — "जो "ब्रह्म नहीं है" मानता है — वह स्वयं असत् हो जाता है। जो "ब्रह्म है" मानता है — उसे ही सत् जानते हैं।"',
          explanation:
            "Fifth and deepest kośa: ānandamaya. Its head is priya; tail is Brahman itself. The verse warns: those who deny Brahman become non-existent in essential being.",
          science:
            "Bliss-research (Csikszentmihalyi's flow, Buddhist sukha): the deepest layer of well-being is structurally distinct from pleasure or contentment. The Upanishad names this layer.",
          lifeLesson:
            "Look beneath your pleasures (priya), joys (moda), and great joys (pramoda) — there is a substrate of bliss (ānanda) common to all. Touch it directly.",
          keywords: ["Anandamaya", "FifthSheath", "Brahman"],
        },
        {
          id: 8,
          sanskrit:
            "भीषाऽस्माद्वातः पवते | भीषोदेति सूर्यः | भीषाऽस्मादग्निश्चेन्द्रश्च | मृत्युर्धावति पञ्चम इति | सैषाऽऽनन्दस्य मीमाँ्सा भवति | युवा स्यात्साधुयुवाऽध्यायकः | आशिष्ठो दृढिष्ठो बलिष्ठः | तस्येयं पृथिवी सर्वा वित्तस्य पूर्णा स्यात् | स एको मानुष आनन्दः | ते ये शतं मानुषा आनन्दाः | स एको मनुष्यगन्धर्वाणामानन्दः | श्रोत्रियस्य चाकामहतस्य | ते ये शतं मनुष्यगन्धर्वाणामानन्दाः | स एको देवगन्धर्वाणामानन्दः | श्रोत्रियस्य चाकामहतस्य | ते ये शतं देवगन्धर्वाणामानन्दाः | स एकः पितृणां चिरलोकलोकानामानन्दः | स एक आजानजानां देवानामानन्दः | स एकः कर्मदेवानामानन्दः | स एको देवानामानन्दः | स एक इन्द्रस्यानन्दः | स एको बृहस्पतेरानन्दः | स एकः प्रजापतेरानन्दः | स एको ब्रह्मण आनन्दः | श्रोत्रियस्य चाकामहतस्य ||",
          transliteration:
            "bhīṣā'smādvātaḥ pavate | bhīṣodeti sūryaḥ | bhīṣā'smādagniścendraśca | mṛtyurdhāvati pañcama iti | saiṣā''nandasya mīmāṃsā bhavati | yuvā syātsādhuyuvā'dhyāyakaḥ | āśiṣṭho dṛḍhiṣṭho baliṣṭhaḥ | tasyeyaṃ pṛthivī sarvā vittasya pūrṇā syāt | sa eko mānuṣa ānandaḥ | te ye śataṃ mānuṣā ānandāḥ | sa eko manuṣyagandharvāṇāmānandaḥ | śrotriyasya cākāmahatasya | te ye śataṃ manuṣyagandharvāṇāmānandāḥ | sa eko devagandharvāṇāmānandaḥ | śrotriyasya cākāmahatasya | te ye śataṃ devagandharvāṇāmānandāḥ | sa ekaḥ pitṛṇāṃ ciralokalokānāmānandaḥ | sa eka ājānajānāṃ devānāmānandaḥ | sa ekaḥ karmadevānāmānandaḥ | sa eko devānāmānandaḥ | sa eka indrasyānandaḥ | sa eko bṛhaspaterānandaḥ | sa ekaḥ prajāpaterānandaḥ | sa eko brahmaṇa ānandaḥ | śrotriyasya cākāmahatasya ||",
          translation:
            "Out of fear of him the wind blows; out of fear the sun rises; out of fear Agni, Indra, and Death the fifth run. Now the calculation of bliss: take a young man — well-educated, prompt, firm, strong — possessing all wealth of the earth. That is one human-bliss. A hundred human-blisses make one manuṣya-gandharva bliss — and also belong to a śrotriya free from desire. A hundred of those make one deva-gandharva bliss... [the cascade continues through pitṛs, ājāna-devas, karma-devas, devas, Indra, Bṛhaspati, Prajāpati, and finally Brahman] — and the same belongs to a śrotriya free from desire.",
          hindi:
            'इसी के भय से वायु बहती है, सूर्य उदय होता है, अग्नि-इन्द्र चलते हैं, और पाँचवाँ मृत्यु दौड़ता है। अब आनन्द की मीमांसा — एक युवा साधु-युवा अध्यायक, आशिष्ठ, दृढ़िष्ठ, बलिष्ठ, सम्पूर्ण पृथ्वी-धन से पूर्ण — यह एक "मानुष आनन्द"। सौ मानुष आनन्द = एक मनुष्य-गन्धर्व आनन्द — यही श्रोत्रिय-अकाम-हत को भी। सौ मनुष्य-गन्धर्व आनन्द = एक देव-गन्धर्व आनन्द; सौ देव-गन्धर्व आनन्द = एक पितृ आनन्द; ... अन्ततः ब्रह्म-आनन्द — और वही श्रोत्रिय-अकाम-हत को।',
          explanation:
            "Famous bliss-calculation. The base unit: a virile, learned, strong young man with all wealth. Bliss multiplies a hundred-fold across nine stages until reaching Brahman. Each level's bliss is also accessible to the desireless śrotriya — he has Brahman-bliss directly.",
          science:
            "Hedonic-adaptation research: pleasure scales rapidly diminish as one habituates. The Upanishad's vast multipliers acknowledge that ordinary human bliss is at the bottom of a vast hierarchy.",
          lifeLesson:
            "The bliss available to the desireless seeker exceeds Indra's. Practice desirelessness as a path; the bliss-calculation says the math works in your favor.",
          keywords: ["Bliss", "Calculation", "Shrotriya"],
        },
        {
          id: 9,
          sanskrit:
            "यतो वाचो निवर्तन्ते | अप्राप्य मनसा सह | आनन्दं ब्रह्मणो विद्वान् | न बिभेति कदाचनेति | एतँ्ह वाव न तपति | किमहँ्साधु नाकरवम् | किमहं पापमकरवमिति | स य एवं विद्वानेते आत्मानँ्स्पृणुते | उभे ह्येवैष एते आत्मानँ्स्पृणुते | य एवं वेद | इत्युपनिषत् ||",
          transliteration:
            "yato vāco nivartante | aprāpya manasā saha | ānandaṃ brahmaṇo vidvān | na bibheti kadācaneti | etagaṃha vāva na tapati | kimahaṃsādhu nākaravam | kimahaṃ pāpamakaravamiti | sa ya evaṃ vidvānete ātmānaṃspṛṇute | ubhe hyevaiṣa ete ātmānaṃspṛṇute | ya evaṃ veda | ityupaniṣat ||",
          translation:
            "From which words turn back, unattained, with the mind — knowing the bliss of Brahman, he never fears. He is not tormented by: 'Why did I not do good? Why did I do evil?' He who knows thus accepts both as the Self — both are nourishing to the Self for him who knows thus. — This is the upaniṣad.",
          hindi:
            'जिससे वाणी मन के साथ लौटती है — उसको प्राप्त किये बिना — ब्रह्म-आनन्द को जानने वाला कभी नहीं डरता। उसे "मैंने साधु क्यों नहीं किया?", "मैंने पाप क्यों किया?" — ये नहीं तपाते। ऐसा ज्ञानी इन दोनों को आत्मा-रूप मानता है — दोनों ही आत्मा को पोषित करते हैं उसके लिये। यह उपनिषद् है।',
          explanation:
            "Closing of Brahmānanda Vallī. The famous 'yato vāco nivartante' returns. The realized one is beyond moral self-torture — he accepts both 'I did this good / why this bad' as movements of the Self. Equanimity is the fruit.",
          science:
            "Self-compassion research (Neff): non-judgmental self-acceptance correlates with sustained ethical growth more than guilt does. Counter-intuitive but well-replicated.",
          lifeLesson:
            "Drop the cycle of 'why did I not do better?' Accept what happened. From a non-tormented place, the next action is more likely to be good.",
          keywords: ["YatoVacho", "Fearless", "Equanimity"],
        },
      ],
    },
    {
      id: 3,
      title: "Bhṛgu Vallī — The Bhṛgu Inquiry",
      titleSanskrit: "भृगुवल्ली",
      summary:
        "10 anuvākas. Bhṛgu, son of Varuṇa, approaches his father: 'Teach me Brahman.' Varuṇa points him to inquiry. Bhṛgu meditates and successively realizes: food is Brahman, prāṇa is Brahman, mind is Brahman, vijñāna is Brahman — finally, ānanda is Brahman. Each return to the father is met with the same instruction: 'continue inquiring.' Closes with practical teachings on food.",
      verses: [
        {
          id: 1,
          sanskrit:
            "भृगुर्वै वारुणिः | वरुणं पितरमुपससार | अधीहि भगवो ब्रह्मेति | तस्मा एतत्प्रोवाच | अन्नं प्राणं चक्षुः श्रोत्रं मनो वाचमिति | तँ्होवाच | यतो वा इमानि भूतानि जायन्ते | येन जातानि जीवन्ति | यत्प्रयन्त्यभिसंविशन्ति | तद्विजिज्ञासस्व | तद्ब्रह्मेति | स तपोऽतप्यत | स तपस्तप्त्वा ||",
          transliteration:
            "bhṛgurvai vāruṇiḥ | varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tasmā etatprovāca | annaṃ prāṇaṃ cakṣuḥ śrotraṃ mano vācamiti | tagaṃhovāca | yato vā imāni bhūtāni jāyante | yena jātāni jīvanti | yatprayantyabhisaṃviśanti | tadvijijñāsasva | tadbrahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "Bhṛgu, son of Varuṇa, approached his father: 'Sir, teach me Brahman.' Varuṇa said: food, prāṇa, sight, hearing, mind, speech. He added: 'That from which beings are born, by which when born they live, into which they enter at departure — desire to know That. That is Brahman.' He performed tapas. Having performed tapas...",
          hindi:
            'वरुण-पुत्र भृगु पिता वरुण के पास गए — "हे भगवन्, मुझे ब्रह्म का उपदेश दीजिये।" वरुण ने कहा — "अन्न, प्राण, चक्षु, श्रोत्र, मन, वाक्।" फिर कहा — "जिससे ये भूत उत्पन्न होते हैं, जिससे जीते हैं, जिसमें अन्त में लीन होते हैं — उसे जानने की इच्छा करो; वही ब्रह्म है।" उसने तप किया। तप करके...',
          explanation:
            "The classic teaching-method. The father does not answer but instructs: 'inquire.' He gives criteria: source, sustainer, destination. He gives faculties: food, prāṇa, sight, etc. — pointing the inquiry through them.",
          science:
            "Socratic-style guided discovery produces deeper understanding than direct answer. The Upanishad models the method precisely.",
          lifeLesson:
            "When teaching anything that matters, give criteria and method — not conclusions. The student will own what they discover.",
          keywords: ["Inquiry", "Bhrigu", "Criteria"],
        },
        {
          id: 2,
          sanskrit:
            "अन्नं ब्रह्मेति व्यजानात् | अन्नाद्ध्येव खल्विमानि भूतानि जायन्ते | अन्नेन जातानि जीवन्ति | अन्नं प्रयन्त्यभिसंविशन्तीति | तद्विज्ञाय | पुनरेव वरुणं पितरमुपससार | अधीहि भगवो ब्रह्मेति | तँ्होवाच | तपसा ब्रह्म विजिज्ञासस्व | तपो ब्रह्मेति | स तपोऽतप्यत | स तपस्तप्त्वा ||",
          transliteration:
            "annaṃ brahmeti vyajānāt | annāddhyeva khalvimāni bhūtāni jāyante | annena jātāni jīvanti | annaṃ prayantyabhisaṃviśantīti | tadvijñāya | punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Food is Brahman.' From food beings are born; by food they live; into food they enter at departure. Having understood this, he approached his father again: 'Sir, teach me Brahman.' He said: 'By tapas know Brahman; tapas is Brahman.' He performed tapas. Having performed tapas...",
          hindi:
            'उसने जाना — "अन्न ब्रह्म है।" अन्न से भूत उत्पन्न होते हैं, अन्न से जीते हैं, अन्न में लीन होते हैं। यह जानकर फिर वरुण के पास गया — "ब्रह्म का उपदेश दीजिये।" उसने कहा — "तप से ब्रह्म जानो; तप ब्रह्म है।" उसने तप किया।',
          explanation:
            "First answer: food fits the criteria. But Bhṛgu returns — sensing it's incomplete. Father redirects: 'do more tapas.' The inquiry continues.",
          science:
            "Material-substrate is the starting hypothesis of every cosmology. The Upanishad uses it as the first answer — partial but legitimate.",
          lifeLesson:
            "Trust the urge to return to the question. If an answer satisfies but you sense more — there is more. Press on.",
          keywords: ["AnnaBrahma", "FirstAnswer", "Continue"],
        },
        {
          id: 3,
          sanskrit:
            "प्राणो ब्रह्मेति व्यजानात् | प्राणाद्ध्येव खल्विमानि भूतानि जायन्ते | प्राणेन जातानि जीवन्ति | प्राणं प्रयन्त्यभिसंविशन्तीति | तद्विज्ञाय पुनरेव वरुणं पितरमुपससार | अधीहि भगवो ब्रह्मेति | तँ्होवाच | तपसा ब्रह्म विजिज्ञासस्व | तपो ब्रह्मेति | स तपोऽतप्यत | स तपस्तप्त्वा ||",
          transliteration:
            "prāṇo brahmeti vyajānāt | prāṇāddhyeva khalvimāni bhūtāni jāyante | prāṇena jātāni jīvanti | prāṇaṃ prayantyabhisaṃviśantīti | tadvijñāya punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Prāṇa is Brahman.' From prāṇa beings are born; by prāṇa they live; into prāṇa they return. Knowing this, he approached his father again. Father: 'By tapas inquire. Tapas is Brahman.' He performed tapas. Having performed tapas...",
          hindi:
            'उसने जाना — "प्राण ब्रह्म है।" प्राण से भूत उत्पन्न होते हैं, प्राण से जीते हैं, प्राण में लीन होते हैं। यह जानकर फिर पिता के पास गया। पिता ने कहा — "तप से जानो; तप ब्रह्म है।" तप किया।',
          explanation:
            "Second answer: prāṇa. Better than food — life-energy is more fundamental than substance. But still partial.",
          science:
            "Bio-energetics: life is metabolism. Many theories of life propose energy-flow as primary. Bhṛgu's second answer reflects this kind of theory.",
          lifeLesson:
            "When you advance one rung, do not stop. Each level satisfies briefly before revealing what lies beyond.",
          keywords: ["PranaBrahma", "SecondAnswer", "Lifeforce"],
        },
        {
          id: 4,
          sanskrit:
            "मनो ब्रह्मेति व्यजानात् | मनसो ह्येव खल्विमानि भूतानि जायन्ते | मनसा जातानि जीवन्ति | मनः प्रयन्त्यभिसंविशन्तीति | तद्विज्ञाय पुनरेव वरुणं पितरमुपससार | अधीहि भगवो ब्रह्मेति | तँ्होवाच | तपसा ब्रह्म विजिज्ञासस्व | तपो ब्रह्मेति | स तपोऽतप्यत | स तपस्तप्त्वा ||",
          transliteration:
            "mano brahmeti vyajānāt | manaso hyeva khalvimāni bhūtāni jāyante | manasā jātāni jīvanti | manaḥ prayantyabhisaṃviśantīti | tadvijñāya punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Mind is Brahman.' From mind beings are born; by mind they live; into mind they return. Knowing, he approached his father. Father: 'By tapas inquire.' He performed tapas.",
          hindi:
            'उसने जाना — "मन ब्रह्म है।" मन से भूत उत्पन्न होते हैं, मन से जीते हैं, मन में लीन होते हैं। फिर पिता के पास गया। पिता ने कहा — "तप करो।"',
          explanation:
            "Third answer: mind. Mind is closer than prāṇa — without it, even prāṇa is unintelligible. Yet still not the deepest.",
          science:
            "Cognitive primacy: many philosophies (Berkeley, Kastrup) argue mind is more fundamental than matter or energy. Bhṛgu's third answer matches.",
          lifeLesson:
            "Test each candidate-answer against the criteria. Mind fits more than energy did — but the test is rigor, not satisfaction.",
          keywords: ["ManoBrahma", "ThirdAnswer", "Mind"],
        },
        {
          id: 5,
          sanskrit:
            "विज्ञानं ब्रह्मेति व्यजानात् | विज्ञानाद्ध्येव खल्विमानि भूतानि जायन्ते | विज्ञानेन जातानि जीवन्ति | विज्ञानं प्रयन्त्यभिसंविशन्तीति | तद्विज्ञाय पुनरेव वरुणं पितरमुपससार | अधीहि भगवो ब्रह्मेति | तँ्होवाच | तपसा ब्रह्म विजिज्ञासस्व | तपो ब्रह्मेति | स तपोऽतप्यत | स तपस्तप्त्वा ||",
          transliteration:
            "vijñānaṃ brahmeti vyajānāt | vijñānāddhyeva khalvimāni bhūtāni jāyante | vijñānena jātāni jīvanti | vijñānaṃ prayantyabhisaṃviśantīti | tadvijñāya punareva varuṇaṃ pitaramupasasāra | adhīhi bhagavo brahmeti | tagaṃhovāca | tapasā brahma vijijñāsasva | tapo brahmeti | sa tapo'tapyata | sa tapastaptvā ||",
          translation:
            "He knew: 'Vijñāna (deep knowing) is Brahman.' From vijñāna beings are born... Knowing, he approached his father again. Father: 'By tapas inquire.' He performed tapas.",
          hindi:
            'उसने जाना — "विज्ञान ब्रह्म है।" विज्ञान से भूत उत्पन्न होते हैं... फिर पिता के पास गया। पिता ने कहा — "तप करो।"',
          explanation:
            "Fourth answer: vijñāna — the discerning intelligence behind mind. Subtler than mind, more fundamental. But still — not the end.",
          science:
            "Meta-cognition: the awareness that knows it knows. The Upanishad has Bhṛgu reach this level — and signal that more lies beyond.",
          lifeLesson:
            "Even your highest intelligence is not the bedrock. Press on past it. Something quieter holds even discernment.",
          keywords: ["VijnanaBrahma", "FourthAnswer", "Discernment"],
        },
        {
          id: 6,
          sanskrit:
            "आनन्दो ब्रह्मेति व्यजानात् | आनन्दाद्ध्येव खल्विमानि भूतानि जायन्ते | आनन्देन जातानि जीवन्ति | आनन्दं प्रयन्त्यभिसंविशन्तीति | सैषा भार्गवी वारुणी विद्या | परमे व्योमन् प्रतिष्ठिता | स य एवं वेद प्रतितिष्ठति | अन्नवानन्नादो भवति | महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन | महान् कीर्त्या ||",
          transliteration:
            "ānando brahmeti vyajānāt | ānandāddhyeva khalvimāni bhūtāni jāyante | ānandena jātāni jīvanti | ānandaṃ prayantyabhisaṃviśantīti | saiṣā bhārgavī vāruṇī vidyā | parame vyoman pratiṣṭhitā | sa ya evaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "He knew: 'Ānanda (bliss) is Brahman.' From bliss are beings born; by bliss they live; into bliss they merge and return. — This is the Bhārgavī-Vāruṇī Vidyā, established in the supreme space. He who knows it is established; becomes possessor of food and an eater of food; great by progeny, cattle, brahma-radiance, and fame.",
          hindi:
            'उसने जाना — "आनन्द ब्रह्म है।" आनन्द से भूत उत्पन्न होते हैं, आनन्द से जीते हैं, आनन्द में लीन हो जाते हैं। — यह "भार्गवी-वारुणी विद्या" है — परम व्योम में प्रतिष्ठित। जो इसे ऐसा जानता है, वह प्रतिष्ठित होता है; अन्नवान्, अन्न-भोक्ता हो जाता है; प्रजा, पशु, ब्रह्म-वर्चस् और कीर्ति से महान् होता है।',
          explanation:
            "The terminus. ānanda is Brahman. The criteria are satisfied at the deepest level. The 'Bhārgavī-Vāruṇī vidyā' — the inquiry of Bhṛgu son of Varuṇa — concludes. Fruits enumerated.",
          science:
            "Bliss as substrate: the deepest contemplative reports describe a layer of pure unconditioned well-being underlying all experience. The Upanishad names this Brahman.",
          lifeLesson:
            "Beneath every joy and even every sorrow is a ground of unconditioned well-being. Touch it daily; it is your inheritance.",
          keywords: ["AnandaBrahma", "FifthAnswer", "Terminus"],
        },
        {
          id: 7,
          sanskrit:
            "अन्नं न निन्द्यात् | तद्व्रतम् | प्राणो वा अन्नम् | शरीरमन्नादम् | प्राणे शरीरं प्रतिष्ठितम् | शरीरे प्राणः प्रतिष्ठितः | तदेतदन्नमन्ने प्रतिष्ठितम् | स य एतदन्नमन्ने प्रतिष्ठितं वेद प्रतितिष्ठति | अन्नवानन्नादो भवति | महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन | महान् कीर्त्या ||",
          transliteration:
            "annaṃ na nindyāt | tadvratam | prāṇo vā annam | śarīramannādam | prāṇe śarīraṃ pratiṣṭhitam | śarīre prāṇaḥ pratiṣṭhitaḥ | tadetadannamanne pratiṣṭhitam | sa ya etadannamanne pratiṣṭhitaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "Do not despise food — that is the vow. Prāṇa is food; the body is the eater of food. The body rests in prāṇa; prāṇa rests in the body. Thus food rests in food. He who knows this is established; becomes possessor and eater of food, great by progeny, cattle, brahma-radiance, fame.",
          hindi:
            '"अन्न की निन्दा मत कर" — यह व्रत है। प्राण ही अन्न है; शरीर अन्न-भोक्ता। प्राण में शरीर प्रतिष्ठित, शरीर में प्राण प्रतिष्ठित — इस प्रकार अन्न अन्न में प्रतिष्ठित है। जो इसे ऐसा जानता है — प्रतिष्ठित होता है; अन्नवान्, अन्न-भोक्ता, प्रजा-पशु-ब्रह्म-वर्चस्-कीर्ति से महान् होता है।',
          explanation:
            "First of three food-vows. Do not despise food. Food and the eater are interdependent — prāṇa is food, body eats; body is food (someday), prāṇa eats. The cycle is honored, not denigrated.",
          science:
            "Trophic interdependence: every eater is eaten. The biosphere is a single nested-eating system. The Upanishad's recognition is structural.",
          lifeLesson:
            "Never complain about food. Even bad food was offered by some chain of generosity. Eat with gratitude or do not eat.",
          keywords: ["FoodVow", "Reverence", "Cycle"],
        },
        {
          id: 8,
          sanskrit:
            "अन्नं न परिचक्षीत | तद्व्रतम् | आपो वा अन्नम् | ज्योतिरन्नादम् | अप्सु ज्योतिः प्रतिष्ठितम् | ज्योतिष्यापः प्रतिष्ठिताः | तदेतदन्नमन्ने प्रतिष्ठितम् | स य एतदन्नमन्ने प्रतिष्ठितं वेद प्रतितिष्ठति | अन्नवानन्नादो भवति | महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन | महान् कीर्त्या ||",
          transliteration:
            "annaṃ na paricakṣīta | tadvratam | āpo vā annam | jyotirannādam | apsu jyotiḥ pratiṣṭhitam | jyotiṣyāpaḥ pratiṣṭhitāḥ | tadetadannamanne pratiṣṭhitam | sa ya etadannamanne pratiṣṭhitaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "Do not neglect food — that is the vow. Water is food; light is the eater. Light rests in water; water rests in light. Thus food rests in food. He who knows this is established; the rewards as above.",
          hindi:
            '"अन्न की उपेक्षा मत कर" — यह व्रत है। जल ही अन्न; ज्योति अन्न-भोक्ता। जल में ज्योति प्रतिष्ठित; ज्योति में जल प्रतिष्ठित। अन्न अन्न में प्रतिष्ठित। फल पूर्ववत्।',
          explanation:
            "Second food-vow. Do not neglect food. Water and light are mutual eaters/eaten. Different level of the same reciprocity.",
          science:
            "Photosynthesis: light + water → biological energy. The relationship is the foundation of nearly all earthly life. The Upanishad's metaphor is precise.",
          lifeLesson:
            "Feed yourself attentively — like the most important guest at your own table. Neglect is a form of disrespect to the prāṇa that runs you.",
          keywords: ["FoodVow", "Attentive", "Water"],
        },
        {
          id: 9,
          sanskrit:
            "अन्नं बहु कुर्वीत | तद्व्रतम् | पृथिवी वा अन्नम् | आकाशोऽन्नादः | पृथिव्यामाकाशः प्रतिष्ठितः | आकाशे पृथिवी प्रतिष्ठिता | तदेतदन्नमन्ने प्रतिष्ठितम् | स य एतदन्नमन्ने प्रतिष्ठितं वेद प्रतितिष्ठति | अन्नवानन्नादो भवति | महान् भवति प्रजया पशुभिर्ब्रह्मवर्चसेन | महान् कीर्त्या ||",
          transliteration:
            "annaṃ bahu kurvīta | tadvratam | pṛthivī vā annam | ākāśo'nnādaḥ | pṛthivyāmākāśaḥ pratiṣṭhitaḥ | ākāśe pṛthivī pratiṣṭhitā | tadetadannamanne pratiṣṭhitam | sa ya etadannamanne pratiṣṭhitaṃ veda pratitiṣṭhati | annavānannādo bhavati | mahān bhavati prajayā paśubhirbrahmavarcasena | mahān kīrtyā ||",
          translation:
            "Produce abundant food — that is the vow. Earth is food; space is the eater. Space rests in earth; earth rests in space. Thus food rests in food. The fruit as above.",
          hindi:
            '"अन्न बहुत बना" — यह व्रत है। पृथ्वी ही अन्न; आकाश अन्न-भोक्ता। पृथ्वी में आकाश प्रतिष्ठित; आकाश में पृथ्वी प्रतिष्ठित। अन्न अन्न में प्रतिष्ठित। फल पूर्ववत्।',
          explanation:
            "Third food-vow. Produce much food. Generosity in food-production is itself the vow. Earth + space relate as food + eater.",
          science:
            "Food-security research: societies that produce surplus and distribute generously are most stable. The Upanishad's third vow is policy.",
          lifeLesson:
            "Be a net producer, not just a consumer. Whatever your domain, leave more than you take.",
          keywords: ["FoodVow", "Production", "Generosity"],
        },
        {
          id: 10,
          sanskrit:
            "न कञ्चन वसतौ प्रत्याचक्षीत | तद्व्रतम् | तस्माद्यया कया च विधया बह्वन्नं प्राप्नुयात् | अराध्यस्मा अन्नमित्याचक्षते | एतद्वै मुखतोऽन्नँ्राद्धम् | मुखतोऽस्मा अन्नँ्राध्यते | एतद्वै मध्यतोऽन्नँ्राद्धम् | मध्यतोऽस्मा अन्नँ्राध्यते | एतद्वा अन्ततोऽन्नँ्राद्धम् | अन्ततोऽस्मा अन्नँ्राध्यते | य एवं वेद | क्षेम इति वाचि | योगक्षेम इति प्राणापानयोः | कर्मेति हस्तयोः | गतिरिति पादयोः | विमुक्तिरिति पायौ | इति मानुषीः समाज्ञाः | अथ दैवीः | तृप्तिरिति वृष्टौ | बलमिति विद्युति | यश इति पशुषु | ज्योतिरिति नक्षत्रेषु | प्रजातिरमृतमानन्द इत्युपस्थे | सर्वमित्याकाशे | तत्प्रतिष्ठेत्युपासीत | प्रतिष्ठावान् भवति | तन्महमिति | महानुपासीत | महान् भवति | तन्मन इत्युपासीत | मानवान् भवति | तन्नम इत्युपासीत | नम्यन्तेऽस्मै कामाः | तद्ब्रह्मेत्युपासीत | ब्रह्मवान् भवति | तद्ब्रह्मणः परिमर इत्युपासीत | पर्येणं म्रियन्ते द्विषन्तः सपत्नाः | परि येऽप्रिया भ्रातृव्याः | स यश्चायं पुरुषे | यश्चासावादित्ये | स एकः | स य एवंवित् | अस्माल्लोकात्प्रेत्य | एतमन्नमयमात्मानमुपसंक्रम्य | एतं प्राणमयमात्मानमुपसंक्रम्य | एतं मनोमयमात्मानमुपसंक्रम्य | एतं विज्ञानमयमात्मानमुपसंक्रम्य | एतमानन्दमयमात्मानमुपसंक्रम्य | इमाँ्लोकान् कामान्नी कामरूप्यनुसंचरन् | एतत्साम गायन्नास्ते | हा३वु हा३वु हा३वु | अहमन्नमहमन्नमहमन्नम् | अहमन्नादोऽहमन्नादोऽहमन्नादः | अहं श्लोककृदहं श्लोककृदहं श्लोककृत् | अहमस्मि प्रथमजा ऋतस्य | पूर्वं देवेभ्योऽमृतस्य नाभायि | यो मा ददाति स इदेव माऽऽवाः | अहमन्नमन्नमदन्तमादि | अहं विश्वं भुवनमभ्यभवाम् | सुवर्ण ज्योतीः | य एवं वेद | इत्युपनिषत् ||",
          transliteration:
            "na kañcana vasatau pratyācakṣīta | tadvratam | tasmādyayā kayā ca vidhayā bahvannaṃ prāpnuyāt | arādhyasmā annamityācakṣate | etadvai mukhato'nnaṃrāddham | mukhato'smā annaṃrādhyate | etadvai madhyato'nnaṃrāddham | madhyato'smā annaṃrādhyate | etadvā antato'nnaṃrāddham | antato'smā annaṃrādhyate | ya evaṃ veda | kṣema iti vāci | yogakṣema iti prāṇāpānayoḥ | karmeti hastayoḥ | gatiriti pādayoḥ | vimuktiriti pāyau | iti mānuṣīḥ samājñāḥ | atha daivīḥ | tṛptiriti vṛṣṭau | balamiti vidyuti | yaśa iti paśuṣu | jyotiriti nakṣatreṣu | prajātiramṛtamānanda ityupasthe | sarvamityākāśe | tatpratiṣṭhetyupāsīta | pratiṣṭhāvān bhavati | tanmahamiti | mahānupāsīta | mahān bhavati | tanmana ityupāsīta | mānavān bhavati | tannama ityupāsīta | namyante'smai kāmāḥ | tadbrahmetyupāsīta | brahmavān bhavati | tadbrahmaṇaḥ parimara ityupāsīta | paryeṇaṃ mriyante dviṣantaḥ sapatnāḥ | pari ye'priyā bhrātṛvyāḥ | sa yaścāyaṃ puruṣe | yaścāsāvāditye | sa ekaḥ | sa ya evaṃvit | asmāllokātpretya | etamannamayamātmānamupasaṃkramya | etaṃ prāṇamayamātmānamupasaṃkramya | etaṃ manomayamātmānamupasaṃkramya | etaṃ vijñānamayamātmānamupasaṃkramya | etamānandamayamātmānamupasaṃkramya | imāṃlokān kāmānnī kāmarūpyanusaṃcaran | etatsāma gāyannāste | hā³vu hā³vu hā³vu | ahamannamahamannamahamannam | ahamannādo'hamannādo'hamannādaḥ | ahaṃ ślokakṛdahaṃ ślokakṛdahaṃ ślokakṛt | ahamasmi prathamajā ṛtasya | pūrvaṃ devebhyo'mṛtasya nābhāyi | yo mā dadāti sa ideva mā''vāḥ | ahamannamannamadantamādi | ahaṃ viśvaṃ bhuvanamabhyabhavām | suvarṇa jyotīḥ | ya evaṃ veda | ityupaniṣat ||",
          translation:
            "Refuse no one shelter — that is the vow. Therefore by some means or another, gather food in abundance — they call this food 'arādhya' (worthy of welcome). [Various correspondences enumerated: human and divine.] He who knows all this — passing from this world, ascending through annamaya, prāṇamaya, manomaya, vijñānamaya, ānandamaya selves — wandering these worlds, eating what he wishes, taking form as he wishes — sits singing this Sāman: 'Hā vu hā vu hā vu! I am food! I am food! I am food! I am the eater of food! I am the eater of food! I am the eater of food! I am the verse-maker! I am the verse-maker! I am the verse-maker! I am the firstborn of ṛta — before the gods, in the navel of immortality. He who gives me to others by that has shared me. I, food, eat the eater of food. I have entered the whole world. I am golden-light, like the sun.' — He who knows thus. This is the Upaniṣad.",
          hindi:
            '"किसी को आवास से मना मत कर" — यह व्रत है। इसलिये किसी भी विधि से बहु-अन्न प्राप्त करो — उसे "अराध्य अन्न" कहते हैं। [विभिन्न मानुष-दैव संज्ञाएँ।] जो ऐसा जानता है — इस लोक से जाकर — अन्नमय, प्राणमय, मनोमय, विज्ञानमय, आनन्दमय आत्मा को क्रमशः पार करके — कामरूप होकर लोकों में विचरता है — यह साम गाता हुआ रहता है — "हा³वु हा³वु हा³वु! मैं अन्न, मैं अन्न, मैं अन्न! मैं अन्न-भोक्ता, मैं अन्न-भोक्ता, मैं अन्न-भोक्ता! मैं श्लोक-कर्ता, मैं श्लोक-कर्ता, मैं श्लोक-कर्ता! मैं ऋत का प्रथमजा — देवों से पहले, अमृत-नाभि में। जो मुझे देता है — उसने मुझे ही पाया। मैं — अन्न — अन्न-भोक्ता को खाता हूँ। मैंने पूरे भुवन में प्रवेश किया है। मैं सुवर्ण-ज्योति हूँ।" — जो ऐसा जानता है। यह उपनिषद् है।',
          explanation:
            "The grand finale. Refuse no guest shelter — third great vow. Many correspondences enumerated (human and divine). The realized seeker, having passed through all five kośas, sings the great Sāman: 'I am food, I am the eater of food.' Identity-claim of the cosmic Self. The final 'iti upaniṣat' marks the close of the entire teaching.",
          science:
            "Self-recognition across all roles is the highest contemplative attainment. The 'I am food / I am the eater' is a non-dual recognition that transcends the eater-eaten polarity.",
          lifeLesson:
            "Refuse no one shelter you can give. Refuse no one food you can offer. Such generosity is itself the door — the realized seeker is the one who has long practiced it.",
          keywords: ["Hospitality", "AhamAnnam", "Closing"],
        },
        {
          id: 32,
          sanskrit: 'योगश्चित्तवृत्तिरोधो योगो मोक्षप्रदायकः | योगः सर्वबन्धानां योगो ब्रह्मसमाश्रयः ||',
          transliteration: 'yogaścittavṛttirodho yogo mokṣapradāyakaḥ | yogaḥ sarvabandhānāṃ yogaḥ brahmasamāśrayaḥ ||',
          translation: 'Yoga is the cessation of mental modifications; yoga gives liberation. Yoga cuts all bonds; yoga rests on Brahman.',
          hindi: 'योग चित्त-वृत्तियों का निरोध है; योग मोक्ष देता है। योग सभी बंधनों को काटता है; योग ब्रह्म पर आश्रित है।',
          explanation: 'The definition of yoga from Yoga Sutras, placed in the context of Brahman. Yoga is the cessation of mental modifications, leading to liberation. All bonds are cut through this practice, which rests on the foundation of Brahman.',
          keywords: ['Yoga', 'ChittaVritti', 'Liberation', 'BrahmaFoundation'],
        },
        {
          id: 33,
          sanskrit: 'अहं ब्रह्मास्मि न त्वं भूतिर्न च भूतानि | सर्वं ब्रह्म एव सर्वं ब्रह्म मयि सर्वम् ||',
          transliteration: 'ahaṃ brahmāsmi na tvaṃ bhūtirna ca bhūtāni | sarvaṃ brahma eva sarvaṃ brahma mayi sarvam ||',
          translation: 'I am Brahman, not you; I am birth, not beings; all is Brahman alone, all is Brahman in me.',
          hindi: 'मैं ब्रह्म हूँ, तुम नहीं; मैं जन्म हूँ, प्राणी नहीं; सब ब्रह्म ही है, सब ब्रह्म मेरे में है।',
          explanation: 'The declaration of non-duality with Brahman as the supreme. The individual Self is Brahman; the world is Brahman; all distinctions dissolve in this recognition.',
          keywords: ['AhamBrahma', 'BrahmaAlone', 'NonDuality'],
        },
        {
          id: 34,
          sanskrit: 'यथा नदी समुद्रेषु यथा दीपो दीतेषु | तथा जीवो ब्रह्मणि लीनो न तत्र संशयो भवति ||',
          transliteration: 'yathā nadī samudreṣu yathā dīpo dīpiteṣu | tathā jīvo brahmaṇi līno na tatra saṃśayo bhavati ||',
          translation: 'As rivers merge into the ocean, as lamps merge into light — so the individual self merges into Brahman. There is no doubt about this.',
          hindi: 'जैसे नदियाँ समुद्र में लीन हो जाती हैं, जैसे दीप ज्योति में लीन हो जाते हैं — वैसे ही जीव ब्रह्म में लीन हो जाता है। इसमें कोई संशय नहीं।',
          explanation: 'The dissolution of individuality into Brahman. The images of rivers into ocean and lamps into light illustrate the loss of separate identity while the essence remains.',
          keywords: ['Merging', 'RiversOcean', 'LampsLight', 'Brahma'],
        },
        {
          id: 35,
          sanskrit: 'शान्तं शिवमद्वैतं ब्रह्म नित्यं शुद्धमच्युतम् | यो जानाति स पश्यति यो न जानाति न पश्यति ||',
          transliteration: 'śāntaṃ śivamadvaitaṃ brahma nityaṃ śuddhamacyutam | yo jānāti sa paśyati yo na jānāti na paśyati ||',
          translation: 'Peaceful, auspicious, non-dual Brahman — eternal, pure, immutable. He who knows, sees; he who does not know, does not see.',
          hindi: 'शांत, शिव, अद्वैत ब्रह्म — नित्य, शुद्ध, अच्युत। जो जानता है, वह देखता है; जो नहीं जानता, वह नहीं देखता।',
          explanation: 'The attributes of Brahman: peaceful, auspicious, non-dual, eternal, pure, immutable. Knowledge is seeing; ignorance is blindness.',
          keywords: ['PeacefulShiva', 'NonDual', 'EternalPure', 'Brahma'],
        },
        {
          id: 36,
          sanskrit: 'एको देवो द्वितीयो नास्ति यो ब्रह्म वेद तत्त्वतः | सोऽहमस्मि न किंचिद्भूतो न मृत्युर्न शोको न तथा ||',
          transliteration: 'eko devo dvitīyo nāsti yo brahma veda tattvataḥ | so\'hamasmi na kiñcidbhūto na mṛtyurna śoko na tathā ||',
          translation: 'There is one God, no second — he who knows Brahman in truth. I am He, not any being, no death, no sorrow, and so on.',
          hindi: 'एक ही देव है, दूसरा कोई नहीं — जो ब्रह्म को तत्व से जानता है। मैं वही हूँ, कोई प्राणी नहीं, मृत्यु नहीं, शोक नहीं, वगैरह।',
          explanation: 'The affirmation of non-duality: one reality, no second. The knower recognizes "I am He" and transcends death, sorrow, and all suffering.',
          keywords: ['OneGod', 'NoSecond', 'SoHam', 'NoDeathNoSorrow'],
        },
      ],
    },
  ],
};
