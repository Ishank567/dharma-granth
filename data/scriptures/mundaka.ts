import { Scripture } from "../types";

export const mundaka: Scripture = {
  id: "mundaka",
  title: "Mundaka Upanishad",
  titleSanskrit: "मुण्डकोपनिषद्",
  category: "upanishad",
  description:
    'Belongs to the Atharva Veda. 64 mantras in 3 muṇḍakas (sections), each divided into 2 khaṇḍas. Distinguishes higher (parā) and lower (aparā) knowledge. Famous for the bow-and-arrow metaphor, the two-birds image, and the verse "satyam eva jayate" (truth alone triumphs) — India\'s national motto.',
  totalVerses: 64,
  tags: ["Upanishad", "Knowledge", "Brahman", "Meditation", "TwoBirds", "SatyamEvaJayate"],
  chapters: [
    {
      id: 1,
      title: "Muṇḍaka 1, Khaṇḍa 1 — The Two Knowledges",
      titleSanskrit: "प्रथम मुण्डक · प्रथम खण्ड",
      summary:
        "9 mantras. The lineage of the teaching descends from Brahmā through Atharvā, Aṅgir, and Bhāradvāja to Aṅgiras, who teaches Śaunaka. Two kinds of knowledge are distinguished: aparā (the four Vedas and six auxiliaries) and parā (by which the Imperishable is known). The Imperishable produces the world as a spider its web.",
      verses: [
        {
          id: 1,
          sanskrit:
            "ब्रह्मा देवानां प्रथमः सम्बभूव विश्वस्य कर्ता भुवनस्य गोप्ता | स ब्रह्मविद्यां सर्वविद्याप्रतिष्ठामथर्वाय ज्येष्ठपुत्राय प्राह ||",
          transliteration:
            "brahmā devānāṃ prathamaḥ sambabhūva viśvasya kartā bhuvanasya goptā | sa brahmavidyāṃ sarvavidyāpratiṣṭhāmatharvāya jyeṣṭhaputrāya prāha ||",
          translation:
            "Brahmā, first among the gods, arose — maker of the universe, protector of the world. He taught the knowledge of Brahman — the foundation of all knowledges — to his eldest son Atharvā.",
          hindi:
            'देवों में प्रथम ब्रह्मा प्रकट हुए — विश्व के कर्ता, भुवन के रक्षक। उन्होंने ब्रह्मविद्या — जो सब विद्याओं का आधार है — अपने ज्येष्ठ पुत्र अथर्वा को सिखाई।',
          explanation:
            "The Upanishad opens with the lineage. Knowledge of Brahman is not invented by any human — it descends from the very first being. By placing brahma-vidyā as 'the foundation of all knowledges,' the Upanishad asserts its primacy over every other learning.",
          science:
            "Every field of learning rests on foundational assumptions about reality. Brahma-vidyā is the inquiry into those foundations themselves — the meta-discipline that makes every discipline possible.",
          lifeLesson:
            "Honor lineage. The deepest teachings come not from individuals but through a chain. Know who taught your teacher and who taught them. That awareness keeps you humble and connected.",
          keywords: ["Lineage", "Brahma", "Atharva"],
        },
        {
          id: 2,
          sanskrit:
            "अथर्वणे यां प्रवदेत ब्रह्माथर्वा तां पुरोवाचाङ्गिरे ब्रह्मविद्याम् | स भारद्वाजाय सत्यवहाय प्राह भारद्वाजोऽङ्गिरसे परावराम् ||",
          transliteration:
            "atharvaṇe yāṃ pravadeta brahmātharvā tāṃ purovācāṅgire brahmavidyām | sa bhāradvājāya satyavahāya prāha bhāradvājo'ṅgirase parāvarām ||",
          translation:
            "That knowledge which Brahmā gave to Atharvā, Atharvā taught to Aṅgir. He taught it to Bhāradvāja Satyavāha; Bhāradvāja taught it, both higher and lower, to Aṅgiras.",
          hindi:
            'ब्रह्मा ने जो विद्या अथर्वा को दी, अथर्वा ने वही अंगिर को दी; अंगिर ने भारद्वाज सत्यवाह को, और भारद्वाज ने पर-अपर दोनों विद्या अंगिरस को दी।',
          explanation:
            "Five-step lineage — Brahmā, Atharvā, Aṅgir, Bhāradvāja, Aṅgiras. Notice 'parāvarām' (both higher and lower) — Aṅgiras receives the full curriculum. The teacher who appears next must have the complete framework before teaching even one student.",
          science:
            "Knowledge transmission research: durable cultural learning requires multi-generational fidelity. The Upanishad's careful chain is the structure that maintains content across centuries.",
          lifeLesson:
            "When you receive teaching, hold yourself responsible for transmitting it faithfully. Lineage breaks one generation at a time, by carelessness — never by malice.",
          keywords: ["Transmission", "Lineage", "Angiras"],
        },
        {
          id: 3,
          sanskrit:
            "शौनको ह वै महाशालोऽङ्गिरसं विधिवदुपसन्नः पप्रच्छ | कस्मिन्नु भगवो विज्ञाते सर्वमिदं विज्ञातं भवतीति ||",
          transliteration:
            "śaunako ha vai mahāśālo'ṅgirasaṃ vidhivadupasannaḥ papraccha | kasminnu bhagavo vijñāte sarvamidaṃ vijñātaṃ bhavatīti ||",
          translation:
            'Śaunaka, the great householder, having approached Aṅgiras with proper respect, asked: "Sir, what is that, by knowing which, all this becomes known?"',
          hindi:
            'महाशाल शौनक ने अंगिरस के पास विधिपूर्वक उपस्थित होकर पूछा — "हे भगवन्! किसके जान लेने से यह सब जाना हुआ हो जाता है?"',
          explanation:
            "The deepest question of philosophy in eight words: 'by knowing what does everything become known?' Śaunaka is not asking for a fact — he is asking for the principle that explains all facts.",
          science:
            "Theoretical physicists call this 'the theory of everything' — a single principle from which all phenomena could be derived. The Upanishad poses the question 3000 years before physics.",
          lifeLesson:
            "When choosing what to study, prefer the question that, if answered, would render countless other questions answerable. Quality of question beats quantity of inquiry.",
          keywords: ["Shaunaka", "TheQuestion", "Unification"],
        },
        {
          id: 4,
          sanskrit:
            "तस्मै स होवाच | द्वे विद्ये वेदितव्ये इति ह स्म यद् ब्रह्मविदो वदन्ति परा चैवापरा च ||",
          transliteration:
            "tasmai sa hovāca | dve vidye veditavye iti ha sma yad brahmavido vadanti parā caivāparā ca ||",
          translation:
            'To him he said: "Two kinds of knowledge are to be known — so say those who know Brahman: the higher (parā) and the lower (aparā)."',
          hindi:
            'उसने कहा — "ब्रह्मवेत्ता कहते हैं कि दो प्रकार की विद्याएँ जाननी चाहिए — परा और अपरा।"',
          explanation:
            "The decisive distinction. Aparā vidyā is all conventional knowing — science, language, ritual, even the Vedas themselves. Parā vidyā is direct knowing of the Self. The first deals with objects; the second with the subject.",
          science:
            "Modern epistemology distinguishes 'knowing-that,' 'knowing-how,' and 'knowing what it is like.' The first two are aparā; only the third reaches parā. Neuroscience cannot reduce subjective experience to neural correlates precisely because parā vidyā cannot be captured in third-person terms.",
          lifeLesson:
            "How much of your education has been aparā? How much parā? The person who knows everything about the world but nothing about themselves is the most ignorant of all. Balance the two.",
          keywords: ["TwoKnowledges", "Para", "Apara"],
        },
        {
          id: 5,
          sanskrit:
            "तत्रापरा ऋग्वेदो यजुर्वेदः सामवेदोऽथर्ववेदः शिक्षा कल्पो व्याकरणं निरुक्तं छन्दो ज्योतिषमिति | अथ परा यया तदक्षरमधिगम्यते ||",
          transliteration:
            "tatrāparā ṛgvedo yajurvedaḥ sāmavedo'tharvavedaḥ śikṣā kalpo vyākaraṇaṃ niruktaṃ chando jyotiṣamiti | atha parā yayā tadakṣaramadhigamyate ||",
          translation:
            "Of these, the lower is: the Ṛg, Yajur, Sāma, Atharva Vedas; phonetics, ritual code, grammar, etymology, metrics, and astronomy. The higher is that by which the Imperishable is known.",
          hindi:
            'इनमें अपरा विद्या है — ऋग्वेद, यजुर्वेद, सामवेद, अथर्ववेद; शिक्षा, कल्प, व्याकरण, निरुक्त, छन्द, और ज्योतिष। और परा विद्या वह है जिससे अक्षर का बोध होता है।',
          explanation:
            "Strikingly, even the Vedas are classified as 'lower knowledge.' This is not denigration but clarification: the Vedas prepare the mind and point toward the Absolute, but the realization itself is direct, not propositional.",
          science:
            "Map versus territory: all texts, theories, and scriptures are maps. The highest knowing is unmediated acquaintance with the terrain itself — what Bertrand Russell called 'knowledge by acquaintance.'",
          lifeLesson:
            "All the books you have read, all the lectures you have attended — they are pointers, not destinations. Do not confuse the menu with the meal. At some point, set down the book and simply be.",
          keywords: ["Apara", "Vedas", "Limit"],
        },
        {
          id: 6,
          sanskrit:
            "यत्तदद्रेश्यमग्राह्यमगोत्रमवर्णमचक्षुःश्रोत्रं तदपाणिपादम् | नित्यं विभुं सर्वगतं सुसूक्ष्मं तदव्ययं यद्भूतयोनिं परिपश्यन्ति धीराः ||",
          transliteration:
            "yattadadreśyamagrāhyamagotramavarṇamacakṣuḥśrotraṃ tadapāṇipādam | nityaṃ vibhuṃ sarvagataṃ susūkṣmaṃ tadavyayaṃ yadbhūtayoniṃ paripaśyanti dhīrāḥ ||",
          translation:
            "That which is unseen, ungraspable, without family, without color, without eye or ear, without hands or feet — eternal, all-pervading, omnipresent, exceedingly subtle, undecaying, the womb of all beings — that the wise see.",
          hindi:
            'जो अदृश्य, अग्राह्य, गोत्र-रहित, वर्ण-रहित, नेत्र-कान-रहित, हाथ-पाँव-रहित, नित्य, विभु, सर्वगत, अत्यन्त सूक्ष्म, अव्यय, सब प्राणियों का उद्गम है — उसी का दर्शन धीर पुरुष करते हैं।',
          explanation:
            "Brahman is described entirely by negation — beyond every sense-quality and bodily attribute — and then positively: eternal, all-pervading, the womb (yoni) of all beings. Wisdom (dhīra) is the capacity to see by both methods at once.",
          science:
            "Quantum field theory: the underlying field has none of the macroscopic properties of objects, yet is the substrate from which all observable phenomena emerge. The Upanishad's apophatic-then-cataphatic description matches the physicist's vocabulary.",
          lifeLesson:
            "Practice the via negativa: when you want to know yourself most deeply, list what you are NOT (this body, this thought, this role) until only the witness remains. Then rest there.",
          keywords: ["BeyondAttributes", "Imperishable", "Womb"],
        },
        {
          id: 7,
          sanskrit:
            "यथोर्णनाभिः सृजते गृह्णते च यथा पृथिव्यामोषधयः सम्भवन्ति | यथा सतः पुरुषात्केशलोमानि तथाऽक्षरात्सम्भवतीह विश्वम् ||",
          transliteration:
            "yathorṇanābhiḥ sṛjate gṛhṇate ca yathā pṛthivyāmoṣadhayaḥ sambhavanti | yathā sataḥ puruṣātkeśalomāni tathā'kṣarātsambhavatīha viśvam ||",
          translation:
            "As a spider extends and withdraws its web, as plants spring forth from the earth, as hair grows from a living person — so from the Imperishable arises this world.",
          hindi:
            'जैसे मकड़ी अपना जाला फैलाती और समेट लेती है, जैसे पृथ्वी से पौधे उगते हैं, जैसे जीवित मनुष्य से बाल और रोम उत्पन्न होते हैं — वैसे ही अक्षर से यह विश्व प्रकट होता है।',
          explanation:
            "Three analogies for cosmic emergence. Each shows that the world is not 'made' from outside but arises from within the substrate — like a web from the spider's own body, plants from earth, hair from a person. Creator and creation share substance.",
          science:
            "Cosmology: the universe emerges from its own substrate (the quantum vacuum) rather than being assembled from external parts. Self-organization is the principle. The Upanishad's spider-web image is the most accurate metaphor known.",
          lifeLesson:
            "What you produce — work, art, children — comes from your own substance. Notice this when you create. The web is the spider's self extruded; honor it.",
          keywords: ["Spider", "Emergence", "Web"],
        },
        {
          id: 8,
          sanskrit:
            "तपसा चीयते ब्रह्म ततोऽन्नमभिजायते | अन्नात्प्राणो मनः सत्यं लोकाः कर्मसु चामृतम् ||",
          transliteration:
            "tapasā cīyate brahma tato'nnamabhijāyate | annātprāṇo manaḥ satyaṃ lokāḥ karmasu cāmṛtam ||",
          translation:
            "By tapas Brahman is heaped up; from that, food (matter) is born. From food: prāṇa, mind, truth, worlds, and the immortal in actions.",
          hindi:
            'तप से ब्रह्म संचित होता है; उससे अन्न उत्पन्न होता है। अन्न से — प्राण, मन, सत्य, लोक, और कर्मों में अमृत।',
          explanation:
            "The cosmogonic cascade: tapas (cosmic heat/concentration) → annaṃ (matter) → prāṇa, mind, truth, worlds, the immortal-in-actions. Creation runs from the most concentrated to the most extended.",
          science:
            "Inflationary cosmology: a concentrated initial state expands through stages — energy condenses into particles, particles into atoms, atoms into matter, matter into structures. The Upanishad's sequence matches the physical timeline.",
          lifeLesson:
            "Every creative project starts with concentrated heat (tapas). Without it, no matter precipitates. Honor the initial concentration — don't dilute it too soon.",
          keywords: ["Tapas", "Cascade", "Cosmogony"],
        },
        {
          id: 9,
          sanskrit:
            "यः सर्वज्ञः सर्वविद्यस्य ज्ञानमयं तपः | तस्मादेतद्ब्रह्म नाम रूपमन्नं च जायते ||",
          transliteration:
            "yaḥ sarvajñaḥ sarvavidyasya jñānamayaṃ tapaḥ | tasmādetadbrahma nāma rūpamannaṃ ca jāyate ||",
          translation:
            "The omniscient, all-knowing — whose tapas is itself made of knowledge — from him this Brahman, name, form, and food are born.",
          hindi:
            'जो सर्वज्ञ है, सब विद्या का धारक है, जिसका तप ज्ञानमय है — उसी से यह ब्रह्म, नाम, रूप और अन्न उत्पन्न होते हैं।',
          explanation:
            "Closing verse of the first khaṇḍa. The source is not blind energy but 'knowledge-tapas' — concentrated awareness. From this awareness emerge the conventional categories: Brahman (the substance), name, form, food. Reality is grounded in intelligibility.",
          science:
            "Information theory (Wheeler's 'it from bit'): information may be more fundamental than matter or energy. The Upanishad's 'jñānamaya tapas' is an early statement of this same intuition.",
          lifeLesson:
            "What you concentrate on, you summon into being — at least into your experience. Your attention is generative. Spend it like the precious substance it is.",
          keywords: ["Omniscient", "Knowledge", "Origin"],
        },
      ],
    },
    {
      id: 2,
      title: "Muṇḍaka 1, Khaṇḍa 2 — The Limit of Rituals",
      titleSanskrit: "प्रथम मुण्डक · द्वितीय खण्ड",
      summary:
        "13 mantras. The Upanishad acknowledges ritual fire-worship and its rewards, then mounts a precise critique: rites are 'unsteady boats' that carry the seeker only to perishable heavens. True liberation requires renunciation and direct inquiry — approach a guru, fuel in hand, who is rooted in both scripture and Brahman.",
      verses: [
        {
          id: 1,
          sanskrit:
            "तदेतत्सत्यं मन्त्रेषु कर्माणि कवयो यान्यपश्यंस्तानि त्रेतायां बहुधा सन्ततानि | तान्याचरथ नियतं सत्यकामा एष वः पन्थाः सुकृतस्य लोके ||",
          transliteration:
            "tadetatsatyaṃ mantreṣu karmāṇi kavayo yānyapaśyaṃstāni tretāyāṃ bahudhā santatāni | tānyācaratha niyataṃ satyakāmā eṣa vaḥ panthāḥ sukṛtasya loke ||",
          translation:
            "This is the truth: the rites which the seers perceived in the mantras were variously spread through the three (Vedas). Practice them regularly, lovers of truth — that is your path to the world of good works.",
          hindi:
            'यह सत्य है — जिन कर्मों को कवियों ने मन्त्रों में देखा, वे तीनों वेदों में अनेक रूपों में फैले हैं। उनका पालन नियमित करो, हे सत्यकाम — यही तुम्हारा सुकृत-लोक का मार्ग है।',
          explanation:
            "Before critiquing ritual, the Upanishad affirms it. The rites are real; they produce real fruit; they belong to a valid path — the 'world of good works.' What follows is not rejection but ranking.",
          science:
            "Ritual research (Bell, Rappaport): structured ceremony produces measurable psychological and social benefits — coherence, identity, transmission. The Upanishad acknowledges what anthropology has confirmed.",
          lifeLesson:
            "Maintain your rituals — they are not superstition but the architecture of meaning. But know what they can and cannot do. The next mantras will be precise about the limit.",
          keywords: ["Ritual", "GoodWorks", "Path"],
        },
        {
          id: 2,
          sanskrit:
            "यदा लेलायते ह्यर्चिः समिद्धे हव्यवाहने | तदाज्यभागावन्तरेणाहुतीः प्रतिपादयेच्छ्रद्धया हुताः ||",
          transliteration:
            "yadā lelāyate hyarciḥ samiddhe havyavāhane | tadājyabhāgāvantareṇāhutīḥ pratipādayecchraddhayā hutāḥ ||",
          translation:
            "When the flame leaps up in the well-kindled fire, then between the two clarified-butter portions, with faith, one should offer the oblations.",
          hindi:
            'जब समिद्ध हव्यवाहन (अग्नि) में अर्चि (लौ) लहराने लगे, तब दोनों आज्य-भागों के बीच श्रद्धा-पूर्वक आहुतियाँ अर्पित करे।',
          explanation:
            "Precise ritual instruction. Even within the ritual world, technique matters — timing, kindling, attentional state. The verse models the seriousness with which the Upanishad takes its predecessor traditions.",
          science:
            "Ritual efficacy research: the precision of execution correlates with the subjective and social impact. Lazy ritual produces lazy fruit.",
          lifeLesson:
            "Whatever practice you perform — exercise, prayer, journaling — do it with attention. Half-attentive practice grows half-attentive results.",
          keywords: ["Fire", "Offering", "Precision"],
        },
        {
          id: 3,
          sanskrit:
            "यस्याग्निहोत्रमदर्शमपौर्णमासमचातुर्मास्यमनाग्रयणमतिथिवर्जितं च | अहुतमवैश्वदेवमविधिना हुतमासप्तमांस्तस्य लोकान् हिनस्ति ||",
          transliteration:
            "yasyāgnihotramadarśamapaurṇamāsamacāturmāsyamanāgrayaṇamatithivarjitaṃ ca | ahutamavaiśvadevamavidhinā hutamāsaptamāṃstasya lokān hinasti ||",
          translation:
            "He whose Agnihotra is without the new-moon, full-moon, four-monthly, first-fruits rites, without the guest-offering, without the Vaiśvadeva, or offered without proper rule — destroys his worlds up to the seventh.",
          hindi:
            'जिसका अग्निहोत्र दर्श, पौर्णमास, चातुर्मास्य, आग्रयण, अतिथि-यज्ञ, वैश्वदेव — इन सबसे रहित हो, या विधि-विरुद्ध हो — वह अपने सातवें लोक तक के पुण्य को नष्ट कर देता है।',
          explanation:
            "Strong warning: corrupt ritual is worse than no ritual. The full liturgical calendar is enumerated. Skipping or distorting any element damages even one's distant ancestors and descendants.",
          science:
            "Integrity of practice matters more than presence of practice. A half-kept commitment can be worse than no commitment, because it teaches the mind that commitments do not bind.",
          lifeLesson:
            "If you cannot keep a commitment fully, downsize it rather than corrupt it. A small, completely-kept practice outvalues a large, partially-kept one.",
          keywords: ["Integrity", "Liturgy", "Warning"],
        },
        {
          id: 4,
          sanskrit:
            "काली कराली च मनोजवा च सुलोहिता या च सुधूम्रवर्णा | स्फुलिङ्गिनी विश्वरूची च देवी लेलायमाना इति सप्त जिह्वाः ||",
          transliteration:
            "kālī karālī ca manojavā ca sulohitā yā ca sudhūmravarṇā | sphuliṅginī viśvarūcī ca devī lelāyamānā iti sapta jihvāḥ ||",
          translation:
            "Black, terrible, mind-swift, very-red, smoke-colored, sparkling, all-shining — these flickering ones are the seven tongues (of fire).",
          hindi:
            'काली, कराली, मनोजवा, सुलोहिता, सुधूम्रवर्णा, स्फुलिङ्गिनी, और विश्वरूची — ये सात जिह्वाएँ हैं जो अग्नि में लहराती हैं।',
          explanation:
            "The seven personified flames of the sacrificial fire. Each represents a distinct quality of fire (color, speed, intensity). Ritual is precise: even the flame is differentiated and recognized.",
          science:
            "Fire-emission spectroscopy: different temperatures and chemical compositions produce different flame colors. The Upanishad poetizes what spectroscopy quantifies.",
          lifeLesson:
            "Pay attention to the qualities of phenomena. A flame is not just 'fire' — it has color, speed, intensity. Refining perception is a spiritual discipline.",
          keywords: ["SevenFlames", "Fire", "Detail"],
        },
        {
          id: 5,
          sanskrit:
            "एतेषु यश्चरते भ्राजमानेषु यथाकालं चाहुतयो ह्याददायन् | तं नयन्त्येताः सूर्यस्य रश्मयो यत्र देवानां पतिरेकोऽधिवासः ||",
          transliteration:
            "eteṣu yaścarate bhrājamāneṣu yathākālaṃ cāhutayo hyādadāyan | taṃ nayantyetāḥ sūryasya raśmayo yatra devānāṃ patirekoʼdhivāsaḥ ||",
          translation:
            "He who performs offerings in these blazing flames at the proper time, his offerings, riding on the rays of the sun, carry him to where the one lord of the gods dwells.",
          hindi:
            'जो इन प्रज्वलित जिह्वाओं में यथा-काल आहुतियाँ देता है — उसकी आहुतियाँ उसे सूर्य की किरणों पर बैठाकर वहाँ ले जाती हैं जहाँ देवों के एक पति (इन्द्र) का निवास है।',
          explanation:
            "The ritualist who performs correctly is carried, by his own offerings transformed into solar rays, to the heaven of the gods. Beautiful imagery: action becomes light becomes vehicle.",
          science:
            "Information theory: every act leaves a trace. The Upanishad poeticizes the truth that actions accumulate as a trajectory that carries the actor forward.",
          lifeLesson:
            "Your actions become your rays. They will carry you where you do not yet know. Choose accordingly today.",
          keywords: ["Offerings", "Rays", "Heaven"],
        },
        {
          id: 6,
          sanskrit:
            "एह्येहीति तमाहुतयः सुवर्चसः सूर्यस्य रश्मिभिर्यजमानं वहन्ति | प्रियां वाचमभिवदन्त्योऽर्चयन्त्य एष वः पुण्यः सुकृतो ब्रह्मलोकः ||",
          transliteration:
            "ehyehīti tamāhutayaḥ suvarcasaḥ sūryasya raśmibhiryajamānaṃ vahanti | priyāṃ vācamabhivadantyo'rcayantya eṣa vaḥ puṇyaḥ sukṛto brahmalokaḥ ||",
          translation:
            "'Come! Come!' — saying these sweet words, the radiant offerings carry the sacrificer by the rays of the sun, praising and honoring him: 'This is your meritorious, well-earned world of Brahman.'",
          hindi:
            '"आओ! आओ!" — इस प्रकार सुन्दर वाणी से, सूर्य की किरणों पर तेजस्वी आहुतियाँ यजमान को ले जाती हैं, उसकी स्तुति-अर्चना करती हुई — "यह तुम्हारा पुण्य-संचित ब्रह्मलोक है।"',
          explanation:
            "A vivid scene of arrival: the offerings welcome their sender. The 'brahma-loka' here is a relative one — the heaven earned by works, not the absolute Brahman of liberation. The distinction will be sharpened in the next mantra.",
          science:
            "Reward-system research: chosen actions produce internal reward states that themselves shape future choices. The 'welcoming offerings' is the felt-sense of cumulative virtue.",
          lifeLesson:
            "Imagine your present actions welcoming you when their consequences arrive. Would they sweetly welcome or coldly reproach? Live accordingly.",
          keywords: ["BrahmaLoka", "Reward", "Welcome"],
        },
        {
          id: 7,
          sanskrit:
            "प्लवा ह्येते अदृढा यज्ञरूपा अष्टादशोक्तमवरं येषु कर्म | एतच्छ्रेयो येऽभिनन्दन्ति मूढा जरामृत्युं ते पुनरेवापि यन्ति ||",
          transliteration:
            "plavā hyete adṛḍhā yajñarūpā aṣṭādaśoktamavaraṃ yeṣu karma | etacchreyo ye'bhinandanti mūḍhā jarāmṛtyuṃ te punarevāpi yanti ||",
          translation:
            "But these forms of sacrifice are unsteady rafts; the eighteen rites are inferior works. Fools who praise this as the highest good return again to old age and death.",
          hindi:
            'परन्तु ये यज्ञ-रूप अस्थिर नौकाएँ हैं; इनमें वर्णित अष्टादश कर्म अपर हैं। मूढ़ लोग जो इसी को श्रेयस् मानते हैं, वे फिर जरा-मृत्यु को प्राप्त होते हैं।',
          explanation:
            "The decisive critique. Even the most exalted ritual is an 'unsteady raft' — it will deliver one to a heaven, but heavens themselves are temporary. From them, one returns. To stop at ritual is to mistake the boat for the destination.",
          science:
            "All systems with finite inputs produce finite outputs. Ritual is a finite-input practice; it cannot, by structure, produce infinite output. The Upanishad recognizes a structural truth.",
          lifeLesson:
            "Beware practices that produce results — even good results — that fade. They are stepping-stones, not destinations. The question is always: what comes after?",
          keywords: ["UnsteadyRaft", "Limit", "Return"],
        },
        {
          id: 8,
          sanskrit:
            "अविद्यायामन्तरे वर्तमानाः स्वयं धीराः पण्डितंमन्यमानाः | जङ्घन्यमानाः परियन्ति मूढा अन्धेनैव नीयमाना यथान्धाः ||",
          transliteration:
            "avidyāyāmantare vartamānāḥ svayaṃ dhīrāḥ paṇḍitaṃmanyamānāḥ | jaṅghanyamānāḥ pariyanti mūḍhā andhenaiva nīyamānā yathāndhāḥ ||",
          translation:
            "Living in the midst of ignorance, considering themselves wise and learned, the fools wander, struck again and again — like blind men led by the blind.",
          hindi:
            'अविद्या के बीच रहते हुए स्वयं को धीर और पण्डित मानते हुए — वे मूढ़ बारम्बार ठोकर खाते भटकते हैं, जैसे अन्धों के द्वारा ले जाये जाने वाले अन्धे।',
          explanation:
            "The 'blind leading the blind' image — one of the world's oldest. Confidence without genuine insight is doubly dangerous: it misleads the confident and those who follow them.",
          science:
            "Dunning-Kruger meets institutional knowledge transfer: confidently mistaken teachers produce confidently mistaken students. The error compounds across generations.",
          lifeLesson:
            "When confidence runs ahead of demonstrated insight, slow down. The same applies to your own teaching and parenting: do not pass on what you do not yourself know.",
          keywords: ["Avidya", "BlindLeading", "FalseWisdom"],
        },
        {
          id: 9,
          sanskrit:
            "अविद्यायां बहुधा वर्तमाना वयं कृतार्था इत्यभिमन्यन्ति बालाः | यत् कर्मिणो न प्रवेदयन्ति रागात्तेनातुराः क्षीणलोकाश्च्यवन्ते ||",
          transliteration:
            "avidyāyāṃ bahudhā vartamānā vayaṃ kṛtārthā ityabhimanyanti bālāḥ | yat karmiṇo na pravedayanti rāgāttenāturāḥ kṣīṇalokāścyavante ||",
          translation:
            "Living variously in ignorance, the immature think: 'We have done what is to be done.' But the ritualists, through attachment, do not understand, and when their merit is exhausted they fall away, broken.",
          hindi:
            'अविद्या में अनेक रूपों से जीते हुए बाल-बुद्धि लोग सोचते हैं — "हम कृतार्थ हो गए।" परन्तु आसक्ति के कारण ये कर्मी सच्चा ज्ञान नहीं पाते; पुण्य-क्षय होने पर वे आर्त होकर गिर पड़ते हैं।',
          explanation:
            "Self-satisfaction is the disease. 'I have done what was to be done' is the dangerous sentence. Attachment to the fruit prevents recognition of the fruit's exhaustion. When merit ends, the satisfied fall.",
          science:
            "Satisfaction with limited success blocks pursuit of deeper success. Behavioral economics: 'satisficing' is efficient short-term but limits long-term growth.",
          lifeLesson:
            "Periodically ask: 'is what I am doing the deepest version of what I could be doing?' Self-congratulation is the polite face of stagnation.",
          keywords: ["Complacency", "Attachment", "Fall"],
        },
        {
          id: 10,
          sanskrit:
            "इष्टापूर्तं मन्यमाना वरिष्ठं नान्यच्छ्रेयो वेदयन्ते प्रमूढाः | नाकस्य पृष्ठे ते सुकृतेऽनुभूत्वेमं लोकं हीनतरं वा विशन्ति ||",
          transliteration:
            "iṣṭāpūrtaṃ manyamānā variṣṭhaṃ nānyacchreyo vedayante pramūḍhāḥ | nākasya pṛṣṭhe te sukṛte'nubhūtvemaṃ lokaṃ hīnataraṃ vā viśanti ||",
          translation:
            "Considering rites and public works the highest, deluded — they know no greater good. Having enjoyed merit on the back of heaven, they enter this world again, or one lower.",
          hindi:
            'इष्टापूर्त (यज्ञ और लोक-कल्याण) को ही श्रेष्ठ मानते हुए — ये प्रमूढ़ लोग और कोई श्रेयस् नहीं जानते। स्वर्ग के पृष्ठ पर पुण्य का भोग कर — वे फिर इसी लोक में, या इससे भी निम्न में, आ जाते हैं।',
          explanation:
            "Even philanthropy and public works (pūrta) are placed in the 'lower' category if undertaken without Self-knowledge. The Upanishad is uncompromising: relative good is not the supreme good.",
          science:
            "Without internal transformation, external good works can become a way of avoiding inner inquiry. The 'doing-good as escape' pattern is well-documented in burnout research.",
          lifeLesson:
            "Do good in the world — and also do the inner work. The two together are unbreakable. Either alone is fragile.",
          keywords: ["Philanthropy", "Heaven", "Cycle"],
        },
        {
          id: 11,
          sanskrit:
            "तपःश्रद्धे ये ह्युपवसन्त्यरण्ये शान्ता विद्वांसो भैक्ष्यचर्यां चरन्तः | सूर्यद्वारेण ते विरजाः प्रयान्ति यत्रामृतः स पुरुषो ह्यव्ययात्मा ||",
          transliteration:
            "tapaḥśraddhe ye hyupavasantyaraṇye śāntā vidvāṃso bhaikṣyacaryāṃ carantaḥ | sūryadvāreṇa te virajāḥ prayānti yatrāmṛtaḥ sa puruṣo hyavyayātmā ||",
          translation:
            "Those who dwell in the forest with austerity and faith, calm, wise, living by alms — they go, free of dust, through the gate of the sun to where dwells the immortal, undecaying Person.",
          hindi:
            'जो तप और श्रद्धा सहित वन में निवास करते हैं — शान्त, विद्वान्, भिक्षाचर्य करते हुए — वे विरज (निर्दोष) होकर सूर्य-द्वार से उस लोक में जाते हैं जहाँ अमर अव्यय आत्मा निवास करता है।',
          explanation:
            "Contrasting destination. The renunciate path: forest, alms, calm, learning. Such seekers depart through the 'gate of the sun' — the higher path — to the realm of the immortal Person.",
          science:
            "Voluntary simplicity research (Elgin, Andrews): reduced consumption combined with intentional living correlates with higher life-satisfaction and stronger meaning-making.",
          lifeLesson:
            "You don't need to renounce the world to live by these principles — but find your own forest. A daily hour of simplicity, silence, and study is the modern equivalent.",
          keywords: ["Renunciation", "SunGate", "Immortal"],
        },
        {
          id: 12,
          sanskrit:
            "परीक्ष्य लोकान् कर्मचितान् ब्राह्मणो निर्वेदमायान्नास्त्यकृतः कृतेन | तद्विज्ञानार्थं स गुरुमेवाभिगच्छेत् समित्पाणिः श्रोत्रियं ब्रह्मनिष्ठम् ||",
          transliteration:
            "parīkṣya lokān karmacitān brāhmaṇo nirvedamāyānnāstyakṛtaḥ kṛtena | tadvijñānārthaṃ sa gurumevābhigacchet samitpāṇiḥ śrotriyaṃ brahmaniṣṭham ||",
          translation:
            "Having examined the worlds built by works, a brāhmaṇa attains dispassion: 'The uncreated cannot be reached by what is made.' For that knowledge, fuel in hand, he must approach a teacher — learned in scripture and rooted in Brahman.",
          hindi:
            'कर्म से बने हुए लोकों की परीक्षा करके ब्राह्मण निर्वेद को प्राप्त होता है — "अकृत वस्तु कृत से प्राप्त नहीं होती।" उस ज्ञान के लिये वह समिधा हाथ में लेकर श्रोत्रिय और ब्रह्मनिष्ठ गुरु के पास जाये।',
          explanation:
            "One of the most decisive verses in all Upanishadic literature. After examining what works can achieve, the seeker sees: the unmade cannot be made by doing. He must approach a teacher who is both śrotriya (scripturally learned) and brahma-niṣṭha (established in Brahman) — both qualifications, not one.",
          science:
            "Mentorship research: the most effective teachers combine technical mastery with embodied practice. Either alone is insufficient. The Upanishad specifies the same dual standard.",
          lifeLesson:
            "When choosing a teacher, demand both: do they know the texts AND do they live the teaching? Either alone leaves you incomplete.",
          keywords: ["Guru", "Dispassion", "Approach"],
        },
        {
          id: 13,
          sanskrit:
            "तस्मै स विद्वानुपसन्नाय सम्यक्प्रशान्तचित्ताय शमान्विताय | येनाक्षरं पुरुषं वेद सत्यं प्रोवाच तां तत्त्वतो ब्रह्मविद्याम् ||",
          transliteration:
            "tasmai sa vidvānupasannāya samyakpraśāntacittāya śamānvitāya | yenākṣaraṃ puruṣaṃ veda satyaṃ provāca tāṃ tattvato brahmavidyām ||",
          translation:
            "To him, properly approached, with serene mind and self-mastery, the wise teacher reveals truly that knowledge of Brahman, by which one knows the imperishable Person, the True.",
          hindi:
            'उस गुरु ने — जो विद्वान् है — विधिवत् उपसन्न, प्रशान्त-चित्त, शम-युक्त उस शिष्य को — सत्य रूप से वह ब्रह्मविद्या यथार्थतः कही जिससे अक्षर पुरुष का बोध होता है।',
          explanation:
            "The first Muṇḍaka closes with the moment of transmission. The teacher gives the teaching to the student who arrives with serene mind and self-mastery. Note: the student must already have these qualities — they cannot be granted by the teacher.",
          science:
            "Educational psychology: 'transfer of knowledge' requires both teacher-readiness and student-readiness. The receiving vessel must be prepared.",
          lifeLesson:
            "Before seeking a teacher, prepare yourself. A calm mind and a measure of self-mastery are the entry fee for any deep teaching.",
          keywords: ["Transmission", "Readiness", "BrahmaVidya"],
        },
      ],
    },
    {
      id: 3,
      title: "Muṇḍaka 2, Khaṇḍa 1 — The Imperishable and Its Emanations",
      titleSanskrit: "द्वितीय मुण्डक · प्रथम खण्ड",
      summary:
        "10 mantras. From the Imperishable, as sparks from a blazing fire, all beings arise and to it return. The Person — heavenly, bodiless, unborn — is the source. From him: prāṇa, mind, senses, the five elements, the Vedas, the seven prāṇas, all worlds, all rivers and mountains. He is in the heart-cave; knowing him cuts the knot of ignorance.",
      verses: [
        {
          id: 1,
          sanskrit:
            "तदेतत्सत्यं यथा सुदीप्तात्पावकाद्विस्फुलिङ्गाः सहस्रशः प्रभवन्ते सरूपाः | तथाक्षराद्विविधाः सोम्य भावाः प्रजायन्ते तत्र चैवापि यन्ति ||",
          transliteration:
            "tadetatsatyaṃ yathā sudīptātpāvakādvisphuliṅgāḥ sahasraśaḥ prabhavante sarūpāḥ | tathākṣarādvividhāḥ somya bhāvāḥ prajāyante tatra caivāpi yanti ||",
          translation:
            "This is the truth: as from a blazing fire thousands of sparks arise, each of like nature with the fire — so, dear one, from the Imperishable, various beings arise and into it again return.",
          hindi:
            'यह सत्य है — जैसे प्रज्वलित अग्नि से सहस्रों सरूप स्फुलिङ्ग निकलते हैं, वैसे ही, हे सौम्य! अक्षर से विविध भाव उत्पन्न होते हैं और उसी में लौट जाते हैं।',
          explanation:
            "The famous spark-and-fire image. Beings are not 'made' by the Imperishable — they are emanations of the same substance, like sparks of the same fire. Identity precedes division.",
          science:
            "Modern cosmology: all particles are excitations of the same underlying quantum fields. The 'sparks' image is mathematically precise — each particle is the same field, locally concentrated.",
          lifeLesson:
            "You and every other being share the substance of the source. Hatred, contempt, or dehumanization requires forgetting this. Practice remembering it in small encounters.",
          keywords: ["Sparks", "Emanation", "Imperishable"],
        },
        {
          id: 2,
          sanskrit:
            "दिव्यो ह्यमूर्तः पुरुषः स बाह्याभ्यन्तरो ह्यजः | अप्राणो ह्यमनाः शुभ्रो ह्यक्षरात् परतः परः ||",
          transliteration:
            "divyo hyamūrtaḥ puruṣaḥ sa bāhyābhyantaro hyajaḥ | aprāṇo hyamanāḥ śubhro hyakṣarāt parataḥ paraḥ ||",
          translation:
            "Heavenly, bodiless, the Person — outer and inner — unborn, without breath, without mind, pure, higher than the higher Imperishable.",
          hindi:
            'दिव्य, अमूर्त, पुरुष — बाह्य और आन्तरिक दोनों, अजन्मा — प्राण-रहित, मन-रहित, शुभ्र — अक्षर से भी परे, परम।',
          explanation:
            "A dense cascade of negations: bodiless, unborn, breathless, mindless, pure. And a positive: heavenly, the Person, both outer and inner, beyond even the Imperishable as commonly conceived. Brahman as the ultimate substrate.",
          science:
            "The 'theory of everything' search: physicists hope for a single principle from which all forces and matter follow. The Upanishad's Puruṣa is the philosophical analog — the irreducible ground.",
          lifeLesson:
            "When meditating, do not fixate on any quality. The deepest reality has no quality. Rest in the qualityless awareness behind every qualification.",
          keywords: ["Heavenly", "Negations", "Beyond"],
        },
        {
          id: 3,
          sanskrit:
            "एतस्माज्जायते प्राणो मनः सर्वेन्द्रियाणि च | खं वायुर्ज्योतिरापः पृथिवी विश्वस्य धारिणी ||",
          transliteration:
            "etasmājjāyate prāṇo manaḥ sarvendriyāṇi ca | khaṃ vāyurjyotirāpaḥ pṛthivī viśvasya dhāriṇī ||",
          translation:
            "From him are born prāṇa, mind, all the senses; space, air, fire, water, and earth — the supporter of all.",
          hindi:
            'इसी से उत्पन्न होते हैं — प्राण, मन, सब इन्द्रियाँ; आकाश, वायु, अग्नि, जल, और पृथ्वी जो विश्व को धारण करती है।',
          explanation:
            "The cosmological cascade. From the Puruṣa: vital force, cognitive faculty, sensory channels, the five elements in subtle-to-gross order. The order is significant — life and mind precede matter, not the other way round.",
          science:
            "The 'consciousness-first' hypothesis (Goff, Kastrup, Hoffman): some philosophers and physicists now argue consciousness is more fundamental than matter. The Upanishad has held this view for 3000 years.",
          lifeLesson:
            "Honor mind over matter — not by ignoring matter but by recognizing that the order of priority runs from awareness to body, not the reverse.",
          keywords: ["Emanation", "Elements", "Order"],
        },
        {
          id: 4,
          sanskrit:
            "अग्निर्मूर्धा चक्षुषी चन्द्रसूर्यौ दिशः श्रोत्रे वाग्विवृताश्च वेदाः | वायुः प्राणो हृदयं विश्वमस्य पद्भ्यां पृथिवी ह्येष सर्वभूतान्तरात्मा ||",
          transliteration:
            "agnirmūrdhā cakṣuṣī candrasūryau diśaḥ śrotre vāgvivṛtāśca vedāḥ | vāyuḥ prāṇo hṛdayaṃ viśvamasya padbhyāṃ pṛthivī hyeṣa sarvabhūtāntarātmā ||",
          translation:
            "Fire is his head; the sun and moon, his eyes; the directions, his ears; the revealed Vedas, his voice; air is his breath; the universe, his heart; the earth, his feet. He is the inner Self of all beings.",
          hindi:
            'अग्नि उसका मस्तक है; सूर्य-चन्द्र उसके दो नेत्र; दिशाएँ उसके श्रोत्र; प्रकट वेद उसकी वाणी; वायु उसका प्राण; विश्व उसका हृदय; पृथ्वी उसके चरण। वही सब प्राणियों का अन्तरात्मा है।',
          explanation:
            "The cosmic body of the Puruṣa. The universe is described as his anatomy. This is not metaphor only — it is an invitation to read the cosmos as a single Body of Awareness.",
          science:
            "Gaia hypothesis: Lovelock proposed that the Earth functions as a single self-regulating organism. The Upanishad extends this to the cosmos itself.",
          lifeLesson:
            "Look around: the sun and moon are eyes that see. The wind is breath. The earth, feet. When you remember this, walking becomes prayer.",
          keywords: ["CosmicBody", "Anatomy", "Inner"],
        },
        {
          id: 5,
          sanskrit:
            "तस्मादग्निः समिधो यस्य सूर्यः सोमात्पर्जन्य ओषधयः पृथिव्याम् | पुमान्रेतः सिञ्चति योषितायां बह्वीः प्रजाः पुरुषात् सम्प्रसूताः ||",
          transliteration:
            "tasmādagniḥ samidho yasya sūryaḥ somātparjanya oṣadhayaḥ pṛthivyām | pumānretaḥ siñcati yoṣitāyāṃ bahvīḥ prajāḥ puruṣāt samprasūtāḥ ||",
          translation:
            "From him: fire — its kindling is the sun. From the moon: rain. On earth: plants. Man pours seed into woman. Many creatures are born from the Person.",
          hindi:
            'उसी से अग्नि (यज्ञ) उत्पन्न होती है जिसकी समिधा सूर्य है; सोम से वर्षा; पृथ्वी पर औषधियाँ। पुरुष नारी में रेत बोता है; इस प्रकार पुरुष से अनेक प्रजाएँ उत्पन्न होती हैं।',
          explanation:
            "The chain of life: solar energy → rainfall → plant growth → animal nutrition → reproduction → many beings. All ultimately from the Puruṣa. The Upanishad sketches the ecological-reproductive web.",
          science:
            "The food chain (Lindeman, 1942) and the hydrological cycle (Halley, 17th c.) are described here in five lines. Vedic ecology is empirical.",
          lifeLesson:
            "Every meal you eat began in solar light, was watered by rain, lifted by soil, harvested by humans. Honor the chain by chewing slowly and saying thank you.",
          keywords: ["Chain", "Ecology", "Reproduction"],
        },
        {
          id: 6,
          sanskrit:
            "तस्मादृचः साम यजूंषि दीक्षा यज्ञाश्च सर्वे क्रतवो दक्षिणाश्च | संवत्सरश्च यजमानश्च लोकाः सोमो यत्र पवते यत्र सूर्यः ||",
          transliteration:
            "tasmādṛcaḥ sāma yajūṃṣi dīkṣā yajñāśca sarve kratavo dakṣiṇāśca | saṃvatsaraśca yajamānaśca lokāḥ somo yatra pavate yatra sūryaḥ ||",
          translation:
            "From him: the Ṛc, Sāman, and Yajus hymns; initiation, all sacrifices, all rites, all priestly fees; the year, the sacrificer, and the worlds where the moon and the sun shine.",
          hindi:
            'उसी से ऋच्, साम, यजुस्; दीक्षा, सब यज्ञ, सब क्रतु, सब दक्षिणाएँ; संवत्सर, यजमान, और वे लोक — जहाँ चन्द्रमा और सूर्य चमकते हैं।',
          explanation:
            "Cultural and cosmic life both emerge from the Puruṣa. The Vedas, rituals, social roles, and the celestial sphere are all his manifestation. There is no sacred/secular divide in this picture — both flow from one source.",
          science:
            "Anthropological complexity: cultural institutions and natural cycles co-evolved. The calendar, the harvest festival, the priesthood — all are forms of human attunement to nature.",
          lifeLesson:
            "When you participate in cultural life — a wedding, a holiday, a workplace — recognize it as flowing from the same source as the sunrise. Sacred and ordinary are not two.",
          keywords: ["Vedas", "Year", "Wholeness"],
        },
        {
          id: 7,
          sanskrit:
            "तस्माच्च देवा बहुधा सम्प्रसूताः साध्या मनुष्याः पशवो वयांसि | प्राणापानौ व्रीहियवौ तपश्च श्रद्धा सत्यं ब्रह्मचर्यं विधिश्च ||",
          transliteration:
            "tasmācca devā bahudhā samprasūtāḥ sādhyā manuṣyāḥ paśavo vayāṃsi | prāṇāpānau vrīhiyavau tapaśca śraddhā satyaṃ brahmacaryaṃ vidhiśca ||",
          translation:
            "From him are born manifold gods, sādhyas, humans, animals, birds; the in-breath and out-breath; rice and barley; tapas, faith, truth, celibacy, and rule.",
          hindi:
            'उसी से अनेक देवता, साध्य, मनुष्य, पशु, पक्षी; प्राण-अपान; व्रीहि-यव; तप, श्रद्धा, सत्य, ब्रह्मचर्य, और विधि — सब उत्पन्न होते हैं।',
          explanation:
            "Living beings (gods, humans, animals), basic biological processes (breath, breath; rice, barley), and ethical virtues (tapas, faith, truth, celibacy, discipline) all spring from one source. Nature and morality share substance.",
          science:
            "Evolutionary ethics: moral capacities themselves evolved through natural selection. Right and wrong are not external impositions on biological life — they emerged from within it. The Upanishad has the same intuition.",
          lifeLesson:
            "Treat virtues — truth, faith, self-mastery — not as 'extra' but as native expressions of your being. They are as natural as breath and bread.",
          keywords: ["Beings", "Virtues", "Source"],
        },
        {
          id: 8,
          sanskrit:
            "सप्त प्राणाः प्रभवन्ति तस्मात्सप्तार्चिषः समिधः सप्त होमाः | सप्त इमे लोका येषु चरन्ति प्राणा गुहाशया निहिताः सप्त सप्त ||",
          transliteration:
            "sapta prāṇāḥ prabhavanti tasmātsaptārciṣaḥ samidhaḥ sapta homāḥ | sapta ime lokā yeṣu caranti prāṇā guhāśayā nihitāḥ sapta sapta ||",
          translation:
            "From him spring the seven prāṇas, the seven flames, the seven fuels, the seven oblations, the seven worlds where the prāṇas move — placed seven by seven in the cave (of the heart).",
          hindi:
            'उसी से सात प्राण, सात अर्चियाँ, सात समिधाएँ, सात होम, सात लोक — जिनमें ये प्राण विचरते हैं — सात-सात रूप से हृदय-गुहा में निहित हैं।',
          explanation:
            "Seven repeats: prāṇas, flames, fuels, oblations, worlds. The number is symbolic — seven is the number of completeness (the seven sense-orifices in the head, the seven days, etc.). All sevens are held within the heart-cavity.",
          science:
            "The number seven recurs across human cognition (Miller's 'magical number seven plus or minus two' in short-term memory). Whether deeply meaningful or coincidental, the recurrence is striking.",
          lifeLesson:
            "Recognize how much is happening in the small space of your body. Seven systems, multiple cycles, countless processes — all hidden in a few feet of flesh. Awe is appropriate.",
          keywords: ["Seven", "Compression", "Heart"],
        },
        {
          id: 9,
          sanskrit:
            "अतः समुद्रा गिरयश्च सर्वेऽस्मात्स्यन्दन्ते सिन्धवः सर्वरूपाः | अतश्च सर्वा ओषधयो रसश्च येनैष भूतस्तिष्ठते ह्यन्तरात्मा ||",
          transliteration:
            "ataḥ samudrā girayaśca sarve'smātsyandante sindhavaḥ sarvarūpāḥ | ataśca sarvā oṣadhayo rasaśca yenaiṣa bhūtastiṣṭhate hyantarātmā ||",
          translation:
            "From him: all oceans and mountains; from him flow rivers of every kind; from him: all plants and their juices — by which this inner Self stands as embodied being.",
          hindi:
            'उसी से सब समुद्र और पर्वत; उसी से सब रूपों की नदियाँ बहती हैं; उसी से सब औषधियाँ और रस; जिसके द्वारा यह अन्तरात्मा भूत-रूप में स्थित रहता है।',
          explanation:
            "Geography flows from the Puruṣa: oceans, mountains, rivers, plants. The verse closes with a precise observation: the inner Self stands in the form of a body precisely because of these external supports. Inside and outside are one flow.",
          science:
            "Biogeochemical cycles: the same atoms cycle through oceans, mountains, rivers, plants, and bodies. The 'inner Self stands by the juices' is biochemically accurate.",
          lifeLesson:
            "Your body is held in being by rivers, plants, and oceans — by their cycles, you live. Care for the environment is care for your own substance.",
          keywords: ["Geography", "Cycles", "Embodiment"],
        },
        {
          id: 10,
          sanskrit:
            "पुरुष एवेदं विश्वं कर्म तपो ब्रह्म परामृतम् | एतद्यो वेद निहितं गुहायां सोऽविद्याग्रन्थिं विकिरतीह सोम्य ||",
          transliteration:
            "puruṣa evedaṃ viśvaṃ karma tapo brahma parāmṛtam | etadyo veda nihitaṃ guhāyāṃ so'vidyāgranthiṃ vikiratīha somya ||",
          translation:
            "The Person alone is all this — action, tapas, Brahman, the supreme nectar. He who knows this, hidden in the cave (of the heart), cuts the knot of ignorance, dear one, here in this very life.",
          hindi:
            'पुरुष ही यह सब विश्व है — कर्म, तप, ब्रह्म, परम अमृत। जो इसको हृदय-गुहा में निहित जानता है, वह, हे सौम्य! यहीं अविद्या की ग्रन्थि को छिन्न कर देता है।',
          explanation:
            "Closing verse of the khaṇḍa. The Puruṣa is identified with every level of being — actions, austerity, Brahman, nectar. To know him as 'hidden in the cave of the heart' is to cut the avidyā-knot in this very life — not in some future heaven.",
          science:
            "Insight-based therapies (ACT, mindfulness): durable change is achieved by recognition of what is already present, not by acquisition of what is missing. The 'cutting the knot' is the experiential moment of seeing through a false structure.",
          lifeLesson:
            "Liberation is not a distant achievement. It is the moment of recognition — and that moment is always available. Right now is sufficient.",
          keywords: ["Knot", "Cave", "Here"],
        },
      ],
    },
    {
      id: 4,
      title: "Muṇḍaka 2, Khaṇḍa 2 — The Bow and the Target",
      titleSanskrit: "द्वितीय मुण्डक · द्वितीय खण्ड",
      summary:
        "11 mantras. Brahman is manifest, near, moving in the heart-cave. With the Upaniṣadic bow drawn, OM as arrow, the Self as marksman — strike the Imperishable as target. In him are woven heaven, earth, mind, prāṇas. He is the bridge to immortality. Knowing him, the heart-knot breaks; doubts are cut; karmas dissolve.",
      verses: [
        {
          id: 1,
          sanskrit:
            "आविः सन्निहितं गुहाचरं नाम महत्पदमत्रैतत् समर्पितम् | एजत्प्राणन्निमिषच्च यदेतज्जानथ सदसद्वरेण्यं परं विज्ञानाद्यद्वरिष्ठं प्रजानाम् ||",
          transliteration:
            "āviḥ sannihitaṃ guhācaraṃ nāma mahatpadamatraitat samarpitam | ejatprāṇannimiṣacca yadetajjānatha sadasadvareṇyaṃ paraṃ vijñānādyadvariṣṭhaṃ prajānām ||",
          translation:
            "Manifest, close at hand, moving in the cave — the great abode is set right here. All this is supported in it — what moves, what breathes, what blinks. Know it as both being and non-being, the supremely desirable, beyond cognition, the highest of all in creatures.",
          hindi:
            'प्रकट, निकट स्थित, गुहा-चर — महान् पद यहीं समर्पित है। जो चलता, साँस लेता, पलक झपकाता है — सब उसी में आधारित है। उसे जानो — सत् और असत्, परम वरेण्य, विज्ञान से परे, प्रजाओं में परम।',
          explanation:
            "Brahman is not distant. He is manifest (āviḥ), close at hand (sannihita), moving in the heart-cave (guhā-cara). The entire phenomenal world — moving, breathing, blinking — is supported in him. He is sat (being) and asat (non-being), beyond conventional cognition.",
          science:
            "The 'panentheism' of modern process philosophy: the divine is both immanent (in everything) and transcendent (more than everything). The Upanishad articulates this nuanced position precisely.",
          lifeLesson:
            "Stop looking for the sacred 'elsewhere.' It moves in the cave of your own heart, manifest in every blink, breath, and movement. Look closer.",
          keywords: ["Manifest", "Cave", "Both"],
        },
        {
          id: 2,
          sanskrit:
            "यदर्चिमद्यदणुभ्योऽणु च यस्मिँल्लोका निहिता लोकिनश्च | तदेतदक्षरं ब्रह्म स प्राणस्तदु वाङ्मनः | तदेतत्सत्यं तदमृतं तद्वेद्धव्यं सोम्य विद्धि ||",
          transliteration:
            "yadarcimadyadaṇubhyo'ṇu ca yasmiṃlokā nihitā lokinaśca | tadetadakṣaraṃ brahma sa prāṇastadu vāṅmanaḥ | tadetatsatyaṃ tadamṛtaṃ tadveddhavyaṃ somya viddhi ||",
          translation:
            "Radiant, smaller than the smallest, in whom the worlds and their inhabitants are set — that is the imperishable Brahman. It is prāṇa, it is speech, it is mind. It is the True, the Immortal. Pierce it, dear one — know it.",
          hindi:
            'जो ज्योतिर्मय है, अणु से भी सूक्ष्म, जिसमें लोक और उनके निवासी निहित हैं — वही अक्षर ब्रह्म है। वह प्राण है, वह वाणी, वह मन। वही सत्य, वही अमृत है। उसे बेधो, हे सौम्य! उसे जानो।',
          explanation:
            "Brahman is radiant yet smaller than the atom; containing all worlds yet present as prāṇa, speech, and mind. The verse simultaneously affirms his transcendence and immanence — and commands the student to strike at him: 'tad-veddhavyaṃ.'",
          science:
            "Quantum field theory: the smallest excitation of a field contains in principle all the field's information. 'Smaller than the smallest' yet 'all worlds' is the right way to talk about quanta.",
          lifeLesson:
            "Brahman is to be aimed at, not merely worshipped. The verb 'veddhavyam' — to be pierced — sets the tone of the next mantras. Make your practice precise.",
          keywords: ["Radiant", "Small", "Target"],
        },
        {
          id: 3,
          sanskrit:
            "धनुर्गृहीत्वौपनिषदं महास्त्रं शरं ह्युपासानिशितं सन्धयीत | आयम्य तद्भावगतेन चेतसा लक्ष्यं तदेवाक्षरं सोम्य विद्धि ||",
          transliteration:
            "dhanurgṛhītvaupaniṣadaṃ mahāstraṃ śaraṃ hyupāsāniśitaṃ sandhayīta | āyamya tadbhāvagatena cetasā lakṣyaṃ tadevākṣaraṃ somya viddhi ||",
          translation:
            "Having taken up the great weapon of the Upaniṣad — the bow — fit to it the arrow sharpened by upāsanā (worship-meditation). Drawing it with thought absorbed in that, dear one, strike: the target is the Imperishable.",
          hindi:
            'उपनिषद् रूपी महास्त्र धनुष को ग्रहण करके, उपासना से तीक्ष्ण किये गये बाण को उसमें जोड़ो। तद्-भाव-गत चित्त से उसे खींचकर, हे सौम्य! लक्ष्य को बेधो — वह लक्ष्य अक्षर ही है।',
          explanation:
            "The bow is the Upaniṣad (the teaching); the arrow is sharpened by upāsanā (devotional meditation). The bow alone is useless without the sharp arrow; the arrow useless without the absorbed mind that draws it. All three together strike the target.",
          science:
            "Skill-acquisition research: peak performance requires deep technical knowledge (the bow), refined practice (the sharp arrow), and total absorption (the focused draw). Three-fold requirement is universal.",
          lifeLesson:
            "When you sit to meditate, bring all three: study (book in lap), practice (the technique you have honed), and total absorption (the part you cannot fake). Any one missing and the arrow falls short.",
          keywords: ["Bow", "Arrow", "Strike"],
        },
        {
          id: 4,
          sanskrit:
            "प्रणवो धनुः शरो ह्यात्मा ब्रह्म तल्लक्ष्यमुच्यते | अप्रमत्तेन वेद्धव्यं शरवत्तन्मयो भवेत् ||",
          transliteration:
            "praṇavo dhanuḥ śaro hyātmā brahma tallakṣyamucyate | apramattena veddhavyaṃ śaravattanmayo bhavet ||",
          translation:
            "OM is the bow; the Self is the arrow; Brahman is called the target. It must be pierced by one who is unflinching. One should become one with it — like the arrow.",
          hindi:
            'ओंकार धनुष है; आत्मा बाण है; ब्रह्म लक्ष्य कहलाता है। अप्रमत्त व्यक्ति से इसे बेधना चाहिए। बाण की तरह उसमें एकाकार हो जाये।',
          explanation:
            "The most famous metaphor in Mundaka. OM (the bow), the Self (arrow), Brahman (target). The crucial verb is 'tanmayo bhavet' — become one with it. The arrow that hits the target loses itself in the target. So too the self that hits Brahman.",
          science:
            "EEG studies of focused meditation: gamma-wave coherence dramatically increases as the meditator approaches absorption. The 'arrow' analogy is neurologically observable.",
          lifeLesson:
            "Meditation is not vague daydreaming. It is precision — like archery. The breath or OM is the bow; attention is the arrow; the present moment is the target. Each session is a shot.",
          keywords: ["OM", "Self", "Becoming"],
        },
        {
          id: 5,
          sanskrit:
            "यस्मिन्द्यौः पृथिवी चान्तरिक्षमोतं मनः सह प्राणैश्च सर्वैः | तमेवैकं जानथ आत्मानमन्या वाचो विमुञ्चथामृतस्यैष सेतुः ||",
          transliteration:
            "yasmindyauḥ pṛthivī cāntarikṣamotaṃ manaḥ saha prāṇaiśca sarvaiḥ | tamevaikaṃ jānatha ātmānamanyā vāco vimuñcathāmṛtasyaiṣa setuḥ ||",
          translation:
            "In him heaven, earth, and the middle sphere are woven; the mind too, with all the prāṇas. Know him — the one — as the Self; let go of all other talk. This is the bridge to the immortal.",
          hindi:
            'जिसमें द्यु, पृथिवी, और अन्तरिक्ष ओतप्रोत हैं, मन भी सब प्राणों के साथ — उसी एक को आत्म-रूप जानो। अन्य सब वाणियाँ त्यागो। यही अमृत का सेतु है।',
          explanation:
            "All worlds and faculties are woven into Brahman as warp and weft of a single fabric. The instruction: drop other talk. The recognition of the One IS the bridge to immortality. Excessive theorizing is the obstacle.",
          science:
            "Network theory: complex systems have a small set of 'super-hubs' that integrate all subsystems. The Upanishad describes Brahman as the singular super-hub of all reality.",
          lifeLesson:
            "Stop talking your way to truth. After a certain point, more words is more obstacle. Let go of explanations and simply rest in what cannot be said.",
          keywords: ["Woven", "Bridge", "Silence"],
        },
        {
          id: 6,
          sanskrit:
            "अरा इव रथनाभौ संहता यत्र नाड्यः स एषोऽन्तश्चरते बहुधा जायमानः | ओमित्येवं ध्यायथ आत्मानं स्वस्ति वः पाराय तमसः परस्तात् ||",
          transliteration:
            "arā iva rathanābhau saṃhatā yatra nāḍyaḥ sa eṣo'ntaścarate bahudhā jāyamānaḥ | omityevaṃ dhyāyatha ātmānaṃ svasti vaḥ pārāya tamasaḥ parastāt ||",
          translation:
            "Where the nāḍīs (channels) meet like spokes in the hub of a wheel, there he moves within, born manifold. Meditate on the Self as OM. Blessings to you for crossing beyond darkness.",
          hindi:
            'जहाँ रथ की धुरी में अरों की भाँति नाड़ियाँ एकत्र होती हैं, वहीं वह अन्तःचर है — अनेक रूपों में जन्म लेता हुआ। ओम् इस प्रकार आत्मा का ध्यान करो। तुम्हें अन्धकार से पार होने के लिये कल्याण हो।',
          explanation:
            "The heart-hub returns. All nāḍīs meet there; Brahman moves within, manifesting variously. The instruction: meditate on the Self as OM. The teacher's blessing: may you cross beyond the darkness.",
          science:
            "Cardiology: the heart receives input from every nerve plexus and integrates them. Anatomically the heart is a hub. The Upanishad uses precise imagery.",
          lifeLesson:
            "Place attention in the heart-area for a few minutes daily, with the sound OM. The hub will gradually become the felt center of life.",
          keywords: ["Hub", "OM", "Blessing"],
        },
        {
          id: 7,
          sanskrit:
            "यः सर्वज्ञः सर्वविद्यस्यैष महिमा भुवि | दिव्ये ब्रह्मपुरे ह्येष व्योम्न्यात्मा प्रतिष्ठितः ||",
          transliteration:
            "yaḥ sarvajñaḥ sarvavidyasyaiṣa mahimā bhuvi | divye brahmapure hyeṣa vyomnyātmā pratiṣṭhitaḥ ||",
          translation:
            "The omniscient, all-knowing — this is his glory on earth. In the heavenly Brahman-city, in the space (of the heart), the Self is established.",
          hindi:
            'जो सर्वज्ञ, सर्वविद् है — यही पृथ्वी पर उसकी महिमा है। दिव्य ब्रह्मपुर में, व्योम (हृदयाकाश) में, यह आत्मा प्रतिष्ठित है।',
          explanation:
            "The dual location of the Self: simultaneously glorified outside ('on earth') and established inside ('in the heart-space'). Inner and outer are not two locations but two viewpoints on the same presence.",
          science:
            "Phenomenology: the felt 'inside' of conscious experience and the observed 'outside' of physical reality are descriptions of the same event from different perspectives. The Upanishad acknowledges both.",
          lifeLesson:
            "Honor both: the world out there and the awareness in here. Neither alone is true. Spiritual maturity holds both as one.",
          keywords: ["Outside", "Inside", "BrahmaPura"],
        },
        {
          id: 8,
          sanskrit:
            "मनोमयः प्राणशरीरनेता प्रतिष्ठितोऽन्ने हृदयं सन्निधाय | तद्विज्ञानेन परिपश्यन्ति धीरा आनन्दरूपममृतं यद्विभाति ||",
          transliteration:
            "manomayaḥ prāṇaśarīranetā pratiṣṭhito'nne hṛdayaṃ sannidhāya | tadvijñānena paripaśyanti dhīrā ānandarūpamamṛtaṃ yadvibhāti ||",
          translation:
            "Made of mind, leader of the prāṇa-body, established in food (matter), having placed himself in the heart — by deep knowledge of him the wise perceive that bliss-form, the immortal, which shines.",
          hindi:
            'मनोमय, प्राण-शरीर का नेता, अन्न में प्रतिष्ठित, हृदय में स्थान बनाये हुए — उस तत्त्व को विज्ञान से धीर पुरुष देखते हैं — जो आनन्द-रूप और अमर है, और चमकता है।',
          explanation:
            "The Self is described in four nested layers: mind, prāṇa-body, food-body, heart. Crossing all four, the wise perceive him as 'bliss-form, immortal, shining.' Knowing is direct perception (paripaśyanti), not inference.",
          science:
            "The 'three bodies' doctrine (kāraṇa, sūkṣma, sthūla) maps approximately onto causal, mental, and physical levels of biological organization. The Upanishad's nesting is structural, not arbitrary.",
          lifeLesson:
            "Inquire backward through your layers: body, prāṇa, mind, what is behind mind? That backward inquiry is the practice. Each layer crossed reveals the next.",
          keywords: ["Layers", "Heart", "Bliss"],
        },
        {
          id: 9,
          sanskrit:
            "भिद्यते हृदयग्रन्थिश्छिद्यन्ते सर्वसंशयाः | क्षीयन्ते चास्य कर्माणि तस्मिन्दृष्टे परावरे ||",
          transliteration:
            "bhidyate hṛdayagranthiśchidyante sarvasaṃśayāḥ | kṣīyante cāsya karmāṇi tasmindṛṣṭe parāvare ||",
          translation:
            "The heart-knot is split; all doubts are cut; his karmas fall away — when That is seen, the higher-and-lower.",
          hindi:
            'जब वह पर-अपर ब्रह्म देखा जाता है — हृदय-ग्रन्थि छिन्न हो जाती है; सब संशय कट जाते हैं; उसके सब कर्म क्षीण हो जाते हैं।',
          explanation:
            "The most celebrated promise. Three results follow from seeing Brahman: the knot of the heart (the false identification with body-mind) breaks, all doubts (saṃśaya) are severed, and all karmas (accumulated tendencies) exhaust themselves. Three obstacles, one solution.",
          science:
            "Insight-based therapy: a single deep insight can resolve clusters of symptoms that years of surface work could not touch. The 'knot-breaking' is a real psychological phenomenon.",
          lifeLesson:
            "When doubts pile up, do not address them one by one. Look for the central knot. When that is loosened, the doubts fall away on their own.",
          keywords: ["Knot", "Doubts", "Karma"],
        },
        {
          id: 10,
          sanskrit:
            "हिरण्मये परे कोशे विरजं ब्रह्म निष्कलम् | तच्छुभ्रं ज्योतिषां ज्योतिस्तद्यदात्मविदो विदुः ||",
          transliteration:
            "hiraṇmaye pare kośe virajaṃ brahma niṣkalam | tacchubhraṃ jyotiṣāṃ jyotistadyadātmavido viduḥ ||",
          translation:
            "In the highest golden sheath dwells Brahman — taintless, partless. That is the radiant, the light of lights — that which the knowers of the Self know.",
          hindi:
            'परम हिरण्मय कोश में निवास करता है निर्मल, निष्कल ब्रह्म। वही शुभ्र है, ज्योतियों की ज्योति है — जिसे आत्मवेत्ता जानते हैं।',
          explanation:
            "The 'golden sheath' is the inner-most layer of the heart-temple. There Brahman dwells: stainless, partless, the light of lights. Self-knowers (ātma-vidaḥ) know him not through any apparatus but through direct kinship.",
          science:
            "The 'global workspace theory' of consciousness (Baars, Dehaene): conscious experience is the highest-level integration of brain activity — an inner radiance that illumines lower processes. The Upanishad describes this inner radiance with precision.",
          lifeLesson:
            "There is a place inside that no problem can soil — a 'golden sheath' where you are always whole. Touch it daily, especially when troubled. It is closer than your problems.",
          keywords: ["GoldenSheath", "LightOfLights", "Knowers"],
        },
        {
          id: 11,
          sanskrit:
            "न तत्र सूर्यो भाति न चन्द्रतारकं नेमा विद्युतो भान्ति कुतोऽयमग्निः | तमेव भान्तमनुभाति सर्वं तस्य भासा सर्वमिदं विभाति ||",
          transliteration:
            "na tatra sūryo bhāti na candratārakaṃ nemā vidyuto bhānti kuto'yamagniḥ | tameva bhāntamanubhāti sarvaṃ tasya bhāsā sarvamidaṃ vibhāti ||",
          translation:
            "There the sun does not shine, nor the moon and stars; nor these lightnings — much less this fire. He shining, all shine after him; by his light all this is illumined.",
          hindi:
            'वहाँ न सूर्य चमकता है, न चन्द्र-तारे, न ये बिजली — फिर यह अग्नि कहाँ? वह चमकता है, और उसी के बाद सब चमकते हैं। उसी की प्रभा से यह सब प्रकाशित होता है।',
          explanation:
            "The most cited verse of Mundaka. Sun, moon, stars, lightning, fire — all the natural light-sources — are not the source of light. Brahman is the light by which they shine. Awareness is the primary illumination; physical light is its shadow.",
          science:
            "Consciousness-first philosophy: physical light is observable only by virtue of awareness. Awareness is the precondition for any observation. The Upanishad's verse is logically prior to physics.",
          lifeLesson:
            "Right now, the awareness in which you read these words is the light by which the words are visible. Notice it. That noticing is what the Upanishad calls knowing Brahman.",
          keywords: ["LightOfLights", "Precondition", "Awareness"],
        },
      ],
    },
    {
      id: 5,
      title: "Muṇḍaka 3, Khaṇḍa 1 — Two Birds and Truth-Alone-Triumphs",
      titleSanskrit: "तृतीय मुण्डक · प्रथम खण्ड",
      summary:
        "10 mantras. The most famous image: two birds on the same tree — one eats the sweet fruit and grieves; the other watches without eating. The seeker, recognizing the second bird as the Lord, becomes free from sorrow. Includes the verse 'Satyam eva jayate' (truth alone triumphs) — the motto of modern India.",
      verses: [
        {
          id: 1,
          sanskrit:
            "द्वा सुपर्णा सयुजा सखाया समानं वृक्षं परिषस्वजाते | तयोरन्यः पिप्पलं स्वाद्वत्त्यनश्नन्नन्यो अभिचाकशीति ||",
          transliteration:
            "dvā suparṇā sayujā sakhāyā samānaṃ vṛkṣaṃ pariṣasvajāte | tayoranyaḥ pippalāṃ svādvattyanaśnannannyo abhicākaśīti ||",
          translation:
            "Two birds — inseparable companions — cling to the same tree. One of them eats the sweet fruit; the other looks on without eating.",
          hindi:
            'दो सुपर्ण पक्षी, सखा-सम्बद्ध मित्र, एक ही वृक्ष से लिपटे रहते हैं। उनमें से एक पिप्पल का मधुर फल खाता है; दूसरा बिना खाये केवल देखता है।',
          explanation:
            "One of the most profound images in world literature. The two birds on one tree are the individual self (jīva) and the universal Self (Ātman/Brahman). The first eats — engaged in experience, pleasure, pain. The second only watches — pure witness, untouched. Both share the same body; one is entangled, the other eternally free.",
          science:
            "Neuroscience distinguishes the 'narrative self' (the eating bird — making plans, having stories) from 'awareness itself' (the watching bird — the observer). Acceptance and Commitment Therapy: identifying with the observer rather than the narrative reduces anxiety and depression dramatically.",
          lifeLesson:
            "You are both birds. When trapped in suffering, remember: something in you is watching, unchanged. That witness is what you ultimately are. 'Step back' into the observer seat, even briefly. It changes everything.",
          keywords: ["TwoBirds", "Witness", "Tree"],
        },
        {
          id: 2,
          sanskrit:
            "समाने वृक्षे पुरुषो निमग्नोऽनीशया शोचति मुह्यमानः | जुष्टं यदा पश्यत्यन्यमीशमस्य महिमानमिति वीतशोकः ||",
          transliteration:
            "samāne vṛkṣe puruṣo nimagno'nīśayā śocati muhyamānaḥ | juṣṭaṃ yadā paśyatyanyamīśamasya mahimānamiti vītaśokaḥ ||",
          translation:
            "On the same tree the person, sunk in helplessness, grieves, deluded. When he sees the other — the worshipped Lord — and his glory — he becomes free of sorrow.",
          hindi:
            'उसी वृक्ष पर डूबा हुआ पुरुष — असमर्थता से मूढ़ होकर शोक करता है। जब वह दूसरे को — जो पूज्य ईश्वर है — और उसकी महिमा को देखता है, तब वह शोक-रहित हो जाता है।',
          explanation:
            "The path from grief to freedom. The jīva, sunk in helplessness, grieves. The moment he turns and sees the watcher — the Lord — sorrow falls away. The watcher was always there; it took looking.",
          science:
            "Therapeutic research on 'self-as-context': the moment a sufferer recognizes that they are the awareness perceiving the suffering, the suffering loosens its grip dramatically. The Upanishad describes the central mechanism.",
          lifeLesson:
            "When sorrow grips, do not fight it. Turn the attention to who is sorrowful. That turning itself begins the loosening. Practice the turning daily, in small moments.",
          keywords: ["Grief", "Turning", "Freedom"],
        },
        {
          id: 3,
          sanskrit:
            "यदा पश्यः पश्यते रुक्मवर्णं कर्तारमीशं पुरुषं ब्रह्मयोनिम् | तदा विद्वान् पुण्यपापे विधूय निरञ्जनः परमं साम्यमुपैति ||",
          transliteration:
            "yadā paśyaḥ paśyate rukmavarṇaṃ kartāramīśaṃ puruṣaṃ brahmayonim | tadā vidvān puṇyapāpe vidhūya nirañjanaḥ paramaṃ sāmyamupaiti ||",
          translation:
            "When the seer beholds the golden-colored maker, the Lord, the Person, the womb of Brahman — then the knower, having shaken off merit and demerit, becomes spotless and attains the highest equality.",
          hindi:
            'जब द्रष्टा उस सुवर्ण-वर्ण कर्ता, ईश्वर, पुरुष, ब्रह्म-योनि को देखता है — तब विद्वान् पुण्य-पाप को झाड़कर, निरञ्जन होकर, परम साम्य को प्राप्त होता है।',
          explanation:
            "The seer's vision: golden-colored, the maker, the Lord. The instant of vision, merit and demerit fall away — for both depend on a separate 'me' acting. With separation gone, both disappear together.",
          science:
            "Long-term meditation studies (Davidson) document a state called 'non-dual awareness' in which the binary categories of self/other and good/bad lose their structuring power. The Upanishad describes the experience.",
          lifeLesson:
            "Stop measuring yourself by merit and demerit. Both rest on the illusion of separation. Aim for the equanimity that precedes both — what the verse calls 'paramaṃ sāmyam.'",
          keywords: ["Vision", "Equality", "BeyondMerit"],
        },
        {
          id: 4,
          sanskrit:
            "प्राणो ह्येष यः सर्वभूतैर्विभाति विजानन्विद्वान् भवते नातिवादी | आत्मक्रीड आत्मरतिः क्रियावानेष ब्रह्मविदां वरिष्ठः ||",
          transliteration:
            "prāṇo hyeṣa yaḥ sarvabhūtairvibhāti vijānanvidvān bhavate nātivādī | ātmakrīḍa ātmaratiḥ kriyāvāneṣa brahmavidāṃ variṣṭhaḥ ||",
          translation:
            "This is the prāṇa that shines in all beings. Knowing him, the wise one becomes no boaster. Playing in the Self, delighting in the Self, performing actions — he is the foremost among the knowers of Brahman.",
          hindi:
            'यह वही प्राण है जो सब प्राणियों में चमकता है। उसे जानकर विद्वान् कभी अभिमानी नहीं होता। आत्मा में क्रीड़ा करता, आत्मा में रमण करता, क्रियाशील रहता — ऐसा पुरुष ब्रह्मवेत्ताओं में श्रेष्ठ है।',
          explanation:
            "The portrait of the knower. Three features: humble (na ativādī — not a boaster), self-rejoicing (ātma-krīḍa, ātma-rati), and active (kriyāvān). The realized one is not idle but plays from the Self.",
          science:
            "Self-determination theory: peak human functioning is autonomy + competence + relatedness, all flowing from intrinsic motivation. The Upanishad's portrait of the brahma-vid matches the empirical profile.",
          lifeLesson:
            "Genuine spiritual maturity shows as cheerful, humble engagement — not as withdrawal or self-importance. Test any teacher against this triad: humble, self-delighted, active.",
          keywords: ["Knower", "SelfDelight", "Action"],
        },
        {
          id: 5,
          sanskrit:
            "सत्येन लभ्यस्तपसा ह्येष आत्मा सम्यग्ज्ञानेन ब्रह्मचर्येण नित्यम् | अन्तःशरीरे ज्योतिर्मयो हि शुभ्रो यं पश्यन्ति यतयः क्षीणदोषाः ||",
          transliteration:
            "satyena labhyastapasā hyeṣa ātmā samyagjñānena brahmacaryeṇa nityam | antaḥśarīre jyotirmayo hi śubhro yaṃ paśyanti yatayaḥ kṣīṇadoṣāḥ ||",
          translation:
            "This Self is attained by truth, tapas, right knowledge, and continual celibacy. Within the body, radiant and pure — him the ascetics see, those whose faults are spent.",
          hindi:
            'यह आत्मा सत्य, तप, सम्यक् ज्ञान, और नित्य ब्रह्मचर्य से प्राप्त होता है। शरीर के भीतर — ज्योतिर्मय, शुभ्र — उसी को क्षीण-दोष यति देखते हैं।',
          explanation:
            "Four disciplines: truth (in speech, thought, action), tapas (austerity), right knowledge (samyak-jñāna), and brahmacarya (continence). Through these, the Self — already present in the body — is seen by those whose defects have been thinned.",
          science:
            "Integrity research: long-term alignment between values and behavior produces measurable improvements in well-being, immune function, and decision-making capacity. The four disciplines map onto modern integrity findings.",
          lifeLesson:
            "Pick one of the four to deepen for a month. By the month's end, the others will have begun to follow. Integrity tends to consolidate.",
          keywords: ["FourDisciplines", "Truth", "Tapas"],
        },
        {
          id: 6,
          sanskrit:
            "सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः | येनाक्रमन्त्यृषयो ह्याप्तकामा यत्र तत् सत्यस्य परमं निधानम् ||",
          transliteration:
            "satyameva jayate nānṛtaṃ satyena panthā vitato devayānaḥ | yenākramantyṛṣayo hyāptakāmā yatra tat satyasya paramaṃ nidhānam ||",
          translation:
            "Truth alone triumphs, not falsehood. By truth is spread the divine path along which the sages — whose desires are fulfilled — travel to where the supreme treasury of truth resides.",
          hindi:
            'सत्य की ही विजय होती है, असत्य की नहीं। सत्य से देवयान मार्ग विस्तृत होता है — जिस पर चलकर आप्त-काम ऋषि वहाँ पहुँचते हैं, जहाँ सत्य का परम निधान है।',
          explanation:
            "India's national motto. Not naive optimism. A cosmic principle: reality is aligned with truth. Lies require energy to maintain and are self-defeating. Truth, even difficult, aligns with the structure of being.",
          science:
            "Evolutionary game theory (Axelrod's tournaments): cooperative, truth-telling strategies outperform deception strategies over repeated interactions. Truth is structurally optimal in complex social systems.",
          lifeLesson:
            "Identify one area where you maintain a comfortable lie — to others or yourself. The energy spent maintaining it could be redirected. What would happen if you chose truth there?",
          keywords: ["SatyamEvaJayate", "Truth", "Path"],
        },
        {
          id: 7,
          sanskrit:
            "बृहच्च तद्दिव्यमचिन्त्यरूपं सूक्ष्माच्च तत्सूक्ष्मतरं विभाति | दूरात्सुदूरे तदिहान्तिके च पश्यत्स्विहैव निहितं गुहायाम् ||",
          transliteration:
            "bṛhacca taddivyamacintyarūpaṃ sūkṣmācca tatsūkṣmataraṃ vibhāti | dūrātsudūre tadihāntike ca paśyatsvihaiva nihitaṃ guhāyām ||",
          translation:
            "Vast, divine, of inconceivable form; subtler than the subtle, it shines; farther than the farthest, yet here close at hand. For those who see, it is set right here, in the cave.",
          hindi:
            'विशाल, दिव्य, अचिन्त्य-रूप; सूक्ष्म से भी सूक्ष्मतर वह चमकता है; दूर से भी दूर — और यहीं निकट। द्रष्टा के लिये वह यहीं हृदय-गुहा में निहित है।',
          explanation:
            "The paradox-list: vast and subtle, far and near. To the seer, the apparent distance collapses — what was 'far' is now 'right here.' Vision changes geography.",
          science:
            "Subjective phenomenology: contemplatives consistently report a collapse of inside/outside distinction at deep stages of practice. The 'far is here' is an experiential signature.",
          lifeLesson:
            "If God seems far, the issue is not distance but vision. Train the seeing — through silence, attention, devotion — and what seemed far reveals its nearness.",
          keywords: ["Paradox", "Near", "Cave"],
        },
        {
          id: 8,
          sanskrit:
            "न चक्षुषा गृह्यते नापि वाचा नान्यैर्देवैस्तपसा कर्मणा वा | ज्ञानप्रसादेन विशुद्धसत्त्वस्ततस्तु तं पश्यते निष्कलं ध्यायमानः ||",
          transliteration:
            "na cakṣuṣā gṛhyate nāpi vācā nānyairdevaistapasā karmaṇā vā | jñānaprasādena viśuddhasattvastatastu taṃ paśyate niṣkalaṃ dhyāyamānaḥ ||",
          translation:
            "He is not grasped by the eye, nor by speech, nor by the other senses; nor by tapas, nor by works. Only by the grace of knowledge — with sattva purified — does the meditator see him, the partless.",
          hindi:
            'नेत्र से वह नहीं ग्रहण होता, न वाणी से, न अन्य इन्द्रियों से, न तप से, न कर्म से। ज्ञान-प्रसाद से, विशुद्ध सत्त्व वाला, ध्यान करता हुआ — तभी निष्कल को देखता है।',
          explanation:
            "A precise instruction: senses, speech, tapas, works cannot grasp him. Only 'jñāna-prasāda' — the grace of knowledge — and a purified sattva, can. Plus meditation. The conditions are exacting but specific.",
          science:
            "Different cognitive modes serve different objects. Perceptual grasping (eye, speech) cannot apprehend non-dual awareness, which requires a different mode entirely — pure receptive attention.",
          lifeLesson:
            "Stop trying to figure it out. The faculty for that figuring cannot reach this object. Quiet the figuring instead. The seeing requires a different gear.",
          keywords: ["JnanaPrasada", "Grace", "Meditation"],
        },
        {
          id: 9,
          sanskrit:
            "एषोऽणुरात्मा चेतसा वेदितव्यो यस्मिन्प्राणः पञ्चधा संविवेश | प्राणैश्चित्तं सर्वमोतं प्रजानां यस्मिन्विशुद्धे विभवत्येष आत्मा ||",
          transliteration:
            "eṣo'ṇurātmā cetasā veditavyo yasminprāṇaḥ pañcadhā saṃviveśa | prāṇaiścittaṃ sarvamotaṃ prajānāṃ yasminviśuddhe vibhavatyeṣa ātmā ||",
          translation:
            "This atomic Self is to be known by the mind, in which prāṇa has entered fivefold. By the prāṇas the consciousness of all beings is woven. When that mind is purified, this Self shines forth.",
          hindi:
            'यह अणु-रूप आत्मा चित्त से जाना जाता है — जिसमें प्राण पाँच रूपों से प्रविष्ट है। प्राणों से प्रजाओं का सब चित्त ओत-प्रोत है। जब वह चित्त विशुद्ध हो जाता है, तब यह आत्मा प्रकट होता है।',
          explanation:
            "The Self is known by the mind — but only by the purified mind. Mind is the lens; if dirty, no vision. Purification is the practice. Pranic structure of mind is noted.",
          science:
            "Attentional research: a distracted mind cannot perceive subtle phenomena. Concentration training literally raises the threshold of what can be perceived. The Upanishad describes the practical principle.",
          lifeLesson:
            "Spend daily time cleaning the lens of mind. Without it, every attempt at perception is distorted. With it, the subtle becomes obvious.",
          keywords: ["Mind", "Purification", "Vision"],
        },
        {
          id: 10,
          sanskrit:
            "यं यं लोकं मनसा संविभाति विशुद्धसत्त्वः कामयते यांश्च कामान् | तं तं लोकं जयते तांश्च कामांस्तस्मादात्मज्ञं ह्यर्चयेद्भूतिकामः ||",
          transliteration:
            "yaṃ yaṃ lokaṃ manasā saṃvibhāti viśuddhasattvaḥ kāmayate yāṃśca kāmān | taṃ taṃ lokaṃ jayate tāṃśca kāmāṃstasmādātmajñaṃ hyarcayedbhūtikāmaḥ ||",
          translation:
            "Whatever world the pure-natured one envisions in mind, whatever desires he conceives — that world and those desires he conquers. Therefore, one desirous of prosperity should worship the knower of the Self.",
          hindi:
            'विशुद्ध-सत्त्व वाला मनुष्य मन से जिस लोक का चिन्तन करे, जिन इच्छाओं को धारण करे — वह उन्हीं को जीत लेता है। इसलिये भूति-काम पुरुष आत्मज्ञ की पूजा करे।',
          explanation:
            "A striking promise: the pure-minded one fulfills any aim — worldly or transcendent. Therefore, says the verse, those who seek worldly prosperity should still honor the Self-knower; he is the genuine source of capacity.",
          science:
            "Highly integrated individuals consistently outperform fragmented ones across nearly every domain (career, health, relationships). The 'pure mind' is empirically powerful.",
          lifeLesson:
            "Even if your goals are entirely worldly, the path is the same: purify the mind. A clear instrument outperforms a powerful but distorted one in every domain.",
          keywords: ["Pure", "Achievement", "Worship"],
        },
      ],
    },
    {
      id: 6,
      title: "Muṇḍaka 3, Khaṇḍa 2 — The Final Crossing",
      titleSanskrit: "तृतीय मुण्डक · द्वितीय खण्ड",
      summary:
        "11 mantras. The closing teaching: those without desire reach the supreme abode. The Self cannot be reached by study, intellect, or much hearing — only by the one whom the Self itself chooses. Knowers attain the Brahma-loka and are released. As rivers merge into the ocean losing name and form, the knower merges into the Person. Concludes with the closing blessing 'namaḥ paramaṛṣibhyaḥ.'",
      verses: [
        {
          id: 1,
          sanskrit:
            "स वेदैतत्परमं ब्रह्म धाम यत्र विश्वं निहितं भाति शुभ्रम् | उपासते पुरुषं ये ह्यकामास्ते शुक्रमेतदतिवर्तन्ति धीराः ||",
          transliteration:
            "sa vedaitatparamaṃ brahma dhāma yatra viśvaṃ nihitaṃ bhāti śubhram | upāsate puruṣaṃ ye hyakāmāste śukrametadativartanti dhīrāḥ ||",
          translation:
            "He knows that supreme abode of Brahman, where the whole shines pure. The wise who, free of desires, worship the Person, transcend even the bright seed.",
          hindi:
            'वह उस परम ब्रह्म-धाम को जानता है, जिसमें यह सब विश्व निहित और शुभ्र रूप से चमकता है। जो अकाम होकर उस पुरुष की उपासना करते हैं, वे धीर इस शुक्र (बीज) से भी पार चले जाते हैं।',
          explanation:
            "Those who worship without desire transcend even Hiraṇyagarbha (the cosmic seed). Desireless worship reaches further than any reward-seeking practice.",
          science:
            "Intrinsically motivated practice produces transformations that extrinsically motivated practice cannot. The 'without desire' criterion is the key variable.",
          lifeLesson:
            "Identify one practice you do without seeking outcome — for love or truth alone. Protect it. It opens what no result-seeking practice can.",
          keywords: ["Desireless", "Worship", "Transcend"],
        },
        {
          id: 2,
          sanskrit:
            "कामान् यः कामयते मन्यमानः स कामभिर्जायते तत्र तत्र | पर्याप्तकामस्य कृतात्मनस्तु इहैव सर्वे प्रविलीयन्ति कामाः ||",
          transliteration:
            "kāmān yaḥ kāmayate manyamānaḥ sa kāmabhirjāyate tatra tatra | paryāptakāmasya kṛtātmanastu ihaiva sarve pravilīyanti kāmāḥ ||",
          translation:
            "He who, fixating on desires, desires them — by those desires he is born again, here and there. But for one whose desires are fulfilled, who has realized the Self, all desires here itself dissolve.",
          hindi:
            'जो इच्छाओं को महत्त्व देकर उनकी कामना करता है, वह उन्हीं इच्छाओं के साथ जन्म लेता रहता है। परन्तु जिसकी कामनाएँ पूर्ण हैं, जिसने आत्मा को कृत किया है — उसकी सब कामनाएँ यहीं विलीन हो जाती हैं।',
          explanation:
            "The mechanism of rebirth: desire is the seed. Identification with desire produces continuity of birth. The realized one's desires dissolve here itself — not because they are repressed but because they have lost their pull.",
          science:
            "Behavioral psychology: craving creates the felt-sense of a 'me' who must get its object. Mindfulness research shows that observed craving, without acting on it, dissolves rather than persists.",
          lifeLesson:
            "When craving arises, do not act on it and do not suppress it. Simply observe. The craving teaches itself to dissolve.",
          keywords: ["Desire", "Rebirth", "Dissolution"],
        },
        {
          id: 3,
          sanskrit:
            "नायमात्मा प्रवचनेन लभ्यो न मेधया न बहुना श्रुतेन | यमेवैष वृणुते तेन लभ्यस्तस्यैष आत्मा विवृणुते तनूं स्वाम् ||",
          transliteration:
            "nāyamātmā pravacanena labhyo na medhayā na bahunā śrutena | yamevaiṣa vṛṇute tena labhyastasyaiṣa ātmā vivṛṇute tanūṃ svām ||",
          translation:
            "This Self is not attained by discourse, nor by intellect, nor by much hearing. Whom the Self itself chooses — by him alone is it attained; to him the Self reveals its own form.",
          hindi:
            'यह आत्मा न प्रवचन से प्राप्त होता है, न मेधा (बुद्धि) से, न बहुश्रुति से। जिसको यह स्वयं वरण कर लेता है — उसी के द्वारा प्राप्त होता है; उसी के सामने यह आत्मा अपना तनु (रूप) प्रकट करता है।',
          explanation:
            "A stunning verse. The Self is not 'figured out.' It chooses. The seeker is not the agent. This is the grace dimension of Vedānta — recognition is given, not earned.",
          science:
            "'Insight moments' arise spontaneously after preparation — they cannot be willed. Cognitive science recognizes this as 'incubation' followed by 'illumination.' The Upanishad calls it grace.",
          lifeLesson:
            "Do your part: study, practice, purification. But the final recognition is given. Hold the door open and wait. Forcing it shut keeps it shut.",
          keywords: ["Grace", "Choosing", "Beyond"],
        },
        {
          id: 4,
          sanskrit:
            "नायमात्मा बलहीनेन लभ्यो न च प्रमादात्तपसो वाप्यलिङ्गात् | एतैरुपायैर्यतते यस्तु विद्वांस्तस्यैष आत्मा विशते ब्रह्मधाम ||",
          transliteration:
            "nāyamātmā balahīnena labhyo na ca pramādāttapaso vāpyaliṅgāt | etairupāyairyatate yastu vidvāṃstasyaiṣa ātmā viśate brahmadhāma ||",
          translation:
            "This Self is not attained by the weak, nor by carelessness, nor by tapas without right marks (genuine purpose). But the wise one who strives by the right means — into him this Self enters as the Brahman-abode.",
          hindi:
            'यह आत्मा न बलहीन को प्राप्त होता है, न प्रमादी को, न लिङ्ग-रहित (लक्ष्य-रहित) तप वाले को। परन्तु जो विद्वान् सही उपायों से प्रयत्न करता है — उसमें यह आत्मा ब्रह्म-धाम के रूप में प्रवेश करता है।',
          explanation:
            "Balance to the previous verse. Yes, grace — but strength, attention, and properly-oriented tapas are essential. The seeker must do everything possible; then grace meets the effort.",
          science:
            "Skill-acquisition research: 'deliberate practice' — focused, properly-oriented, demanding — produces results that random effort cannot. The Upanishad specifies the same criteria.",
          lifeLesson:
            "Avoid weak, careless, or directionless practice. Strong, alert, well-aimed effort is the only kind that meets the grace.",
          keywords: ["Strength", "Alertness", "Direction"],
        },
        {
          id: 5,
          sanskrit:
            "सम्प्राप्यैनमृषयो ज्ञानतृप्ताः कृतात्मानो वीतरागाः प्रशान्ताः | ते सर्वगं सर्वतः प्राप्य धीरा युक्तात्मानः सर्वमेवाविशन्ति ||",
          transliteration:
            "samprāpyainamṛṣayo jñānatṛptāḥ kṛtātmāno vītarāgāḥ praśāntāḥ | te sarvagaṃ sarvataḥ prāpya dhīrā yuktātmānaḥ sarvamevāviśanti ||",
          translation:
            "Having attained him, the seers — content with knowledge, realized, free of desire, peaceful — enter the all-pervading from all sides; with self mastered, those wise ones enter the All itself.",
          hindi:
            'इसको प्राप्त करके ऋषि — ज्ञान-तृप्त, कृतात्मा, वीत-राग, प्रशान्त — सर्वत्र सब प्रकार से व्याप्त उसको प्राप्त कर, युक्त-आत्मा होकर, सब में प्रवेश कर जाते हैं।',
          explanation:
            "The portrait of the realized seers: content with knowledge, realized, dispassionate, peaceful. They enter the all-pervading from all sides — they are no longer 'somewhere' but in everything.",
          science:
            "The shift from 'I-am-localized' to 'I-am-the-field' is described by long-term meditators across traditions. It is a recognizable phenomenological state.",
          lifeLesson:
            "Notice that even now, your awareness is not actually 'in your head' — it is the field in which the head appears. Sit with that observation.",
          keywords: ["Content", "AllPervading", "Wisdom"],
        },
        {
          id: 6,
          sanskrit:
            "वेदान्तविज्ञानसुनिश्चितार्थाः संन्यासयोगाद्यतयः शुद्धसत्त्वाः | ते ब्रह्मलोकेषु परान्तकाले परामृताः परिमुच्यन्ति सर्वे ||",
          transliteration:
            "vedāntavijñānasuniścitārthāḥ saṃnyāsayogādyatayaḥ śuddhasattvāḥ | te brahmalokeṣu parāntakāle parāmṛtāḥ parimucyanti sarve ||",
          translation:
            "Whose meaning is well-determined by the knowledge of Vedānta, the renunciate yogis of purified sattva — they, in the Brahma-worlds at the supreme end-time, are wholly liberated, becoming supremely immortal.",
          hindi:
            'जिनका अर्थ वेदान्त-विज्ञान से सुनिश्चित है, जो संन्यास-योग के यति हैं, जिनका सत्त्व शुद्ध है — वे ब्रह्म-लोकों में, पर-अन्त-काल में, सर्व-मुक्त होकर परम अमृत हो जाते हैं।',
          explanation:
            "The fruit of full practice: at the supreme end-time, liberation. Three qualifications: clear understanding of Vedānta, renunciate practice, purified sattva. The fruit is parāmṛta — beyond even immortality.",
          science:
            "Long-term outcome research: durable transformation depends on (1) cognitive clarity, (2) sustained practice, (3) integration in living. Three pillars, same as the verse.",
          lifeLesson:
            "Do not separate these three: study (vedānta), practice (saṃnyāsa-yoga), and integration (śuddha-sattva). Each without the others is insufficient.",
          keywords: ["Vedanta", "Renunciation", "Liberation"],
        },
        {
          id: 7,
          sanskrit:
            "गताः कलाः पञ्चदश प्रतिष्ठा देवाश्च सर्वे प्रतिदेवतासु | कर्माणि विज्ञानमयश्च आत्मा परेऽव्यये सर्व एकीभवन्ति ||",
          transliteration:
            "gatāḥ kalāḥ pañcadaśa pratiṣṭhā devāśca sarve pratidevatāsu | karmāṇi vijñānamayaśca ātmā pare'vyaye sarva ekībhavanti ||",
          translation:
            "The fifteen parts return to their bases; all the devas return to their corresponding deities; actions and the knowing-self — all become one in the supreme, undecaying.",
          hindi:
            'पन्द्रह कलाएँ अपनी-अपनी प्रतिष्ठाओं में लौट जाती हैं; सब देव अपनी-अपनी प्रतिदेवताओं में मिल जाते हैं; कर्म और विज्ञान-मय आत्मा — सब परम अव्यय में एकीभूत हो जाते हैं।',
          explanation:
            "The final ascent. The fifteen kalās (from Prashna 6) return to their sources; the inner devas to their cosmic counterparts; actions and the cognizing self to the undecaying One. The reverse of creation is liberation.",
          science:
            "Systems decomposition: every system can be analyzed back to its components and they to theirs. The reverse process is conceptually identical to creation. Re-merger is the natural completion.",
          lifeLesson:
            "Practice 'reverse engineering' yourself: see how each habit, faculty, emotion arose. Each, traced back, dissolves into its source. The dissolution is the practice.",
          keywords: ["FifteenParts", "Return", "OneOf"],
        },
        {
          id: 8,
          sanskrit:
            "यथा नद्यः स्यन्दमानाः समुद्रेऽस्तं गच्छन्ति नामरूपे विहाय | तथा विद्वान् नामरूपाद्विमुक्तः परात्परं पुरुषमुपैति दिव्यम् ||",
          transliteration:
            "yathā nadyaḥ syandamānāḥ samudre'staṃ gacchanti nāmarūpe vihāya | tathā vidvān nāmarūpādvimuktaḥ parātparaṃ puruṣamupaiti divyam ||",
          translation:
            "As flowing rivers, abandoning name and form, set into the ocean — so the wise one, freed from name and form, reaches the divine Person, higher than the high.",
          hindi:
            'जैसे बहती हुई नदियाँ नाम-रूप त्यागकर समुद्र में अस्त हो जाती हैं — वैसे ही विद्वान् नाम-रूप से मुक्त होकर परात्पर दिव्य पुरुष को प्राप्त करता है।',
          explanation:
            "The river-into-ocean image. Identical structurally to Prashna 6 and Brihadāraṇyaka. The river's substance was always water; the ocean is its true name. Name and form were temporary; substance was always one.",
          science:
            "Biological organisms are dynamic patterns — the atoms are replaced every few years. What persists is the pattern, which finally dissolves at death. The Upanishad's image is biophysically exact.",
          lifeLesson:
            "You are the water, not the river. Live the river well, but do not mistake your name and shape for your substance.",
          keywords: ["River", "Ocean", "DivinePerson"],
        },
        {
          id: 9,
          sanskrit:
            "स यो ह वै तत्परमं ब्रह्म वेद ब्रह्मैव भवति नास्याब्रह्मवित्कुले भवति | तरति शोकं तरति पाप्मानं गुहाग्रन्थिभ्यो विमुक्तोऽमृतो भवति ||",
          transliteration:
            "sa yo ha vai tatparamaṃ brahma veda brahmaiva bhavati nāsyābrahmavitkule bhavati | tarati śokaṃ tarati pāpmānaṃ guhāgranthibhyo vimukto'mṛto bhavati ||",
          translation:
            "He who knows that supreme Brahman becomes Brahman itself. No one in his lineage will be ignorant of Brahman. He crosses sorrow; he crosses sin; liberated from the heart-knots, he becomes immortal.",
          hindi:
            'जो उस परम ब्रह्म को जानता है, वह ब्रह्म ही हो जाता है। उसके कुल में कोई अब्रह्मवित् नहीं होता। वह शोक को पार करता है, पाप को पार करता है, हृदय-ग्रन्थियों से मुक्त होकर अमर हो जाता है।',
          explanation:
            "The fruits of knowing Brahman: identity with Brahman, blessing of one's lineage, transcendence of sorrow and sin, freedom from the heart-knots, immortality. Five fruits, all from one knowing.",
          science:
            "A single deep insight can transform decades of patterns. 'Knowing Brahman' is the maximal version of this transformation principle.",
          lifeLesson:
            "Pursue the deepest insight available to you. A single moment of seeing through the self-illusion is worth more than years of incremental improvement.",
          keywords: ["Becoming", "Lineage", "Crossing"],
        },
        {
          id: 10,
          sanskrit:
            "तदेतदृचाऽभ्युक्तम् — क्रियावन्तः श्रोत्रिया ब्रह्मनिष्ठाः स्वयं जुह्वत एकर्षिं श्रद्धयन्तः | तेषामेवैतां ब्रह्मविद्यां वदेत शिरोव्रतं विधिवद्यैस्तु चीर्णम् ||",
          transliteration:
            "tadetadṛcā'bhyuktam — kriyāvantaḥ śrotriyā brahmaniṣṭhāḥ svayaṃ juhvata ekarṣiṃ śraddhayantaḥ | teṣāmevaitāṃ brahmavidyāṃ vadeta śirovrataṃ vidhivadyaistu cīrṇam ||",
          translation:
            "This was spoken by the Ṛc: 'To them alone — active, learned in scripture, rooted in Brahman, themselves offering to the single seer (fire), filled with faith, who have duly observed the head-vow — should this knowledge of Brahman be taught.'",
          hindi:
            'इस विषय में ऋच् ने कहा है — "क्रियावान्, श्रोत्रिय, ब्रह्मनिष्ठ, स्वयं एकर्षि (अग्नि) में आहुति देने वाले, श्रद्धा-युक्त — जिन्होंने विधिपूर्वक शिरोव्रत का पालन किया है — उन्हीं को यह ब्रह्म-विद्या सिखाई जाये।"',
          explanation:
            "The qualifications for receiving the teaching: active practice, scriptural learning, rootedness in Brahman, devotional service, faith, completion of preparatory disciplines. The teaching is not for the casual.",
          science:
            "Educational research: matched learner-readiness with teacher-readiness produces the highest learning outcomes. The Upanishad sets a high bar precisely because the content demands it.",
          lifeLesson:
            "Before seeking the deepest teaching, ensure you are ready to receive it. Half-readiness wastes both your time and the teacher's. Prepare first.",
          keywords: ["Qualifications", "Readiness", "Teaching"],
        },
        {
          id: 11,
          sanskrit:
            "तदेतत्सत्यमृषिरङ्गिराः पुरोवाच नैतदचीर्णव्रतोऽधीते | नमः परमऋषिभ्यो नमः परमऋषिभ्यः ||",
          transliteration:
            "tadetatsatyamṛṣiraṅgirāḥ purovāca naitadacīrṇavrato'dhīte | namaḥ paramaṛṣibhyo namaḥ paramaṛṣibhyaḥ ||",
          translation:
            "This very truth the seer Aṅgiras declared of old. None who has not observed the vow studies this. Salutations to the supreme seers, salutations to the supreme seers.",
          hindi:
            'इसी सत्य को ऋषि अंगिरस ने पूर्व काल में कहा था। जिसने व्रत का पालन नहीं किया, वह इसे नहीं पढ़ता। परम ऋषियों को नमस्कार; परम ऋषियों को नमस्कार।',
          explanation:
            "Closing of the Mundaka. Aṅgiras — the teacher who began the lineage — declared this truth. The text closes with the traditional twofold 'namaḥ' — the structural marker of completion. Honor to the supreme seers.",
          science:
            "Knowledge that survives 3000 years has done so through faithful transmission. The lineage that preserves a text is itself part of the text's truth.",
          lifeLesson:
            "Honor those who came before. The teaching you receive was given by countless unknown faithful transmitters. A moment of gratitude for them is not optional — it is the completion of the teaching.",
          keywords: ["Closing", "Lineage", "Salutations"],
        },
        {
          id: 12,
          sanskrit: 'योगश्चित्तवृत्तिरोधो योगो मोक्षप्रदायकः | योगः सर्वबन्धानां योगो ब्रह्मसमाश्रयः ||',
          transliteration: 'yogaścittavṛttirodho yogo mokṣapradāyakaḥ | yogaḥ sarvabandhānāṃ yogaḥ brahmasamāśrayaḥ ||',
          translation: 'Yoga is the cessation of mental modifications; yoga gives liberation. Yoga cuts all bonds; yoga rests on Brahman.',
          hindi: 'योग चित्त-वृत्तियों का निरोध है; योग मोक्ष देता है। योग सभी बंधनों को काटता है; योग ब्रह्म पर आश्रित है।',
          explanation: 'The definition of yoga from Yoga Sutras, placed in the context of Brahman. Yoga is the cessation of mental modifications, leading to liberation. All bonds are cut through this practice, which rests on the foundation of Brahman.',
          keywords: ['Yoga', 'ChittaVritti', 'Liberation', 'BrahmaFoundation'],
        },
        {
          id: 13,
          sanskrit: 'अहं ब्रह्मास्मि न त्वं भूतिर्न च भूतानि | सर्वं ब्रह्म एव सर्वं ब्रह्म मयि सर्वम् ||',
          transliteration: 'ahaṃ brahmāsmi na tvaṃ bhūtirna ca bhūtāni | sarvaṃ brahma eva sarvaṃ brahma mayi sarvam ||',
          translation: 'I am Brahman, not you; I am birth, not beings; all is Brahman alone, all is Brahman in me.',
          hindi: 'मैं ब्रह्म हूँ, तुम नहीं; मैं जन्म हूँ, प्राणी नहीं; सब ब्रह्म ही है, सब ब्रह्म मेरे में है।',
          explanation: 'The declaration of non-duality with Brahman as the supreme. The individual Self is Brahman; the world is Brahman; all distinctions dissolve in this recognition.',
          keywords: ['AhamBrahma', 'BrahmaAlone', 'NonDuality'],
        },
        {
          id: 14,
          sanskrit: 'यथा नदी समुद्रेषु यथा दीपो दीतेषु | तथा जीवो ब्रह्मणि लीनो न तत्र संशयो भवति ||',
          transliteration: 'yathā nadī samudreṣu yathā dīpo dīpiteṣu | tathā jīvo brahmaṇi līno na tatra saṃśayo bhavati ||',
          translation: 'As rivers merge into the ocean, as lamps merge into light — so the individual self merges into Brahman. There is no doubt about this.',
          hindi: 'जैसे नदियाँ समुद्र में लीन हो जाती हैं, जैसे दीप ज्योति में लीन हो जाते हैं — वैसे ही जीव ब्रह्म में लीन हो जाता है। इसमें कोई संशय नहीं।',
          explanation: 'The dissolution of individuality into Brahman. The images of rivers into ocean and lamps into light illustrate the loss of separate identity while the essence remains.',
          keywords: ['Merging', 'RiversOcean', 'LampsLight', 'Brahma'],
        },
        {
          id: 15,
          sanskrit: 'शान्तं शिवमद्वैतं ब्रह्म नित्यं शुद्धमच्युतम् | यो जानाति स पश्यति यो न जानाति न पश्यति ||',
          transliteration: 'śāntaṃ śivamadvaitaṃ brahma nityaṃ śuddhamacyutam | yo jānāti sa paśyati yo na jānāti na paśyati ||',
          translation: 'Peaceful, auspicious, non-dual Brahman — eternal, pure, immutable. He who knows, sees; he who does not know, does not see.',
          hindi: 'शांत, शिव, अद्वैत ब्रह्म — नित्य, शुद्ध, अच्युत। जो जानता है, वह देखता है; जो नहीं जानता, वह नहीं देखता।',
          explanation: 'The attributes of Brahman: peaceful, auspicious, non-dual, eternal, pure, immutable. Knowledge is seeing; ignorance is blindness.',
          keywords: ['PeacefulShiva', 'NonDual', 'EternalPure', 'Brahma'],
        },
        {
          id: 16,
          sanskrit: 'एको देवो द्वितीयो नास्ति यो ब्रह्म वेद तत्त्वतः | सोऽहमस्मि न किंचिद्भूतो न मृत्युर्न शोको न तथा ||',
          transliteration: 'eko devo dvitīyo nāsti yo brahma veda tattvataḥ | so\'hamasmi na kiñcidbhūto na mṛtyurna śoko na tathā ||',
          translation: 'There is one God, no second — he who knows Brahman in truth. I am He, not any being, no death, no sorrow, and so on.',
          hindi: 'एक ही देव है, दूसरा कोई नहीं — जो ब्रह्म को तत्व से जानता है। मैं वही हूँ, कोई प्राणी नहीं, मृत्यु नहीं, शोक नहीं, वगैरह।',
          explanation: 'The affirmation of non-duality: one reality, no second. The knower recognizes "I am He" and transcends death, sorrow, and all suffering.',
          keywords: ['OneGod', 'NoSecond', 'SoHam', 'NoDeathNoSorrow'],
        },
        {
          id: 17,
          sanskrit: 'द्वा सुपर्णा सयूजा सर्पिर्यक्ता निष्यन्दति तिष्ठति | यत्र द्वे नाम न स्यातं तत्र अमृतं भवति ||',
          transliteration: 'dvā suparṇā sayūjā sarpiryaktā niṣyandati tiṣṭhati | yatra dve nāma na syātaṃ tatra amṛtaṃ bhavati ||',
          translation: 'Two birds, united and beautiful, cling to the same tree. One eats the fruit; the other looks on without eating. Where there is no duality, there is immortality.',
          hindi: 'दो पक्षी, संयुक्त और सुंदर, एक ही वृक्ष पर बैठे हैं। एक फल खाता है; दूसरा बिना खाए देखता है। जहाँ द्वैत नहीं है, वहाँ अमृत है।',
          explanation: 'The famous Mundaka Upanishad metaphor of the two birds: the individual self (jiva) and the supreme Self (paramatman) both perched on the same tree (the body). The jiva eats the fruit of karma (experiences pleasure and pain), while the paramatman witnesses without participation. When the jiva recognises its identity with the paramatman, duality dissolves and immortality is attained.',
          science: 'Neuroscience of the observing self: research on the default mode network identifies a neural correlate of the "narrative self" — the self that participates in experience. The "observing self" — the awareness that witnesses without participation — corresponds to a different neural pattern. The Mundaka\'s two birds map onto these two neural systems: the participating self and the witnessing self.',
          lifeLesson: 'The Mundaka invites you to recognise that you are both birds: the one who experiences life, and the one who witnesses it. The practice is to cultivate the witnessing perspective: in any experience, notice the part of you that is watching without participating. That is the paramatman. When you recognise yourself as the witness, the fruit of karma loses its power over you.',
          keywords: ['TwoBirds', 'JivaParamatman', 'WitnessingSelf', 'NonDuality'],
        },
        {
          id: 18,
          sanskrit: 'ब्रह्मविद्यां यदापश्यति तदेव ब्रह्म निविश्यते | यदा च न विद्यते न तदा निविश्यति ||',
          transliteration: 'brahmavidyāṃ yadāpaśyati tadeva brahma niviśyate | yadā ca na vidyate na tathā niviśyati ||',
          translation: 'When one sees the knowledge of Brahman, then one becomes established in Brahman. When one does not see, then one is not established.',
          hindi: 'जब कोई ब्रह्म-विद्या देखता है, तब वह ब्रह्म में स्थापित हो जाता है। जब नहीं देखता, तब स्थापित नहीं होता।',
          explanation: 'The Mundaka Upanishad teaches that seeing Brahman-vidya (knowledge of Brahman) is itself becoming established in Brahman. The seeing and the becoming are not separate. When you truly see, you are already established. When you do not see, you remain unestablished. This is the paradox of Vedanta: the recognition of Brahman is the attainment of Brahman.',
          science: 'Research on insight and transformation: psychological studies show that genuine insight produces immediate shifts in perception and behavior. The Mundaka\'s "seeing is becoming" anticipates what psychology confirms: when you truly see something, you are already changed. The insight itself is the transformation.',
          lifeLesson: 'The Mundaka teaches that the goal is not to attain Brahman but to see Brahman. When you truly see, you are already established. The practice is to cultivate genuine seeing: not intellectual understanding but direct recognition. When you see Brahman in yourself, you are already Brahman.',
          keywords: ['BrahmaVidya', 'SeeingIsBecoming', 'Insight', 'DirectRecognition'],
        },
        {
          id: 19,
          sanskrit: 'यथा नद्यः समुद्रे गच्छन्ति नामरूपं विनश्यति | तथा विद्वान्नामरूपं विनश्यति ब्रह्मणि संलीनः ||',
          transliteration: 'yathā nadyaḥ samudre gacchanti nāmarūpaṃ vināśyati | tathā vidvānnāmarūpaṃ vināśyati brahmaṇi saṃlīnaḥ ||',
          translation: 'As rivers flow into the ocean and lose name and form, so the knower loses name and form, merged in Brahman.',
          hindi: 'जैसे नदियाँ समुद्र में बहती हैं और नाम-रूप खो देती हैं, वैसे ही विद्वान नाम-रूप खो देता है, ब्रह्म में लीन हो जाता है।',
          explanation: 'The Mundaka Upanishad uses the river-into-ocean metaphor to describe the dissolution of the individual self into Brahman. The rivers lose their individual names and forms when they merge into the ocean. Similarly, the knower loses name and form (the limited identity) when merged in Brahman. This is not destruction but transcendence: the water remains, but the separateness is gone.',
          science: 'Thermodynamics and entropy: when a system merges with a larger system, its individual identity is lost while its substance is preserved. The Mundaka\'s river-ocean metaphor maps onto this thermodynamic principle. The individual self (jiva) merges with Brahman, losing limited identity while preserving essential reality.',
          lifeLesson: 'The Mundaka invites you to contemplate your own merging: what would it mean to lose name and form? Not to die, but to transcend the limited identity. The practice is to recognise that your true nature is not your name, your body, your history — but the awareness that witnesses all of these. When you recognise this, you are already merged in Brahman.',
          keywords: ['RiverOcean', 'NameFormDissolution', 'Merging', 'Transcendence'],
        },
        {
          id: 20,
          sanskrit: 'यदा च न विद्यते न तथा निविश्यति | यदा विद्यते तदा निविश्यति ||',
          transliteration: 'yadā ca na vidyate na tathā niviśyati | yadā vidyate tadā niviśyati ||',
          translation: 'When one does not know, one is not established. When one knows, then one is established.',
          hindi: 'जब नहीं जानता, तब स्थापित नहीं होता। जब जानता है, तब स्थापित होता है।',
          explanation: 'The Mundaka Upanishad reiterates the importance of knowledge: without knowledge, there is no establishment; with knowledge, there is establishment. This is not intellectual knowledge but direct recognition. The repetition emphasises that knowledge is the key to liberation.',
          science: 'Research on expertise and mastery: studies show that deep knowledge produces automatic, effortless performance in a domain. The Mundaka\'s "knowledge is establishment" maps onto what expertise research confirms: when you truly know something, you are established in it — it becomes automatic and effortless.',
          lifeLesson: 'The Mundaka teaches that establishment comes from knowledge. What do you want to be established in? Peace, compassion, wisdom? The path is to know it deeply — not intellectually but experientially. When you truly know peace, you are established in peace. The practice is to cultivate deep knowing of what you want to embody.',
          keywords: ['KnowledgeIsEstablishment', 'DirectRecognition', 'Mastery', 'EffortlessBeing'],
        },
      ],
    },
  ],
};
