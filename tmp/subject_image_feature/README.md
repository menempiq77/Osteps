# Subject-specific dashboard images

This backend patch stores an optional `dashboard_image_url` on each subject.
New subjects default to no image, and editing one subject never changes another.

## Apply to a Laravel checkout

Review each dry run before applying the patches.

```bash
BACKEND=/path/to/laravel
FEATURE=/path/to/Osteps/tmp/subject_image_feature

install -D "$FEATURE/2026_07_24_000001_add_dashboard_image_url_to_subjects_table.php" \
  "$BACKEND/database/migrations/2026_07_24_000001_add_dashboard_image_url_to_subjects_table.php"

for patch_file in \
  SubjectController.patch \
  SubjectRequest.patch \
  Subject.patch \
  SubjectContextController.patch \
  SubjectResource.patch
do
  patch --dry-run --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/$patch_file"
done

for patch_file in \
  SubjectController.patch \
  SubjectRequest.patch \
  Subject.patch \
  SubjectContextController.patch \
  SubjectResource.patch
do
  patch --forward --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/$patch_file"
done

php "$BACKEND/artisan" migrate --force
php "$BACKEND/artisan" optimize:clear
```

Existing subjects remain blank until an image is explicitly assigned. If a
legacy shared image must be retained for one subject, update only that subject's
`dashboard_image_url` after the migration.
