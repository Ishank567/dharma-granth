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
    title: 'Rig Veda Vol. 1 (English Edition)',
    title_hindi: 'ऋग्वेद भाग 1 (अंग्रेज़ी संस्करण)',
    slug: 'rigveda-english-1',
    category: 'ved',
    language: 'संस्कृत/अंग्रेज़ी',
    author: 'वेदव्यास',
    description: 'ऋग्वेद के मंत्रों का प्रथम भाग — अंग्रेज़ी अनुवाद सहित संक्षिप्त संस्करण।',
  },
  'RigVeda2.pdf': {
    title: 'Rig Veda Vol. 2 (English Edition)',
    title_hindi: 'ऋग्वेद भाग 2 (अंग्रेज़ी संस्करण)',
    slug: 'rigveda-english-2',
    category: 'ved',
    language: 'संस्कृत/अंग्रेज़ी',
    author: 'वेदव्यास',
    description: 'ऋग्वेद के मंत्रों का द्वितीय भाग — अंग्रेज़ी अनुवाद सहित संक्षिप्त संस्करण।',
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
    title: 'Atharva Veda (Alt. Edition)',
    title_hindi: 'अथर्ववेद (अन्य संस्करण)',
    slug: 'atharvaveda-alt',
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

  // ===== वेद =====
  'rigved.pdf': {
    title: 'Rig Veda Vol. 1',
    title_hindi: 'ऋग्वेद (भाग 1)',
    slug: 'rigveda-1',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'सबसे प्राचीन वेद — देवताओं की स्तुति के मंत्र (भाग 1)।',
  },
  'rigved_2.pdf': {
    title: 'Rig Veda Vol. 2',
    title_hindi: 'ऋग्वेद (भाग 2)',
    slug: 'rigveda-2',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'ऋग्वेद का द्वितीय भाग।',
  },
  'arthved.pdf': {
    title: 'Atharva Veda',
    title_hindi: 'अथर्ववेद',
    slug: 'atharvaveda',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'लोकजीवन, उपचार और तांत्रिक परंपराओं से जुड़ा वेद।',
  },
  'arthved-part-1.pdf': {
    title: 'Atharva Veda Part 1',
    title_hindi: 'अथर्ववेद (भाग 1)',
    slug: 'atharvaveda-part-1',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'अथर्ववेद का प्रथम भाग।',
  },
  'yugerved.pdf': {
    title: 'Yajur Veda (Alt. Edition)',
    title_hindi: 'यजुर्वेद (अन्य संस्करण)',
    slug: 'yajurveda-alt',
    category: 'ved',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'यजुर्वेद का एक अन्य संस्करण।',
  },

  // ===== उपनिषद =====
  '108-upanishads-with-upanishad-brahmam-commentary.pdf': {
    title: '108 Upanishads',
    title_hindi: '108 उपनिषद (ब्राह्मण भाष्य सहित)',
    slug: '108-upanishads',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'एक सौ आठ उपनिषदों का संग्रह — उपनिषद ब्राह्मण भाष्य सहित।',
  },
  'Ishavasya Upanishad Trans. By Ek Charan Raja Anuchar Gorakhpur - Gita Press.pdf': {
    title: 'Isha Upanishad (Gita Press Alt.)',
    title_hindi: 'ईशावास्य उपनिषद (अन्य संस्करण)',
    slug: 'isha-upanishad-alt',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'ईशावास्य उपनिषद का एकचरण राजानुचार अनुवाद सहित संस्करण।',
  },
  'Kalyan Upanishad Ank Vol. 23 Issue No. 1 Jan 1949 - Gita Press.pdf': {
    title: 'Kalyan Upanishad Ank',
    title_hindi: 'कल्याण उपनिषद अंक',
    slug: 'kalyan-upanishad-ank',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'विविध',
    description: 'गीता प्रेस का प्रसिद्ध उपनिषद विशेषांक — कल्याण पत्रिका, 1949।',
  },
  'kenoupnishad_2.pdf': {
    title: 'Kena Upanishad Vol. 2',
    title_hindi: 'केन उपनिषद (भाग 2)',
    slug: 'kena-upanishad-2',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'केन उपनिषद का द्वितीय संस्करण।',
  },
  'upanishad उपनिषद् .pdf': {
    title: 'Upanishads Collection',
    title_hindi: 'उपनिषद संग्रह',
    slug: 'upanishads-collection',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'प्रमुख उपनिषदों का संकलित संग्रह।',
  },

  // ===== गीता / भगवद्गीता =====
  'ShrimadBhagavadGita_GitaPress.pdf': {
    title: 'Shrimad Bhagavad Gita (Gita Press)',
    title_hindi: 'श्रीमद् भगवद्गीता (गीता प्रेस)',
    slug: 'srimad-bhagavad-gita',
    category: 'gita',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'गीता प्रेस द्वारा प्रकाशित श्रीमद् भगवद्गीता।',
  },

  // ===== पुराण =====
  'bhagwat-puran.pdf': {
    title: 'Srimad Bhagavata Purana',
    title_hindi: 'श्रीमद्भागवत पुराण',
    slug: 'bhagavata-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'भगवान विष्णु के दस अवतारों और भक्ति की महिमा का पुराण।',
  },
  'VishnuPurana.pdf': {
    title: 'Vishnu Purana',
    title_hindi: 'विष्णु पुराण',
    slug: 'vishnu-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'भगवान विष्णु की महिमा और सृष्टि का वर्णन।',
  },
  'vishnu-puran.pdf': {
    title: 'Vishnu Purana (Alt. Edition)',
    title_hindi: 'विष्णु पुराण (अन्य संस्करण)',
    slug: 'vishnu-purana-alt',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'विष्णु पुराण का एक अन्य संस्करण।',
  },
  'agni-puran.pdf': {
    title: 'Agni Purana',
    title_hindi: 'अग्नि पुराण',
    slug: 'agni-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'अग्नि देव द्वारा कथित — विश्वकोशीय पुराण जिसमें कला, विज्ञान और धर्म का समावेश है।',
  },
  'bavishya-puran.pdf': {
    title: 'Bhavishya Purana',
    title_hindi: 'भविष्य पुराण',
    slug: 'bhavishya-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'भविष्य की घटनाओं और धर्मविधि का विस्तृत वर्णन करने वाला पुराण।',
  },
  'brahamand.pdf': {
    title: 'Brahmanda Purana Vol. 1',
    title_hindi: 'ब्रह्माण्ड पुराण (भाग 1)',
    slug: 'brahmanda-purana-1',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'सृष्टि की उत्पत्ति और ब्रह्माण्ड के स्वरूप का वर्णन करने वाला पुराण।',
  },
  'brahamandp.pdf': {
    title: 'Brahmanda Purana Vol. 2',
    title_hindi: 'ब्रह्माण्ड पुराण (भाग 2)',
    slug: 'brahmanda-purana-2',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'ब्रह्माण्ड पुराण का द्वितीय भाग।',
  },
  'kalkipuranhindi1.pdf': {
    title: 'Kalki Purana',
    title_hindi: 'कल्कि पुराण',
    slug: 'kalki-purana',
    category: 'purana',
    language: 'हिन्दी',
    author: 'वेदव्यास',
    description: 'कलियुग के अंत में कल्कि अवतार की कथा।',
  },
  'kurma.pdf': {
    title: 'Kurma Purana',
    title_hindi: 'कूर्म पुराण',
    slug: 'kurma-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'कूर्म अवतार से संबद्ध — योग, तीर्थ और भक्ति का पुराण।',
  },
  'ling.pdf': {
    title: 'Linga Purana',
    title_hindi: 'लिंग पुराण',
    slug: 'linga-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'शिव-लिंग की उत्पत्ति और शैव दर्शन का प्रमुख पुराण।',
  },
  'markende-puran.pdf': {
    title: 'Markandeya Purana',
    title_hindi: 'मार्कण्डेय पुराण',
    slug: 'markandeya-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'मार्कण्डेय ऋषि को कथित — देवी महात्म्य (दुर्गा सप्तशती) युक्त पुराण।',
  },
  'matsya-puran-1.pdf': {
    title: 'Matsya Purana Vol. 1',
    title_hindi: 'मत्स्य पुराण (भाग 1)',
    slug: 'matsya-purana-1',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'मत्स्य अवतार से कथित — सृष्टि, तीर्थ और कला का पुराण (भाग 1)।',
  },
  'matsya-puran-2.pdf': {
    title: 'Matsya Purana Vol. 2',
    title_hindi: 'मत्स्य पुराण (भाग 2)',
    slug: 'matsya-purana-2',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'मत्स्य पुराण का द्वितीय भाग।',
  },
  'nard-puran.pdf': {
    title: 'Narada Purana',
    title_hindi: 'नारद पुराण',
    slug: 'narada-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'भक्ति, संगीत और धर्मशास्त्र पर केंद्रित नारद कथित पुराण।',
  },
  'Narad Puran in Hindi Series No. 1183 - Gita Press.pdf': {
    title: 'Narada Purana (Gita Press)',
    title_hindi: 'नारद पुराण (गीता प्रेस)',
    slug: 'narada-purana-gita-press',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'गीता प्रेस द्वारा प्रकाशित नारद पुराण।',
  },
  'narsihma-puran.pdf': {
    title: 'Narasimha Purana',
    title_hindi: 'नृसिंह पुराण',
    slug: 'narasimha-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'नृसिंह अवतार की महिमा और भक्त प्रह्लाद की कथा।',
  },
  'padam-puran.pdf': {
    title: 'Padma Purana (Hindi Edition)',
    title_hindi: 'पद्म पुराण (हिन्दी संस्करण)',
    slug: 'padma-purana-hindi',
    category: 'purana',
    language: 'हिन्दी',
    author: 'वेदव्यास',
    description: 'तीर्थयात्रा, भक्ति और धर्मविचार से समृद्ध पद्म पुराण का हिन्दी संस्करण।',
  },
  'sakand-puran.pdf': {
    title: 'Skanda Purana',
    title_hindi: 'स्कन्द पुराण',
    slug: 'skanda-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'सबसे विशाल पुराण — तीर्थक्षेत्रों और शिव-कार्तिकेय की महिमा।',
  },
  'shiv-puran.pdf': {
    title: 'Shiva Purana',
    title_hindi: 'शिव पुराण',
    slug: 'shiva-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'भगवान शिव की लीला, महिमा और शैव दर्शन का प्रमुख पुराण।',
  },
  'vaivtpuran.pdf': {
    title: 'Vaivarta Purana',
    title_hindi: 'वैवर्त पुराण',
    slug: 'vaivarta-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'कृष्ण जन्म-रहस्य, राधा-तत्त्व और शक्ति-उपासना का पुराण।',
  },
  'vamanpuran.pdf': {
    title: 'Vamana Purana',
    title_hindi: 'वामन पुराण',
    slug: 'vamana-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'वामन अवतार की कथा और बलि-राजा प्रसंग।',
  },
  'varaha-puran.pdf': {
    title: 'Varaha Purana',
    title_hindi: 'वराह पुराण',
    slug: 'varaha-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'वराह अवतार द्वारा पृथ्वी उद्धार की कथा और धर्मशास्त्र।',
  },
  'vayu-puran.pdf': {
    title: 'Vayu Purana',
    title_hindi: 'वायु पुराण',
    slug: 'vayu-purana',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'वायु देव कथित — ब्रह्माण्ड विज्ञान, तीर्थ और शिव भक्ति का पुराण।',
  },

  // ===== महाकाव्य / इतिहास =====
  'ramayana_all_kand_6191_pages.pdf': {
    title: 'Valmiki Ramayana (Complete)',
    title_hindi: 'वाल्मीकि रामायण (सम्पूर्ण)',
    slug: 'valmiki-ramayana-complete',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'महर्षि वाल्मीकि',
    description: 'सातों काण्डों सहित सम्पूर्ण वाल्मीकि रामायण — 6191 पृष्ठ।',
  },
  'mahabhart-gorkhpur.pdf': {
    title: 'Mahabharata (Gorakhpur Edition)',
    title_hindi: 'महाभारत (गोरखपुर संस्करण)',
    slug: 'mahabharata-gorakhpur',
    category: 'purana',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'गीता प्रेस गोरखपुर का सम्पूर्ण महाभारत संस्करण।',
  },

  // ===== स्मृति / नीति =====
  'manusmriti.pdf': {
    title: 'Manusmriti',
    title_hindi: 'मनुस्मृति',
    slug: 'manusmriti',
    category: 'smriti',
    language: 'संस्कृत/हिन्दी',
    author: 'मनु',
    description: 'प्राचीन धर्मशास्त्र — सामाजिक व्यवस्था और आचारसंहिता।',
  },
  'manusmiriti.pdf': {
    title: 'Manusmriti (Alt. Edition)',
    title_hindi: 'मनुस्मृति (अन्य संस्करण)',
    slug: 'manusmriti-alt',
    category: 'smriti',
    language: 'संस्कृत/हिन्दी',
    author: 'मनु',
    description: 'मनुस्मृति का एक अन्य संस्करण।',
  },
  'satyarthaprakasa.pdf': {
    title: 'Satyartha Prakash',
    title_hindi: 'सत्यार्थ प्रकाश',
    slug: 'satyartha-prakash',
    category: 'smriti',
    language: 'हिन्दी',
    author: 'स्वामी दयानंद सरस्वती',
    description: 'आर्य समाज के प्रवर्तक स्वामी दयानंद द्वारा वैदिक धर्म की व्याख्या।',
  },
  'gita-press-vedant-darshan-brahmasutra-sanskrit-hindi.pdf': {
    title: 'Vedanta Darshana (Brahma Sutra) - Gita Press',
    title_hindi: 'वेदान्त दर्शन ब्रह्मसूत्र (गीता प्रेस)',
    slug: 'vedanta-brahmasutra-gita-press',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'वेदव्यास',
    description: 'गीता प्रेस द्वारा प्रकाशित ब्रह्मसूत्र — वेदान्त दर्शन का आधारग्रंथ।',
  },

  // ===== भक्ति ग्रंथ =====
  'ShriRamcharitmanas_GitaPress.pdf': {
    title: 'Sri Ramcharitmanas (Gita Press)',
    title_hindi: 'श्री रामचरितमानस (गीता प्रेस)',
    slug: 'ramcharitmanas-gita-press',
    category: 'bhakti',
    language: 'अवधी/हिन्दी',
    author: 'गोस्वामी तुलसीदास',
    description: 'गीता प्रेस द्वारा प्रकाशित श्री रामचरितमानस — तुलसीदास रचित महाकाव्य।',
  },
  'durga-saptashati-hindi.pdf': {
    title: 'Durga Saptashati (Hindi)',
    title_hindi: 'दुर्गा सप्तशती (हिन्दी)',
    slug: 'durga-saptashati-hindi',
    category: 'bhakti',
    language: 'हिन्दी',
    author: 'वेदव्यास',
    description: 'दुर्गा सप्तशती का हिन्दी अनुवाद सहित संस्करण।',
  },
  'chatanya-mahaprabhu-ki-siksa-hindi-4th-ed.pdf': {
    title: 'Chaitanya Mahaprabhu ki Siksha',
    title_hindi: 'चैतन्य महाप्रभु की शिक्षा',
    slug: 'chaitanya-mahaprabhu-siksha',
    category: 'bhakti',
    language: 'हिन्दी',
    author: 'चैतन्य महाप्रभु',
    description: 'भक्ति आंदोलन के प्रवर्तक चैतन्य महाप्रभु की शिक्षाओं का हिन्दी संकलन।',
  },
  'Sura Vinaya Patrika by Haridas 1989 - Govinda Bhavana Karyalaya Gita Press Gorakhpur.pdf': {
    title: 'Sura Vinaya Patrika',
    title_hindi: 'सूर विनय पत्रिका',
    slug: 'sura-vinaya-patrika',
    category: 'bhakti',
    language: 'ब्रजभाषा/हिन्दी',
    author: 'हरिदास',
    description: 'भक्त कवि हरिदास रचित विनय और स्तुति की रचना।',
  },

  // ===== शैव / तंत्र / योग ग्रंथ =====
  'ravan-samhita-1.pdf': {
    title: 'Ravan Samhita Vol. 1',
    title_hindi: 'रावण संहिता (भाग 1)',
    slug: 'ravan-samhita-1',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'रावण',
    description: 'रावण रचित ज्योतिष, तंत्र और शिव-उपासना का ग्रंथ (भाग 1)।',
  },
  'ravan-samhita-2.pdf': {
    title: 'Ravan Samhita Vol. 2',
    title_hindi: 'रावण संहिता (भाग 2)',
    slug: 'ravan-samhita-2',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'रावण',
    description: 'रावण संहिता का द्वितीय भाग।',
  },
  'ravan-samhita-3.pdf': {
    title: 'Ravan Samhita Vol. 3',
    title_hindi: 'रावण संहिता (भाग 3)',
    slug: 'ravan-samhita-3',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'रावण',
    description: 'रावण संहिता का तृतीय भाग।',
  },
  'ravan-samhita-4.pdf': {
    title: 'Ravan Samhita Vol. 4',
    title_hindi: 'रावण संहिता (भाग 4)',
    slug: 'ravan-samhita-4',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'रावण',
    description: 'रावण संहिता का चतुर्थ भाग।',
  },
  'ravan-samhita-5.pdf': {
    title: 'Ravan Samhita Vol. 5',
    title_hindi: 'रावण संहिता (भाग 5)',
    slug: 'ravan-samhita-5',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'रावण',
    description: 'रावण संहिता का पंचम भाग।',
  },
  'shiva_sahinta_withhinditika.pdf': {
    title: 'Shiva Samhita',
    title_hindi: 'शिव संहिता',
    slug: 'shiva-samhita',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'अज्ञात',
    description: 'हठयोग और कुंडलिनी साधना पर आधारित शिव-कथित योगग्रंथ।',
  },
  'shiva-swarodaya-sanskrit-hindi.pdf': {
    title: 'Shiva Swarodaya',
    title_hindi: 'शिव स्वरोदय',
    slug: 'shiva-swarodaya',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'अज्ञात',
    description: 'श्वास-विज्ञान और स्वर-साधना पर आधारित प्राचीन तंत्रग्रंथ।',
  },
  'shri-yogavasishtha-1.pdf': {
    title: 'Yoga Vasishtha Vol. 1',
    title_hindi: 'योग वासिष्ठ (भाग 1)',
    slug: 'yoga-vasishtha-1',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'महर्षि वाल्मीकि',
    description: 'वशिष्ठ-राम संवाद में आत्मज्ञान और वैराग्य की शिक्षा (भाग 1)।',
  },
  'shri-yogavasishtha-2.pdf': {
    title: 'Yoga Vasishtha Vol. 2',
    title_hindi: 'योग वासिष्ठ (भाग 2)',
    slug: 'yoga-vasishtha-2',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'महर्षि वाल्मीकि',
    description: 'योग वासिष्ठ का द्वितीय भाग।',
  },
  'shri-yogavasishtha-3.pdf': {
    title: 'Yoga Vasishtha Vol. 3',
    title_hindi: 'योग वासिष्ठ (भाग 3)',
    slug: 'yoga-vasishtha-3',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'महर्षि वाल्मीकि',
    description: 'योग वासिष्ठ का तृतीय भाग।',
  },
  'shri-yogavasishtha-4.pdf': {
    title: 'Yoga Vasishtha Vol. 4',
    title_hindi: 'योग वासिष्ठ (भाग 4)',
    slug: 'yoga-vasishtha-4',
    category: 'upanishad',
    language: 'संस्कृत/हिन्दी',
    author: 'महर्षि वाल्मीकि',
    description: 'योग वासिष्ठ का चतुर्थ भाग।',
  },
  'yoga-rasayanam-sanskrit-hindi.pdf': {
    title: 'Yoga Rasayanam',
    title_hindi: 'योग रसायनम्',
    slug: 'yoga-rasayanam',
    category: 'bhakti',
    language: 'संस्कृत/हिन्दी',
    author: 'अज्ञात',
    description: 'योग, आयुर्वेद और रसायन शास्त्र का संयुक्त प्राचीन ग्रंथ।',
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
    content_status TEXT NOT NULL DEFAULT 'ready',
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

  // Mark books whose extracted verses are mostly page-number noise (scanned PDFs that need OCR)
  const markOcrPending = db.prepare(`
    UPDATE books
    SET content_status = 'ocr_pending'
    WHERE id IN (
      SELECT b.id FROM books b
      WHERE (
        SELECT COUNT(*) FROM verses v
        WHERE v.book_id = b.id
          AND v.original_text LIKE '%of%'
          AND v.original_text GLOB '*[0-9] of [0-9]*'
      ) >= (
        SELECT COUNT(*) FROM verses v WHERE v.book_id = b.id
      ) * 0.5
      AND (SELECT COUNT(*) FROM verses v WHERE v.book_id = b.id) > 0
    )
  `).run();
  console.log(`\n🔍 ${markOcrPending.changes} ग्रंथ स्कैन-आधारित हैं (OCR आवश्यक) — ये UI में छुपाए जाएँगे।`);

  const categoryCount = (db.prepare('SELECT COUNT(*) as c FROM categories').get() as { c: number }).c;
  const bookCount = (db.prepare('SELECT COUNT(*) as c FROM books').get() as { c: number }).c;
  const readyCount = (db.prepare("SELECT COUNT(*) as c FROM books WHERE content_status = 'ready'").get() as { c: number }).c;
  const verseCount = (db.prepare('SELECT COUNT(*) as c FROM verses').get() as { c: number }).c;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n' + '='.repeat(50));
  console.log('📊 सारांश:');
  console.log(`   फ़ोल्डर में PDF: ${discoveredBooks.length}`);
  console.log(`   श्रेणियाँ:      ${categoryCount}`);
  console.log(`   ग्रंथ:          ${bookCount}`);
  console.log(`   तैयार ग्रंथ:    ${readyCount}`);
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
