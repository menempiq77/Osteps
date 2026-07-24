# Student coin wallet backend patch

This patch separates:

- `total_marks` / `tracker_points`: permanent leaderboard scoring.
- `coin_balance`: spendable wallet balance.

Topic completion keeps writing `student_topic_marks` and awards the same amount
to the wallet once. Purchases only deduct from `student_coin_wallets`.

## API contract

Leaderboard rows add:

```json
{
  "total_marks": 120,
  "tracker_points": 100,
  "mind_points": 20,
  "coin_balance": 65
}
```

Student wallet endpoints:

```text
GET  /api/student-wallet/balance
POST /api/student-wallet/spend
POST /api/student-wallet/game-pass
POST /api/student-wallet/game-pass/status
GET  /api/student-wallet/adhkar-rewards
POST /api/student-wallet/adhkar-rewards
```

Spend request:

```json
{
  "amount": 15,
  "purchase_key": "game:memory-match:unlock:student-211",
  "description": "Unlock Memory Match"
}
```

`purchase_key` is idempotent per student. Retrying the same purchase does not
deduct coins twice.

Game entry uses the server-owned price catalogue rather than accepting an
amount from the browser:

```json
{
  "game_id": "neon-tower",
  "run_id": "7a323f50-b4b4-4c7d-b39e-11d4ca63fef8"
}
```

The available student games have positive server-enforced prices:

- `neon-tower`: 5 coins for two hours.
- `brick-breaker`: 5 coins for two hours.
- `lost-library`: 10 coins for the saved adventure.

Saved student runs must pass `/game-pass/status` before gameplay is restored.
Changing browser storage cannot create a paid pass.

Adhkar rewards are server-dated and idempotent:

- Morning collection: 10 coins once per student/day.
- Evening collection: 10 coins once per student/day.
- Other `hisn-1` through `hisn-267` invocations: 1 coin per invocation/day,
  excluding the morning/evening range `hisn-75` through `hisn-98`.

Reward transactions only update `student_coin_wallets`; leaderboard points are
not changed.

## Apply to a Laravel checkout

Review the checkout and patches before applying them. Do not overwrite unrelated
live changes.

If the coin-wallet feature is already installed, keep the existing migration and
models, replace only the service/controller, and add the four game-pass/Adhkar
routes from `routes_api_additions.php`. No new migration is required.

```bash
BACKEND=/path/to/laravel
FEATURE=/path/to/Osteps/tmp/coin_wallet_feature

install -D "$FEATURE/2026_07_11_000001_create_student_coin_wallet_tables.php" \
  "$BACKEND/database/migrations/2026_07_11_000001_create_student_coin_wallet_tables.php"
install -D "$FEATURE/Models/StudentCoinWallet.php" \
  "$BACKEND/app/Models/StudentCoinWallet.php"
install -D "$FEATURE/Models/StudentCoinTransaction.php" \
  "$BACKEND/app/Models/StudentCoinTransaction.php"
install -D "$FEATURE/Services/StudentCoinWalletService.php" \
  "$BACKEND/app/Services/StudentCoinWalletService.php"
install -D "$FEATURE/Controllers/StudentCoinWalletController.php" \
  "$BACKEND/app/Http/Controllers/Api/StudentCoinWalletController.php"

patch --dry-run --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/TopicController.patch"
patch --dry-run --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/LeaderBoardController.patch"
patch --dry-run --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/routes-api.patch"

patch --forward --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/TopicController.patch"
patch --forward --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/LeaderBoardController.patch"
patch --forward --ignore-whitespace -d "$BACKEND" -p1 < "$FEATURE/patches/routes-api.patch"

php "$BACKEND/artisan" migrate --force
php "$BACKEND/artisan" route:list --path=student-wallet
```

The migration initializes each existing wallet from historical tracker marks.
Afterward, spending updates only the wallet and leaves all leaderboard marks
unchanged.
