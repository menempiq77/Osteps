<?php

use App\Http\Controllers\Api\StudentCoinWalletController;

Route::get('student-wallet/balance', [StudentCoinWalletController::class, 'balance'])
    ->name('student-wallet-balance');
Route::post('student-wallet/spend', [StudentCoinWalletController::class, 'spend'])
    ->name('student-wallet-spend');
Route::post('student-wallet/game-pass', [StudentCoinWalletController::class, 'purchaseGamePass'])
    ->name('student-wallet-game-pass');
Route::post('student-wallet/game-pass/status', [StudentCoinWalletController::class, 'gamePassStatus'])
    ->name('student-wallet-game-pass-status');
Route::get('student-wallet/adhkar-rewards', [StudentCoinWalletController::class, 'adhkarRewards'])
    ->name('student-wallet-adhkar-rewards');
Route::post('student-wallet/adhkar-rewards', [StudentCoinWalletController::class, 'awardAdhkar'])
    ->name('student-wallet-award-adhkar');
Route::get('student-wallet/prayer-rewards', [StudentCoinWalletController::class, 'prayerRewards'])
    ->name('student-wallet-prayer-rewards');
Route::post('student-wallet/prayer-rewards', [StudentCoinWalletController::class, 'awardPrayer'])
    ->name('student-wallet-award-prayer');
Route::get('student-wallet/prayer-history', [StudentCoinWalletController::class, 'prayerHistory'])
    ->name('student-wallet-prayer-history');
