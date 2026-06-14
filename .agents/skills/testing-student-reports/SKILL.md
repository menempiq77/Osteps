---
name: testing-student-reports
description: Test the Student Reports feature end-to-end (Reports card → filter Subject/Year/Class → student report with charts → teacher report write/persist → print). Use when verifying the /dashboard/reports UI or student report API changes.
---

# Testing Student Reports

Feature: a "Reports" card on `/dashboard/subject-cards` opens `/dashboard/reports`, where you filter by Subject/Year group/Class, pick a student, and see a full inspection-ready report (attendance donut, behaviour pie, academic bar+table, tracker, support/SEN, behaviour history, teacher report editor) with Print/Export to PDF.

## Environment
- Production: https://www.osteps.com (log in as a JESS School Admin; an admin session is usually already active).
- Frontend build dir: `/var/www/osteps/Osteps` on `root@dashboard.osteps.com` (deploy key `~/.ssh/devin_deploy`). PM2 process `osteps` on port 3100.
- Laravel API + DB are on the same VPS — you can query the DB directly to pick a data-rich student and assert real numbers.

## Devin Secrets Needed
- None beyond the existing admin browser session / `~/.ssh/devin_deploy` for deploys. No external API keys.

## Key gotcha: subject-scoping middleware
- `src/middleware.ts` scopes most `/dashboard/*` routes to a subject. A new top-level page like `/dashboard/reports` MUST be added to BOTH `SHARED_PREFIXES` and `SUBJECT_ROUTE_ROOTS`, or the Reports card redirects to the subject dashboard instead of the Reports page (this was bug #221).
- After the fix the URL may still appear as the subject-scoped `/dashboard/s/<id>/reports` — that's expected; it rewrites to the Reports page and renders correctly. Assert on page content, not the URL.

## Pick a data-rich student
Query the DB for a student with assessments + behaviour + attendance so charts are non-empty. Known good demo: **Ziad** (id 75), class **10IsA**, Year 10 (25-26), subject Islamic — 15 attendance rows, ~26 behaviour events, 1+ marked assessment, 1 assigned tracker. A student with no data shows empty states / "not recorded", which is correct but a weak demo.

## Test flow (UI, record it)
1. `/dashboard/subject-cards` → click the **Reports** card. PASS: Reports filter page (hero "Reports", "Student Reports" eyebrow, Subject/Year/Class/Search).
2. Set Subject=Islamic, Year group=Year 10 (25-26), Class=10IsA. PASS: grid of students with initials avatar + name + @username + gender tag.
3. Click the student. PASS: every section populated with REAL data — header + Overall attainment %, 4 KPI tiles, Attendance donut (Present/Absent/Total), Behaviour pie (+/− points), Academic bar+table (marks earned/max + %), Tracker progress, Support/SEN, Behaviour history table. A broken snake_case parser makes Academic/Behaviour/Tracker show empty states, so non-empty charts here = working.
4. Teacher report: "Write report" → set Effort/Conduct/Attainment dropdowns + Strengths/Targets + a unique timestamped comment → Save. Then **hard reload (Ctrl+Shift+R)**. PASS: the saved card persists with exact ratings, text, and author/date. (Persistence is the real test — saving alone isn't enough.)
5. Click **Print / Export PDF**. PASS: print preview shows only report content (OSTEPS header, KPIs, charts) — no dashboard sidebar/topbar/action buttons. Cancel the dialog.

## Tips
- The form dropdowns are Ant Design selects; click to open, then click the option. Effort options: Outstanding/Good/Satisfactory/Needs improvement.
- Attendance is derived from "Attendance Present/Absent" behaviour records (no dedicated attendance module). Don't expect a separate attendance table.
- Leaving a test teacher report on the record is harmless (editable via Edit). Remove via the report API if cleanup is requested.
- Use `annotate_recording` (test_start / assertion with test_result) at each step.
