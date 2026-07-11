<?php

namespace App\Services;

use App\Models\StudentCoinTransaction;
use App\Models\StudentCoinWallet;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StudentCoinWalletService
{
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
}
