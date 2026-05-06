<?php

namespace App\Http\Controllers\Api;

use App\DTOs\AnswerMarkDTO;
use App\Helper\ApiResponseHelper;
use App\Models\Quiz;
use App\Models\QuizAnswer;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use App\Models\QuestionOption;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMarkRequest;
use App\Http\Resources\MarkResource;
use App\Models\StudentSubmittedQuiz;
use App\Services\MarkServices;

class QuizQuestionController extends Controller
{
    public function __construct(protected MarkServices $markServices)
    {
        
    }

    protected function nextQuestionPosition(int $quizId): int
    {
        $currentMax = QuizQuestion::where('quiz_id', $quizId)->max('position');

        return ((int) $currentMax) + 1;
    }

    public function store(Request $request)
    {
        $question = QuizQuestion::create([
            'quiz_id' => $request->quiz_id,
            'question_text' => $request->question_text,
            'type' => $request->type,
            'correct_answer' => in_array($request->type, ['true_false', 'written']) ? $request->correct_answer : null,
            'marks' => $request->marks,
            'position' => $request->input('position', $this->nextQuestionPosition((int) $request->quiz_id)),
        ]);

        // Handle multiple choice, dropdown, or checkboxes
        if (in_array($request->type, ['multiple_choice', 'drop_down', 'check_boxes'])) {
            foreach ($request->options as $index => $option) {
                $isCorrect = false;

                if ($request->type === 'check_boxes' && is_array($request->correct_answer)) {
                    $isCorrect = in_array($index, $request->correct_answer);
                } else {
                    $isCorrect = $request->correct_answer == $index;
                }

                $question->options()->create([
                    'option_text' => $option,
                    'is_correct' => $isCorrect,
                ]);
            }
        }

        return response()->json([
            'status_code' => 200,
            'msg' =>  'Quiz Question and Options added successfully',
            'data' => $question->load('options')
        ]);
    } 

    public function update(Request $request, $id)
    {
        $question = QuizQuestion::find($id);

        if (!$question) {
            return response()->json([
                'status_code' => 404,
                'msg' => 'Quiz Question not found'
            ]);
        }

        // Update the main question
        $question->update([
            'quiz_id' => $request->quiz_id,
            'question_text' => $request->question_text,
            'type' => $request->type,
            'correct_answer' => in_array($request->type, ['true_false', 'written']) ? $request->correct_answer : null,
            'marks' => $request->marks,
            'position' => $request->input('position', $question->position),
        ]);

        // Handle options for MCQs, dropdowns, checkboxes
        if (in_array($request->type, ['multiple_choice', 'drop_down', 'check_boxes'])) {
            // Delete old options if needed, or update them properly
            $existingOptions = $question->options;
            foreach ($request->options as $index => $optionText) {
                $isCorrect = false;

                if ($request->type === 'check_boxes' && is_array($request->correct_answer)) {
                    $isCorrect = in_array($index, $request->correct_answer);
                } else {
                    $isCorrect = $request->correct_answer == $index;
                }

                if (isset($existingOptions[$index])) {
                    // Update existing option
                    $existingOptions[$index]->update([
                        'option_text' => $optionText,
                        'is_correct' => $isCorrect,
                    ]);
                } else {
                    // Add new option if not enough existing
                    $question->options()->create([
                        'option_text' => $optionText,
                        'is_correct' => $isCorrect,
                    ]);
                }
            }

            // Optionally delete any extra old options
            if (count($existingOptions) > count($request->options)) {
                for ($i = count($request->options); $i < count($existingOptions); $i++) {
                    $existingOptions[$i]->delete();
                }
            }
        }

        return response()->json([
            'status_code' => 200,
            'msg' => 'Quiz Question and Options Updated successfully',
            'data' => $question->load('options') // include updated options in response
        ]);
    }

