# Server Changes Summary (Osteps)

Date: 2026-02-08
Server: DigitalOcean droplet (Ubuntu 24.04), Laravel backend at /var/www/laravel

## Marks submission fix (2026-02-09)
Issue: Student tracker marks failed with 500 (count() on null, array-to-string conversion).

### Files changed (backend)
- app/Http/Controllers/Api/TopicController.php

### Changes
- In `addStudentTopicMarks`: avoid `count()`/`pluck()` on a nullable model by logging with safe defaults.
- Coerce `$request->marks` to a scalar before `updateOrCreate` to prevent array-to-string conversion.

### Notes
- No frontend change required after backend fix.
- If error reappears, recheck `addStudentTopicMarks` around the log and `updateOrCreate` block.

## What was fixed
- Library uploads now accept either a file upload or a URL link.
- External links are returned as-is in API responses (not rewritten as local storage URLs).
- Update flow accepts URL links without forcing file uploads.

## Files changed (backend)
### Validation (store/update)
- app/Http/Requests/LibraryRequest/StoreRequest.php
- app/Http/Requests/LibraryRequest/UpdateRequest.php

Rules now accept `file_path` as either an uploaded file or a URL:
- If `file_path` is a file -> `required|file`
- Else -> `required|url`

### Library service (save file or URL)
- app/Services/LibraryService.php

Changes:
- In `add()`: accept uploaded file OR URL, otherwise return 422.
- In `update()`: if file uploaded, replace; if URL provided, store URL.
- In `add200()`: handle file or URL, or leave null.

### API Resource (return correct URL)
- app/Http/Resources/LibraryResource.php

Fix:
- If `file_path` is a full URL, return it as-is.
- Otherwise return `asset('storage/' . $file_path)`.

## Cache clear commands (after changes)
Run in /var/www/laravel:
- php artisan config:clear
- php artisan cache:clear
- php artisan route:clear

## Notes
- If these changes are lost after redeploy, reapply them or commit to the backend repo.
- Backup files created:
  - app/Http/Requests/LibraryRequest/StoreRequest.php.bak
  - app/Http/Requests/LibraryRequest/UpdateRequest.php.bak
  - app/Services/LibraryService.php.bak
