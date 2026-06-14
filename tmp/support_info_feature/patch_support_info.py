#!/usr/bin/env python3
"""Adds a dedicated endpoint to update only a student's support/wellbeing
(is_sen + sen_details) fields, so admin/teacher/HOD can edit that section of the
student report without rewriting the whole student record (class_id, etc.).

Run from the Laravel app root (/var/www/laravel).
Idempotent: safe to run multiple times.
"""
import re

# ── 1. StudentService::updateSupport ──────────────────────────────────────────
svc_path = "app/Services/StudentService.php"
svc = open(svc_path).read()

service_method = '''
    public function updateSupport(array $data, $id)
    {
        try {
            $student = Student::find($id);
            if (!$student) {
                return response()->json(['msg' => 'Student Not Found', 'status_code' => 404], 404);
            }

            $isSen = isset($data['is_sen']) ? (bool) $data['is_sen'] : false;
            $student->update([
                'is_sen' => $isSen,
                'sen_details' => $isSen ? ($data['sen_details'] ?? null) : null,
            ]);

            return response()->json([
                'msg' => 'Support information updated successfully',
                'status_code' => 200,
                'data' => new StudentResource($student),
            ]);
        } catch (\\Exception $e) {
            return response()->json(['msg' => 'Issue Occured' . $e->getMessage(), 'status_code' => 500]);
        }
    }

    public function update('''

if "function updateSupport" not in svc:
    anchor = "\n    public function update("
    if anchor not in svc:
        raise SystemExit("StudentService update() anchor not found")
    svc = svc.replace(anchor, service_method, 1)
    open(svc_path, "w").write(svc)
    print("StudentService: added updateSupport")
else:
    print("StudentService: updateSupport already present")

# ── 2. StudentController::updateStudentSupport ────────────────────────────────
ctrl_path = "app/Http/Controllers/Api/StudentController.php"
ctrl = open(ctrl_path).read()

controller_method = '''    public function updateStudentSupport(Request $request, $id)
    {
        $data = $request->validate([
            'is_sen' => 'nullable|boolean',
            'sen_details' => 'nullable|string',
        ]);

        return $this->studentService->updateSupport($data, $id);
    }

    public function deleteStudent('''

if "function updateStudentSupport" not in ctrl:
    anchor = "    public function deleteStudent("
    if anchor not in ctrl:
        raise SystemExit("StudentController deleteStudent() anchor not found")
    ctrl = ctrl.replace(anchor, controller_method, 1)
    open(ctrl_path, "w").write(ctrl)
    print("StudentController: added updateStudentSupport")
else:
    print("StudentController: updateStudentSupport already present")

# ── 3. Route ──────────────────────────────────────────────────────────────────
routes_path = "routes/api.php"
routes = open(routes_path).read()

route_line = "    Route::post('update-student-support/{id}',[StudentController::class,'updateStudentSupport'])->name('update-student-support');\n"
anchor = "    Route::post('update-student/{id}',[StudentController::class,'updateStudent'])->name('update-student');\n"

if "update-student-support" not in routes:
    if anchor not in routes:
        raise SystemExit("update-student route anchor not found")
    routes = routes.replace(anchor, anchor + route_line, 1)
    open(routes_path, "w").write(routes)
    print("routes: added update-student-support")
else:
    print("routes: update-student-support already present")

print("DONE")
