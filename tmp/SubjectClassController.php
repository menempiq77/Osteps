<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubjectClassController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $schoolId = $this->resolveSchoolId($user);
        $subjectId = (int) $request->query('subject_id', 0);

        if ($subjectId <= 0) {
            return response()->json(['status_code' => 422, 'msg' => 'subject_id is required'], 422);
        }

        $this->ensureSubjectAccess($user, $subjectId);

        $assignedSubjectClassIds = $this->resolveAssignedSubjectClassIds($user);
        $isSchoolAdmin = $this->resolveRole($user) === 'SCHOOL_ADMIN';
        $includeInactive = filter_var($request->query('include_inactive', false), FILTER_VALIDATE_BOOLEAN);

        $items = DB::table('subject_classes')
            ->where('school_id', $schoolId)
            ->where('subject_id', $subjectId)
            ->when($request->filled('year_id'), fn ($q) => $q->where('year_id', (int) $request->query('year_id')))
            ->when(!$isSchoolAdmin && count($assignedSubjectClassIds) > 0, fn ($q) => $q->whereIn('id', $assignedSubjectClassIds))
            ->when(!$includeInactive, fn ($q) => $q->where('is_active', 1))
            ->orderBy('name')
            ->get();

        return response()->json(['status_code' => 200, 'data' => $items]);
    }

    public function archive(Request $request, int $id): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, ['SCHOOL_ADMIN', 'HOD'], true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Forbidden.'], 403);
        }

        $subjectClass = DB::table('subject_classes')->where('id', $id)->first();
        if (!$subjectClass) {
            return response()->json(['status_code' => 404, 'msg' => 'Subject class not found.'], 404);
        }

        $this->ensureSubjectAccess($request->user(), (int) $subjectClass->subject_id);
        $schoolId = $this->resolveSchoolId($request->user());

        DB::table('subject_classes')
            ->where('id', $id)
            ->where('school_id', $schoolId)
            ->update(['is_active' => 0, 'updated_at' => now()]);

        DB::table('student_subject_enrollments')
            ->where('subject_class_id', $id)
            ->update(['is_active' => 0, 'updated_at' => now()]);

        DB::table('user_subject_class_assignments')
            ->where('subject_class_id', $id)
            ->update(['is_active' => 0, 'updated_at' => now()]);

        return response()->json(['status_code' => 200, 'msg' => 'Subject class archived.']);
    }

    public function restore(Request $request, int $id): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, ['SCHOOL_ADMIN', 'HOD'], true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Forbidden.'], 403);
        }

        $subjectClass = DB::table('subject_classes')->where('id', $id)->first();
        if (!$subjectClass) {
            return response()->json(['status_code' => 404, 'msg' => 'Subject class not found.'], 404);
        }

        $this->ensureSubjectAccess($request->user(), (int) $subjectClass->subject_id);
        $schoolId = $this->resolveSchoolId($request->user());

        DB::table('subject_classes')
            ->where('id', $id)
            ->where('school_id', $schoolId)
            ->update(['is_active' => 1, 'updated_at' => now()]);

        return response()->json(['status_code' => 200, 'msg' => 'Subject class restored.']);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if ($role !== 'SCHOOL_ADMIN') {
            return response()->json(['status_code' => 403, 'msg' => 'Only School Admin can permanently delete subject classes.'], 403);
        }

        $subjectClass = DB::table('subject_classes')->where('id', $id)->first();
        if (!$subjectClass) {
            return response()->json(['status_code' => 404, 'msg' => 'Subject class not found.'], 404);
        }

        $this->ensureSubjectAccess($request->user(), (int) $subjectClass->subject_id);
        $schoolId = $this->resolveSchoolId($request->user());

        DB::transaction(function () use ($id, $schoolId) {
            DB::table('student_subject_enrollments')
                ->where('subject_class_id', $id)
                ->delete();

            DB::table('user_subject_class_assignments')
                ->where('subject_class_id', $id)
                ->delete();

            DB::table('subject_classes')
                ->where('id', $id)
                ->where('school_id', $schoolId)
                ->delete();
        });

        return response()->json(['status_code' => 200, 'msg' => 'Subject class deleted permanently.']);
    }

    public function store(Request $request): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, ['SCHOOL_ADMIN', 'HOD'], true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Forbidden role.'], 403);
        }

        $payload = $request->validate([
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'year_id' => ['nullable', 'integer', 'exists:years,id'],
            'name' => ['required', 'string', 'max:255'],
            'base_class_label' => ['nullable', 'string', 'max:255'],
        ]);

        $this->ensureSubjectAccess($request->user(), (int) $payload['subject_id']);
        $schoolId = $this->resolveSchoolId($request->user());
        if ($schoolId <= 0) {
            return response()->json(['status_code' => 422, 'msg' => 'School context is missing for this user.'], 422);
        }

        $id = DB::table('subject_classes')->insertGetId([
            'school_id' => $schoolId,
            'subject_id' => (int) $payload['subject_id'],
            'year_id' => $payload['year_id'] ?? null,
            'name' => $payload['name'],
            'base_class_label' => $payload['base_class_label'] ?? null,
            'is_active' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['status_code' => 201, 'data' => ['id' => $id], 'msg' => 'Subject class created.'], 201);
    }

    public function enrollStudents(Request $request): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, ['SCHOOL_ADMIN', 'HOD', 'TEACHER'], true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Forbidden role.'], 403);
        }

        $payload = $request->validate([
            'subject_class_id' => ['required', 'integer', 'exists:subject_classes,id'],
            'student_ids' => ['required', 'array', 'min:1'],
            'student_ids.*' => ['required', 'integer', 'exists:students,id'],
            'allow_cross_class' => ['nullable', 'boolean'],
        ]);

        $subjectClass = DB::table('subject_classes')->where('id', $payload['subject_class_id'])->first();
        if (!$subjectClass) {
            return response()->json(['status_code' => 404, 'msg' => 'Subject class not found.'], 404);
        }

        $this->ensureSubjectAccess($request->user(), (int) $subjectClass->subject_id);
        $this->ensureSubjectClassAccess($request->user(), (int) $payload['subject_class_id']);

        $studentIds = collect($payload['student_ids'])->map(fn ($id) => (int) $id)->unique()->values();

        $studentRows = DB::table('students')
            ->leftJoin('school_classes', 'school_classes.id', '=', 'students.class_id')
            ->whereIn('students.id', $studentIds->all())
            ->select(
                'students.id',
                'students.school_id',
                'students.class_id',
                'school_classes.class_name',
                'school_classes.year_id'
            )
            ->get();

        if ($studentRows->count() !== $studentIds->count()) {
            return response()->json(['status_code' => 422, 'msg' => 'One or more students are invalid.'], 422);
        }

        $schoolId = $this->resolveSchoolId($request->user());
        $outsideSchool = $studentRows->first(fn ($student) => (int) $student->school_id !== $schoolId);
        if ($outsideSchool) {
            return response()->json(['status_code' => 403, 'msg' => 'One or more students are outside your school.'], 403);
        }

        $forceReassign = filter_var($request->input('force_reassign', false), FILTER_VALIDATE_BOOLEAN);
        $allowCrossClass = filter_var($request->input('allow_cross_class', false), FILTER_VALIDATE_BOOLEAN);
        $skipClassYearValidation = $forceReassign || $allowCrossClass;

        $yearMismatch = $studentRows->first(function ($student) use ($subjectClass) {
            return (int) ($subjectClass->year_id ?? 0) > 0
                && (int) ($student->year_id ?? 0) > 0
                && (int) $student->year_id !== (int) $subjectClass->year_id;
        });
        if ($yearMismatch && !$skipClassYearValidation) {
            return response()->json([
                'status_code' => 422,
                'msg' => 'One or more students do not belong to the selected subject class year.',
            ], 422);
        }

        $baseClassLabel = $this->normalizeClassLabel($subjectClass->base_class_label ?? null);
        if ($baseClassLabel !== '' && !$skipClassYearValidation) {
            $classMismatch = $studentRows->first(function ($student) use ($baseClassLabel) {
                return $this->normalizeClassLabel($student->class_name ?? null) !== $baseClassLabel;
            });
            if ($classMismatch) {
                return response()->json([
                    'status_code' => 422,
                    'msg' => 'One or more students do not belong to the selected base class.',
                ], 422);
            }
        }

        $targetSchoolClassId = null;
        if ($forceReassign) {
            $subjectBaseClassName = trim((string) ($subjectClass->base_class_label ?? ''));
            if ($subjectBaseClassName !== '' && strcasecmp($subjectBaseClassName, 'Default') !== 0) {
                $targetSchoolClass = DB::table('school_classes')
                    ->where('school_id', $schoolId)
                    ->whereRaw('LOWER(TRIM(class_name)) = ?', [strtolower($subjectBaseClassName)])
                    ->when(
                        (int) ($subjectClass->year_id ?? 0) > 0,
                        fn ($query) => $query->where('year_id', (int) $subjectClass->year_id)
                    )
                    ->select('id')
                    ->first();

                if ($targetSchoolClass) {
                    $targetSchoolClassId = (int) $targetSchoolClass->id;
                }
            }
        }

        foreach ($studentIds as $studentId) {
            DB::table('student_subject_enrollments as sse')
                ->join('subject_classes as sc', 'sc.id', '=', 'sse.subject_class_id')
                ->where('sse.student_id', (int) $studentId)
                ->where('sc.school_id', $schoolId)
                ->where('sc.subject_id', (int) $subjectClass->subject_id)
                ->where('sse.subject_class_id', '!=', (int) $payload['subject_class_id'])
                ->update([
                    'sse.is_active' => 0,
                    'sse.updated_at' => now(),
                ]);

            DB::table('student_subject_enrollments')->updateOrInsert(
                [
                    'student_id' => $studentId,
                    'subject_class_id' => (int) $payload['subject_class_id'],
                ],
                [
                    'is_active' => 1,
                    'enrolled_at' => now(),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            if ($targetSchoolClassId && $targetSchoolClassId > 0) {
                DB::table('students')
                    ->where('id', (int) $studentId)
                    ->where('school_id', $schoolId)
                    ->update([
                        'class_id' => $targetSchoolClassId,
                        'updated_at' => now(),
                    ]);
            }
        }

        return response()->json(['status_code' => 200, 'msg' => 'Students enrolled.']);
    }

    public function syncStudentsSubjects(Request $request): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, ['SCHOOL_ADMIN', 'HOD', 'TEACHER'], true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Forbidden role.'], 403);
        }

        $payload = $request->validate([
            'student_ids' => ['required', 'array', 'min:1'],
            'student_ids.*' => ['required', 'integer', 'exists:students,id'],
            'subject_ids' => ['required', 'array', 'min:1'],
            'subject_ids.*' => ['required', 'integer', 'exists:subjects,id'],
        ]);

        $schoolId = $this->resolveSchoolId($request->user());
        $studentIds = collect($payload['student_ids'])->map(fn ($id) => (int) $id)->unique()->values();
        $subjectIds = collect($payload['subject_ids'])->map(fn ($id) => (int) $id)->unique()->values();

        $studentRows = DB::table('students')
            ->whereIn('id', $studentIds->all())
            ->select('id', 'school_id')
            ->get();

        if ($studentRows->count() !== $studentIds->count()) {
            return response()->json(['status_code' => 422, 'msg' => 'One or more students are invalid.'], 422);
        }

        $outsideSchool = $studentRows->first(fn ($student) => (int) $student->school_id !== $schoolId);
        if ($outsideSchool) {
            return response()->json(['status_code' => 403, 'msg' => 'One or more students are outside your school.'], 403);
        }

        $validSubjectIds = DB::table('subjects')
            ->where('school_id', $schoolId)
            ->whereIn('id', $subjectIds->all())
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->toArray();

        if (count($validSubjectIds) !== $subjectIds->count()) {
            return response()->json(['status_code' => 422, 'msg' => 'One or more subjects are outside your school.'], 422);
        }

        foreach ($subjectIds as $subjectId) {
            $this->ensureSubjectAccess($request->user(), $subjectId);
        }

        DB::table('student_subject_enrollments as sse')
            ->join('subject_classes as sc', 'sc.id', '=', 'sse.subject_class_id')
            ->whereIn('sse.student_id', $studentIds->all())
            ->where('sc.school_id', $schoolId)
            ->whereNotIn('sc.subject_id', $subjectIds->all())
            ->update([
                'sse.is_active' => 0,
                'sse.updated_at' => now(),
            ]);

        return response()->json(['status_code' => 200, 'msg' => 'Student subjects synchronized.']);
    }

    public function deactivateByYear(Request $request): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, ['SCHOOL_ADMIN', 'HOD'], true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Forbidden.'], 403);
        }

        $payload = $request->validate([
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'year_id'    => ['required', 'integer', 'exists:years,id'],
        ]);

        $this->ensureSubjectAccess($request->user(), (int) $payload['subject_id']);
        $schoolId = $this->resolveSchoolId($request->user());

        DB::table('subject_classes')
            ->where('school_id', $schoolId)
            ->where('subject_id', (int) $payload['subject_id'])
            ->where('year_id', (int) $payload['year_id'])
            ->update(['is_active' => 0, 'updated_at' => now()]);

        return response()->json(['status_code' => 200, 'msg' => 'Year removed from subject workspace.']);
    }

    public function unenrollStudents(Request $request): JsonResponse
    {
        $role = $this->resolveRole($request->user());
        if (!in_array($role, ['SCHOOL_ADMIN', 'HOD', 'TEACHER'], true)) {
            return response()->json(['status_code' => 403, 'msg' => 'Forbidden role.'], 403);
        }

        $payload = $request->validate([
            'subject_class_id' => ['required', 'integer', 'exists:subject_classes,id'],
            'student_ids'      => ['required', 'array', 'min:1'],
            'student_ids.*'    => ['required', 'integer', 'exists:students,id'],
        ]);

        $subjectClass = DB::table('subject_classes')->where('id', $payload['subject_class_id'])->first();
        if (!$subjectClass) {
            return response()->json(['status_code' => 404, 'msg' => 'Subject class not found.'], 404);
        }

        $this->ensureSubjectAccess($request->user(), (int) $subjectClass->subject_id);
        $this->ensureSubjectClassAccess($request->user(), (int) $payload['subject_class_id']);

        $schoolId  = $this->resolveSchoolId($request->user());
        $studentIds = collect($payload['student_ids'])->map(fn ($id) => (int) $id)->unique()->values();

        // Verify all students belong to this school
        $studentRows = DB::table('students')
            ->whereIn('id', $studentIds->all())
            ->select('id', 'school_id')
            ->get();

        $outsideSchool = $studentRows->first(fn ($s) => (int) $s->school_id !== $schoolId);
        if ($outsideSchool) {
            return response()->json(['status_code' => 403, 'msg' => 'One or more students are outside your school.'], 403);
        }

        DB::table('student_subject_enrollments')
            ->whereIn('student_id', $studentIds->all())
            ->where('subject_class_id', (int) $payload['subject_class_id'])
            ->update(['is_active' => 0, 'updated_at' => now()]);

        return response()->json(['status_code' => 200, 'msg' => 'Students removed from subject class.']);
    }

    private function ensureSubjectAccess($user, int $subjectId): void
    {
        $role = $this->resolveRole($user);

        if ($role === 'SCHOOL_ADMIN') {
            $schoolId = $this->resolveSchoolId($user);
            $exists = DB::table('subjects')
                ->where('id', $subjectId)
                ->where('school_id', $schoolId)
                ->exists();
            if (!$exists) {
                abort(response()->json(['status_code' => 403, 'msg' => 'Subject is outside your school.'], 403));
            }
            return;
        }

        $has = DB::table('user_subject_assignments')
            ->where('user_id', $user->id)
            ->where('subject_id', $subjectId)
            ->where('is_active', 1)
            ->exists();

        if (!$has) {
            abort(response()->json(['status_code' => 403, 'msg' => 'You are not assigned to this subject.'], 403));
        }
    }

    private function ensureSubjectClassAccess($user, int $subjectClassId): void
    {
        $role = $this->resolveRole($user);

        if ($role === 'SCHOOL_ADMIN') {
            return;
        }

        if (!in_array($role, ['HOD', 'TEACHER'], true)) {
            abort(response()->json(['status_code' => 403, 'msg' => 'Forbidden role.'], 403));
        }

        $assignedSubjectClassIds = $this->resolveAssignedSubjectClassIds($user);

        if (count($assignedSubjectClassIds) === 0) {
            return;
        }

        if (!in_array($subjectClassId, $assignedSubjectClassIds, true)) {
            abort(response()->json(['status_code' => 403, 'msg' => 'You are not assigned to this subject class.'], 403));
        }
    }

    private function resolveAssignedSubjectClassIds($user): array
    {
        return DB::table('user_subject_class_assignments')
            ->where('user_id', $user->id)
            ->where('is_active', 1)
            ->pluck('subject_class_id')
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->toArray();
    }

    private function normalizeClassLabel(?string $value): string
    {
        $normalized = strtolower(trim((string) ($value ?? '')));
        $normalized = str_replace(['-', '_'], '', $normalized);
        $normalized = preg_replace('/\s+/', '', $normalized) ?? '';

        return $normalized;
    }

    private function resolveRole(object $user): string
    {
        return strtoupper(str_replace(' ', '_', (string) ($user->role ?? $user->user_type ?? '')));
    }

    private function resolveSchoolId($user): int
    {
        $school = $user->school ?? null;

        return (int) (
            $user->school_id ??
            $user->schoolId ??
            (is_object($school) ? ($school->id ?? 0) : $school) ??
            0
        );
    }
}
