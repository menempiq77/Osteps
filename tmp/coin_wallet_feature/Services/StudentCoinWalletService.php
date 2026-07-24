<?php

namespace App\Services;

use App\Models\StudentCoinTransaction;
use App\Models\StudentCoinWallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StudentCoinWalletService
{
    private const GAME_PASSES = [
        'neon-tower' => [
            'cost' => 5,
            'duration_seconds' => 7200,
            'description' => 'Neon Tower arcade pass',
        ],
        'brick-breaker' => [
            'cost' => 5,
            'duration_seconds' => 7200,
            'description' => 'Brick Bounce arcade pass',
        ],
        'lost-library' => [
            'cost' => 10,
            'duration_seconds' => null,
            'description' => 'The Lost Scrolls adventure',
        ],
    ];

    public function balanceForStudent(int $studentId): StudentCoinWallet
    {
        return StudentCoinWallet::firstOrCreate(
            ['student_id' => $studentId],
            ['balance' => 0]
        );
    }

    public function awardTopicCompletion(
        int $studentId,
        int $topicId,
        int $amount
    ): StudentCoinWallet {
        if ($amount <= 0) {
            return $this->balanceForStudent($studentId);
        }

        return DB::transaction(function () use ($studentId, $topicId, $amount) {
            $wallet = StudentCoinWallet::where('student_id', $studentId)
                ->lockForUpdate()
                ->first();

            if (!$wallet) {
                $wallet = StudentCoinWallet::create([
                    'student_id' => $studentId,
                    'balance' => 0,
                ]);
            }

            $sourceKey = "topic:{$topicId}";
            $alreadyAwarded = StudentCoinTransaction::where([
                'student_id' => $studentId,
                'source_type' => 'topic_completion',
                'source_key' => $sourceKey,
            ])->exists();

            if ($alreadyAwarded) {
                return $wallet;
            }

            StudentCoinTransaction::create([
                'student_id' => $studentId,
                'amount' => $amount,
                'source_type' => 'topic_completion',
                'source_key' => $sourceKey,
                'description' => "Completed tracker topic {$topicId}",
            ]);

            $wallet->increment('balance', $amount);

            return $wallet->refresh();
        });
    }

    public function purchaseGamePass(
        int $studentId,
        string $gameId,
        string $runId
    ): array {
        $definition = $this->gameDefinition($gameId);
        $purchaseKey = $this->gamePurchaseKey($gameId, $runId);
        $this->balanceForStudent($studentId);

        return DB::transaction(function () use (
            $studentId,
            $gameId,
            $runId,
            $definition,
            $purchaseKey
        ) {
            $wallet = StudentCoinWallet::where('student_id', $studentId)
                ->lockForUpdate()
                ->firstOrFail();
            $transaction = StudentCoinTransaction::where([
                'student_id' => $studentId,
                'source_type' => 'purchase',
                'source_key' => $purchaseKey,
            ])->first();
            $charged = false;

            if (
                $transaction &&
                (int) $transaction->amount !== -$definition['cost']
            ) {
                throw ValidationException::withMessages([
                    'game_id' => ['The existing purchase does not match this game price.'],
                ]);
            }

            if (!$transaction) {
                if ($wallet->balance < $definition['cost']) {
                    throw ValidationException::withMessages([
                        'amount' => ['Not enough coins in this pocket.'],
                    ]);
                }

                $transaction = StudentCoinTransaction::create([
                    'student_id' => $studentId,
                    'amount' => -$definition['cost'],
                    'source_type' => 'purchase',
                    'source_key' => $purchaseKey,
                    'description' => $definition['description'],
                ]);
                $wallet->decrement('balance', $definition['cost']);
                $charged = true;
            }

            return $this->gamePassResult(
                $wallet->refresh(),
                $transaction,
                $gameId,
                $runId,
                $definition,
                $charged
            );
        });
    }

    public function gamePassStatus(
        int $studentId,
        string $gameId,
        string $runId
    ): array {
        $definition = $this->gameDefinition($gameId);
        $wallet = $this->balanceForStudent($studentId);
        $transaction = StudentCoinTransaction::where([
            'student_id' => $studentId,
            'source_type' => 'purchase',
            'source_key' => $this->gamePurchaseKey($gameId, $runId),
        ])->first();

        return $this->gamePassResult(
            $wallet,
            $transaction,
            $gameId,
            $runId,
            $definition,
            false
        );
    }

    public function adhkarRewardsForToday(int $studentId): array
    {
        $wallet = $this->balanceForStudent($studentId);
        $rewardDate = now()->toDateString();
        $transactions = StudentCoinTransaction::where([
            'student_id' => $studentId,
            'source_type' => 'adhkar_reward',
        ])
            ->where('source_key', 'like', "adhkar:%:{$rewardDate}")
            ->pluck('source_key');
        $duaPrefix = 'adhkar:dua:';
        $duaSuffix = ":{$rewardDate}";

        return [
            'wallet' => $wallet,
            'reward_date' => $rewardDate,
            'morning_claimed' => $transactions->contains(
                "adhkar:morning:{$rewardDate}"
            ),
            'evening_claimed' => $transactions->contains(
                "adhkar:evening:{$rewardDate}"
            ),
            'dua_ids' => $transactions
                ->filter(fn ($key) => str_starts_with($key, $duaPrefix))
                ->map(fn ($key) => substr(
                    $key,
                    strlen($duaPrefix),
                    -strlen($duaSuffix)
                ))
                ->values()
                ->all(),
        ];
    }

    public function awardAdhkarReward(
        int $studentId,
        string $rewardType,
        ?string $adhkarId
    ): array {
        [$amount, $sourceKey, $description] = $this->adhkarRewardDefinition(
            $rewardType,
            $adhkarId
        );
        $this->balanceForStudent($studentId);
        $awarded = DB::transaction(function () use (
            $studentId,
            $amount,
            $sourceKey,
            $description
        ) {
            $wallet = StudentCoinWallet::where('student_id', $studentId)
                ->lockForUpdate()
                ->firstOrFail();
            $alreadyAwarded = StudentCoinTransaction::where([
                'student_id' => $studentId,
                'source_type' => 'adhkar_reward',
                'source_key' => $sourceKey,
            ])->exists();

            if ($alreadyAwarded) {
                return false;
            }

            StudentCoinTransaction::create([
                'student_id' => $studentId,
                'amount' => $amount,
                'source_type' => 'adhkar_reward',
                'source_key' => $sourceKey,
                'description' => $description,
            ]);
            $wallet->increment('balance', $amount);

            return true;
        });
        $status = $this->adhkarRewardsForToday($studentId);

        return [
            ...$status,
            'reward_type' => $rewardType,
            'adhkar_id' => $adhkarId,
            'reward_amount' => $amount,
            'awarded' => $awarded,
        ];
    }

    public function spend(
        int $studentId,
        int $amount,
        string $purchaseKey,
        ?string $description = null
    ): StudentCoinWallet {
        return DB::transaction(function () use (
            $studentId,
            $amount,
            $purchaseKey,
            $description
        ) {
            $wallet = StudentCoinWallet::where('student_id', $studentId)
                ->lockForUpdate()
                ->first();

            if (!$wallet) {
                $wallet = StudentCoinWallet::create([
                    'student_id' => $studentId,
                    'balance' => 0,
                ]);
            }

            $alreadySpent = StudentCoinTransaction::where([
                'student_id' => $studentId,
                'source_type' => 'purchase',
                'source_key' => $purchaseKey,
            ])->exists();

            if ($alreadySpent) {
                return $wallet;
            }

            if ($wallet->balance < $amount) {
                throw ValidationException::withMessages([
                    'amount' => ['Not enough coins in this pocket.'],
                ]);
            }

            StudentCoinTransaction::create([
                'student_id' => $studentId,
                'amount' => -$amount,
                'source_type' => 'purchase',
                'source_key' => $purchaseKey,
                'description' => $description,
            ]);

            $wallet->decrement('balance', $amount);

            return $wallet->refresh();
        });
    }

    private function gameDefinition(string $gameId): array
    {
        $definition = self::GAME_PASSES[$gameId] ?? null;
        if (!$definition || $definition['cost'] <= 0) {
            throw ValidationException::withMessages([
                'game_id' => ['This game does not have a valid paid entry.'],
            ]);
        }

        return $definition;
    }

    private function gamePurchaseKey(string $gameId, string $runId): string
    {
        if ($gameId === 'lost-library') {
            return "game:stories-of-the-prophets:nuh-timeline-gallery:{$runId}";
        }

        return "game:{$gameId}:pass:{$runId}";
    }

    private function gamePassResult(
        StudentCoinWallet $wallet,
        ?StudentCoinTransaction $transaction,
        string $gameId,
        string $runId,
        array $definition,
        bool $charged
    ): array {
        $expiresAt = null;
        if ($transaction && $definition['duration_seconds'] !== null) {
            $expiresAt = $transaction->created_at
                ->copy()
                ->addSeconds($definition['duration_seconds']);
        }
        $validPurchase = $transaction &&
            (int) $transaction->amount === -$definition['cost'];

        return [
            'wallet' => $wallet,
            'game_id' => $gameId,
            'run_id' => $runId,
            'entry_cost' => $definition['cost'],
            'active' => (bool) $validPurchase &&
                (!$expiresAt || $expiresAt->isFuture()),
            'charged' => $charged,
            'expires_at' => $expiresAt
                ? $expiresAt->getTimestamp() * 1000
                : null,
        ];
    }

    private function adhkarRewardDefinition(
        string $rewardType,
        ?string $adhkarId
    ): array {
        $rewardDate = now()->toDateString();
        if ($rewardType === 'morning' || $rewardType === 'evening') {
            return [
                10,
                "adhkar:{$rewardType}:{$rewardDate}",
                ucfirst($rewardType) . ' Adhkar completed',
            ];
        }

        $validDua = $rewardType === 'dua' &&
            preg_match('/^hisn-(\d{1,3})$/', (string) $adhkarId, $matches) === 1;
        $number = $validDua ? (int) $matches[1] : 0;
        if ($number < 1 || $number > 267 || ($number >= 75 && $number <= 98)) {
            throw ValidationException::withMessages([
                'adhkar_id' => ['This invocation is not eligible for a coin reward.'],
            ]);
        }

        return [
            1,
            "adhkar:dua:{$adhkarId}:{$rewardDate}",
            "Adhkar invocation {$adhkarId} completed",
        ];
    }
}
