<?php

namespace App\Http\Controllers\Api;

use App\Models\Quiz;
use Illuminate\Http\Request;
use App\Services\QuizServices;
use App\Helper\ApiResponseHelper;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Quiz\StoreRequest;
use App\Http\Requests\Quiz\UpdateRequest;

class QuizController extends Controller
{
    protected $quizService;

    public function __construct(QuizServices $quizService)
    {
        $this->quizService = $quizService;
    }

    public function getQuiz($id, Request $request)
    {
        $subjectId = $request->query('subject_id') ? (int)$request->query('subject_id') : null;
        return $this->quizService->index($id, $subjectId);
    }

    public function addQuiz(StoreRequest $request)
    {
        return $this->quizService->add($request->validated());
    }

    public function updateQuiz(UpdateRequest $request,$id)
    {
        return $this->quizService->update($request->validated(),$id);
    }

    public function deleteQuiz($id)
    {
        return $this->quizService->destroy($id);
    }

    public function quizRequests()
    {
        try{
            $user = Auth::user();

            if($user->role === 'SCHOOL_ADMIN')
            {
                $school = $user->school;
                $requests = Quiz::where('school_id',$school->id)->where('status','pending')->get();
            }else if($user->role === 'HOD'){
                 $school = $user->teacherUser;
                $requests = Quiz::where('school_id',$school->school_id)->where('status','pending')->get();

            }

            return ApiResponseHelper::success(
                'Quiz Adding Requests Fetched Successfully',
                $requests
            );

        }catch(\Exception $e){
            return ApiResponseHelper::error(
                'Issue Occured'.$e->getMessage(),
            );

        }
    }

    public function approveQuiz($id)
    {
        try{
            $quiz = Quiz::find($id);
            if(!$quiz)
            {
                return ApiResponseHelper::notFound(
                    'Quiz Not Found'
                );
            }

            $quiz->update([
                'status' => 'active'
            ]);

            return ApiResponseHelper::success(
                'Quiz Approved',
                $quiz
            );

        }catch(\Exception $e){
            return response()->json([
                'staus_code'=> 500,
                'msg' => 'Issue Occured'. $e->getMessage(),
                
            ]);
        }
    }

    public function rejectQuiz($id)
    {
         try{
            $quiz = Quiz::find($id);
            if(!$quiz)
            {
                return ApiResponseHelper::notFound(
                    'Quiz Not Found'
                );
            }

            $quiz->delete();

            return ApiResponseHelper::success(
                'Quiz Rejected',
            
            );

        }catch(\Exception $e){
            return response()->json([
                'staus_code'=> 500,
                'msg' => 'Issue Occured'. $e->getMessage(),
                
            ]);
        }
    }
}
