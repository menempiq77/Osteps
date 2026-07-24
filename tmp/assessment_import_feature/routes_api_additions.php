<?php

use App\Http\Controllers\Api\ArchivedAssessmentImportController;

Route::post('import-archived-assessments', [ArchivedAssessmentImportController::class, 'store'])
    ->name('import-archived-assessments');
Route::post('import-archived-quizzes', [ArchivedAssessmentImportController::class, 'storeQuizzes'])
    ->name('import-archived-quizzes');
Route::post('import-archived-trackers', [ArchivedAssessmentImportController::class, 'storeTrackers'])
    ->name('import-archived-trackers');