    public function reorder(Request $request, $quizId)
    {
        $validated = $request->validate([
            'question_ids' => ['required', 'array', 'min:1'],
            'question_ids.*' => ['required', 'integer'],
        ]);

        $quiz = Quiz::with('quizQueston.options')->find($quizId);

        if (!$quiz) {
            return response()->json([
                'status_code' => 404,
                'msg' => 'Quiz Not Found',
                'data' => null,
            ]);
        }

        $submittedQuestionIds = array_map('intval', $validated['question_ids']);
        $existingQuestionIds = $quiz->quizQueston->pluck('id')->map(fn ($id) => (int) $id)->values()->all();

        sort($submittedQuestionIds);
        sort($existingQuestionIds);

        if ($submittedQuestionIds !== $existingQuestionIds) {
            return response()->json([
                'status_code' => 422,
                'msg' => 'Question order must include each quiz question exactly once.',
                'data' => null,
            ], 422);
        }

        DB::transaction(function () use ($validated) {
            foreach ($validated['question_ids'] as $index => $questionId) {
                QuizQuestion::where('id', $questionId)->update([
                    'position' => $index + 1,
                ]);
            }
        });

        $quiz->load('quizQueston.options');

        return response()->json([
            'status_code' => 200,
            'msg' => 'Quiz questions reordered successfully',
            'data' => $quiz,
        ]);
    }


    public function getQuizQuestion($id)
    {
        try {
            $quiz = Quiz::with('quizQueston.options')->find($id);

            if (!$quiz) {
                return response()->json([
                    'status_code' => 404,
                    'msg' => 'Quiz Not Found',
                    'data' => null
                ]);
            }

            // Optional: Accessing options manually if needed
            if ($quiz->questions && $quiz->questions->count() > 0) {
                foreach ($quiz->questions as $question) {
                    if ($question->options && $question->options->count() > 0) {
                        foreach ($question->options as $option) {
                            // Do something
                        }
                    }
                }
            }
            

            return response()->json([
                'status_code' => 200,
                'msg' => 'Quiz Found',
                'data' => $quiz
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status_code' => 500,
                'msg' => 'Something went wrong',
                'error' => $e->getMessage()
            ]);
        }
    }

    public function delete($id)
    {
        try {
            $question = QuizQuestion::find($id);
            // dd($question);

            if (!$question) {
                return response()->json([
                    'status_code' => 404,
                    'msg' => 'Quiz Not Found',
                    'data' => null
                ]);
            }
            $question->options()->delete(); // assuming `options()` is the relationship method

            $question->delete();

            return response()->json([
                'status_code' => 200,
                'msg' => 'Quiz Deleted Successfully',
                'data' => []
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status_code' => 500,
                'msg' => 'Something went wrong',
                'error' => $e->getMessage()
            ]);
        }
    }
    
