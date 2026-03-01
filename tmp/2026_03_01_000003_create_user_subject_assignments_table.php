<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_subject_assignments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('subject_id')->index();
            $table->string('role_scope');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'subject_id', 'role_scope'], 'user_subject_assignments_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_subject_assignments');
    }
};
