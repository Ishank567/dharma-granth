const PAGE_MARKER_PATTERN = /--\s*\d+\s+of\s+\d+\s*--/gi;
const QUOTE_ONLY_LINE_PATTERN = /^[\s"'`“”‘’]+$/;
const NUMBER_OR_RULE_LINE_PATTERN = /^[\s\d०-९.\-–—_]+$/;
const DEVANAGARI_RE = /[ऀ-ॿ]/;
const LETTER_RE = /[A-Za-zÀ-ɏऀ-ॿ]/g;

const KNOWN_BOOK_NAMES = [
  'अग्निपुराण', 'शिवपुराण', 'गरुडपुराण', 'कल्किपुराण', 'मत्स्यपुराण',
  'भविष्यपुराण', 'देवीभागवत', 'श्रीमद्भागवत', 'विष्णुपुराण', 'वामनपुराण',
  'कूर्मपुराण', 'लिङ्गपुराण', 'नारदपुराण', 'पद्मपुराण', 'ब्रह्मवैवर्त',
  'वराहपुराण', 'ब्रह्माण्डपुराण', 'ब्रह्मपुराण', 'मार्कण्डेयपुराण',
  'वायुपुराण', 'स्कन्दपुराण', 'नारसिंहपुराण', 'रावणसंहिता', 'दुर्गासप्तशती',
  'योगवासिष्ठ', 'मनुस्मृति',
];
const BOOK_HEADER_LINE_PATTERN = new RegExp(
  `^[\\s•●∙◦·*+=_\\-–—~]*(?:${KNOWN_BOOK_NAMES.join('|')})[\\s•●∙◦·*+=_\\-–—~]*$`
);

function countMatches(text: string, pattern: RegExp) {
  return text.match(pattern)?.length ?? 0;
}

function hasDotLeaderNoise(line: string) {
  return /\.{6,}/.test(line) && countMatches(line, LETTER_RE) < 20;
}

function isRepeatCharGarbage(line: string) {
  const compact = line.replace(/\s/g, '');
  if (compact.length < 8) return false;
  if (DEVANAGARI_RE.test(compact)) return false;
  let maxRun = 1;
  let run = 1;
  for (let i = 1; i < compact.length; i++) {
    if (compact[i] === compact[i - 1]) {
      run += 1;
      if (run > maxRun) maxRun = run;
    } else {
      run = 1;
    }
  }
  if (maxRun >= 6) return true;
  const letters = compact.match(/[A-Za-z]/g)?.length ?? 0;
  const digits = compact.match(/\d/g)?.length ?? 0;
  const words = line.match(/[A-Za-z]{3,}/g)?.length ?? 0;
  return compact.length >= 12 && words <= 1 && letters + digits >= compact.length * 0.8;
}

function isDecoratorOnlyLine(line: string) {
  return /^[\s*•●∙◦·+=_~\-–—]+$/.test(line);
}

function isBookHeaderLine(line: string) {
  return BOOK_HEADER_LINE_PATTERN.test(line);
}

// Catches short ASCII-only residues like "SH 4 4 4" left over after inline
// garbage trimming — a Devanagari-primary text has no reason to carry an
// English/numeric fragment with no real word on its own line.
function isShortAsciiResidue(line: string) {
  if (DEVANAGARI_RE.test(line)) return false;
  const words = line.match(/[A-Za-z]{3,}/g)?.length ?? 0;
  if (words >= 1) return false;
  const compact = line.replace(/\s/g, '');
  return compact.length >= 3;
}

function isNoiseLine(line: string) {
  const trimmed = line.trim();
  return (
    !trimmed ||
    QUOTE_ONLY_LINE_PATTERN.test(trimmed) ||
    NUMBER_OR_RULE_LINE_PATTERN.test(trimmed) ||
    hasDotLeaderNoise(trimmed) ||
    isDecoratorOnlyLine(trimmed) ||
    isBookHeaderLine(trimmed) ||
    isRepeatCharGarbage(trimmed) ||
    isShortAsciiResidue(trimmed)
  );
}

// Strip OCR garbage embedded alongside real text on the same line —
// e.g. "मैं भी सेAAAAAAAAAHAAAAAAA" → "मैं भी से".
function trimInlineGarbage(line: string) {
  return line
    .replace(/([A-Za-z])\1{5,}[A-Za-z0-9]*/g, '')
    .replace(/\b\d{6,}\b/g, '')
    .replace(/[*●▪•]{2,}/g, '')
    .replace(/-{3,}[A-Za-z0-9]*/g, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

export function sanitizeExtractedVerseText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\f/g, '\n\n')
    .replace(PAGE_MARKER_PATTERN, '\n')
    .split('\n')
    .map(trimInlineGarbage)
    .filter((line) => !isNoiseLine(line))
    .join('\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export interface VerseQualityAssessment {
  usable: boolean;
  cleanedText: string;
  reasons: string[];
}

export function assessVerseTextQuality(text: string): VerseQualityAssessment {
  const cleanedText = sanitizeExtractedVerseText(text);
  const compact = cleanedText.replace(/\s+/g, '');
  const nonWhitespaceLength = compact.length;
  const letters = countMatches(cleanedText, LETTER_RE);
  const words = cleanedText.match(/[A-Za-zÀ-ɏऀ-ॿ]{2,}/g)?.length ?? 0;
  const quotes = countMatches(text, /["'`“”‘’]/g);
  const quoteDensity = nonWhitespaceLength === 0 ? 1 : quotes / Math.max(nonWhitespaceLength, 1);
  const signalDensity = nonWhitespaceLength === 0 ? 0 : letters / nonWhitespaceLength;
  const reasons: string[] = [];

  if (cleanedText.length < 24) {
    reasons.push('too_short_after_cleanup');
  }

  if (letters < 18) {
    reasons.push('too_few_letters');
  }

  if (words < 4) {
    reasons.push('too_few_words');
  }

  if (quoteDensity > 0.35) {
    reasons.push('quote_noise');
  }

  if (signalDensity < 0.3) {
    reasons.push('low_text_signal');
  }

  return {
    usable: reasons.length === 0,
    cleanedText,
    reasons,
  };
}

export function isUsableVerseText(text: string) {
  return assessVerseTextQuality(text).usable;
}
