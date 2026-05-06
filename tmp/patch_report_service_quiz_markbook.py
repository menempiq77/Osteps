from pathlib import Path
import shutil


path = Path("/var/www/laravel/app/Services/ReportService.php")
content = path.read_text()

backup_path = Path(str(path) + ".bak_quiz_markbook_20260427")
if not backup_path.exists():
    shutil.copyfile(path, backup_path)

import_anchor = "use App\\Models\\StudentAssessmentTask;\n"
import_line = "use App\\Models\\StudentSubmittedQuiz;\n"
if import_line not in content:
    if import_anchor not in content:
        raise SystemExit("Could not find StudentAssessmentTask import anchor")
    content = content.replace(import_anchor, import_anchor + import_line, 1)

method_start = "    public function getWholeAssessmentReport($id)\n    {"
method_end_anchor = "\n\n    //make function for school to get all assessments"
start_index = content.find(method_start)
if start_index == -1:
    raise SystemExit("Could not find getWholeAssessmentReport start")

end_index = content.find(method_end_anchor, start_index)
if end_index == -1:
    raise SystemExit("Could not find getWholeAssessmentReport end anchor")

new_method = '''    public function getWholeAssessmentReport($id)
    {
        $assessments = Assessment::with([
            'tasks',
            'terms.class.year',
        ])
        ->where('school_id', $id)
        ->whereHas('terms.class', function ($query) use ($id) {
            $query->where('school_id', $id);
        })
        ->get();

        if ($assessments->isEmpty()) {
            return response()->json([
                'data' => []
            ]);
        }

        $assessmentIds = $assessments->pluck('id')->filter()->values();
        $termIds = $assessments->pluck('terms')->flatten(1)->pluck('id')->filter()->unique()->values();

        $taskRecordsByAssessment = StudentAssessmentTask::with([
            'student',
            'task',
        ])
        ->whereIn('assessment_id', $assessmentIds->all())
        ->whereHas('student', function ($query) use ($id) {
            $query->where('school_id', $id);
        })
        ->get()
        ->groupBy('assessment_id');

        $quizSubmissionsByAssessment = StudentSubmittedQuiz::with([
            'student',
            'quiz.quizQueston',
        ])
        ->whereIn('assessment_id', $assessmentIds->all())
        ->whereHas('student', function ($query) use ($id) {
            $query->where('school_id', $id);
        })
        ->get()
        ->groupBy('assessment_id');

        $quizAssignmentsByTerm = collect();
        if ($termIds->isNotEmpty()) {
            $quizAssignmentsByTerm = AssignTermQuiz::with(['quiz.quizQueston'])
                ->where('type', 'quiz')
                ->whereIn('term_id', $termIds->all())
                ->get()
                ->groupBy('term_id');
        }

        $grouped = $assessments->map(function ($assessment) use ($id, $taskRecordsByAssessment, $quizSubmissionsByAssessment, $quizAssignmentsByTerm) {
            $term = $assessment?->terms?->first();
            $class = $term?->class;
            $year = $class?->year;

            $termStudents = $class?->id
                ? Student::where('class_id', $class->id)
                    ->where('school_id', $id)
                    ->get()
                : collect();

            $assessmentTaskRecords = $taskRecordsByAssessment->get($assessment->id, collect());

            $taskReports = $assessment->tasks->map(function ($task) use ($assessmentTaskRecords, $termStudents, $id) {
                $submittedRecords = $assessmentTaskRecords->where('task_id', $task->id);
                $submittedStudentIds = $submittedRecords->pluck('student_id')->unique();
                $notSubmittedStudents = $termStudents->whereNotIn('id', $submittedStudentIds);

                return [
                    'task_id' => $task->id,
                    'task_name' => $task->task_name,
                    'allocated_marks' => $task->allocated_marks,
                    'task_type' => 'task',
                    'submitted' => $submittedRecords
                        ->filter(function ($record) use ($id) {
                            return $record->student && $record->student->school_id == $id;
                        })
                        ->map(function ($record) {
                            return [
                                'student_id' => $record->student_id,
                                'student_name' => $record->student->student_name ?? '',
                                'teacher_assessment_marks' => $record->teacher_assessment_score,
                            ];
                        })->values(),
                    'not_submitted' => $notSubmittedStudents->map(function ($student) {
                        return [
                            'student_id' => $student->id,
                            'student_name' => $student->student_name,
                        ];
                    })->values(),
                ];
            });

            $assessmentQuizSubmissions = $quizSubmissionsByAssessment->get($assessment->id, collect());
            $assignedQuizzes = $quizAssignmentsByTerm->get($term?->id, collect())
                ->filter(function ($assignedQuiz) use ($class) {
                    return !$assignedQuiz->class_id || !$class || (int) $assignedQuiz->class_id === (int) $class->id;
                });

            $quizDefinitions = $assignedQuizzes->mapWithKeys(function ($assignedQuiz) {
                return [
                    (string) $assignedQuiz->quiz_id => [
                        'assignment' => $assignedQuiz,
                        'quiz' => $assignedQuiz->quiz,
                    ],
                ];
            });

            foreach ($assessmentQuizSubmissions->pluck('quiz')->filter()->unique('id') as $quiz) {
                $quizKey = (string) $quiz->id;
                if (!$quizDefinitions->has($quizKey)) {
                    $quizDefinitions->put($quizKey, [
                        'assignment' => null,
                        'quiz' => $quiz,
                    ]);
                }
            }

            $quizReports = $quizDefinitions->values()->map(function ($quizDefinition) use ($assessmentQuizSubmissions, $termStudents) {
                $quiz = $quizDefinition['quiz'];
                $assignment = $quizDefinition['assignment'];
                $submittedRecords = $assessmentQuizSubmissions->where('quiz_id', $quiz?->id);
                $submittedStudentIds = $submittedRecords->pluck('student_id')->unique();
                $notSubmittedStudents = $termStudents->whereNotIn('id', $submittedStudentIds);
                $allocatedMarks = $quiz?->quizQueston?->sum(function ($question) {
                    return (float) ($question->marks ?? 0);
                }) ?? 0;
                $columnId = $assignment?->id
                    ? 1000000 + (int) $assignment->id
                    : 2000000 + (int) $quiz->id;

                return [
                    'task_id' => $columnId,
                    'task_name' => $quiz?->name ?? 'Quiz',
                    'allocated_marks' => $allocatedMarks,
                    'task_type' => 'quiz',
                    'quiz_id' => $quiz?->id,
                    'submitted' => $submittedRecords->map(function ($record) {
                        return [
                            'student_id' => $record->student_id,
                            'student_name' => $record->student->student_name ?? '',
                            'teacher_assessment_marks' => $record->teacher_assessment_mark,
                            'submission_id' => $record->id,
                        ];
                    })->values(),
                    'not_submitted' => $notSubmittedStudents->map(function ($student) {
                        return [
                            'student_id' => $student->id,
                            'student_name' => $student->student_name,
                        ];
                    })->values(),
                ];
            });

            return [
                'assessment_id' => $assessment->id,
                'assessment_name' => $assessment->name ?? 'Unknown',
                'class_id' => $class?->id,
                'term_id' => $term?->id,
                'year_id' => $year?->id,
                'tasks' => $taskReports->concat($quizReports)->values(),
            ];
        })->filter(function ($assessmentReport) {
            return !empty($assessmentReport['tasks']);
        })->values();

        return response()->json([
            'data' => $grouped
        ]);
    }
'''

content = content[:start_index] + new_method + content[end_index:]
path.write_text(content)
print("Patched ReportService::getWholeAssessmentReport for quiz markbook columns")