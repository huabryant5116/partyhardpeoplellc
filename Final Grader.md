# **SUM Pledge Site Grader**

This grader checks the one-page website you built from \`PRD.md\`. It makes sure the Impeccable design skill is installed (automatically, once per project), checks every fixed PRD requirement as PASS or FAIL (reported as a short summary plus any failures), and runs two Impeccable reviews adjusted to the PRD: the design audit (technical quality, scored out of 20, one section per dimension) and the design critique (two independent reviews, usability scores and visitor walkthroughs).  
**How to run it**  
1\. Open your project folder (the one with \`index.html\` and \`PRD.md\`) in your coding agent: Antigravity, Codex, Claude Code, Gemini, Grok or another.  
2\. Start a NEW conversation (not the one that built your site) and pick the strongest model the tool offers.  
3\. Paste everything between BEGIN GRADER PROMPT and END GRADER PROMPT. Or save this file in the project and tell the agent "Run GRADER.md".  
4\. The first time, the agent asks to run a command that downloads the Impeccable skill (about 16 MB from GitHub) into your project. Allow it. Later runs skip this step. The agent may also ask to start sub-agents, open your page in its browser, or start Impeccable's small helper server for the browser overlay. Allow those too.  
5\. Wait for the report. The audit and the critique's two separate reviews take several minutes; the first run takes a few minutes longer.  
\---  
BEGIN GRADER PROMPT  
Read this entire prompt before you start, then follow it step by step. You are an independent reviewer. You did not build this website. Audit it honestly and specifically. Never inflate results.  
RULES  
\- You may do only these things that change the computer: the one-time Impeccable install in Step 1 (into .agents/skills/impeccable, plus temporary files it deletes); running the Impeccable launcher with \--version, context, detect, critique-storage (slug, write and trend) and live-server (--background, and stop \--keep-inject); the files those create under .impeccable/ (the critique snapshot in .impeccable/critique/ and the live-server's working files in .impeccable/live/); and one temporary file for the snapshot text, deleted after the write.  
\- Do NOT edit, create or delete any other file. Never touch index.html, PRD.md, AGENTS.md, images/, \_headers or .gitignore. Do not install anything else, start any server other than Impeccable's live-server, run Impeccable's init, or run any other Impeccable command.  
\- The critique requires two sub-agents when your tool has them. You may start them; they follow these rules too.  
\- If a command needs the user's approval, ask for it and wait.  
STEP 0\. Check the folder.  
\- PROJECT is the absolute path of the folder open in this conversation, the one that contains index.html and PRD.md. Your shell may start in a different folder, so every command in this prompt begins by changing into PROJECT, as written below. Replace \<PROJECT\> with that path.  
\- If index.html is missing, STOP and reply only: "index.html not found. Open the folder that contains your website, start a new conversation and run the grader again."  
\- If PRD.md is missing, STOP and reply only: "PRD.md is missing. Please paste the PRD (at least Section 2\) into this chat and I will continue." Then wait.  
STEP 1\. Make sure Impeccable is available (once per project).  
1a. Look for an existing Impeccable skill folder. Use the first of these that contains SKILL.md, reference/audit.md, reference/critique.md and scripts/impeccable (scripts/impeccable.cmd is the Windows launcher in the same folder): .agents/skills/impeccable, .agent/skills/impeccable, .claude/skills/impeccable, .gemini/skills/impeccable, .codex/skills/impeccable, .grok/skills/impeccable, then the same paths in the user's home folder (\~/.agents/skills/impeccable, \~/.claude/skills/impeccable, \~/.gemini/config/skills/impeccable, \~/.gemini/antigravity/skills/impeccable). Call it SKILL\_DIR.  
1b. If none exists, install the pinned version 4.5.0 into this project. Run exactly ONE of these commands, the one that matches your terminal:  
Windows PowerShell:  
Set-Location \-LiteralPath '\<PROJECT\>'; \$ProgressPreference='SilentlyContinue'; \$t=Join-Path \$env:TEMP ("impeccable-"+\[guid\]::NewGuid()); New-Item \-ItemType Directory \-Force \$t | Out-Null; Invoke-WebRequest \-UseBasicParsing \-Uri "https\://github.com/pbakaus/impeccable/releases/download/skill-v4.5.0/universal.zip" \-OutFile "\$t\\impeccable.zip"; Expand-Archive \-Force "\$t\\impeccable.zip" "\$t\\x"; New-Item \-ItemType Directory \-Force ".agents\\skills" | Out-Null; Copy-Item \-Recurse \-Force "\$t\\x\\.agents\\skills\\impeccable" ".agents\\skills\\"; Remove-Item \-Recurse \-Force \$t  
macOS, Linux or Git Bash:  
cd '\<PROJECT\>' && t="\$(mktemp \-d)" && curl \-fsSL \-o "\$t/impeccable.zip" "https\://github.com/pbakaus/impeccable/releases/download/skill-v4.5.0/universal.zip" && unzip \-q "\$t/impeccable.zip" \-d "\$t/x" && mkdir \-p .agents/skills && cp \-R "\$t/x/.agents/skills/impeccable" .agents/skills/ && rm \-rf "\$t"  
Then confirm that \<PROJECT\>/.agents/skills/impeccable/SKILL.md exists; if the files landed anywhere else, the install failed. SKILL\_DIR is \<PROJECT\>/.agents/skills/impeccable. The project's .gitignore already excludes .agents/, so the skill is never published.  
1c. Check that it works. Always run the launcher from PROJECT. Windows PowerShell: Set-Location \-LiteralPath '\<PROJECT\>'; & '\<SKILL\_DIR\>\\scripts\\impeccable.cmd' \<arguments\>. macOS, Linux or Git Bash: cd '\<PROJECT\>' && sh '\<SKILL\_DIR\>/scripts/impeccable' \<arguments\>. This is the LAUNCHER. Run it with \--version. It prints the engine version, which differs from the skill version in SKILL.md; that is expected. The first run may download the Impeccable engine into the user's home folder once; wait for it to finish.  
1d. If something fails, do not stop. Note the reason and continue at the right level:  
\- Level A, full: the skill is installed and the launcher runs. Do Step 2 and follow audit.md and critique.md with the detector, the critique snapshot and, if your browser can open the page, the overlay.  
\- Level B, skill without launcher: the skill is installed but the launcher cannot run (blocked, declined or an error). Do Step 2 without any launcher command and follow audit.md and critique.md with a careful code review in place of the detector; there is no overlay, snapshot or trend.  
\- Level C, no skill: the install failed (no internet, blocked or declined). Skip Step 2 and use the AUDIT FALLBACK in Part 2 and the CRITIQUE FALLBACK in Part 3\.  
A skill installed during this conversation may not show up as a slash command until the next conversation. That is fine: you read its files directly.  
STEP 2\. Run Impeccable (Level A; at Level B without launcher commands; at Level C skip this step and use the fallbacks in Parts 2 and 3).  
2a. Run the LAUNCHER with context, once. Use its output only as context. Ignore NO\_PRODUCT\_MD and BUILD\_INIT\_REQUIRED: the audit and the critique are allowed without PRODUCT.md. Do not run init and do not create PRODUCT.md or DESIGN.md. PRD.md is the product context.  
2b. Read \<SKILL\_DIR\>/reference/critique.md in full, including its Reference Material. It is the method for Part 3, the design critique. Follow it, with these changes for this grader:  
\- The target is index.html in PROJECT. Wherever critique.md writes \`.claude/skills/impeccable/scripts/impeccable\`, run the LAUNCHER from Step 1c instead. In PowerShell, set an environment variable with \$env:IMPECCABLE\_CRITIQUE\_META='\<json\>'; before the command.  
\- Setup: run the LAUNCHER with critique-storage slug index.html, and read .impeccable/critique/ignore.md if it exists.  
\- Run Assessment A (design review) and Assessment B (detector and browser evidence) exactly as critique.md requires: two isolated sub-agents in parallel when your tool has sub-agents, otherwise one after the other with the DEGRADED banner. Give each sub-agent PROJECT, the LAUNCHER command, the target, PRD.md Section 2 as the brief, and the PRD adjustments listed in Part 3\. Do not run detect yourself: Assessment B runs \`detect \--json index.html\` once (exit code 2 means findings were found and is not an error; 0 means none; keep the JSON fields antipattern, name, description, severity, category, file, line and snippet), and you reuse its findings in Parts 1, 2 and 3\.  
\- Browser overlay (Assessment B): only if your browser tool can open the page, either at a localhost URL that is already running or as a file. Start Impeccable's live-server with \`live-server \--background\` and stop it with \`live-server stop \--keep-inject\` before you write the report (plain \`stop\` can try to edit index.html). If the browser cannot open the page, skip the overlay and report the fallback signal as critique.md describes.  
\- Save the snapshot only in Step 4, after the report is written out.  
2c. Read \<SKILL\_DIR\>/reference/audit.md in full. It is the method for Part 2, the design audit. Where it asks for the detector, use Assessment B's findings; do not run detect again.  
STEP 3\. Grade Part 1 once both assessments are done. Read in full: index.html, the footer pages (privacy.html, legal.html, about.html), thank-you.html, PRD.md (Section 2 holds BUSINESS NAME, HEADLINE, SUBHEADLINE, CALL-TO-ACTION, GHL FORM URL, SECTIONS, AVOID, BIGGEST DOUBT, REFERENCES, IMAGES and the rest), AGENTS.md if present, \_headers and .gitignore. List the images/ folder with file sizes. If a references/ folder exists, list it and look at each image; read each REFERENCES line in Section 2.7 (or 2.4 in older PRDs). If a required Section 2 field is blank, say so. If you can open index.html in a browser without installing anything, look at it at 375x667 (phone) and 1440x900 (desktop); otherwise say "Checked from code only" and reason from the code and the detector's measurements. Rows that need numbers (contrast, characters per line, tap targets, overflow, title and description length) report the value and mark it "measured" (browser or detector) or "estimated from code". Then run the design audit for Part 2 with audit.md on the same evidence. Part 2 reports numbers, not impressions: contrast ratios, characters per line, tap target sizes, overflow and file sizes, each marked the same way.  
STEP 4\. Write the report, in this order: the status block below; Part 1; Part 2; Part 3 up to and including "Questions to Consider"; then save the snapshot (Level A only); then the rest of Part 3 and Part 4\. Use EXACTLY the four headings below, in this order.  
Save the snapshot as critique.md's "Persist the Snapshot" steps 1 to 5 describe: write Part 3 from "Design Health Score" through "Questions to Consider" to a temporary file, run critique-storage write index.html with IMPECCABLE\_CRITIQUE\_META, delete the temporary file, run critique-storage trend index.html 5, and print the trend line and the path it wrote. The snapshot is a .md file in .impeccable/critique/, so the PRD's .gitignore (\*.md) keeps it out of the repo.  
Status block:  
Impeccable: \<skill version from the metadata in SKILL\_DIR/SKILL.md\>, installed now | already installed at \<path\> | installed, launcher not run (\<reason\>) | not available (\<reason\>)  
Critique: dual-agent | degraded: single-context (\<reason\>)  
Detector: \<number\> findings | not run  
View: browser at 375x667 and 1440x900 | checked from code only  
\#\# PART 1: PRD COMPLIANCE  
Grade every row of the checklist below against the files (and the browser, if you used one) before you write anything. The condensed output below is not a reason to skip a check.  
\- Result is exactly PASS or FAIL.  
\- Evidence names the element, selector, file or line (quote the short text you checked). Use detector findings as evidence where they exist (for example low-contrast for 8.3 or 8.4); otherwise compute from the code, such as contrast from the hex values.  
\- If you cannot verify a row from the files, mark it FAIL with Evidence "unverified: \<reason\>".  
\- If a row is conditional ("if present", "if used") and the thing is not in the site, mark PASS with Evidence "n/a: not used".  
\- A 4.x row is PASS when Section 2 (including REFERENCES) explicitly asks for that element. Cite the Section 2 line.  
\- Copy checks are word for word against PRD.md Section 2\. Do not accept near matches.  
\- Visual style, fonts, colors, images and animation are the student's choice. Do not FAIL anything for taste. Only the rows below can FAIL. AI-generated images are allowed and need no label.  
Checklist (grade every row; keep the ID as written):  
3.1 Facts only | Page contains only facts from Section 2; no invented testimonials, reviews, customer counts, ratings, statistics, awards, guarantees or partner logos  
3.2 Headline verbatim | HEADLINE appears word for word  
3.3 Subheadline verbatim | SUBHEADLINE appears word for word  
3.4 CTA text verbatim | CALL-TO-ACTION text appears word for word on the buttons  
3.5 One CTA | Only one call-to-action, with identical button text everywhere  
3.6 No new claims | No new facts, features, prices or promises added while tightening headings, transitions or grammar  
3.7 Blank optionals | A blank optional field means that part is left out cleanly  
3.8 No placeholders | No lorem ipsum, TBD, TODO or placeholder text  
3.9 References | Only what REFERENCES asks to carry over is taken; no other brand's logo, name or written copy is reused, and no file from references/ appears on the page or in images/  
3.10 No em dashes | The visible page text contains no em dashes  
3.11 References used | Each REFERENCES item's named element (a layout, color, type, image style, animation or detail) is present on the page; judge whether the element is there, not taste  
4.1 Kickers | No more than 2 uppercase tracked labels (kickers) on the whole page  
4.2 Stat tiles | No big-number stat tiles or hero metric rows; figures sit inside sentences  
4.3 Identical card grids | No grid of identical cards (such as three matching icon cards); side-by-side items differ in size, weight or treatment  
4.4 Heading icons | No decorative icon above every heading  
4.5 Emoji | No emoji in the copy  
4.6 Marquees and carousels | No logo marquees, scrolling tickers or testimonial carousels  
4.7 Popups | No exit-intent or on-load popups (the cookie consent bar is not one)  
4.8 Scroll-jacking | No scroll-jacking  
4.9 Filler copy | No generic filler phrases that could fit any business  
4.10 Stock phrases | No stock phrases ("unlock your potential", "take it to the next level", "join us on our journey", "the best products" and similar)  
4.11 Adjective claims | No claims backed by adjectives instead of evidence  
4.12 Exclamation marks | No exclamation marks in the page text  
4.13 Tacked-on emphasis | No tacked-on emphasis such as "and that is deliberate"  
4.14 Death by PowerPoint | No slide-like sections: at most one section is just a heading and a bullet list, no list longer than 5 items, no paragraph longer than about 4 lines at 375px, and no section except the FAQ and the footer pages with more than about 80 words of body text  
5.1 Section order | Order is header, hero, the SECTIONS in the listed order, sign-up section, footer  
5.2 Header name | Header shows BUSINESS NAME on the left  
5.3 Header button | Header has a button on the right with the CALL-TO-ACTION text that opens GHL FORM URL  
5.4 Sticky header offset | If the header is sticky, every section has enough scroll-margin-top that its heading is never hidden  
5.5 Hero h1 | Hero has HEADLINE as the page's only h1  
5.6 Hero subheadline | SUBHEADLINE sits below the h1  
5.7 Hero button | Hero has a large CALL-TO-ACTION button that opens GHL FORM URL  
5.8 Sections from Section 2 | Chosen sections are built only from Section 2 content  
5.9 FAQ doubt | If an FAQ exists, it includes BIGGEST DOUBT as one of its questions  
5.10 Sign-up id | A section has id="signup"  
5.11 Sign-up copy | Sign-up section has a short heading and one sentence inviting the visitor to take the CALL-TO-ACTION  
5.12 Sign-up button | Sign-up section has a large CALL-TO-ACTION button that opens GHL FORM URL  
5.13 No sign-up form | No sign-up or contact form fields and no form embeds; inputs inside an interactive tool (quiz, calculator, checker) are fine if nothing is submitted or stored  
5.14 Footer name | Footer shows BUSINESS NAME  
5.15 Footer year | Footer shows the current year  
5.16 Footer privacy link | Footer has a "Privacy Policy" link that opens privacy.html  
5.17 Privacy page | privacy.html exists with the site's look, header and footer  
5.18 Legal page | legal.html exists with the site's look, header and footer, linked from the footer as "Legal"  
5.19 About page | about.html exists with the site's look, header and footer, linked from the footer as "About", and is built only from ABOUT, LOCATION and CONTACT EMAIL  
5.20 Footer page header | On every footer page the BUSINESS NAME links back to index.html and the header button opens GHL FORM URL  
5.21 Policy: data collected | Policy says the business collects the name and contact details submitted through the sign-up form  
5.22 Policy: use | Policy says the details are used only to contact the visitor about this offer  
5.23 Policy: cookies | Policy says cookies and the Meta Pixel are used to measure advertising  
5.24 Policy: no sale | Policy says personal information is not sold  
5.25 Policy: deletion | Policy says visitors can ask BUSINESS NAME to delete their information at any time  
5.26 Thank-you page | thank-you.html exists with the site's look, header and footer, and has no call-to-action button  
5.27 Thank-you message | thank-you.html shows a centered message confirming the sign-up and saying BUSINESS NAME will be in touch, with a link back to index.html  
5.28 Thank-you hidden | No other page links to thank-you.html, and it has \<meta name="robots" content="noindex"\>  
5.29 Mobile CTA bar | If a bottom call-to-action bar exists: phones only, appears after the hero, never on thank-you.html  
5.30 Footer contact and settings | The footer on every page shows CONTACT EMAIL as a mailto link and a "Cookie settings" link that reopens the cookie consent bar  
5.31 Legal content | legal.html names BUSINESS NAME, LOCATION and CONTACT EMAIL, says prices and details are confirmed before any purchase, and, if TEXT MESSAGES is yes, gives the text-message terms (what they are about, frequency varies, message and data rates may apply, STOP and HELP, not a condition of buying)  
5.32 Policy: details | privacy.html gives an effective date and CONTACT EMAIL, names Go High Level and Meta, says changes are posted there with a new date, and says how the site responds to Do Not Track  
5.33 Policy: texts | If TEXT MESSAGES is yes, privacy.html says mobile numbers and text-message consent are never shared with or sold to third parties or affiliates for marketing  
5.34 Cookie consent | On a first visit to any page a slim bar shows equally prominent Accept and Decline buttons and a link to privacy.html without covering the page or the hero button; the choice is stored in localStorage under cookie-consent; the bar returns only from "Cookie settings"; no tracking or advertising script runs unless the choice is accepted  
6.1 Pages | index.html plus only the footer pages (privacy.html, legal.html, about.html, and others only if Section 2 asks) and thank-you.html, each with its CSS and JavaScript inside it  
6.2 No frameworks | No frameworks or build tools  
6.3 CDN script tags | Any CDN library loads with a plain script tag  
6.4 Font swap | Web fonts load with font-display: swap  
6.5 Image location | Images are in an images/ folder next to index.html, referenced with relative paths  
6.6 Image size attributes | Every img has width and height attributes  
6.7 No remote images | No img or CSS image points at another website  
6.8 No fake people | Generated images do not pose as real customers, reviews or results  
6.9 Favicon | A favicon is included (inline SVG data URI or file in images/)  
6.10 CTA links | Every call-to-action button is a plain link (a with href) to GHL FORM URL  
6.11 Same tab | CTA links open in the same tab (no target="\_blank")  
6.12 No credentials | No access tokens, API keys or other credentials in index.html  
6.13 Hooks exact | \#signup, privacy.html, thank-you.html, the cookie-consent storage key and the CTA links all exist, exactly named  
6.14 Visible without JS | All text content is visible without JavaScript; controls that need JavaScript, such as an interactive tool or the cookie consent bar, may appear only when it runs  
6.15 Scripts only enhance | Scripts only add scrolling, the cookie consent bar, interactive tools or animation  
6.16 Working links | Every link and button on every page works: it opens a real page, section or URL, or does its action; no dead links, href="\#" or placeholder targets  
7.1 Mobile-first CSS | Base CSS targets phones and larger screens use min-width media queries (no desktop-first max-width overrides)  
7.2 Phone layout | At 320px and up: single column and full-width section buttons (the header button may stay compact)  
7.3 Tablet and laptop | Layout steps up at min-width 768px and 1024px  
7.4 Wide container | At min-width 1440px the content sits in a centered max-width container  
7.5 First screen | At 375x667, HEADLINE and the hero button are visible without scrolling  
7.6 No sideways scroll | No horizontal scrolling at any width from 320px to 1440px  
7.7 Body size | Body text (paragraphs and lists) is at least 17px; small print such as the footer may be smaller  
7.8 Line length | Lines are no longer than about 70 characters  
7.9 Tap targets | Buttons and links are at least 44px tall on touch screens  
8.1 Landmarks | Semantic header, main, section and footer (and nav if there is a menu)  
8.2 Headings | One h1, and headings in order without skipping levels  
8.3 Text contrast | Contrast at least 4.5:1 for body text  
8.4 Large contrast | Contrast at least 3:1 for large text, buttons and icons  
8.5 Focus styles | Visible focus style on every link and button  
8.6 Link text | Link text is descriptive  
8.7 Decorative SVG | Decorative SVGs have aria-hidden="true"  
8.8 Meaningful SVG | Meaningful SVGs have a title element  
8.9 Alt text | Meaningful images have descriptive alt; decorative images have alt=""  
8.10 Text over images | Text over images or video meets the contrast ratios above  
8.11 Reduced motion: scroll | Under prefers-reduced-motion: reduce, smooth scrolling is off  
8.12 Reduced motion: animation | Under prefers-reduced-motion: reduce, all animation is off  
9.1 Lang | lang="en" on the html tag  
9.2 Viewport | A viewport meta tag exists  
9.3 Title length | A title under 60 characters (report the count)  
9.4 Description | A meta description under 155 characters, based on ONE-SENTENCE DESCRIPTION (report the count)  
9.5 og:title | og:title tag exists  
9.6 og:description | og:description tag exists  
10.1 Color tokens | Colors are CSS custom properties in :root and used everywhere (no hard-coded colors outside :root, including rgba() versions of brand colors and colors inside inline SVG; an inline SVG favicon is exempt)  
10.2 Font tokens | Fonts are CSS custom properties in :root and used everywhere  
10.3 Size tokens | Font sizes are CSS custom properties in :root and used everywhere  
10.4 Spacing tokens | Spacing is defined as CSS custom properties in :root and used everywhere  
11.1 No extra pages | No pages or routes beyond index.html, the footer pages and thank-you.html (no links to other local pages)  
11.2 No tracking | No backend, analytics or pixel code  
11.3 No UI kits | No UI kits or component frameworks  
12.1 Doubt answered | BIGGEST DOUBT is answered on the first or second screen  
12.2 Nothing from AVOID | Nothing the AVOID field says the page must not have  
14.1 No secrets | No secret files in the folder (.env, .pem, .key, passwords, tokens)  
14.2 .gitignore | .gitignore exists with the PRD Section 14.1 rules (secrets, \*.md, docs/, notes/, agent folders including .agents/, .codex/ and .grok/, data exports, logs, editor files, node\_modules/)  
14.3 Only site files | Nothing publishable besides index.html, the footer pages, thank-you.html, images/, \_headers and .gitignore (no stray data exports, notes or docs outside the ignore rules)  
14.4 \_headers file | \_headers exists with a /\* rule and all six headers: Content-Security-Policy, X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy (camera, microphone, geolocation, payment, usb off), Cross-Origin-Opener-Policy: same-origin  
14.5 CSP strength | CSP keeps default-src 'self', frame-src 'none', object-src 'none', base-uri 'self', form-action 'none', frame-ancestors 'none' and upgrade-insecure-requests  
14.6 CSP origins match | CSP lists only the origins index.html uses: every external origin used is allowed, and unused ones (such as Google Fonts) are removed  
14.7 No dynamic HTML | Scripts never write URL parameters, hash values or visitor input into the page as HTML; they compare against exact values  
14.8 No eval | No eval and no innerHTML with dynamic data; textContent for any text an interactive tool shows  
14.9 Pinned CDN version | CDN libraries load an exact pinned version (not latest or a range)  
14.10 SRI | CDN libraries have an integrity hash and crossorigin="anonymous"  
14.11 New-tab links | Any link that opens a new tab has rel="noopener noreferrer"  
14.12 No fake trust | No fake trust signals (SSL or security badges, fake QR codes, mock browser or app screens, imitations of other brands)  
14.13 References private | If a references/ folder exists, .gitignore excludes it, and index.html never links to, embeds or loads anything from references/ or from a REFERENCES link  
(The checklist has 124 rows. Count your rows and use that number as N.)  
Write Part 1 in this condensed form, in this order. Do not list the PASS rows one by one.  
1\. The verdict line, exactly like one of these:  
PRD COMPLIANCE: PASS (all N requirements)  
PRD COMPLIANCE: FAIL (X of N failed)  
and, if any failed, the failed IDs on the next line.  
2\. A summary table with one row per PRD section and the columns: PRD section | Rows | Passed | Failed. Group the rows by the number before the dot in their ID: 3 Content, 4 AI-slop tells, 5 Page architecture, 6 Technical, 7 Responsive, 8 Accessibility, 9 SEO, 10 Design tokens, 11 Non-goals, 12 Success criteria, 14 Security. The Rows column must add up to N. In Failed, list the failed IDs or write "none".  
3\. A table of the FAIL rows only, with the columns: ID | Requirement | Evidence. If nothing failed, write "No FAIL rows."  
4\. One line listing the IDs marked "n/a: not used".  
Then add a short list headed "Check yourself (not visible in files)". Do not mark these PASS or FAIL:  
\- GitHub repo settings (PRD Section 15): private from the start, no GitHub Pages, .gitignore committed first, default branch main, limited access, two-factor on, no tokens pasted anywhere.  
\- The host forces HTTPS and sets HSTS.  
\- The GHL form link opens the right form live, and its redirect after submit goes to thank-you.html.  
\- Photos in images/ were exported without location data (EXIF GPS), and no image was copied from another website.  
\- Commit history: no secret or project doc was ever committed, and each commit contained only site files.  
\- If TEXT MESSAGES is yes: the Go High Level form asks for text-message consent, and the texting campaign is registered (A2P 10DLC) with links to privacy.html and legal.html.  
\#\# PART 2: DESIGN AUDIT (IMPECCABLE)  
This is the technical half of the design review. Make it complete: every check, the measurements behind it and every verified issue, organized in one section per dimension.  
At Level A or B, use \<SKILL\_DIR\>/reference/audit.md as the method: its diagnostic scan of five dimensions and their "Check for" lists, its 0 to 4 scoring, its P0 to P3 severities and its NEVER rules (at Level B, use a careful code review wherever it asks for the detector). At Level C, use the AUDIT FALLBACK below for the checks and scores. At every level, write Part 2 in the structure below and apply these PRD adjustments:  
\- The brief: PRD.md Section 2 (including REFERENCES, the screenshots in references/ and IMAGES) is the brief. Following Impeccable's rule that the brief wins, an element the brief explicitly asks for is reported as intentional, not as a tell, and does not lower Implementation Integrity.  
\- Detector: report every detector finding in its matching dimension section, verify each one in context, and call out false positives.  
\- AI-generated images are allowed and are never a finding on their own.  
\- Dark mode is not required. Score Theming on the token system, and check dark mode only if the page declares one.  
\- The PRD has no sign-up forms. Check only the labels and states of inputs inside an interactive tool.  
\- Every finding gets a Fix prompt (one ready-to-paste line for the build conversation that starts with "Follow AGENTS.md.", names the exact element or selector and says to change nothing else) and, at Level A or B, the matching Impeccable command in the exact form the installed audit.md uses, which works in a new conversation now that the skill is installed.  
\- Report every verified issue, including P3 polish, but keep each P3 to one or two lines. Never report an unverified issue.  
\- Name the page section where each issue occurs: header, hero, one of the SECTIONS (by name), sign-up, footer, a footer page (by name), cookie consent bar, thank-you page, sticky bar or whole page.  
\- Visual style is the student's choice. Part 2 shows what a choice costs but never changes Part 1\.  
\- Leave out audit.md's closing message about running commands and re-running the audit; Part 4 replaces it.  
Write Part 2 with these headings, in this order:  
\#\#\# Audit Health Score  
audit.md's table: \# | Dimension | Score | Key Finding, then the total out of 20 and its rating band.  
\#\#\# Implementation Integrity Verdict  
Pass or fail, as audit.md asks, with the verified evidence and the detector count split into true positives, intentional per the brief, and false positives.  
\#\#\# Executive Summary  
Score and band, issue count by P0 to P3, the top 3 to 5 issues, and next steps.  
\#\#\# 1\. Accessibility: \<score\>/4  
\#\#\# 2\. Performance: \<score\>/4  
\#\#\# 3\. Responsive Design: \<score\>/4  
\#\#\# 4\. Theming: \<score\>/4  
\#\#\# 5\. Implementation Integrity: \<score\>/4  
Each dimension section has these parts, in this order:  
\- Why this score: one or two sentences that tie the score to audit.md's scale.  
\- Checks: every item in audit.md's "Check for" list for this dimension (at Level C, the AUDIT FALLBACK list), one line each: the check, then OK, issue or n/a, then the evidence (selector or line, and the measured or computed value).  
\- Measurements: the measurements listed below for this dimension, as tables where they have more than three rows.  
\- Detector findings: every detector finding that belongs to this dimension, with its count, its verdict (true positive, intentional per the brief, or false positive) and the reason you found in context. Write "none" if there are none.  
\- Findings: every verified issue in this dimension, most severe first. For each: ID (ACC-1, PERF-1, RESP-1, THEME-1 or INT-1, numbered within the dimension), severity, page section, location (selector and line), impact, standard (WCAG criterion or PRD row, if any), recommendation, Fix prompt and (at Level A or B) Impeccable command. Write "none" if there are none.  
\- What works: the strengths in this dimension, with evidence.  
Measurements per dimension:  
\- Accessibility: a contrast table with one row per text color and background pair on the page (text color, background, ratio, normal or large text, required ratio, result); the focus ring of each kind of control against the background behind it; the heading outline; the cookie consent bar's label and keyboard access (both buttons reachable in order, the choice taking effect); the interactive tool's labels and live updates; behavior under prefers-reduced-motion.  
\- Performance: the size of index.html and every file in images/; the font families, weights and files loaded; what loads for the first screen; lazy loading below the fold; every animation and transition with the property it animates; the scripts' listeners, observers and forced layouts.  
\- Responsive Design: the layout at 320, 375, 768, 1024 and 1440 pixels wide (columns and any overflow); every tap target under 44px; the longest line in characters at each width; the smallest text size; anything fixed or sticky that covers content; how the interactive tool works at 375\.  
\- Theming: a token inventory (the number of color, font, font-size and spacing tokens); every color, font, size or spacing literal outside :root; every value that would not follow a token change (copied hex or rgba values, colors inside data URIs, theme-color).  
\- Implementation Integrity: the hand scan in AUDIT FALLBACK item 5, one line per item (present or absent, with location); the elements the brief asks for; how specific the copy is to this business.  
\#\#\# Detailed Findings by Severity  
An index of every finding, most severe first, as a table: ID | Severity | Dimension | Page section | Issue. The details stay in the dimension sections; do not repeat them here.  
\#\#\# Patterns & Systemic Issues  
As audit.md asks: recurring problems that point to one root cause, each with the finding IDs it covers.  
\#\#\# Positive Findings  
The strongest practices across the page, to keep in future changes.  
\#\#\# Recommended Actions  
First the Fix prompts to run, listed by finding ID in the order to run them (P0 first; do not repeat their text). Then, at Level A or B, audit.md's numbered command list in priority order, ending with its final polish command.  
AUDIT FALLBACK (Level C: the skill could not be installed; it is the same method, without the detector. The hand scan in item 5 applies at every level.)  
Do a careful code review: read the CSS and JS, compute contrast from the hex values you can see, and say when something is an estimate. Score each dimension 0 to 4:  
1\. Accessibility. Check: contrast below 4.5:1 for text; motion sensitivity (prefers-reduced-motion needs an intentional alternative that keeps state change and hierarchy; flag a global 0.01ms kill that destroys useful feedback, flashing above threshold, and motion that blocks focus, reading or sign-up); missing ARIA (roles, labels or states, such as the cookie consent bar's label and buttons); keyboard navigation (missing focus indicators, illogical tab order, keyboard traps, a cookie consent bar that the keyboard cannot reach); semantic HTML (heading hierarchy, landmarks, divs instead of buttons); alt text; labels on interactive-tool inputs. Score: 0 \= inaccessible (fails WCAG A), 1 \= major gaps, 2 \= partial, 3 \= good (WCAG AA mostly met), 4 \= excellent (WCAG AA fully met, approaches AAA).  
2\. Performance. Check: layout thrashing in scripts; expensive animations (layout-property animation, unbounded blur, filter or shadow effects); images without lazy loading below the fold, oversized images, too many font files or weights; will-change overuse; unnecessary libraries or dead code. Score: 0 \= severe issues, 1 \= major problems, 2 \= partial, 3 \= good, 4 \= excellent.  
3\. Responsive Design. Check: fixed widths that break on mobile; touch targets under 44x44px; broken touch interaction (mouse-only handlers, no touch-action on drag surfaces); horizontal scroll on narrow screens; layouts that break when text size increases; missing breakpoints. Score: 0 \= desktop-only, 1 \= major issues, 2 \= partial, 3 \= good, 4 \= excellent.  
4\. Theming. Check: hard-coded colors not using tokens; inconsistent tokens; values that would not update if a token changed; dark mode only if the page declares one. Score: 0 \= no theming, 1 \= minimal tokens, 2 \= partial, 3 \= good, 4 \= excellent.  
5\. Implementation Integrity. Look for repeated shortcuts, design-system drift, misleading or decorative content, and structure interchangeable with an unrelated product. Scan by hand for: gradient text; glass or blur as decoration; a colored side border wider than 1px on cards or callouts; hard offset shadows; default purple-to-blue gradients; same-size icon cards as the page structure, cards nested in cards; section numbers that carry no information; decorative sparklines or progress rings; monospace as a costume; a system display face as the headline voice; glyphs or emoji standing in for icons; one identical entrance animation on every section; a modal for a task that needs none; unthemed browser defaults (selection, caret, scrollbars, focus rings); controls that do not name their action; copy that could fit any business. Apply the brief rule above. Score: 0 \= systemic drift, 1 \= major repeated failures, 2 \= several verified issues, 3 \= minor isolated issues, 4 \= coherent and intentional.  
Rating bands: 18-20 Excellent, 14-17 Good, 10-13 Acceptable, 6-9 Poor, 0-5 Critical. Severity: P0 blocks reading or sign-up, P1 major or WCAG AA failure, P2 minor, P3 polish. Write the report in the Part 2 structure above. Never report an issue without its impact, never give generic advice, never skip positive findings, never make everything P0, never report an unverified issue.  
\#\# PART 3: DESIGN CRITIQUE (IMPECCABLE)  
The design-director half of the review: Impeccable's full design critique of the page, adjusted to the PRD.  
At Level A or B, follow \<SKILL\_DIR\>/reference/critique.md as run in Step 2: two independent assessments, Nielsen's 10 heuristics scored 0 to 4, the design specificity verdict, priority issues with P0 to P3 severity, persona red flags, cognitive load and emotional journey, and its "Remember" rules. At Level C, use the CRITIQUE FALLBACK below. At every level, write Part 3 with the headings below and apply these PRD adjustments:  
\- No repeats: when an issue is already in Part 2, cite its audit ID (for example ACC-1) instead of repeating its details.  
\- The brief: PRD.md Section 2 (including TARGET AUDIENCE, VIBE, VOICE, REFERENCES, the screenshots in references/ and IMAGES) is the product and design context. Following Impeccable's rule that the brief wins, an element the brief explicitly asks for is intentional, not a tell, and does not count against design specificity.  
\- Mode: this is a landing page (a Persuade surface). Heuristics 7 (Flexibility and Efficiency) and 10 (Help and Documentation) may be scored n/a with a one-line reason, and the total is renormalized to the applicable maximum as critique.md describes.  
\- The PRD has no sign-up forms: visitors sign up on the Go High Level form, which is out of scope. Judge Error Prevention and Error Recovery on the interactive tool (if any), the cookie consent bar, the footer pages and the call-to-action links.  
\- Personas: Jordan, Riley and Casey (critique.md's choice for landing pages), plus one project persona built only from TARGET AUDIENCE and THE PROBLEM YOUR AUDIENCE HAS in Section 2\. Invent nothing beyond them.  
\- Detector: in the Design Specificity Verdict, list every detector finding with its count and location, verify each one in context, and call out false positives.  
\- AI-generated images are allowed and are never a finding on their own.  
\- Every Priority Issue gets a Fix prompt next to critique.md's Suggested command: one ready-to-paste line for the build conversation that starts with "Follow AGENTS.md.", names the exact element or selector and says to change nothing else.  
\- Name the page section of each Priority Issue and Minor Observation: header, hero, one of the SECTIONS (by name), sign-up, footer, a footer page (by name), cookie consent bar, thank-you page, sticky bar or whole page.  
\- Visual style is the student's choice. Part 3 shows what a choice costs but never changes Part 1\.  
\- The grader replaces critique.md's "Ask the User" and "Recommended Actions" with Part 4\. Do not ask questions; end Part 3 with the line "Questions skipped: grader run, Part 4 lists the next prompts." Leave out critique.md's closing message about running commands and re-running the critique.  
Write Part 3 in this order. Its first line is critique.md's provenance line: "Method: dual-agent (A: \<agent-id\> · B: \<agent-id\>)" or the "⚠️ DEGRADED: single-context (\<reason\>)" banner.  
\#\#\# Design Health Score  
critique.md's table: \# | Heuristic | Score | Key Issue, the total over the applicable maximum (/40, or /32 with two n/a) and the rating band.  
\#\#\# Design Specificity Verdict  
critique.md's three parts: LLM assessment, Deterministic scan (with the detector verification above) and Visual overlays (or why there are none).  
\#\#\# Overall Impression  
\#\#\# What's Working  
\#\#\# Priority Issues  
The 3 to 5 most important problems, most important first. For each: \[P0 to P3\] What, page section, Why it matters, Fix, Suggested command, Fix prompt.  
\#\#\# Persona Red Flags  
For each persona, walk the visitor's path from the first screen to the call-to-action and name the exact elements and interactions that fail them.  
\#\#\# Cognitive Load  
critique.md's 8-item checklist, each item passed or failed with evidence, the failure count and its rating, and any decision point with more than 4 visible options.  
\#\#\# Emotional Journey  
The path from the first screen through BIGGEST DOUBT, the interactive tool or other sections, to the sign-up and the thank-you page: peaks, valleys, reassurance at the high-stakes moment, and the peak-end.  
\#\#\# Minor Observations  
One line each, with page section and location.  
\#\#\# Questions to Consider  
Then, at Level A, save the snapshot (Step 4\) and print critique.md's trend line and the path it wrote; at Level B or C print "Trend: not available (\<reason\>)". Then the "Questions skipped" line.  
CRITIQUE FALLBACK (Level C only: the skill could not be installed. A condensed copy of critique.md's method, without the detector, the overlay and the snapshot.)  
Start Part 3 with "⚠️ DEGRADED: single-context (Impeccable not available)", or with "Method: dual-agent (A: \<agent-id\> · B: \<agent-id\>)" if your tool has sub-agents. Run two independent assessments: A, a design review of the page; B, a code-level evidence pass (the hand scan in item 2, contrast computed from the hex values, tap targets and line length, each marked "estimated from code"). A must finish before you read B's results.  
1\. Nielsen's heuristics, each 0 to 4 (0 absent or broken, 1 rare, 2 partial with major gaps, 3 good with minor gaps, 4 genuinely excellent): 1 Visibility of system status (feedback for every action, such as the tool's result and the cookie consent choice); 2 Match with the real world (the audience's words, logical order, no jargon); 3 User control and freedom (closing the panel, Escape, leaving any state); 4 Consistency and standards (the same thing looks and behaves the same everywhere); 5 Error prevention (input constraints and clear labels on the tool); 6 Recognition rather than recall (options visible, icons labeled); 7 Flexibility and efficiency (may be n/a); 8 Aesthetic and minimalist design (only what is needed, clear hierarchy); 9 Error recovery (plain messages that say what to do next); 10 Help and documentation (may be n/a; an FAQ counts). Total over the applicable maximum. Bands by percentage: 90% Excellent, 70% Good, 50% Acceptable, 30% Poor, below 30% Critical. Most real pages score 50% to 80%.  
2\. Design specificity: could an unrelated business use this page unchanged? Use the hand scan in AUDIT FALLBACK item 5 and apply the brief rule above.  
3\. Cognitive load, 8 items: single focus; chunking (4 or fewer items per group); grouping; visual hierarchy; one thing at a time; minimal choices (4 or fewer visible options per decision); working memory; progressive disclosure. 0 to 1 failures is low, 2 to 3 moderate, 4 or more high.  
4\. Emotional journey: the peak-end rule, emotional valleys, and reassurance at high-stakes moments.  
5\. Personas: Jordan, a first-timer who reads everything and takes every label literally; Riley, a stress tester who tries edge cases and checks that the page does what it promises; Casey, a distracted phone user with one thumb and a slow connection; plus the project persona described above.  
Severity: P0 blocking (stops the visitor reading the page or reaching the sign-up), P1 major (significant difficulty or confusion, or a WCAG AA failure), P2 minor (a workaround exists), P3 polish. Be direct and specific: name exact elements, say why each issue matters to visitors, give concrete fixes, and prioritize ruthlessly. Write the report with the Part 3 headings above.  
\#\# PART 4: NEXT PROMPTS  
Give the ready-to-paste fix prompts to run first, numbered in the order to run them: prompts that fix every Part 1 FAIL come first (compliance must pass before anything else; one prompt may fix several rows that share a cause), then the P0 and P1 findings from Parts 2 and 3\. Usually that is 3 to 5 prompts. Each prompt starts with "Follow AGENTS.md.", names the exact element, ID or selector, states the PRD rows or finding IDs it fixes, and says to change nothing else. If Part 1 has no FAIL and there are no P0 or P1 findings, say so and give one optional P2 prompt.  
Finish with: "Run this grader again in a NEW conversation after you apply fixes."  
END GRADER PROMPT  
\---

## **Reading your results**

\- **Status block**: shows how much of Impeccable ran. "launcher not run" means the audit and critique followed Impeccable's method without its detector; "not available" means the built-in methods were used. Fix the reason (usually a blocked command or no internet) and run the grader again for the full review. "Critique: dual-agent" means the two reviews ran independently, as Impeccable intends; "degraded" means your tool has no sub-agents, so one conversation did both.  
\- **Part 1** is pass or fail. It shows one summary row per PRD section and lists only the rows that failed, with the evidence. Every FAIL must be fixed before you publish. The "Check yourself" list is for you to confirm by hand; the grader cannot see those.  
\- **Part 2** is Impeccable's design audit and scores out of 20\. After the score and summary it has one section per dimension (Accessibility, Performance, Responsive Design, Theming, Implementation Integrity), each with every check, the measurements behind it, what the detector found and each issue with its fix prompt. A first build usually lands between 10 and 14\. 14 to 17 is good, 18 to 20 is excellent.  
\- **Part 3** is Impeccable's design critique. It scores your page on Nielsen's 10 usability heuristics, 0 to 4 each. On a landing page two of them may be n/a, so the total can be out of 32 instead of 40; read the band from the percentage: 90% Excellent, 70% Good, 50% Acceptable, 30% Poor. Most real pages land between 50% and 80%. It also says whether the design feels made for your business, lists the 3 to 5 most important issues with fix prompts, walks through the page as three typical visitors plus one from your TARGET AUDIENCE, and checks cognitive load and the emotional journey to the sign-up. Issues the audit already found are referred to by their audit ID, not repeated. Neither review fails you on taste: visual style is your choice, and they only show what that choice costs.  
\- **Trend**: from the second run on, Part 3 shows how your critique score moved across runs. The grader keeps each critique in a \`.impeccable/critique/\` folder in your project; your .gitignore already keeps those files out of the repo.  
\- **Part 4** gives the prompts to paste into your build conversation, in order. Paste one, check the result, then the next.  
\- Scores move a few points per round. If the report says "Checked from code only", layout notes are estimates, but contrast numbers from the detector are measured.  
\---

## **Optional: FIX MODE prompt**

Use this in your build conversation (the one that made the site), right after a grading run. Paste the report's Part 1 FAIL rows and Part 4 below it if the build conversation cannot see them.  
Follow AGENTS.md and PRD.md. Below is a grader report for my index.html. Fix ONLY the Part 1 FAIL rows first, then the P0 and P1 findings from Parts 2 and 3\. Do them one at a time, in order. After each one, re-check PRD.md Section 12 (the integration hooks, CTA links to the GHL form, verbatim headline, subheadline and CTA, no invented claims, no em dashes, no credentials) still holds. Do not touch anything that is not in a FAIL row or a P0 or P1 finding. Do not add images, libraries or new sections. When done, list each change in one line (what, where) and tell me to re-run the grader in a new conversation.  
\---  
*Audit and critique methods from Impeccable by Paul Bakaus (impeccable.style, github.com/pbakaus/impeccable), licensed under Apache-2.0. The grader installs the unmodified skill (version 4.5.0) and adds a PRD compliance checklist and PRD-specific adjustments.*