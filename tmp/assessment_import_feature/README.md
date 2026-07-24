# Archived subject content import backend patch

This patch adds three School Admin-only, transactional endpoints:

```text
POST /api/import-archived-assessments
POST /api/import-archived-quizzes
POST /api/import-archived-trackers
```

Each endpoint validates that the source subject is archived and the target is
active before copying selected content directly into the target subject.

- Assessments include ordinary tasks, task files, quiz tasks, questions, and
  options.
- Standalone quizzes include every question and option.
- Trackers include their progress statuses, topics, and topic quizzes.

Imports do not copy class or term assignments, student submissions, quiz
answers, marks, tracker progress, point claims, or certificates.

Each request includes a `request_token`. The database records the completed
response under that token, so a retry returns the same imported IDs without
creating duplicates.

## Apply to the Laravel checkout

Review the checkout before applying these files; do not overwrite unrelated
production changes.

```bash
BACKEND=/path/to/laravel
FEATURE=/path/to/Osteps/tmp/assessment_import_feature

install -D "$FEATURE/2026_07_23_000001_create_assessment_import_requests_table.php" \
  "$BACKEND/database/migrations/2026_07_23_000001_create_assessment_import_requests_table.php"
install -D "$FEATURE/2026_07_24_000002_create_content_import_requests_table.php" \
  "$BACKEND/database/migrations/2026_07_24_000002_create_content_import_requests_table.php"
install -D "$FEATURE/Controllers/ArchivedAssessmentImportController.php" \
  "$BACKEND/app/Http/Controllers/Api/ArchivedAssessmentImportController.php"
```

Apply the authenticated route patch, then run:

```bash
patch --dry-run --ignore-whitespace -d "$BACKEND" -p1 \
  < "$FEATURE/patches/routes-api.patch"
patch --forward --ignore-whitespace -d "$BACKEND" -p1 \
  < "$FEATURE/patches/routes-api.patch"

php "$BACKEND/artisan" migrate --force
php "$BACKEND/artisan" route:list --path=import-archived
```

Before enabling the frontend, verify that a failed request leaves no new
assessment, task, quiz, question, option, tracker, topic, assignment,
submission, answer, mark, progress, point-claim, or certificate rows.
