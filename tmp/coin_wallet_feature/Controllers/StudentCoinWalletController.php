<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\Student;
use App\Services\StudentCoinWalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentCoinWalletController extends Controller
{
    public function balance(
        Request $request,
        StudentCoinWalletService $wallets
    ): JsonResponse {
        $studentId = $this->studentIdFor($request);
        $wallet = $wallets->balanceForStudent($studentId);

        return response()->json([
            'status_code' => 200,
            'msg' => 'Student coin balance fetched successfully',
            'data' => [
                'student_id' => $studentId,
                'coin_balance' => (int) $wallet->balance,
            ],
        ]);
    }

    public function spend(
        Request $request,
        StudentCoinWalletService $wallets
    ): JsonResponse {
        $validated = $request->validate([
            'amount' => ['required', 'integer', 'min:1'],
            'purchase_key' => ['required', 'string', 'max:128'],
            'description' => ['nullable', 'string', 'max:255'],
            'student_id' => ['nullable', 'integer', 'min:1'],
        ]);

        $studentId = $this->studentIdFor($request);
        $wallet = $wallets->spend(
            $studentId,
            (int) $validated['amount'],
            $validated['purchase_key'],
            $validated['description'] ?? null
        );

        return response()->json([
            'status_code' => 200,
            'msg' => 'Coins spent successfully',
            'data' => [
                'student_id' => $studentId,
                'coin_balance' => (int) $wallet->balance,
            ],
        ]);
    }

    private function studentIdFor(Request $request): int
    {
        $user = $request->user();
        $role = strtoupper(str_replace(' ', '_', (string) $user->role));
        $requestedStudentId = (int) $request->input('student_id', 0);
        $authenticatedStudentId = (int) Student::where('user_id', $user->id)
            ->value('id');

        if ($role === 'STUDENT') {
            abort_if($authenticatedStudentId <= 0, 404, 'Student profile not found');
            abort_if(
                $requestedStudentId > 0 &&
                    $requestedStudentId !== $authenticatedStudentId,
                403,
                'Students can only access their own coin wallet'
            );

            return $authenticatedStudentId;
        }

        abort_unless(
            $role === 'SCHOOL_ADMIN',
            403,
            'Only students and school administrators can access student wallets'
        );
        abort_if($requestedStudentId <= 0, 422, 'A student profile is required');

        $schoolId = (int) School::where('user_id', $user->id)->value('id');
        $studentExists = $schoolId > 0 && Student::where([
            'id' => $requestedStudentId,
            'school_id' => $schoolId,
        ])->exists();

        abort_unless($studentExists, 404, 'Student profile not found');

        return $requestedStudentId;
    }
}
