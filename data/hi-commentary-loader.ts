import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { HiCommentaryFragment } from './hi-commentary/_types';

const cache = new Map<string, HiCommentaryFragment>();

export function loadCommentaryFragment(scriptureId: string): HiCommentaryFragment | undefined {
  if (cache.has(scriptureId)) return cache.get(scriptureId);
  const filePath = resolve(process.cwd(), 'public/data/hi-commentary', `${scriptureId}.json`);
  if (!existsSync(filePath)) return undefined;
  try {
    const data = JSON.parse(readFileSync(filePath, 'utf8')) as HiCommentaryFragment;
    cache.set(scriptureId, data);
    return data;
  } catch (e) {
    console.error(`Failed to load commentary ${scriptureId}:`, e);
    return undefined;
  }
}

export function getVerseCommentary(
  scriptureId: string,
  chapterId: number,
  verseId: number | string,
): { explanation?: string; science?: string; lifeLesson?: string } | undefined {
  const fragment = loadCommentaryFragment(scriptureId);
  if (!fragment) return undefined;
  const entry = fragment[`${chapterId}:${verseId}`];
  if (!entry) return undefined;
  return {
    explanation: entry.explanation,
    science: entry.science,
    lifeLesson: entry.lifeLesson,
  };
}
