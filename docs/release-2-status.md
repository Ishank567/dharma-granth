# Release 2 status (2026-10-08)

Release 1 was taken as accepted with these exceptions, recorded in `docs/release-1-plan.md`: no manual keyboard or screen-reader pass, library cards unverified (another contributor's uncommitted work), partial plural and state audits.

## Built in this pass

| Item | Where | Notes |
|---|---|---|
| Private weekly summary | `lib/activity-log.ts`, `app/desk/WeeklySummary.tsx` | Local log of day, kind, reference and concept ids; never text. Off switch, clear, export, nothing recorded while history is paused. |
| Optional reminders | `lib/reminders.ts`, `app/desk/Reminders.tsx` | Calendar (.ics) events delivered by the reader's own calendar; quiet hours; fixed calm wording; no server and no push. |
| Guided journeys | `data/reading-journeys.ts` | Five now: Seven Days of Focus, Understanding Karma Yoga, Understanding the Self, Gita in 18 Lessons, Introduction to Bhakti. Verified against the library by `npm run check:journeys` (that check caught Gita 13.28, which is 13.29 in this edition). |
| 14px minimum | study, desk, journey, listen, story, pack components | Site-wide Tailwind sizes unchanged. |

## Not built, and why

- **Personalised dashboard, Daily Dharma Journey, Start My Journey changes:** another contributor is building these in this checkout (`app/daily`, `app/components/daily`, `data/daily-dharma-data.ts`, `app/start`, `app/dashboard`). They also use their own storage keys (`dharma.dashboard.prefs.v1`, `dharma.savedCollections.v1`) that overlap with the keys used here. Merge them with this work before shipping.
- **Explanation feedback reaching the editorial dashboard:** needs an anonymous collection endpoint, which is a privacy and hosting decision.
- **Reviewed journeys (acceptance needs at least three):** all five are drafts. Review is an editorial step, not something code can supply.
- **Missing journeys:** Bhagavad Gita for Beginners, Wisdom for Students, Introduction to the Upanishads.
- **Life-situation pages:** thirteen exist. "Uncertainty" and "Failure" are covered under other titles; sources are as recorded in the topic data, not independently reviewed.

## Release 2 criteria

| Criterion | Status |
|---|---|
| New and returning dashboard states | Not met here (other contributor) |
| Daily journey without an account | In progress elsewhere |
| Three complete reviewed journeys | Not met: five drafts, none reviewed |
| Life-situation pages with reviewed sources | Not met: unreviewed |
| Recommendations explain themselves; can be disabled and reset | Met (verse page and desk) |
| Saved information exports, imports, deletes | Met |
| Weekly summaries stay local | Met |
| Reminders fully optional | Met |
| Feedback reaches the editorial dashboard | Not met (needs endpoint) |
| No streak pressure, rankings or competition | Met in the pieces built here; the other contributor's pages were not audited |
