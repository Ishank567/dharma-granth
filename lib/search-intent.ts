/**
 * Intent-aware search. A question such as "difference between Atman and
 * Brahman" or "What does the Gita teach about failure?" is reduced to the
 * things it asks about, and each is looked up with the ordinary search. The
 * layer never writes an answer: it only routes the reader to concept pages
 * and verified passages, and says how it read the question.
 */
import { searchIndex } from '@/lib/search';
import { getAllConceptDetails } from '@/data/concept-details';
import { SEARCH_GROUPS, type SearchOptions, type SearchResponse, type SearchResultGroup, type SearchResultItem } from '@/lib/search-types';

export type Intent =
  | { kind: 'compare'; terms: [string, string] }
  | { kind: 'define'; term: string }
  | { kind: 'about'; term: string };

const clean = (s: string) => s.replace(/[?.!]+$/g, '').replace(/^(the|a|an)\s+/i, '').trim();

export function parseIntent(raw: string): Intent | null {
  const q = raw.trim().replace(/\s+/g, ' ');

  const cmp =
    /^(?:what(?:'s| is) the )?(?:difference|differences|distinction|comparison)s? between (.+?) (?:and|&|vs\.?|versus) (.+)$/i.exec(q) ||
    /^(?:compare )?(.+?) (?:vs\.?|versus) (.+)$/i.exec(q);
  if (cmp) return { kind: 'compare', terms: [clean(cmp[1]), clean(cmp[2])] };

  const rel = /^how (?:does|do) (.+?) relate to (.+)$/i.exec(q);
  if (rel) return { kind: 'compare', terms: [clean(rel[1]), clean(rel[2])] };

  const about =
    /^what does (?:the )?[\w\s]+? (?:teach|say)(?: to us)? about (.+)$/i.exec(q) ||
    /^(?:verses|shlokas|slokas|teachings|wisdom|quotes|passages)\s+(?:on|about|for|regarding|related to)\s+(.+)$/i.exec(q) ||
    /^(?:what|which) (?:verses|shlokas|teachings) (?:talk|speak) (?:about|of) (.+)$/i.exec(q);
  if (about) return { kind: 'about', term: clean(about[1]) };

  const def = /^(?:what (?:is|are|does)|meaning of|define|explain)\s+(?:the\s+)?(.+?)(?:\s+mean)?$/i.exec(q);
  if (def) return { kind: 'define', term: clean(def[1]) };

  return null;
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ऀ-ॿ ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Concept pages whose name, transliteration or Sanskrit equals (or is a word of) the term. */
function conceptsNamed(term: string): SearchResultItem[] {
  const t = norm(term);
  if (!t) return [];
  const words = new Set(t.split(' '));
  return getAllConceptDetails()
    .filter((c) => {
      const names = [norm(c.label), norm(c.transliteration), norm(c.sanskrit)];
      return names.some((n) => n === t || (n !== '' && (words.has(n) || t.includes(n))));
    })
    .map((c) => ({
      id: `intent-concept-${c.id}`,
      title: `${c.label} · ${c.sanskrit}`,
      subtitle: c.transliteration,
      group: 'concept' as SearchResultGroup,
      groupLabel: 'अवधारणाएँ · Concepts',
      category: 'concept' as SearchResultItem['category'],
      categoryLabel: 'अवधारणाएँ · Concepts',
      href: `/concepts/${c.id}`,
      matchingText: c.simpleDefinition.en,
      matchReason: `Concept named in your question: “${term}”`,
      languageLabel: 'Concept',
      actionLabel: 'Open concept →',
    }));
}

const EMPTY = (): Record<SearchResultGroup, SearchResultItem[]> =>
  Object.fromEntries(SEARCH_GROUPS.map((g) => [g.id, [] as SearchResultItem[]])) as Record<SearchResultGroup, SearchResultItem[]>;

export interface IntentResponse extends SearchResponse {
  /** How the question was read, in plain words. Shown above the results. */
  intentNote?: string;
}

export function searchWithIntent(raw: string, options: SearchOptions = {}): IntentResponse {
  const intent = parseIntent(raw);
  if (!intent) return searchIndex(raw, options);

  const terms = intent.kind === 'compare' ? intent.terms : [intent.term];
  const perTerm = terms.map((t) => searchIndex(t, { ...options, group: null, limit: 20 }));
  const concepts = terms.flatMap(conceptsNamed);

  // Concept pages first, then the best results from each term in turn.
  const seen = new Set<string>();
  const seenHref = new Set<string>();
  const ordered: SearchResultItem[] = [];
  const push = (item: SearchResultItem) => {
    if (!seen.has(item.id) && !seenHref.has(item.href)) { seen.add(item.id); seenHref.add(item.href); ordered.push(item); }
  };
  concepts.forEach(push);
  for (let i = 0; i < 20; i++) perTerm.forEach((r, k) => { const it = r.results[i]; if (it) push({ ...it, matchReason: terms.length > 1 ? `${it.matchReason} (for “${terms[k]}”)` : it.matchReason }); });

  if (ordered.length === 0) return searchIndex(raw, options);

  const groupCounts: Partial<Record<SearchResultGroup, number>> = {};
  const grouped = EMPTY();
  for (const item of ordered) {
    groupCounts[item.group] = (groupCounts[item.group] ?? 0) + 1;
    grouped[item.group].push(item);
  }
  const active = options.group ?? options.category ?? null;
  const filtered = active ? ordered.filter((i) => i.group === active || i.category === active) : ordered;
  for (const g of Object.keys(grouped) as SearchResultGroup[]) grouped[g] = grouped[g].slice(0, 10);

  const quoted = terms.map((t) => `“${t}”`).join(' and ');
  return {
    results: filtered.slice(0, options.limit ?? 40),
    groupedResults: grouped,
    totalMatches: filtered.length,
    groupCounts,
    categoryCounts: { ...groupCounts },
    suggestion: null,
    didYouMean: null,
    isTypoCorrected: false,
    matchedTheme: perTerm[0]?.matchedTheme ?? null,
    intentNote:
      intent.kind === 'compare'
        ? `Read as a comparison of ${quoted}. Open each result to compare them; this search does not write an answer.`
        : intent.kind === 'define'
          ? `Read as a question about the meaning of ${quoted}. These are the concept pages and passages that cover it.`
          : `Read as a request for teachings about ${quoted}. These are verified passages and pages; open one to read it in context.`,
  };
}
