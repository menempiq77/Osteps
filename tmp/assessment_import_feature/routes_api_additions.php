<?php

use App\Http\Controllers\Api\ArchivedAssessmentImportController;

Route::post('import-archived-assessments', [ArchivedAssessmentImportController::class, 'store'])
    ->name('import-archived-assessments');
