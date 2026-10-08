# Verse page: design and component spec

Principle: simplify the language and the path, never the teaching. The verse, the literal translation, the traditional commentary and the sources are always one tap away. Beginners get clarity first (progressive disclosure).

Code map

| Area | File |
|---|---|
| Page (server) | `app/scripture/[id]/chapter/[chapterId]/verse/[verseId]/page.tsx` |
| Reader shell, toolbar, dialogs | `app/components/reader/VerseReader.tsx` |
| Scripture stage and content layers | `app/components/reader/ReaderLayers.tsx` |
| Settings panel | `app/components/reader/ReaderSettingsPanel.tsx`, `lib/useReaderSettings.ts` |
| Quick / Simple / Deep | `app/components/understand/UnderstandPanel.tsx` |
| Cards, flow, timeline, tabs | `app/components/understand/primitives.tsx` |
| Pause and think | `app/components/understand/PauseAndThink.tsx` |
| Word explorer | `app/components/understand/WordExplorer.tsx` |
| Share card | `app/components/understand/ShareCard.tsx` |
| Completion | `app/components/understand/VerseCompletion.tsx` |
| Verse content | `data/pedagogical-*.ts`, `data/understanding.ts` |

## 1. Wireframe (all sizes share one order)

```
┌ reader header: back · scripture · chapter ▾ · progress · bookmark · settings ┐
  [‹ prev]        Bhagavad Gita 2.47 · jump to verse ▾        [next ›]
  [Listen][Slow][Save][Note][Copy][Share][Download][Report]
 ┌────────────────────────── ORIGINAL SCRIPTURE ──────────────────────────┐
 │ ⌐                                                                    ¬ │
 │        कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।                             │
 │        मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥                      │
 │ ∟                                                                    ┘ │
 └────────────────────────────────────────────────────────────────────────┘
  Roman transliteration · Hindi · English (each labelled, collapsible on phones)
  How would you like to understand this verse?   [Quick] [Simple] [Deep]
  [Create share card]
  ── mode content (below) ──
  Sources · Related concepts · Cross-references
  You have explored Bhagavad Gita 2.47.  [Next verse][Full passage][Ideas][Save][Plan]
└ mobile only: fixed bottom bar  ‹ prev │ श्लोक ४७ · jump │ next › ┘
```

## 2. Layouts

- **Mobile (< 640 px):** one column, 16 px gutters, verse at 28 px, toolbar scrolls horizontally, one sticky bar only (the bottom verse navigation). Mode selector scrolls horizontally. Long layers start collapsed. Sequence: reference, Sanskrit, listen/save, mode selector, one line, simple meaning, example, misunderstanding, try today, reflection, commentary, sources, prev/next.
- **Tablet (640–1023 px):** single column, `max-w-3xl`, verse navigation moves to the top row, toolbar wraps.
- **Desktop (≥ 1024 px):** the reading column stays dominant (`max-w-3xl`, switchable to narrow/wide in settings). Teaching flow runs horizontally. The left chapter/verse rail appears from 1280 px and the right "on this page" rail from 1536 px; below that the chapter and verse pickers are dialogs.

## 3. Modes (stored in `readerMode` of the reader settings; the settings panel and the selector share it)

| Mode | Shows |
|---|---|
| Quick | Verse in 30 seconds, one line, a relatable situation, one action, one reflection question |
| Simple | Context timeline, one line, simple meaning (EN + HI), important words, teaching flow, why it matters, modern example tabs, before/after, common misunderstanding, what it does not mean, try today, pause and think |
| Deep | Context timeline, word by word, three traditional commentaries, sources and edition |

The verse never leaves the page when a mode changes. A section only appears if the verse has data for it. Sandhi, grammar tables, comparison of interpretations and review history show an explicit "not yet prepared" note instead of invented content.

## 4. Content labels (always visible, never colour-only)

Original scripture (amber frame, double border) · Literal translation · Traditional commentary (gold) · Simple explanation (indigo) · Modern example · not scripture (blue) · Practical reflection · optional (green) · Editorial learning aid · not scripture (stone) · Research context · not scripture (indigo). Editorial and modern blocks never use the amber source frame.

## 5. Component specs

Each entry: purpose · content rules · interaction · mobile · accessibility · error behaviour · acceptance.

### ExplainCard (8 kinds)
- **Purpose:** one idea per card. Kinds: in one line (saffron, bolt), simple meaning (indigo, book), why it matters (teal, compass), modern example (blue, sun), what it does not mean (amber, info), try this today (green, check), reflection (violet, bubble), deeper commentary (gold, manuscript).
- **Content:** a visible heading always; icon is a cue only. Hindi sits beneath English. Editorial cards carry a label chip.
- **Interaction:** fades in (0.35 s, 4 px). No motion under reduced-motion or "hide decorative".
- **Mobile:** full width, 16 px padding. **A11y:** `<section aria-labelledby>`, `<h3>`, icon `aria-hidden`.
- **Error:** none. **Accept:** every card has a text heading; no card relies on colour alone.

