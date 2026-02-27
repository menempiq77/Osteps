<?php
namespace App\Services;

use App\Models\School;
use App\Models\Library;
use App\Models\Student;
use App\Models\Teacher;
use App\Trait\FileUploadTrait;
use PhpParser\Node\Stmt\Catch_;
use App\Mail\LibraryRequestEmail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Resources\LibraryResource;
use App\Mail\LibraryRequestApproveEmail;

class LibraryService 
{
    use FileUploadTrait;
    public function index()
    {
        try{
            
            $user = Auth::user();
            // dd($user);
             if ($user->role === 'SCHOOL_ADMIN') {

            $school = School::where('email', $user->email)->first();
            // dd($school);
            } elseif ($user->role === 'HOD') {
                $teacher = Teacher::where('user_id',$user->id)->first();
                if (!$teacher) {
                return response()->json([
                    'msg' => 'HOD record not found.',
                    'status_code' => 404,
                ]);

            }
                $school = School::find($teacher->school_id);

            }elseif ($user->role === 'TEACHER') {
                $teacher = Teacher::where('user_id',$user->id)->first();
                if (!$teacher) {
                return response()->json([
                    'msg' => 'HOD record not found.',
                    'status_code' => 404,
                ]);

            }
                $school = School::find($teacher->school_id);

            } elseif ($user->role === 'STUDENT') {
                $student = Student::where('user_id',$user->id)->first();
                if (!$student) {
                return response()->json([
                    'msg' => 'Student record not found.',
                    'status_code' => 404,
                ]);

            }
                $school = School::find($student->school_id);

            } else {
                return response()->json([
                    'msg' => 'Issue while fetching libarary duw to role.',
                    'status_code' => 403,
                ]);
            }
            if (!$school) {
                    return response()->json([
                        'msg' => 'School not found for this user.',
                        'status_code' => 404,
                    ]);
            }
            $library = Library::where('school_id',$school->id)->where('status','active')->get();
            return response()->json([
                'status_code' => 200,
                'msg' => 'Data Fetched Successfully',
                'data' => LibraryResource::collection($library)
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status_code' => 200,
                'msg' => 'Issue Occured' . $e->getMessage(),
            ]);
        }
    }

    public function add(array $data)
    {
        try {
            $filePath = null;
            
            // Check if it's a link (URL) or file upload
            if (isset($data['link']) && !empty($data['link'])) {
                // It's a link
                $filePath = $data['link'];
                
            } elseif (isset($data['file_path']) && $data['file_path']->isValid()) {
                // It's a file upload
                $filePath = $this->imageUpload($data['file_path'], 'library_files', 'public');
                
            } else {
                return response()->json([
                    'status_code' => 422,
                    'msg' => 'Please provide either a file upload or a link',
                ]);
            }

            $user = Auth::user();

            // Default status = pending
            $status = 'pending';

            // If user role is SCHOOL_ADMIN, make it active
            if (in_array($user->role, ['SCHOOL_ADMIN'])) {
                $status = 'active';
            }
            
            $school = School::find($data['school_id']);
            
            $library = Library::create([
                'title'=> $data['title'],
                'library_resources_id' => $data['library_resources_id'],
                'library_categories_id' => $data['library_categories_id'],
                'description' => $data['description'],
                'file_path' => $filePath,
                'school_id' => $data['school_id'],
                'status' => $status
            ]);

            
            // Send email to school admin
            if ($school) {
                 
                Mail::to($school->email)->send(new LibraryRequestEmail());
            }

            return response()->json([
                'status_code' => 200,
                'msg' => 'Data Added Successfully',
                'data' => new LibraryResource($library)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status_code' => 500,
                'msg' => 'Issue Occurred: ' . $e->getMessage(),
            ]);
        }
    }

