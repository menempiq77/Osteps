<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Get the school_id for a given user based on their role.
     */
    private function getUserSchoolId($user)
    {
        if (in_array($user->role, ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ADMIN'])) {
            $school = DB::table('schools')->where('user_id', $user->id)->first();
            return $school ? $school->id : null;
        }

        if (in_array($user->role, ['TEACHER', 'HOD'])) {
            $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
            return $teacher ? $teacher->school_id : null;
        }

        if ($user->role === 'STUDENT') {
            $student = DB::table('students')->where('user_id', $user->id)->first();
            return $student ? $student->school_id : null;
        }

        return null;
    }

    /**
     * Get all user IDs belonging to a given school.
     */
    private function getSchoolUserIds($schoolId)
    {
        if (!$schoolId) return collect();

        $adminIds = DB::table('schools')->where('id', $schoolId)->pluck('user_id');
        $teacherIds = DB::table('teachers')->where('school_id', $schoolId)->pluck('user_id')->filter();
        $studentIds = DB::table('students')->where('school_id', $schoolId)->pluck('user_id')->filter();

        return $adminIds->merge($teacherIds)->merge($studentIds)->unique();
    }

    /**
     * List conversations for the authenticated user.
     */
    public function conversations(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::whereHas('participants', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->with(['latestMessage.sender', 'users'])
        ->get()
        ->map(function ($conv) use ($userId) {
            $participant = $conv->participants->where('user_id', $userId)->first();
            $lastRead = $participant ? $participant->last_read_at : null;

            $unreadCount = $conv->messages()
                ->where('sender_id', '!=', $userId)
                ->when($lastRead, function ($q) use ($lastRead) {
                    $q->where('created_at', '>', $lastRead);
                })
                ->count();

            $otherUsers = $conv->users->where('id', '!=', $userId)->values()->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'role' => $u->role,
                ];
            });

            return [
                'id' => $conv->id,
                'type' => $conv->type,
                'name' => $conv->type === 'group' ? $conv->name : ($otherUsers->first()['name'] ?? 'Unknown'),
                'participants' => $otherUsers,
                'last_message' => $conv->latestMessage ? [
                    'id' => $conv->latestMessage->id,
                    'body' => $conv->latestMessage->body,
                    'sender_id' => $conv->latestMessage->sender_id,
                    'sender_name' => $conv->latestMessage->sender->name ?? 'Unknown',
                    'created_at' => $conv->latestMessage->created_at->toIso8601String(),
                ] : null,
                'unread_count' => $unreadCount,
                'updated_at' => $conv->latestMessage ? $conv->latestMessage->created_at->toIso8601String() : $conv->created_at->toIso8601String(),
            ];
        })
        ->sortByDesc('updated_at')
        ->values();

        return response()->json(['data' => $conversations]);
    }

    /**
     * Create a new conversation.
     */
    public function createConversation(Request $request)
    {
        $request->validate([
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'integer|exists:users,id',
            'type' => 'in:direct,group',
            'name' => 'nullable|string|max:255',
        ]);

        $userId = $request->user()->id;
        $participantIds = collect($request->participant_ids)->unique()->values();
        $type = $request->type ?? (count($participantIds) > 1 ? 'group' : 'direct');

        // For direct chats, check if conversation already exists
        if ($type === 'direct' && count($participantIds) === 1) {
            $otherUserId = $participantIds[0];
            $existing = Conversation::where('type', 'direct')
                ->whereHas('participants', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                })
                ->whereHas('participants', function ($q) use ($otherUserId) {
                    $q->where('user_id', $otherUserId);
                })
                ->first();

            if ($existing) {
                return response()->json(['data' => ['id' => $existing->id, 'existing' => true]]);
            }
        }

        $schoolId = $this->getUserSchoolId($request->user());

        $conversation = DB::transaction(function () use ($userId, $participantIds, $type, $request, $schoolId) {
            $conv = Conversation::create([
                'school_id' => $schoolId,
                'type' => $type,
                'name' => $type === 'group' ? ($request->name ?? 'Group Chat') : null,
                'created_by' => $userId,
            ]);

            // Add creator as participant
            ConversationParticipant::create([
                'conversation_id' => $conv->id,
                'user_id' => $userId,
                'last_read_at' => now(),
            ]);

            // Add other participants
            foreach ($participantIds as $pid) {
                if ($pid != $userId) {
                    ConversationParticipant::create([
                        'conversation_id' => $conv->id,
                        'user_id' => $pid,
                    ]);
                }
            }

            return $conv;
        });

        return response()->json(['data' => ['id' => $conversation->id, 'existing' => false]], 201);
    }

    /**
     * Get messages for a conversation.
     */
    public function messages(Request $request, $conversationId)
    {
        $userId = $request->user()->id;

        // Verify user is a participant
        $isParticipant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->exists();

        if (!$isParticipant) {
            return response()->json(['error' => 'Not a participant'], 403);
        }

        $messages = Message::where('conversation_id', $conversationId)
            ->with('sender:id,name,role')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        $data = collect($messages->items())->map(function ($msg) {
            return [
                'id' => $msg->id,
                'body' => $msg->body,
                'sender_id' => $msg->sender_id,
                'sender_name' => $msg->sender->name ?? 'Unknown',
                'sender_role' => $msg->sender->role ?? '',
                'created_at' => $msg->created_at->toIso8601String(),
            ];
        });

        return response()->json([
            'data' => $data,
            'has_more' => $messages->hasMorePages(),
            'next_page' => $messages->currentPage() + 1,
        ]);
    }

    /**
     * Send a message.
     */
    public function sendMessage(Request $request, $conversationId)
    {
        $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $userId = $request->user()->id;

        $isParticipant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->exists();

        if (!$isParticipant) {
            return response()->json(['error' => 'Not a participant'], 403);
        }

        $message = Message::create([
            'conversation_id' => $conversationId,
            'sender_id' => $userId,
            'body' => $request->body,
        ]);

        // Mark as read for sender
        ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->update(['last_read_at' => now()]);

        return response()->json([
            'data' => [
                'id' => $message->id,
                'body' => $message->body,
                'sender_id' => $message->sender_id,
                'sender_name' => $request->user()->name,
                'sender_role' => $request->user()->role,
                'created_at' => $message->created_at->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * Mark conversation as read.
     */
    public function markRead(Request $request, $conversationId)
    {
        $userId = $request->user()->id;

        ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->update(['last_read_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * Get total unread count.
     */
    public function unreadCount(Request $request)
    {
        $userId = $request->user()->id;

        $total = 0;
        $participants = ConversationParticipant::where('user_id', $userId)->get();

        foreach ($participants as $p) {
            $query = Message::where('conversation_id', $p->conversation_id)
                ->where('sender_id', '!=', $userId);
            if ($p->last_read_at) {
                $query->where('created_at', '>', $p->last_read_at);
            }
            $total += $query->count();
        }

        return response()->json(['data' => ['unread_count' => $total]]);
    }

    /**
     * List available users to chat with (same school).
     */
    public function users(Request $request)
    {
        $user = $request->user();
        $search = $request->query('search', '');
        $schoolId = $this->getUserSchoolId($user);

        // Get all user IDs in the same school
        $schoolUserIds = $this->getSchoolUserIds($schoolId);

        $query = User::where('id', '!=', $user->id);

        // Filter to same school users only
        if ($schoolUserIds->isNotEmpty()) {
            $query->whereIn('id', $schoolUserIds);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                   ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        $users = $query->orderBy('name')
            ->limit(50)
            ->get(['id', 'name', 'email', 'role']);

        return response()->json([
            'data' => $users->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                ];
            }),
        ]);
    }
}
