# Comprehensive Student Report Specification

## 1. Purpose
This document defines the exact sections for the multi-subject comprehensive student report so frontend and backend implementation use the same contract.

The report must support these audiences:
- `SCHOOL_ADMIN`: all students across the school.
- `HOD`: only students inside assigned subject/class scope.
- `TEACHER`: only students inside assigned subject/class scope.
- `STUDENT`: only their own report, read-only.

## 2. Filters And Scope
Request input:
- `student_id` (required for staff report lookup and student self-report)
- `subject_id` (`all` or a specific subject id)
- `class_id` (optional)
- `date_from` (optional)
- `date_to` (optional)
- `term_id` (optional)

Rules:
- `subject_id=all` means aggregate only across records the current user is authorized to see.
- `SCHOOL_ADMIN` can request `all` or any subject in the school.
- `HOD` and `TEACHER` can request `all`, but the result must only aggregate their assigned subject/class scope.
- `STUDENT` can request only their own report; any other student id returns `403`.
- A valid in-scope request with no data returns empty arrays and zero totals, not `403`.
- Out-of-scope student, subject, or class access returns `403`.

## 3. Report Layout
The report is composed of these sections, in this order:
1. `student_profile`
2. `filter_context`
3. `attendance_summary`
4. `behavior_summary`
5. `academic_summary`
6. `comments_summary`
7. `subject_breakdown`
8. `timeline`

## 4. Section Definitions

### 4.1 Student Profile
Purpose:
- Identify the student and provide the context for the report.

Required fields:
- `student_id`
- `student_name`
- `admission_no`
- `current_class_id`
- `current_class_name`
- `active_subjects[]`

UI expectations:
- Header card with student name, admission number, current class, and subject chips.
- For staff views, this header stays visible while filters change.

### 4.2 Filter Context
Purpose:
- Echo the effective filters that produced the report.

Required fields:
- `subject_mode` (`all` or `single`)
- `subject_id`
- `class_id`
- `date_from`
- `date_to`
- `term_id`

Rules:
- The backend returns the effective filter values after authorization trimming.
- If `subject_id=all`, `subject_mode` must be `all`.
- If a single subject is applied, `subject_mode` must be `single`.

### 4.3 Attendance Summary
Purpose:
- Show attendance health across the selected scope.

This section must render three blocks:
- Overview KPIs
- Monthly attendance trend
- Subject attendance comparison

Required fields:
- `present_count`
- `absent_count`
- `late_count`
- `excused_count`
- `attendance_percent`
- `monthly[]`
- `by_subject[]`

Exact meaning:
- `attendance_percent` is the overall attendance rate for the filtered scope.
- `monthly[]` contains one row per month in the selected date range with `present`, `absent`, `late`, `excused`, and `percent`.
- `by_subject[]` contains one row per authorized subject in scope with `present`, `absent`, `late`, and `percent`.

UI rules:
- Always show KPI cards first.
- Show `monthly[]` as a trend chart when there is more than one period; otherwise show a single-period summary.
- Hide the subject comparison table only when a single subject is selected and there is no meaningful cross-subject comparison.

### 4.4 Behavior Summary
Purpose:
- Show conduct performance, behavior trend, and recent incidents or positive events.

This section must render four blocks:
- Overview KPIs
- Category totals
- Behavior trend chart
- Latest behavior events

Required fields:
- `positive_points`
- `negative_points`
- `net_points`
- `incident_count`
- `category_totals[]`
- `trend[]`
- `latest_events[]`

Exact meaning:
- `category_totals[]` groups behavior records into stable categories such as positive, negative, punctuality, participation, respect, or another backend-defined taxonomy.
- `trend[]` is the primary behavior trend series and must include `period`, `positive_points`, `negative_points`, and `incidents`.
- `latest_events[]` is a chronological feed of the most recent authorized behavior records, newest first.

UI rules:
- `net_points` is the headline score.
- Show both positive and negative trend lines when data exists.
- Each latest event row must show date, subject, actor, behavior type, points, and note.
- Staff can navigate from an event to the student behavior board if the route is in scope.
- Students can only view their own events and never see cross-student behavior records.

### 4.5 Academic Summary (Grades)
Purpose:
- Represent academic performance using grades, submitted assessments, task completion, and subject-level performance.

This section must render four blocks:
- Overall grade KPIs
- Assessment results table
- Task completion summary
- Subject performance summary

