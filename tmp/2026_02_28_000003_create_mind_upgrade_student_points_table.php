<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mind_upgrade_student_points', function (Blueprint $table) {
            $table->foreignId('student_id')->primary()->constrained('students')->cascadeOnDelete();
            $table->integer('mind_points')->default(0);
            $table->timestamp('updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mind_upgrade_student_points');
    }
};
