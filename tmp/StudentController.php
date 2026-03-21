<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentRequest\UpdateRequest;
use App\Http\Requests\StudentRequest\StoreRequest;
use App\Services\StudentService;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function getStudent(Request $request, $class_id)
    {
        return $this->studentService->getById(
            $class_id,
            (int) $request->query('subject_id', 0),
            (int) $request->query('subject_class_id', 0)
        );
    }

    public function addStudent(StoreRequest $request)
    {
        // dd("sjjsd");
        return $this->studentService->add($request->validated());
    }

    public function updateStudent(UpdateRequest $request,$id)
    {
        return $this->studentService->update($request->validated(),$id);
    }

    public function deleteStudent($id)
    {
        return $this->studentService->destroy($id);
    }
}
