<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_coin_wallets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->cascadeOnDelete();
            $table->unsignedBigInteger('balance')->default(0);
            $table->timestamps();
        });

        Schema::create('student_coin_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->bigInteger('amount');
            $table->string('source_type', 32);
            $table->string('source_key', 128);
            $table->string('description')->nullable();
            $table->timestamps();

            $table->unique(
                ['student_id', 'source_type', 'source_key'],
                'student_coin_transactions_source_unique'
            );
        });

        DB::table('students')
            ->select('id')
            ->orderBy('id')
            ->chunkById(500, function ($students) {
                $now = now();
                DB::table('student_coin_wallets')->insertOrIgnore(
                    $students->map(fn ($student) => [
                        'student_id' => $student->id,
                        'balance' => 0,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ])->all()
                );
            });

        DB::table('student_topic_marks')
            ->select('student_id', DB::raw('COALESCE(ROUND(SUM(marks)), 0) as earned_coins'))
            ->groupBy('student_id')
            ->orderBy('student_id')
            ->chunk(500, function ($balances) {
                foreach ($balances as $balance) {
                    DB::table('student_coin_wallets')
                        ->where('student_id', $balance->student_id)
                        ->update([
                            'balance' => max(0, (int) $balance->earned_coins),
                            'updated_at' => now(),
                        ]);
                }
            });

        DB::table('student_topic_marks')
            ->select('id', 'student_id', 'topic_id', 'marks')
            ->orderBy('id')
            ->chunkById(500, function ($marks) {
                $now = now();
                DB::table('student_coin_transactions')->insertOrIgnore(
                    $marks->map(fn ($mark) => [
                        'student_id' => $mark->student_id,
                        'amount' => max(0, (int) round((float) $mark->marks)),
                        'source_type' => 'topic_completion',
                        'source_key' => "topic:{$mark->topic_id}",
                        'description' => "Completed tracker topic {$mark->topic_id}",
                        'created_at' => $now,
                        'updated_at' => $now,
                    ])->all()
                );
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_coin_transactions');
        Schema::dropIfExists('student_coin_wallets');
    }
};
