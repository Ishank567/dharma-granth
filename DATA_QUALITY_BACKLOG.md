# Data Quality Backlog — `scriptures-full`

_Audit of `public/data/scriptures-full/*.json` — the JSON the web and mobile
apps read directly. 65 scriptures, 316,102 verses. Refresh the
numbers with `python scripts/audit-data-quality.py`._

## Status (updated 2026-06-05)

| Item | State |
|---|---|
| **P0** — romanized → Devanagari | ✅ **Done** — `npm run migrate:devanagari` |
| **P2** — header-artifact verses | ✅ **Done** — `tsx scripts/strip-header-artifacts.ts` |
| **P1** — missing translations/Hindi | ⏳ Open (needs sourced translations) |
| **P3** — durgasaptashati misalignment | ⏳ Open (manual re-map) |
| **P2b** — mangled mixed-script headers | 🔶 7 cleaned; seed-parser fix drafted + tested for the 36 Purana blobs (re-seed to apply) |

## TL;DR

The corpus is broad but, after the P0/P2 fixes, now renders in clean
Devanagari throughout. What remains is depth (translations) plus two small,
bounded cleanups.

---

## P0 — Romanized Sanskrit → Devanagari ✅ DONE

~24 scriptures (**0 romanized files remain**) stored their `sanskrit` as
romanized text instead of Devanagari, seeded from a romanized source without
the transliteration step `scripts/seed-puranas.ts` applies to sanskritdocuments
ITRANS files.

**Fix applied** via `scripts/migrate-romanize-to-devanagari.ts`
(`npm run migrate:devanagari -- --write`): converted **130,807 verses** across
24 files. The files used two schemes — IAST (the big Puranas) and ITRANS (the
smaller Upanishads/sutras) — so the script detects each file's scheme and
converts with the right one; converting with the wrong scheme produces garbage.
The original romanization is preserved in the `transliteration` field. The
script only touches purely-romanized verses (zero Devanagari), so the mangled
mixed-script lines in P2b are deliberately left untouched. Idempotent.

---

## P2 — Header artifacts removed ✅ DONE

GRETIL/source metadata ingested as fake verses: Upanishad title lines
(`.. Maitri (Maitrayani) Upanishad ..##`, `॥ … ॥ .. XopaniShat ..endtitles`)
and bare section markers (`.. 8..`).

**Fix applied** via `scripts/strip-header-artifacts.ts`: removed **34 artifact
verses across 18 files** and decremented each `totalVerses`. The matcher is
deliberately precise — it does NOT touch real verses that merely begin with
".." (harivanshpuran) or the mixed-script lines in P2b. Verified: removals
exposed the real first verses (e.g. ishavasya now opens on
`ॐ ईशा वास्यमिदँ सर्वं…`).

---

## P2b — Mangled mixed-script lines 🔶 (52 found · 7 cleaned · 45 remaining)

_Newly discovered during P0/P2._ Some verses mix Devanagari, Latin and ITRANS
markup in a single `sanskrit` field. They split into two kinds:

**(a) Clean verse + English editorial note — FIXED (7).** A real, complete
Devanagari śloka with an English annotation stuck on: a source credit
(atharvaveda `By Dr. … Lucknow, India. <verse>`), a "(verses missing)" note
(manusmriti 3.57), or a Brahmasutra variant label (`पाठभेद 1.4.5 and 6 combined
ॐ … ॐ`). Dropping the non-Devanagari cleanly recovers the verse. Fixed via
`scripts/clean-mixed-headers.ts` (an explicit, hand-verified allowlist — a
blanket strip is unsafe, see below). atharvaveda ×1, manusmriti ×1,
brahmasutra ×5.

**(b) Conflated title/invocation/verse blobs — NOT auto-fixable (45).** These
need a fix in the **seed pipeline** (`scripts/seed-puranas.ts`), not a data
patch, because the romanized text often *is* real verse content:

