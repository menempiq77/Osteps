<?php

namespace App\Http\Requests\StudentRequest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'school_id' => 'required',
            'email'=> 'nullable',
            'student_name'=> 'required',
            'class_id' => 'required',
            'user_name' => 'required',
            'password' => 'nullable',
            'status' => 'required',
            'gender' => 'nullable|in:male,female',
            'student_gender' => 'nullable|in:male,female',
            'sex' => 'nullable|in:male,female',
            'student_sex' => 'nullable|in:male,female',
            'nationality' => 'nullable|string|max:100',
        ];
    }
}
