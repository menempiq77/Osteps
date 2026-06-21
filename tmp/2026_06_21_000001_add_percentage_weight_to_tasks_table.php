<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('tasks', 'percentage_weight')) {
            Schema::table('tasks', function (Blueprint $table) {
                $table->decimal('percentage_weight', 5, 2)->default(0)->after('allocated_marks');
            });
        }

        // Also add percentage_weight to the pivot table that links quizzes to assessments
        // so quiz-type assignment weights persist on the backend.
        if (Schema::hasTable('assessment_quizzes') && !Schema::hasColumn('assessment_quizzes', 'percentage_weight')) {
            Schema::table('assessment_quizzes', function (Blueprint $table) {
                $table->decimal('percentage_weight', 5, 2)->default(0)->after('assessment_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('tasks', 'percentage_weight')) {
            Schema::table('tasks', function (Blueprint $table) {
                $table->dropColumn('percentage_weight');
            });
        }

        if (Schema::hasTable('assessment_quizzes') && Schema::hasColumn('assessment_quizzes', 'percentage_weight')) {
            Schema::table('assessment_quizzes', function (Blueprint $table) {
                $table->dropColumn('percentage_weight');
            });
        }
    }
};
