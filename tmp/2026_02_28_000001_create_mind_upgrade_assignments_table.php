<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mind_upgrade_assignments', function (Blueprint $table) {
            $table->id();
            $table->string('course_key', 120);
            $table->foreignId('class_id')->nullable()->constrained('school_classes')->cascadeOnDelete();
            $table->foreignId('student_id')->nullable()->constrained('students')->cascadeOnDelete();
            $table->foreignId('assigned_by_user_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['course_key', 'class_id']);
            $table->index(['course_key', 'student_id']);
            $table->index(['class_id', 'is_active']);
            $table->index(['student_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mind_upgrade_assignments');
    }
};
