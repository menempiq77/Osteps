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
        $subjectId = (int) $request->query('subject_id', 0);

        if ($subjectId <= 0) {
            return response()->json(['status_code' => 422, 'msg' => 'subject_id is required'], 422);
        }

        $this->ensureSubjectAccess($user, $subjectId);

        $items = DB::table('subject_classes')
            ->where('school_id', $user->school_id)
            ->where('subject_id', $subjectId)
            ->when($request->filled('year_id'), fn ($q) => $q->where('year_id', (int) $request->query('year_id')))
            ->where('is_active', 1)
            ->orderBy('name')
            ->get();

        return response()->json(['status_code' => 200, 'data' => $items]);
    }

    public function store(Request $request): JsonResponse
    {
        $role = strtoupper((string) ($request->user()->role ?? ''));
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

        $id = DB::table('subject_classes')->insertGetId([
            'school_id' => $request->user()->school_id,
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
        $role = strtoupper((string) ($request->user()->role ?? ''));
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

        $studentIds = collect($payload['student_ids'])->map(fn ($id) => (int) $id)->unique()->values();

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

    private function ensureSubjectAccess($user, int $subjectId): void
    {
        $role = strtoupper((string) ($user->role ?? ''));

        if ($role === 'SCHOOL_ADMIN') {
            $exists = DB::table('subjects')
                ->where('id', $subjectId)
                ->where('school_id', $user->school_id)
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
}
