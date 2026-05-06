import sys, subprocess

def col_exists(col):
    r = subprocess.run(["mysql","-u","osteps_user","-pAccrual@5264!","osteps_db","-e","SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='"'"'osteps_db'"'"' AND TABLE_NAME='"'"'student_submitted_quizzes'"'"' AND COLUMN_NAME='"'"'"+col+"'"'"';"],capture_output=True,text=True)
    return "1" in r.stdout

for col,defn in [("self_assessment_mark","INT NULL DEFAULT NULL"),("teacher_assessment_mark","INT NULL DEFAULT NULL")]:
    if col_exists(col):
        print("COLUMN "+col+" already exists")
    else:
        r = subprocess.run(["mysql","-u","osteps_user","-pAccrual@5264!","osteps_db","-e","ALTER TABLE student_submitted_quizzes ADD COLUMN "+col+" "+defn+";"],capture_output=True,text=True)
        print("COLUMN "+col+(" ADDED" if r.returncode==0 else " ERROR:"+r.stderr))

model_path = "/var/www/laravel/app/Models/StudentSubmittedQuiz.php"
c = open(model_path).read()
if "self_assessment_mark" not in c:
    c = c.replace("        'status'\n    ];","        'status',\n        'self_assessment_mark',\n        'teacher_assessment_mark'\n    ];",1)
    open(model_path,"w").write(c)
    print("MODEL OK")
else:
    print("MODEL already updated")

ctrl_path = "/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php"
c = open(ctrl_path).read()
if "self_assessment_mark" not in c:
    old1 = "                    'status' => 'completed'\n                ]);\n            }"
    new1 = "                    'status' => 'completed',\n                    'self_assessment_mark' => $request->self_assessment_mark\n                ]);\n            }"
    old2 = "                $existingSubmission->update(['submitted_at' => now()]);\n                $submission = $existingSubmission;"
    new2 = "                $existingSubmission->update(['submitted_at' => now(), 'self_assessment_mark' => $request->self_assessment_mark]);\n                $submission = $existingSubmission;"
    c = c.replace(old1,new1,1).replace(old2,new2,1)
    open(ctrl_path,"w").write(c)
    print("CTRL submit OK")
else:
    print("CTRL already updated")

c = open(ctrl_path).read()
if "updateQuizSubmissionMark" not in c:
    method = "\n    public function updateQuizSubmissionMark(Request $request, $submissionId)\n    {\n        $submission = StudentSubmittedQuiz::findOrFail($submissionId);\n        $submission->update(['teacher_assessment_mark' => $request->teacher_assessment_mark]);\n        return response()->json(['status'=>200,'message'=>'Mark updated.','data'=>$submission]);\n    }\n"
    last = c.rfind("\n}")
    c = c[:last]+method+c[last:]
    open(ctrl_path,"w").write(c)
    print("METHOD ADDED")
else:
    print("METHOD already exists")

routes_path = "/var/www/laravel/routes/api.php"
rc = open(routes_path).read()
if "updateQuizSubmissionMark" not in rc:
    old_r = "    Route::post('/quiz-answer/{id}', [QuizQuestionController::class, 'markAnswer']); //quiz_answer id use to add marks"
    new_r = old_r+"\n    Route::post('/quiz-submission/{id}/teacher-mark', [QuizQuestionController::class, 'updateQuizSubmissionMark']);"
    if old_r in rc:
        rc = rc.replace(old_r,new_r,1)
        open(routes_path,"w").write(rc)
        print("ROUTE ADDED")
    else:
        print("ROUTE ANCHOR NOT FOUND")
else:
    print("ROUTE already exists")

print("ALL DONE")