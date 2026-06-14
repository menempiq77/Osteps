<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentReport extends Model
{
    protected $table = 'student_reports';

    protected $fillable = [
        'school_id',
        'student_id',
        'subject_id',
        'term_id',
        'author_id',
        'author_name',
        'author_role',
        'effort',
        'conduct',
        'attainment',
        'strengths',
        'targets',
        'comment',
    ];
}
