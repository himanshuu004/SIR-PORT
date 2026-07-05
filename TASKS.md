# Purushottam Site — Task Tracker
*Last updated: May 2026*

---

## Pending Tasks

### Awaiting Client Action
- [ ] Dr. Purushottam to complete Google Sheets setup using Claude Wizard
  - Create Google Cloud project + API key
  - Run Apps Script to create 5 workbooks
  - Share all 5 sheets as "Anyone with the link → Viewer"
  - Send API key + Sheet IDs to deepakice@gmail.com
- [ ] Once client sends IDs → update Coolify env vars with client's own keys and redeploy
- [ ] Restrict Google API key in Google Cloud Console — add VPS IP restriction (after client creates their key)

### Phase 6 — Writes to Google Sheets
- [ ] Contact form → append row to **Messages** sheet (GOOGLE_SHEETS_MESSAGES_ID)
- [ ] Newsletter subscribe → append row to **Subscribers** sheet (GOOGLE_SHEETS_SUBSCRIBERS_ID)
  - Note: Writing to sheets requires a Service Account or OAuth — API key is read-only

### Other Backlog
- [ ] Phase 1.3/1.4 — Nav rename: Projects → Proving Ground + 301 redirect
- [ ] Phase 4 — Sacred Texts (Gita + Yoga Sutras)
- [ ] Phase 5 — Late Compiler Syllabus (read from Google Sheets)
- [ ] Phase 8 — SEO (sitemap.xml, robots.txt, RSS feed)
- [ ] Phase 10.3/10.4 — Admin inbox: view Subscribers + Messages inside admin panel

---

## Completed Tasks

### Phase 1 — Core Setup
- [x] SSL fix (ERR_CERT_COMMON_NAME_INVALID) — resolved Nginx/Traefik port conflict
- [x] srilan.org routed through Traefik dynamic config
- [x] Firebase admin panel Save button — fixed (was permanently disabled)
- [x] Google Sheets admin panel buttons — fixed (was permanently disabled)

### Phase 3 — Accountability Tracker
- [x] Built live Accountability Tracker on Proving Ground page
- [x] SVG LineChart (weight trend) + BarChart (running/hiking distance)
- [x] 3 sub-tabs: Weight (coral), Running (blue), Hiking (green)
- [x] Stats tiles + chart + recent entries table
- [x] `/api/progress` route — fetches from Google Sheets
- [x] Graceful fallback when API not configured
- [x] Fixed fallback bug: `fetchAllRows("A:Z")` → `fetchAllRows()` (URL encoding issue)
- [x] Refactored to **separate workbooks architecture** (one Google Sheet file per tracker)
  - Removed all tab-detection logic (`splitTables`, `identifyTable`, `fetchAllRows`)
  - `fetchSheet(sheetId)` fetches A:Z from standalone workbook
  - Env vars: `GOOGLE_SHEETS_WEIGHT_ID`, `GOOGLE_SHEETS_RUNNING_ID`, `GOOGLE_SHEETS_HIKING_ID`
  - Falls back to `site-config.json` values saved via Admin Settings
  - `configured: { weight, running, hiking }` flag for per-tracker empty states
  - Independent `Promise.all` — one missing sheet never breaks the others
- [x] Updated Admin Settings → Google Sheets section
  - 5 separate ID fields (Weight, Running, Hiking, Subscribers, Messages)
  - `extractSheetId()` accepts full URL or bare ID
  - Warning alert to also add IDs as Coolify env vars
- [x] Updated Proving Ground Accountability Tracker UI
  - SummaryCard components (clickable, show key stat)
  - NotConfigured state per tracker
  - Progress bar for weight (% toward goal)
  - Improved LineChart + BarChart with labels

### Google Sheets — Demo Data & Deployment
- [x] Created 5 demo Google Sheet workbooks in Deepak's Drive (for testing)
  - Weight Tracker: `1niz09RgZ14T23j0j4k4sfajNPnRGVyywrxwQU49Q6Kg`
  - Running Tracker: `1FObr5ZJyLVglnMobpTF15vEEm1w2GKc1qmO3v_1Wk1s`
  - Hiking Tracker: `1qIU7gjLsyr-h6ZbiWT6Rrt3S_LJ0EU6_Zwp7yHJc8Rw`
  - Subscribers: `1ec9my2mMv2gqwBPImjUWLOpSVrcomdPshTm2Dfyse-c`
  - Messages: `1YN0Eq0vwBz9-aV_o7CV2juFBkCMWf4pPQosuNYVKBqQ`
- [x] Sheet IDs saved to `site-config.json` via Admin Settings
- [x] All 6 Google Sheets env vars added to Coolify Production Environment Variables
- [x] Git pushed — commit `85fb5bc` (feat: Accountability Tracker with separate workbooks)
- [x] Diagnosed and fixed "No entries yet" root cause — sheets were not shared publicly

### Client Handoff Documents
- [x] `Tasks.md` — project task tracker (this file)
- [x] `Purushottam_Site_UserManual.docx` — Word doc manual (on Desktop)
  - 10 sections + Appendix A (Apps Script code)
  - Clearly states current data is from Deepak's demo Drive
  - Troubleshooting table, contact info, Coolify guide for client
- [x] `Claude_Companion_GoogleSheets_Setup.md` — Claude wizard file (on Desktop)
  - Paste into claude.ai → Claude guides client step by step
  - Covers all edge cases: billing prompt, multiple accounts, unsafe warning, partial failures
  - Complete working Apps Script with error handling
  - Per-sheet sharing checklist, email template to Deepak
- [x] `HOW_TO_USE_CLAUDE_WIZARD.txt` — plain-text instructions (on Desktop)
  - How to open .md file, copy, paste into Claude
  - Keyboard shortcuts explained
  - What to do if stopping midway
