# Test Plan — Student Reports feature (PR #220)

Tested on production www.osteps.com (logged in as JESS School Admin). Backend already live; frontend deployed (merge `7400888`).

## Demo target (data-rich student, verified in DB)
- Student **Ziad** (id 75), class **10IsA** (class_id 7), Year 10 (25-26), subject **Islamic**.
- DB facts to assert against: 5 assessment-task rows, 26 behaviour events, **15 attendance** records, class has 1 assigned tracker (Ziad has 0 topic marks → tracker shows but 0%).

## UI path (from code)
- subject-cards page has a "Reports" card → `/dashboard/reports` (subject-cards/page.tsx).
- `/dashboard/reports`: Subject select → Year group select → Class select → student grid; each card links to `/dashboard/reports/student/{id}?subject_id=...` (reports/page.tsx:223-231).
- Report page parses snake_case profile payload (reports/student/[studentId]/page.tsx).

---

## Test 1 — Reports card navigates to filter page
1. Go to `/dashboard/subject-cards`.
2. Locate a card titled **"Reports"**; click it.
- **PASS**: URL becomes `/dashboard/reports`; hero shows "Reports" with "Student Reports" eyebrow and Subject/Year group/Class/Search filters.
- **FAIL if**: no Reports card exists, or click 404s.

## Test 2 — Filter chain loads the right students
1. On `/dashboard/reports`, set Subject = **Islamic**.
2. Set Year group = **Year 10 (25-26)**.
3. Set Class = **10IsA**.
- **PASS**: a grid of student cards appears; **Ziad** is present. Cards show initials avatar + name + @username + gender tag.
- **FAIL if**: grid stays empty after class chosen, or shows students from a different class.

## Test 3 — Full report renders with REAL data (core test)
1. Click **Ziad**'s card.
2. Observe the report page sections.
- **PASS (all must hold)**:
  - Header: name "Ziad", @username, gender + nationality tags; "Overall attainment" % shown top-right.
  - 4 KPI tiles: Attendance (a %, not "N/A" — Ziad has 15 attendance rows), Behaviour net (matches positive−|negative| from 26 events), Assessments % (not N/A), Tracker progress.
  - **Attendance** card shows a donut with Present/Absent/Total counts (Total ≈ 15+absent).
  - **Behaviour** card shows a pie (positive vs negative) + numbers; Behaviour history table lists conduct events with dates/points.
  - **Academic** card shows a bar chart + table of assessment(s) with marks `earned/max` and a % tag.
  - **Tracker** card shows the assigned tracker with a progress bar.
  - **Support & wellbeing** shows extra-support Yes/No + details.
- **FAIL if**: any section throws, shows blank where DB has data, Attendance shows "N/A"/"not recorded" (would mean attendance-from-behaviour derivation is broken), or all sections show empty states despite known data.
- Adversarial note: a broken parser (e.g. wrong casing) would make Academic/Behaviour/Tracker show empty states — so non-empty charts here distinguish working vs broken.

## Test 4 — Teacher report write + persist (core test)
1. In "Teacher reports & comments", click **Write report**.
2. Set Effort = "Good", Conduct = "Outstanding", Attainment = "Good"; type Strengths, Targets, and a unique comment e.g. `Devin test report <timestamp>`.
3. Click **Save report**.
4. Hard-reload the page.
- **PASS**: success toast on save; after reload the saved report card appears with the chosen ratings tags + the exact comment text + author/date.
- **FAIL if**: toast shows but report missing after reload (persistence broken), or save errors.
5. Cleanup: after verifying, the test report stays (harmless) OR is removed — note in report. (No delete UI; will leave or remove via API note.)

## Test 5 — Print/Export layout
1. Click **Print / Export PDF** (do not actually print; just open the print preview).
- **PASS**: browser print preview shows ONLY the report content (header, KPIs, charts, sections) — no dashboard sidebar/topbar, no "Back"/"Print" buttons (`.no-print` hidden).
- **FAIL if**: print preview includes the dashboard chrome/sidebar or the action buttons.
- Close the preview (Esc) without printing.

---

## Out of scope / not tested
- Dedicated attendance module (doesn't exist; attendance is derived).
- Multiple subjects/classes variations (one rich path is sufficient).
- Report delete (no UI).
