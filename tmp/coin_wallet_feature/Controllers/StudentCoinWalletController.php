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

    public function purchaseGamePass(
        Request $request,
        StudentCoinWalletService $wallets
    ): JsonResponse {
        $validated = $request->validate([
            'game_id' => ['required', 'string', 'max:64'],
            'run_id' => ['required', 'uuid'],
            'student_id' => ['nullable', 'integer', 'min:1'],
        ]);
        $studentId = $this->studentIdFor($request);
        $pass = $wallets->purchaseGamePass(
            $studentId,
            $validated['game_id'],
            $validated['run_id']
        );

        return response()->json([
            'status_code' => 200,
            'msg' => $pass['charged']
                ? 'Paid game pass activated successfully'
                : 'Paid game pass restored successfully',
            'data' => $this->gamePassData($pass),
        ]);
    }

    public function gamePassStatus(
        Request $request,
        StudentCoinWalletService $wallets
    ): JsonResponse {
        $validated = $request->validate([
            'game_id' => ['required', 'string', 'max:64'],
            'run_id' => ['required', 'uuid'],
            'student_id' => ['nullable', 'integer', 'min:1'],
        ]);
        $studentId = $this->studentIdFor($request);
        $pass = $wallets->gamePassStatus(
            $studentId,
            $validated['game_id'],
            $validated['run_id']
        );

        return response()->json([
            'status_code' => 200,
            'msg' => 'Paid game pass status fetched successfully',
            'data' => $this->gamePassData($pass),
        ]);
    }

    public function adhkarRewards(
        Request $request,
        StudentCoinWalletService $wallets
    ): JsonResponse {
        $studentId = $this->studentIdFor($request);
        $status = $wallets->adhkarRewardsForToday($studentId);

        return response()->json([
            'status_code' => 200,
            'msg' => 'Adhkar reward status fetched successfully',
            'data' => $this->adhkarRewardData($status),
        ]);
    }

    public function awardAdhkar(
        Request $request,
        StudentCoinWalletService $wallets
    ): JsonResponse {
        $validated = $request->validate([
            'reward_type' => ['required', 'in:morning,evening,dua'],
            'adhkar_id' => ['nullable', 'string', 'max:32'],
            'student_id' => ['nullable', 'integer', 'min:1'],
        ]);
        $studentId = $this->studentIdFor($request);
        $result = $wallets->awardAdhkarReward(
            $studentId,
            $validated['reward_type'],
            $validated['adhkar_id'] ?? null
        );

        return response()->json([
            'status_code' => 200,
            'msg' => $result['awarded']
                ? 'Adhkar coins awarded successfully'
                : 'Adhkar reward was already collected today',
            'data' => [
                ...$this->adhkarRewardData($result),
                'reward_type' => $result['reward_type'],
                'adhkar_id' => $result['adhkar_id'],
                'reward_amount' => $result['reward_amount'],
                'awarded' => $result['awarded'],
            ],
        ]);
    }

    private function gamePassData(array $pass): array
    {
        return [
            'student_id' => (int) $pass['wallet']->student_id,
            'coin_balance' => (int) $pass['wallet']->balance,
            'game_id' => $pass['game_id'],
            'run_id' => $pass['run_id'],
            'entry_cost' => (int) $pass['entry_cost'],
            'active' => $pass['active'],
            'charged' => $pass['charged'],
            'expires_at' => $pass['expires_at'],
        ];
    }

    private function adhkarRewardData(array $status): array
    {
        return [
            'student_id' => (int) $status['wallet']->student_id,
            'coin_balance' => (int) $status['wallet']->balance,
            'reward_date' => $status['reward_date'],
            'morning_claimed' => $status['morning_claimed'],
            'evening_claimed' => $status['evening_claimed'],
            'dua_ids' => $status['dua_ids'],
        ];
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
