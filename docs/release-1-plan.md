# Release 1 plan: Understand and continue

Audit date 2026-10-08. Release 2 and 3 work is not started here. Another contributor is building the Daily Dharma Journey (`app/daily`, `app/components/daily`, `data/daily-dharma-data.ts`); Release 1 avoids those files.

## 1. Gap analysis (what the audit found)

Already in place: verse stage and actions, Quick / Simple / Deep with local memory, context timeline and misunderstanding card (Gita 2.47 only), sources panel, feedback, focus mode, save and notes, desk, continue-reading strip on the home page, 24 localStorage keys (all `dharma.*` or `dharma_*`, so backup, export and clear-all cover them), skip link, reduced-motion rules, 44px targets on new components, no analytics code at all.

| # | Gap | Brief item |
|---|---|---|
| G1 | After a verse there is no contextual next-step block with at most three reasoned options and Continue / Save / Hide / Why / Disable | R1 §9 |
| G2 | Saved verses have no default collections, rename, move, search or scripture filter | R1 §10 |
| G3 | Reading history cannot be paused, exported or imported on its own; no clear-all in one place | R1 §8 |
| G4 | No canonical scripture registry; aliases (`yogavasistha`, `ishaupanishad`) are ad hoc; counts are not checked against the seeded text | Foundation |
| G5 | Verses without reviewed explanation show only a missing section, never the required review notice | Principle 6 |
| G6 | No analytics policy: nothing blocks a future event from carrying note text | R1 acceptance |
| G7 | Verse stage lacks an explicit "Open complete context" action | R1 §1 |
| G8 | Rich explanation data (30-second card, context, misunderstanding, examples) exists for Gita 2.47 only | R1 §3-7 (content, not code) |
| G9 | Library redesign exists as another contributor's uncommitted files; not audited or changed here | R1 §11 |

## 2. Files to modify or add

- G1: add `app/components/study/NextTeachings.tsx`; edit the verse page to pass server-built candidates.
- G2: add `lib/verse-collections.ts`, `app/desk/SavedCollections.tsx`; edit `DeskClient.tsx`.
- G3: edit `lib/reading-history.ts` (pause flag, export, import, clear); add `app/desk/HistoryControls.tsx`; edit `DeskClient.tsx`.
- G4: add `lib/scripture-registry.ts`, `scripts/check-registry.ts`.
- G5: add `app/components/study/ReviewRequiredNotice.tsx`; edit the verse page.
- G6: add `lib/analytics.ts` (typed allowlist, no transport) and `scripts/test-release1.ts`.
- G7: edit the verse toolbar in `VerseReader.tsx`.

## 3. Data-model migration

No existing key changes shape, so no migration step can lose data.
- `dharma.bookmarkedVerses` stays the list of saved verses.
- New `dharma.verseCollections.v1`: `{ version: 1, collections: [{id, name, builtin}], assign: { "<scripture>:<chapter>:<verse>": collectionId } }`. A saved verse with no assignment is shown in Read Later.
- New `dharma.history.paused` (`"1"` when paused).
- `dharma.recs.v1` is shared with the desk cards (hide list, off switch).
- All new keys start with `dharma.`, so `lib/backup.ts` exports, imports and clears them without change.
- Import validates shape and ignores unknown fields.

## 4. Implementation sequence (one commit each)

1. G4 registry and check script (read-only audit first)
2. G3 history controls
3. G2 collections
4. G1 next teachings and G5 review notice, G7 context action
5. G6 analytics policy and tests

## 5. Test plan

- Unit (`npm run test:release1`): collection create, rename, move, delete (built-ins protected); import rejects malformed data; history pause stops recording; export then import round-trips; analytics drops any field not on its allowlist.
- Existing: `npm run check`, `typecheck`, `lint`, `test:format`, `check:journeys`.
- Browser (manual, recorded in the final report): desk collections, pause history, verse page next steps, keyboard-only pass over new controls, reduced motion, 320 px width, offline reload.
- Playwright suite (`npm run test:e2e`) is run if a server is available.

## 6. Risks and safeguards

- Concurrent contributors edit the same checkout: each commit stages only my hunks; `git status` is checked before editing.
- Data loss on import: import asks first and only adds or replaces its own keys.
- A "recommendation" that guesses: every card is built from this browser's history or a reviewed link and shows its basis; no inference about beliefs.
- Misleading counts: the registry check reports mismatches and does not rewrite data.
- Content gap (G8) is not papered over: missing explanation shows the required review notice.

## 7. Release 1 acceptance results (2026-10-08)

Checked by script: `npm run check`, `typecheck`, `lint` (clean for Release 1 files), `test:format`, `test:release1`, `check:journeys`, `check:registry`. Checked in the browser: desk collections, history, verse next steps, Quick mode persistence after reload, 375 px width with no horizontal overflow.

| Criterion | Result |
|---|---|
| Quick / Simple / Deep on desktop and mobile | Pass (375 px checked, no overflow) |
| Mode persists locally | Pass (reload kept Quick) |
| Reading progress survives refresh | Pass (position stored per scripture; unit-tested) |
| Save and remove verses | Pass; collections, notes, search, export and import added |
| Simplified explanations carry a content label | Pass; the 30-second card now reads "Simplified editorial explanation" |
| Reviewed explanations show source information | Pass on verse pages (sources panel); depends on the data in each scripture record |
| Every verse offers a contextual next step | Pass where a next verse, a reviewed link or a concept exists (max three, with reasons); the last verse of a chapter with no links falls back to the completion card |
| Library cards concise and filterable | Not verified: the library redesign is another contributor's uncommitted work |
| Singular and plural labels | Partial: shared formatter in use at the known sites; no full-site sweep |
| Loading, empty, error, offline states | Partial: present on new pages; the older pages were not audited |
| Keyboard and screen-reader testing | Not done. Automated checks only; manual testing is still required |
| Reduced motion | Pass by code (respected in the reader, focus mode and new components); not re-tested here |
| No private notes in analytics | Pass: allowlist makes it structurally impossible; unit-tested |

Open findings
- Body text of 12 px (`text-xs`) is used for metadata and helper text in many components, including mine. The brief sets 14 px as the minimum for meaningful text. A global change to Tailwind's `xs` size would fix it but alters layouts site-wide, so it needs a decision.
- A few inline links on pages outside Release 1 are under 44 px tall.
- Playwright (`npm run test:e2e`) runs against a full `dist/` build; it was not run because building would replace the existing export.
- Another contributor's in-progress Daily Dharma and Start My Journey rewrites currently fail lint (unescaped quotes), unrelated to Release 1.
- `data/chapters.json` disagrees with the seeded text for several scriptures (see `npm run check:registry`); it is regenerated by `npm run publish:data` at build.
