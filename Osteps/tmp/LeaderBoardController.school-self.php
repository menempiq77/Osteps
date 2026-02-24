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

        $schoolId = optional($user->school)->id
            ?? optional(optional($user->student)->class)->school_id
            ?? optional(optional(optional($user->student)->class)->year)->school_id;

        if (!$schoolId) {
            return response()->json([
                'status_code' => 200,
                'msg' => 'No school found for current user',
                'data' => [],
            ]);
        }

        $rows = Student::query()
            ->whereHas('class', function ($query) use ($schoolId) {
                $query->where('school_id', $schoolId);
            })
            ->leftJoin('student_assessment_task_submits as sats', 'sats.student_id', '=', 'students.id')
            ->select([
                'students.id as student_id',
                'students.student_name',
                DB::raw('COALESCE(SUM(sats.teacher_assessment_marks), 0) as total_marks'),
            ])
            ->groupBy('students.id', 'students.student_name')
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

