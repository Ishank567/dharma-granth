/**
 * धर्म ग्रंथ PDF Extraction Script
 * ===================================
 * यह स्क्रिप्ट वर्तमान फ़ोल्डर में मौजूद सभी PDF फ़ाइलों को स्कैन करके
 * SQLite डेटाबेस दोबारा बनाती है। हटाई जा चुकी PDF फ़ाइलें स्वतः हट जाएँगी।
 *
 * Usage: npx tsx scripts/extract-pdfs.ts
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { PDFParse } from 'pdf-parse';
import { CATEGORIES, BOOK_PDF_MAP } from '../app/lib/types';

const PDF_DIR = path.resolve(__dirname, '..', '..');
const DB_DIR = path.join(__dirname, '..', 'db');
const DB_PATH = path.join(DB_DIR, 'dharma.db');

type SeedBookInfo = (typeof BOOK_PDF_MAP)[0];

interface ResolvedBookInfo {
  pdf: string;
  title: string;
  title_hindi: string;
  slug: string;
  category: string;
  language: string;
  author: string;
  description: string;
}

const MANUAL_METADATA_BY_FILENAME: Record<string, Partial<ResolvedBookInfo>> = {
  '1318_sri-ramchritmanas_roman.pdf': {
    title: 'Sri Ramcharitmanas',
    title_hindi: 'श्री रामचरितमानस (रोमन)',
    slug: 'ramcharitmanas',
    category: 'bhakti',
    language: 'अवधी/रोमन',
    author: 'गोस्वामी तुलसीदास',
    description: 'श्री रामचरितमानस का रोमन लिप्यंतरण संस्करण।',
  },
  'BhagavadGitaAsItIs.pdf': {
    title: 'Bhagavad Gita As It Is',
    title_hindi: 'भगवद्गीता यथारूप',
    slug: 'bhagavad-gita-as-it-is',
    category: 'gita',
    language: 'अंग्रेज़ी',
    author: 'श्रील प्रभुपाद',
    description: 'भगवद्गीता का प्रसिद्ध अंग्रेज़ी टीका-सहित संस्करण।',
  },
  'Aitareya Upanishad - Gita Press Gorakhpur.pdf': {
    title: 'Aitareya Upanishad',
    title_hindi: 'ऐतरेय उपनिषद',
    slug: 'aitareya-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'चेतना, सृष्टि और प्रज्ञानं ब्रह्म के बोध का उपनिषद।',
  },
  'Brihadaranyak Upanishad - Gita Press Gorakhpur-Reduced.pdf': {
    title: 'Brihadaranyaka Upanishad',
    title_hindi: 'बृहदारण्यक उपनिषद',
    slug: 'brihadaranyaka-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'नेति-नेति, आत्मविद्या और याज्ञवल्क्य संवाद का महान उपनिषद।',
  },
  'Chandogyo Upanishad .pdf': {
    title: 'Chandogya Upanishad',
    title_hindi: 'छान्दोग्य उपनिषद',
    slug: 'chandogya-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/अंग्रेज़ी',
    author: 'वेदव्यास',
    description: 'तत् त्वम् असि महावाक्य के लिए प्रसिद्ध उपनिषद।',
  },
  'kenoupnishad.pdf': {
    title: 'Kena Upanishad',
    title_hindi: 'केन उपनिषद',
    slug: 'kena-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'मन, वाणी और प्राण के पार स्थित चेतना का उपनिषद।',
  },
  'Ishavashya Upanishad With Trans And Shanakr Annotation 1970 - Gita Press Gorakhpur.pdf': {
    title: 'Isha Upanishad',
    title_hindi: 'ईशावास्य उपनिषद',
    slug: 'isha-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'ईश्वर-आवृत जगत, त्याग और आत्मदृष्टि का संक्षिप्त उपनिषद।',
  },
  'Katha Upanishad  - Gita Press Gorakhpur.pdf': {
    title: 'Katha Upanishad',
    title_hindi: 'कठ उपनिषद',
    slug: 'katha-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'नचिकेता और यमराज के संवाद में आत्मा और मृत्यु का रहस्य।',
  },
  'Keno upanishad.pdf': {
    title: 'Kena Upanishad (Gita Press)',
    title_hindi: 'केन उपनिषद (गीता प्रेस)',
    slug: 'kena-upanishad-gita-press',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'केन उपनिषद का गीता प्रेस संस्करण।',
  },
  'Mundako Upanishad .pdf': {
    title: 'Mundaka Upanishad',
    title_hindi: 'मुण्डक उपनिषद',
    slug: 'mundaka-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'परा और अपरा विद्या के भेद का प्रसिद्ध उपनिषद।',
  },
  'Muktikōpaniṣad (मुक्तिकोपनिषद) Hindi Translation.pdf': {
    title: 'Muktika Upanishad',
    title_hindi: 'मुक्तिकोपनिषद',
    slug: 'muktika-upanishad',
    category: 'upanishad',
    language: 'हिन्दी',
    author: 'वेदव्यास',
    description: 'उपनिषद परम्परा की सूची और मुक्ति-दृष्टि से जुड़ा संक्षिप्त ग्रंथ।',
  },
  'Prashnopanishad 1992 Gorkhpur - Gita Press.pdf': {
    title: 'Prashna Upanishad',
    title_hindi: 'प्रश्न उपनिषद',
    slug: 'prashna-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'छः प्रश्नों के माध्यम से प्राण, ओंकार और ब्रह्मविद्या का उपनिषद।',
  },
  'Shwetashwatara Upanishad With The Commentary Of Shankara Bhashya 1995 Gorakhpur - Gita Press.pdf': {
    title: 'Shvetashvatara Upanishad',
    title_hindi: 'श्वेताश्वतर उपनिषद',
    slug: 'shvetashvatara-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'ईश्वर, माया, योग और ब्रह्मदृष्टि पर केंद्रित उपनिषद।',
  },
  'Shvetasvetro Upanishad .pdf': {
    title: 'Shvetashvatara Upanishad (Other Edition)',
    title_hindi: 'श्वेताश्वतर उपनिषद (अन्य संस्करण)',
    slug: 'shvetashvatara-upanishad-alt',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'श्वेताश्वतर उपनिषद का एक अन्य संस्करण।',
  },
  'Taitiriya Upanishad with Translated Shankara Bhashya - Gita Press.pdf': {
    title: 'Taittiriya Upanishad',
    title_hindi: 'तैत्तिरीय उपनिषद',
    slug: 'taittiriya-upanishad',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'शिक्षा, पंचकोश और आनन्दमय ब्रह्म के बोध का उपनिषद।',
  },
  'Upanishad Bhashya Vol 1 - Gita Press Gorakhpur.pdf': {
    title: 'Upanishad Bhashya Vol. 1',
    title_hindi: 'उपनिषद भाष्य (भाग 1)',
    slug: 'upanishad-bhashya-1',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'आदि शंकराचार्य',
    description: 'उपनिषदों पर शांकर भाष्य का प्रथम संकलन।',
  },
  'Upanishad Bhashya of Shankaracharya Khand 2 with Gaudapad Karika - Gita Press.pdf': {
    title: 'Upanishad Bhashya Vol. 2',
    title_hindi: 'उपनिषद भाष्य (भाग 2)',
    slug: 'upanishad-bhashya-2',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'आदि शंकराचार्य',
    description: 'उपनिषदों पर शांकर भाष्य और गौड़पाद कारिका का द्वितीय संकलन।',
  },
  'Devi Bhagavt Puran of Veda Vyas with Hindi Explanation and Illustration - Gita Press.pdf': {
    title: 'Devi Bhagavata Purana',
    title_hindi: 'देवी भागवत पुराण',
    slug: 'devi-bhagavata-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'देवी महिमा, शक्ति और भक्ति का प्रमुख पुराण।',
  },
  'Garuda Puran - Gita Press Gorakhpur.pdf': {
    title: 'Garuda Purana',
    title_hindi: 'गरुड़ पुराण',
    slug: 'garuda-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'जीवन, मृत्यु, कर्मफल और परलोक-दृष्टि से जुड़ा पुराण।',
  },
  'Harivansh Puran - Gita Press.pdf': {
    title: 'Harivamsha Purana',
    title_hindi: 'हरिवंश पुराण',
    slug: 'harivamsha-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'महाभारत से संबद्ध कृष्णवंश और हरि-कथा का ग्रंथ।',
  },
  'Mahabharat (6 Khandas) with Translation and Illustration by Ramnarayan Datt Pandey - Gita Press Gorakhpur.pdf': {
    title: 'Mahabharata (6 Khanda)',
    title_hindi: 'महाभारत (६ खंड)',
    slug: 'mahabharata-6-khanda',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'गीता प्रेस का महाभारत संस्करण, अनुवाद और चित्रों सहित।',
  },
  'Padma Puran - Gita Press.pdf': {
    title: 'Padma Purana',
    title_hindi: 'पद्म पुराण',
    slug: 'padma-purana-gita-press',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'तीर्थ, भक्ति और धर्मविचार से समृद्ध पद्म पुराण का संस्करण।',
  },
  'Vedant Darshan (Brahma Sutra) by Veda Vyas with Explanation by Hari Krishnadas Goendka - Gita Press.pdf': {
    title: 'Vedanta Darshana (Brahma Sutra)',
    title_hindi: 'वेदान्त दर्शन (ब्रह्मसूत्र)',
    slug: 'vedanta-darshana-brahma-sutra',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'ब्रह्मसूत्र पर आधारित वेदान्त दर्शन का व्याख्यात्मक संस्करण।',
  },
  'Vidura Niti With Hindi Trans. By Hanuman Prasad Poddar 1954 Gorakhpur - Gita Press.pdf': {
    title: 'Vidura Niti',
    title_hindi: 'विदुर नीति',
    slug: 'vidura-niti',
    category: 'smriti',
    language: 'संस्कृत/हिन्दी',
    author: 'महर्षि वेदव्यास',
    description: 'महाभारत से उद्धृत नीति, विवेक और राज्यबुद्धि का पाठ।',
  },
  'Vinay Patrika by Goswami Tulasi Das with Commentary by Hanumad Prasad Podhar 2001 Gorakhpur - Gita Press.pdf': {
    title: 'Vinaya Patrika',
    title_hindi: 'विनय पत्रिका',
    slug: 'vinaya-patrika',
    category: 'bhakti',
    language: 'अवधी/हिन्दी',
    author: 'गोस्वामी तुलसीदास',
    description: 'भक्ति, विनय और आत्मसमर्पण की तुलसीदास रचित स्तुति-रचना।',
  },
  'Vivek Chudamani of Shankaracharya with Hindi Translation - Gita Press.pdf': {
    title: 'Viveka Chudamani',
    title_hindi: 'विवेकचूडामणि',
    slug: 'viveka-chudamani',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'आदि शंकराचार्य',
    description: 'अद्वैत वेदान्त, विवेक और आत्मबोध पर आधारित प्रख्यात ग्रंथ।',
  },
  'Durga_Saptashati.pdf': {
    title: 'Durga Saptashati',
    title_hindi: 'दुर्गा सप्तशती',
    slug: 'durga-saptashati',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'माँ दुर्गा की महिमा और शक्तिसाधना का प्रमुख ग्रंथ।',
  },
  'Narad_Bhakti_Shandilya_1p65.pdf': {
    title: 'Narada Bhakti Sutra',
    title_hindi: 'नारद भक्ति सूत्र',
    slug: 'narad-bhakti-sutra',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'देवर्षि नारद',
    description: 'भक्ति के मार्ग पर संक्षिप्त सूत्रात्मक शिक्षाएँ।',
  },
  'RigVeda.pdf': {
    title: 'Rig Veda Vol. 1',
    title_hindi: 'ऋग्वेद (भाग 1)',
    slug: 'rigveda-1',
    category: 'ved',
    language: 'संस्कृत/अंग्रेज़ी',
    author: 'वेदव्यास',
    description: 'ऋग्वेद के मंत्रों का प्रथम भाग।',
  },
  'RigVeda2.pdf': {
    title: 'Rig Veda Vol. 2',
    title_hindi: 'ऋग्वेद (भाग 2)',
    slug: 'rigveda-2',
    category: 'ved',
    language: 'संस्कृत/अंग्रेज़ी',
    author: 'वेदव्यास',
    description: 'ऋग्वेद के मंत्रों का द्वितीय भाग।',
  },
  'samved.pdf': {
    title: 'Sama Veda',
    title_hindi: 'सामवेद',
    slug: 'samaveda',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'संगीतमय वैदिक परम्परा का मुख्य वेद।',
  },
  'yajurved.pdf': {
    title: 'Yajur Veda',
    title_hindi: 'यजुर्वेद',
    slug: 'yajurveda',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'यज्ञ-विधि और कर्मकाण्ड पर आधारित वैदिक संहिता।',
  },
  'atharva-ved.pdf': {
    title: 'Atharva Veda',
    title_hindi: 'अथर्ववेद',
    slug: 'atharvaveda',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'लोकजीवन, उपचार और तांत्रिक परंपराओं से जुड़ा वेद।',
  },
  'atharva-2.pdf': {
    title: 'Atharva Veda Vol. 2',
    title_hindi: 'अथर्ववेद (भाग 2)',
    slug: 'atharvaveda-2',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'अथर्ववेद का द्वितीय भाग।',
  },
};

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

function normalizeName(value: string) {
  return value
    .replace(/\.pdf$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(value: string) {
  return normalizeName(value).replace(/\s+/g, '-');
}

function titleCase(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function humanizeFilename(filename: string) {
  const base = filename.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (/[\u0900-\u097f]/.test(base)) {
    return base;
  }
  return titleCase(base);
}

function inferCategory(filename: string): ResolvedBookInfo['category'] {
  const normalized = normalizeName(filename);

  if (/(gita|गीता)/.test(normalized)) {
    return 'gita';
  }

  if (/(upanishad|upnishad|उपनिषद|upanishads)/.test(normalized)) {
    return 'upanishad';
  }

  if (/(rig|sam|yajur|atharva|ved|veda|वेद)/.test(normalized)) {
    return 'ved';
  }

  if (/(puran|purana|रामायण|mahabhar|bharat|satyartha)/.test(normalized)) {
    return 'purana';
  }

  if (/(manu|smriti)/.test(normalized)) {
    return 'smriti';
  }

  return 'bhakti';
}

function inferLanguage(filename: string) {
  const normalized = normalizeName(filename);

  if (normalized.includes('sanskrit') && normalized.includes('hindi')) {
    return 'संस्कृत/हिन्दी';
  }

  if (normalized.includes('hindi')) {
    return 'हिन्दी';
  }

  if (normalized.includes('roman')) {
    return 'रोमन/अंग्रेज़ी';
  }

  if (normalized.includes('english')) {
    return 'अंग्रेज़ी';
  }

  if (/(upanishad|gita|ved|veda|puran|purana|samhita|sutra)/.test(normalized)) {
    return 'संस्कृत/हिन्दी';
  }

  return 'मिश्रित';
}

function inferAuthor(filename: string) {
  const normalized = normalizeName(filename);

  if (normalized.includes('ramchritmanas') || normalized.includes('ramcharitmanas')) {
    return 'गोस्वामी तुलसीदास';
  }

  if (normalized.includes('narad')) {
    return 'देवर्षि नारद';
  }

  if (normalized.includes('manu')) {
    return 'मनु';
  }

  if (/(gita|upanishad|ved|veda|puran|purana)/.test(normalized)) {
    return 'वेदव्यास';
  }

  return 'विविध';
}

function inferDescription(titleHindi: string, category: string) {
  const suffixByCategory: Record<string, string> = {
    ved: 'वैदिक परम्परा का यह ग्रंथ वर्तमान PDF संग्रह से लिया गया है।',
    upanishad: 'आत्मा, ब्रह्म और साधना से जुड़ा यह उपनिषद वर्तमान PDF संग्रह से लिया गया है।',
    gita: 'गीता परम्परा से जुड़ा यह पाठ वर्तमान PDF संग्रह से लिया गया है।',
    purana: 'पुराण/इतिहास परम्परा से जुड़ा यह ग्रंथ वर्तमान PDF संग्रह से लिया गया है।',
    smriti: 'धर्मशास्त्र और स्मृति परम्परा से जुड़ा यह पाठ वर्तमान PDF संग्रह से लिया गया है।',
    bhakti: 'भक्ति और साधना परम्परा से जुड़ा यह ग्रंथ वर्तमान PDF संग्रह से लिया गया है।',
  };

  return `${titleHindi} — ${suffixByCategory[category] || 'यह ग्रंथ वर्तमान PDF संग्रह से लिया गया है।'}`;
}

function readExistingBookMetadata() {
  if (!fs.existsSync(DB_PATH)) {
    return new Map<string, ResolvedBookInfo>();
  }

  const existingDb = new Database(DB_PATH, { readonly: true });

  try {
    const rows = existingDb.prepare(`
      SELECT b.pdf_filename, b.title, b.title_hindi, b.slug, b.author, b.language, b.description,
             c.slug as category_slug
      FROM books b
      JOIN categories c ON c.id = b.category_id
    `).all() as Array<{
      pdf_filename: string;
      title: string;
      title_hindi: string;
      slug: string;
      author: string;
      language: string;
      description: string;
      category_slug: string;
    }>;

    return new Map(
      rows.map((row) => [
        row.pdf_filename,
        {
          pdf: row.pdf_filename,
          title: row.title,
          title_hindi: row.title_hindi,
          slug: row.slug,
          category: row.category_slug,
          language: row.language,
          author: row.author,
          description: row.description,
        },
      ])
    );
  } finally {
    existingDb.close();
  }
}

function buildSeedMaps() {
  const byExact = new Map<string, SeedBookInfo>();
  const byNormalized = new Map<string, SeedBookInfo>();

  for (const item of BOOK_PDF_MAP) {
    byExact.set(item.pdf, item);
    byNormalized.set(normalizeName(item.pdf), item);
  }

  return { byExact, byNormalized };
}

function resolveBookInfo(
  pdfName: string,
  existingBooks: Map<string, ResolvedBookInfo>,
  seedMaps: ReturnType<typeof buildSeedMaps>
): ResolvedBookInfo {
  const manual = MANUAL_METADATA_BY_FILENAME[pdfName];
  const existing = existingBooks.get(pdfName);
  const exactSeed = seedMaps.byExact.get(pdfName);
  const normalizedSeed = seedMaps.byNormalized.get(normalizeName(pdfName));
  const seed = exactSeed || normalizedSeed;

  const title = manual?.title || existing?.title || seed?.title || humanizeFilename(pdfName);
  const titleHindi = manual?.title_hindi || existing?.title_hindi || seed?.title_hindi || humanizeFilename(pdfName);
  const category = manual?.category || existing?.category || seed?.category || inferCategory(pdfName);
  const language = manual?.language || existing?.language || seed?.language || inferLanguage(pdfName);
  const author = manual?.author || existing?.author || seed?.author || inferAuthor(pdfName);
  const description = manual?.description || existing?.description || seed?.description || inferDescription(titleHindi, category);
  const slug = manual?.slug || existing?.slug || seed?.slug || slugify(title);

  return {
    pdf: pdfName,
    title,
    title_hindi: titleHindi,
    slug,
    category,
    language,
    author,
    description,
  };
}

function ensureUniqueSlugs(books: ResolvedBookInfo[]) {
  const seen = new Map<string, number>();

  return books.map((book) => {
    const count = seen.get(book.slug) || 0;
    seen.set(book.slug, count + 1);

    if (count === 0) {
      return book;
    }

    return {
      ...book,
      slug: `${book.slug}-${count + 1}`,
    };
  });
}

function discoverBooks() {
  const existingBooks = readExistingBookMetadata();
  const seedMaps = buildSeedMaps();
  const pdfFiles = fs
    .readdirSync(PDF_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.pdf$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  return ensureUniqueSlugs(
    pdfFiles.map((pdfName) => resolveBookInfo(pdfName, existingBooks, seedMaps))
  );
}

const discoveredBooks = discoverBooks();

if (fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  console.log('🗑️  पुराना डेटाबेस हटाया गया');
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('📋 डेटाबेस स्कीमा बना रहे हैं...');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    author TEXT NOT NULL,
    language TEXT NOT NULL,
    pdf_filename TEXT NOT NULL,
    total_pages INTEGER DEFAULT 0,
    description TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS chapters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_hindi TEXT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id)
  );

  CREATE TABLE IF NOT EXISTS verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    chapter_id INTEGER,
    verse_number INTEGER NOT NULL,
    original_text TEXT NOT NULL,
    transliteration TEXT DEFAULT '',
    translation_hindi TEXT DEFAULT '',
    translation_english TEXT DEFAULT '',
    page_number INTEGER DEFAULT 0,
    FOREIGN KEY (book_id) REFERENCES books(id),
    FOREIGN KEY (chapter_id) REFERENCES chapters(id)
  );

  CREATE TABLE IF NOT EXISTS interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    verse_id INTEGER NOT NULL UNIQUE,
    shabdarth TEXT DEFAULT '',
    bhavarth TEXT DEFAULT '',
    guided_learning TEXT DEFAULT '',
    scientific_temperament TEXT DEFAULT '',
    modern_relevance TEXT DEFAULT '',
    source TEXT DEFAULT 'ai',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (verse_id) REFERENCES verses(id)
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS verses_fts USING fts5(
    original_text,
    transliteration,
    translation_hindi,
    translation_english,
    content='verses',
    content_rowid='id'
  );

  CREATE TRIGGER IF NOT EXISTS verses_ai AFTER INSERT ON verses BEGIN
    INSERT INTO verses_fts(rowid, original_text, transliteration, translation_hindi, translation_english)
    VALUES (new.id, new.original_text, new.transliteration, new.translation_hindi, new.translation_english);
  END;

  CREATE TRIGGER IF NOT EXISTS verses_ad AFTER DELETE ON verses BEGIN
    INSERT INTO verses_fts(verses_fts, rowid, original_text, transliteration, translation_hindi, translation_english)
    VALUES ('delete', old.id, old.original_text, old.transliteration, old.translation_hindi, old.translation_english);
  END;
`);

console.log('📂 श्रेणियाँ डाल रहे हैं...');

const insertCategory = db.prepare(
  'INSERT INTO categories (name, slug, description, icon) VALUES (?, ?, ?, ?)'
);

const categoryMap: Record<string, number> = {};

for (const category of CATEGORIES) {
  const result = insertCategory.run(category.name, category.slug, category.description, category.icon);
  categoryMap[category.slug] = result.lastInsertRowid as number;
  console.log(`  ✅ ${category.icon} ${category.name}`);
}

console.log(`\n📚 ${discoveredBooks.length} PDF फ़ाइलें मिलीं। अब स्कैन शुरू हो रहा है...\n`);

const insertBook = db.prepare(
  'INSERT INTO books (category_id, title, title_hindi, slug, author, language, pdf_filename, total_pages, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

const insertVerse = db.prepare(
  'INSERT INTO verses (book_id, chapter_id, verse_number, original_text, transliteration, translation_hindi, translation_english, page_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);

function splitIntoVerses(text: string): string[] {
  text = text.replace(/\r\n/g, '\n').replace(/\f/g, '\n\n');

  const sanskritVerses = text.split(/॥[^॥]*?॥|।।[^।]*?।।|\|\|[^|]*?\|\|/);
  if (sanskritVerses.length > 5) {
    return sanskritVerses.map((value) => value.trim()).filter((value) => value.length > 10);
  }

  const numberedParts = text.split(/\n\s*(?:\d+[\.\)]\s|\d+\s*[-–—]\s)/);
  if (numberedParts.length > 5) {
    return numberedParts.map((value) => value.trim()).filter((value) => value.length > 10);
  }

  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.length > 3) {
    const verses: string[] = [];
    let current = '';

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed || trimmed.length < 5) {
        continue;
      }

      if (current.length + trimmed.length > 800 && current.length > 20) {
        verses.push(current.trim());
        current = trimmed;
      } else {
        current += (current ? '\n\n' : '') + trimmed;
      }
    }

    if (current.trim().length > 10) {
      verses.push(current.trim());
    }

    if (verses.length > 2) {
      return verses;
    }
  }

  const chunks: string[] = [];
  const lines = text.split('\n').filter((line) => line.trim().length > 0);
  let current = '';

  for (const line of lines) {
    if (current.length + line.length > 500 && current.length > 20) {
      chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }

  if (current.trim().length > 10) {
    chunks.push(current.trim());
  }

  return chunks.length > 0 ? chunks : [text.trim()].filter((value) => value.length > 10);
}

async function processPdf(bookInfo: ResolvedBookInfo) {
  const pdfPath = path.join(PDF_DIR, bookInfo.pdf);

  if (!fs.existsSync(pdfPath)) {
    console.log(`  ⚠️  फ़ाइल नहीं मिली: ${bookInfo.pdf}`);
    return;
  }

  try {
    const parser = new PDFParse({ url: pdfPath.replace(/\\/g, '/') });
    const textResult = await parser.getText();
    const fullText = textResult.text || '';
    const numPages = textResult.total || 0;

    const categoryId = categoryMap[bookInfo.category];
    if (!categoryId) {
      console.log(`  ⚠️  श्रेणी नहीं मिली: ${bookInfo.category}`);
      return;
    }

    const bookResult = insertBook.run(
      categoryId,
      bookInfo.title,
      bookInfo.title_hindi,
      bookInfo.slug,
      bookInfo.author,
      bookInfo.language,
      bookInfo.pdf,
      numPages,
      bookInfo.description
    );
    const bookId = bookResult.lastInsertRowid as number;

    const verses = splitIntoVerses(fullText);

    const insertMany = db.transaction((versesData: string[]) => {
      for (let index = 0; index < versesData.length; index += 1) {
        insertVerse.run(
          bookId,
          null,
          index + 1,
          versesData[index],
          '',
          '',
          '',
          Math.max(1, Math.floor((index / Math.max(versesData.length, 1)) * Math.max(numPages, 1)) + 1)
        );
      }
    });

    insertMany(verses);

    console.log(`  ✅ ${bookInfo.title_hindi} — ${verses.length} पाठ, ${numPages} पृष्ठ`);
  } catch (error) {
    console.log(`  ❌ त्रुटि (${bookInfo.pdf}): ${error instanceof Error ? error.message : error}`);
  }
}

async function main() {
  const startTime = Date.now();

  for (const bookInfo of discoveredBooks) {
    await processPdf(bookInfo);
  }

  const categoryCount = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }).c;
  const bookCount = (db.prepare('SELECT COUNT(*) as c FROM books').get() as { c: number }).c;
  const verseCount = (db.prepare('SELECT COUNT(*) as c FROM verses').get() as { c: number }).c;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(50));
  console.log('📊 सारांश:');
  console.log(`   फ़ोल्डर में PDF: ${discoveredBooks.length}`);
  console.log(`   श्रेणियाँ:      ${categoryCount}`);
  console.log(`   ग्रंथ:          ${bookCount}`);
  console.log(`   पाठ/श्लोक:      ${verseCount}`);
  console.log(`   समय:            ${elapsed} सेकंड`);
  console.log('='.repeat(50));
  console.log('\n🙏 डेटाबेस वर्तमान PDF संग्रह से दोबारा तैयार हो गया। अब चलाएँ: npm run dev\n');

  db.close();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  db.close();
  process.exit(1);
});
