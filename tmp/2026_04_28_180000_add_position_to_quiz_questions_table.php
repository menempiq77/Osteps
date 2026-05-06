<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('quiz_questions', 'position')) {
            Schema::table('quiz_questions', function (Blueprint $table) {
                $table->unsignedInteger('position')->nullable()->after('marks');
            });
        }

        $questionsByQuiz = DB::table('quiz_questions')
            ->select('id', 'quiz_id')
            ->orderBy('quiz_id')
            ->orderBy('id')
            ->get()
            ->groupBy('quiz_id');

        foreach ($questionsByQuiz as $questions) {
            foreach ($questions->values() as $index => $question) {
                DB::table('quiz_questions')
                    ->where('id', $question->id)
                    ->update(['position' => $index + 1]);
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('quiz_questions', 'position')) {
            Schema::table('quiz_questions', function (Blueprint $table) {
                $table->dropColumn('position');
            });
        }
    }
};