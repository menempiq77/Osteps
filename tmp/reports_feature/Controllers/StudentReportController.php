<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentReportController extends Controller
{
    /**
     * List narrative reports written for a student (most recent first).
     */
    public function index(Request $request, $studentId)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $query = StudentReport::where('student_id', (int) $studentId);

        $subjectId = (int) $request->query('subject_id', 0);
        if ($subjectId > 0) {
            $query->where(function ($q) use ($subjectId) {
                $q->where('subject_id', $subjectId)->orWhereNull('subject_id');
            });
        }

        $reports = $query->orderBy('created_at', 'desc')->get();

        return ApiResponseHelper::success('Student reports fetched', $reports);
    }

    /**
     * Create a new narrative report for a student.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $data = $request->validate([
            'student_id'  => 'required|integer',
            'subject_id'  => 'nullable|integer',
            'term_id'     => 'nullable|integer',
            'effort'      => 'nullable|string|max:255',
            'conduct'     => 'nullable|string|max:255',
            'attainment'  => 'nullable|string|max:255',
            'strengths'   => 'nullable|string',
            'targets'     => 'nullable|string',
            'comment'     => 'nullable|string',
        ]);

        $student = Student::find($data['student_id']);

        $report = StudentReport::create([
            'school_id'    => $student->school_id ?? null,
            'student_id'   => $data['student_id'],
            'subject_id'   => $data['subject_id'] ?? null,
            'term_id'      => $data['term_id'] ?? null,
            'author_id'    => $user->id,
            'author_name'  => $user->name ?? $user->user_name ?? $user->email,
            'author_role'  => $user->role ?? null,
            'effort'       => $data['effort'] ?? null,
            'conduct'      => $data['conduct'] ?? null,
            'attainment'   => $data['attainment'] ?? null,
            'strengths'    => $data['strengths'] ?? null,
            'targets'      => $data['targets'] ?? null,
            'comment'      => $data['comment'] ?? null,
        ]);

        return ApiResponseHelper::success('Report saved', $report, 201);
    }

    /**
     * Update an existing narrative report.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $report = StudentReport::find($id);
        if (!$report) {
            return ApiResponseHelper::notFound('Report not found');
        }

        $data = $request->validate([
            'effort'      => 'nullable|string|max:255',
            'conduct'     => 'nullable|string|max:255',
            'attainment'  => 'nullable|string|max:255',
            'strengths'   => 'nullable|string',
            'targets'     => 'nullable|string',
            'comment'     => 'nullable|string',
        ]);

        $report->fill($data);
        $report->save();

        return ApiResponseHelper::success('Report updated', $report);
    }

    /**
     * Delete a narrative report.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $report = StudentReport::find($id);
        if (!$report) {
            return ApiResponseHelper::notFound('Report not found');
        }

        $report->delete();

        return ApiResponseHelper::success('Report deleted');
    }
}
