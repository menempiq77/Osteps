content = open('/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php').read()

old = (
    "            $alreadySubmitted = $query->exists();\n\n"
    "            if ($alreadySubmitted) {\n"
    "                return response()->json([\n"
    "                    'status' => 409,\n"
    "                    'message' => 'Opps! You have already submitted this quiz.',\n"
    "                ]);\n"
    "            }\n\n"
    "            $submission = StudentSubmittedQuiz::create([\n"
    "                'quiz_id' => $request->quiz_id,\n"
    "                'student_id' => $request->student_id,\n"
    "                'assessment_id' => $request->assessment_id, //used only when type is task\n"
    "                'submitted_at' => now(),\n"
    "                'type' => $request->type,\n"
    "                'submission_type' => 'quiz',\n"
    "                'status' => 'completed'\n"
    "            ]);"
)

new = (
    "            $existingSubmission = $query->first();\n\n"
    "            if ($existingSubmission) {\n"
    "                // Allow re-submission: delete old answers and reuse the submission record\n"
    "                QuizAnswer::where('quiz_submission_id', $existingSubmission->id)->delete();\n"
    "                $existingSubmission->update(['submitted_at' => now()]);\n"
    "                $submission = $existingSubmission;\n"
    "            } else {\n"
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

if old in content:
    content = content.replace(old, new, 1)
    open('/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php', 'w').write(content)
    print('PATCHED OK')
else:
    # Try to find approximate match
    idx = content.find('$alreadySubmitted = $query->exists()')
    print(f'PATTERN NOT FOUND. alreadySubmitted at index: {idx}')
    if idx > 0:
        print(repr(content[idx-12:idx+200]))