    public function add200(array $data)
    {
        try{
            if (isset($data['file_path'])) {

                $file = $data['file_path'];
                $fileName = $file->getClientOriginalName();
                $fileExtension = $file->getClientOriginalExtension();

                $fileFinalName = rand(0000,9999).'_'. time().'.'.$fileExtension;
                $fileDestination = "storage/library_files";
                $file->move($fileDestination,$fileFinalName);
            }
            
            $library = Library::create([
                'title'=> $data['title'],
                'library_resources_id' => $data['library_resources_id'],
                'library_categories_id' => $data['library_categories_id'],
                'description' => $data['description'],
                'file_path' => 'library_files/' . $fileFinalName,

            ]);

            return response()->json([
                'status_code' =>200,
                'msg' => 'Data Added Successfully',
                'data' => new LibraryResource($library)
            ]);

        }catch(\Exception $e){
            return response()->json([
                'status_code' => 200,
                'msg' => 'Issue Occured' . $e->getMessage(),
            ]);
        }
    }

    public function update(array $data,$id)
    {
        try{
            $library = Library::find($id);
            $newFilePath = null; // Track if new file/link provided

            // Check if it's a link (URL) update
            if (isset($data['link']) && !empty($data['link'])) {
                // Delete old file if it exists and isn't a URL
                if ($library->file_path && !filter_var($library->file_path, FILTER_VALIDATE_URL)) {
                    $oldFilePath = public_path('storage/' . $library->file_path);
                    if (file_exists($oldFilePath)) {
                        @unlink($oldFilePath);
                    }
                }
                $newFilePath = $data['link'];
                
            } elseif (isset($data['file_path']) && $data['file_path']->isValid()) {
                // Delete old file if it exists and isn't a URL
                if ($library->file_path && !filter_var($library->file_path, FILTER_VALIDATE_URL)) {
                    $oldFilePath = public_path('storage/' . $library->file_path);
                    if (file_exists($oldFilePath)) {
                        @unlink($oldFilePath);
                    }
                }
                
                // Upload new file
                $file = $data['file_path'];
                $fileExtension = $file->getClientOriginalExtension();
                $fileFinalName = rand(0000,9999).'_'. time().'.'.$fileExtension;
                $fileDestination = "storage/library_files";
                $file->move($fileDestination,$fileFinalName);
                
                $newFilePath = 'library_files/' . $fileFinalName;
            } elseif (isset($data['existing_file_path']) && !empty($data['existing_file_path'])) {
                // Keep existing file path when only updating metadata
                $newFilePath = $data['existing_file_path'];
            }
            
            $school = School::find($data['school_id']);

            $user = Auth::user(); // get the logged-in user

            // Default status = pending
            $status = 'pending';

            // If user role is SCHOOL_ADMIN or HOD, make it active
            if (in_array($user->role, ['SCHOOL_ADMIN', 'HOD'])) {
                $status = 'active';
            }

            $library->update([
                'title'=> $data['title'],
                'library_resources_id' => $data['library_resources_id'],
                'library_categories_id' => $data['library_categories_id'],
                'description' => $data['description'],
                'file_path' => $newFilePath ?? $library->file_path,
                'school_id' => $data['school_id'],
                'status' => $status

            ]);

            // Send email to school admin
            if ($school) {
                 
                Mail::to($school->email)->send(new LibraryRequestEmail());
            }

            return response()->json([
                'status_code' =>200,
                'msg' => 'Data Updated Successfully',
                'data' => new LibraryResource($library)
            ]);

        }catch(\Exception $e){
            return response()->json([
                'status_code' => 200,
                'msg' => 'Issue Occured' . $e->getMessage(),
            ]);
        }
    }

    public function destroy($id)
    {
        try{
            $library = Library::find($id);
            if(!$library)
            {
                return response()->json([
                    'status_code' => 200,
                    'msg' => 'Not Found',
                    'data' => []
                ]);
            }
            $library->delete();

            return response()->json([
                'status_code' => 200,
                'msg' => 'Data Deleted Successfully',
                'data' => []
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status_code' => 200,
                'msg' => 'Issue Occured' . $e->getMessage(),
            ]);
        }
    }
}