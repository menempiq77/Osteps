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

        $items = DB::table('subject_classes')
            ->where('school_id', $schoolId)
            ->where('subject_id', $subjectId)
            ->when($request->filled('year_id'), fn ($q) => $q->where('year_id', (int) $request->query('year_id')))
            ->when(!$isSchoolAdmin && count($assignedSubjectClassIds) > 0, fn ($q) => $q->whereIn('id', $assignedSubjectClassIds))
            ->where('is_active', 1)
            ->orderBy('name')
            ->get();

        return response()->json(['status_code' => 200, 'data' => $items]);
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
        ]);

        $subjectClass = DB::table('subject_classes')->where('id', $payload['subject_class_id'])->first();
        if (!$subjectClass) {
            return response()->json(['status_code' => 404, 'msg' => 'Subject class not found.'], 404);
        }

        $this->ensureSubjectAccess($request->user(), (int) $subjectClass->subject_id);
        $this->ensureSubjectClassAccess($request->user(), (int) $payload['subject_class_id']);

        $studentIds = collect($payload['student_ids'])->map(fn ($id) => (int) $id)->unique()->values();

        $studentRows = DB::table('students')
            ->whereIn('id', $studentIds->all())
            ->select('id', 'school_id')
            ->get();

        if ($studentRows->count() !== $studentIds->count()) {
            return response()->json(['status_code' => 422, 'msg' => 'One or more students are invalid.'], 422);
        }

        $schoolId = $this->resolveSchoolId($request->user());
        $outsideSchool = $studentRows->first(fn ($student) => (int) $student->school_id !== $schoolId);
        if ($outsideSchool) {
            return response()->json(['status_code' => 403, 'msg' => 'One or more students are outside your school.'], 403);
        }

        foreach ($studentIds as $studentId) {
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
