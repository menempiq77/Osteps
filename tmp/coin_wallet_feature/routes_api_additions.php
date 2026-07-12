<?php

use App\Http\Controllers\Api\StudentCoinWalletController;

Route::get('student-wallet/balance', [StudentCoinWalletController::class, 'balance'])
    ->name('student-wallet-balance');
Route::post('student-wallet/spend', [StudentCoinWalletController::class, 'spend'])
    ->name('student-wallet-spend');
