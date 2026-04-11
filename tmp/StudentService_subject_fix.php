<?php

/**
 * BACKEND FIX — StudentService::getById must accept and use subject_class_id.
 *
 * WHY THIS IS NEEDED
 * ──────────────────
 * StudentController::getStudent already reads subject_id and subject_class_id from
 * the request and passes them as arguments:
 *
 *   return $this->studentService->getById(
 *       $class_id,
 *       (int) $request->query('subject_id', 0),
 *       (int) $request->query('subject_class_id', 0)
 *   );
 *
 * BUT StudentService::getById currently only accepts ONE parameter ($id) and
 * ignores both. It does:
 *
 *   public function getById($id) {
 *       $student = Student::where('class_id', $id)->get();
 *   }
 *
 * This means ?subject_id and ?subject_class_id are silently dropped.
 * Students enrolled in Arabic via student_subject_enrollments are NOT in
 * students.class_id = arabicSubjectClassLinkedId — they keep their original
 * class_id unless force_reassign was used during enrollment.
 *
 * THE FIX
 * ───────
 * Replace getById with the version below. The priority order is:
 *   1. subject_class_id is provided → filter by student_subject_enrollments
 *   2. subject_id is provided        → filter by enrollment for any class of that subject
 *   3. neither provided              → original behaviour (filter by students.class_id)
 *
 * APPLY
 * ─────
 * In app/Services/StudentService.php replace the existing getById method with
 * the method below. No other changes needed — the controller already passes
 * the right arguments.
 */

use Illuminate\Support\Facades\DB;

// ─── Replace this ──────────────────────────────────────────────────────────────
//
//    public function getById($id)
//    {
//        try{
//            $student = Student::where('class_id',$id)->get();
//            return response()->json(['msg'=> 'Student Fetched Successfully','status_code' => 200,'data' => StudentResource::collection($student)]);
//        }catch(\Exception $e){
//            return response()->json(['msg'=> 'Issue Occured' . $e->getMessage(),'status_code' => 500]);
//        }
//    }
//
// ─── With this ────────────────────────────────────────────────────────────────

    public function getById($id, int $subjectId = 0, int $subjectClassId = 0)
    {
        try {
            // Priority 1: filter by specific subject class enrollment
            if ($subjectClassId > 0) {
                $students = DB::table('students')
                    ->join('student_subject_enrollments as sse', 'students.id', '=', 'sse.student_id')
                    ->where('sse.subject_class_id', $subjectClassId)
                    ->where('sse.is_active', 1)
                    ->select('students.*')
                    ->get();

                return response()->json([
                    'msg'         => 'Student Fetched Successfully',
                    'status_code' => 200,
                    'data'        => StudentResource::collection($students),
                ]);
            }

            // Priority 2: filter by subject — return all students enrolled in ANY
            // subject class belonging to this subject (respects same school via
            // subject_classes.school_id if needed; for simplicity filter by subject_id only)
            if ($subjectId > 0) {
                $students = DB::table('students')
                    ->join('student_subject_enrollments as sse', 'students.id', '=', 'sse.student_id')
                    ->join('subject_classes as sc', 'sc.id', '=', 'sse.subject_class_id')
                    ->where('sc.subject_id', $subjectId)
                    ->where('sse.is_active', 1)
                    ->when($id > 0, fn ($q) => $q->where('students.class_id', $id))
                    ->select('students.*')
                    ->get();

                return response()->json([
                    'msg'         => 'Student Fetched Successfully',
                    'status_code' => 200,
                    'data'        => StudentResource::collection($students),
                ]);
            }

            // Original behaviour: filter by students.class_id
            $student = Student::where('class_id', $id)->get();
            return response()->json([
                'msg'         => 'Student Fetched Successfully',
                'status_code' => 200,
                'data'        => StudentResource::collection($student),
            ]);
        } catch (\Exception $e) {
            return response()->json(['msg' => 'Issue Occured ' . $e->getMessage(), 'status_code' => 500]);
        }
    }
