<?php
namespace App\Services;

use App\Models\User;
use App\ApiInterface;
use App\Models\School;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Tracker;
use App\Mail\TeacherEmail;

use App\TaskByIdInterface;
use App\Models\SchoolClass;
use App\Models\AssignTracker;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\ClassRequest;
use App\Models\TopicStatusProgress;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\StudentResource;

class StudentService implements ApiInterface,TaskByIdInterface
{
    public function add(array $data)
    {
        try {
            $user = Auth::user();
             if ($user->role === 'SCHOOL_ADMIN') {
            $school = School::where('email', $user->email)->first();
            } elseif ($user->role === 'HOD') {
                $teacher = Teacher::where('user_id',$user->id)->first();
                if (!$teacher) {
                return response()->json([
                    'msg' => 'HOD record not found.',
                    'status_code' => 404,
                ]);

            }
                $school = School::find($teacher->school_id);

            } else {
                return response()->json([
                    'msg' => 'Only schools or HODs can add students.',
                    'status_code' => 403,
                ]);
            }
            if (!$school) {
                    return response()->json([
                        'msg' => 'School not found for this user.',
                        'status_code' => 404,
                    ]);
            }

            if (!empty($data['email']) && User::where('email', $data['email'])->exists()) {
                return response()->json([
                    'msg' => 'The email address is already registered.',
                    'status_code' => 409,
                ]);
            }

            if (!empty($data['user_name']) && User::where('user_name', $data['user_name'])->exists()) {
                return response()->json([
                    'msg' => 'The username is already taken.',
                    'status_code' => 409,
                ]);
            }


            // Check if the provided class_id exists
            $class = SchoolClass::find($data['class_id']);
            if (!$class) {
                return response()->json([
                    'msg' => 'The selected class is invalid. Please select a valid class.',
                    'status_code' => 422,
                ]);
            }

            DB::beginTransaction();

            $user = User::create([
                'name' => $data['student_name'],
                'email' => $data['email'] ?? null,
                'user_name' => $data['user_name'],
                'password' => Hash::make($data['password']),
                'role' => 'STUDENT',
            ]);

            $student = Student::create([
                'user_id' => $user->id,
                'email' => $data['email'] ?? null,
                'school_id' => $school->id,
                'class_id' => $data['class_id'],
                'student_name' => $data['student_name'],
                'status' => $data['status'],
                'user_name' => $data['user_name']
            ]);

            /////////for tracker purpose/////
            // Check if this class already has a tracker assigned
            $assignedTrackers = AssignTracker::where('class_id', $student->class_id)
                                 ->where('status', 'assigned')
                                 ->get();

                                            // dd($assignedTrackers->toArray());

           foreach ($assignedTrackers as $assignedTracker) {

                $tracker = Tracker::with(['topics', 'statuses'])
                                ->find($assignedTracker->tracker_id);

                                // dd($tracker->toArray());

                if ($tracker) {
                    $statusIds = $tracker->statuses->pluck('id');
                    // dd($statusIds);

                    foreach ($tracker->topics as $topic) {
                        foreach ($statusIds as $statusId) {

                            // dd("Sd");
                            TopicStatusProgress::updateOrCreate(
                                [
                                    'topic_id'   => $topic->id,
                                    'status_id'  => $statusId,
                                    'student_id' => $student->id,
                                ],
                                ['is_completed' => false]
                            );

                        }
                    }
                }
            }


            DB::commit();

            return response()->json([
                'msg' => 'Student Added Successfully',
                'status_code' => 200,
                'data' => new StudentResource($student),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            // Check for foreign key violation manually and give custom message
            if (str_contains($e->getMessage(), 'foreign key constraint fails')) {
                return response()->json([
                    'msg' => 'Invalid class ID. The class you selected does not exist.',
                    'status_code' => 422,
                ]);
            }

            return response()->json([
                'msg' => 'An unexpected error occurred: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }
        

    public function getById($id)
    {
        try{            
            $student = Student::where('class_id',$id)->get();
            return response()->json([
                    'msg'=> 'Student Fetched Successfully',
                    'status_code' => 200,
                    'data' => StudentResource::collection($student) // Correct placement
                ]);
        }catch(\Exception $e){
            return response()->json([
    
                'msg'=> 'Issue Occured' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }

    public function index()
    {
        $request = request();
        try{
            $class_id = $request->input('class_id');
            
            $student = Student::where('class_id',$class_id)->get();
            return response()->json([
                    'msg'=> 'Student Fetched Successfully',
                    'status_code' => 200,
                    'data' => StudentResource::collection($student) // Correct placement
                ]);
        }catch(\Exception $e){
            return response()->json([
    
                'msg'=> 'Issue Occured' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
        
    }


    public function update(array $data,$id)
    {
        try{
            $user = Auth::user();
            $school =School::where('email',$user->email)->first();

            $student = Student::find($id);
            // dd($student);
            $studentUser = $student->user;
            // dd($studentUser);

             $updateData = [
                'name' => $data['student_name'],
                'status' => $data['status'],
                'user_name' => $data['user_name'],
                'email' => $data['email']??null,
            ];
            
            // Only update password if provided
            if (!empty($data['password'])) {
                $updateData['password'] = Hash::make($data['password']);
            }
            
            $studentUser->update($updateData);

            $student->update([
                'email' => $data['email']??null,
                'school_id'=> $school->id,
                'class_id' => $data['class_id'],
                'student_name' => $data['student_name'],
                'status' => $data['status'],
                'user_name' => $data['user_name'],
                'gender' => $data['gender'] ?? null,
                'student_gender' => $data['student_gender'] ?? null,
                'sex' => $data['sex'] ?? null,
                'student_sex' => $data['student_sex'] ?? null,
                'nationality' => $data['nationality'] ?? null,
            ]);
    
            return response()->json([
                'msg'=> 'Student Updated Successfully',
                'status_code' => 200,
                'data'=> new StudentResource($student),
            ]);
        }catch(\Exception $e){
            return response()->json([
    
                'msg'=> 'Issue Occured' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
        
    }

    public function destroy($id)
    {
        try{
            $student = Student::find($id);
            if(!$student)
            {
                return response()->json([
                    'msg' => 'Student Not Exist',
                    'status_code' => 404,
                    'data' => [],
                ]);
            }

            $student->delete();
            return response()->json([
                'msg' => 'Student Deleted Successfully',
                'status_code' => 200,
                'data' => [],
            ]);
        }catch(\Exception $e){
            return response()->json([
                'msg' => 'Issue Occurred: ' . $e->getMessage(),
                'status_code' => 500,
            ]);
        }
    }
        
}

?>