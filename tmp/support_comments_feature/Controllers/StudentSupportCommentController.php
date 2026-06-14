<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponseHelper;
use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentSupportComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentSupportCommentController extends Controller
{
    /**
     * List support & wellbeing comments for a student (most recent first).
     */
    public function index(Request $request, $studentId)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $query = StudentSupportComment::where('student_id', (int) $studentId);

        $subjectId = (int) $request->query('subject_id', 0);
        if ($subjectId > 0) {
            $query->where(function ($q) use ($subjectId) {
                $q->where('subject_id', $subjectId)->orWhereNull('subject_id');
            });
        }

        $comments = $query->orderBy('created_at', 'desc')->get();

        return ApiResponseHelper::success('Support comments fetched', $comments);
    }

    /**
     * Add a new support & wellbeing comment for a student.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $data = $request->validate([
            'student_id' => 'required|integer',
            'subject_id' => 'nullable|integer',
            'comment'    => 'required|string',
        ]);

        $student = Student::find($data['student_id']);

        $comment = StudentSupportComment::create([
            'school_id'   => $student->school_id ?? null,
            'student_id'  => $data['student_id'],
            'subject_id'  => $data['subject_id'] ?? null,
            'author_id'   => $user->id,
            'author_name' => $user->name ?? $user->user_name ?? $user->email,
            'author_role' => $user->role ?? null,
            'comment'     => $data['comment'],
        ]);

        return ApiResponseHelper::success('Support comment saved', $comment, 201);
    }

    /**
     * Update an existing support comment.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $comment = StudentSupportComment::find($id);
        if (!$comment) {
            return ApiResponseHelper::error('Comment not found', 404);
        }

        $data = $request->validate([
            'comment' => 'required|string',
        ]);

        $comment->update(['comment' => $data['comment']]);

        return ApiResponseHelper::success('Support comment updated', $comment);
    }

    /**
     * Delete a support comment.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if (!$user) {
            return ApiResponseHelper::error('Unauthenticated', 401);
        }

        $comment = StudentSupportComment::find($id);
        if (!$comment) {
            return ApiResponseHelper::error('Comment not found', 404);
        }

        $comment->delete();

        return ApiResponseHelper::success('Support comment deleted', null);
    }
}
