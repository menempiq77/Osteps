<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Student;
use App\Models\StudentBuiltInTrackerProgress;
use App\Models\StudentCoinTransaction;
use App\Models\StudentCoinWallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BuiltInTrackerProgressController extends Controller
{
    /**
     * Built-in tracker definitions. The pass mark and the reward are kept on
     * the server so a client cannot decide how many coins it earns.
     */
    private const TRACKERS = [
        'stories-of-the-prophets' => [
            'total_questions' => 10,
            'pass_mark' => 7,
            'reward' => 15,
            'label' => 'Stories of the Prophets',
        ],
    ];

    private const SOURCE_TYPE = 'builtin_tracker';

    public function show(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracker_id' => ['required', 'string', 'max:64'],
            'student_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $tracker = $this->trackerDefinition($validated['tracker_id']);
        $studentId = $this->studentIdFor($request);

        return response()->json([
            'status_code' => 200,
            'msg' => 'Built-in tracker progress fetched successfully',
            'data' => $this->progressData(
                $studentId,
                $validated['tracker_id'],
                $tracker
            ),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tracker_id' => ['required', 'string', 'max:64'],
            'lesson_id' => ['required', 'string', 'max:64'],
            'score' => ['required', 'integer', 'min:0'],
            'total_questions' => ['required', 'integer', 'min:1'],
            'student_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $trackerId = $validated['tracker_id'];
        $tracker = $this->trackerDefinition($trackerId);
        $lessonId = $validated['lesson_id'];
        $totalQuestions = (int) $validated['total_questions'];
        $score = (int) $validated['score'];

        abort_if(
            $totalQuestions !== (int) $tracker['total_questions'],
            422,
            'This built-in tracker expects '
                . $tracker['total_questions']
                . ' questions'
        );
        abort_if($score > $totalQuestions, 422, 'The score is out of range');

        $studentId = $this->studentIdFor($request);
        $passed = $score >= (int) $tracker['pass_mark'];

        $result = DB::transaction(function () use (
            $studentId,
            $trackerId,
            $lessonId,
            $score,
            $totalQuestions,
            $passed,
            $tracker
        ) {
            $progress = StudentBuiltInTrackerProgress::lockForUpdate()
                ->firstOrNew([
                    'student_id' => $studentId,
                    'tracker_id' => $trackerId,
                    'lesson_id' => $lessonId,
                ]);

            $progress->best_score = max((int) $progress->best_score, $score);
            $progress->total_questions = $totalQuestions;
            $progress->attempts = (int) $progress->attempts + 1;
            if ($passed && !$progress->passed_at) {
                $progress->passed_at = now();
            }
            $progress->save();

            if (!$passed) {
                return ['awarded' => false, 'coins_earned' => 0];
            }

            $wallet = StudentCoinWallet::where('student_id', $studentId)
                ->lockForUpdate()
                ->first();

            if (!$wallet) {
                $wallet = StudentCoinWallet::create([
                    'student_id' => $studentId,
                    'balance' => 0,
                ]);
            }

            $sourceKey = "builtin:{$trackerId}:{$lessonId}";
            $alreadyAwarded = StudentCoinTransaction::where([
                'student_id' => $studentId,
                'source_type' => self::SOURCE_TYPE,
                'source_key' => $sourceKey,
            ])->exists();

            if ($alreadyAwarded) {
                return ['awarded' => false, 'coins_earned' => 0];
            }

            StudentCoinTransaction::create([
                'student_id' => $studentId,
                'amount' => (int) $tracker['reward'],
                'source_type' => self::SOURCE_TYPE,
                'source_key' => $sourceKey,
                'description' => $tracker['label'] . ": {$lessonId}",
            ]);
            $wallet->increment('balance', (int) $tracker['reward']);

            return [
                'awarded' => true,
                'coins_earned' => (int) $tracker['reward'],
            ];
        });

        return response()->json([
            'status_code' => 200,
            'msg' => $passed
                ? ($result['awarded']
                    ? 'Built-in tracker coins awarded successfully'
                    : 'Built-in tracker lesson was already completed')
                : 'Built-in tracker attempt recorded',
            'data' => [
                ...$this->progressData($studentId, $trackerId, $tracker),
                'lesson_id' => $lessonId,
                'score' => $score,
                'passed' => $passed,
                'awarded' => $result['awarded'],
                'coins_earned' => $result['coins_earned'],
            ],
        ]);
    }

    private function progressData(
        int $studentId,
        string $trackerId,
        array $tracker
    ): array {
        $wallet = StudentCoinWallet::firstOrCreate(
            ['student_id' => $studentId],
            ['balance' => 0]
        );
        $awardedLessons = StudentCoinTransaction::where([
            'student_id' => $studentId,
            'source_type' => self::SOURCE_TYPE,
        ])
            ->where('source_key', 'like', "builtin:{$trackerId}:%")
            ->pluck('amount', 'source_key');
        $rows = StudentBuiltInTrackerProgress::where([
            'student_id' => $studentId,
            'tracker_id' => $trackerId,
        ])->get();

        return [
            'student_id' => $studentId,
            'coin_balance' => (int) $wallet->balance,
            'tracker_id' => $trackerId,
            'pass_mark' => (int) $tracker['pass_mark'],
            'reward_amount' => (int) $tracker['reward'],
            'lessons' => $rows
                ->map(function (StudentBuiltInTrackerProgress $row) use (
                    $trackerId,
                    $awardedLessons
                ) {
                    $sourceKey = "builtin:{$trackerId}:{$row->lesson_id}";

                    return [
                        'lesson_id' => $row->lesson_id,
                        'best_score' => (int) $row->best_score,
                        'total_questions' => (int) $row->total_questions,
                        'attempts' => (int) $row->attempts,
                        'passed' => $row->passed_at !== null,
                        'coins_awarded' => (int) ($awardedLessons[$sourceKey] ?? 0),
                    ];
                })
                ->values()
                ->all(),
        ];
    }

    private function trackerDefinition(string $trackerId): array
    {
        abort_unless(
            array_key_exists($trackerId, self::TRACKERS),
            404,
            'Unknown built-in tracker'
        );

        return self::TRACKERS[$trackerId];
    }

    private function studentIdFor(Request $request): int
    {
        $user = $request->user();
        $role = strtoupper(str_replace(' ', '_', (string) $user->role));
        $requestedStudentId = (int) $request->input('student_id', 0);
        $authenticatedStudentId = (int) Student::where('user_id', $user->id)
            ->value('id');

        if ($role === 'STUDENT') {
            abort_if($authenticatedStudentId <= 0, 404, 'Student profile not found');
            abort_if(
                $requestedStudentId > 0 &&
                    $requestedStudentId !== $authenticatedStudentId,
                403,
                'Students can only access their own built-in tracker progress'
            );

            return $authenticatedStudentId;
        }

        abort_unless(
            $role === 'SCHOOL_ADMIN',
            403,
            'Only students and school administrators can access built-in tracker progress'
        );
        abort_if($requestedStudentId <= 0, 422, 'A student profile is required');

        $schoolId = (int) School::where('user_id', $user->id)->value('id');
        $studentExists = $schoolId > 0 && Student::where([
            'id' => $requestedStudentId,
            'school_id' => $schoolId,
        ])->exists();

        abort_unless($studentExists, 404, 'Student profile not found');

        return $requestedStudentId;
    }
}
