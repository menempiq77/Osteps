<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentCoinTransaction extends Model
{
    protected $fillable = [
        'student_id',
        'amount',
        'source_type',
        'source_key',
        'description',
    ];

    protected $casts = [
        'student_id' => 'integer',
        'amount' => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
