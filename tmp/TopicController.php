<?php

namespace App\Http\Controllers\Api;

use App\Helper\ApiResponseHelper;
use App\Models\Topic;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Tracker;
use Illuminate\Http\Request;
use App\Models\StudentTopicMark;
use PHPUnit\Event\Tracer\Tracer;
use App\Models\ProgressManagement;
use App\Models\TopicStatusProgress;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\TopicResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
class TopicController extends Controller
{
    public function getTopicsWithProgress1($trackerId) //pending
    {
        try {
            $user = Auth::user();
            // dd($user);
            $teacher = Teacher::where('email', $user->email)->first();
            if (!$teacher) {
                return response()->json([
                    'msg' => 'Teacher not found',
                    'status_code' => 404,
                ]);
            }
            $studentId = $teacher->id;
            $tracker = Tracker::find($trackerId);
            if (!$tracker) {
                return response()->json([
                    'msg' => 'Tracker not found',
                    'status_code' => 404,
                ]);
            }

            // Load topics with status progress for the given student
            $topics = Topic::where('tracker_id', $trackerId)
                ->with(['statusProgress' => function ($query) use ($studentId) {
                    $query->where('student_id', $studentId);
                }])
                ->get();

            return response()->json([
                'msg' => 'Tracker topics with student progress fetched',
                'status_code' => 200,
                // 'data' => $topics->toobject()
                // 'data' => (object) $topics
                'data' => json_decode(json_encode($topics)) // ← This line converts it to object


            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

//     public function getTopicsWithProgress($trackerId)
// {
//     try {
//         $id = Tracker::find($trackerId);
//         if(!$id) {
//             return ApiResponseHelper::notFound('Tracker not found');
//         }
        
//         $tracker = Tracker::with([
//             'topics.quiz',
//             'topics.quiz.quizQueston',
//             'topics.quiz.submissions.answers',
//             'topics.topicMark',
//             // 'topics.statusProgress.status',
//             'statusProgress' // This loads the tracker-level status progress
//         ])->findOrFail($trackerId);

//         // Get the tracker-level status progress
//         $trackerStatusProgress = $tracker->statusProgress;

//         // Loop through topics and add status_progress to each topic
//         foreach ($tracker->topics as $topic) {
//             // Add the tracker's status_progress to this topic
//             $topic->status_progress = $trackerStatusProgress;

//             // Your existing processing logic
//             if ($topic->quiz && $topic->quiz->quizQueston) {
//                 $totalMarks = $topic->quiz->quizQueston->sum(function ($question) {
//                     return (float) $question->marks;
//                 });
//                 $topic->quiz->total_marks = $totalMarks;
//                 unset($topic->quiz->quizQueston);
//             }

//             if ($topic->quiz && $topic->quiz->submissions) {
//                 foreach ($topic->quiz->submissions as $submission) {
//                     $obtainedMarks = $submission->answers->sum(function ($answer) {
//                         return (float) $answer->marks;
//                     });
//                     $submission->obtained_marks = $obtainedMarks;
//                     unset($submission->answers);
//                 }
//             }
//         }

//         // Remove the tracker-level status_progress from the main response
//         // unset($tracker->status_progress);

//         return response()->json([
//             'msg' => 'Tracker topics fetched successfully',
//             'status_code' => 200,
//             'data' => $tracker
//         ]);
        
//     } catch (\Exception $e) {
//         return response()->json([
//             'msg' => 'Error: ' . $e->getMessage(),
//             'status_code' => 500,
//         ]);
//     }
// }

    public function getTopicsWithProgress(Request $request, $trackerId)
    {
        try {
            $this->ensureTrackerAccess($request, (int) $trackerId, false);

            $id = Tracker::find($trackerId);

            if(!$id)
            {
                return ApiResponseHelper::notFound(
                    'Tracker not found',
                );
            }

            $tracker = Tracker::with([
                'topics.quiz',
                'topics.quiz.quizQueston',
                'topics.quiz.submissions.answers',
                'topics.topicMark',//new to get the topic marks of student
                'topics.statusProgress.status', //i use it becuase when studnet check topic the check was not shwoing
                'statusProgress' //i use it becuase when we add the topic without assigning the tracker
                // 'statusProgress'
            ])->findOrFail($trackerId);

             // Transform data: calculate obtained_marks for each submission
            // foreach ($tracker->topics as $topic) {
            //     if ($topic->quiz && $topic->quiz->submissions) {
            //         foreach ($topic->quiz->submissions as $submission) {
            //             $obtainedMarks = $submission->answers->sum(function ($answer) {
            //                 return (float) $answer->marks;
            //             });

            //             // Add obtained_marks field
            //             $submission->obtained_marks = $obtainedMarks;

            //             // Optionally remove answers array if you don't need it
            //             unset($submission->answers);
            //         }
            //     }
            // }
              // Loop through topics
            foreach ($tracker->topics as $topic) {
                //  Calculate total_marks for each quiz
                if ($topic->quiz && $topic->quiz->quizQueston) {
                    $totalMarks = $topic->quiz->quizQueston->sum(function ($question) {
                        return (float) $question->marks;
                    });

                    // Add total_marks field to quiz
                    $topic->quiz->total_marks = $totalMarks;

                    // Optionally remove quiz questions to clean response
                    unset($topic->quiz->quizQueston);
                }

                //  Calculate obtained_marks for each submission
                if ($topic->quiz && $topic->quiz->submissions) {
                    foreach ($topic->quiz->submissions as $submission) {
                        $obtainedMarks = $submission->answers->sum(function ($answer) {
                            return (float) $answer->marks;
                        });

                        $submission->obtained_marks = $obtainedMarks;

                        // Optionally remove answers array
                        unset($submission->answers);
                    }
                }
            }

            return response()->json([
                'msg' => 'Tracker topics fetched successfully',
                'status_code' => 200,
                'data' => $tracker
                // 'dd' => 'sss'
                
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function reorderTopics(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
        ]);

        foreach ($request->orders as $item) {
            $topicId = (int) ($item['id'] ?? 0);
            $this->ensureTopicAccess($request, $topicId, true);
        }

        foreach ($request->orders as $item) {
            Topic::where('id', $item['id'])
                ->update(['position' => $item['position']]);
        }

        return response()->json([
            'msg' => 'Topic Order Updated Successfully',
            'status_code' => 200
        ]);
    }


    public function addTopic(Request $request)
    {
        $request->validate([
            'tracker_id' => 'required|exists:trackers,id',
            'title' => 'required|string',
            'marks' => 'required'
        ]);

        try {
            $this->ensureTrackerAccess($request, (int) $request->tracker_id, true);

            // Get all students assigned to the tracker (via class_id or pivot table)
            $tracker = Tracker::with('classes.students')->find($request->tracker_id);
            //   // Check if tracker has classes assigned
            // if ($tracker->classes->isEmpty()) {
            //     return response()->json([
            //         'msg' => 'Please assign classes to this tracker before adding topics.',
            //         'status_code' => 400,
            //     ]);
            // }
            $last = Topic::where('tracker_id', $request->tracker_id)
                    ->max('position');

            $topic = Topic::create([
                'tracker_id' => $request->tracker_id,
                'title' => $request->title,
                'type' => 'topic',
                'marks' => $request->marks,
                'position' => $last + 1,

            ]);

            $updateTracker = Tracker::find($request->tracker_id);
            if($updateTracker){
                $updateTracker->is_topic = true;
                $updateTracker->save();
            }
            // Get statuses linked to the tracker
            $statusIds = Tracker::find($request->tracker_id)->statuses->pluck('id');
            // dd($statusIds);

         
            // dd($tracker->toArray());
            // $students = $tracker->class;
            // dd($students);
            // $students = $tracker->class->students;
            $students = collect();
            foreach ($tracker->classes as $class) {
                $students = $students->merge($class->students);
            }
            // dd($students);

            foreach ($students as $student) {
                foreach ($statusIds as $statusId) {
                    TopicStatusProgress::updateOrCreate(
                        [
                            'topic_id' => $topic->id,
                            'status_id' => $statusId,
                            'student_id' => $student->id,
                        ],
                        [
                            'is_completed' => false
                        ]
                    );
                }
            }

            return response()->json([
                'msg' => 'Topic added successfully with progress statuses',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function updateTopic(Request $request, $id)
    {
        // dd("skdks");
        $request->validate([
            // 'tracker_id' => 'required|exists:trackers,id',
            'title' => 'required|string',
            'marks'=> 'required'
        ]);

        try {
            $this->ensureTopicAccess($request, (int) $id, true);

            $topic = Topic::find($id);

            $topic->update([
                // 'tracker_id' => $request->tracker_id,
                'title' => $request->title,
                'type' => 'topic',
                'marks' => $request->marks

            ]);

            return response()->json([
                'msg' => 'Topic updated successfully',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function deleteTopic($id)
    {
        try {
            $this->ensureTopicAccess(request(), (int) $id, true);

            $topic = Topic::find($id);
            $topic->delete();

            return response()->json([
                'msg' => 'Topic deleted successfully',
                'status_code' => 200,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function getStudentTrackerTopics0($trackerId, $studentId)
    {
        try {
            $tracker = Tracker::where('id', $trackerId)
                ->with([
                    'topics' => function ($query) use ($studentId) {
                        $query->with([
                            'statusProgress' => function ($progressQuery) use ($studentId) {
                                $progressQuery->where('student_id', $studentId)
                                    ->with('status');
                            },
                            'topicMark' => function ($markQuery) use ($studentId) {
                                $markQuery->where('student_id', $studentId);
                            }
                        ]);
                    }
                ])
                ->first(); // use first() since you're getting one tracker

            if (!$tracker) {
                return response()->json([
                    'msg' => 'Tracker not found',
                    'status_code' => 404,
                ]);
            }

            return response()->json([
                'msg' => 'Tracker fetched successfully',
                'status_code' => 200,
                'data' => $tracker
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }


    public function getStudentTrackerTopics2($studentId)
    {
        try {
            $trackers = Tracker::with([
                'topics' => function ($query) use ($studentId) {
                    $query->with([
                        'statusProgress' => function ($progressQuery) use ($studentId) {
                            $progressQuery->where('student_id', $studentId)
                                ->with('status');
                        },
                        'topicMark' => function ($markQuery) use ($studentId) {
                            $markQuery->where('student_id', $studentId);
                        }
                    ]);
                }
            ])->get();

            return response()->json([
                'msg' => 'Tracker Fetched successfully',
                'status_code' => 200,
                'data' => $trackers
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function getStudentTrackerTopics121($studentId, $trackerId)
    {
        try {
            $trackers = Tracker::with([
                'topics' => function ($query) use ($studentId) {
                    $query->with([
                        'statusProgress' => function ($progressQuery) use ($studentId) {
                            $progressQuery->where('student_id', $studentId)
                                ->with('status');
                        },
                        'topicMark' => function ($markQuery) use ($studentId) {
                            $markQuery->where('student_id', $studentId);
                        },
                        'quiz'
                    ]);
                }
            ])
            ->find($trackerId); // changed to find instead of get

            if (!$trackers) {
                return ApiResponseHelper::notFound('Tracker not found');
            }

            return response()->json([
                'msg' => 'Tracker fetched successfully',
                'status_code' => 200,
                'data' => json_decode(json_encode($trackers))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function getStudentTrackerTopics(Request $request, $studentId, $trackerId)
    {
        try {
            $this->ensureTrackerAccess($request, (int) $trackerId, false);
            $this->ensureStudentTargetAccess($request, (int) $studentId);

            $trackers = Tracker::with([
                'topics' => function ($query) use ($studentId) {
                    $query->with([
                        'statusProgress' => function ($progressQuery) use ($studentId) {
                            $progressQuery->where('student_id', $studentId)
                                ->with('status');
                        },  //I have comment and add statusProgress at the end becuase we need to show the tracker statuses insted it is not assigned to any class
                        'topicMark' => function ($markQuery) use ($studentId) {
                            $markQuery->where('student_id', $studentId);
                        },
                        'quiz' => function ($q) use ($studentId) {
                            $q->withSum('quizQueston as total_marks', 'marks') // total possible marks
                            ->with(['submissions' => function ($submissionQuery) use ($studentId) {
                                $submissionQuery->where('student_id', $studentId)
                                    ->withSum('answers as obtained_marks', 'marks'); // student obtained marks
                            }]);
                        }
                    ]);
                },
                'statusProgress' // i have not remove in suggesstion of saeed because some time it create error
            ])
            ->find($trackerId);

            // dd($trackers->toArray());


            if (!$trackers) {
                return ApiResponseHelper::notFound('Tracker not found');
            }

            // $certificateEligible = true;

            // foreach ($trackers->topics as $topic) {

            //     foreach ($topic->statusProgress as $progress) {

            //         if ($progress->is_completed == false) {
            //             $certificateEligible = false;
            //             break 2; // topic + tracker dono loop break
            //         }
            //     }
            // }

            return response()->json([
                'msg' => 'Tracker fetched successfully',
                'status_code' => 200,
                // 'certificate_eligible' => $certificateEligible,
                'data' => json_decode(json_encode($trackers))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }


    public function addTopicMarks(Request $request)
    {
        try {
            $request->validate([
                'topic_id' => 'required|integer|exists:topics,id',
                'marks' => 'required',
            ]);

            $this->ensureTopicAccess($request, (int) $request->topic_id, true);

            // $tracker = Tracker::with('topics')->where('student_id', $id)->get();
            $topic = Topic::find($request->topic_id);
            $topic->marks = $request->marks;
            $topic->save();


            return response()->json([
                'msg' => 'Marks Added successfully',
                'status_code' => 200,
                'data' => $topic
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function getTrackerTopics(Request $request, $id)
    {
        try {
            $this->ensureTrackerAccess($request, (int) $id, false);

            $tracker = Tracker::find($id);
            if (!$tracker) {
                return response()->json([
                    'msg' => 'Tracker Not Found ',
                    'status_code' => 404,
                ]);
            }

            $topics = $tracker->topics;
            return response()->json([
                'msg' => 'tracker topics fetched',
                'status_code' => 200,
                'data' => $topics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function getStudentTopicsProgress(Request $request, $trackerId, $studentId)
    {
        try {
            $this->ensureTrackerAccess($request, (int) $trackerId, false);
            $this->ensureStudentTargetAccess($request, (int) $studentId);

            $tracker = Tracker::find($trackerId);
            if (!$tracker) {
                return response()->json([
                    'msg' => 'Tracker not found',
                    'status_code' => 404,
                ]);
            }

            $topics = Topic::where('tracker_id', $trackerId)
                ->with([
                    'statusProgress.status', // no student_id filter here
                    'topicMark' => function ($query) use ($studentId) {
                        $query->where('student_id', $studentId);
                    }
                ])
                ->get();

            return response()->json([
                'msg' => 'Tracker topics with student progress fetched',
                'status_code' => 200,
                'data' => $topics
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Error: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }


    public function addStudentTopicMarks(Request $request)
    {
        try {
            Log::info('addStudentTopicMarks called', [
                'payload' => $request->all(),
                'user_id' => Auth::id(),
                'role' => Auth::user()->role
            ]);

            $request->validate([
                'topic_id' => 'required',
                'student_id' => 'required',
                'marks' => 'required'
            ]);

            $this->ensureTopicAccess($request, (int) $request->topic_id, true);
            $this->ensureStudentTargetAccess($request, (int) $request->student_id);

            $user = Auth::user();

            // find existing marks
            $existing = StudentTopicMark::where('topic_id', $request->topic_id)
            ->where('student_id', $request->student_id)
            ->first();

            Log::info('Existing records found', [
                'count' => $existing ? 1 : 0,
                'records' => $existing ? [$existing->id] : []
            ]);

            if ($existing && $existing->teacher_locked == true) {
                 Log::warning('Marks already locked by teacher', [
                    'student_id' => $request->student_id,
                    'topic_id' => $request->topic_id,
                    'attempted_by' => $user->role
                ]);

                // teacher can still update
                if ($this->resolveRole($user) === 'STUDENT') {
                    return response()->json([
                        'msg' => 'Teacher has finalized the marks. Student cannot update.',
                        'status_code' => 403
                    ]);
                }
            }

            $isTeacher = $this->resolveRole($user) !== 'STUDENT';

            $marksValue = $request->marks;
            if (is_array($marksValue)) {
                $marksValue = $marksValue[0] ?? null;
            }
            $marksValue = is_null($marksValue) ? null : trim((string) $marksValue);
            if ($marksValue === '' || !preg_match('/^\d+$/', (string) $marksValue)) {
                return response()->json([
                    'msg' => 'Marks must be a whole number.',
                    'status_code' => 422,
                ], 422);
            }

            Log::info('Calling updateOrCreate', [
                'student_id' => $request->student_id,
                'topic_id' => $request->topic_id,
                'marks' => $marksValue,
                'teacher_locked' => $isTeacher
            ]);

            $marks = StudentTopicMark::updateOrCreate(
                [
                    'topic_id' => $request->topic_id,
                    'student_id' => $request->student_id
                ],
                [
                    'marks' => $marksValue,
                    'teacher_locked' => $isTeacher ? true : false

                ]
            );

            Log::info('updateOrCreate result', [
                'record_id' => $marks->id,
                'was_recently_created' => $marks->wasRecentlyCreated
            ]);

            return response()->json([
                'msg' => ' topic Marks added successfully',
                'status_code' => 200,
                'data' => $marks
            ]);
        } catch (\Exception $e) {
            Log::error('Error in addStudentTopicMarks', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);
            
            return response()->json([
                'msg' => 'Issue Occured' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    private function ensureTopicAccess(Request $request, int $topicId, bool $write): void
    {
        $trackerId = (int) DB::table('topics')->where('id', $topicId)->value('tracker_id');
        if ($trackerId <= 0) {
            abort(response()->json(['msg' => 'Topic not found', 'status_code' => 404], 404));
        }

        $this->ensureTrackerAccess($request, $trackerId, $write);
    }

    private function ensureStudentTargetAccess(Request $request, int $studentId): void
    {
        $role = $this->resolveRole($request->user());
        if ($role !== 'STUDENT') {
            return;
        }

        $ownStudentId = (int) DB::table('students')->where('user_id', $request->user()->id)->value('id');
        if ($ownStudentId !== $studentId) {
            abort(response()->json(['msg' => 'Forbidden', 'status_code' => 403], 403));
        }
    }

    private function ensureTrackerAccess(Request $request, int $trackerId, bool $write): void
    {
        $user = $request->user();
        $role = $this->resolveRole($user);

        if ($write && !in_array($role, ['SCHOOL_ADMIN', 'HOD', 'TEACHER'], true)) {
            abort(response()->json(['msg' => 'Forbidden role', 'status_code' => 403], 403));
        }

        if ($role === 'SCHOOL_ADMIN') {
            return;
        }

        if ($role === 'STUDENT') {
            $student = DB::table('students')->where('user_id', $user->id)->select('id', 'class_id')->first();
            if (!$student) {
                abort(response()->json(['msg' => 'Forbidden', 'status_code' => 403], 403));
            }

            $allowed = DB::table('assign_trackers')
                ->where('tracker_id', $trackerId)
                ->where(function ($query) use ($student) {
                    $query->where('student_id', (int) $student->id)
                        ->orWhere(function ($inner) use ($student) {
                            $inner->whereNull('student_id')
                                ->where('class_id', (int) $student->class_id);
                        });
                })
                ->exists();

            if (!$allowed) {
                abort(response()->json(['msg' => 'Forbidden', 'status_code' => 403], 403));
            }

            return;
        }

        if (in_array($role, ['HOD', 'TEACHER'], true)) {
            $teacherId = (int) DB::table('teachers')->where('user_id', $user->id)->value('id');
            if ($teacherId <= 0) {
                abort(response()->json(['msg' => 'Forbidden', 'status_code' => 403], 403));
            }

            $classIds = DB::table('assign_teachers')
                ->where('teacher_id', $teacherId)
                ->pluck('class_id')
                ->map(fn ($id) => (int) $id)
                ->toArray();

            if (count($classIds) === 0) {
                abort(response()->json(['msg' => 'Forbidden', 'status_code' => 403], 403));
            }

            $allowed = DB::table('assign_trackers')
                ->where('tracker_id', $trackerId)
                ->whereIn('class_id', $classIds)
                ->exists();

            if (!$allowed) {
                abort(response()->json(['msg' => 'Forbidden', 'status_code' => 403], 403));
            }

            return;
        }

        abort(response()->json(['msg' => 'Forbidden', 'status_code' => 403], 403));
    }

    private function resolveRole(object $user): string
    {
        return strtoupper(str_replace(' ', '_', (string) ($user->role ?? $user->user_type ?? '')));
    }

}
