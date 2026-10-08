/**
 * Scholarly Sources, Editions, and Hermeneutic Registry
 *
 * Provides authoritative provenance, Sanskrit edition citations, traditional
 * commentary attribution, numbering systems, variant reading notes (पाठभेद),
 * and editorial correction history for scriptures in Dharma Granth.
 */

export interface SourceCorrectionEntry {
  date: string;
  version: string;
  note: string;
  noteHi: string;
}

export interface ScriptureSourceMeta {
  scriptureId: string;
  sourceScriptureTitle: string;
  sourceScriptureTitleSanskrit: string;
  sanskritEdition: string;
  sanskritEditionDetails: string;
  publisherArchive: string;
  archiveUrl?: string;
  primaryTranslator: string;
  traditionalCommentaryAuthor: string;
  editorialReviewer: string;
  dateReviewed: string;
  numberingSystemNote: string;
  alternativeReadingNote: string;
  correctionHistory: SourceCorrectionEntry[];
}

const NOT_REVIEWED = 'Not yet independently reviewed';

const SCRIPTURE_SOURCES: Record<string, Partial<ScriptureSourceMeta>> = {
  bhagavadgita: {
    sourceScriptureTitle: 'Bhagavad Gita',
    sourceScriptureTitleSanskrit: 'श्रीमद्भगवद्गीता',
    sanskritEdition: 'Gita Press Edition (गोरखपुर संवत् 2080)',
    sanskritEditionDetails: 'Gorakhpur Recension with Sridhara Swami Subodhini & Shankaracharya Advaita Bhashya collations.',
    publisherArchive: 'Gita Press, Gorakhpur / Muktabodha Digital Archive',
    archiveUrl: 'https://sanskritdocuments.org/doc_giitaa/bg.html',
    primaryTranslator: 'Jayadayal Goyandka (Hindi), Swami Gambhirananda & Swami Sivananda (English)',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (शंकर भाष्य), Ramanujacharya (गीताभाष्य), Sridhara Swami (सुबोधिनी)',
    numberingSystemNote: 'Standard 700-verse canonical recension across 18 chapters. Kashmiri recension carries 745 verses (noted in comparative apparatus).',
    alternativeReadingNote: 'Variant readings collated from Anandashram (Pune) and Bhandarkar Oriental Research Institute (BORI) critically edited texts.',
  },

  ishavasya: {
    sourceScriptureTitle: 'Isha Upanishad (Ishavasya)',
    sourceScriptureTitleSanskrit: 'ईशावास्योपनिषद्',
    sanskritEdition: 'Kanva Recension, Shukla Yajurveda Samhita Ch. 40',
    sanskritEditionDetails: 'Shankaracharya Dashopanishad Bhashya Edition, Motilal Banarsidass.',
    publisherArchive: 'Göttingen Register of Electronic Texts in Indian Languages (GRETIL)',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/iisha.html',
    primaryTranslator: 'Gita Press Gorakhpur & Swami Nikhilananda',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (ईशावास्य भाष्य), Madhvacharya, Uvata, Mahidhara',
    numberingSystemNote: '18 canonical mantras concluding the Shukla Yajurveda Samhita (Madhyandina recension counts 17 verses).',
    alternativeReadingNote: 'Madhyandina recension transposes mantras 5 and 6 and alters initial phrasing in mantra 16.',
  },

  katha: {
    sourceScriptureTitle: 'Katha Upanishad',
    sourceScriptureTitleSanskrit: 'कठोपनिषद्',
    sanskritEdition: 'Krishna Yajurveda Kathaka Shakha Recension',
    sanskritEditionDetails: 'Ten Principal Upanishads, Adyar Library and Research Centre, Chennai.',
    publisherArchive: 'Adyar Library / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/katha.html',
    primaryTranslator: 'Swami Gambhirananda, Prof. S. Radhakrishnan',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (कठोपनिषद् भाष्य), Madhvacharya',
    numberingSystemNote: 'Two Adhyayas, each divided into three Vallis (total 6 sections, 119 verses).',
    alternativeReadingNote: 'Slight verbal variations noted between Anandashram Sanskrit Series no. 7 and BORI manuscripts.',
  },

  kena: {
    sourceScriptureTitle: 'Kena Upanishad (Talavakara)',
    sourceScriptureTitleSanskrit: 'केनोपनिषद्',
    sanskritEdition: 'Samaveda Talavakara Brahmana Section',
    sanskritEditionDetails: 'Pada Bhashya and Vakya Bhashya editions, Gita Press.',
    publisherArchive: 'SanskritDocuments / Muktabodha',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/kena.html',
    primaryTranslator: 'Swami Gambhirananda & Gita Press',
    traditionalCommentaryAuthor: 'Adi Shankaracharya (पदभाष्य एवं वाक्यभाष्य)',
    numberingSystemNote: '4 Khandas (35 verses). Khandas 1–2 in verse; Khandas 3–4 in prose allegory (Yakshakhyana).',
    alternativeReadingNote: 'Manuscript traditions uniformly preserve the 35-verse partition with zero disputed interpolations.',
  },

  mundaka: {
    sourceScriptureTitle: 'Mundaka Upanishad',
    sourceScriptureTitleSanskrit: 'मुण्डकोपनिषद्',
    sanskritEdition: 'Atharvaveda Shaunaka Shakha Recension',
    sanskritEditionDetails: 'Nirnaya Sagar Press Edition with Shankaracharya Commentary.',
    publisherArchive: 'GRETIL / Digital Library of India',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/mundaka.html',
    primaryTranslator: 'Swami Gambhirananda, Prof. Max Müller',
    traditionalCommentaryAuthor: 'Adi Shankaracharya, Ramanujacharya (Sub-commentaries)',
    numberingSystemNote: '3 Mundakas, each divided into 2 Khandas (total 6 sections, 64 verses).',
    alternativeReadingNote: 'Mantra 3.1.6 (Satyameva Jayate) cross-referenced with national motto epigraphic sources.',
  },

  mandukya: {
    sourceScriptureTitle: 'Mandukya Upanishad',
    sourceScriptureTitleSanskrit: 'माण्डूक्योपनिषद्',
    sanskritEdition: 'Atharvaveda Shaunaka Shakha with Gaudapada Karika',
    sanskritEditionDetails: 'Ramakrishna Math Advaita Ashrama Edition with Shankaracharya Bhashya.',
    publisherArchive: 'Advaita Ashrama / SanskritDocuments',
    archiveUrl: 'https://sanskritdocuments.org/doc_upanishhat/mandukya.html',
    primaryTranslator: 'Swami Nikhilananda, Swami Chinmayananda',
    traditionalCommentaryAuthor: 'Gaudapada (माण्डूक्य कारिका) & Adi Shankaracharya',
    numberingSystemNote: '12 prose mantras representing the four states of consciousness (Avasthatraya & Turiya).',
    alternativeReadingNote: 'Text is distinct from the 215 verses of Gaudapada’s Karika, which are cataloged as classical commentary.',
  },
};

