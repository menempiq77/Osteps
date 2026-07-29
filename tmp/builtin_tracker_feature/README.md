# Built-in tracker progress + coin rewards (backend)

Backend support for the built-in "Stories of the Prophets" tracker. Progress and
coin rewards are stored server side so a student cannot award themselves coins
twice for the same prophet, and so the pass mark / reward size are not decided by
the browser.

## Files

| Source (this repo) | Destination (`/var/www/laravel`) |
| --- | --- |
| `2026_07_29_000001_create_student_builtin_tracker_progress_table.php` | `database/migrations/` |
| `Models/StudentBuiltInTrackerProgress.php` | `app/Models/` |
| `Controllers/BuiltInTrackerProgressController.php` | `app/Http/Controllers/Api/` |
| `routes_api_additions.php` | two route lines to add to `routes/api.php` |

Requires the coin wallet tables from `tmp/coin_wallet_feature`
(`student_coin_wallets`, `student_coin_transactions`), which are already live.

## Deploy

```bash
scp <files>                 # to the paths in the table above
php artisan migrate --force
php artisan route:clear && php artisan config:clear && php artisan cache:clear
```

## API

`GET /api/student-wallet/builtin-tracker?tracker_id=stories-of-the-prophets`

```json
{
  "status_code": 200,
  "data": {
    "student_id": 12,
    "coin_balance": 210,
    "tracker_id": "stories-of-the-prophets",
    "pass_mark": 7,
    "reward_amount": 15,
    "lessons": [
      {
        "lesson_id": "nuh",
        "best_score": 9,
        "total_questions": 10,
        "attempts": 2,
        "passed": true,
        "coins_awarded": 15
      }
    ]
  }
}
```

`POST /api/student-wallet/builtin-tracker`

```json
{
  "tracker_id": "stories-of-the-prophets",
  "lesson_id": "nuh",
  "score": 8,
  "total_questions": 10
}
```

Behaviour:

- The attempt is always recorded (`attempts`, `best_score`).
- Coins are credited only when `score >= pass_mark` (7/10) and only the first
  time that prophet is passed — the ledger row
  `builtin_tracker / builtin:<tracker>:<lesson>` makes it idempotent.
- `total_questions` must match the server definition (10) and `score` must be in
  range, otherwise the request is rejected with 422.
- Students may only read/write their own progress; school admins must pass
  `student_id`.
