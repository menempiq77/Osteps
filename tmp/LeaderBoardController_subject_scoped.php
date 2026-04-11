<?php

/**
 * REFERENCE FILE — Subject-scoped leaderboard methods.
 *
 * Drop these two methods into the real LeaderBoardController to enable
 * subject-aware filtering. The existing schoolSelf() / getStudentsTotalMarks()
 * can remain as-is for the "all subjects" path; the frontend sends ?subject_id=N
 * only when subject workspace mode is active.
 *
 * How the data flows
 * ─────────────────
 * Enrollment truth  : student_subject_enrollments (student_id, subject_class_id, is_active)
 *                     subject_classes (id, subject_id, year_id, base_class_label)
 *
 * Tracker points    : student_topic_marks (student_id, topic_id, marks)
 *                     → topics.tracker_id → trackers.subject_id
 *                     ∴ filter by trackers.subject_id = $subjectId
 *
 * Mind points       : mind_upgrade_student_points (student_id, mind_points)
 *                     NO subject_id column — returned as 0 per student until
 *                     a migration adds the column. Do NOT split the total
 *                     without a schema change.
 *
 * Route suggestion (add to routes/api.php):
 *   Route::get('/leaderboard/school-self',   [LeaderBoardController::class, 'schoolSelf']);
 *   // schoolSelf already checks $request->query('subject_id') with the new code below.
 */

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeaderBoardController extends Controller
{
    // ─────────────────────────────────────────────────────────────────────────
    // HELPER: resolve school_id from the authenticated user (same logic as the
    // existing schoolSelf — extracted here so both methods can share it).
    // ─────────────────────────────────────────────────────────────────────────
    private function resolveSchoolId($user): ?int
    {
        $schoolId = optional($user->school)->id
            ?? optional(optional($user->student)->class)->school_id
            ?? optional(optional(optional($user->student)->class)->year)->school_id;

        if (!$schoolId) {
            $teacherId = DB::table('teachers')->where('user_id', $user->id)->value('id');
            $schoolId  = DB::table('teachers')->where('user_id', $user->id)->value('school_id');

            if (!$schoolId && $teacherId) {
                $schoolId = DB::table('school_classes')
                    ->join('assign_teachers', 'school_classes.id', '=', 'assign_teachers.class_id')
                    ->where('assign_teachers.teacher_id', $teacherId)
                    ->value('school_classes.school_id');
            }

            if (!$schoolId) {
                $schoolId = DB::table('school_classes')
                    ->join('assign_teachers', 'school_classes.id', '=', 'assign_teachers.class_id')
                    ->where('assign_teachers.teacher_id', $user->id)
                    ->value('school_classes.school_id');
            }
        }

        if (!$schoolId) {
            $schoolId = DB::table('school_admins')->where('user_id', $user->id)->value('school_id')
                ?? DB::table('admins')->where('user_id', $user->id)->value('school_id');
        }

        return $schoolId ? (int) $schoolId : null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // schoolSelf — whole-school leaderboard.
    // When ?subject_id=N is present, returns only students enrolled in that
    // subject and scores scoped to that subject's trackers.
    // When subject_id is absent, falls back to the original (all-subject) query.
    // ─────────────────────────────────────────────────────────────────────────
    public function schoolSelf(Request $request): JsonResponse
    {
        $user = $request->user();

        $schoolId = $this->resolveSchoolId($user);
        if (!$schoolId) {
            return response()->json(['status_code' => 200, 'msg' => 'No school found', 'data' => []]);
        }

        $subjectId = $request->query('subject_id');

        // ── Subject-scoped path ──────────────────────────────────────────────
        if ($subjectId) {
            $subjectId = (int) $subjectId;

            /*
             * Tracker-points sub-query scoped to this subject:
             *   student_topic_marks → topics → trackers WHERE trackers.subject_id = $subjectId
             */
            $trackerSubQuery = DB::table('student_topic_marks')
                ->join('topics', 'topics.id', '=', 'student_topic_marks.topic_id')
                ->join('trackers', 'trackers.id', '=', 'topics.tracker_id')
                ->where('trackers.subject_id', $subjectId)
                ->select(
                    'student_topic_marks.student_id',
                    DB::raw('COALESCE(ROUND(SUM(student_topic_marks.marks)), 0) as subject_tracker_points')
                )
                ->groupBy('student_topic_marks.student_id');

            /*
             * Base set: students enrolled in this subject in this school.
             *   student_subject_enrollments → subject_classes (subject_id filter)
             *   → students → school_classes (school_id filter)
             */
            $rows = DB::table('student_subject_enrollments as sse')
                ->join('subject_classes as sc', 'sc.id', '=', 'sse.subject_class_id')
                ->join('students', 'students.id', '=', 'sse.student_id')
                ->join('school_classes', 'school_classes.id', '=', 'students.class_id')
                ->leftJoinSub($trackerSubQuery, 'tp', 'tp.student_id', '=', 'students.id')
                ->where('sc.subject_id', $subjectId)
                ->where('school_classes.school_id', $schoolId)
                ->where('sse.is_active', 1)
                ->select([
                    'students.id as student_id',
                    'students.student_name',
                    'school_classes.class_name',
                    DB::raw('COALESCE(tp.subject_tracker_points, 0) as tracker_points'),
                    DB::raw('0 as mind_points'),   // mind_upgrade_student_points has no subject_id
                    DB::raw('COALESCE(tp.subject_tracker_points, 0) as total_marks'),
                ])
                ->groupBy('students.id', 'students.student_name', 'school_classes.class_name', 'tp.subject_tracker_points')
                ->orderByDesc('total_marks')
                ->orderBy('students.student_name')
                ->get();

            return response()->json(['status_code' => 200, 'msg' => 'School leaderboard fetched successfully', 'data' => $rows]);
        }

        // ── All-subjects path (original query — unchanged) ────────────────────
        $rows = DB::table('students')
            ->join('school_classes', 'students.class_id', '=', 'school_classes.id')
            ->leftJoin('student_topic_marks', 'student_topic_marks.student_id', '=', 'students.id')
            ->leftJoin('mind_upgrade_student_points as musp', 'musp.student_id', '=', 'students.id')
            ->where('school_classes.school_id', $schoolId)
            ->select([
                'students.id as student_id',
                'students.student_name',
                'school_classes.class_name',
                DB::raw('COALESCE(ROUND(SUM(student_topic_marks.marks)), 0) as tracker_points'),
                DB::raw('COALESCE(musp.mind_points, 0) as mind_points'),
                DB::raw('(COALESCE(ROUND(SUM(student_topic_marks.marks)), 0) + COALESCE(musp.mind_points, 0)) as total_marks'),
            ])
            ->groupBy('students.id', 'students.student_name', 'school_classes.class_name', 'musp.mind_points')
            ->orderByDesc('total_marks')
            ->orderBy('students.student_name')
            ->get();

        return response()->json(['status_code' => 200, 'msg' => 'School leaderboard fetched successfully', 'data' => $rows]);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // getStudentsTotalMarks — per-class leaderboard.
    // When ?subject_id=N is present, returns only students enrolled in that
    // subject in this class with tracker marks scoped to that subject.
    // ─────────────────────────────────────────────────────────────────────────
    public function getStudentsTotalMarks(Request $request, int $classId): JsonResponse
    {
        $subjectId = $request->query('subject_id');

        // ── Subject-scoped path ──────────────────────────────────────────────
        if ($subjectId) {
            $subjectId = (int) $subjectId;

            $trackerSubQuery = DB::table('student_topic_marks')
                ->join('topics', 'topics.id', '=', 'student_topic_marks.topic_id')
                ->join('trackers', 'trackers.id', '=', 'topics.tracker_id')
                ->where('trackers.subject_id', $subjectId)
                ->select(
                    'student_topic_marks.student_id',
                    DB::raw('COALESCE(ROUND(SUM(student_topic_marks.marks)), 0) as subject_tracker_points')
                )
                ->groupBy('student_topic_marks.student_id');

            /*
             * Find the subject_class that corresponds to this school class for
             * the requested subject, then use its enrollment list as the base.
             *
             * We match on: subject_classes.subject_id = $subjectId
             *              AND the subject_class links back to $classId
             *              (via class_id / base_class_id / base_class_label+year_id)
             *
             * Simplest join: students in this school_class who are enrolled in
             * any subject_class of this subject.
             */
            $rows = DB::table('student_subject_enrollments as sse')
                ->join('subject_classes as sc', 'sc.id', '=', 'sse.subject_class_id')
                ->join('students', 'students.id', '=', 'sse.student_id')
                ->leftJoinSub($trackerSubQuery, 'tp', 'tp.student_id', '=', 'students.id')
                ->where('sc.subject_id', $subjectId)
                ->where('students.class_id', $classId)
                ->where('sse.is_active', 1)
                ->select([
                    'students.id as student_id',
                    'students.student_name',
                    DB::raw('COALESCE(tp.subject_tracker_points, 0) as tracker_points'),
                    DB::raw('0 as mind_points'),
                    DB::raw('COALESCE(tp.subject_tracker_points, 0) as total_marks'),
                ])
                ->groupBy('students.id', 'students.student_name', 'tp.subject_tracker_points')
                ->orderByDesc('total_marks')
                ->orderBy('students.student_name')
                ->get();

            return response()->json(['status_code' => 200, 'msg' => 'LeaderBoard Data Fetched Successfully', 'data' => $rows]);
        }

        // ── All-subjects path (original query — unchanged) ────────────────────
        $rows = DB::table('students')
            ->join('school_classes', 'students.class_id', '=', 'school_classes.id')
            ->leftJoin('student_topic_marks', 'student_topic_marks.student_id', '=', 'students.id')
            ->leftJoin('mind_upgrade_student_points as musp', 'musp.student_id', '=', 'students.id')
            ->where('students.class_id', $classId)
            ->select([
                'students.id as student_id',
                'students.student_name',
                DB::raw('COALESCE(ROUND(SUM(student_topic_marks.marks)), 0) as tracker_points'),
                DB::raw('COALESCE(musp.mind_points, 0) as mind_points'),
                DB::raw('(COALESCE(ROUND(SUM(student_topic_marks.marks)), 0) + COALESCE(musp.mind_points, 0)) as total_marks'),
            ])
            ->groupBy('students.id', 'students.student_name', 'musp.mind_points')
            ->orderByDesc('total_marks')
            ->orderBy('students.student_name')
            ->get();

        return response()->json(['status_code' => 200, 'msg' => 'LeaderBoard Data Fetched Successfully', 'data' => $rows]);
    }
}
