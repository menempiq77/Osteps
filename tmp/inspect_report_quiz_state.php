<?php

require '/var/www/laravel/vendor/autoload.php';

$app = require '/var/www/laravel/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$adminEmail = 'jess@osteps.com';
$user = \Illuminate\Support\Facades\DB::table('users')
    ->whereRaw('LOWER(email) = ?', [strtolower($adminEmail)])
    ->first();

$schoolId = $user
    ? \Illuminate\Support\Facades\DB::table('schools')
        ->where('user_id', $user->id)
        ->value('id')
    : null;

echo 'ADMIN=' . $adminEmail . PHP_EOL;
echo 'USER_ID=' . ($user->id ?? 'not-found') . PHP_EOL;
echo 'SCHOOL_ID=' . ($schoolId ?? 'not-found') . PHP_EOL . PHP_EOL;

if (!$schoolId) {
    exit(1);
}

$assessments = \App\Models\Assessment::with('terms')
    ->where('school_id', $schoolId)
    ->orderBy('id')
    ->get();

echo "ASSESSMENTS\n";
foreach ($assessments as $assessment) {
    $termIds = $assessment->terms->pluck('id')->implode(',');
    echo $assessment->id . ' | ' . $assessment->name . ' | terms=' . $termIds . PHP_EOL;
}

$termIds = $assessments->pluck('terms')->flatten(1)->pluck('id')->filter()->unique()->values();

echo PHP_EOL . "ASSIGNED QUIZZES\n";
$assignedQuizzes = \App\Models\AssignTermQuiz::with('quiz')
    ->whereIn('term_id', $termIds->all())
    ->orderBy('id')
    ->get();

foreach ($assignedQuizzes as $row) {
    echo $row->id
        . ' | term=' . $row->term_id
        . ' | class=' . ($row->class_id ?? 'null')
        . ' | quiz=' . ($row->quiz_id ?? 'null')
        . ' | type=' . ($row->type ?? 'null')
        . ' | name=' . ($row->quiz->name ?? 'Unknown')
        . PHP_EOL;
}

echo PHP_EOL . "QUIZ SUBMISSIONS\n";
$submissions = \App\Models\StudentSubmittedQuiz::with(['student', 'quiz'])
    ->whereHas('student', function ($query) use ($schoolId) {
        $query->where('school_id', $schoolId);
    })
    ->whereNotNull('assessment_id')
    ->orderBy('id')
    ->get();

foreach ($submissions as $submission) {
    echo $submission->id
        . ' | assessment=' . ($submission->assessment_id ?? 'null')
        . ' | quiz=' . ($submission->quiz_id ?? 'null')
        . ' | student=' . ($submission->student->student_name ?? 'Unknown')
        . ' | teacher_mark=' . ($submission->teacher_assessment_mark ?? 'null')
        . ' | quiz_name=' . ($submission->quiz->name ?? 'Unknown')
        . PHP_EOL;
}