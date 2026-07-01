import type { Scripture } from '../types';

const cache = new Map<string, Scripture>();

export function loadScripture(id: string): Scripture | undefined {
  if (cache.has(id)) return cache.get(id);
  try {
    const mod = require(`@/data/scriptures/${id}`);
    const keys = Object.keys(mod).filter((k) => k !== 'default' && !k.startsWith('_'));
    const scripture = keys.map((k) => mod[k]).find((v) => v && typeof v === 'object' && 'id' in v && 'chapters' in v) as Scripture | undefined;
    if (scripture) {
      cache.set(id, scripture);
    }
    return scripture;
  } catch (e) {
    console.error(`Failed to load scripture ${id}:`, e);
    return undefined;
  }
}

export function clearScriptureCache(): void {
  cache.clear();
}
