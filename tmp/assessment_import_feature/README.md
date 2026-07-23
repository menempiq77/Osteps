# Archived assessment import backend patch

This patch adds one School Admin-only, transactional endpoint:

```text
POST /api/import-archived-assessments
```

The endpoint validates that the source subject is archived and the target is
active, then copies the selected assessments directly into the target subject.
It deep-copies ordinary tasks, task files, quiz tasks, quiz questions, and quiz
options. It does not copy assessment assignments, student task submissions,
quiz submissions, answers, or marks.

Each request includes a `request_token`. The database records the completed
response under that token, so a retry returns the same imported assessment IDs
without creating duplicates.

## Apply to the Laravel checkout

Review the checkout before applying these files; do not overwrite unrelated
production changes.

```bash
BACKEND=/path/to/laravel
FEATURE=/path/to/Osteps/tmp/assessment_import_feature

install -D "$FEATURE/2026_07_23_000001_create_assessment_import_requests_table.php" \
  "$BACKEND/database/migrations/2026_07_23_000001_create_assessment_import_requests_table.php"
install -D "$FEATURE/Controllers/ArchivedAssessmentImportController.php" \
  "$BACKEND/app/Http/Controllers/Api/ArchivedAssessmentImportController.php"
```

Merge the controller import and route from `routes_api_additions.php` into
`routes/api.php`, then run:

```bash
php "$BACKEND/artisan" migrate --force
php "$BACKEND/artisan" route:list --path=import-archived-assessments
```

Before enabling the frontend, verify that a failed request leaves no new
assessment, task, quiz, question, option, assignment, submission, answer, or
mark rows.
