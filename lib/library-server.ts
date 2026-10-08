import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { scriptureLastChanged } from '@/lib/content-dates';
import type { LibraryFacts } from '@/lib/library';

/**
 * Build-time facts for the library cards, measured from the published data
 * rather than assumed. Server-only (reads the filesystem and git history).
 *
 * Languages are sampled from the first chapter shard: a language counts as
 * available when at least half of its verses carry that text. That is a
 * sample, not a full audit, and the card copy says "available", not "complete".
 */
const DATA_DIR = join(process.cwd(), 'public', 'data');
const SAMPLE_VERSES = 60;

const cache = new Map<string, LibraryFacts>();

function readJson<T>(path: string): T | undefined {
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as T;
  } catch {
    return undefined;
  }
}

function firstShard(dir: string): string | undefined {
  if (!existsSync(dir)) return undefined;
  if (existsSync(join(dir, 'ch-1.json'))) return join(dir, 'ch-1.json');
  const shard = readdirSync(dir)
    .filter((f) => /^ch-\d+\.json$/.test(f))
    .sort((a, b) => parseInt(a.slice(3), 10) - parseInt(b.slice(3), 10))[0];
  return shard ? join(dir, shard) : undefined;
}

function hostOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

export function getLibraryFacts(id: string): LibraryFacts {
  const hit = cache.get(id);
  if (hit) return hit;

  const dir = join(DATA_DIR, 'scriptures-full', id);
  const manifest = readJson<{ source?: { repo?: string; fetchedAt?: string } }>(join(dir, 'manifest.json'));

  let hi = false;
  let en = false;
  let sa = true; // every catalogued text is published in Sanskrit
  const shard = firstShard(dir);
  type Verse = { sanskrit?: string; hindi?: string; translation?: string };
  // A shard is { id, chapter: { verses }, source }.
  const shardJson = shard ? readJson<{ chapter?: { verses?: Verse[] }; verses?: Verse[] }>(shard) : undefined;
  const verses = (shardJson?.chapter?.verses ?? shardJson?.verses ?? []).slice(0, SAMPLE_VERSES);
  if (verses.length > 0) {
    const half = verses.length / 2;
    sa = verses.filter((v) => v.sanskrit).length >= half;
    hi = verses.filter((v) => v.hindi).length >= half;
    en = verses.filter((v) => v.translation).length >= half;
  }

  const updated = scriptureLastChanged(id);
  const facts: LibraryFacts = {
    languages: { sa, hi, en },
    hindiCommentary: existsSync(join(DATA_DIR, 'hi-commentary', `${id}.json`)),
    sourceHost: hostOf(manifest?.source?.repo),
    sourceFetched: manifest?.source?.fetchedAt,
    lastUpdated: updated ? updated.toISOString() : undefined,
  };
  cache.set(id, facts);
  return facts;
}
