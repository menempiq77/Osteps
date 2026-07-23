<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessment_import_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id');
            $table->string('request_token', 80);
            $table->unsignedBigInteger('source_subject_id');
            $table->unsignedBigInteger('target_subject_id');
            $table->json('assessment_ids');
            $table->string('status', 20);
            $table->longText('response_json')->nullable();
            $table->timestamps();

            $table->unique(['school_id', 'request_token']);
            $table->index(
                ['school_id', 'source_subject_id', 'target_subject_id'],
                'assessment_import_scope_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessment_import_requests');
    }
};
