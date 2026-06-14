<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignTracker;
use App\Models\ClassEnrollmentRequest;
use App\Models\School;
use App\Models\SchoolClass;
use App\Models\SchoolNotification;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TopicStatusProgress;
use App\Models\Tracker;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ClassEnrollmentController extends Controller
{
    /**
     * Resolve the school for the authenticated admin/HOD/teacher.
     */
    private function resolveSchool($allowTeacher = false)
    {
        $user = Auth::user();
        if (!$user) {
            return null;
        }
        if ($user->role === 'SCHOOL_ADMIN') {
            return School::where('email', $user->email)->first()
                ?? School::where('user_id', $user->id)->first();
        }
        if ($user->role === 'HOD' || ($allowTeacher && $user->role === 'TEACHER')) {
            $teacher = Teacher::where('user_id', $user->id)->first();
            return $teacher ? School::find($teacher->school_id) : null;
        }
        return null;
    }

    private function generateUniqueCode(): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no ambiguous chars
        do {
            $code = '';
            for ($i = 0; $i < 6; $i++) {
                $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
            }
        } while (SchoolClass::where('join_code', $code)->exists());
        return $code;
    }

    private function generateUniqueUsername(string $first, string $last): string
    {
        $base = Str::slug(trim($first . ' ' . $last), '.');
        if ($base === '') {
            $base = 'student';
        }
        $candidate = $base;
        $i = 1;
        while (
            User::where('user_name', $candidate)->exists()
            || ClassEnrollmentRequest::where('user_name', $candidate)->where('status', 'pending')->exists()
        ) {
            $i++;
            $candidate = $base . $i;
        }
        return $candidate;
    }

    /**
     * Auth: get or generate the join code for a class. Returns the share link.
     * GET school-classes/{id}/join-code
     */
    public function joinCode($id)
    {
        $school = $this->resolveSchool(true);
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $class = SchoolClass::where('id', $id)->where('school_id', $school->id)->first();
        if (!$class) {
            return response()->json(['status_code' => 404, 'msg' => 'Class not found.'], 404);
        }
        if (empty($class->join_code)) {
            $class->join_code = $this->generateUniqueCode();
            $class->save();
        }
        return response()->json([
            'status_code' => 200,
            'data' => [
                'class_id' => $class->id,
                'join_code' => $class->join_code,
            ],
        ]);
    }

    /**
     * Auth: regenerate a fresh join code (invalidates the old link).
     * POST school-classes/{id}/regenerate-join-code
     */
    public function regenerateJoinCode($id)
    {
        $school = $this->resolveSchool(true);
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $class = SchoolClass::where('id', $id)->where('school_id', $school->id)->first();
        if (!$class) {
            return response()->json(['status_code' => 404, 'msg' => 'Class not found.'], 404);
        }
        $class->join_code = $this->generateUniqueCode();
        $class->save();
        return response()->json([
            'status_code' => 200,
            'data' => ['class_id' => $class->id, 'join_code' => $class->join_code],
        ]);
    }

    /**
     * Public: look up a class by its join code (for the signup form header).
     * GET public/class/{code}
     */
    public function publicClass($code)
    {
        $class = SchoolClass::with('year')->where('join_code', strtoupper(trim($code)))->first();
        if (!$class) {
            return response()->json(['status_code' => 404, 'msg' => 'Invalid or expired join link.'], 404);
        }
        $school = School::find($class->school_id);
        return response()->json([
            'status_code' => 200,
            'data' => [
                'class_id' => $class->id,
                'class_name' => $class->class_name,
                'year_name' => $class->year->name ?? null,
                'school_name' => $school->name ?? null,
            ],
        ]);
    }

    /**
     * Public: a student submits their details to join a class.
     * POST public/class/{code}/enroll
     */
    public function publicEnroll(Request $request, $code)
    {
        $class = SchoolClass::where('join_code', strtoupper(trim($code)))->first();
        if (!$class) {
            return response()->json(['status_code' => 404, 'msg' => 'Invalid or expired join link.'], 404);
        }

        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'gender' => 'nullable|string|max:30',
            'nationality' => 'nullable|string|max:100',
            'password' => 'required|string|min:6|max:100',
            'needs_support' => 'nullable|boolean',
            'support_details' => 'nullable|string|max:1000',
        ]);

        $needsSupport = (bool) ($validated['needs_support'] ?? false);
        $userName = $this->generateUniqueUsername($validated['first_name'], $validated['last_name']);
        $fullName = trim($validated['first_name'] . ' ' . $validated['last_name']);

        $req = ClassEnrollmentRequest::create([
            'school_id' => $class->school_id,
            'class_id' => $class->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'student_name' => $fullName,
            'gender' => $validated['gender'] ?? null,
            'nationality' => $validated['nationality'] ?? null,
            'user_name' => $userName,
            'password' => Hash::make($validated['password']),
            'needs_support' => $needsSupport,
            'support_details' => $needsSupport ? ($validated['support_details'] ?? null) : null,
            'status' => 'pending',
        ]);

        SchoolNotification::create([
            'school_id' => $class->school_id,
            'type' => 'enrollment_request',
            'title' => 'New class signup',
            'message' => $fullName . ' asked to join ' . $class->class_name . '.',
            'url' => '/dashboard/classes',
            'data' => [
                'request_id' => $req->id,
                'class_id' => $class->id,
                'class_name' => $class->class_name,
            ],
        ]);

        return response()->json([
            'status_code' => 200,
            'msg' => 'Your details were submitted. Your teacher will confirm your place soon.',
            'data' => [
                'user_name' => $userName,
                'class_name' => $class->class_name,
            ],
        ]);
    }

    /**
     * Auth: list enrollment requests for the school (optionally by class / status).
     * GET class-enrollments?status=pending&class_id=#
     */
    public function index(Request $request)
    {
        $school = $this->resolveSchool(true);
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $query = ClassEnrollmentRequest::where('school_id', $school->id);
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }
        if ($request->filled('class_id')) {
            $query->where('class_id', $request->get('class_id'));
        }
        $items = $query->orderByDesc('created_at')->get()->map(function ($r) {
            return [
                'id' => $r->id,
                'class_id' => $r->class_id,
                'first_name' => $r->first_name,
                'last_name' => $r->last_name,
                'student_name' => $r->student_name,
                'gender' => $r->gender,
                'nationality' => $r->nationality,
                'user_name' => $r->user_name,
                'needs_support' => (bool) $r->needs_support,
                'support_details' => $r->support_details,
                'status' => $r->status,
                'created_at' => optional($r->created_at)->toDateTimeString(),
            ];
        });
        return response()->json(['status_code' => 200, 'data' => $items]);
    }

    /**
     * Auth: count of pending requests per class (for card badges).
     * GET class-enrollments/pending-counts
     */
    public function pendingCounts()
    {
        $school = $this->resolveSchool(true);
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $counts = ClassEnrollmentRequest::where('school_id', $school->id)
            ->where('status', 'pending')
            ->select('class_id', DB::raw('count(*) as count'))
            ->groupBy('class_id')
            ->pluck('count', 'class_id');
        return response()->json(['status_code' => 200, 'data' => $counts]);
    }

    /**
     * Auth: edit a pending request before approval.
     * POST class-enrollments/{id}
     */
    public function update(Request $request, $id)
    {
        $school = $this->resolveSchool(true);
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $req = ClassEnrollmentRequest::where('id', $id)->where('school_id', $school->id)->first();
        if (!$req) {
            return response()->json(['status_code' => 404, 'msg' => 'Request not found.'], 404);
        }
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'gender' => 'nullable|string|max:30',
            'nationality' => 'nullable|string|max:100',
            'user_name' => 'sometimes|string|max:100',
            'class_id' => 'sometimes|integer',
            'needs_support' => 'nullable|boolean',
            'support_details' => 'nullable|string|max:1000',
        ]);

        if (isset($validated['class_id'])) {
            $target = SchoolClass::where('id', $validated['class_id'])->where('school_id', $school->id)->first();
            if (!$target) {
                return response()->json(['status_code' => 422, 'msg' => 'Invalid class.'], 422);
            }
            $req->class_id = $validated['class_id'];
        }
        if (isset($validated['user_name']) && $validated['user_name'] !== $req->user_name) {
            $exists = User::where('user_name', $validated['user_name'])->exists()
                || ClassEnrollmentRequest::where('user_name', $validated['user_name'])
                    ->where('status', 'pending')->where('id', '!=', $req->id)->exists();
            if ($exists) {
                return response()->json(['status_code' => 409, 'msg' => 'That username is already taken.'], 409);
            }
            $req->user_name = $validated['user_name'];
        }
        foreach (['first_name', 'last_name', 'gender', 'nationality'] as $f) {
            if (array_key_exists($f, $validated)) {
                $req->{$f} = $validated[$f];
            }
        }
        if (array_key_exists('needs_support', $validated)) {
            $req->needs_support = (bool) $validated['needs_support'];
        }
        if (array_key_exists('support_details', $validated)) {
            $req->support_details = $req->needs_support ? $validated['support_details'] : null;
        }
        $req->student_name = trim($req->first_name . ' ' . $req->last_name);
        $req->save();

        return response()->json(['status_code' => 200, 'msg' => 'Request updated.']);
    }

    /**
     * Auth: approve a request -> create the student account and add to the class.
     * POST class-enrollments/{id}/approve
     */
    public function approve($id)
    {
        $school = $this->resolveSchool();
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Only school admins or HODs can confirm students.'], 403);
        }
        $req = ClassEnrollmentRequest::where('id', $id)->where('school_id', $school->id)->first();
        if (!$req) {
            return response()->json(['status_code' => 404, 'msg' => 'Request not found.'], 404);
        }
        if ($req->status === 'approved') {
            return response()->json(['status_code' => 409, 'msg' => 'This student was already confirmed.'], 409);
        }
        $class = SchoolClass::where('id', $req->class_id)->where('school_id', $school->id)->first();
        if (!$class) {
            return response()->json(['status_code' => 422, 'msg' => 'The class for this request no longer exists.'], 422);
        }
        if (User::where('user_name', $req->user_name)->exists()) {
            return response()->json(['status_code' => 409, 'msg' => 'Username already taken — edit it before confirming.'], 409);
        }

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $req->student_name,
                'email' => null,
                'user_name' => $req->user_name,
                'password' => $req->password, // already hashed at submission time
                'role' => 'STUDENT',
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'email' => null,
                'school_id' => $school->id,
                'class_id' => $class->id,
                'student_name' => $req->student_name,
                'status' => 'active',
                'user_name' => $req->user_name,
                'gender' => $req->gender,
                'student_gender' => $req->gender,
                'sex' => $req->gender,
                'student_sex' => $req->gender,
                'nationality' => $req->nationality,
                'is_sen' => (bool) $req->needs_support,
                'sen_details' => $req->needs_support ? $req->support_details : null,
            ]);

            // Mirror the standard add-student tracker provisioning.
            $assignedTrackers = AssignTracker::where('class_id', $student->class_id)
                ->whereNull('student_id')
                ->where('status', 'assigned')
                ->get();
            foreach ($assignedTrackers as $assignedTracker) {
                $tracker = Tracker::with(['topics', 'statuses'])->find($assignedTracker->tracker_id);
                if ($tracker) {
                    $statusIds = $tracker->statuses->pluck('id');
                    foreach ($tracker->topics as $topic) {
                        foreach ($statusIds as $statusId) {
                            TopicStatusProgress::updateOrCreate(
                                ['topic_id' => $topic->id, 'status_id' => $statusId, 'student_id' => $student->id],
                                ['is_completed' => false]
                            );
                        }
                    }
                }
            }

            $req->status = 'approved';
            $req->created_student_id = $student->id;
            $req->save();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status_code' => 500, 'msg' => 'Could not confirm student: ' . $e->getMessage()], 500);
        }

        return response()->json([
            'status_code' => 200,
            'msg' => 'Student confirmed and added to ' . $class->class_name . '.',
            'data' => ['student_id' => $student->id, 'user_name' => $req->user_name],
        ]);
    }

    /**
     * Auth: delete / reject a request.
     * DELETE class-enrollments/{id}
     */
    public function destroy($id)
    {
        $school = $this->resolveSchool(true);
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $req = ClassEnrollmentRequest::where('id', $id)->where('school_id', $school->id)->first();
        if (!$req) {
            return response()->json(['status_code' => 404, 'msg' => 'Request not found.'], 404);
        }
        $req->delete();
        return response()->json(['status_code' => 200, 'msg' => 'Request removed.']);
    }
}