### Mode selector
- **Interaction:** ARIA tabs, arrow keys, roving tabindex, choice saved locally. **Mobile:** scrolls horizontally, 52 px high. **Error:** if storage is blocked, the mode holds for the visit. **Accept:** reload keeps the mode; the verse stays visible when switching.

### Teaching flow
- **Content:** 3–6 steps, each a question or a plain statement. **Desktop:** horizontal with arrows. **Mobile:** vertical.
- **A11y:** diagram is `aria-hidden`; an `sr-only` sentence and a visible "Show as text" toggle give an ordered list. **Accept:** the text version carries every step.

### Before and after
- **Content:** the "before" is an understandable thought, never a flaw. Labelled editorial, not scripture. **Accept:** no wording that calls the reader lazy, weak or foolish.

### Pause and think
- **Interaction:** Think quietly (nothing stored) or Write privately. Writing saves to `localStorage` (`dharma.reflections.v1`) with the notice "Stored only in this browser", plus Delete and Export (all entries as .txt). No account, never uploaded.
- **Error:** if storage fails, the text stays on screen and the status says so. **A11y:** labelled textarea, `role=status` messages. **Accept:** delete removes the entry; export works with no network.

### Context timeline
- **Content:** 4–6 steps ending with the current verse (`aria-current="step"`, "This verse" badge). Buttons: Read previous verse, Read full passage, Continue the conversation. **Accept:** previous/next links exist only when those verses do.

### Common misunderstanding
- **Style:** neutral amber and blue, no red. Wording: "Some readers take it to mean… / A fuller reading". **Accept:** never uses alarming language.

### Modern example tabs
- **Content:** only contexts the verse supports (student, career, creator, relationships, family, sport, discipline). Short, realistic, no slang, no promised outcomes; the card says so.
- **Interaction:** ARIA tabs with arrow/Home/End. **Mobile:** horizontal scroll. **Accept:** adding a context to a verse that does not fit is a content review failure.

### Word explorer
- **Interaction:** tap a word; a dialog opens (bottom sheet on phones, centred panel on desktop). Escape and backdrop close; focus returns. No hover dependence. The dialog overlays, so the verse does not shift.
- **Content:** meaning in this verse (EN + HI), word and root. **Deviation from the brief:** desktop uses a centred dialog, not an anchored popover. **Gap:** grammar form and "view full word study" need data that does not exist yet.

### Verse in 30 seconds
- **Content:** situation, teaching, reminder, try. One short sentence each. Used first in Quick mode.

### Audio
- **Interaction:** Listen (1×) and Slow (0.7×) use the device's speech voice, pressing again stops. **Error:** with no voice available the buttons disable and the toast explains. **Gap:** this is device speech, not a recorded recitation, so Sanskrit pronunciation depends on the device voice.

### Share card
- **Output:** 1080×1350 PNG: the first two lines of the verse (shrunk to fit ≤ 4 lines), the reference, a one-line meaning labelled "explanation, not scripture", "Dharma Granth" and the URL. Themes: Paper, Saffron, Midnight, Minimal, all with high-contrast text. **Interaction:** Save image, or Share (files) where the browser supports it, otherwise download. **A11y:** canvas has a text description. **Error:** a failed canvas shows a message.

### Source panel
- Deep mode shows scripture, reference, context, meter, edition, authority tier and the editorial note. The page also keeps the existing sources and interpretation block. Review history is not yet recorded.

### Verse completion
- "You have explored {reference}." with Next verse, Full passage, Related ideas, Save for later, Add to a reading plan. No streaks, scores or comparisons.

### Reader settings
- Sanskrit size, translation size, line spacing, reading width, contrast (standard/high), theme, language and number format, transliteration/Hindi/English toggles, reduce motion, hide decorative elements, and a live preview of the Sanskrit sample. Stored in `dharma.readerSettings`; every component using the hook updates at once.

## 6. States

- **Loading:** the verse is static HTML, so the text is present before any script runs. Client pieces (mode, bookmarks, notes) hydrate after mount with defaults first, so there is no layout jump.
- **Error:** storage blocked → inline message and the feature still works for the visit. Speech unavailable → disabled buttons with a toast. Share/canvas failure → message. Unknown verse → 404.
- **Empty:** verse with no pedagogical data shows the verse layers only. Deep mode without sandhi/grammar says so. No saved reflection → the Write button reads "Write privately".

## 7. Screen-reader alternatives

Teaching flow → ordered list. Context timeline → ordered list with `aria-current`. Share card → canvas description. Icons → `aria-hidden`; every card has a text heading. Progress bar → `role=progressbar` with value. Toasts and saves → `aria-live=polite`.

## 8. Known gaps

1. Extras (timeline, flow, before/after, misunderstanding, examples, 30-second) exist only for Gita 2.47. Gita 2.48 and Isha 1 have the base pedagogical data. Every other verse shows the verse layers only.
2. (Done) Desktop left and right rails exist.
3. Sandhi, grammar, interpretation comparison and review history have no data.
4. No full-word-study page to link to.
5. Editorial content for 2.47 was written for this change and needs a scholar's review before release.
