<?php

namespace App\Repositories;

use App\Models\QuizAnswer;
use App\DTOs\AnswerMarkDTO;
use App\Helper\ApiResponseHelper;

class markAnswerRepository implements markAnswerRepositoryInterface
{
    public function markAnswer($dto, $id)
    {
            $answer = QuizAnswer::find($id);
            if(!$answer)
            {
                return ApiResponseHelper::notFound(
                    'Not found'
                );
            }
            $answer->is_correct = $dto->is_correct;
            $answer->marks = $dto->marks;
            $answer->comment = $dto->comment;
            $answer->save();

            return $answer;
    }
}