Route::middleware('auth:sanctum')->apiResource('quiz-incidents', QuizIncidentController::class)->only(['index','store']);
