<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentCoinWallet extends Model
{
    protected $fillable = [
        'student_id',
        'balance',
    ];

    protected $casts = [
        'student_id' => 'integer',
        'balance' => 'integer',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
