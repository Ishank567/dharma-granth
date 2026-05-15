# Scripture seeding pipeline

The hand-curated files in `data/scriptures/*.ts` carry pedagogical highlights —
one or two verses per canonical chapter, each with explanation / science /
lifeLesson commentary written for the reader UI.

The seeders here fetch the **full verse text** of each scripture from public,
community-maintained datasets on GitHub and emit JSON to
`public/data/scriptures-full/`. They are how you go from "highlights" to
"every verse."

## What this is NOT

It is not an OCR pipeline. The earlier OCR scripts (deleted on
`slice-e1-courses`) extracted text from Gita Press PDFs in
`C:/Users/ishan/Music/dharma/*.pdf`. That output mixed public-domain Sanskrit
with copyrighted Hindi translations and library-scan watermarks, and it is
not safe to redistribute. Use those PDFs for personal reading; do not ship
their OCR'd contents.

## Sources

| Seeder | Source | What it provides |
| --- | --- | --- |
| `seed:gita` | [gita/gita](https://github.com/gita/gita) | 18 chapters, ~700 verses with Sanskrit, transliteration, Hindi and English translations |
| `seed:ramayana` | [bhavykhatri/DharmicData](https://github.com/bhavykhatri/DharmicData) | All 7 kandas of the Valmiki Ramayana, Sanskrit mūla only (~22,742 verses) |
| `seed:ramcharitmanas` | [bhavykhatri/DharmicData](https://github.com/bhavykhatri/DharmicData) | All 7 kandas of Tulsidas's Ramcharitmanas, Awadhi text + form labels |
| `seed:vedas` | [bhavykhatri/DharmicData](https://github.com/bhavykhatri/DharmicData) | Rig Veda (10 mandalas), Atharva Veda (20 kandas), Yajur Veda (40 adhyāyas, Vajasneyi-Madhyandina recension), Sanskrit mūla only |
| `seed:upanishads` | [sanskritdocuments.org](https://sanskritdocuments.org/doc_upanishhat/) | Eight principal Upanishads (Isha, Kena, Katha, Praśna, Muṇḍaka, Māṇḍūkya, Aitareya, Śvetāśvatara) with Sanskrit + ITRANS transliteration |
| `seed:mahabharata` | [bhavykhatri/DharmicData](https://github.com/bhavykhatri/DharmicData) | All 18 parvas, ~74k verses (critical-edition derivative). Output JSON is ~21 MB |
| `seed:puranas` | [sanskritdocuments.org](https://sanskritdocuments.org/doc_purana/) | Bhagavata (12 skandhas, ~14k verses), Devi Bhagavata (12 skandhas, ~18k verses), Garuda (~12k verses), Shiva (7 samhitas, ~25k verses); Sanskrit mūla + IAST transliteration |

### Not yet seeded (no clean open source readily available)

- **Sama Veda** — primarily a chant-pattern setting of Rig Veda verses; needs a dedicated source like the Aitareya Aranyaka or VedaWeb.
- **Brihadaranyaka / Chandogya / Taittiriya Upanishads** — typically published with bhāṣya attached. Need a dedicated parser; can revisit when a clean source is found.
- **Vishnu / Agni / Padma / Brahmanda / Markandeya Puranas** — sanskritdocuments has only fragments. Need GRETIL or another long-form source.
- **Manusmriti / Brahma Sutra / Vivekachudamani / Durga Saptashati / Yoga Vasishtha** — mixed availability; each would need its own bespoke seeder.

Sanskrit mūla text is firmly public domain (3000+ years old). Translations and
modern editions have varying terms — each output JSON records the source URL
and license note so you can verify before shipping in a public build.

`seed:puranas` uses ITRANS files (`.itx`) from sanskritdocuments and converts
them to Devanagari via `@indic-transliteration/sanscript`. The ITRANS text is
preserved as `transliteration` on each verse; the Devanagari rendering is
`sanskrit`.

## Running

```bash
npm install               # one-time
npm run seed:gita         # ~1 MB, ~700 verses, seconds
npm run seed:ramayana     # ~22,000 verses
npm run seed:ramcharitmanas
npm run seed:vedas        # Rig + Atharva + Yajur
npm run seed:upanishads   # 8 principal Upanishads, seconds
npm run seed:mahabharata  # ~74k verses, ~30 sec, ~21 MB JSON
npm run seed:puranas      # ~70,000 verses across 4 puranas, ~1 min
npm run seed:all          # all of the above, ~4 minutes
```

The seeders share a small library:

- `scripts/lib/scripture-schema.ts` — output JSON shape and helpers
- `scripts/lib/itrans-parser.ts` — ITRANS preamble stripping (`cleanItx`),
  chapter/verse splitters, and Devanagari conversion. Used by both
  `seed:puranas` and `seed:upanishads`.

Each seeder is independent — failure of one does not affect the others, and
each one logs which parts it skipped (with reason) if any.

## Caveat: purana chapter alignment

The puranas seeder uses **flat sequential adhyaya numbering** for chapter
numbers — Bhagavata gets chapters 1..650 across all 12 skandhas, Shiva gets
1..456 across 7 samhitas, etc. The skandha/samhita is encoded in the
chapter `title` string (`"Skandha 11 — Chapter 12"`, etc.), not the
`number`.

That means the seeded JSON's chapter numbers **don't automatically align
with the curated highlight chapters** in `data/scriptures/{bhagavatapurana,
devibhagavat, shivpurana, garudpurana}.ts`. The integrity check passes
(JSON chapter 2 exists for any curated chapter id 2) but the *content*
doesn't correspond — curated id 2 of Bhagavata is "Uddhava Gita" (canonical
Skandha 11), while JSON chapter 2 is Bhagavata Skandha 1 Adhyaya 2.

This is intentional for now — the alternative (reshape curated `.ts` files
to use canonical Skandha numbers as chapter ids, with placeholder
intermediates) is a bigger restructure best done in its own pass. If you
want to take it on, the pattern to follow is the one used for Rigveda and
Durga Saptashati: assign chapter ids matching canonical numbering and add
placeholder chapters (`verses: []`) for any not yet curated. Then a
follow-up to the seeder can either group chapters by skandha or accept the
adhyaya-level mapping and let the reader pick the skandha first.

## Output schema

`public/data/scriptures-full/<id>.json`:

```ts
interface FullScripture {
  id: string;
  title: string;
  titleSanskrit: string;
  category: string;
  source: { repo: string; license?: string; fetchedAt: string };
  totalVerses: number;
  totalChapters: number;
  chapters: Array<{
    number: number;
    title?: string;
    titleSanskrit?: string;
    verses: Array<{
      number: number | string;
      sanskrit?: string;
      transliteration?: string;
      translation?: string;
      hindi?: string;
      wordMeaning?: string;
    }>;
  }>;
}
```

The shape is intentionally orthogonal to the `data/scriptures/*.ts` highlight
format — they're meant to coexist. A reader can show the curated highlight
first and "load full text" on demand.

## What's missing

- **Yajurveda & Samaveda** — not present in the DharmicData repo. For these
  consider [GRETIL](http://gretil.sub.uni-goettingen.de/) (Göttingen Register
  of Electronic Texts in Indian Languages) or [VedaWeb](https://vedaweb.uni-koeln.de/),
  both of which publish Sanskrit under open terms.
- **The 18 Mahapuranas** in full — these are large (Padma Purana alone is
  ~55,000 verses) and most reliable public-domain sources are scanned
  facsimiles, not structured text. Practical options:
  - [Sanskrit Documents](https://sanskritdocuments.org/) has selected
    puranic texts in ITRANS / Devanagari.
  - [Wisdom Library](https://www.wisdomlib.org/) has structured but
    license-mixed translations.
- **The 108 minor Upanishads** beyond the 10 principal ones. GRETIL has most;
  add a `seed-upanishads.ts` that pulls specific files when needed.

Adding a new seeder follows the pattern of the existing ones:

1. Define source URL(s).
2. Map the source schema to the shared `FullVerse` / `FullChapter` shape from
   `scripts/lib/scripture-schema.ts`.
3. Call `writeScripture()`.
4. Add an `seed:<name>` entry to `package.json`.

## Consuming the output

`data/scriptures/index.ts` currently reads only the hand-curated `.ts`
modules. To wire the full-text JSON into the reader, a future change would
add an async loader — something like:

```ts
export async function getFullScripture(id: string): Promise<FullScripture | undefined> {
  try {
    const res = await fetch(`/data/scriptures-full/${id}.json`);
    return res.ok ? await res.json() : undefined;
  } catch {
    return undefined;
  }
}
```

…and the reader component could show the highlight from `getScripture()`
followed by an "expand to full text" affordance that loads the JSON.
