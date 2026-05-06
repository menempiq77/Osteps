import subprocess

def mysql(sql):
    r = subprocess.run(["mysql","-u","osteps_user","-pAccrual@5264!","osteps_db","-e",sql],capture_output=True,text=True)
    return r

for col,defn in [("self_assessment_mark","INT NULL DEFAULT NULL"),("teacher_assessment_mark","INT NULL DEFAULT NULL")]:
    r = mysql("SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA='osteps_db' AND TABLE_NAME='student_submitted_quizzes' AND COLUMN_NAME='"+col+"'")
    if "1" in r.stdout:
        print("COLUMN "+col+" exists")
    else:
        r2 = mysql("ALTER TABLE student_submitted_quizzes ADD COLUMN "+col+" "+defn)
        print("COLUMN "+col+(" ADDED" if r2.returncode==0 else " ERR:"+r2.stderr[:100]))

p="/var/www/laravel/app/Models/StudentSubmittedQuiz.php"
c=open(p).read()
if "self_assessment_mark" not in c:
    c=c.replace("        'status'\n    ];","        'status',\n        'self_assessment_mark',\n        'teacher_assessment_mark'\n    ];",1)
    open(p,"w").write(c)
    print("MODEL OK")
else:
    print("MODEL done")

p="/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php"
c=open(p).read()
if "self_assessment_mark" not in c:
    c=c.replace("                    'status' => 'completed'\n                ]);\n            }","                    'status' => 'completed',\n                    'self_assessment_mark' => $request->self_assessment_mark\n                ]);\n            }",1)
    c=c.replace("                $existingSubmission->update(['submitted_at' => now()]);\n                $submission = $existingSubmission;","                $existingSubmission->update(['submitted_at' => now(), 'self_assessment_mark' => $request->self_assessment_mark]);\n                $submission = $existingSubmission;",1)
    open(p,"w").write(c)
    print("CTRL OK")
else:
    print("CTRL done")

c=open(p).read()
if "updateQuizSubmissionMark" not in c:
    m="\n    public function updateQuizSubmissionMark(Request $request, $submissionId)\n    {\n        $submission = StudentSubmittedQuiz::findOrFail($submissionId);\n        $submission->update([\"teacher_assessment_mark\" => $request->teacher_assessment_mark]);\n        return response()->json([\"status\"=>200,\"message\"=>\"Mark updated.\",\"data\"=>$submission]);\n    }\n"
    last=c.rfind("\n}")
    c=c[:last]+m+c[last:]
    open(p,"w").write(c)
    print("METHOD OK")
else:
    print("METHOD done")

p="/var/www/laravel/routes/api.php"
c=open(p).read()
if "updateQuizSubmissionMark" not in c:
    old="    Route::post('/quiz-answer/{id}', [QuizQuestionController::class, 'markAnswer']); //quiz_answer id use to add marks"
    new=old+"\n    Route::post('/quiz-submission/{id}/teacher-mark', [QuizQuestionController::class, 'updateQuizSubmissionMark']);"
    if old in c:
        c=c.replace(old,new,1)
        open(p,"w").write(c)
        print("ROUTE OK")
    else:
        print("ROUTE anchor not found")
else:
    print("ROUTE done")

print("ALL DONE")
