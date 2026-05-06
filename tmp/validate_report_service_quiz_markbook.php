<?php

require '/var/www/laravel/vendor/autoload.php';

$app = require '/var/www/laravel/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$response = app(\App\Services\ReportService::class)->getWholeAssessmentReport(1);
$data = json_decode($response->getContent(), true);

foreach (($data['data'] ?? []) as $assessment) {
    foreach (($assessment['tasks'] ?? []) as $task) {
        if (($task['task_type'] ?? '') !== 'quiz') {
            continue;
        }

        $submitted = $task['submitted'] ?? [];
        $sampleNames = array_map(
            fn ($row) => $row['student_name'] ?? '',
            array_slice($submitted, 0, 5)
        );

        echo ($assessment['assessment_id'] ?? 'unknown')
            . ' | '
            . ($assessment['assessment_name'] ?? 'Unknown')
            . ' | '
            . ($task['task_name'] ?? 'Quiz')
            . ' | submitted='
            . count($submitted)
            . ' | sample='
            . implode(', ', array_filter($sampleNames))
            . PHP_EOL;
    }
}