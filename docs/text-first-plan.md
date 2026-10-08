# Text-first direction: audit, plan and Phase 1

Direction: Dharma Granth is a text-first, visually guided, multilingual, source-transparent learning platform. AI narration is not restored or replaced. Audio work from the earlier Release 3 plan (audio-first mode, word-by-word pronunciation, Sanskrit recording lessons) is dropped.

## 1. Existing-product audit

Already built and kept: verse reader with Quick / Simple / Deep, context timeline, misunderstanding card, sources panel, feedback, focus mode, compare views, commentary comparison (no commentary data yet), explain-this-line (2.47 only), related teachings, journeys (8 drafts), life situations (15), concept pages (12, Yajna in place of Jnana), story mode, study desk with collections, history controls, weekly summary, study packs, grouped multilingual search with recent searches, suggestions, no-results recovery and typo correction, editorial dashboard, opt-in feedback collector.

Audio in the tree, for a decision (not touched here): the verse toolbar Listen and Slow buttons, `ListenButton`, `GlobalAudioPlayer` and `lib/verse-recite.ts` (device speech synthesis), the `/listen` page I added, and another contributor's uncommitted `app/listen/pilot` with generated MP3 files. All of these are synthetic voice. The brief says the AI voice feature has been removed, but these are still present.

## 2. Prioritised features (this brief)

| # | Feature | State |
|---|---|---|
| 1 | Start Here (four questions) | New route `/start-here` (see note on `/start`) |
| 2 | Chapter orientation | Built for Gita 1 and 2; extended to 3, 4, 6, 12, 18; prerequisites field added |
| 3 | Visual verse demonstrations | New: `VerseDiagram`, three formats shipped |
| 4 | Search | Mostly present; review status per result still missing |
| 5 | Source and review panels | Present; review badge registry added so badges appear only when a review is recorded |
| 6 to 12 | Five-minute session, concepts, comparison, desk, feedback, commentary comparison, stories | Built earlier except where noted in the status docs; Phase 2 and 3 |
| 13 | 3D repositioning | Not started (Phase 3 or later; the 3D files are another contributor's) |

## 3. Information architecture

Start Here and the journeys lead into chapter orientation, then the verse page. The verse page keeps the order: original scripture, transliteration, literal translation, then a mode choice (Quick, Simple, Deep), then diagrams and explanations, then commentary, sources and next steps. Concepts, life situations, search and the study desk are reachable from the navigation.

## 4. Component hierarchy (new)

- `StartHere` (questions, result list, reset, storage notice)
- `VerseDiagram` (renderer for seven diagram kinds) with `DiagramFrame` (title, explanation, text alternative, source label, review status)
- `ChapterOrientation` (existing) with sequence list as the text alternative
- `ReviewBadges` driven by `data/review-records.ts`

## 5. Content-model changes

- `ChapterOrientation.prerequisiteConcepts: string[]`
- `VerseDiagram { id, scriptureId, chapter, verse, kind, title, summary, textAlternative, nodes, review, sourceVerses }` with `review: ReviewStatus` and an `expect` check against the library text
- `ReviewRecord { scope, kind: source | translation | commentary, reviewer, date }`; a badge is shown only for a recorded review

## 6. Accessibility risks

Diagrams can hide meaning in layout: every diagram carries a full text alternative and renders as an ordered list on small screens. Colour is never the only signal. Motion is limited to a short fade that stops under reduced motion. 12 px text in older components still breaches the 14 px rule.

## 7. Performance risks

Diagrams are small data and no images; they render on the server. Orientation data is static. No 3D or audio is loaded for these features.

## 8. Privacy risks

Start Here stores four answers in the browser only, with a reset and a storage notice. It infers nothing about identity or belief. No new analytics events carry text.

## 9. Migration

No existing key changes. New keys: `dharma.starthere.v1`. Reading history, collections, notes and settings are untouched.

## 10. Phases

Phase 1 (this pass): Start Here, chapter orientation, visual verse demonstrations, review-badge registry, search review. Phase 2: five-minute session (another contributor is building `/daily`), concept explorer completion (Jnana, typed relationships), comparison polish, desk. Phase 3: commentary comparison data, story labels, offline reading, optional human media, 3D repositioning.

Note on `/start`: another contributor is rewriting `/start` with five questions. This brief asks for four. `/start-here` is added so as not to overwrite their uncommitted work; the two should be merged into one.
