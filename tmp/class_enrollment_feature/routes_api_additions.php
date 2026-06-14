<?php
// Appended to routes/api.php (fully-qualified class names so no `use` edits needed).

// ===== Class join codes, enrollment requests & school notifications =====
Route::get('public/class/{code}', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'publicClass']);
Route::post('public/class/{code}/enroll', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'publicEnroll']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('class-enrollments/pending-counts', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'pendingCounts']);
    Route::get('class-enrollments', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'index']);
    Route::post('class-enrollments/{id}/approve', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'approve']);
    Route::post('class-enrollments/{id}', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'update']);
    Route::delete('class-enrollments/{id}', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'destroy']);

    Route::get('school-classes/{id}/join-code', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'joinCode']);
    Route::post('school-classes/{id}/regenerate-join-code', [\App\Http\Controllers\Api\ClassEnrollmentController::class, 'regenerateJoinCode']);

    Route::get('school-notifications/unread-count', [\App\Http\Controllers\Api\SchoolNotificationController::class, 'unreadCount']);
    Route::get('school-notifications', [\App\Http\Controllers\Api\SchoolNotificationController::class, 'index']);
    Route::post('school-notifications/mark-all-read', [\App\Http\Controllers\Api\SchoolNotificationController::class, 'markAllRead']);
    Route::post('school-notifications/{id}/read', [\App\Http\Controllers\Api\SchoolNotificationController::class, 'markRead']);
});
