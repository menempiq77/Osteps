<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        $tables = [
            'quizzes',
            'assign_quiz_terms',
            'assign_task_quizzes',
            'trackers',
            'assign_tracker_classes',
            'assessments',
            'student_behaviours',
            'mind_upgrade_assignments',
            'mind_upgrade_progress',
        ];

        foreach ($tables as $tableName) {
            if (!Schema::hasTable($tableName)) {
                continue;
            }

            if (Schema::hasColumn($tableName, 'subject_id')) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) {
                $table->unsignedBigInteger('subject_id')->nullable()->index();
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'quizzes',
            'assign_quiz_terms',
            'assign_task_quizzes',
            'trackers',
            'assign_tracker_classes',
            'assessments',
            'student_behaviours',
            'mind_upgrade_assignments',
            'mind_upgrade_progress',
        ];

        foreach ($tables as $tableName) {
            if (!Schema::hasTable($tableName) || !Schema::hasColumn($tableName, 'subject_id')) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('subject_id');
            });
        }
    }
};
