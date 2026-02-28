<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Student;

class LeaderBoardController extends Controller
{
    /**
     * Whole-school leaderboard for the currently authenticated user.
     * School is resolved from the auth user and never accepted from client input.
     */
    public function schoolSelf(Request $request): JsonResponse
    {
        $user = $request->user();

        // 1) Direct user relations
        $schoolId = optional($user->school)->id
            ?? optional(optional($user->student)->class)->school_id
            ?? optional(optional(optional($user->student)->class)->year)->school_id;

        // 2) Teacher/HOD records
        if (!$schoolId) {
            $teacherId = DB::table('teachers')->where('user_id', $user->id)->value('id');
            $schoolId = DB::table('teachers')->where('user_id', $user->id)->value('school_id');

            // Some deployments store class assignments by teacher_id
            if (!$schoolId && $teacherId) {
                $schoolId = DB::table('school_classes')
                    ->join('assign_teachers', 'school_classes.id', '=', 'assign_teachers.class_id')
                    ->where('assign_teachers.teacher_id', $teacherId)
                    ->value('school_classes.school_id');
            }

            // Defensive fallback for deployments that store user_id directly in assign_teachers.teacher_id
            if (!$schoolId) {
                $schoolId = DB::table('school_classes')
                    ->join('assign_teachers', 'school_classes.id', '=', 'assign_teachers.class_id')
                    ->where('assign_teachers.teacher_id', $user->id)
                    ->value('school_classes.school_id');
            }
        }

        // 3) School admin / admin records (for HOD variants tied to admin tables)
        if (!$schoolId) {
            $schoolId = DB::table('school_admins')->where('user_id', $user->id)->value('school_id')
                ?? DB::table('admins')->where('user_id', $user->id)->value('school_id');
        }

        if (!$schoolId) {
            return response()->json([
                'status_code' => 200,
                'msg' => 'No school found for current user',
                'data' => [],
            ]);
        }

        $rows = Student::query()
            ->join('school_classes', 'students.class_id', '=', 'school_classes.id')
            ->leftJoin('student_topic_marks', 'student_topic_marks.student_id', '=', 'students.id')
            ->leftJoin('mind_upgrade_student_points as musp', 'musp.student_id', '=', 'students.id')
            ->whereHas('class', function ($query) use ($schoolId) {
                $query->where('school_id', $schoolId);
            })
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

        return response()->json([
            'status_code' => 200,
            'msg' => 'School leaderboard fetched successfully',
            'data' => $rows,
        ]);
    }
}

