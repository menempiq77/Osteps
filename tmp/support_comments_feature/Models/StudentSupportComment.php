<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSupportComment extends Model
{
    protected $table = 'student_support_comments';

    protected $fillable = [
        'school_id',
        'student_id',
        'subject_id',
        'author_id',
        'author_name',
        'author_role',
        'comment',
    ];
}
