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
        $studentClassName = (string) \Illuminate\Support\Facades\DB::table('school_classes')
            ->where('id', $this->class_id)
            ->value('class_name');

        $subjects = \Illuminate\Support\Facades\DB::table('student_subject_enrollments as sse')
            ->join('subject_classes as sc', 'sc.id', '=', 'sse.subject_class_id')
            ->join('subjects as s', 's.id', '=', 'sc.subject_id')
            ->where('sse.student_id', $this->id)
            ->where('sse.is_active', 1)
            ->where('sc.is_active', 1)
            ->whereNotNull('sc.base_class_label')
            ->where('sc.base_class_label', '!=', '')
            ->where('sc.base_class_label', '!=', 'Default')
            ->when($studentClassName !== '', fn ($query) => $query->where('sc.base_class_label', $studentClassName))
            ->orderBy('s.name')
            ->select('s.id', 's.name')
            ->distinct()
            ->get();

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
            'subjects' => $subjects,
            'subject_name' => optional($subjects->first())->name,
            'is_sen' => (bool) ($this->is_sen ?? false),
            'sen_details' => $this->sen_details,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at

        ];
    }
}
