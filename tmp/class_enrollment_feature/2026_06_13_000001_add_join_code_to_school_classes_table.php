<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('school_classes', function (Blueprint $table) {
            if (!Schema::hasColumn('school_classes', 'join_code')) {
                $table->string('join_code', 32)->nullable()->unique()->after('class_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('school_classes', function (Blueprint $table) {
            if (Schema::hasColumn('school_classes', 'join_code')) {
                $table->dropUnique(['join_code']);
                $table->dropColumn('join_code');
            }
        });
    }
};
