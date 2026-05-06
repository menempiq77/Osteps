<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable=[
        'quiz_id',
        'question_text',
        'type',
        'correct_answer',
        'marks',
        'position'
    ];

    public function options()
    {
        return $this->hasMany(QuestionOption::class,'quiz_id');
    }
}
