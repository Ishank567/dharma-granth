export interface WordGloss {
  pada: string;
  meaning: string;
}

/** Splits "word—meaning; word—meaning" glosses. Returns [] when the text isn't in that form. */
export function parseWordMeanings(text?: string): WordGloss[] {
  if (!text) return [];
  const out: WordGloss[] = [];
  text
    .split(/;\s*|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((item) => {
      const cut = item.search(/\s*[—–]\s*|\s-\s/);
      if (cut > 0) {
        const pada = item.slice(0, cut).trim();
        const meaning = item.slice(cut).replace(/^\s*[—–-]\s*/, '').trim();
        if (pada && meaning) out.push({ pada, meaning });
      }
    });
  return out;
}
