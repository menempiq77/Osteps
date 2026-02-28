# Mind-upgrade Deployment Checklist

## 1) Backend file placement (Laravel server)

Copy these files from local `Osteps/tmp` into the Laravel backend project:

- `tmp/MindUpgradeController.php` -> `app/Http/Controllers/Api/MindUpgradeController.php`
- `tmp/2026_02_28_000001_create_mind_upgrade_assignments_table.php` -> `database/migrations/2026_02_28_000001_create_mind_upgrade_assignments_table.php`
- `tmp/2026_02_28_000002_create_mind_upgrade_progress_table.php` -> `database/migrations/2026_02_28_000002_create_mind_upgrade_progress_table.php`
- `tmp/2026_02_28_000003_create_mind_upgrade_student_points_table.php` -> `database/migrations/2026_02_28_000003_create_mind_upgrade_student_points_table.php`

Update backend route file:

- Add `use App\Http\Controllers\Api\MindUpgradeController;`
- Add `mind-upgrade/*` routes exactly as in `tmp/api.php`

Update leaderboard controller on backend:

- Apply the `mind_points` + `tracker_points` join logic from `tmp/LeaderBoardController_FIXED.php`
- Keep returning `total_marks` for frontend compatibility

Update profile/report controllers:

- Add `mind_points` (and optional `tracker_points`/`total_points`) per `tmp/MIND_UPGRADE_PROFILE_REPORT_PATCH_NOTES.md`

## 2) Run backend deployment commands

From Laravel backend root:

```bash
php artisan migrate --force
php artisan route:clear
php artisan config:clear
php artisan cache:clear
php artisan optimize
```

## 3) Frontend deployment

From Next.js project root:

```bash
npm ci
npm run build
# restart your process manager (pm2/systemd/docker)
```

## 4) Required env check

- Frontend `API_BASE_URL` points to the backend where new routes were deployed.
- Auth tokens are valid for ADMIN/HOD/STUDENT role testing.

## 5) Post-deploy smoke test (manual)

1. Login as `SCHOOL_ADMIN` or `HOD`.
2. Open `/dashboard/mind-upgrade`, confirm `Assign Courses` button exists.
3. Assign `aqeedah` to one class with active window.
4. Assign `aqeedah` to one or more specific students (new option in drawer).
5. Login as student in that class:
   - Mind-upgrade item is visible in sidebar.
   - `aqeedah` unlocked only if class-assigned or directly student-assigned.
6. Complete quiz/minigame:
   - Confirm backend records in `mind_upgrade_progress`.
   - Confirm aggregate in `mind_upgrade_student_points`.
7. Open leaderboard:
   - `total_marks` includes mind points.
8. Open student profile/reports:
   - `mind_points` appears as separate metric.

## 6) Quick rollback plan

If release must be rolled back quickly:

1. Revert backend route/controller changes.
2. Keep DB tables (safe) or rollback last migrations if required:

```bash
php artisan migrate:rollback --step=3
```

3. Redeploy previous frontend build.
