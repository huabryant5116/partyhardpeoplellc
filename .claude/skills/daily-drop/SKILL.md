---
name: daily-drop
description: One-command daily content generation for the CSUF ASI campaign. Use when the user says "daily drop", "today's content", "/daily-drop", or asks for the day's posts. Checks the campaign phase, picks a pillar/bloc/format, runs campus-intel → viral-scripter → coalition-pitcher → compliance-auditor, and saves a ready-to-shoot package.
---

# /daily-drop [pillar] [bloc] [format]

All arguments are optional:
- `pillar`: `vibrancy` | `ventures` | `wellbeing` (default: whichever is least used in the last 7 drops in `campaign/drops/`)
- `bloc`: `commuters` | `housing` | `greek` | `dirc` | `icc` | `transfer` | `general` (default: rotate)
- `format`: `reel` | `tiktok` | `carousel` | `story` (default: one Reel + one Story set)

## Steps

1. **Determine the phase.** Read `tracker/campaign-calendar.md`, compare it with today's date, and state the phase in one line:
   - **Phase 0–1 (pre-verification):** *personal-brand mode*. No vote, campaign, ticket or candidacy language. Content is Karaoke Club, Titan Walk street interviews, commuter-life comedy and problem awareness. CTAs are engagement-only.
   - **Phase 2–3 (campaign window):** full campaign mode with the **"Rank [Ticket Name] #1"** CTA.
   - **Phase 4 (voting days):** GOTV only, and obey any posting/location limits in the Election Code.
   - **Phase 5 (post-election):** thank-you content and the expense report. No new spending.
2. **Check recent drops.** List `campaign/drops/` to avoid repeating hooks or bits from the last 14 days.
3. **@campus-intel:** delegate a fact sheet for the chosen pillar plus 1–3 timely hooks for this week (weather, midterms, games, events, deadlines).
4. **@viral-scripter:** pass it the fact sheet, phase and format. Get back one primary script and one backup hook variant.
5. **@coalition-pitcher:** only if a specific bloc is selected. It adapts the hook, proof and messengers.
6. **@compliance-auditor:** always runs. If the verdict is FAIL, send the fixes back to viral-scripter once and re-audit. If it still fails, deliver nothing and report why.
7. **Save** to `campaign/drops/YYYY-MM-DD-<slug>.md` containing:
   - Phase line
   - Script(s)
   - Shot list and props checklist (phone, wireless mic, location, who is on camera, release forms needed)
   - Posting plan: best time (commuter peaks are roughly 9–11 AM and 12–2 PM on weekdays; adjust from analytics), caption, hashtags, first comment
   - Compliance report
   - Expense rows (also appended to `tracker/expense-log.md`)
8. **Reply** with a 5-line summary: hook, format, pillar/bloc, verdict, file path.

## Guardrails
- Never post or schedule anything. This skill only drafts. The candidate posts from personal or campaign accounts, never ASI accounts.
- Pre-verification output must pass the firewall test: "Would a reasonable student think this is a campaign ad?" If yes, it fails.
