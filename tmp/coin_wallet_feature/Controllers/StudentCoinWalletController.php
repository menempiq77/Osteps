<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        $studentId = (int) Student::where('user_id', $request->user()->id)
            ->value('id');

        abort_if($studentId <= 0, 404, 'Student profile not found');

        return $studentId;
    }
}
