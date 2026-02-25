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

        // Try to get school ID from multiple sources
        $schoolId = optional($user->school)->id
            ?? optional(optional($user->student)->class)->school_id
            ?? optional(optional(optional($user->student)->class)->year)->school_id;

        // For teachers: extract school from their first assigned class
        if (!$schoolId && $user->relationLoaded('assignYears')) {
            foreach ($user->assignYears as $assignYear) {
                if ($assignYear->relationLoaded('classes')) {
                    foreach ($assignYear->classes as $class) {
                        $schoolId = optional($class)->school_id 
                            ?? optional(optional($class)->year)->school_id;
                        if ($schoolId) break 2;
                    }
                }
            }
        }

        // Alternative for teachers: query from school_classes table
        if (!$schoolId) {
            $schoolId = DB::table('school_classes')
                ->join('assign_teachers', 'school_classes.id', '=', 'assign_teachers.class_id')
                ->where('assign_teachers.teacher_id', $user->id)
                ->value('school_classes.school_id');
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
            ->join('student_topic_marks', 'student_topic_marks.student_id', '=', 'students.id')
            ->whereHas('class', function ($query) use ($schoolId) {
                $query->where('school_id', $schoolId);
            })
            ->select([
                'students.id as student_id',
                'students.student_name',
                'school_classes.class_name',
                DB::raw('ROUND(SUM(student_topic_marks.marks)) as total_marks'),
            ])
            ->groupBy('students.id', 'students.student_name', 'school_classes.class_name')
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

