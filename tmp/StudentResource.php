<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'school_id' => $this->school_id,
            'class_id' => $this->class_id,
            'student_name' => $this->student_name,
            'status' => $this->status,
            'user_name' => $this->user_name,
            'gender' => $this->gender,
            'student_gender' => $this->student_gender,
            'sex' => $this->sex,
            'student_sex' => $this->student_sex,
            'nationality' => $this->nationality,
            'is_sen' => (bool) ($this->is_sen ?? false),
            'sen_details' => $this->sen_details,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at

        ];
    }
}