    //student submit the quiz
    public function submitQuizAnswers(Request $request)  
    {
        DB::beginTransaction();
        try {
            $query = StudentSubmittedQuiz::where('quiz_id', $request->quiz_id)
                ->where('student_id', $request->student_id)
                ->where('type', $request->type);

            if ($request->type === 'task') {
                $query->where('assessment_id', $request->assessment_id);
            }
                
            $existingSubmission = $query->first();

            if ($existingSubmission) {
                // Allow re-submission: delete old answers and reuse the submission record
                QuizAnswer::where('quiz_submission_id', $existingSubmission->id)->delete();
                $existingSubmission->update(['submitted_at' => now(), 'self_assessment_mark' => $request->self_assessment_mark]);
                $submission = $existingSubmission;
            } else {
                $submission = StudentSubmittedQuiz::create([
                    'quiz_id' => $request->quiz_id,
                    'student_id' => $request->student_id,
                    'assessment_id' => $request->assessment_id,
                    'submitted_at' => now(),
                    'type' => $request->type,
                    'submission_type' => 'quiz',
                    'status' => 'completed',
                    'self_assessment_mark' => $request->self_assessment_mark
                ]);
            }

            foreach ($request->answers as $answerData) {
                $question = QuizQuestion::find($answerData['question_id']);
                $answer = $answerData['answer'];

                // Determine correctness
                $isCorrect = false;

                // if ($question->type === 'written') {
                //     $isCorrect = strtolower(trim($question->correct_answer)) === strtolower(trim($answer));
                if ($question->type === 'written') {
                    // similar_text(strtolower(trim($question->correct_answer)), strtolower(trim($answer)), $percent);
                    // $isCorrect = $percent >= 30; 
                    $isCorrect = null;

                } elseif ($question->type === 'true_false') {
                    $isCorrect = $question->correct_answer == $answer;
                } elseif ($question->type === 'multiple_choice' || $question->type === 'drop_down') {
                    $option = QuestionOption::find($answer);
                    $isCorrect = $option?->is_correct;
                } elseif ($question->type === 'check_boxes') {
                    $correctAnswers = $question->options()->where('is_correct', true)->pluck('id')->sort()->values();
                    $submittedAnswers = collect($answer)->sort()->values();
                    $isCorrect = $correctAnswers->toArray() === $submittedAnswers->toArray();
                }

                // Auto-assign marks for auto-correctable question types
                $autoMark = null;
                $autoCorrectTypes = ['multiple_choice', 'drop_down', 'true_false', 'check_boxes'];
                if (in_array($question->type, $autoCorrectTypes)) {
                    $autoMark = $isCorrect ? $question->marks : 0;
                }

                // Store the student's answer
                QuizAnswer::create([
                    'quiz_submission_id' => $submission->id,
                    'quiz_question_id' => $question->id,
                    'answer' => json_encode($answer),
                    'is_correct' => $isCorrect,
                    'marks' => $autoMark,
                ]);
            }

            DB::commit();

            // Auto-update teacher_assessment_mark with sum of all auto-marks so far
            $autoMarksTotal = QuizAnswer::where('quiz_submission_id', $submission->id)
                ->whereNotNull('marks')
                ->sum('marks');
            $submission->update(['teacher_assessment_mark' => $autoMarksTotal]);

            return response()->json([
                'status' => 200,
                'message' => 'Quiz submitted successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 500,
                'message' => 'Failed to submit quiz.',
                'error' => $e->getMessage(),
            ]);
        }
    }

    //get the submitted quiz of student
    public function getSubmittedQuizDetails($quizId,$studentId,$type)
    {
        $submission = StudentSubmittedQuiz::where('quiz_id', $quizId)
        ->where('student_id', $studentId)
        ->where('type',$type)
        ->with(['answers.question'])
        ->first();

        if (!$submission) {
            return response()->json([
                'status' => 404,
                'message' => 'No submission found for this quiz by the student.',
            ]);
        }

        $details = $submission->answers->map(function ($answer) {
            return [
                'id' => $answer->id,
                'question_id' => $answer->quiz_question_id,
                'question_text' => $answer->question?->question_text,
                'question_type' => $answer->question?->type,
                'submitted_answer' => json_decode($answer->answer),
                'is_correct' => $answer->is_correct,
                'correct_answer' => $answer->question?->correct_answer,
                'marks' => $answer->marks
            ];
        });

        return response()->json([
            'status' => 200,
            'message' => 'Submitted quiz details fetched successfully.',
            'data' => $details,
        ]);
    }

    public function markAnswer(StoreMarkRequest $request, $id)
    {
     
        $dto = AnswerMarkDTO::fromRequest($request);

        $answer = $this->markServices->markAnswer($dto,$id);

        return ApiResponseHelper::success(
            'Answer Mark Added Successfully',
            new MarkResource($answer)
        );

    }


    public function updateQuizSubmissionMark(Request $request, $submissionId)
    {
        $submission = StudentSubmittedQuiz::findOrFail($submissionId);
        $submission->update(["teacher_assessment_mark" => $request->teacher_assessment_mark]);
        return response()->json(["status"=>200,"message"=>"Mark updated.","data"=>$submission]);
    }

}
