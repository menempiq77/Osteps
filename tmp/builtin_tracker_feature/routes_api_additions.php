<?php

// Add these two routes inside the authenticated (auth:sanctum) group in
// routes/api.php, next to the existing student-wallet routes.

use App\Http\Controllers\Api\BuiltInTrackerProgressController;

Route::get('student-wallet/builtin-tracker', [BuiltInTrackerProgressController::class, 'show'])
    ->name('student-wallet-builtin-tracker');
Route::post('student-wallet/builtin-tracker', [BuiltInTrackerProgressController::class, 'store'])
    ->name('student-wallet-builtin-tracker-store');
