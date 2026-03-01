# Subject Workspace Backend Deployment Steps

This package adds the critical backend pieces for subject workspaces.

## 1) Copy files to backend Laravel repo

- Migrations:
  - `2026_03_01_000001_create_subject_classes_table.php`
  - `2026_03_01_000002_create_student_subject_enrollments_table.php`
  - `2026_03_01_000003_create_user_subject_assignments_table.php`
  - `2026_03_01_000004_create_user_subject_class_assignments_table.php`
  - `2026_03_01_000005_create_user_subject_preferences_table.php`
  - `2026_03_01_000006_add_subject_id_to_core_tables.php`
  - `2026_03_01_000007_map_legacy_records_to_islamiat_subject.php`
- Controllers:
  - `SubjectContextController.php`
  - `SubjectClassController.php`
- Routes update:
  - merge updates from `tmp/api.php`

## 2) Run migrations

```bash
php artisan migrate
```

## 3) Validate new endpoints

- `GET /subjects/my-context`
- `POST /subjects/set-last`
- `POST /subjects/assign-staff`
- `GET /subjects/staff-assignments`
- `GET /subject-classes`
- `POST /subject-classes`
- `POST /subject-classes/enroll-students`

## 4) Required follow-up

These files are the critical foundation only. You still need to update existing controllers
(Quiz, Tracker, Assessment, Report, Leaderboard, StudentBehaviour) so they enforce `subject_id`
strictly and return 403 for unauthorized subject access.
