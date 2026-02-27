<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Student extends Model
{
    use Notifiable;

    protected $fillable =[
        'school_id',
        'email',
        'student_name',
        'class_id',
        'status',
        'user_id',
        'user_name',
        'gender',
        'student_gender',
        'sex',
        'student_sex',
        'nationality',
        'is_sen',
        'sen_details',
    ];

    public function class()
    {
        return $this->belongsTo(SchoolClass::class);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function submittedQuizzes()
    {
        return $this->hasMany(StudentSubmittedQuiz::class, 'student_id');
    }

    public function behaviour()
    {
        return $this->hasMany(StudentBehaviour::class, 'student_id');

    }

    public function studentAssessment()
    {
        return $this->hasMany(StudentAssessment::class,'student_id');
    }

}