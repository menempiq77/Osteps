<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SubjectContextController extends Controller
{
    public function myContext(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = strtoupper((string) ($user->role ?? ''));

        $subjects = collect();

        if ($role === 'SCHOOL_ADMIN') {
            $subjects = DB::table('subjects')
                ->where('school_id', $user->school_id)
                ->select('id', 'name', 'code')
                ->orderBy('name')
                ->get();
        } else {
            $subjects = DB::table('user_subject_assignments as usa')
                ->join('subjects as s', 's.id', '=', 'usa.subject_id')
                ->where('usa.user_id', $user->id)
                ->where('usa.is_active', 1)
                ->select('s.id', 's.name', 's.code')
                ->distinct()
                ->orderBy('s.name')
                ->get();
        }

        // fallback for legacy users: expose school subjects
        if ($subjects->isEmpty() && $user->school_id) {
            $subjects = DB::table('subjects')
                ->where('school_id', $user->school_id)
                ->select('id', 'name', 'code')
                ->orderBy('name')
                ->get();
        }

        $defaultSubjectId = DB::table('user_subject_preferences')
            ->where('user_id', $user->id)
            ->value('last_subject_id');

        if (!$defaultSubjectId) {
            $defaultSubjectId = optional($subjects->first())->id;
        }

        $subjectRoles = DB::table('user_subject_assignments')
            ->where('user_id', $user->id)
            ->where('is_active', 1)
            ->select('subject_id', 'role_scope')
            ->get();

        return response()->json([
            'status_code' => 200,
            'data' => [
                'assigned_subjects' => $subjects,
                'default_subject_id' => $defaultSubjectId,
                'subject_roles' => $subjectRoles,
            ],
        ]);
    }

    public function setLast(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'subject_id' => ['required', 'integer'],
        ]);

        $user = $request->user();
        $subjectId = (int) $payload['subject_id'];

        $allowed = $this->userCanAccessSubject($user, $subjectId);
        if (!$allowed) {
            return response()->json([
                'status_code' => 403,
                'msg' => 'You are not allowed to access this subject.',
            ], 403);
        }

        DB::table('user_subject_preferences')->updateOrInsert(
            ['user_id' => $user->id],
            ['last_subject_id' => $subjectId, 'updated_at' => now()]
        );

        return response()->json([
            'status_code' => 200,
            'msg' => 'Last subject updated.',
        ]);
    }

    public function assignStaff(Request $request): JsonResponse
    {
        $this->ensureRole($request, ['SCHOOL_ADMIN']);

        $payload = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'subject_ids' => ['required', 'array', 'min:1'],
            'subject_ids.*' => ['required', 'integer', 'exists:subjects,id'],
            'role_scope' => ['required', 'string', 'in:HOD,TEACHER'],
        ]);

        $subjectIds = collect($payload['subject_ids'])->map(fn ($id) => (int) $id)->unique()->values();

        $validIds = DB::table('subjects')
            ->where('school_id', $request->user()->school_id)
            ->whereIn('id', $subjectIds->all())
            ->pluck('id')
            ->map(fn ($id) => (int) $id)
            ->toArray();

        if (count($validIds) !== $subjectIds->count()) {
            return response()->json([
                'status_code' => 422,
                'msg' => 'One or more subjects are outside your school.',
            ], 422);
        }

        DB::table('user_subject_assignments')
            ->where('user_id', $payload['user_id'])
            ->where('role_scope', $payload['role_scope'])
            ->update(['is_active' => 0, 'updated_at' => now()]);

        foreach ($subjectIds as $subjectId) {
            DB::table('user_subject_assignments')->updateOrInsert(
                [
                    'user_id' => $payload['user_id'],
                    'subject_id' => $subjectId,
                    'role_scope' => $payload['role_scope'],
                ],
                [
                    'is_active' => 1,
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        return response()->json([
            'status_code' => 200,
            'msg' => 'Staff subject assignments updated.',
        ]);
    }

    public function staffAssignments(Request $request): JsonResponse
    {
        $this->ensureRole($request, ['SCHOOL_ADMIN', 'HOD']);

        $items = DB::table('user_subject_assignments as usa')
            ->join('users as u', 'u.id', '=', 'usa.user_id')
            ->join('subjects as s', 's.id', '=', 'usa.subject_id')
            ->where('usa.is_active', 1)
            ->when($request->filled('role_scope'), fn ($q) => $q->where('usa.role_scope', $request->string('role_scope')))
            ->where('s.school_id', $request->user()->school_id)
            ->select('usa.user_id', 'u.name as user_name', 'usa.role_scope', 'usa.subject_id', 's.name as subject_name')
            ->orderBy('u.name')
            ->orderBy('s.name')
            ->get();

        return response()->json([
            'status_code' => 200,
            'data' => $items,
        ]);
    }

    private function userCanAccessSubject($user, int $subjectId): bool
    {
        $role = strtoupper((string) ($user->role ?? ''));
        if ($role === 'SCHOOL_ADMIN') {
            return DB::table('subjects')
                ->where('id', $subjectId)
                ->where('school_id', $user->school_id)
                ->exists();
        }

        return DB::table('user_subject_assignments')
            ->where('user_id', $user->id)
            ->where('subject_id', $subjectId)
            ->where('is_active', 1)
            ->exists();
    }

    private function ensureRole(Request $request, array $allowedRoles): void
    {
        $role = strtoupper((string) ($request->user()->role ?? ''));
        if (!in_array($role, $allowedRoles, true)) {
            abort(response()->json([
                'status_code' => 403,
                'msg' => 'Forbidden role.',
            ], 403));
        }
    }
}