- **Purana canto headers (36): `bhagavatapurana` 13, `devibhagavat` 12,
  `shivpurana` 11.** Each chapter's first entry is a blob of mangled-Devanagari
  title + maṅgala invocation + (for bhag/devibhag) **verse 1.1.1 in ITRANS**.
  Blindly stripping Latin reduces the blob to just its title — *losing the
  opening verse of the Bhagavatam / Devi Bhagavatam*. The seed parser should
  separate title, invocation, and verse 1 instead.

  **Root cause + fix DRAFTED (pending re-seed).** Confirmed two bugs in
  `scripts/lib/itrans-parser.ts`: (1) `cleanItx` *unpacked* `\engtitle{}` /
  `\itxtitle{}` document-title tags into the body, so the English title
  ("…Bhagavatam Canto 1…") was transliterated into the `ष्रिमद् Bहगवतम्`
  gibberish; (2) the maṅgala invocation (unnumbered, bare `||`) before verse 1
  was folded into verse 1 by `extractVerses`. Fixed by dropping title tags +
  `endtitles` in `cleanItx`, and a new `stripFrontMatter()` that cuts to the
  first numbered verse — wired into `seed-puranas.ts`. Verified offline on a
  fixture (`npm run test:parser`): the first verse now resolves to a clean
  `जन्माद्यस्य यतोऽन्वयादितरतः…`. **To apply, re-run `npm run seed:puranas`**
  (needs network to sanskritdocuments.org); eyeball verse 1 of each Purana
  afterward, especially `devibhagavat` whose verse-marker format differs.
- **`brihadaranyaka` (4):** a Devanagari mantra followed by a duplicate of
  itself in ITRANS, plus `[IV.iv.3]` refs and `मर्क्` markers — needs de-duping.
- **`manusmriti` (2, verses 7.87/7.206):** Devanagari verse + transliterated
  English commentary note + a second verse in ITRANS, conflated in one field.
- **`yogavasishtha` 1, `vivekchudamani` 1, `brahmasutra` 1:** leftover title
  blobs (e.g. `॥ विवेकचूडामणिः ॥एndtitles`) that P2 missed because `endtitles`
  was partly transliterated. Safe to drop once confirmed the real text follows.

Verify remaining count any time with `python scripts/audit-data-quality.py`
(MixedHdr column) or the audit's mixed-script check.

---

## P1 — Missing translations & Hindi (62 texts with 0% translation)

