---
name: titan-walk-remix
description: Turns raw Titan Walk street-interview transcripts (or any raw footage transcript, voice memo or podcast) into ranked viral clip packages with timestamps, hooks, captions and edit notes. Use when the user shares a transcript, an .srt/.vtt/.txt file, or says "remix this interview" or "/titan-walk-remix".
---

# /titan-walk-remix <transcript path or pasted text>

## Input
A transcript with timestamps (.srt, .vtt, or text with `[mm:ss]` markers). If there are no timestamps, work from quote order and tell the user to sync timestamps in their editor (CapCut, Descript, etc.).

## Steps

1. **Ingest and tag.** Read the transcript. Label each speaker as Candidate, VP, or Student-N. Never put real names of interviewed students in on-screen text without a signed release.
2. **Mine moments.** Find 5–10 candidate clips, each 7–45 seconds long, and score each 1–5 on:
   - **Hook strength:** does the first 2 seconds stop the scroll?
   - **Relatability:** pratfall or shared pain (parking, heat, ghost town, CAPS waits, money)
   - **Humor:** a genuine laugh, not a forced one
   - **Pillar fit:** 1, 2 or 3
   - **Proof:** shows the candidate listening or acting, not just talking
   - **Risk:** anything that could embarrass the interviewee or be clipped badly (subtract)
3. **@campus-intel:** fact-check any claim made on tape that will appear in text overlays. Student opinions can stay as opinion, but you never add a "fact" overlay without a source.
4. **@viral-scripter:** for the top 3 clips, write:
   - Exact in/out timestamps and any internal cuts (jump cuts every 2–3 seconds)
   - The cold-open hook, reordering lines if that makes a stronger 0–2s
   - On-screen text and captions (burned-in subtitles are mandatory)
   - B-roll and sound notes, with platform-licensed audio only
   - A blooper tail
   - A phase-appropriate CTA (see `daily-drop` step 1)
5. **@coalition-pitcher:** if an interviewee clearly speaks from a bloc's experience, suggest which bloc's audience the clip serves. Don't label the student by identity on screen.
6. **@compliance-auditor:** audit each clip. Also check:
   - A signed **release** exists for every identifiable student, or their face and voice are cut or blurred
   - No ASI/CSUF logos, offices or official merch dominate the frame (blur or crop them)
   - Nothing filmed inside classrooms or restricted spaces
7. **Save** to `campaign/remixes/YYYY-MM-DD-<source-slug>.md`:
   - A ranked clip table (score, timestamps, hook, pillar)
   - Full edit sheets for the top 3
   - The compliance report
   - Releases needed
8. **Reply** with the ranked table and the file path.
