<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            // Add gender columns if they don't exist
            if (!Schema::hasColumn('students', 'gender')) {
                $table->string('gender')->nullable()->after('status');
            }
            if (!Schema::hasColumn('students', 'student_gender')) {
                $table->string('student_gender')->nullable()->after('gender');
            }
            if (!Schema::hasColumn('students', 'sex')) {
                $table->string('sex')->nullable()->after('student_gender');
            }
            if (!Schema::hasColumn('students', 'student_sex')) {
                $table->string('student_sex')->nullable()->after('sex');
            }
            if (!Schema::hasColumn('students', 'nationality')) {
                $table->string('nationality')->nullable()->after('student_sex');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn(['gender', 'student_gender', 'sex', 'student_sex', 'nationality']);
        });
    }
};
