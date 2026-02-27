<?php

namespace App\Http\Requests\LibraryRequest;

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
                'title'=> 'required|string',
                'library_resources_id' => 'required|exists:library_resources,id',
                'library_categories_id' => 'required|exists:library_categories,id',
                'description' => 'required|string',
                'file_path' => 'nullable',
                'link' => 'nullable|url',
                'existing_file_path' => 'nullable|string',
                'school_id' => 'required|exists:schools,id'

            ];
        
    }
}
