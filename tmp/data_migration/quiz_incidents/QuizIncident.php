<?php
namespace App\Models; class QuizIncident extends Model { protected $guarded = []; protected $casts = ['context'=>'array','occurred_at'=>'datetime']; }
