# Subject Workspace Backend Handoff

The frontend assignment flow is already wired for many students to many subjects. The remaining blocker is the live Laravel backend missing the subject workspace routes and tables.

This workspace does not contain the actual backend repository, so the API could not be enabled from here. The backend reference files already exist under `Osteps/tmp`.

## Fastest path

From this repo, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\prepare_subject_workspace_backend.ps1 -BackendRepoPath C:\path\to\your-laravel-backend
```

That script copies these files into the backend repo:

- `database/migrations/2026_03_01_000001_create_subject_classes_table.php`
- `database/migrations/2026_03_01_000002_create_student_subject_enrollments_table.php`
- `database/migrations/2026_03_01_000003_create_user_subject_assignments_table.php`
- `database/migrations/2026_03_01_000004_create_user_subject_class_assignments_table.php`
- `database/migrations/2026_03_01_000005_create_user_subject_preferences_table.php`
- `database/migrations/2026_03_01_000006_add_subject_id_to_core_tables.php`
- `database/migrations/2026_03_01_000007_map_legacy_records_to_islamiat_subject.php`
- `app/Http/Controllers/Api/SubjectContextController.php`
- `app/Http/Controllers/Api/SubjectClassController.php`

It also generates `subject_workspace_routes.snippet.php` in the backend repo root. Merge that snippet into `routes/api.php`, then run:

```bash
php artisan migrate
```

## Endpoints that must exist after merge

- `GET /subjects/my-context`
- `POST /subjects/set-last`
- `POST /subjects/assign-staff`
- `GET /subjects/staff-assignments`
- `GET /subject-classes`
- `POST /subject-classes`
- `POST /subject-classes/enroll-students`

## Why this matters

Student subject visibility depends on `student_subject_enrollments` joined through `subject_classes`. Without these backend pieces, School Admin can open the assignment drawer in the frontend but the assignment cannot persist.