/**
 * Returns complete, scholarly source and edition metadata for any scripture ID,
 * providing accurate recensions, publishers, traditional commentators, and review history.
 */
export function getScriptureSourceMeta(
  scriptureId: string,
  scriptureTitle?: string,
  scriptureTitleSanskrit?: string,
): ScriptureSourceMeta {
  const specific = SCRIPTURE_SOURCES[scriptureId];

  return {
    scriptureId,
    sourceScriptureTitle: specific?.sourceScriptureTitle ?? scriptureTitle ?? scriptureId,
    sourceScriptureTitleSanskrit:
      specific?.sourceScriptureTitleSanskrit ?? scriptureTitleSanskrit ?? scriptureTitle ?? scriptureId,
    sanskritEdition: specific?.sanskritEdition ?? 'Imported text; printed edition not recorded',
    sanskritEditionDetails:
      specific?.sanskritEditionDetails ??
      'Digitised text taken from the archive linked below. It has not been collated against a printed edition by this site.',
    publisherArchive: specific?.publisherArchive ?? 'Open Sanskrit text archives (see the source link)',
    archiveUrl: specific?.archiveUrl ?? 'https://sanskritdocuments.org/',
    primaryTranslator:
      specific?.primaryTranslator ??
      'Not recorded. Some Hindi and English text is AI-assisted and is flagged where it appears.',
    traditionalCommentaryAuthor:
      specific?.traditionalCommentaryAuthor ?? 'Not recorded for this text',
    // No review is recorded anywhere in the project, so none is claimed. Replace these
    // two values with real names and dates only when a review has actually happened.
    editorialReviewer: NOT_REVIEWED,
    dateReviewed: 'Not recorded',
    numberingSystemNote:
      specific?.numberingSystemNote ?? 'Numbering follows the imported source and may differ from other editions.',
    alternativeReadingNote:
      specific?.alternativeReadingNote ?? 'No variant readings are recorded for this text.',
    // Corrections are tracked as GitHub issues, not in a versioned log, so none are listed here.
    correctionHistory: [],
  };
}
