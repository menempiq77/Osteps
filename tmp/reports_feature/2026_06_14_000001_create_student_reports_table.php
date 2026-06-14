<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('student_reports')) {
            return;
        }

        Schema::create('student_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id')->nullable()->index();
            $table->unsignedBigInteger('student_id')->index();
            $table->unsignedBigInteger('subject_id')->nullable()->index();
            $table->unsignedBigInteger('term_id')->nullable();

            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('author_name')->nullable();
            $table->string('author_role')->nullable();

            // Inspection-style ratings (free text so schools can use their own scale)
            $table->string('effort')->nullable();
            $table->string('conduct')->nullable();
            $table->string('attainment')->nullable();

            $table->text('strengths')->nullable();
            $table->text('targets')->nullable();   // areas for improvement
            $table->text('comment')->nullable();    // main narrative

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_reports');
    }
};
