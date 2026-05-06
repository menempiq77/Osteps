<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'name',
        'school_id',
        'subject_id',
        'status'
    ];

    public function quizQueston()
    {
        return $this->hasMany(QuizQuestion::class, 'quiz_id')
            ->orderByRaw('CASE WHEN position IS NULL OR position = 0 THEN 1 ELSE 0 END')
            ->orderBy('position')
            ->orderBy('id');
    }

    public function QuestonOption()
    {
        return $this->hasMany(QuestionOption::class,'quiz_id');
    }

    public function submissions()
    {
        return $this->hasMany(StudentSubmittedQuiz::class, 'quiz_id');
    }

}
