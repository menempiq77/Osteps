<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('student_support_comments')) {
            return;
        }

        Schema::create('student_support_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id')->nullable()->index();
            $table->unsignedBigInteger('student_id')->index();
            $table->unsignedBigInteger('subject_id')->nullable()->index();

            $table->unsignedBigInteger('author_id')->nullable();
            $table->string('author_name')->nullable();
            $table->string('author_role')->nullable();

            $table->text('comment');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_support_comments');
    }
};
