# Student Reports feature — plan

## Goal
A "Reports" card on `/dashboard/subject-cards` → opens a Reports area where you filter
**Subject / Year group / Class**, pick a student, and see a full professional, inspection-ready
(KHDA/BSO) report covering everything about the student. Teachers can also write/edit a report.

## What the report shows (and where the data comes from)
All read data reuses existing, proven endpoints (no fragile new aggregation backend):
- **Profile** (name, username, gender, nationality, class, year, subject, SEN/extra-support):
  `GET /get-studentProfile/{id}?subject_id=` (already returns profile + behaviour + trackers + assessments).
- **Assessment results & marks**: from `class.term.assignAssessments...studentAssessmentTasks` in the
  profile payload; grade scale from `GET /get-grades`.
- **Behaviour** (positive/negative points, incidents, history): `student.behaviour[]`.
- **Tracker** progress (topics completed, marks): `student.assignTrackers` / `class.assignTrackers`.
- **Points**: tracker points, mind-upgrade points.
- **Filters / rosters**: `getall-assigned-year-classes` (admin) / `get-assigned-year-classes` (teacher)
  for Year+Class options, `get-student/{classId}` for the class roster.

## New backend (small, contained) — teacher narrative reports
- Table `student_reports`: id, school_id, student_id, subject_id?, term_id?, author info,
  ratings (effort/conduct/attainment), strengths, targets/areas-for-improvement, comment, timestamps.
- `StudentReportController`: index / store / update (auth:sanctum).
- Deployed directly to the live VPS (same server); copies kept in `tmp/reports_feature/`.

## Charts (recharts — already in the repo)
- Overall attainment radial %, assessment scores bar, behaviour positive/negative pie,
  tracker completion progress, performance-over-time line.

## Honest gap: Attendance
There is **no attendance data anywhere** in the system (no attendance table/endpoint). I will show an
Attendance section that clearly states it isn't tracked yet rather than fabricate numbers, and can build
a proper attendance module as a separate feature if you want it.

## Pages
- `/dashboard/reports` — filters + student picker grid.
- `/dashboard/reports/student/[studentId]` — full report + teacher report editor + Print/Export (PDF).
