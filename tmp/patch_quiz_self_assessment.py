import sys

# ------- 1. Run migration (add columns) -------
migration_sql = """
ALTER TABLE student_submitted_quizzes
  ADD COLUMN IF NOT EXISTS self_assessment_mark INT NULL DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS teacher_assessment_mark INT NULL DEFAULT NULL;
"""

import subprocess
result = subprocess.run(
    ['mysql', '-u', 'osteps_user', '-pAccrual@5264!', 'osteps_db', '-e', migration_sql],
    capture_output=True, text=True
)
if result.returncode != 0:
    print('MIGRATION ERROR:', result.stderr)
    sys.exit(1)
print('MIGRATION OK')

# ------- 2. Update StudentSubmittedQuiz model fillable -------
model_path = '/var/www/laravel/app/Models/StudentSubmittedQuiz.php'
content = open(model_path).read()
old = "        'status'\n    ];"
new = "        'status',\n        'self_assessment_mark',\n        'teacher_assessment_mark'\n    ];"
if old in content:
    content = content.replace(old, new, 1)
    open(model_path, 'w').write(content)
    print('MODEL OK')
else:
    print('MODEL PATTERN NOT FOUND')

# ------- 3. Update submitQuizAnswers to save self_assessment_mark -------
ctrl_path = '/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php'
content = open(ctrl_path).read()

# In the create branch
old_create = (
    "                $submission = StudentSubmittedQuiz::create([\n"
    "                    'quiz_id' => $request->quiz_id,\n"
    "                    'student_id' => $request->student_id,\n"
    "                    'assessment_id' => $request->assessment_id,\n"
    "                    'submitted_at' => now(),\n"
    "                    'type' => $request->type,\n"
    "                    'submission_type' => 'quiz',\n"
    "                    'status' => 'completed'\n"
    "                ]);\n"
    "            }"
)
new_create = (
    "                $submission = StudentSubmittedQuiz::create([\n"
    "                    'quiz_id' => $request->quiz_id,\n"
    "                    'student_id' => $request->student_id,\n"
    "                    'assessment_id' => $request->assessment_id,\n"
    "                    'submitted_at' => now(),\n"
    "                    'type' => $request->type,\n"
    "                    'submission_type' => 'quiz',\n"
    "                    'status' => 'completed',\n"
    "                    'self_assessment_mark' => $request->self_assessment_mark\n"
    "                ]);\n"
    "            }"
)
if old_create in content:
    content = content.replace(old_create, new_create, 1)
    print('SUBMIT CTRL CREATE BRANCH OK')
else:
    print('SUBMIT CTRL CREATE BRANCH NOT FOUND')

# In the update (re-submission) branch - also update self_assessment_mark
old_update = (
    "                $existingSubmission->update(['submitted_at' => now()]);\n"
    "                $submission = $existingSubmission;"
)
new_update = (
    "                $existingSubmission->update(['submitted_at' => now(), 'self_assessment_mark' => $request->self_assessment_mark]);\n"
    "                $submission = $existingSubmission;"
)
if old_update in content:
    content = content.replace(old_update, new_update, 1)
    print('SUBMIT CTRL UPDATE BRANCH OK')
else:
    print('SUBMIT CTRL UPDATE BRANCH NOT FOUND')

open(ctrl_path, 'w').write(content)

# ------- 4. Add updateQuizSubmissionMark method -------
# Check if it already exists
if 'updateQuizSubmissionMark' in content:
    print('UPDATE MARK METHOD ALREADY EXISTS')
else:
    # Insert before the last closing brace of the class (after submitQuizAnswers method)
    new_method = '''
    // Teacher updates teacher_assessment_mark on a quiz submission
    public function updateQuizSubmissionMark(Request $request, $submissionId)
    {
        $submission = StudentSubmittedQuiz::findOrFail($submissionId);
        $submission->update([
            'teacher_assessment_mark' => $request->teacher_assessment_mark
        ]);
        return response()->json(['status' => 200, 'message' => 'Mark updated.', 'data' => $submission]);
    }
'''
    # Insert before last }
    last_brace = content.rfind('\n}')
    content = content[:last_brace] + new_method + content[last_brace:]
    open(ctrl_path, 'w').write(content)
    print('UPDATE MARK METHOD ADDED')
