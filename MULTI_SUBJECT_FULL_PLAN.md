# Multi-Subject Workspace Full Plan (Agreed)

## 1) Product Goal
Build a multi-subject school workspace where:
- `SCHOOL_ADMIN` sees all subjects and can manage assignments across the school.
- `HOD` sees the same structure but only for assigned subjects/classes, and only teachers in that scope (view/monitor only).
- `TEACHER` sees only assigned subjects/classes and can work with their students in that scope.
- `STUDENT` sees only assigned subjects/classes; can be enrolled in multiple subjects and multiple classes.

## 2) Navigation Model
- Subject Cards is the entry for academic roles (`SCHOOL_ADMIN`, `HOD`, `TEACHER`, `STUDENT`).
- Each card opens the subject workspace (`/dashboard/s/{subjectId}`), where dashboard/classes/etc are subject-scoped.
- Shared management pages remain outside subject URL wrapping and are assignment-filtered by role.

## 3) Shared vs Subject-Scoped Areas
### Shared shell pages (outside subject URL wrapping)
- Students
- Teachers
- Library
- Timetable
- Announcements
- Tools
- Reports index and behavior board (with subject filter)

### Subject workspace pages (inside selected subject)
- Subject dashboard metrics
- Subject classes and related learning flows
- Subject-specific activity/feed/assessments/trackers (via scoped APIs)

## 4) Privacy / Authorization Rules
- Every read/write is limited by subject/class assignment.
- Cross-subject and cross-class access must be denied.
- Students can only see their own behavior/report details.

## 5) Behavior Permissions (Agreed)
- `SCHOOL_ADMIN`: view/add/edit/delete behavior for all students across all subjects.
- `HOD`/`TEACHER`: view behavior in assigned scope; add/edit/delete behavior only in assigned subject/class scope.
- `STUDENT`: view only own behavior.
- Behavior page must support filters: `All Subjects` + per-subject.

## 6) Report Visibility (Agreed)
- Reports must be comprehensive.
- `SCHOOL_ADMIN`: can view comprehensive reports for all students.
- `HOD`/`TEACHER`: can view comprehensive reports only in assigned scope.
- `STUDENT`: can view only own comprehensive report.
- Student report details are read-only (no mark editing by student).

## 7) Comprehensive Report Contract (Implementation Contract)
Request input:
- `student_id`
- `subject_id` (`all` or specific)
- optional `class_id`, `date_from`, `date_to`, `term_id`

Response sections:
- `student_profile`
- `filter_context`
- `attendance_summary`
- `behavior_summary`
- `academic_summary`
- `comments_summary`
- `subject_breakdown`
- `timeline`

Rules:
- Percentages rounded consistently.
- Aggregation only over authorized records.
- `403` for out-of-scope access.
- Empty arrays for valid-scope/no-data cases.

Exact section definitions:
- Attendance: KPI cards, monthly trend, subject comparison.
- Behavior: KPI cards, category totals, behavior trend, latest events.
- Grades: overall average, completion, missing work, assessments, tasks, by-subject summary.
- Comments: latest visible staff comments with visibility filtering.
- Subject breakdown: one row per authorized subject with attendance, behavior, academics, and classes.

Reference:
- See `COMPREHENSIVE_REPORT_SPEC.md` for the implementation-ready field and UI contract.

## 8) Data Model Requirements
- `subjects`
- `subject_classes`
- `student_subject_enrollments`
- `user_subject_assignments`
- `user_subject_class_assignments`
- `subject_id` attached to core academic/behavior/report records

## 9) Rollout Strategy
1. Enable behind feature flag.
2. Migrate legacy single-subject data to default subject.
3. Backfill assignments/enrollments.
4. Enforce strict subject/class authorization.
5. Verify role matrix and regression test key flows.

## 10) Current Local Implementation Status
Implemented locally:
- Subject cards page + entry redirect.
- Sidebar subject-card navigation for academic roles.
- Shared-path routing guard updates.
- HOD teacher list filtered to assigned subjects (view/monitor behavior).
- Behavior API subject-aware payload/query support.
- Behavior page subject filter (`All Subjects` + per-subject) and scoped mutation guards.
- Reports page subject filtering and student self-only list visibility.
- Report detail page student self-only rows + student mark edit disabled.
- Comprehensive report TypeScript contract and service scaffolding.

Pending backend hardening (API-side policy enforcement) may still be required depending on server implementation.
