<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class ArchivedAssessmentImportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (strtoupper((string) ($user->role ?? '')) !== 'SCHOOL_ADMIN') {
            return response()->json([
                'status_code' => 403,
                'msg' => 'Only School Admin can import archived assessments.',
            ], 403);
        }

        $payload = $request->validate([
            'source_subject_id' => ['required', 'integer', 'different:target_subject_id'],
            'target_subject_id' => ['required', 'integer'],
            'assessment_ids' => ['required', 'array', 'min:1'],
            'assessment_ids.*' => ['required', 'integer', 'distinct'],
            'request_token' => ['required', 'string', 'max:80'],
        ]);

        $schoolId = (int) ($user->school_id ?? optional($user->school)->id ?? 0);
        if ($schoolId <= 0) {
            return response()->json([
                'status_code' => 422,
                'msg' => 'School context is missing for this user.',
            ], 422);
        }

        $sourceSubjectId = (int) $payload['source_subject_id'];
        $targetSubjectId = (int) $payload['target_subject_id'];
        $assessmentIds = collect($payload['assessment_ids'])
            ->map(fn ($id) => (int) $id)
            ->sort()
            ->values()
            ->all();
        $requestToken = trim((string) $payload['request_token']);
        $createdFiles = [];

        try {
            $responsePayload = DB::transaction(function () use (
                $schoolId,
                $sourceSubjectId,
                $targetSubjectId,
                $assessmentIds,
                $requestToken,
                &$createdFiles
            ) {
                $inserted = DB::table('assessment_import_requests')->insertOrIgnore([
                    'school_id' => $schoolId,
                    'request_token' => $requestToken,
                    'source_subject_id' => $sourceSubjectId,
                    'target_subject_id' => $targetSubjectId,
                    'assessment_ids' => json_encode($assessmentIds),
                    'status' => 'processing',
                    'response_json' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $requestRow = DB::table('assessment_import_requests')
                    ->where('school_id', $schoolId)
                    ->where('request_token', $requestToken)
                    ->lockForUpdate()
                    ->first();

                if (!$requestRow) {
                    throw new RuntimeException('The import request could not be initialized.');
                }

                $storedAssessmentIds = collect(
                    json_decode((string) $requestRow->assessment_ids, true) ?: []
                )->map(fn ($id) => (int) $id)->sort()->values()->all();

                if (
                    (int) $requestRow->source_subject_id !== $sourceSubjectId ||
                    (int) $requestRow->target_subject_id !== $targetSubjectId ||
                    $storedAssessmentIds !== $assessmentIds
                ) {
                    throw new RuntimeException('This import request token was already used for different content.');
                }

                if (!$inserted && $requestRow->status === 'completed') {
                    $storedResponse = json_decode((string) $requestRow->response_json, true);
                    if (!is_array($storedResponse)) {
                        throw new RuntimeException('The completed import response is unavailable.');
                    }

                    return $storedResponse;
                }

                if (!$inserted) {
                    throw new RuntimeException('This import request is already in progress.');
                }

                $this->validateSubjects(
                    $schoolId,
                    $sourceSubjectId,
                    $targetSubjectId
                );

                $sourceAssessments = DB::table('assessments')
                    ->where('school_id', $schoolId)
                    ->where('subject_id', $sourceSubjectId)
                    ->where('type', 'assessment')
                    ->whereIn('id', $assessmentIds)
                    ->orderBy('id')
                    ->lockForUpdate()
                    ->get();

                if ($sourceAssessments->count() !== count($assessmentIds)) {
                    throw new RuntimeException('One or more selected assessments are no longer available.');
                }

                $nextPosition = (int) DB::table('assessments')
                    ->where('school_id', $schoolId)
                    ->max('position');
                $importedAssessments = [];

                foreach ($sourceAssessments as $sourceAssessment) {
                    $nextPosition++;
                    $newAssessmentId = DB::table('assessments')->insertGetId([
                        'position' => $nextPosition,
                        'name' => $sourceAssessment->name,
                        'type' => $sourceAssessment->type,
                        'school_id' => $schoolId,
                        'subject_id' => $targetSubjectId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $taskCount = $this->copyTasks(
                        (int) $sourceAssessment->id,
                        $newAssessmentId,
                        $createdFiles
                    );
                    $quizTaskCount = $this->copyQuizTasks(
                        $schoolId,
                        $sourceSubjectId,
                        $targetSubjectId,
                        (int) $sourceAssessment->id,
                        $newAssessmentId
                    );

                    $assignmentCount = DB::table('assign_assessments')
                        ->where('assessment_id', $newAssessmentId)
                        ->count();

                    if ($assignmentCount !== 0) {
                        throw new RuntimeException('An imported assessment unexpectedly contains assignments.');
                    }

                    $importedAssessments[] = [
                        'id' => $newAssessmentId,
                        'source_assessment_id' => (int) $sourceAssessment->id,
                        'subject_id' => $targetSubjectId,
                        'name' => $sourceAssessment->name,
                        'type' => $sourceAssessment->type,
                        'task_count' => $taskCount,
                        'quiz_task_count' => $quizTaskCount,
                        'assignment_count' => 0,
                    ];
                }

                $response = [
                    'status_code' => 200,
                    'msg' => count($importedAssessments) === 1
                        ? '1 assessment imported with all tasks.'
                        : count($importedAssessments) . ' assessments imported with all tasks.',
                    'data' => [
                        'imported_count' => count($importedAssessments),
                        'assessments' => $importedAssessments,
                    ],
                ];

                DB::table('assessment_import_requests')
                    ->where('id', $requestRow->id)
                    ->update([
                        'status' => 'completed',
                        'response_json' => json_encode($response),
                        'updated_at' => now(),
                    ]);

                return $response;
            });

            return response()->json($responsePayload);
        } catch (Throwable $error) {
            foreach ($createdFiles as $createdFile) {
                if (is_file($createdFile)) {
                    @unlink($createdFile);
                }
            }

            if (!$error instanceof RuntimeException) {
                report($error);
            }

            return response()->json([
                'status_code' => 422,
                'msg' => $error instanceof RuntimeException
                    ? $error->getMessage()
                    : 'The assessments could not be imported.',
            ], 422);
        }
    }

    public function storeQuizzes(Request $request): JsonResponse
    {
        return $this->storeArchivedContent($request, 'quiz', 'quiz_ids');
    }

    public function storeTrackers(Request $request): JsonResponse
    {
        return $this->storeArchivedContent($request, 'tracker', 'tracker_ids');
    }

    private function storeArchivedContent(
        Request $request,
        string $contentType,
        string $idsField
    ): JsonResponse {
        $user = $request->user();
        $plural = $contentType === 'quiz' ? 'quizzes' : 'trackers';
        if (strtoupper((string) ($user->role ?? '')) !== 'SCHOOL_ADMIN') {
            return response()->json([
                'status_code' => 403,
                'msg' => 'Only School Admin can import archived ' . $plural . '.',
            ], 403);
        }

        $payload = $request->validate([
            'source_subject_id' => ['required', 'integer', 'different:target_subject_id'],
            'target_subject_id' => ['required', 'integer'],
            $idsField => ['required', 'array', 'min:1'],
            $idsField . '.*' => ['required', 'integer', 'distinct'],
            'request_token' => ['required', 'string', 'max:80'],
        ]);

        $schoolId = (int) ($user->school_id ?? optional($user->school)->id ?? 0);
        if ($schoolId <= 0) {
            return response()->json([
                'status_code' => 422,
                'msg' => 'School context is missing for this user.',
            ], 422);
        }

        $sourceSubjectId = (int) $payload['source_subject_id'];
        $targetSubjectId = (int) $payload['target_subject_id'];
        $contentIds = collect($payload[$idsField])
            ->map(fn ($id) => (int) $id)
            ->sort()
            ->values()
            ->all();
        $requestToken = trim((string) $payload['request_token']);

        try {
            $responsePayload = DB::transaction(function () use (
                $schoolId,
                $sourceSubjectId,
                $targetSubjectId,
                $contentIds,
                $requestToken,
                $contentType
            ) {
                $inserted = DB::table('content_import_requests')->insertOrIgnore([
                    'school_id' => $schoolId,
                    'request_token' => $requestToken,
                    'content_type' => $contentType,
                    'source_subject_id' => $sourceSubjectId,
                    'target_subject_id' => $targetSubjectId,
                    'content_ids' => json_encode($contentIds),
                    'status' => 'processing',
                    'response_json' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $requestRow = DB::table('content_import_requests')
                    ->where('school_id', $schoolId)
                    ->where('request_token', $requestToken)
                    ->lockForUpdate()
                    ->first();

                if (!$requestRow) {
                    throw new RuntimeException('The import request could not be initialized.');
                }

                $storedContentIds = collect(
                    json_decode((string) $requestRow->content_ids, true) ?: []
                )->map(fn ($id) => (int) $id)->sort()->values()->all();

                if (
                    (string) $requestRow->content_type !== $contentType ||
                    (int) $requestRow->source_subject_id !== $sourceSubjectId ||
                    (int) $requestRow->target_subject_id !== $targetSubjectId ||
                    $storedContentIds !== $contentIds
                ) {
                    throw new RuntimeException('This import request token was already used for different content.');
                }

                if (!$inserted && $requestRow->status === 'completed') {
                    $storedResponse = json_decode((string) $requestRow->response_json, true);
                    if (!is_array($storedResponse)) {
                        throw new RuntimeException('The completed import response is unavailable.');
                    }

                    return $storedResponse;
                }

                if (!$inserted) {
                    throw new RuntimeException('This import request is already in progress.');
                }

                $this->validateSubjects(
                    $schoolId,
                    $sourceSubjectId,
                    $targetSubjectId
                );

                $response = $contentType === 'quiz'
                    ? $this->importQuizzes(
                        $schoolId,
                        $sourceSubjectId,
                        $targetSubjectId,
                        $contentIds
                    )
                    : $this->importTrackers(
                        $schoolId,
                        $sourceSubjectId,
                        $targetSubjectId,
                        $contentIds
                    );

                DB::table('content_import_requests')
                    ->where('id', $requestRow->id)
                    ->update([
                        'status' => 'completed',
                        'response_json' => json_encode($response),
                        'updated_at' => now(),
                    ]);

                return $response;
            });

            return response()->json($responsePayload);
        } catch (Throwable $error) {
            if (!$error instanceof RuntimeException) {
                report($error);
            }

            return response()->json([
                'status_code' => 422,
                'msg' => $error instanceof RuntimeException
                    ? $error->getMessage()
                    : 'The archived ' . $plural . ' could not be imported.',
            ], 422);
        }
    }

    private function importQuizzes(
        int $schoolId,
        int $sourceSubjectId,
        int $targetSubjectId,
        array $quizIds
    ): array {
        $sourceQuizzes = DB::table('quizzes')
            ->where('school_id', $schoolId)
            ->where('subject_id', $sourceSubjectId)
            ->whereIn('id', $quizIds)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        if ($sourceQuizzes->count() !== count($quizIds)) {
            throw new RuntimeException('One or more selected quizzes are no longer available.');
        }

        $importedQuizzes = [];
        foreach ($sourceQuizzes as $sourceQuiz) {
            $copiedQuiz = $this->copyQuiz(
                $sourceQuiz,
                $schoolId,
                $targetSubjectId
            );
            $newQuizId = $copiedQuiz['id'];
            $assignmentCount =
                DB::table('assign_task_quizzes')->where('quiz_id', $newQuizId)->count() +
                DB::table('assign_term_quizzes')->where('quiz_id', $newQuizId)->count() +
                DB::table('topics')->where('quiz_id', $newQuizId)->count();
            $submissionCount = DB::table('student_submitted_quizzes')
                ->where('quiz_id', $newQuizId)
                ->count();

            if ($assignmentCount !== 0 || $submissionCount !== 0) {
                throw new RuntimeException('An imported quiz unexpectedly contains historical data.');
            }

            $importedQuizzes[] = [
                'source_quiz_id' => (int) $sourceQuiz->id,
                'imported_quiz_id' => $newQuizId,
                'name' => $sourceQuiz->name,
                'subject_id' => $targetSubjectId,
                'question_count' => $copiedQuiz['question_count'],
                'option_count' => $copiedQuiz['option_count'],
                'assignment_count' => 0,
                'submission_count' => 0,
            ];
        }

        return [
            'status_code' => 200,
            'msg' => count($importedQuizzes) === 1
                ? '1 quiz imported with all questions.'
                : count($importedQuizzes) . ' quizzes imported with all questions.',
            'data' => [
                'imported_count' => count($importedQuizzes),
                'quizzes' => $importedQuizzes,
            ],
        ];
    }

    private function importTrackers(
        int $schoolId,
        int $sourceSubjectId,
        int $targetSubjectId,
        array $trackerIds
    ): array {
        $sourceTrackers = DB::table('trackers')
            ->where('school_id', $schoolId)
            ->where('subject_id', $sourceSubjectId)
            ->whereIn('id', $trackerIds)
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        if ($sourceTrackers->count() !== count($trackerIds)) {
            throw new RuntimeException('One or more selected trackers are no longer available.');
        }

        $nextPosition = (int) DB::table('trackers')
            ->where('school_id', $schoolId)
            ->max('position');
        $importedTrackers = [];

        foreach ($sourceTrackers as $sourceTracker) {
            $nextPosition++;
            $trackerData = (array) $sourceTracker;
            unset($trackerData['id']);
            $trackerData['school_id'] = $schoolId;
            $trackerData['subject_id'] = $targetSubjectId;
            $trackerData['position'] = $nextPosition;
            $trackerData['progress_percentage'] = 0;
            $trackerData['status'] = 'active';
            $trackerData['created_at'] = now();
            $trackerData['updated_at'] = now();
            $newTrackerId = DB::table('trackers')->insertGetId($trackerData);

            $sourceStatuses = DB::table('tracker_statuses')
                ->where('tracker_id', $sourceTracker->id)
                ->orderBy('id')
                ->get();
            foreach ($sourceStatuses as $sourceStatus) {
                DB::table('tracker_statuses')->insert([
                    'tracker_id' => $newTrackerId,
                    'status_id' => $sourceStatus->status_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $sourceTopics = DB::table('topics')
                ->where('tracker_id', $sourceTracker->id)
                ->orderBy('position')
                ->orderBy('id')
                ->get();
            $quizMap = [];
            $quizCount = 0;
            $newTopicIds = [];

            foreach ($sourceTopics as $sourceTopic) {
                $newQuizId = null;
                $sourceQuizId = (int) ($sourceTopic->quiz_id ?? 0);
                if ($sourceQuizId > 0) {
                    if (!isset($quizMap[$sourceQuizId])) {
                        $sourceQuiz = DB::table('quizzes')
                            ->where('id', $sourceQuizId)
                            ->where('school_id', $schoolId)
                            ->where(function ($query) use ($sourceSubjectId) {
                                $query->where('subject_id', $sourceSubjectId)
                                    ->orWhereNull('subject_id');
                            })
                            ->first();
                        if (!$sourceQuiz) {
                            throw new RuntimeException('A tracker topic quiz is unavailable.');
                        }
                        $quizMap[$sourceQuizId] = $this->copyQuiz(
                            $sourceQuiz,
                            $schoolId,
                            $targetSubjectId
                        )['id'];
                        $quizCount++;
                    }
                    $newQuizId = $quizMap[$sourceQuizId];
                }

                $topicData = (array) $sourceTopic;
                unset($topicData['id']);
                $topicData['tracker_id'] = $newTrackerId;
                $topicData['quiz_id'] = $newQuizId;
                $topicData['created_at'] = now();
                $topicData['updated_at'] = now();
                $newTopicIds[] = DB::table('topics')->insertGetId($topicData);
            }

            $assignmentCount = DB::table('assign_trackers')
                ->where('tracker_id', $newTrackerId)
                ->count();
            $certificateCount = DB::table('certificate_claims')
                ->where('tracker_id', $newTrackerId)
                ->count();
            $progressCount = empty($newTopicIds)
                ? 0
                : DB::table('student_topic_marks')
                    ->whereIn('topic_id', $newTopicIds)
                    ->count() +
                    DB::table('topic_status_progress')
                        ->whereIn('topic_id', $newTopicIds)
                        ->count();

            if (
                $assignmentCount !== 0 ||
                $certificateCount !== 0 ||
                $progressCount !== 0
            ) {
                throw new RuntimeException('An imported tracker unexpectedly contains student history.');
            }

            $importedTrackers[] = [
                'source_tracker_id' => (int) $sourceTracker->id,
                'imported_tracker_id' => $newTrackerId,
                'name' => $sourceTracker->name,
                'subject_id' => $targetSubjectId,
                'topic_count' => count($newTopicIds),
                'status_count' => $sourceStatuses->count(),
                'quiz_count' => $quizCount,
                'assignment_count' => 0,
                'progress_count' => 0,
                'certificate_count' => 0,
            ];
        }

        return [
            'status_code' => 200,
            'msg' => count($importedTrackers) === 1
                ? '1 tracker imported with all topics.'
                : count($importedTrackers) . ' trackers imported with all topics.',
            'data' => [
                'imported_count' => count($importedTrackers),
                'trackers' => $importedTrackers,
            ],
        ];
    }

    private function validateSubjects(
        int $schoolId,
        int $sourceSubjectId,
        int $targetSubjectId
    ): void {
        $subjectCount = DB::table('subjects')
            ->where('school_id', $schoolId)
            ->whereIn('id', [$sourceSubjectId, $targetSubjectId])
            ->count();

        if ($subjectCount !== 2) {
            throw new RuntimeException('The source or target subject is unavailable.');
        }

        $sourceClasses = DB::table('subject_classes')
            ->where('school_id', $schoolId)
            ->where('subject_id', $sourceSubjectId)
            ->lockForUpdate()
            ->get(['is_active']);

        if (
            $sourceClasses->isEmpty() ||
            $sourceClasses->contains(fn ($row) => (int) $row->is_active === 1)
        ) {
            throw new RuntimeException('The source subject is no longer archived.');
        }

        $targetClasses = DB::table('subject_classes')
            ->where('school_id', $schoolId)
            ->where('subject_id', $targetSubjectId)
            ->lockForUpdate()
            ->get(['is_active']);

        if (
            $targetClasses->isNotEmpty() &&
            !$targetClasses->contains(fn ($row) => (int) $row->is_active === 1)
        ) {
            throw new RuntimeException('Content can only be imported into an active subject.');
        }
    }

    private function copyTasks(
        int $sourceAssessmentId,
        int $targetAssessmentId,
        array &$createdFiles
    ): int {
        $tasks = DB::table('tasks')
            ->where('assessment_id', $sourceAssessmentId)
            ->orderBy('id')
            ->get();

        foreach ($tasks as $task) {
            $taskData = (array) $task;
            unset($taskData['id']);
            $taskData['assessment_id'] = $targetAssessmentId;
            $taskData['file_path'] = $this->copyTaskFile(
                $task->file_path ?? null,
                $createdFiles
            );
            $taskData['created_at'] = now();
            $taskData['updated_at'] = now();
            DB::table('tasks')->insert($taskData);
        }

        return $tasks->count();
    }

    private function copyTaskFile(?string $filePath, array &$createdFiles): ?string
    {
        $relativePath = ltrim(trim((string) $filePath), '/');
        if ($relativePath === '') {
            return null;
        }

        $sourcePath = public_path('storage/' . $relativePath);
        if (!is_file($sourcePath)) {
            throw new RuntimeException('A source task file is missing and could not be copied.');
        }

        $extension = pathinfo($relativePath, PATHINFO_EXTENSION);
        $newFileName = 'import_' . Str::uuid() . ($extension ? '.' . $extension : '');
        $targetRelativePath = 'task_files/' . $newFileName;
        $targetPath = public_path('storage/' . $targetRelativePath);
        $targetDirectory = dirname($targetPath);

        if (!is_dir($targetDirectory) && !mkdir($targetDirectory, 0755, true) && !is_dir($targetDirectory)) {
            throw new RuntimeException('The task file directory is unavailable.');
        }

        if (!copy($sourcePath, $targetPath)) {
            throw new RuntimeException('A source task file could not be copied.');
        }

        $createdFiles[] = $targetPath;

        return $targetRelativePath;
    }

    private function copyQuizTasks(
        int $schoolId,
        int $sourceSubjectId,
        int $targetSubjectId,
        int $sourceAssessmentId,
        int $targetAssessmentId
    ): int {
        $quizTasks = DB::table('assign_task_quizzes')
            ->where('assessment_id', $sourceAssessmentId)
            ->orderBy('id')
            ->get();

        foreach ($quizTasks as $quizTask) {
            $sourceQuiz = DB::table('quizzes')
                ->where('id', $quizTask->quiz_id)
                ->where('school_id', $schoolId)
                ->where(function ($query) use ($sourceSubjectId) {
                    $query->where('subject_id', $sourceSubjectId)
                        ->orWhereNull('subject_id');
                })
                ->first();

            if (!$sourceQuiz) {
                throw new RuntimeException('A source quiz task is unavailable.');
            }

            $newQuizId = $this->copyQuiz(
                $sourceQuiz,
                $schoolId,
                $targetSubjectId
            )['id'];

            DB::table('assign_task_quizzes')->insert([
                'term_id' => null,
                'class_id' => null,
                'quiz_id' => $newQuizId,
                'assessment_id' => $targetAssessmentId,
                'percentage_weight' => $quizTask->percentage_weight,
                'type' => $quizTask->type ?: 'quiz',
                'subject_id' => $targetSubjectId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return $quizTasks->count();
    }

    private function copyQuiz(
        object $sourceQuiz,
        int $schoolId,
        int $targetSubjectId
    ): array {
        $quizData = (array) $sourceQuiz;
        unset($quizData['id']);
        $quizData['school_id'] = $schoolId;
        $quizData['subject_id'] = $targetSubjectId;
        $quizData['status'] = 'active';
        $quizData['created_at'] = now();
        $quizData['updated_at'] = now();
        $newQuizId = DB::table('quizzes')->insertGetId($quizData);

        $questions = DB::table('quiz_questions')
            ->where('quiz_id', $sourceQuiz->id)
            ->orderBy('position')
            ->orderBy('id')
            ->get();
        $optionCount = 0;

        foreach ($questions as $question) {
            $questionData = (array) $question;
            unset($questionData['id']);
            $questionData['quiz_id'] = $newQuizId;
            $questionData['created_at'] = now();
            $questionData['updated_at'] = now();
            $newQuestionId = DB::table('quiz_questions')->insertGetId($questionData);

            $options = DB::table('question_options')
                ->where('quiz_id', $question->id)
                ->orderBy('id')
                ->get();
            $optionCount += $options->count();

            foreach ($options as $option) {
                $optionData = (array) $option;
                unset($optionData['id']);
                $optionData['quiz_id'] = $newQuestionId;
                $optionData['created_at'] = now();
                $optionData['updated_at'] = now();
                DB::table('question_options')->insert($optionData);
            }
        }

        return [
            'id' => $newQuizId,
            'question_count' => $questions->count(),
            'option_count' => $optionCount,
        ];
    }
}
