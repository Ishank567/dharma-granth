import { Scripture } from "../types";

export const bhagavadGita: Scripture = {
  id: "bhagavadgita",
  title: "Bhagavad Gita",
  titleSanskrit: "श्रीमद्भगवद्गीता",
  category: "itihasa",
  description:
    "The divine song of Lord Krishna, 700 verses across 18 chapters.",
  author: "Vyasa",
  totalVerses: 700,
  tags: ["Gita", "Krishna", "Arjuna", "Yoga"],
  chapters: [
    {
      id: 1,
      title: "Arjuna Vishada Yoga",
      titleSanskrit: "अर्जुनविषादयोगः",
      summary: "Arjuna sees relatives on the battlefield and refuses to fight.",
      verses: [
        {
          id: 1,
          sanskrit:
            "धृतराष्ट्र उवाच | धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः | मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||",
          transliteration:
            "dhṛtarāṣṭra uvāca | dharmakṣetre kurukshetre samavetā yuyutsavaḥ | māmakāḥ pāṇḍavāścaiva kimakurvata sañjaya ||",
          translation:
            "Dhritarashtra said: O Sanjaya, after assembling in the sacred place of Kurukshetra, desiring to fight, what did my sons and the sons of Pandu do?",
          hindi:
            "धृतराष्ट्र ने कहा — हे संजय! धर्मभूमि कुरुक्षेत्र में युद्ध की इच्छा से एकत्रित मेरे और पाण्डु के पुत्रों ने क्या किया?",
          explanation:
            'Dhritarashtra\'s use of "māmakāḥ" (my sons) reveals his attachment to the Kauravas. His blindness is both physical and metaphorical — he cannot see the destruction caused by adharma.',
          science:
            'Modern cognitive science confirms this bias: "in-group favoritism" creates mental blind spots. The brain\'s amygdala activates stronger emotional responses for "ours" vs "others" — the exact mechanism that leads societies into conflict.',
          lifeLesson:
            'Beware of possessive words like "mine". Every war, personal or global, begins with "me vs them". Self-observation of our attachments is the first step toward clarity.',
          keywords: ["Attachment", "Bias", "Kurukshetra"],
        },
        {
          id: 20,
          sanskrit:
            "अथ व्यवस्थितान् दृष्ट्वा धार्तराष्ट्रान् कपिध्वजः | प्रवृत्ते शस्त्रसम्पाते धनुरुद्यम्य पाण्डवः ||",
          transliteration:
            "atha vyavasthitān dṛṣṭvā dhārtarāṣṭrān kapidhvajaḥ | pravṛtte śastrasampāte dhanurudyamya pāṇḍavaḥ ||",
          translation:
            "O King, thereafter, seeing the sons of Dhritarashtra arrayed and weapons about to clash, the Pandava (Arjuna), whose banner bore the monkey emblem, picked up his bow.",
          explanation:
            'Arjuna is called "kapidhvajaḥ" — one whose banner bears Hanuman. This signifies divine protection. He picks up his bow, showing initial readiness.',
          hindi:
            "हनुमान-ध्वज वाले अर्जुन ने युद्ध के लिए अपना धनुष उठाया। प्रतीक और आदर्श मन को साहस देते हैं।",
          science:
            "मनोविज्ञान में Symbolic Self-Completion Theory (Wicklund & Gollwitzer): जब हम किसी आदर्श का प्रतीक धारण करते हैं, तो हमारा आत्मविश्वास और कार्य-क्षमता वास्तव में बढ़ जाती है। एथलीट के jersey number से लेकर सेना के badges तक — प्रतीक हमें अपने उद्देश्य से जोड़ते हैं।",
          lifeLesson:
            "अपने लिए एक ऐसा प्रतीक, आदर्श या मंत्र चुनो जो कठिन क्षणों में तुम्हें याद दिलाए — तुम कौन हो और क्यों लड़ रहे हो।",
          keywords: ["Symbol", "Identity", "Readiness"],
        },
        {
          id: 28,
          sanskrit:
            "अर्जुन उवाच | दृष्ट्वेमं स्वजनं कृष्ण युयुत्सुं समुपस्थितम् | सीदन्ति मम गात्राणि मुखं च परिशुष्यति ||",
          transliteration:
            "arjuna uvāca | dṛṣṭvemaṃ svajanaṃ kṛṣṇa yuyutsuṃ samupasthitam | sīdanti mama gātrāṇi mukhaṃ ca pariśuṣyati ||",
          translation:
            "Arjuna said: O Krishna, seeing my own kinsmen arrayed here eager to fight, my limbs are giving way, and my mouth is drying up.",
          explanation:
            'Arjuna\'s physical symptoms — trembling limbs, dry mouth — are signs of acute stress. He calls them "svajanam" (own people), revealing he cannot see them as enemies.',
          hindi:
            "अर्जुन बोले — हे कृष्ण! युद्ध की इच्छा से खड़े इन स्वजनों को देखकर मेरे अंग शिथिल हो रहे हैं और मुँह सूख रहा है।",
          science:
            'अर्जुन के लक्षण — कंपन, शुष्क मुख, शरीर का शिथिल पड़ना — Acute Stress Response के क्लासिक संकेत हैं। Cortisol और Adrenaline का अचानक स्राव होता है जब मस्तिष्क किसी परिचित व्यक्ति को "शत्रु" की श्रेणी में रखने को बाध्य होता है — यही Cognitive Dissonance है।',
          lifeLesson:
            "जब शरीर में घबराहट हो, यह संकेत है कि मन किसी गहरे द्वंद्व में है। रुको, गहरी श्वास लो — भय को पहचानना ही उसे शक्ति में बदलने का पहला कदम है।",
          keywords: ["Stress", "CognitiveDissonance", "Courage"],
        },
        {
          id: 31,
          sanskrit:
            "निमित्तानि च पश्यामि विपरीतानि केशव | न च श्रेयोऽनुपश्यामि हत्वा स्वजनमाहवे ||",
          transliteration:
            "nimittāni ca paśyāmi viparītāni keśava | na ca śreyo'nupaśyāmi hatvā svajanamāhave ||",
          translation:
            "O Keshava (Krishna), I see only inauspicious omens. I do not see any good in killing my own kinsmen in battle.",
          explanation:
            "Arjuna sees inauspicious omens because his perception is clouded by attachment. What is actually his dharma appears inauspicious because he identifies with bodily relations rather than the soul.",
          hindi:
            "हे केशव! मैं अपशकुन ही देख रहा हूँ। युद्ध में स्वजनों को मारने में मुझे कोई कल्याण नहीं दिखता।",
          science:
            'Negativity Bias (Kahneman & Tversky): मानव मस्तिष्क खतरे को लाभ से 2-3 गुना अधिक भार देता है। जब अर्जुन "अपशकुन" देखते हैं, वे वास्तव में अपनी आंतरिक भय-अवस्था को बाहर प्रक्षेपित कर रहे हैं — Confirmation Bias का जीवंत उदाहरण।',
          lifeLesson:
            "जब सब कुछ बुरा लगे, तो एक क्षण रुककर पूछो — क्या यह वास्तविकता है, या मेरे भय का प्रक्षेपण? मन की अवस्था बदलो, और संसार बदला हुआ दिखेगा।",
          keywords: ["NegativeBias", "Projection", "Clarity"],
        },
        {
          id: 46,
          sanskrit:
            "यदि मामप्रतीकारमशस्त्रं शस्त्रपाणयः | धार्तराष्ट्रा रणे हन्युस्तन्मे क्षेमतरं भवेत् ||",
          transliteration:
            "yadi māmapratīkāramaśastraṃ śastrapāṇayaḥ | dhārtarāṣṭrā raṇe hanyustanme kṣemataraṃ bhavet ||",
          translation:
            "If the sons of Dhritarashtra, weapons in hand, slay me in battle while I am unarmed and unresisting, that would be better for me.",
          explanation:
            "Arjuna reaches the nadir of despondency. He confuses non-violence with cowardice. True non-violence is acting without hatred, not paralysis from attachment.",
          hindi:
            "यदि धार्तराष्ट्र शस्त्र-पाणि होकर युद्ध में मुझ अप्रतिकार करने वाले को मार दें, तो यह मेरे लिए अधिक कल्याणकारक होगा।",
          science:
            "यह Learned Helplessness (Seligman, 1972) का पाठ्यपुस्तक उदाहरण है — जब व्यक्ति इतना अभिभूत हो जाता है कि निष्क्रियता ही श्रेष्ठ विकल्प लगती है। यह मानसिक अवसाद (Depression) का प्रारंभिक चरण है जिसे गीता का पूरा उपदेश ठीक करने के लिए आता है।",
          lifeLesson:
            'जब "कुछ न करना" सबसे सुरक्षित लगने लगे — यह पलायन है, समाधान नहीं। यही वह संकट-बिंदु है जहाँ से वास्तविक परिवर्तन शुरू होता है।',
          keywords: ["LearnedHelplessness", "Crisis", "Transformation"],
        },
        {
          id: 47,
          sanskrit:
            "सञ्जय उवाच | एवमुक्त्वार्जुनः संख्ये रथोपस्थ उपाविशत् | विसृज्य सशरं चापं शोकसंविग्नमानसः ||",
          transliteration:
            "sañjaya uvāca | evamuktvārjunaḥ saṃkhye rathopastha upāviśat | visṛjya saśaraṃ cāpaṃ śokasaṃvignamānasaḥ ||",
          translation:
            "Having spoken thus, Arjuna cast aside his bow and arrows, and sat down on the chariot, his mind distressed with grief.",
          explanation:
            "Arjuna casts aside his weapons — the tools of his kshatriya dharma. His sitting posture signals defeat. This sets the stage for Krishna's entire teaching.",
          hindi:
            "संजय बोले — इस प्रकार कहकर, शोक से व्याकुल मन वाले अर्जुन ने रणभूमि में अपने बाण और धनुष छोड़कर रथ के पिछले भाग में बैठ गए।",
          science:
            "किसी भी मनोचिकित्सक को यह दृश्य Clinical Depression का textbook presentation लगेगा — withdrawal (युद्ध से दूर हटना), helplessness (हथियार डालना), और emotional overwhelm। यही गहरा संकट गीता के उपदेश की नींव है।",
          lifeLesson:
            "जीवन के सबसे बड़े सबक अक्सर सबसे गहरे संकट में मिलते हैं। अर्जुन का टूटना ही उसके बनने की शुरुआत थी। अपने टूटने को भी एक आरंभ मानो।",
          keywords: ["Depression", "Breakdown", "Breakthrough"],
        },
      ],
    },
    {
      id: 2,
      title: "Sankhya Yoga",
      titleSanskrit: "साङ्ख्ययोगः",
      summary: "The eternal Self and action without attachment.",
      verses: [
        {
          id: 11,
          sanskrit:
            "अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे | गतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ||",
          transliteration:
            "aśocyānanvaśocastvaṃ prajñāvādāṃśca bhāṣase | gatāsūnagatāsūṃśca nānuśocanti paṇḍitāḥ ||",
          translation:
            "You grieve for those who should not be grieved for, and yet you speak words of wisdom. The wise do not grieve for the departed or for those who have not departed.",
          explanation:
            "Krishna reveals Arjuna's contradiction — he speaks like a wise man but grieves like an ignorant one. The wise understand that the Self is eternal and never dies.",
          hindi:
            "श्रीकृष्ण बोले — तुम उनके लिए शोक करते हो जो शोक के योग्य नहीं हैं, फिर भी ज्ञान की बातें करते हो। बुद्धिमान न जीवित के लिए शोक करते हैं, न मृत के लिए।",
          science:
            "Cognitive Behavioral Therapy (CBT) का मूल सिद्धांत: विचार, भावना और व्यवहार के बीच असंगति (Cognitive Inconsistency) ही अधिकांश मानसिक पीड़ा का कारण है। कृष्ण यहाँ एक Master Therapist की तरह Arjuna की इस असंगति को सीधे इंगित करते हैं।",
          lifeLesson:
            "क्या तुम वह करते हो जो तुम जानते हो? ज्ञान और आचरण के बीच की खाई ही दुख का मूल है। आज एक ऐसे विश्वास को पहचानो जो तुम्हारे जीवन में दिखाई नहीं देता।",
          keywords: ["Wisdom", "SelfContradiction", "CBT"],
        },
        {
          id: 13,
          sanskrit:
            "देहिनोऽस्मिन्यथा देहे कौमारं यौवनं जरा | तथा देहान्तरप्राप्तिर्धीरस्तत्र न मुह्यति ||",
          transliteration:
            "dehino'sminyathā dehe kaumāraṃ yauvanaṃ jarā | tathā dehāntaraprāptirdhīrastatra na muhyati ||",
          translation:
            "Just as the embodied soul passes through childhood, youth, and old age in this body, so too does it pass into another body. The wise are not deluded by this.",
          hindi:
            "जैसे इस शरीर में जीवात्मा बाल्य, यौवन और वृद्धावस्था को प्राप्त होता है, वैसे ही वह दूसरे शरीर को प्राप्त होता है। धीर पुरुष इसमें मोहित नहीं होते।",
          explanation:
            "The Self (Atman) is the inhabitant of the body (dehin). Just as we change clothes, the soul changes bodies. Birth, death, and rebirth are natural transitions for the wise.",
          science:
            'Biology shows every 7 years, nearly all atoms in your body are replaced. Cells die, new ones form. You are not the same body you were at 5, 25, or 75 — yet your sense of "I" remains continuous. That continuity itself points to something beyond matter.',
          lifeLesson:
            "Change is the only constant. Grieve less over endings — whether of relationships, jobs, or phases of life. Every change is a passage, not a termination.",
          keywords: ["Transformation", "Change", "Rebirth"],
        },
        {
          id: 14,
          sanskrit:
            "मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः | आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ||",
          transliteration:
            "mātrāsparśāstu kaunteya śītoṣṇasukhaduḥkhadāḥ | āgamāpāyino'nityāstāṃstitikṣasva bhārata ||",
          translation:
            "The contact of the senses with their objects, O son of Kunti, gives rise to cold and heat, pleasure and pain. These are temporary and fleeting. Bear them patiently, O Bharata.",
          hindi:
            "हे कौन्तेय! इन्द्रियों का विषयों से सम्पर्क शीत-उष्ण, सुख-दुःख को देने वाला है। वे आगम-अपायिन (आने-जाने वाले) और अनित्य हैं, उन्हें तू सहन कर।",
          explanation:
            "Krishna introduces the practice of titiksha (patient endurance). The pairs of opposites — cold-heat, pleasure-pain — arise from sense contact, not from reality itself. They come and go; they are impermanent. The key teaching here is that suffering is not caused by external events but by our reaction to them. By developing titiksha, one learns to observe sensations without reaction, which is the foundation of equanimity.",
          science:
            "Neuroscience of emotional regulation (prefrontal cortex modulation of amygdala): The ability to observe sensations without immediate reaction is the core of emotional regulation. Research on mindfulness meditation shows that practitioners develop increased prefrontal control over emotional reactivity, reducing the suffering that arises from automatic responses to sensory stimuli.",
          lifeLesson:
            "The next time you feel discomfort — physical or emotional — pause before reacting. Ask: Is this sensation permanent? Will it pass? Can I simply observe it without judgment? This is the practice of titiksha — the gateway to inner peace.",
          keywords: ["Titiksha", "Endurance", "Equanimity", "Sensations"],
        },
        {
          id: 27,
          sanskrit:
            "जातस्य हि ध्रुवो मृत्युर्ध्रुवं जन्म मृतस्य च | तस्मादपरिहार्येऽर्थे न त्वं शोचितुमर्हसि ||",
          transliteration:
            "jātasya hi dhruvo mṛtyur dhruvaṃ janma mṛtasya ca | tasmādaparihārye'rthe na tvaṃ śocitumarhasi ||",
          translation:
            "For one who has taken birth, death is certain; and for one who has died, birth is certain. Therefore, you should not grieve over the inevitable.",
          hindi:
            "क्योंकि जन्म लेने वाले के लिए मृत्यु निश्चित है, और मृत्यु होने वाले के लिए जन्म निश्चित है। इसलिए इस अपरिहार्य विषय में तुम्हें शोक नहीं करना चाहिए।",
          explanation:
            "Krishna states the fundamental law of existence: the cycle of birth and death is inevitable for all embodied beings. Dhruva (certain, fixed) — both birth and death are certainties. The logic is simple: if you lament the inevitable, you create unnecessary suffering. The wise accept what cannot be changed and focus their energy on what can be transformed — their own inner state.",
          science:
            "Philosophy of Stoicism and Acceptance and Commitment Therapy (ACT): The Serenity Prayer and ACT both emphasize accepting what cannot be controlled. Research on psychological flexibility shows that accepting inevitable circumstances reduces suffering more than trying to control uncontrollable events.",
          lifeLesson:
            "Identify something in your life that is inevitable — aging, change, loss. Instead of resisting it, practice acceptance. This does not mean passivity; it means not wasting energy fighting reality, so you can use that energy for meaningful action.",
          keywords: ["Inevitable", "Acceptance", "BirthAndDeath", "Stoicism"],
        },
        {
          id: 20,
          sanskrit:
            "न जायते म्रियते वा कदाचिन् नायं भूत्वा भविता वा न भूयः | अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ||",
          transliteration:
            "na jāyate mriyate vā kadācin nāyaṃ bhūtvā bhavitā vā na bhūyaḥ | ajo nityaḥ śāśvato'yaṃ purāṇo na hanyate hanyamāne śarīre ||",
          translation:
            "The soul is never born, nor does it ever die. Having come into being, it never ceases to be. Unborn, eternal, everlasting, and ancient, the soul is not slain when the body is slain.",
          hindi:
            "आत्मा न तो कभी जन्म लेती है और न ही मरती है। वह एक बार उत्पन्न होने पर फिर होने वाली भी नहीं है। यह अजन्मा, नित्य, शाश्वत और पुरातन है — शरीर के नाश होने पर भी इसका नाश नहीं होता।",
          explanation:
            'One of the most celebrated verses. The Self is "aja" (unborn), "nitya" (eternal), "śāśvata" (permanent), and "purāṇa" (ancient). Death is only of the body, not of the Self.',
          science:
            'The Law of Conservation of Energy (Einstein): "Energy can neither be created nor destroyed, only transformed." Consciousness itself, many neuroscientists now argue (Penrose-Hameroff "Orch-OR" theory), may be a fundamental property of the universe — not produced by the brain.',
          lifeLesson:
            "You are not your body. The panic of mortality dissolves when one identifies with the eternal awareness that witnesses birth, growth, and death of the physical form.",
          keywords: ["Atman", "Eternity", "Consciousness"],
        },
        {
          id: 38,
          sanskrit:
            "सुखदुःखे समे कृत्वा लाभालाभौ जयाजयौ | ततो युद्धाय युज्यस्व नैवं पापमवाप्स्यसि ||",
          transliteration:
            "sukhaduḥkhe same kṛtvā lābhālābhau jayājayau | tato yuddhāya yujyasva naivaṃ pāpamavāpsyasi ||",
          translation:
            "Treating pleasure and pain, gain and loss, victory and defeat as the same — then engage in battle. Thus you will not incur sin.",
          hindi:
            "सुख-दुःख, लाभ-हानि और जय-पराजय को समान करके तब युद्ध के लिए तैयार हो। इस प्रकार तुम पाप नहीं प्राप्त करोगे।",
          explanation:
            "Krishna introduces the yoga of equanimity (samatva). The key to action without attachment is treating opposites as equal — not by suppressing feelings but by maintaining inner balance regardless of external outcomes. When action is performed without the fever of craving or aversion, it becomes pure (without sin/papa).",
          science:
            "Research on emotional regulation and equanimity (Kabat-Zinn): The ability to maintain stable emotional states regardless of external events is the hallmark of psychological resilience. Studies show that equanimity training reduces amygdala reactivity and increases prefrontal cortex regulation.",
          lifeLesson:
            "Practice treating small daily wins and losses equally today. Did someone cut you off in traffic? Treat it the same as if someone let you pass. This builds the 'sameness' muscle that becomes strength in major life challenges.",
          keywords: ["Samatva", "Equanimity", "SinlessAction", "Balance"],
        },
        {
          id: 39,
          sanskrit:
            "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन | मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||",
          transliteration:
            "karmaṇyevādhikāraste mā phaleṣu kadācana | mā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
          translation:
            "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results of your activities, nor be attached to inaction.",
          hindi:
            "तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं। न तो कर्म के फल का कारण बनो, और न ही कर्म न करने में आसक्त हो।",
          explanation:
            'The most famous verse of the Gita. Krishna teaches "Nishkama Karma" — action without attachment to results. One has control over action (karma) but not over the fruits (phala). Attachment to results causes bondage; inaction causes stagnation.',
          science:
            'Psychology calls this "process-focus" vs "outcome-focus". Research by Carol Dweck and others shows that individuals focused on the process (growth mindset) outperform those fixated on results. Elite athletes, surgeons, and scientists consistently report flow states arise only when outcome-attachment is dropped.',
          lifeLesson:
            "Give your 100% to effort, detach from outcome. Anxiety is nothing but the mind's refusal to let go of future results. Focus on what you CAN control — today's action — and peace follows.",
          keywords: ["Karma", "Nishkama", "DutyWithoutAttachment"],
        },
      ],
    },
    {
      id: 3,
      title: "Karma Yoga",
      titleSanskrit: "कर्मयोगः",
      summary: "Duty is obligatory; renounce attachment, not action.",
      verses: [
        {
          id: 19,
          sanskrit:
            "तस्मादसक्तः सततं कार्यं कर्म समाचर | असक्तो ह्याचरन्कर्म परमाप्नोति पुरुषः ||",
          transliteration:
            "tasmādasaktaḥ satataṃ kāryaṃ karma samācara | asakto hyācarankarma paramāpnoti puruṣaḥ ||",
          translation:
            "Therefore, always perform your duty without attachment. By working without attachment, one attains the Supreme.",
          hindi:
            "इसलिए सदा आसक्ति रहित होकर कर्तव्य-कर्म को भली-भाँति कर। आसक्ति रहित होकर कर्म करता हुआ मनुष्य परंब्रह्म को प्राप्त करता है।",
          explanation:
            "Action purifies the mind when done without attachment. Inaction binds one to inertia and tamas.",
          science:
            "Flow-state research by Mihaly Csikszentmihalyi: peak performance arises when a person is fully absorbed in the doing, without self-consciousness about the outcome. This is the Gita's asakti (non-attachment) validated by cognitive psychology.",
          lifeLesson:
            "Stop waiting for motivation. Act in the direction of duty, and clarity will follow. Inaction is the loudest form of procrastination; detached action is the antidote.",
          keywords: ["KarmaYoga", "Action", "FlowState"],
        },
        {
          id: 30,
          sanskrit:
            "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत | अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||",
          transliteration:
            "yadā yadā hi dharmasya glānirbhavati bhārata | abhyūthānamadharmasya tadātmānaṃ sṛjāmyaham ||",
          translation:
            "Whenever there is a decline of dharma and rise of adharma, O Arjuna, then I manifest Myself.",
          hindi:
            "जब-जब भारत! धर्म की हानि होती है और अधर्म की वृद्धि होती है, तब-तब मैं अपना रूप प्रकट करता हूँ।",
          explanation:
            "The famous declaration of avatarahood. Krishna does not say he incarnates to destroy evil; he incarnates when dharma declines. The focus is on restoration, not destruction. The divine response is not punitive but restorative.",
          keywords: ["Avatara", "Dharma", "DivineIntervention"],
        },
        {
          id: 35,
          sanskrit:
            "स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ||",
          transliteration:
            "svadharme nidhanaṃ śreyaḥ paradharmo bhayāvahaḥ ||",
          translation:
            "Better is one's own dharma, though imperfect, than the dharma of another well performed.",
          hindi:
            "अपने स्वधर्म में मरना भला है, चाहे वह अपूर्ण हो; परधर्म को अच्छी तरह से करना भयावह है।",
          explanation:
            "One of the most practical verses. Following another's path, even if done perfectly, is dangerous because it is not aligned with your nature. Your own dharma, even if imperfectly practiced, leads to genuine growth.",
          keywords: ["Svadharma", "Authenticity", "SelfAlignment"],
        },
        {
          id: 42,
          sanskrit:
            "यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः | स यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ||",
          transliteration:
            "yadyadācarati śreṣṭhastattadevetaro janaḥ | sa yatpramāṇaṃ kurute lokastadanuvartate ||",
          translation:
            "Whatever a great man does, others follow. Whatever standard he sets, the world follows.",
          explanation:
            "Leaders have a duty to set the highest example. Arjuna, as a kshatriya prince, must uphold dharma through action.",
          hindi:
            "जो-जो आचरण श्रेष्ठ पुरुष करता है, अन्य लोग भी वही करते हैं। वह जो प्रमाण स्थापित करता है, संसार उसी का अनुसरण करता है।",
          science:
            "Social Learning Theory (Bandura, 1977): मनुष्य एक Observational Learning प्राणी है। Mirror Neurons (Rizzolatti) की खोज ने सिद्ध किया — हमारा मस्तिष्क दूसरों के कार्यों को अपने भीतर simulate करता है। इसीलिए एक व्यक्ति का आचरण पूरे समाज को प्रभावित करता है।",
          lifeLesson:
            "तुम एक जीवित उदाहरण हो — चाहे जानो या न जानो। तुम्हारे बच्चे, साथी, सहकर्मी — सब तुम्हें देख रहे हैं। जो व्यवहार तुम दूसरों में देखना चाहते हो, वह पहले स्वयं प्रकट करो।",
          keywords: ["Leadership", "Modeling", "SocialInfluence"],
        },
      ],
    },
    {
      id: 4,
      title: "Jnana Karma Sanyasa Yoga",
      titleSanskrit: "ज्ञानकर्मसंन्यासयोगः",
      summary:
        "The paths of knowledge and action converge in offering to the Divine.",
      verses: [
        {
          id: 7,
          sanskrit:
            "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत | अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ||",
          transliteration:
            "yadā yadā hi dharmasya glānirbhavati bhārata | abhyutthānamadharmasya tadātmānaṃ sṛjāmyaham ||",
          translation:
            "Whenever righteousness declines and unrighteousness rises, O Bharata, I manifest Myself.",
          hindi:
            "हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अपने आपको प्रकट करता हूँ।",
          explanation:
            "Krishna promises divine intervention whenever dharma weakens. This verse is the foundation of the doctrine of divine avataras.",
          science:
            "Systems theory and thermodynamics: every stable system has a self-correcting mechanism (negative feedback). When entropy (disorder, adharma) rises, corrective forces emerge — biologically, socially, and cosmically. The universe is self-balancing.",
          lifeLesson:
            "Even in your darkest times, there is an internal compass that rises to restore balance. Trust the process. History shows every age of darkness has produced its own light-bearers.",
          keywords: ["Avatara", "Dharma", "Balance"],
        },
        {
          id: 8,
          sanskrit:
            "परित्राणाय साधूनां विनाशाय च दुष्कृताम् | धर्मसंस्थापनार्थाय सम्भवामि युगे युगे ||",
          transliteration:
            "paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām | dharmasaṃsthāpanārthāya sambhavāmi yuge yuge ||",
          translation:
            "To protect the righteous, destroy the wicked, and re-establish dharma, I appear in every age.",
          explanation:
            "The purpose of divine descent is not personal but cosmic — restoring the balance of dharma across ages.",
          hindi:
            "साधुओं की रक्षा, दुष्टों के विनाश और धर्म की पुनः स्थापना के लिए मैं युग-युग में प्रकट होता हूँ।",
          science:
            "Systems Theory में इसे Negative Feedback Loop कहते हैं — जब किसी तंत्र में विकार बढ़ता है, स्वतः सुधारात्मक शक्तियाँ उभरती हैं। जैव-विकास (Evolution) में भी: जब पारिस्थितिकी असंतुलित होती है, नई प्रजातियाँ और शक्तियाँ उभरकर संतुलन बहाल करती हैं।",
          lifeLesson:
            "इतिहास में हर अंधेरे युग ने अपना प्रकाश-पुरुष जन्मा है। अपने परिवार, समाज या कार्यक्षेत्र में जहाँ अधर्म दिखे — वहाँ खड़े होने का साहस रखो। हर युग को अपने अवतार चाहिए।",
          keywords: ["Avatara", "SystemBalance", "Dharma"],
        },
      ],
    },
    {
      id: 5,
      title: "Karma Sanyasa Yoga",
      titleSanskrit: "कर्मसंन्यासयोगः",
      summary:
        "Renunciation of attachment, not of action itself, leads to liberation.",
      verses: [],
    },
    {
      id: 6,
      title: "Atma Samyama Yoga",
      titleSanskrit: "आत्मसंयमयोगः",
      summary:
        "Meditation, mind control, and the qualities of a perfected yogi.",
      verses: [
        {
          id: 5,
          sanskrit:
            "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् | आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ||",
          transliteration:
            "uddharedātmanātmānaṃ nātmānamavasādayet | ātmaiva hyātmano bandhurātmaiva ripurātmanaḥ ||",
          translation:
            "One must elevate oneself by the mind; never degrade oneself. The mind is the friend of the conditioned soul, and his enemy as well.",
          hindi:
            "अपने आपको अपने आपसे ऊपर उठाओ, अपने आपको गिर्फ्तार न करो। मन ही आत्मा का मित्र है और मन ही आत्मा का शत्रु।",
          explanation:
            "The mind can be one's greatest ally or worst enemy. Self-mastery is the essence of yoga.",
          science:
            "Neuroscience: the prefrontal cortex (executive function) can regulate the amygdala (emotional center). Practices like meditation literally thicken the prefrontal cortex and weaken fear circuits — the brain rewires toward self-mastery.",
          lifeLesson:
            "You are your own greatest obstacle — and your only possible savior. Develop the habit of upgrading yourself daily; no external force can lift you as reliably as your own disciplined mind.",
          keywords: ["SelfMastery", "MindControl", "Neuroplasticity"],
        },
        {
          id: 6,
          sanskrit:
            "बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जितः | अनात्मनस्तु शत्रुत्वे वर्तेतात्मैव शत्रुवत् ||",
          transliteration:
            "bandhurātmātmanastasya yenātmaivātmanā jitaḥ | anātmanastu śatrutve vartetātmaiva śatruvat ||",
          translation:
            "For one who has conquered the mind, the mind is the best of friends. For one who has failed, the mind remains the greatest enemy.",
          explanation:
            "Victory over the self is true victory. An unconquered mind leads one into bondage despite external achievements.",
          hindi:
            "जिसने अपने मन को अपने आप से जीत लिया है, उसके लिए मन ही सर्वश्रेष्ठ मित्र है। जिसने मन को नहीं जीता, वह मन ही शत्रु की भाँति व्यवहार करता है।",
          science:
            "Neuroscience: Prefrontal Cortex (तर्कशील मस्तिष्क) और Amygdala (भावनात्मक प्रतिक्रिया-केंद्र) के बीच निरंतर संघर्ष होता है। fMRI अध्ययनों में पाया गया: दीर्घकालिक ध्यान-साधकों में Prefrontal Cortex मोटी होती है और Amygdala की प्रतिक्रिया कम होती है — मस्तिष्क शाब्दिक रूप से rewire हो जाता है।",
          lifeLesson:
            "मन को दबाओ मत — उसे प्रशिक्षित करो। रोज 10-15 मिनट का ध्यान, journaling या गहरी श्वास — ये छोटे अभ्यास धीरे-धीरे मस्तिष्क की संरचना बदल देते हैं।",
          keywords: ["MindControl", "Neuroplasticity", "Meditation"],
        },
      ],
    },
    {
      id: 7,
      title: "Jnana Vijnana Yoga",
      titleSanskrit: "ज्ञानविज्ञानयोगः",
      summary: "Krishna reveals His cosmic nature as the source of all.",
      verses: [
        {
          id: 7,
          sanskrit:
            "मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय | मयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव ||",
          transliteration:
            "mattaḥ parataraṃ nānyatkiñcidasti dhanañjaya | mayi sarvamidaṃ protaṃ sūtre maṇigaṇā iva ||",
          translation:
            "O Dhananjaya, there is nothing higher than Me. All this is strung on Me like pearls on a thread.",
          explanation:
            "Krishna is the Supreme Reality. The entire universe depends on Him as beads depend on the string.",
          hindi:
            "हे धनंजय! मुझसे श्रेष्ठ कोई और नहीं है। यह सारा जगत मुझ पर उसी प्रकार पिरोया हुआ है जैसे मोतियों की माला में धागे पर मोती।",
          science:
            'Quantum Field Theory और String Theory: सभी भिन्न-भिन्न दिखने वाले कण वास्तव में एक ही मूलभूत क्षेत्र (field) की अभिव्यक्तियाँ हैं। David Bohm का Implicate Order सिद्धांत: ब्रह्मांड एक अखंड सत्ता है जिसमें से विविधता प्रकट होती है — गीता के "सूत्रे मणिगणा इव" का वैज्ञानिक प्रतिध्वनि।',
          lifeLesson:
            "एकांत में बैठकर अनुभव करो — तुम सब चीजों से जुड़े हो। तुम्हारी श्वास, जल, सूर्य का प्रकाश, तुम्हारे विचार — सब एक ही जाल के हिस्से हैं। यह बोध अहंकार को पिघला देता है।",
          keywords: ["Unity", "QuantumField", "Interconnectedness"],
        },
        {
          id: 8,
          sanskrit:
            "रसोऽहमप्सु कौन्तेय प्रभास्मि शशिसूर्ययोः | प्रणवः सर्ववेदेषु शब्दः खे पौरुषं नृषु ||",
          transliteration:
            "raso'hamapsu kaunteya prabhāsmi śaśisūryayoḥ | praṇavaḥ sarvavedeṣu śabdaḥ khe pauruṣaṃ nṛṣu ||",
          translation:
            "O son of Kunti, I am the taste of water, the light of the sun and moon, the syllable Om in the Vedas, sound in ether, and ability in man.",
          hindi:
            "हे कुन्तीपुत्र! मैं जल में रस, चन्द्रमा और सूर्य में प्रभा, सभी वेदों में ओंकार, आकाश में शब्द, और मनुष्यों में पुरुषत्व (पौरुष) हूँ।",
          explanation:
            "God is not distant but immanent — the essence of every experience. Recognizing the Divine in everything is the path of the wise.",
          science:
            "Panpsychism — the theory embraced by leading physicists like Roger Penrose and philosophers like David Chalmers — proposes that consciousness may be a fundamental property of the universe, pervading every atom. This echoes the Gita's immanent divinity.",
          lifeLesson:
            "Learn to notice the Divine in ordinary moments — the taste of water, the warmth of sunlight, the power of voice. Reverence for daily experience transforms life into worship.",
          keywords: ["Immanence", "Divinity", "Wonder"],
        },
      ],
    },
    {
      id: 8,
      title: "Akshara Parabrahman Yoga",
      titleSanskrit: "अक्षरपरब्रह्मयोगः",
      summary: "The imperishable Brahman and the path of devotion.",
      verses: [
        {
          id: 5,
          sanskrit:
            "अन्तकाले च मामेव स्मरन्मुक्त्वा कलेवरम् | यः प्रयाति स मद्भावं याति नास्त्यत्र संशयः ||",
          transliteration:
            "antakāle ca māmeva smaranmuktvā kalevaram | yaḥ prayāti sa madbhāvaṃ yāti nāstyatra saṃśayaḥ ||",
          translation:
            "Whoever leaves the body at the final moment remembering Me alone, attains My nature. Of this there is no doubt.",
          explanation:
            "The final thought at death determines the next birth. Constant remembrance of God during life ensures remembrance at death.",
          hindi:
            "जो अंत समय में मुझे ही स्मरण करते हुए शरीर त्यागता है, वह मेरे स्वरूप को प्राप्त होता है। इसमें कोई संशय नहीं।",
          science:
            "Neuroscience of habit (BJ Fogg, Charles Duhigg): मृत्यु के क्षणों में brain activity, जीवनभर की सबसे गहरी mental conditioning को reflect करती है। जो विचार-पैटर्न हम बार-बार अभ्यास करते हैं, वे neural pathways बन जाती हैं। अंतिम विचार जीवन-भर की practice का फल है।",
          lifeLesson:
            "मृत्यु-शैया पर जो विचार हो, वह आज की आदत पर निर्भर है। अभी से अपने daily thoughts का अवलोकन करो — जो प्रतिदिन मन में आता है, वही अंत में भी आएगा।",
          keywords: ["LastThought", "HabitFormation", "Consciousness"],
        },
        {
          id: 7,
          sanskrit:
            "तस्मात्सर्वेषु कालेषु मामनुस्मर युध्य च | मय्यर्पितमनोबुद्धिर्मामेवैष्यस्यसंशयम् ||",
          transliteration:
            "tasmātsarveṣu kāleṣu māmanusmara yudhya ca | mayyarpitamanobuddhirmāmevaiṣyasyaṃśayam ||",
          translation:
            "Therefore, always remember Me and fight. With mind and intellect dedicated to Me, you shall come to Me without doubt.",
          explanation:
            "Devotion and duty are not contradictory. Offer your actions and thoughts to God while performing your worldly duties.",
          hindi:
            "इसलिए सब समय मुझे स्मरण करते हुए युद्ध भी करो। मुझमें मन और बुद्धि अर्पित करने से तुम निःसंदेह मुझे ही प्राप्त होगे।",
          science:
            'Dual-task automaticity research (Shiffrin & Schneider, 1977): गहन अभ्यास से दो कार्य एक साथ automatic हो जाते हैं। Trained surgeons, athletes और musicians crisis में भी calmly perform करते हैं क्योंकि उनकी skill और awareness simultaneously active होती है — यही "युद्ध करते हुए स्मरण" है।',
          lifeLesson:
            "भक्ति का अर्थ केवल मंदिर नहीं — अपने हर कार्य में पूर्ण जागरूकता और समर्पण। आज एक काम चुनो और उसे पूरी उपस्थिति (presence) के साथ करो — यही आधुनिक भक्ति है।",
          keywords: ["Devotion", "Mindfulness", "Automaticity"],
        },
      ],
    },
    {
      id: 9,
      title: "Raja Vidya Raja Guhya Yoga",
      titleSanskrit: "राजविद्याराजगुह्ययोगः",
      summary: "The most confidential knowledge — pure devotion is supreme.",
      verses: [
        {
          id: 22,
          sanskrit:
            "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते | तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ||",
          transliteration:
            "ananyāścintayanto māṃ ye janāḥ paryupāsate | teṣāṃ nityābhiyuktānāṃ yogakṣemaṃ vahāmyaham ||",
          translation:
            "For those who worship Me with exclusive devotion, meditating on Me constantly, I carry what they lack and preserve what they have.",
          hindi:
            "जो भक्त अनन्य भाव से मेरा चिन्तन करते हुए मेरी उपासना करते हैं, उन नित्य भक्तों का योगक्षेम मैं स्वयं वहन करता हूँ।",
          explanation:
            'God personally takes care of His devotees. "Yoga" means acquiring what one lacks; "kṣema" means protecting what one has.',
          science:
            "Studies on religious/spiritual practice (by psychologists Koenig, Vaillant) show that consistent faith-based living correlates with lower cortisol levels, better immune function, faster recovery from illness, and stronger resilience during crises.",
          lifeLesson:
            "Trust unlocks providence. When your energy stops being consumed by worry, it becomes available for wise action — and wise action naturally attracts the right resources at the right time.",
          keywords: ["Trust", "Devotion", "DivineProvidence"],
        },
        {
          id: 27,
          sanskrit:
            "ये त्वक्षरमनिर्देश्यमव्यक्तं पर्युपासते | सर्वत्रगमचिन्त्यं च कूटस्थमचलं ध्रुवम् ||",
          transliteration:
            "ye tvakṣaramanirdeśyamavyaktaṃ paryupāsate | sarvatragamacintyaṃ ca kūṭasthamacalaṃ dhruvam ||",
          translation:
            "Others, who worship the imperishable, indefinable, unmanifest, omnipresent, unthinkable, unchangeable, immovable, and eternal...",
          explanation:
            "Devotion to the unmanifest (nirguna Brahman) is harder but also leads to liberation. The path of saguna (with form) is easier for embodied beings.",
          hindi:
            "जो अक्षर, अनिर्देश्य, अव्यक्त, सर्वव्यापी, अचिंत्य, अचल और ध्रुव की उपासना करते हैं...",
          science:
            'Nirguna Brahman की अवधारणा Mathematics के "Infinity" जैसी है — परिभाषित करते ही वह सीमित हो जाती है। Apophatic (Negative) Theology: ईश्वर को वह नहीं कहा जा सकता जो वह है — केवल यह कहा जा सकता है कि वह क्या नहीं है। यही Upanishadic tradition का पश्चिमी प्रतिध्वनि है।',
          lifeLesson:
            "कुछ सत्य शब्दों और विचारों से परे हैं — वे केवल अनुभव से जाने जाते हैं। अपनी practice में formless silence के साथ समय बिताओ — बिना किसी concept, image या mantra के।",
          keywords: ["NirgunaBrahman", "Formless", "Silence"],
        },
      ],
    },
    {
      id: 10,
      title: "Vibhuti Yoga",
      titleSanskrit: "विभूतियोगः",
      summary: "Krishna describes His divine glories and manifestations.",
      verses: [
        {
          id: 20,
          sanskrit:
            "अहमात्मा गुडाकेश सर्वभूताशयस्थितः | अहमादिश्च मध्यं च भूतानामन्त एव च ||",
          transliteration:
            "ahamātmā guḍākeśa sarvabhūtāśayasthitaḥ | ahamādiśca madhyaṃ ca bhūtānāmantameva ca ||",
          translation:
            "O Arjuna, I am the Self seated in the heart of all beings. I am the beginning, the middle, and the end of all beings.",
          explanation:
            "Krishna is the inner Self (Atman) of all. He is the origin, sustenance, and dissolution of everything.",
          hindi:
            "हे गुडाकेश! मैं सभी प्राणियों के हृदय में स्थित आत्मा हूँ। मैं ही सभी प्राणियों का आदि, मध्य और अंत हूँ।",
          science:
            "Panpsychism theory (David Chalmers, Roger Penrose): consciousness may be a fundamental property of the universe, not generated by the brain. यदि यह सत्य है, तो हर कण में awareness है — ठीक वैसे ही जैसे गीता कहती है कि कृष्ण हर प्राणी की आत्मा हैं।",
          lifeLesson:
            "जब किसी की आँखों में देखो, याद रखो — वहाँ वही चेतना है जो तुम्हारे भीतर है। यह बोध करुणा को स्वाभाविक और हिंसा को असंभव बना देता है।",
          keywords: ["Consciousness", "Panpsychism", "Atman"],
        },
        {
          id: 34,
          sanskrit:
            "अदृश्यतां गतं पार्थ मायया ते तदात्मकम् | यत्तु सत्यं सनातनं तदहं वदतः स्म ते ||",
          transliteration:
            "adṛśyatāṃ gataṃ pārtha māyayā te tadātmakam | yattu satyaṃ sanātanaṃ tadahaṃ vadataḥ sma te ||",
          translation:
            "O Partha, the cosmic form you saw was manifested by My Yoga-Maya. Now I shall reveal to you My eternal form.",
          explanation:
            "The cosmic form (Vishwarupa) is a temporary manifestation. Krishna's true form is eternal and personal — the beautiful two-armed form.",
          hindi:
            "हे पार्थ! जो तुमने देखा वह मेरी योगमाया से प्रकट किया गया था। अब मैं तुम्हें अपना शाश्वत रूप बताता हूँ।",
          science:
            'Physics में Observer Effect: quantum mechanics में किसी phenomenon को observe करने का कार्य उसे alter कर देता है। सभी scientific models (Newton → Einstein → Quantum) provisional forms हैं — deeper reality के "snapshots"। The Vishwarupa was Krishna adapted to Arjuna\'s level of perception.',
          lifeLesson:
            'जो दिखता है वह पूरी सच्चाई नहीं है। हमारे सभी models, narratives और perceptions provisional हैं। जिज्ञासा रखो, किसी भी "final answer" को अंतिम मत मानो।',
          keywords: ["Maya", "Perception", "QuantumObserver"],
        },
      ],
    },
    {
      id: 11,
      title: "Vishwarupa Darshana Yoga",
      titleSanskrit: "विश्वरूपदर्शनयोगः",
      summary: "Krishna reveals His cosmic universal form to Arjuna.",
      verses: [
        {
          id: 32,
          sanskrit:
            "दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता | यदि भाः सदृशी सा स्याद्भासस्तस्य महात्मनः ||",
          transliteration:
            "divi sūryasahasrasya bhavedyugapadutthitā | yadi bhāḥ sadṛśī sā syādbhāsastasya mahātmanaḥ ||",
          translation:
            "If the radiance of a thousand suns were to burst forth at once in the sky, that would be like the splendor of the Mighty One.",
          explanation:
            "Arjuna sees Krishna's cosmic form (Vishwarupa) — infinite, terrifying, and magnificent. The comparison to a thousand suns conveys its overwhelming brilliance.",
          hindi:
            "आकाश में एक साथ हज़ार सूर्य उदय हों तो जो प्रकाश हो, वह उस महात्मा (विश्वरूप) के तेज के समान होगा।",
          science:
            "J. Robert Oppenheimer ने Trinity Nuclear Test (1945) के बाद इसी श्लोक को उद्धृत किया। Nuclear fission में E=mc² — एक सूक्ष्म परमाणु से असीम ऊर्जा का विमोचन। वैज्ञानिक भी इस श्लोक की भाषा में ब्रह्मांड की असीम शक्ति का वर्णन खोजते हैं।",
          lifeLesson:
            'कुछ अनुभव शब्दों से परे हैं — जन्म, मृत्यु, प्रेम, ब्रह्मांड की विशालता। इनके सामने विनम्र रहो। Science भी ऐसे ही "cosmic awe" से बढ़ती है — Einstein ने कहा था: "The most beautiful thing is the mysterious."',
          keywords: ["CosmicForm", "Nuclear", "Awe"],
        },
      ],
    },
    {
      id: 12,
      title: "Bhakti Yoga",
      titleSanskrit: "भक्तियोगः",
      summary: "The path of devotion is declared supreme.",
      verses: [
        {
          id: 13,
          sanskrit:
            "समः शत्रौ च मित्रे च तथा मानापमानयोः | शीतोष्णसुखदुःखेषु समः सङ्गविवर्जितः ||",
          transliteration:
            "samaḥ śatrau ca mitre ca tathā mānāpamānayoḥ | śītoṣṇasukhaduḥkheṣu samaḥ saṅgavivarjitaḥ ||",
          translation:
            "One who is equal to friends and enemies, honor and dishonor, heat and cold, pleasure and pain, and is free from attachment...",
          hindi:
            "जो शत्रु और मित्र में, मान और अपमान में, सर्दी-गर्मी और सुख-दुःख में समद्र्शी हो, और आसक्ति से रहित हो — वह भक्त मुझे प्रिय है।",
          explanation:
            "A true devotee is equipoised under all conditions. Such a person is dear to Krishna.",
          science:
            'Affective neuroscience shows emotional equanimity is a trained skill: long-term meditators have measurably less amygdala reactivity to stressors, a phenomenon called "affective resilience". The brain literally reshapes itself through practice.',
          lifeLesson:
            "Your peace should not depend on the weather of the world. Practice responding rather than reacting. An emotionally stable person is more valuable to themselves and society than a reactive genius.",
          keywords: ["Equanimity", "Resilience", "Balance"],
        },
        {
          id: 15,
          sanskrit:
            "यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः | हर्षामर्षभयोद्वेगैर्मुक्तो यः स च मे प्रियः ||",
          transliteration:
            "yasmānnodvijate loko lokānnodvijate ca yaḥ | harṣāmarṣabhayodvegairmukto yaḥ sa ca me priyaḥ ||",
          translation:
            "One by whom the world is not agitated, and who is not agitated by the world — who is free from joy, envy, fear, and anxiety — he is dear to Me.",
          explanation:
            "The ideal devotee neither disturbs others nor is disturbed by them. Freedom from the pairs of opposites (dvandvas) is the mark of mature devotion.",
          hindi:
            "जिससे संसार उद्विग्न नहीं होता और जो संसार से उद्विग्न नहीं होता, जो हर्ष, अमर्ष, भय और उद्वेग से मुक्त है — वह मुझे प्रिय है।",
          science:
            'Emotional Contagion research (Hatfield, 1993): मनुष्य अनजाने में दूसरों की भावनाएँ "catch" करते हैं। EEG studies: experienced meditators की brainwaves आसपास के लोगों को coherence की ओर ले जाती हैं। एक स्थिर व्यक्ति वास्तव में अपने आसपास की भावनात्मक climate को बदलता है।',
          lifeLesson:
            "तुम्हारी आंतरिक शांति एक सार्वजनिक सेवा है। जब तुम भय और उद्वेग से मुक्त होते हो, तुम हर उस व्यक्ति के लिए एक anchor बन जाते हो जो तुम्हारे जीवन में आता है।",
          keywords: ["Equanimity", "EmotionalContagion", "Peace"],
        },
      ],
    },
    {
      id: 13,
      title: "Kshetra Kshetrajna Vibhaga Yoga",
      titleSanskrit: "क्षेत्रक्षेत्रज्ञविभागयोगः",
      summary: "The field (body) and the knower of the field (Self).",
      verses: [
        {
          id: 2,
          sanskrit:
            "क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत | क्षेत्रक्षेत्रज्ञयोर्ज्ञानं यत्तज्ज्ञानं मतं मम ||",
          transliteration:
            "kṣetrajñaṃ cāpi māṃ viddhi sarvakṣetreṣu bhārata | kṣetrakṣetrajñayorjñānaṃ yattajjñānaṃ mataṃ mama ||",
          translation:
            "And also know Me to be the knower of the field in all fields, O Bharata. I consider true knowledge to be the understanding of the field and the knower of the field.",
          hindi:
            "और हे भारत! सभी क्षेत्रों में क्षेत्रज्ञ (क्षेत्र को जानने वाला) भी मुझे ही जानो। क्षेत्र और क्षेत्रज्ञ का यह ज्ञान ही मेरे मत में सच्चा ज्ञान है।",
          explanation:
            'Krishna introduces the fundamental metaphysical distinction: the "field" (body, mind, senses, and all their modifications) and the "knower of the field" (pure consciousness). The body is the field — it changes, ages, dies. The knower of the field is the eternal witness. Identifying with the field is ignorance; recognizing oneself as the knower is wisdom.',
          science:
            "Neuroscience's hard problem: the brain (field) can be fully mapped, yet the subjective experiencer (knower of field) remains elusive. Theories like IIT (Tononi) try to locate consciousness in the brain, but the witness that observes the brain's activity seems always one step removed from any physical description — exactly the distinction the Gita draws.",
          lifeLesson:
            'When you say "my mind is anxious" or "my body is tired" — notice: who is the "my"? There is an observer who notices the anxiety and the fatigue. That observer is the knower of the field. Practice resting in that observer identity rather than being the anxious mind or the tired body.',
          keywords: ["Kshetra", "Witness", "SelfVsBody"],
        },
        {
          id: 28,
          sanskrit:
            "समं सर्वेषु भूतेषु तिष्ठन्तं परमेश्वरम् | विनश्यत्स्वविनश्यन्तं यः पश्यति स पश्यति ||",
          transliteration:
            "samaṃ sarvebhūteṣu tiṣṭhantaṃ parameśvaram | vinaśyatsvavinaśyantaṃ yaḥ paśyati sa paśyati ||",
          translation:
            "He who sees the Supreme Lord dwelling equally in all beings — not perishing when they perish — he truly sees.",
          hindi:
            "जो सभी प्राणियों में समान रूप से स्थित परमेश्वर को देखता है, नाशवान में अविनाशी को देखता है — वही वास्तव में देखता है।",
          explanation:
            "The definition of true sight: seeing the eternal, unchanging consciousness in all temporary forms. Most people see only the forms — the differences, the distinctions, the personalities. The wise see the one consciousness that animates all forms equally.",
          science:
            'Social neuroscience: oxytocin-driven empathy allows humans to perceive others as experiencers, not just objects. The "theory of mind" (Premack & Woodruff) — the ability to attribute consciousness to others — is the neural basis of seeing "the Lord in all beings." The Gita extends this to all beings, not just humans.',
          lifeLesson:
            "Choose one person today whom you normally dismiss or dislike. Look into their eyes and ask: what is alive in there? What consciousness looks back at me? This is the practice of seeing the Lord in all beings — and it transforms relationships from transactional to sacred.",
          keywords: ["EqualVision", "Consciousness", "EmpathyPractice"],
        },
      ],
    },
    {
      id: 14,
      title: "Gunatraya Vibhaga Yoga",
      titleSanskrit: "गुणत्रयविभागयोगः",
      summary: "The three gunas — sattva, rajas, and tamas.",
      verses: [
        {
          id: 5,
          sanskrit:
            "सत्त्वं रजस्तम इति गुणाः प्रकृतिसम्भवाः | निबध्नन्ति महाबाहो देहे देहिनमव्ययम् ||",
          transliteration:
            "sattvaṃ rajastama iti guṇāḥ prakṛtisambhavāḥ | nibadhnanti mahābāho dehe dehinamavyayam ||",
          translation:
            "Sattva, rajas, and tamas — these three qualities born of nature bind the embodied, eternal soul to the body.",
          hindi:
            "हे महाबाहो! सत्त्व, रज और तम — ये प्रकृति से उत्पन्न तीन गुण अव्यय देही (आत्मा) को शरीर में बाँधते हैं।",
          explanation:
            "The three gunas are the fundamental operating modes of all matter and mind. Sattva = clarity, light, harmony. Rajas = energy, passion, restlessness, ambition. Tamas = inertia, heaviness, delusion, lethargy. Every thought, food, action, and environment pushes us toward one of these three states.",
          science:
            "Circadian biology and neuropsychology: the human brain operates in distinct states — alert/clarity (sattva-dominant), aroused/stressed (rajas-dominant), and sluggish/foggy (tamas-dominant). Diet, sleep, exercise, and environment measurably shift the brain between these states. The Gita's three-guna model is an ancient phenomological map of what neuroscience now measures physiologically.",
          lifeLesson:
            "Audit your current state: Are you clear and focused (sattva)? Restless and driven (rajas)? Dull and heavy (tamas)? Then trace back: what did you eat today, how did you sleep, what have you been watching/reading? Every input shifts your guna balance. You have far more control over your mental state than you think.",
          keywords: ["ThreeGunas", "Sattva", "MindStates"],
        },
        {
          id: 17,
          sanskrit:
            "सत्त्वात्सञ्जायते ज्ञानं रजसो लोभ एव च | प्रमादमोहौ तमसो भवतोऽज्ञानमेव च ||",
          transliteration:
            "sattvātsañjāyate jñānaṃ rajaso lobha eva ca | pramādamohau tamaso bhavatojñānameva ca ||",
          translation:
            "From sattva, knowledge arises; from rajas, greed; from tamas, negligence, delusion, and ignorance also.",
          hindi:
            "सत्त्व से ज्ञान उत्पन्न होता है; रजस से लोभ; और तमस से प्रमाद, मोह और अज्ञान।",
          explanation:
            "Each guna produces its characteristic fruit in the mind. Sattva produces clear understanding (jnana). Rajas produces greed — always wanting more, never satisfied. Tamas produces negligence (pramada) and delusion (moha). These are not moral judgments but precise descriptions of how different mind-states produce different thoughts and actions.",
          science:
            "Cognitive neuroscience confirms: in high-clarity states (correlated with alpha/theta brainwaves, rested prefrontal cortex), insight and learning are maximized. In high-arousal states (high cortisol, sympathetic activation), the focus narrows to immediate reward-seeking (rajas = greed). In low-energy states (poor sleep, sedentary lifestyle), cognitive function degrades into confusion and inertia (tamas). The three gunas map onto measurable neurological states.",
          lifeLesson:
            "When you notice greed or craving arising (rajas), ask: what would bring me back toward sattva? Often it is a walk, silence, good food, a conversation, or rest. When you notice lethargy (tamas), ask the same. The gunas are workable — you are not trapped in any state.",
          keywords: ["Sattva", "KnowledgeVsGreed", "MindStateManagement"],
        },
        {
          id: 26,
          sanskrit:
            "मां च योऽव्यभिचारेण भक्तियोगेन सेवते | स गुणान् समतीत्यैतान् ब्रह्मभूयाय कल्पते ||",
          transliteration:
            "māṃ ca yo'vyabhicāreṇa bhaktiyogena sevate | sa guṇān samatītyaitān brahmabhūyāya kalpate ||",
          translation:
            "One who serves Me with undeviating devotion, transcending these three qualities, becomes fit to realize Brahman.",
          hindi:
            "जो अव्यभिचारी भक्तियोग से मेरी सेवा करता है, वह इन तीनों गुणों को पार करके ब्रह्म-प्राप्ति के योग्य हो जाता है।",
          explanation:
            'The ultimate way to transcend the gunas is not suppression but transcendence through devotion. The person who acts entirely in service — with no personal agenda, no craving for results — is no longer caught in the web of guna-interactions. They become "gunatita" — beyond the qualities.',
          science:
            'Self-Determination Theory (Deci & Ryan): intrinsic motivation (acting from pure volition, for its own sake) produces vastly different neurological and psychological outcomes than extrinsic motivation (acting for reward/fear). The "devotion" the Gita describes is the purest form of intrinsic motivation — acting from love of the divine, not for personal gain.',
          lifeLesson:
            "Any activity done with complete surrender — without personal agenda, without craving for outcome — becomes a form of devotion. Today, do one task entirely for its own sake, as an offering. Notice how the quality of attention changes.",
          keywords: ["Devotion", "BeyondGunas", "IntrinsicMotivation"],
        },
      ],
    },
    {
      id: 15,
      title: "Purushottama Yoga",
      titleSanskrit: "पुरुषोत्तमयोगः",
      summary: "The Supreme Person beyond the perishable and imperishable.",
      verses: [
        {
          id: 1,
          sanskrit:
            "ऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम् | छन्दांसि यस्य पर्णानि यस्तं वेद स वेदवित् ||",
          transliteration:
            "ūrdhvamūlamadhaḥśākhamaśvatthaṃ prāhuravyayam | chandāṃsi yasya parṇāni yastaṃ veda sa vedavit ||",
          translation:
            "They speak of an imperishable Ashvattha tree with its roots above and branches below, whose leaves are the Vedas. He who knows it is the knower of the Vedas.",
          hindi:
            "अश्वत्थ वृक्ष (पीपल) को ऊर्ध्वमूल (ऊपर जड़) और अधःशाखा (नीचे शाखाएँ) वाला अव्यय (अनश्वर) कहते हैं। उसके पत्ते वेद हैं। जो इसे जानता है वह वेद-वेत्ता है।",
          explanation:
            'The cosmic tree with roots above (in Brahman) and branches below (in the manifest world) is a profound metaphor for existence. Our world of appearances grows downward from a transcendent root. The tree is "ashvattha" — impermanent, never the same tomorrow (ashva = tomorrow; stha = standing = that which does not stand till tomorrow). The only permanent thing is the root — Brahman.',
          science:
            'Evolutionary biology views life as a tree — all species branching from a common origin (root). Chaos theory: complex systems are "top-down" in the sense that a few fundamental laws (roots/invariants) give rise to immense variety (branches/leaves). The Gita\'s inverted tree — where the transcendent is the root and the visible is the leaf — is a model of how order flows from a higher source.',
          lifeLesson:
            "Everything visible — your career, relationships, health, achievements — are the branches and leaves. They grow from unseen roots. Spend time with the roots: your values, your inner life, your connection to the Source. A tree with deep roots survives any storm.",
          keywords: ["AshvatthaTree", "Roots", "TranscendentSource"],
        },
        {
          id: 7,
          sanskrit:
            "ममैवांशो जीवलोके जीवभूतः सनातनः | मनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति ||",
          transliteration:
            "mamaivāṃśo jīvaloke jīvabhūtaḥ sanātanaḥ | manaḥṣaṣṭhānīndriyāṇi prakṛtisthāni karṣati ||",
          translation:
            "The eternal individual soul in the world of living beings is indeed a fragment of My own Self. It draws to itself the senses — of which the mind is the sixth — seated in material nature.",
          hindi:
            "जीव-जगत में जीव मेरा ही सनातन अंश है। वह प्रकृति में स्थित मन सहित छः इन्द्रियों को अपनी ओर खींचता है।",
          explanation:
            "A remarkable verse: the individual soul (jiva) is an eternal fragment of Krishna (Brahman). Not a creation, not a copy — a fragment. The fragment and the whole share the same essential nature. The ocean and a drop of ocean are both H2O. The fragment draws the senses to itself — it is what animates the body.",
          science:
            'Holographic principle in physics (\'t Hooft, Susskind): each part of a hologram contains information about the whole. Similarly, the individual consciousness (fragment) carries within it the structure of the whole consciousness. This is not merely metaphor — quantum entanglement suggests that "parts" of a system can contain non-local information about the whole.',
          lifeLesson:
            "You are not a separate being who happens to have consciousness. You are consciousness itself, appearing as a human being — a fragment of the infinite. This is not an idea to believe; it is a recognition to embody. What changes when you live from this recognition?",
          keywords: ["Fragment", "SoulAndBrahman", "Holographic"],
        },
        {
          id: 15,
          sanskrit:
            "सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च | वेदैश्च सर्वैरहमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम् ||",
          transliteration:
            "sarvasya cāhaṃ hṛdi sanniviṣṭo mattaḥ smṛtirjñānamapohanaṃ ca | vedaiśca sarvairahameva vedyo vedāntakṛdvedavideva cāham ||",
          translation:
            "I am seated in the heart of all beings. From Me come memory, knowledge, and removal of doubt. By all the Vedas I alone am to be known; I am the author of Vedanta and the knower of the Vedas.",
          hindi:
            "मैं सभी प्राणियों के हृदय में निहित हूँ। मुझसे ही स्मृति, ज्ञान और अपोहन (संशय-निवृत्ति) होते हैं। सभी वेदों से केवल मैं ही जानने योग्य हूँ। वेदान्त का कर्ता और वेद को जानने वाला भी मैं ही हूँ।",
          explanation:
            "Krishna reveals the most intimate truth: he is seated in the heart of every being as the very source of their intelligence. Memory, knowledge, even the removal of confusion — all flow from this inner source. Every moment of clarity, every flash of understanding, is literally a manifestation of the divine intelligence within.",
          science:
            'Memory consolidation research: the hippocampus acts as the "seat of memory" in the brain. But more profoundly, the Self that holds memories together as a continuous narrative across time is the same mystery the Gita points to. Without a stable "inner witness" (the I-sense), memories would be mere data without coherence — like files with no user to open them.',
          lifeLesson:
            "The next time you have a genuine insight or a moment of clarity — pause. Something in you just knew. That knowing is not your personal achievement; it is the divine intelligence seated in your heart. Gratitude for these moments of knowing is a form of recognizing the God within.",
          keywords: ["InnerGod", "Memory", "DivineIntelligence"],
        },
      ],
    },
    {
      id: 16,
      title: "Daivasura Sampad Vibhaga Yoga",
      titleSanskrit: "दैवासुरसम्पद्विभागयोगः",
      summary: "The divine and demoniacal qualities in human beings.",
      verses: [
        {
          id: 1,
          sanskrit:
            "अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः | दानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ||",
          transliteration:
            "abhayaṃ sattvasaṃśuddhirjñānayogavyavasthitiḥ | dānaṃ damaśca yajñaśca svādhyāyastapa ārjavam ||",
          translation:
            "Fearlessness, purity of heart, steadfastness in knowledge and yoga, charity, self-restraint, sacrifice, study of scriptures, austerity, and straightforwardness...",
          hindi:
            "अभय (निर्भयता), सत्त्व की शुद्धि, ज्ञानयोग में स्थिति, दान, दम (इन्द्रिय-संयम), यज्ञ, स्वाध्याय, तप, और आर्जव (सरलता)...",
          explanation:
            'Krishna lists twenty-six divine qualities that constitute the "daivi sampat" (divine wealth). This is the Gita\'s most comprehensive character portrait — the ideal human being. These are not commandments but descriptions of the natural qualities that emerge when one lives in alignment with truth. Fearlessness heads the list — it is the foundational quality from which all others flow.',
          science:
            "Positive psychology's Character Strengths (VIA Institute, Seligman & Peterson, 2004): 24 universal character strengths identified across all cultures. Fearlessness (bravery), integrity (straightforwardness), generosity (danaṃ), and self-regulation (damaḥ) are consistently among the highest correlated with flourishing. The Gita's list written 2500 years ago closely matches what empirical research identifies as universal virtues.",
          lifeLesson:
            "Of these twenty-six qualities, identify the one you currently possess most strongly — and the one most absent. The strongest is your platform; the most absent is your growth edge. Today, make one small move toward that absent quality.",
          keywords: ["DivineQualities", "CharacterStrengths", "VirtueEthics"],
        },
        {
          id: 21,
          sanskrit:
            "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः | कामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत् ||",
          transliteration:
            "trividhaṃ narakasyedaṃ dvāraṃ nāśanamātmanaḥ | kāmaḥ krodhastatholobhastasmādetattrayaṃ tyajet ||",
          translation:
            "Three are the gates of this hell that lead to the ruin of the self — lust, anger, and greed. Therefore, one should abandon these three.",
          hindi:
            "तीन प्रकार के नर्क के द्वार हैं जो आत्मा का नाश करते हैं — काम (वासना), क्रोध और लोभ। इसलिए इन तीनों को त्यागना चाहिए।",
          explanation:
            '"Narak" here is not a place after death but a state of being in this life — the hell of living driven by lust, anger, and greed. These three form a self-reinforcing loop: lust (craving for what you don\'t have) → frustration when blocked → anger → craving more → greed. Breaking any one of the three weakens all three.',
          science:
            "Behavioral neuroscience: the three map onto specific neural circuits. Lust/craving = mesolimbic dopamine pathway (reward-seeking). Anger = amygdala-hypothalamic threat response (fight reaction). Greed = prefrontal-reward circuit coupling (compulsive wanting). Research on impulse control (Baumeister): these three are the primary drivers of most destructive human behavior, from interpersonal violence to systemic exploitation. The Gita identifies the three root causes millennia before psychology.",
          lifeLesson:
            "When you feel suffering, trace it back: is it rooted in unfulfilled desire (kama), blocked desire turning to anger (krodha), or fear of not having enough (lobha)? Naming the root is the first step toward freedom from it. One moment of honest self-examination can break the loop.",
          keywords: ["Kama", "Krodha", "Lobha"],
        },
      ],
    },
    {
      id: 17,
      title: "Shraddhatraya Vibhaga Yoga",
      titleSanskrit: "श्रद्धात्रयविभागयोगः",
      summary:
        "The three kinds of faith and food, sacrifice, austerity, and charity.",
      verses: [
        {
          id: 3,
          sanskrit:
            "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत | श्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः ||",
          transliteration:
            "sattvānurūpā sarvasya śraddhā bhavati bhārata | śraddhāmayo'yaṃ puruṣo yo yacchraddhāḥ sa eva saḥ ||",
          translation:
            "The faith of each person, O Bharata, accords with their natural disposition. A person is made of their faith; what their faith is, that, verily, they are.",
          hindi:
            "हे भारत! प्रत्येक व्यक्ति की श्रद्धा उसके स्वभाव (सत्त्व) के अनुसार होती है। यह पुरुष श्रद्धामय है — जैसी श्रद्धा, वैसा पुरुष।",
          explanation:
            'One of the most psychologically precise verses in the Gita. Shraddha is often translated "faith" but it means something richer — one\'s deepest assumptions about what is real, what is possible, what is worth living for. What you fundamentally believe (consciously or not) shapes everything: what you pursue, how you act, what you become. "You are what you believe."',
          science:
            "Self-fulfilling prophecy research (Rosenthal & Jacobson, Pygmalion effect): teacher expectations measurably shape student outcomes. Carol Dweck's growth vs. fixed mindset research: fundamental beliefs about one's capacity for change produce radically different life trajectories. The Gita's \"shraddhamayo ayam purusha\" is the oldest and most concise statement of what cognitive psychology took decades to demonstrate.",
          lifeLesson:
            'What do you fundamentally believe about yourself, about what is possible, about what you deserve? These deep beliefs — your shraddha — are creating your life right now. One belief worth examining today: "Is change possible for me?" Your answer to that question shapes everything else.',
          keywords: ["Shraddha", "SelfFulfillingProphecy", "BeliefSystems"],
        },
        {
          id: 17,
          sanskrit:
            "श्रद्धया परया तप्तं तपस्तत्त्रिविधं नरैः | अफलाकाङ्क्षिभिर्युक्तैः सात्त्विकं परिचक्षते ||",
          transliteration:
            "śraddhayā parayā taptaṃ tapastattrividhaṃ naraiḥ | aphalākāṅkṣibhiryuktaiḥ sāttvikaṃ paricakṣate ||",
          translation:
            "When that three-fold austerity is practiced by men of steadfastness and highest faith, without expectation of fruit — that is called sattvic austerity.",
          hindi:
            "जब वह त्रिविध तप (शरीर, वाणी, मन का) श्रेष्ठ श्रद्धा से युक्त और फल की आकांक्षा रहित पुरुषों द्वारा किया जाता है — उसे सात्त्विक तप कहते हैं।",
          explanation:
            "The highest form of discipline is practiced without expecting personal reward. The person who exercises, meditates, studies, and serves — not for ego gratification but because it is right — performs sattvic austerity. This is the meeting point of Chapter 17 and Chapter 2 (karma yoga): action without attachment to results.",
          science:
            'Self-Determination Theory (Deci & Ryan): autonomous motivation (doing something because it is intrinsically meaningful, with no external pressure or reward expectation) produces the deepest and most sustained behavioral change, the greatest wellbeing, and the highest performance. "Sattvic tapas" describes precisely this autonomous, non-attached mode of practice.',
          lifeLesson:
            "Is your spiritual practice, exercise, study, or discipline motivated by genuine inner alignment — or by anxiety, comparison, or performance? The quality of motivation shapes the fruit. Today, do one practice entirely for its own inherent value, with no agenda.",
          keywords: ["SattvicTapas", "IntrinsicMotivation", "PurePractice"],
        },
      ],
    },
    {
      id: 18,
      title: "Moksha Sanyasa Yoga",
      titleSanskrit: "मोक्षसंन्यासयोगः",
      summary:
        "The conclusion — renunciation, liberation, and the ultimate teaching.",
      verses: [
        {
          id: 66,
          sanskrit:
            "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज | अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ||",
          transliteration:
            "sarvadharmānparityajya māmekaṃ śaraṇaṃ vraja | ahaṃ tvā sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ ||",
          translation:
            "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.",
          hindi:
            "सभी धर्मों (कर्तव्यों) को छोड़कर मेरी ही शरण में आओ। मैं तुम्हें सम्पूर्ण पापों से मुक्त कर दूँगा, तुम शोक न करो।",
          explanation:
            "The culminating message of the entire Gita. Krishna asks for complete surrender (śaraṇāgati). He promises liberation from all sins to those who take refuge in Him alone.",
          science:
            'Psychological research on "radical acceptance" (Tara Brach, Marsha Linehan): when individuals fully surrender resistance to what is, paradoxically, they gain the mental clarity to change it. Surrender is not passivity — it is the most active form of trust.',
          lifeLesson:
            "When you have done your utmost and still fear, let go. Over-analysis paralyzes; trust liberates. The deepest strength is the courage to release control to a higher intelligence within you.",
          keywords: ["Surrender", "Liberation", "Faith"],
        },
        {
          id: 78,
          sanskrit:
            "यत्र योगेश्वरः कृष्णो यत्र पार्धो धनुर्धरः | तत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ||",
          transliteration:
            "yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanurdharaḥ | tatra śrīrvijayo bhūtirdhruvā nītirmatirmama ||",
          translation:
            "Wherever there is Krishna, the Lord of Yoga, and wherever there is Arjuna, the bearer of the bow, there will certainly be opulence, victory, prosperity, and righteousness.",
          explanation:
            "The final verse of the Gita. It affirms that wherever God and the devotee are united in the spirit of dharma, all auspiciousness follows. This is the ultimate benediction.",
          hindi:
            "जहाँ योगेश्वर कृष्ण हैं और जहाँ धनुर्धारी अर्जुन हैं, वहीं श्री, विजय, विभूति और अचल नीति है — यही मेरा मत है।",
          science:
            'Systems thinking: जब किसी भी system में ideal strategy (कृष्ण = ज्ञान) और ideal execution (अर्जुन = कर्म) का मिलन होता है, तब outcomes optimal होते हैं। यह "Knowledge + Action = Excellence" का सार्वभौमिक सूत्र है जो आधुनिक management theory, sports science और organisational psychology में प्रमाणित है।',
          lifeLesson:
            "ज्ञान और कर्म का संयोग — यही गीता का अंतिम संदेश है। केवल जानना काफी नहीं, केवल करना काफी नहीं। जब दोनों एक साथ हों — तभी जीवन में विजय है।",
          keywords: ["KnowledgeAndAction", "Victory", "Integration"],
        },
      ],
    },
  ],
};
