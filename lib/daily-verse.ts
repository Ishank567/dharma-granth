import { wisdomTopics } from '@/data/wisdom-for-life';

/**
 * Daily verse for sharing (WhatsApp Channel or friends). The pool is the
 * curated verses already shown on the Wisdom for Life pages (Sanskrit, Hindi and
 * English text and the page each one lives on), one per calendar day in a
 * fixed order, so the same date gives the same verse for everyone.
 */
export interface DailyVerse {
  id: string;
  reference: string;
  referenceHi: string;
  sanskrit: string;
  hindi: string;
  english: string;
  /** The Wisdom for Life topic the verse is filed under, e.g. "Anger and Composure". */
  topic: string;
  /** Site path of the verse (or chapter) page, without trailing slash. */
  href: string;
}

let pool: DailyVerse[] | undefined;

/** The curated verses, each once (a verse used by two topics is listed under the first). */
export function dailyVersePool(): DailyVerse[] {
  if (pool) return pool;
  const seen = new Set<string>();
  const out: DailyVerse[] = [];
  for (const topic of wisdomTopics) {
    for (const v of topic.verses) {
      const key = `${v.scriptureId}|${v.referenceDisplay}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        id: v.id,
        reference: v.referenceDisplay,
        referenceHi: v.referenceDisplayHi,
        sanskrit: v.sanskritDevanagari.trim(),
        hindi: v.literalTranslationHi.trim(),
        english: v.literalTranslationEn.trim(),
        topic: topic.titleEn,
        href: v.readerHref,
      });
    }
  }
  pool = out;
  return out;
}

const EPOCH_UTC = Date.UTC(2026, 0, 1);

/** Whole calendar days since 2026-01-01 for the date as the reader's calendar shows it (local time). */
export function dayNumber(date: Date): number {
  return Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - EPOCH_UTC) / 86_400_000);
}

/** The verse for a day number; works for days before the epoch too. */
export function verseForDay(verses: DailyVerse[], day: number): DailyVerse {
  const n = verses.length;
  return verses[((day % n) + n) % n];
}

/** Absolute link to the verse, with the slash the site is served at and a tag for WhatsApp Channel visits. */
export function channelUrl(origin: string, verse: DailyVerse): string {
  const path = verse.href.endsWith('/') ? verse.href : `${verse.href}/`;
  const url = new URL(path, origin);
  url.searchParams.set('utm_source', 'whatsapp');
  url.searchParams.set('utm_medium', 'channel');
  return url.toString();
}

/** The message to paste into WhatsApp (uses WhatsApp's *bold* and _italic_ markers). */
export function channelMessage(verse: DailyVerse, url: string): string {
  return [
    '🕉️ *दैनिक श्लोक · Verse of the Day*',
    `*${verse.reference}*`,
    verse.sanskrit,
    verse.hindi,
    `_${verse.english}_`,
    `📖 ${url}\n— Dharma Granth`,
  ]
    .filter(Boolean)
    .join('\n\n');
}
