<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSubmittedQuiz extends Model
{
    protected $fillable =[
        'quiz_id',
        'student_id',
        'assessment_id',
        'submitted_at',
        'type',
        'submission_type',
        'status',
        'self_assessment_mark',
        'teacher_assessment_mark'
    ];

    public function answers()
    {
        return $this->hasMany(QuizAnswer::class, 'quiz_submission_id');
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class,'quiz_id');
    }


    public function student()
    {
        return $this->belongsTo(Student::class, "student_id");
    }

    // Quiz.php
    public function submissions()
    {
        return $this->hasMany(StudentSubmittedQuiz::class, 'quiz_id');
    }

}
