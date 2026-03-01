<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('user_subject_class_assignments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('subject_class_id')->index();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'subject_class_id'], 'user_subject_class_assignments_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_subject_class_assignments');
    }
};
