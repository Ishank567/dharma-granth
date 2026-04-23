// === डेटाबेस मॉडल ===

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  book_count?: number;
}

export interface Book {
  id: number;
  category_id: number;
  title: string;
  title_hindi: string;
  slug: string;
  author: string;
  language: string;
  pdf_filename: string;
  total_pages: number;
  description: string;
  content_status?: 'ready' | 'ocr_pending';
  category_name?: string;
  category_slug?: string;
  verse_count?: number;
}

export interface Chapter {
  id: number;
  book_id: number;
  chapter_number: number;
  title: string;
  title_hindi: string;
}

export interface Verse {
  id: number;
  book_id: number;
  chapter_id: number | null;
  verse_number: number;
  original_text: string;
  transliteration: string;
  translation_hindi: string;
  translation_english: string;
  page_number: number;
  book_title?: string;
  book_slug?: string;
  category_slug?: string;
  chapter_title?: string;
  chapter_title_hindi?: string;
}

export interface Interpretation {
  id: number;
  verse_id: number;
  shabdarth: string;
  bhavarth: string;
  simple_example: string;
  guided_learning: string;
  scientific_temperament: string;
  modern_relevance: string;
  next_curiosity: string;
  source: 'ai' | 'manual' | 'offline';
  created_at: string;
}

// === UI Types ===

export interface Bookmark {
  verseId: number;
  bookSlug: string;
  categorySlug: string;
  originalText: string;
  bookTitle: string;
  verseNumber: number;
  savedAt: string;
}

export interface ReadingProgress {
  bookSlug: string;
  categorySlug: string;
  bookTitle: string;
  lastVerseId: number;
  lastVerseNumber: number;
  totalVerses: number;
  updatedAt: string;
}

export interface SearchResult {
  id: number;
  verse_number: number;
  original_text: string;
  translation_hindi: string;
  book_title: string;
  book_slug: string;
  category_slug: string;
  rank: number;
}

// === श्रेणी (Category) Data ===

export const CATEGORIES: Omit<Category, 'id' | 'book_count'>[] = [
  {
    name: 'वेद',
    slug: 'ved',
    description: 'सनातन धर्म के सबसे प्राचीन और पवित्र ग्रंथ — ऋग्वेद, सामवेद, यजुर्वेद, अथर्ववेद',
    icon: '🕉️',
  },
  {
    name: 'उपनिषद',
    slug: 'upanishad',
    description: 'वेदों का सार — आत्मा, ब्रह्म और मोक्ष का गहन दर्शन',
    icon: '📿',
  },
  {
    name: 'गीता',
    slug: 'gita',
    description: 'भगवान श्रीकृष्ण द्वारा अर्जुन को दिया गया दिव्य उपदेश',
    icon: '🙏',
  },
  {
    name: 'पुराण',
    slug: 'purana',
    description: 'देवताओं, ऋषियों और सृष्टि की अद्भुत कथाएँ',
    icon: '📖',
  },
  {
    name: 'स्मृति',
    slug: 'smriti',
    description: 'धर्मशास्त्र और सामाजिक व्यवस्था के नियम — मनुस्मृति',
    icon: '⚖️',
  },
  {
    name: 'भक्ति ग्रंथ',
    slug: 'bhakti',
    description: 'भक्ति और प्रेम के अमर ग्रंथ — रामचरितमानस, दुर्गा सप्तशती',
    icon: '🎵',
  },
];

// === पुस्तक (Book) PDF Mapping ===

