#!/usr/bin/env python3
"""
Patch auto-marking:
1. QuizQuestionController::submitQuizAnswers - after DB::commit(), sum auto-marks and update teacher_assessment_mark
2. markAnswerRepository::markAnswer - after saving, recalculate teacher_assessment_mark

Also fixes existing bad quiz_answer data for quiz_id=10.
"""

import sys

# ── Patch 1: QuizQuestionController ──────────────────────────────────────────
ctrl_path = '/var/www/laravel/app/Http/Controllers/Api/QuizQuestionController.php'
with open(ctrl_path, 'r') as f:
    ctrl = f.read()

old = '''            DB::commit();

            return response()->json([
                'status' => 200,
                'message' => 'Quiz submitted successfully.',
            ]);'''

new = '''            DB::commit();

            // Auto-update teacher_assessment_mark with sum of all auto-marks so far
            $autoMarksTotal = QuizAnswer::where('quiz_submission_id', $submission->id)
                ->whereNotNull('marks')
                ->sum('marks');
            $submission->update(['teacher_assessment_mark' => $autoMarksTotal]);

            return response()->json([
                'status' => 200,
                'message' => 'Quiz submitted successfully.',
            ]);'''

if old in ctrl:
    ctrl = ctrl.replace(old, new)
    with open(ctrl_path, 'w') as f:
        f.write(ctrl)
    print("QuizQuestionController patched")
else:
    print("ERROR: Pattern not found in QuizQuestionController")
    print("Looking for:", repr(old[:80]))
    sys.exit(1)

# ── Patch 2: markAnswerRepository ────────────────────────────────────────────
repo_path = '/var/www/laravel/app/Repositories/markAnswerRepository.php'
with open(repo_path, 'r') as f:
    repo = f.read()

old_repo = '''<?php

namespace App\Repositories;

use App\Models\QuizAnswer;
use App\DTOs\AnswerMarkDTO;
use App\Helper\ApiResponseHelper;'''

new_repo = '''<?php

namespace App\Repositories;

use App\Models\QuizAnswer;
use App\Models\StudentSubmittedQuiz;
use App\DTOs\AnswerMarkDTO;
use App\Helper\ApiResponseHelper;'''

old_save = '''            $answer->is_correct = $dto->is_correct;
            $answer->marks = $dto->marks;
            $answer->comment = $dto->comment;
            $answer->save();

            return $answer;'''

new_save = '''            $answer->is_correct = $dto->is_correct;
            $answer->marks = $dto->marks;
            $answer->comment = $dto->comment;
            $answer->save();

            // Recalculate teacher_assessment_mark on the submission
            $submission = StudentSubmittedQuiz::find($answer->quiz_submission_id);
            if ($submission) {
                $total = QuizAnswer::where('quiz_submission_id', $answer->quiz_submission_id)
                    ->whereNotNull('marks')
                    ->sum('marks');
                $submission->update(['teacher_assessment_mark' => $total]);
            }

            return $answer;'''

if old_repo in repo and old_save in repo:
    repo = repo.replace(old_repo, new_repo)
    repo = repo.replace(old_save, new_save)
    with open(repo_path, 'w') as f:
        f.write(repo)
    print("markAnswerRepository patched")
else:
    missing = []
    if old_repo not in repo:
        missing.append("use statement block")
    if old_save not in repo:
        missing.append("save block")
    print(f"ERROR: Pattern(s) not found: {missing}")
    sys.exit(1)

# ── Patch 3: Fix existing bad DB data ────────────────────────────────────────
import subprocess
sql = """
UPDATE quiz_answers SET is_correct=1, marks=1 WHERE id=10;
UPDATE student_submitted_quizzes
SET teacher_assessment_mark = (
    SELECT SUM(qa.marks) FROM quiz_answers qa
    WHERE qa.quiz_submission_id = student_submitted_quizzes.id
    AND qa.marks IS NOT NULL
)
WHERE id IN (SELECT DISTINCT quiz_submission_id FROM quiz_answers);
SELECT ssq.id, ssq.teacher_assessment_mark FROM student_submitted_quizzes ssq;
"""
result = subprocess.run(
    'mysql -u osteps_user -pAccrual@5264! osteps_db',
    input=sql, shell=True, capture_output=True, text=True
)
print("DB fix:", result.stdout.strip() or result.stderr.strip())

print("\nAll patches applied successfully.")
