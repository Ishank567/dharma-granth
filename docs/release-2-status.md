# Release 2 status (2026-10-08)

Release 1 was taken as accepted with the exceptions recorded in `docs/release-1-plan.md`: no manual keyboard or screen-reader pass, library cards unverified (another contributor's uncommitted work), partial plural and state audits.

## Built

| Item | Where | Notes |
|---|---|---|
| Private weekly summary | `lib/activity-log.ts`, `app/desk/WeeklySummary.tsx` | Local log of day, kind, reference and concept ids; never text. Off switch, clear, export; nothing recorded while history is paused. |
| Optional reminders | `lib/reminders.ts`, `app/desk/Reminders.tsx` | Calendar (.ics) events delivered by the reader's own calendar; quiet hours; fixed calm wording; no server and no push. |
| Eight guided journeys | `data/reading-journeys.ts` | Gita for Beginners, Gita in 18 Lessons, Seven Days of Focus, Wisdom for Students, Understanding Karma Yoga, Introduction to Bhakti, Understanding the Self, Introduction to the Upanishads. Every lesson verified against the library by `npm run check:journeys`. All are drafts. |
| Fourteen life situations | `data/wisdom-for-life.ts` | Uncertainty and Failure and Setbacks added (fifteen topics); citations verified by the wisdom check. |
| Opt-in clarity feedback pipeline | `lib/feedback-*.ts`, `functions/api/feedback.ts`, `app/editorial/FeedbackPatterns.tsx`, `docs/feedback-collection.md` | Off by default; counters only; editor view with token. Needs a KV binding and a secret to run; tested against an in-memory store only. |
| Recommendations, saved data, start journey | earlier work | Explained, disable-able and resettable; saved data exports, imports and deletes. |
| 14px minimum | study, desk, journey, listen, story, pack components | Site-wide Tailwind sizes unchanged. |

## Still not done

- **Personalised dashboard, Daily Dharma Journey, and the rewrite of Start My Journey** belong to another contributor working in this checkout (`app/daily`, `app/components/daily`, `data/daily-dharma-data.ts`, `app/start`, `app/dashboard`). They were not finished or lint-clean when last checked, and use storage keys (`dharma.dashboard.prefs.v1`, `dharma.savedCollections.v1`) that overlap with the keys used here. Merge before shipping.
- **Editorial review.** Every journey, topic, explanation and reflection is a draft. "Reviewed" cannot be claimed until an editor reviews them and records it.
- **Feedback collector** is not deployed; until it is, sharing reports that nothing was sent.

## Release 2 criteria

| Criterion | Status |
|---|---|
| New and returning dashboard states | Not met here (other contributor) |
| Daily journey without an account | In progress elsewhere |
| At least three complete reviewed journeys | Eight complete journeys exist; none is reviewed, so not met |
| Life-situation pages with reviewed sources | Pages and verified citations exist; editorial review not done, so not met |
| Recommendations explain themselves; can be disabled and reset | Met |
| Saved information exports, imports, deletes | Met |
| Weekly summaries stay local | Met |
| Reminders fully optional | Met |
| Feedback reaches the editorial dashboard | Built; needs deployment configuration to be live |
| No streak pressure, rankings or competition | Met in the pieces built here; the other contributor's pages were not audited |
