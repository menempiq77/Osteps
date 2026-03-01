<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subject_classes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id')->index();
            $table->unsignedBigInteger('subject_id')->index();
            $table->unsignedBigInteger('year_id')->nullable()->index();
            $table->string('name');
            $table->string('base_class_label')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['school_id', 'subject_id', 'name'], 'subject_classes_school_subject_name_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_classes');
    }
};
