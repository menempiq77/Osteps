<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_builtin_tracker_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('tracker_id', 64);
            $table->string('lesson_id', 64);
            $table->unsignedInteger('best_score')->default(0);
            $table->unsignedInteger('total_questions')->default(0);
            $table->unsignedInteger('attempts')->default(0);
            $table->timestamp('passed_at')->nullable();
            $table->timestamps();

            $table->unique(
                ['student_id', 'tracker_id', 'lesson_id'],
                'student_builtin_tracker_lesson_unique'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_builtin_tracker_progress');
    }
};