The hardest and highest-value gap — needs *sourced* translations (machine
translation of śloka isn't trustworthy for a scripture app). Sequence by reader
demand, not size:

- **Tier A:** the 10 mukhya Upanishads, Ramayana, Bhagavata Purana, Vishnu
  Purana, Manusmriti, Vidura Niti.
- **Tier B:** remaining Upanishads, Durga Saptashati (finish + fix P3 mapping).
- **Tier C:** the large Puranas (huge verse counts, lower per-verse demand).

The reader degrades gracefully (Sanskrit-only when no translation exists).
Consider a catalog `hasTranslation` flag so the UI can label "Sanskrit only".
Largest gaps:

| Scripture | Verses |
|---|--:|
| `mahabharata` | 73,821 |
| `shivpurana` | 25,198 |
| `ramayana` | 22,742 |
| `devibhagavat` | 18,386 |
| `naradapuran` | 15,600 |
| `bhagavatapurana` | 14,103 |
| `brahmapuran` | 13,796 |
| `brahmandpuran` | 13,745 |
| `garudpurana` | 11,969 |
| `agnipuran` | 11,091 |
| `rigveda` | 10,499 |
| `matsyapuran` | 8,541 |

_Only `bhagavadgita` (701) and `nityakarmakriya` (16) have full translation + Hindi; `durgasaptashati` ~3%._

---

## P3 — Misaligned translations (durgasaptashati)

The only partially-translated text outside the Gita has its ~16 English/Hindi
strings offset onto the wrong verses (verse 1.73 happens to align — verified).
Re-map against the source before surfacing more. (The mobile "Verse of the Day"
pool includes only the one verified-aligned verse for this reason.)

---

## Appendix — full per-scripture table (current)

| Scripture | Verses | Script | Tr % | Hi % | MixedHdr |
|---|--:|---|--:|--:|--:|
| `mahabharata` | 73,821 | devanagari | 0 | 0 | 0 |
| `shivpurana` | 25,198 | devanagari | 0 | 0 | 11 |
| `ramayana` | 22,742 | devanagari | 0 | 0 | 0 |
| `devibhagavat` | 18,386 | devanagari | 0 | 0 | 12 |
| `naradapuran` | 15,600 | devanagari | 0 | 0 | 0 |
| `bhagavatapurana` | 14,103 | devanagari | 0 | 0 | 13 |
| `brahmapuran` | 13,796 | devanagari | 0 | 0 | 0 |
| `brahmandpuran` | 13,745 | devanagari | 0 | 0 | 0 |
| `garudpurana` | 11,969 | devanagari | 0 | 0 | 0 |
| `agnipuran` | 11,091 | devanagari | 0 | 0 | 0 |
| `rigveda` | 10,499 | devanagari | 0 | 0 | 0 |
| `matsyapuran` | 8,541 | devanagari | 0 | 0 | 0 |
| `vayupuran` | 7,776 | devanagari | 0 | 0 | 0 |
| `lingapuran` | 6,831 | devanagari | 0 | 0 | 0 |
| `skandapuran` | 6,724 | devanagari | 0 | 0 | 0 |
| `atharvaveda` | 6,187 | devanagari | 0 | 0 | 0 |
| `harivanshpuran` | 6,069 | devanagari | 0 | 0 | 0 |
| `kurmapuran` | 5,822 | devanagari | 0 | 0 | 0 |
| `vamanpuran` | 5,683 | devanagari | 0 | 0 | 0 |
| `vishnupurana` | 5,608 | devanagari | 0 | 0 | 0 |
| `markandeypuran` | 4,522 | devanagari | 0 | 0 | 0 |
| `narasimhapuran` | 3,470 | devanagari | 0 | 0 | 0 |
| `manusmriti` | 2,683 | devanagari | 0 | 0 | 2 |
| `ramcharitmanas` | 2,247 | devanagari | 0 | 0 | 0 |
| `yajurveda` | 1,965 | devanagari | 0 | 0 | 0 |
| `samaveda` | 1,873 | devanagari | 0 | 0 | 0 |
| `tejobindu` | 973 | devanagari | 0 | 0 | 0 |
| `maitri` | 931 | devanagari | 0 | 0 | 0 |
| `mahanarayana` | 800 | devanagari | 0 | 0 | 0 |
| `bhagavadgita` | 701 | devanagari | 100 | 100 | 0 |
| `yogavasishtha` | 650 | devanagari | 0 | 0 | 1 |
| `durgasaptashati` | 634 | devanagari | 3 | 3 | 0 |
| `chandogya` | 629 | devanagari | 0 | 0 | 0 |
| `vivekchudamani` | 589 | devanagari | 0 | 0 | 1 |
| `brahmasutra` | 566 | devanagari | 0 | 0 | 1 |
| `viduraniti` | 530 | devanagari | 0 | 0 | 0 |
| `brihadaranyaka` | 435 | devanagari | 0 | 0 | 4 |
| `muktika` | 355 | devanagari | 0 | 0 | 0 |
| `shandilyabhaktisutra` | 289 | devanagari | 0 | 0 | 0 |
| `shvetashvatara` | 125 | devanagari | 0 | 0 | 0 |
| `katha` | 119 | devanagari | 0 | 0 | 0 |
| `niralamba` | 108 | devanagari | 0 | 0 | 0 |
| `jabala` | 87 | devanagari | 0 | 0 | 0 |
| `aitareya` | 73 | devanagari | 0 | 0 | 0 |
| `kaivalya` | 70 | devanagari | 0 | 0 | 0 |
| `mundaka` | 67 | devanagari | 0 | 0 | 0 |
| `prashna` | 66 | devanagari | 0 | 0 | 0 |
| `taittiriya` | 52 | devanagari | 0 | 0 | 0 |
| `ravanasamhita` | 44 | devanagari | 0 | 0 | 0 |
| `kena` | 34 | devanagari | 0 | 0 | 0 |
| `naradabhaktisutra` | 26 | devanagari | 0 | 0 | 0 |
| `amritabindu` | 22 | devanagari | 0 | 0 | 0 |
| `ishavasya` | 18 | devanagari | 0 | 0 | 0 |
| `padmapuran` | 18 | devanagari | 0 | 0 | 0 |
| `nityakarmakriya` | 16 | devanagari | 100 | 100 | 0 |
| `shivaswarodaya` | 16 | devanagari | 0 | 0 | 0 |
| `kaushitaki` | 14 | devanagari | 0 | 0 | 0 |
| `shivasamhita` | 14 | devanagari | 0 | 0 | 0 |
| `yogavasistha` | 14 | devanagari | 0 | 0 | 0 |
| `vinayapatrika` | 13 | devanagari | 0 | 0 | 0 |
| `brahmavaivartapuran` | 11 | devanagari | 0 | 0 | 0 |
| `mandukya` | 11 | devanagari | 0 | 0 | 0 |
| `yogarasayanam` | 11 | devanagari | 0 | 0 | 0 |
| `kalkipuran` | 10 | devanagari | 0 | 0 | 0 |
| `varahapuran` | 10 | devanagari | 0 | 0 | 0 |
