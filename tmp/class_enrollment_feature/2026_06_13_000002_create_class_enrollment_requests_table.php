<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('class_enrollment_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id')->index();
            $table->unsignedBigInteger('class_id')->index();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('student_name');
            $table->string('gender')->nullable();
            $table->string('nationality')->nullable();
            $table->string('user_name');
            $table->string('password');
            $table->boolean('needs_support')->default(false);
            $table->text('support_details')->nullable();
            $table->string('status')->default('pending'); // pending | approved | rejected
            $table->unsignedBigInteger('created_student_id')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('class_enrollment_requests');
    }
};
