<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassEnrollmentRequest extends Model
{
    protected $fillable = [
        'school_id',
        'class_id',
        'first_name',
        'last_name',
        'student_name',
        'gender',
        'nationality',
        'user_name',
        'password',
        'needs_support',
        'support_details',
        'status',
        'created_student_id',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'needs_support' => 'boolean',
    ];

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }
}
