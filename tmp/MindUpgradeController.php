<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class MindUpgradeController extends Controller
{
    private const CATALOG = [
        [
            'course_key' => 'aqeedah',
            'title' => 'Aqeedah',
            'description' => 'Learn core beliefs of Islam in a clear and structured way.',
            'route_path' => '/dashboard/mind-upgrade/aqeedah',
        ],
        [
            'course_key' => 'stories_of_the_prophets',
            'title' => 'Stories of the Prophets',
            'description' => 'Explore prophetic stories and lessons for daily character.',
            'route_path' => '/dashboard/mind-upgrade/stories-of-the-prophets',
        ],
    ];

    public function catalog(): JsonResponse
    {
        return response()->json(['status_code' => 200, 'data' => self::CATALOG]);
    }

    public function assignCourses(Request $request): JsonResponse
    {
        $this->ensureRole($request, ['SCHOOL_ADMIN', 'HOD', 'TEACHER']);

        $payload = $request->validate([
            'course_key' => ['required', 'string', Rule::in(array_column(self::CATALOG, 'course_key'))],
            'class_ids' => ['nullable', 'array', 'min:1'],
            'class_ids.*' => ['required', 'integer', 'exists:school_classes,id'],
            'student_ids' => ['nullable', 'array', 'min:1'],
            'student_ids.*' => ['required', 'integer', 'exists:students,id'],
            'year_ids' => ['nullable', 'array', 'min:1'],
            'year_ids.*' => ['required', 'integer', 'exists:years,id'],
            'assign_all_classes' => ['nullable', 'boolean'],
            'assign_all_students' => ['nullable', 'boolean'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ]);

        $manageableClassIds = $this->resolveManageableClassIds($request->user());

        $requestedClassIds = collect($payload['class_ids'] ?? [])->map(fn ($id) => (int) $id);
        $requestedStudentIds = collect($payload['student_ids'] ?? [])->map(fn ($id) => (int) $id);
        $requestedYearIds = collect($payload['year_ids'] ?? [])->map(fn ($id) => (int) $id);

        if (filter_var($payload['assign_all_classes'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $requestedClassIds = $requestedClassIds->merge($manageableClassIds);
        }

        if ($requestedYearIds->isNotEmpty()) {
            $classIdsForYears = DB::table('school_classes')
                ->whereIn('id', $manageableClassIds)
                ->whereIn('year_id', $requestedYearIds->all())
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->toArray();
            $requestedClassIds = $requestedClassIds->merge($classIdsForYears);
        }

        if (filter_var($payload['assign_all_students'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
            $allStudentsInScope = DB::table('students')
                ->whereIn('class_id', $manageableClassIds)
                ->pluck('id')
                ->map(fn ($id) => (int) $id)
                ->toArray();
            $requestedStudentIds = $requestedStudentIds->merge($allStudentsInScope);
        }

        $requestedClassIds = $requestedClassIds->unique()->values();
        $requestedStudentIds = $requestedStudentIds->unique()->values();

        if ($requestedClassIds->isEmpty() && $requestedStudentIds->isEmpty()) {
            return response()->json([
                'status_code' => 422,
                'msg' => 'Provide class_ids, student_ids, year_ids, assign_all_classes, or assign_all_students.',
            ], 422);
        }

        $unauthorizedClass = $requestedClassIds->first(fn ($id) => !in_array($id, $manageableClassIds, true));
        if ($unauthorizedClass !== null) {
            return response()->json([
                'status_code' => 403,
                'msg' => 'You cannot assign courses for one or more selected classes.',
            ], 403);
        }

        if ($requestedStudentIds->isNotEmpty()) {
            $studentClassMap = DB::table('students')
                ->whereIn('id', $requestedStudentIds->all())
                ->pluck('class_id', 'id')
                ->map(fn ($classId) => (int) $classId)
                ->toArray();
            $unauthorizedStudent = $requestedStudentIds->first(function ($studentId) use ($studentClassMap, $manageableClassIds) {
                $classId = $studentClassMap[$studentId] ?? null;
                return !$classId || !in_array((int) $classId, $manageableClassIds, true);
            });
            if ($unauthorizedStudent !== null) {
                return response()->json([
                    'status_code' => 403,
                    'msg' => 'You cannot assign courses for one or more selected students.',
                ], 403);
            }
        }

        $created = [];
        DB::transaction(function () use ($requestedClassIds, $requestedStudentIds, $payload, $request, &$created) {
            foreach ($requestedClassIds as $classId) {
                DB::table('mind_upgrade_assignments')
                    ->where('course_key', $payload['course_key'])
                    ->where('class_id', $classId)
                    ->where('is_active', true)
                    ->update(['is_active' => false, 'updated_at' => now()]);

                $assignmentId = DB::table('mind_upgrade_assignments')->insertGetId([
                    'course_key' => $payload['course_key'],
                    'class_id' => $classId,
                    'student_id' => null,
                    'assigned_by_user_id' => $request->user()->id,
                    'starts_at' => $payload['starts_at'] ?? null,
                    'ends_at' => $payload['ends_at'] ?? null,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $created[] = $assignmentId;
            }

            foreach ($requestedStudentIds as $studentId) {
                DB::table('mind_upgrade_assignments')
                    ->where('course_key', $payload['course_key'])
                    ->where('student_id', $studentId)
                    ->where('is_active', true)
                    ->update(['is_active' => false, 'updated_at' => now()]);

                $assignmentId = DB::table('mind_upgrade_assignments')->insertGetId([
                    'course_key' => $payload['course_key'],
                    'class_id' => null,
                    'student_id' => $studentId,
                    'assigned_by_user_id' => $request->user()->id,
                    'starts_at' => $payload['starts_at'] ?? null,
                    'ends_at' => $payload['ends_at'] ?? null,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $created[] = $assignmentId;
            }
        });

        return response()->json([
            'status_code' => 200,
            'msg' => 'Assignments saved successfully.',
            'data' => ['assignment_ids' => $created],
        ]);
    }

    public function manageAssignments(Request $request): JsonResponse
    {
        $this->ensureRole($request, ['SCHOOL_ADMIN', 'HOD', 'TEACHER']);

        $manageableClassIds = $this->resolveManageableClassIds($request->user());
        if (count($manageableClassIds) === 0) {
            return response()->json(['status_code' => 200, 'data' => []]);
        }

        $query = DB::table('mind_upgrade_assignments as mua')
            ->leftJoin('school_classes as sc', 'sc.id', '=', 'mua.class_id')
            ->leftJoin('students as s', 's.id', '=', 'mua.student_id')
            ->leftJoin('years as y', 'y.id', '=', 'sc.year_id')
            ->where(function ($q) use ($manageableClassIds) {
                $q->whereIn('mua.class_id', $manageableClassIds)
                    ->orWhereIn('s.class_id', $manageableClassIds);
            })
            ->select([
                'mua.id',
                'mua.course_key',
                'mua.class_id',
                'sc.class_name',
                'mua.student_id',
                's.student_name',
                'sc.year_id',
                'y.name as year_name',
                'mua.starts_at',
                'mua.ends_at',
                'mua.is_active',
                'mua.created_at',
            ]);

        if ($request->filled('course_key')) {
            $query->where('mua.course_key', $request->string('course_key'));
        }
        if ($request->filled('year_id')) {
            $query->where('sc.year_id', (int) $request->input('year_id'));
        }
        if ($request->filled('class_id')) {
            $query->where('mua.class_id', (int) $request->input('class_id'));
        }
        if (filter_var($request->input('active_only', true), FILTER_VALIDATE_BOOLEAN)) {
            $query->where('mua.is_active', true);
        }

        return response()->json([
            'status_code' => 200,
            'data' => $query->orderByDesc('mua.id')->get(),
        ]);
    }

    public function unassign(Request $request, int $id): JsonResponse
    {
        $this->ensureRole($request, ['SCHOOL_ADMIN', 'HOD', 'TEACHER']);

        $assignment = DB::table('mind_upgrade_assignments')->where('id', $id)->first();
        if (!$assignment) {
            return response()->json(['status_code' => 404, 'msg' => 'Assignment not found.'], 404);
        }

        $manageableClassIds = $this->resolveManageableClassIds($request->user());
        if ($assignment->class_id && !in_array((int) $assignment->class_id, $manageableClassIds, true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Not allowed for this assignment.'], 403);
        }
        if ($assignment->student_id) {
            $studentClassId = (int) DB::table('students')->where('id', (int) $assignment->student_id)->value('class_id');
            if (!$studentClassId || !in_array($studentClassId, $manageableClassIds, true)) {
                return response()->json(['status_code' => 403, 'msg' => 'Not allowed for this assignment.'], 403);
            }
        }
        if (!$assignment->class_id && !$assignment->student_id) {
            return response()->json(['status_code' => 403, 'msg' => 'Not allowed for this assignment.'], 403);
        }

        DB::table('mind_upgrade_assignments')->where('id', $id)->update([
            'is_active' => false,
            'updated_at' => now(),
        ]);

        return response()->json(['status_code' => 200, 'msg' => 'Assignment removed.']);
    }

    public function myAssignments(Request $request): JsonResponse
    {
        $this->ensureRole($request, ['STUDENT']);

        $student = DB::table('students')
            ->where('user_id', $request->user()->id)
            ->select(['id', 'class_id'])
            ->first();
        if (!$student) {
            return response()->json(['status_code' => 200, 'data' => []]);
        }

        $rows = DB::table('mind_upgrade_assignments')
            ->where('is_active', true)
            ->where(function ($query) use ($student) {
                $query->where('class_id', $student->class_id)
                    ->orWhere('student_id', $student->id);
            })
            ->get();

        $now = Carbon::now();
        $mapped = [];
        foreach (self::CATALOG as $course) {
            $courseAssignments = collect($rows)->where('course_key', $course['course_key'])->values();
            $bestStatus = 'unassigned';
            $bestStartsAt = null;
            $bestEndsAt = null;
            foreach ($courseAssignments as $assignment) {
                $startsAt = $assignment->starts_at ?? null;
                $endsAt = $assignment->ends_at ?? null;
                $starts = $startsAt ? Carbon::parse($startsAt) : null;
                $ends = $endsAt ? Carbon::parse($endsAt) : null;
                $candidateStatus = 'active';
                if ($starts && $starts->gt($now)) {
                    $candidateStatus = 'upcoming';
                } elseif ($ends && $ends->lt($now)) {
                    $candidateStatus = 'expired';
                }

                $rank = ['unassigned' => 0, 'expired' => 1, 'upcoming' => 2, 'active' => 3];
                if (($rank[$candidateStatus] ?? 0) >= ($rank[$bestStatus] ?? 0)) {
                    $bestStatus = $candidateStatus;
                    $bestStartsAt = $startsAt;
                    $bestEndsAt = $endsAt;
                }
            }

            $mapped[] = [
                'course_key' => $course['course_key'],
                'is_assigned_now' => $bestStatus === 'active',
                'starts_at' => $bestStartsAt,
                'ends_at' => $bestEndsAt,
                'status' => $bestStatus,
            ];
        }

        return response()->json(['status_code' => 200, 'data' => $mapped]);
    }

    public function submitQuizCompletion(Request $request): JsonResponse
    {
        $this->ensureRole($request, ['STUDENT']);

        $payload = $request->validate([
            'course_key' => ['required', 'string', Rule::in(array_column(self::CATALOG, 'course_key'))],
            'unit_key' => ['required', 'string', 'max:255'],
            'score' => ['required', 'integer', 'min:0'],
            'total' => ['required', 'integer', 'min:1'],
        ]);

        $studentId = $this->resolveStudentIdForAuthUser($request->user()->id);
        $this->ensureCourseAssignedNow($studentId, $payload['course_key']);
        $awardedXp = $this->calculateQuizXp((int) $payload['score'], (int) $payload['total']);

        $result = $this->upsertProgressAndAggregate([
            'student_id' => $studentId,
            'course_key' => $payload['course_key'],
            'unit_key' => $payload['unit_key'],
            'unit_type' => 'quiz',
            'score' => (int) $payload['score'],
            'total' => (int) $payload['total'],
            'xp_awarded' => $awardedXp,
        ]);

        return response()->json(['status_code' => 200, 'data' => $result]);
    }

    public function submitMiniGameCompletion(Request $request): JsonResponse
    {
        $this->ensureRole($request, ['STUDENT']);

        $payload = $request->validate([
            'course_key' => ['required', 'string', Rule::in(array_column(self::CATALOG, 'course_key'))],
            'unit_key' => ['required', 'string', 'max:255'],
            'xp' => ['required', 'integer', Rule::in([15, 30])],
        ]);

        $studentId = $this->resolveStudentIdForAuthUser($request->user()->id);
        $this->ensureCourseAssignedNow($studentId, $payload['course_key']);

        $result = $this->upsertProgressAndAggregate([
            'student_id' => $studentId,
            'course_key' => $payload['course_key'],
            'unit_key' => $payload['unit_key'],
            'unit_type' => 'minigame',
            'score' => null,
            'total' => null,
            'xp_awarded' => (int) $payload['xp'],
        ]);

        return response()->json(['status_code' => 200, 'data' => $result]);
    }

    public function studentPoints(Request $request, int $studentId): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if ($role === 'STUDENT') {
            $myStudentId = $this->resolveStudentIdForAuthUser($request->user()->id);
            if ($myStudentId !== $studentId) {
                return response()->json(['status_code' => 403, 'msg' => 'Forbidden'], 403);
            }
        }

        $mindPoints = (int) DB::table('mind_upgrade_student_points')
            ->where('student_id', $studentId)
            ->value('mind_points');

        $trackerPoints = (int) DB::table('student_topic_marks')
            ->where('student_id', $studentId)
            ->sum('marks');

        $breakdown = DB::table('mind_upgrade_progress')
            ->where('student_id', $studentId)
            ->select([
                'course_key',
                DB::raw('SUM(xp_awarded) as points'),
            ])
            ->groupBy('course_key')
            ->get();

        return response()->json([
            'status_code' => 200,
            'data' => [
                'mind_points' => $mindPoints,
                'tracker_points' => $trackerPoints,
                'total_points' => $mindPoints + $trackerPoints,
                'breakdown' => $breakdown,
            ],
        ]);
    }

    private function upsertProgressAndAggregate(array $progress): array
    {
        return DB::transaction(function () use ($progress) {
            $existing = DB::table('mind_upgrade_progress')
                ->where('student_id', $progress['student_id'])
                ->where('unit_key', $progress['unit_key'])
                ->first();

            $awardedDelta = (int) $progress['xp_awarded'];
            if ($existing) {
                $existingXp = (int) $existing->xp_awarded;
                $nextXp = max($existingXp, (int) $progress['xp_awarded']);
                $awardedDelta = $nextXp - $existingXp;

                DB::table('mind_upgrade_progress')
                    ->where('id', $existing->id)
                    ->update([
                        'score' => $progress['score'],
                        'total' => $progress['total'],
                        'xp_awarded' => $nextXp,
                        'awarded_at' => now(),
                        'updated_at' => now(),
                    ]);
            } else {
                DB::table('mind_upgrade_progress')->insert([
                    'student_id' => $progress['student_id'],
                    'course_key' => $progress['course_key'],
                    'unit_key' => $progress['unit_key'],
                    'unit_type' => $progress['unit_type'],
                    'score' => $progress['score'],
                    'total' => $progress['total'],
                    'xp_awarded' => $progress['xp_awarded'],
                    'awarded_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $aggregate = DB::table('mind_upgrade_student_points')
                ->where('student_id', $progress['student_id'])
                ->first();
            $currentPoints = $aggregate ? (int) $aggregate->mind_points : 0;
            $newPoints = $currentPoints + max(0, $awardedDelta);

            DB::table('mind_upgrade_student_points')->updateOrInsert(
                ['student_id' => $progress['student_id']],
                ['mind_points' => $newPoints, 'updated_at' => now()]
            );

            return [
                'awarded_xp' => max(0, $awardedDelta),
                'total_mind_points' => $newPoints,
            ];
        });
    }

    private function ensureCourseAssignedNow(int $studentId, string $courseKey): void
    {
        $studentClassId = (int) DB::table('students')->where('id', $studentId)->value('class_id');
        $assignments = DB::table('mind_upgrade_assignments')
            ->where('course_key', $courseKey)
            ->where('is_active', true)
            ->where(function ($query) use ($studentClassId, $studentId) {
                $query->where('class_id', $studentClassId)
                    ->orWhere('student_id', $studentId);
            })
            ->get();

        if ($assignments->isEmpty()) {
            abort(403, 'Course is not assigned to your class.');
        }

        $now = Carbon::now();
        foreach ($assignments as $assignment) {
            if ($assignment->starts_at && Carbon::parse($assignment->starts_at)->gt($now)) {
                continue;
            }
            if ($assignment->ends_at && Carbon::parse($assignment->ends_at)->lt($now)) {
                continue;
            }
            return;
        }

        abort(403, 'Course assignment is not currently active.');
    }

    private function calculateQuizXp(int $score, int $total): int
    {
        if ($total <= 0) return 0;
        $ratio = ($score / $total) * 100;
        if ($ratio >= 100) return 150;
        if ($ratio >= 70) return 100;
        return 0;
    }

    private function resolveStudentIdForAuthUser(int $userId): int
    {
        $studentId = (int) DB::table('students')->where('user_id', $userId)->value('id');
        if (!$studentId) {
            abort(403, 'Student account not found.');
        }
        return $studentId;
    }

    private function resolveManageableClassIds(object $user): array
    {
        $schoolId = optional($user->school)->id
            ?? DB::table('school_admins')->where('user_id', $user->id)->value('school_id')
            ?? DB::table('teachers')->where('user_id', $user->id)->value('school_id');

        if (!$schoolId) {
            return [];
        }

        return DB::table('school_classes')
            ->where('school_id', $schoolId)
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->toArray();
    }

    private function ensureRole(Request $request, array $allowed): void
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, $allowed, true)) {
            abort(403, 'Forbidden');
        }
    }

    private function resolveRole(object $user): string
    {
        return strtoupper(str_replace(' ', '_', (string) ($user->role ?? $user->user_type ?? '')));
    }
}
