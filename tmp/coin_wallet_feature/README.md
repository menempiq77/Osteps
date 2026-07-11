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

## Apply to a Laravel checkout

Review the checkout and patches before applying them. Do not overwrite unrelated
live changes.

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

git -C "$BACKEND" apply --check --ignore-space-change "$FEATURE/patches/TopicController.patch"
git -C "$BACKEND" apply --check --ignore-space-change "$FEATURE/patches/LeaderBoardController.patch"
git -C "$BACKEND" apply --check --ignore-space-change "$FEATURE/patches/routes-api.patch"

git -C "$BACKEND" apply --ignore-space-change "$FEATURE/patches/TopicController.patch"
git -C "$BACKEND" apply --ignore-space-change "$FEATURE/patches/LeaderBoardController.patch"
git -C "$BACKEND" apply --ignore-space-change "$FEATURE/patches/routes-api.patch"

php "$BACKEND/artisan" migrate --force
php "$BACKEND/artisan" route:list --path=student-wallet
```

The migration initializes each existing wallet from historical tracker marks.
Afterward, spending updates only the wallet and leaves all leaderboard marks
unchanged.
