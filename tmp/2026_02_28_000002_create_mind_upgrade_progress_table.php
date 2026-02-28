<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mind_upgrade_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete();
            $table->string('course_key', 120);
            $table->string('unit_key', 255);
            $table->string('unit_type', 40);
            $table->integer('score')->nullable();
            $table->integer('total')->nullable();
            $table->integer('xp_awarded')->default(0);
            $table->dateTime('awarded_at');
            $table->timestamps();

            $table->unique(['student_id', 'unit_key'], 'mind_progress_student_unit_unique');
            $table->index(['student_id', 'course_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mind_upgrade_progress');
    }
};