Required fields:
- `overall_average_score`
- `completion_rate`
- `missing_work_count`
- `assessments[]`
- `tasks[]`
- `by_subject[]`

Exact meaning:
- `overall_average_score` is the weighted or agreed system average across authorized assessment records in scope.
- `completion_rate` is the percentage of academic tasks submitted or completed in scope.
- `missing_work_count` is the count of missing tasks in scope.
- `assessments[]` stores individual graded assessment rows with `title`, `subject_id`, `class_id`, `score`, `max_score`, `percent`, `submitted_at`, and `status`.
- `tasks[]` stores task-level completion rows with `title`, `subject_id`, `class_id`, `status`, `due_date`, and `submitted_at`.
- `by_subject[]` stores one performance row per subject with `average_score`, `completion_rate`, and `missing_count`.

UI rules:
- The headline academic card should display average score and derived grade band.
- Grade band can be derived client-side from the school grading table when the backend returns percentages only.
- Assessment rows and task rows must respect the selected date range and term filter.
- Students can view but cannot edit marks from this report.

### 4.6 Comments Summary
Purpose:
- Surface teacher and staff comments that explain the numbers.

This section must render two blocks:
- Comment count and latest activity
- Recent comments list

Required fields:
- `total_comments`
- `latest_comments[]`

Exact meaning:
- `latest_comments[]` is ordered newest first.
- Each comment row includes `body`, `created_at`, `subject_id`, `class_id`, `author_name`, `author_role`, and `visibility`.

Visibility rules:
- Staff can see comments they are authorized to access in their scope.
- Students only see comments marked for student visibility.
- Internal-only comments must never appear in the student view.

UI rules:
- Show the latest 5 to 10 comments in the summary panel.
- If richer comment history is added later, this section remains the summary entry point.

### 4.7 Subject Breakdown
Purpose:
- Provide one compact row per subject so users can compare performance across subjects.

This section must render as a table or stacked cards with one item per subject.

Required fields:
- `subject_id`
- `subject_name`
- `classes[]`
- `attendance_percent`
- `net_behavior_points`
- `average_score`
- `completion_rate`
- `missing_work_count`
- `rank_label`

Exact meaning:
- Each item is one authorized subject visible within the current filter set.
- `classes[]` lists the relevant classes contributing to that subject row.
- `rank_label` is optional and can represent banding such as Strong, Good, Watchlist, or a backend-defined label.

UI rules:
- This section is always visible when more than one subject is in scope.
- In single-subject mode it may collapse into a compact summary card instead of a comparison table.
- Sorting should default to subject name unless product later chooses a performance-first ordering.

### 4.8 Timeline
Purpose:
- Merge major report activity into one chronological feed.

Required fields:
- `event_type`
- `event_id`
- `occurred_at`
- `subject_id`
- `class_id`
- `title`
- `description`
- `actor_name`
- `metadata`

Rules:
- Timeline items can represent attendance milestones, behavior records, assessment submissions, grading actions, and comments.
- Timeline is supplementary; it does not replace the structured sections above.

## 5. Role-Specific Presentation Rules

### Staff (`SCHOOL_ADMIN`, `HOD`, `TEACHER`)
- Can use `All Subjects` plus per-subject filters within authorized scope.
- Can open comprehensive reports for students in scope.
- Can view behavior and report sections for students in scope.
- Behavior editing permissions stay outside the report itself and follow the behavior board authorization rules.

### Student
- Can view only their own report.
- Default report mode can be `All Subjects` when enrolled in multiple subjects.
- All sections are read-only.
- Any internal comment or other-student data must be excluded server-side.

## 6. Empty States And Error Handling
- No attendance data: show zero-state messaging inside attendance cards and charts.
- No behavior data: show zero incidents and an empty latest-events list.
- No grades data: show no assessments yet and zero missing-work unless overdue tasks exist.
- No comments: show `total_comments = 0` and an empty list.
- No multi-subject data: `subject_breakdown` can contain a single subject item or be hidden in the UI if redundant.

## 7. Implementation Notes
- Keep the existing payload shape in `src/types/comprehensiveReport.ts` and `src/types/studentComprehensiveReport.ts` as the base contract.
- Frontend should derive display-only labels such as grade band, risk badge, and empty-state hints without changing backend aggregates.
- Backend aggregation must always happen after authorization filters are applied.
- Date, term, subject, and class filters must affect every section consistently.