export const BOOK_PDF_MAP: {
  pdf: string;
  title: string;
  title_hindi: string;
  slug: string;
  category: string;
  language: string;
  author: string;
  description: string;
}[] = [
  // वेद
  { pdf: 'RigVeda.pdf', title: 'Rig Veda Vol. 1', title_hindi: 'ऋग्वेद (भाग 1)', slug: 'rigveda-1', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'सबसे प्राचीन वेद — देवताओं की स्तुति के मंत्र' },
  { pdf: 'RigVeda2.pdf', title: 'Rig Veda Vol. 2', title_hindi: 'ऋग्वेद (भाग 2)', slug: 'rigveda-2', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'ऋग्वेद का दूसरा भाग' },
  { pdf: 'SamaVeda.pdf', title: 'Sama Veda Vol. 1', title_hindi: 'सामवेद (भाग 1)', slug: 'samaveda-1', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'संगीतमय वेद — यज्ञ के गायन मंत्र' },
  { pdf: 'SamaVeda2.pdf', title: 'Sama Veda Vol. 2', title_hindi: 'सामवेद (भाग 2)', slug: 'samaveda-2', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'सामवेद का दूसरा भाग' },
  { pdf: 'YajurVeda.pdf', title: 'Yajur Veda Vol. 1', title_hindi: 'यजुर्वेद (भाग 1)', slug: 'yajurveda-1', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'यज्ञ विधि का वेद — कर्मकांड के मंत्र' },
  { pdf: 'YajurVeda2.pdf', title: 'Yajur Veda Vol. 2', title_hindi: 'यजुर्वेद (भाग 2)', slug: 'yajurveda-2', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'यजुर्वेद का दूसरा भाग' },
  { pdf: 'AtharvaVeda.pdf', title: 'Atharva Veda Vol. 1', title_hindi: 'अथर्ववेद (भाग 1)', slug: 'atharvaveda-1', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'लोक जीवन का वेद — आयुर्वेद और तंत्र के मंत्र' },
  { pdf: 'AtharvaVeda2.pdf', title: 'Atharva Veda Vol. 2', title_hindi: 'अथर्ववेद (भाग 2)', slug: 'atharvaveda-2', category: 'ved', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'अथर्ववेद का दूसरा भाग' },
  { pdf: 'HymnsOfAtharvaVeda.pdf', title: 'Hymns of Atharva Veda', title_hindi: 'अथर्ववेद के भजन', slug: 'hymns-atharvaveda', category: 'ved', language: 'अंग्रेज़ी', author: 'राल्फ ग्रिफ़िथ', description: 'अथर्ववेद के चुने हुए भजनों का अंग्रेज़ी अनुवाद' },
  { pdf: 'Vedic.pdf', title: 'Vedic Literature', title_hindi: 'वैदिक साहित्य', slug: 'vedic', category: 'ved', language: 'अंग्रेज़ी', author: 'विविध', description: 'वैदिक साहित्य का संकलन' },

  // उपनिषद
  { pdf: 'Isavasya-Upanishad.pdf', title: 'Isha Upanishad', title_hindi: 'ईशावास्य उपनिषद', slug: 'isha-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'सबसे छोटी उपनिषद — ईश्वर सर्वव्याप्त है' },
  { pdf: 'Kena-Upanishad.pdf', title: 'Kena Upanishad', title_hindi: 'केन उपनिषद', slug: 'kena-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'ब्रह्म को जानने का मार्ग' },
  { pdf: 'Katha-Upanishads.pdf', title: 'Katha Upanishad', title_hindi: 'कठ उपनिषद', slug: 'katha-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'नचिकेता और यमराज का संवाद — मृत्यु का रहस्य' },
  { pdf: 'Mundak-Upanishad.pdf', title: 'Mundaka Upanishad', title_hindi: 'मुण्डक उपनिषद', slug: 'mundaka-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'परा और अपरा विद्या का भेद' },
  { pdf: 'Shvetashvatar-Upanishad.pdf', title: 'Shvetashvatara Upanishad', title_hindi: 'श्वेताश्वतर उपनिषद', slug: 'shvetashvatara-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'ईश्वर की सर्वव्यापकता और माया का वर्णन' },
  { pdf: 'KhandogyaUpanishad.pdf', title: 'Chandogya Upanishad', title_hindi: 'छान्दोग्य उपनिषद', slug: 'chandogya-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'तत् त्वम् असि — तू वही है' },
  { pdf: 'TalavakaraUpanishad.pdf', title: 'Talavakara Upanishad', title_hindi: 'तलवकार उपनिषद', slug: 'talavakara-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'केन उपनिषद का विस्तार' },
  { pdf: 'KaushitakiUpanishad.pdf', title: 'Kaushitaki Upanishad', title_hindi: 'कौषीतकि उपनिषद', slug: 'kaushitaki-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'प्राण और आत्मा का दर्शन' },
  { pdf: 'VagasaneyiSamhitaUpanishad.pdf', title: 'Vajasaneyi Samhita Upanishad', title_hindi: 'वाजसनेयी उपनिषद', slug: 'vajasaneyi-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'यजुर्वेद की उपनिषद' },
  { pdf: 'AmritabinduUpanishad.pdf', title: 'Amritabindu Upanishad', title_hindi: 'अमृतबिन्दु उपनिषद', slug: 'amritabindu-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'अमृत की बूँद — मन और ध्यान का रहस्य' },
  { pdf: 'GaneshUpanishad.pdf', title: 'Ganesh Upanishad', title_hindi: 'गणेश उपनिषद', slug: 'ganesh-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'श्री गणेश की उपासना और महिमा' },
  { pdf: 'KalisantaranUpanishad.pdf', title: 'Kali Santarana Upanishad', title_hindi: 'कलिसन्तरण उपनिषद', slug: 'kalisantarana-upanishad', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'हरे कृष्ण महामंत्र की उपनिषद' },
  { pdf: 'Upanishads.pdf', title: 'Upanishads Collection', title_hindi: 'उपनिषद संग्रह', slug: 'upanishads-collection', category: 'upanishad', language: 'संस्कृत/अंग्रेज़ी', author: 'विविध', description: 'प्रमुख उपनिषदों का संकलन' },
  { pdf: 'upanishads_nikhilananda.pdf', title: 'Upanishads (Nikhilananda)', title_hindi: 'उपनिषद (निखिलानन्द)', slug: 'upanishads-nikhilananda', category: 'upanishad', language: 'अंग्रेज़ी', author: 'स्वामी निखिलानन्द', description: 'स्वामी निखिलानन्द द्वारा अनूदित उपनिषद' },
  { pdf: 'upanishads_paramananda.pdf', title: 'Upanishads (Paramananda)', title_hindi: 'उपनिषद (परमानन्द)', slug: 'upanishads-paramananda', category: 'upanishad', language: 'अंग्रेज़ी', author: 'स्वामी परमानन्द', description: 'स्वामी परमानन्द द्वारा अनूदित उपनिषद' },

  // गीता
  { pdf: 'SrimadBhagavadGita.pdf', title: 'Srimad Bhagavad Gita', title_hindi: 'श्रीमद् भगवद्गीता', slug: 'srimad-bhagavad-gita', category: 'gita', language: 'संस्कृत/हिन्दी', author: 'वेदव्यास', description: 'गीता का हिन्दी अनुवाद और व्याख्या' },
  { pdf: 'BhagavadGitaAsItIs.pdf', title: 'Bhagavad Gita As It Is', title_hindi: 'भगवद्गीता यथारूप', slug: 'bhagavad-gita-as-it-is', category: 'gita', language: 'अंग्रेज़ी', author: 'श्रील प्रभुपाद', description: 'इस्कॉन की प्रसिद्ध गीता — भक्तिवेदान्त स्वामी प्रभुपाद' },
  { pdf: 'Bhagavad-GitaSanskrit.pdf', title: 'Bhagavad Gita (Sanskrit)', title_hindi: 'भगवद्गीता (संस्कृत)', slug: 'bhagavad-gita-sanskrit', category: 'gita', language: 'संस्कृत', author: 'वेदव्यास', description: 'मूल संस्कृत में श्रीमद् भगवद्गीता' },

  // पुराण
  { pdf: 'BhagavataPuranam.pdf', title: 'Bhagavata Purana', title_hindi: 'श्रीमद्भागवतपुराण', slug: 'bhagavata-purana', category: 'purana', language: 'संस्कृत/अंग्रेज़ी', author: 'वेदव्यास', description: 'भगवान विष्णु के दस अवतारों की कथा' },
  { pdf: 'VishnuPurana.pdf', title: 'Vishnu Purana', title_hindi: 'विष्णु पुराण', slug: 'vishnu-purana', category: 'purana', language: 'अंग्रेज़ी', author: 'वेदव्यास', description: 'भगवान विष्णु की महिमा और सृष्टि का वर्णन' },
  { pdf: 'GarudaPurana.pdf', title: 'Garuda Purana', title_hindi: 'गरुड़ पुराण', slug: 'garuda-purana', category: 'purana', language: 'अंग्रेज़ी', author: 'वेदव्यास', description: 'मृत्यु के बाद का जीवन और कर्मफल' },

  // स्मृति
  { pdf: 'MANU_1.pdf', title: 'Manusmriti Vol. 1', title_hindi: 'मनुस्मृति (भाग 1)', slug: 'manusmriti-1', category: 'smriti', language: 'संस्कृत/अंग्रेज़ी', author: 'मनु', description: 'प्राचीन धर्मशास्त्र — सामाजिक व्यवस्था के नियम' },
  { pdf: 'MANU_2.pdf', title: 'Manusmriti Vol. 2', title_hindi: 'मनुस्मृति (भाग 2)', slug: 'manusmriti-2', category: 'smriti', language: 'संस्कृत/अंग्रेज़ी', author: 'मनु', description: 'मनुस्मृति का दूसरा भाग' },

  // भक्ति ग्रंथ
  { pdf: 'SriRamchritmanas_HindiEng.pdf', title: 'Sri Ramcharitmanas', title_hindi: 'श्री रामचरितमानस', slug: 'ramcharitmanas', category: 'bhakti', language: 'हिन्दी/अंग्रेज़ी', author: 'गोस्वामी तुलसीदास', description: 'भगवान राम की अमर कथा — अवधी में रचित महाकाव्य' },
  { pdf: 'Durga_Saptashati.pdf', title: 'Durga Saptashati', title_hindi: 'दुर्गा सप्तशती', slug: 'durga-saptashati', category: 'bhakti', language: 'संस्कृत/हिन्दी', author: 'वेदव्यास', description: 'माँ दुर्गा की महिमा — 700 श्लोकों का संग्रह' },
  { pdf: 'Narad_Bhakti_Shandilya_1p65.pdf', title: 'Narada Bhakti Sutra', title_hindi: 'नारद भक्ति सूत्र', slug: 'narad-bhakti-sutra', category: 'bhakti', language: 'संस्कृत/अंग्रेज़ी', author: 'देवर्षि नारद', description: 'भक्ति का सर्वोच्च मार्ग — नारद मुनि के सूत्र' },
  { pdf: '1ashtavakra.pdf', title: 'Ashtavakra Gita', title_hindi: 'अष्टावक्र गीता', slug: 'ashtavakra-gita', category: 'bhakti', language: 'संस्कृत/अंग्रेज़ी', author: 'अष्टावक्र', description: 'अद्वैत वेदान्त का सार — अष्टावक्र और जनक का संवाद' },
];
