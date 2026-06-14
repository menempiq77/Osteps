<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\SchoolNotification;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SchoolNotificationController extends Controller
{
    private function resolveSchool()
    {
        $user = Auth::user();
        if (!$user) {
            return null;
        }
        if ($user->role === 'SCHOOL_ADMIN') {
            return School::where('email', $user->email)->first()
                ?? School::where('user_id', $user->id)->first();
        }
        if ($user->role === 'HOD' || $user->role === 'TEACHER') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            return $teacher ? School::find($teacher->school_id) : null;
        }
        return null;
    }

    private function format($n)
    {
        return [
            'id' => $n->id,
            'type' => $n->type,
            'title' => $n->title,
            'message' => $n->message,
            'url' => $n->url,
            'data' => $n->data,
            'is_read' => !is_null($n->read_at),
            'read_at' => optional($n->read_at)->toDateTimeString(),
            'created_at' => optional($n->created_at)->toDateTimeString(),
            'time_ago' => optional($n->created_at)->diffForHumans(),
        ];
    }

    /**
     * GET school-notifications
     */
    public function index(Request $request)
    {
        $school = $this->resolveSchool();
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $items = SchoolNotification::where('school_id', $school->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($n) => $this->format($n));
        $unread = SchoolNotification::where('school_id', $school->id)->whereNull('read_at')->count();
        return response()->json([
            'status_code' => 200,
            'data' => ['notifications' => $items, 'unread_count' => $unread],
        ]);
    }

    /**
     * GET school-notifications/unread-count
     */
    public function unreadCount()
    {
        $school = $this->resolveSchool();
        if (!$school) {
            return response()->json(['status_code' => 200, 'data' => ['unread_count' => 0]]);
        }
        $unread = SchoolNotification::where('school_id', $school->id)->whereNull('read_at')->count();
        return response()->json(['status_code' => 200, 'data' => ['unread_count' => $unread]]);
    }

    /**
     * POST school-notifications/mark-all-read
     */
    public function markAllRead()
    {
        $school = $this->resolveSchool();
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        SchoolNotification::where('school_id', $school->id)->whereNull('read_at')->update(['read_at' => now()]);
        return response()->json(['status_code' => 200, 'msg' => 'All marked as read.']);
    }

    /**
     * POST school-notifications/{id}/read
     */
    public function markRead($id)
    {
        $school = $this->resolveSchool();
        if (!$school) {
            return response()->json(['status_code' => 403, 'msg' => 'Not authorised.'], 403);
        }
        $n = SchoolNotification::where('id', $id)->where('school_id', $school->id)->first();
        if ($n && is_null($n->read_at)) {
            $n->read_at = now();
            $n->save();
        }
        return response()->json(['status_code' => 200, 'msg' => 'Marked as read.']);
    }
}
