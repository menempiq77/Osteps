<?php
namespace App\Services;

use App\Models\Quiz;
use App\Http\Resources\QuizResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class QuizServices
{
    public function index($id, $subjectId = null)
    {
        try{
            $query = Quiz::where('school_id', $id)->where('status', 'active');

            if ($subjectId) {
                $query->where('subject_id', $subjectId);
            }

            $quiz = $query->get();

            return response()->json([
                'staus_code'=> 200,
                'msg' => 'Quiz Fetched successfully',
                'data' => QuizResource::collection($quiz)
            ]);

        }catch(\Exception $e){
            return response()->json([
                'staus_code'=> 500,
                'msg' => 'Issue Occured'. $e->getMessage(),
                
            ]);
        }
    }

    public function add(array $data)
    {
        try{
            $user = Auth::user();

            $status = 'pending';

            if (in_array($user->role, ['SCHOOL_ADMIN', 'HOD'])) {
                $status = 'active';
            }

            $quiz = Quiz::create([
                'name' => $data['name'],
                'school_id' => $data['school_id'],
                'subject_id' => $data['subject_id'] ?? null,
                'status' => $status
            ]);

            return response()->json([
                'staus_code'=> 200,
                'msg' => 'Quiz Added successfully',
                'data' => new QuizResource($quiz)
            ]);

        }catch(\Exception $e){
        return response()->json([
                'staus_code'=> 500,
                'msg' => 'Issue Occured'. $e->getMessage(),
            ]);
        }
    }

    public function update(array $data, $id)
    {
        try{
            $user = Auth::user();

            $status = 'pending';

            if (in_array($user->role, ['SCHOOL_ADMIN', 'HOD'])) {
                $status = 'active';
            }

            $quiz = Quiz::find($id);

            $updateData = [
                'name' => $data['name'],
                'school_id' => $data['school_id'],
                'status' => $status
            ];

            if (array_key_exists('subject_id', $data)) {
                $updateData['subject_id'] = $data['subject_id'];
            }

            $quiz->update($updateData);

            return response()->json([
                'staus_code'=> 200,
                'msg' => 'Quiz Updated successfully',
                'data' => new QuizResource($quiz)
            ]);

        }catch(\Exception $e){
            return response()->json([
                'staus_code'=> 500,
                'msg' => 'Issue Occured'. $e->getMessage(),
                
            ]);
        }
    }

    public function destroy($id)
    {
        try{
             Quiz::find($id);
            $quiz = Quiz::with(['quizQueston','QuestonOption'])->find($id);

            $quiz->QuestonOption()->delete();
            $quiz->quizQueston()->delete();
            $quiz->delete();

            return response()->json([
                'staus_code'=> 200,
                'msg' => 'Quiz Deleted successfully',
                'data' => []
            ]);

        }catch(\Exception $e){
            return response()->json([
                'staus_code'=> 500,
                'msg' => 'Issue Occured'. $e->getMessage(),
                
            ]);
        }
    }

}
