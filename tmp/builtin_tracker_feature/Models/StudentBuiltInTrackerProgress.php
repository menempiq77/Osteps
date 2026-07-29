<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentBuiltInTrackerProgress extends Model
{
    protected $table = 'student_builtin_tracker_progress';

    protected $fillable = [
        'student_id',
        'tracker_id',
        'lesson_id',
        'best_score',
        'total_questions',
        'attempts',
        'passed_at',
    ];

    protected $casts = [
        'student_id' => 'integer',
        'best_score' => 'integer',
        'total_questions' => 'integer',
        'attempts' => 'integer',
        'passed_at' => 'datetime',
    ];
}
