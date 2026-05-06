import subprocess

# 1. Auto-correct marks in submitQuizAnswers
p = "/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php"
c = open(p).read()

old = "                // Store the student's answer\n                QuizAnswer::create([\n                    'quiz_submission_id' => $submission->id,\n                    'quiz_question_id' => $question->id,\n                     'answer' => json_encode($answer),\n                    'is_correct' => $isCorrect,\n                ]);"

new = "                // Auto-assign marks for auto-correctable question types\n                $autoMark = null;\n                $autoCorrectTypes = ['multiple_choice', 'drop_down', 'true_false', 'check_boxes'];\n                if (in_array($question->type, $autoCorrectTypes)) {\n                    $autoMark = $isCorrect ? $question->marks : 0;\n                }\n\n                // Store the student's answer\n                QuizAnswer::create([\n                    'quiz_submission_id' => $submission->id,\n                    'quiz_question_id' => $question->id,\n                    'answer' => json_encode($answer),\n                    'is_correct' => $isCorrect,\n                    'marks' => $autoMark,\n                ]);"

if old in c:
    c = c.replace(old, new, 1)
    open(p, "w").write(c)
    print("CTRL AUTO-MARK OK")
else:
    print("CTRL AUTO-MARK NOT FOUND")

# 2. Eager-load quiz_queston in getStudentAssessmentTasks service
p2 = "/var/www/laravel/app/Services/StudentAssessmentTaskService.php"
c2 = open(p2).read()
old2 = "StudentSubmittedQuiz::with(['quiz','answers'])"
new2 = "StudentSubmittedQuiz::with(['quiz.quiz_queston','answers'])"
if old2 in c2:
    c2 = c2.replace(old2, new2, 1)
    open(p2, "w").write(c2)
    print("SERVICE EAGER LOAD OK")
else:
    print("SERVICE EAGER LOAD NOT FOUND")

print("ALL DONE")
