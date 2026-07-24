<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_import_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('school_id');
            $table->string('request_token', 80);
            $table->string('content_type', 20);
            $table->unsignedBigInteger('source_subject_id');
            $table->unsignedBigInteger('target_subject_id');
            $table->json('content_ids');
            $table->string('status', 20);
            $table->longText('response_json')->nullable();
            $table->timestamps();

            $table->unique(['school_id', 'request_token']);
            $table->index(
                [
                    'school_id',
                    'content_type',
                    'source_subject_id',
                    'target_subject_id',
                ],
                'content_import_scope_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_import_requests');
    }
};
