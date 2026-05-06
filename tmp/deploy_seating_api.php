<?php
// Deploy script: create seating_layouts table + SeatingLayoutController + routes

require '/var/www/laravel/vendor/autoload.php';
$app = require '/var/www/laravel/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
use Illuminate\Support\Facades\DB;

// ── 1. Create the seating_layouts table ────────────────────────────────────
$exists = DB::select("SHOW TABLES LIKE 'seating_layouts'");
if (empty($exists)) {
    DB::statement("
        CREATE TABLE seating_layouts (
            id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            class_id VARCHAR(255) NOT NULL,
            school_id BIGINT UNSIGNED NULL,
            layout_data LONGTEXT NOT NULL,
            created_at TIMESTAMP NULL DEFAULT NULL,
            updated_at TIMESTAMP NULL DEFAULT NULL,
            UNIQUE KEY unique_class_school (class_id, school_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
    echo "Table seating_layouts created.\n";
} else {
    echo "Table seating_layouts already exists.\n";
}

// ── 2. Create SeatingLayoutController ──────────────────────────────────────
$controllerPath = '/var/www/laravel/app/Http/Controllers/Api/SeatingLayoutController.php';
$controllerCode = <<<'PHPCODE'
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SeatingLayoutController extends Controller
{
    protected function resolveSchoolId(Request $request): ?int
    {
        $user = $request->user();
        if (!$user) return null;
        // Teachers: school_id via teachers table
        $teacher = DB::table('teachers')->where('user_id', $user->id)->first();
        if ($teacher && $teacher->school_id) return (int) $teacher->school_id;
        // Admin: school is linked via schools.user_id
        $school = DB::table('schools')->where('user_id', $user->id)->first();
        if ($school) return (int) $school->id;
        return null;
    }

    public function show(Request $request, string $classId)
    {
        $schoolId = $this->resolveSchoolId($request);
        $row = DB::table('seating_layouts')
            ->where('class_id', $classId)
            ->where('school_id', $schoolId)
            ->first();
        if (!$row) {
            return response()->json(['message' => 'Not found'], 404);
        }
        $data = json_decode($row->layout_data, true);
        return response()->json($data);
    }

    public function update(Request $request, string $classId)
    {
        $schoolId = $this->resolveSchoolId($request);
        $validated = $request->validate([
            'items'     => 'required|array',
            'room_meta' => 'nullable|array',
        ]);

        $now = now();
        $existing = DB::table('seating_layouts')
            ->where('class_id', $classId)
            ->where('school_id', $schoolId)
            ->first();

        if ($existing) {
            DB::table('seating_layouts')
                ->where('class_id', $classId)
                ->where('school_id', $schoolId)
                ->update(['layout_data' => json_encode($validated), 'updated_at' => $now]);
        } else {
            DB::table('seating_layouts')->insert([
                'class_id'    => $classId,
                'school_id'   => $schoolId,
                'layout_data' => json_encode($validated),
                'created_at'  => $now,
                'updated_at'  => $now,
            ]);
        }

        return response()->json($validated);
    }
}
PHPCODE;

file_put_contents($controllerPath, $controllerCode);
echo "SeatingLayoutController written.\n";

// ── 3. Patch api.php: add use statement + routes ───────────────────────────
$apiPath = '/var/www/laravel/routes/api.php';
$api = file_get_contents($apiPath);

// Add use statement after MindUpgradeController
$useStatement = "use App\\Http\\Controllers\\Api\\SeatingLayoutController;";
if (strpos($api, 'SeatingLayoutController') === false) {
    $api = str_replace(
        "use App\\Http\\Controllers\\Api\\MindUpgradeController;",
        "use App\\Http\\Controllers\\Api\\MindUpgradeController;\n" . $useStatement,
        $api
    );
    echo "Added use statement to api.php.\n";
} else {
    echo "use statement already present.\n";
}

// Add routes just before the closing }); of the auth group
$seatingRoutes = "\n    // Seating layout\n    Route::get('classes/{classId}/seating-layout', [SeatingLayoutController::class, 'show']);\n    Route::put('classes/{classId}/seating-layout', [SeatingLayoutController::class, 'update']);";
if (strpos($api, "SeatingLayoutController::class, 'show'") === false) {
    // Insert before the last });
    $lastPos = strrpos($api, '});');
    if ($lastPos !== false) {
        $api = substr($api, 0, $lastPos) . $seatingRoutes . "\n\n" . substr($api, $lastPos);
    }
    echo "Added seating routes to api.php.\n";
} else {
    echo "Seating routes already present.\n";
}

file_put_contents($apiPath, $api);

echo "\nDone! Seating backend deployed.\n";
