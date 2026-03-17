param(
  [Parameter(Mandatory = $true)]
  [string]$BackendRepoPath
)

$ErrorActionPreference = "Stop"

$frontendRepoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$tmpRoot = Join-Path $frontendRepoRoot "tmp"
$backendRoot = Resolve-Path $BackendRepoPath

$artisanPath = Join-Path $backendRoot "artisan"
$routesApiPath = Join-Path $backendRoot "routes\api.php"

if (-not (Test-Path $artisanPath)) {
  throw "Backend repo path must point to a Laravel project root containing 'artisan'."
}

if (-not (Test-Path $routesApiPath)) {
  throw "Backend repo path must contain routes/api.php."
}

$migrationFiles = @(
  "2026_03_01_000001_create_subject_classes_table.php",
  "2026_03_01_000002_create_student_subject_enrollments_table.php",
  "2026_03_01_000003_create_user_subject_assignments_table.php",
  "2026_03_01_000004_create_user_subject_class_assignments_table.php",
  "2026_03_01_000005_create_user_subject_preferences_table.php",
  "2026_03_01_000006_add_subject_id_to_core_tables.php",
  "2026_03_01_000007_map_legacy_records_to_islamiat_subject.php"
)

$controllerFiles = @(
  "SubjectContextController.php",
  "SubjectClassController.php"
)

$copyPlan = @()

foreach ($fileName in $migrationFiles) {
  $copyPlan += @{
    Source = Join-Path $tmpRoot $fileName
    Destination = Join-Path $backendRoot (Join-Path "database\migrations" $fileName)
  }
}

foreach ($fileName in $controllerFiles) {
  $copyPlan += @{
    Source = Join-Path $tmpRoot $fileName
    Destination = Join-Path $backendRoot (Join-Path "app\Http\Controllers\Api" $fileName)
  }
}

foreach ($item in $copyPlan) {
  if (-not (Test-Path $item.Source)) {
    throw "Required source file not found: $($item.Source)"
  }

  $destinationDir = Split-Path -Parent $item.Destination
  if (-not (Test-Path $destinationDir)) {
    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
  }

  Copy-Item -Path $item.Source -Destination $item.Destination -Force
}

$routeSnippetPath = Join-Path $backendRoot "subject_workspace_routes.snippet.php"
$routeSnippet = @'
use App\Http\Controllers\Api\SubjectContextController;
use App\Http\Controllers\Api\SubjectClassController;

Route::get('subjects/my-context', [SubjectContextController::class, 'myContext'])->name('subjects-my-context');
Route::post('subjects/set-last', [SubjectContextController::class, 'setLast'])->name('subjects-set-last');
Route::post('subjects/assign-staff', [SubjectContextController::class, 'assignStaff'])->name('subjects-assign-staff');
Route::get('subjects/staff-assignments', [SubjectContextController::class, 'staffAssignments'])->name('subjects-staff-assignments');

Route::get('subject-classes', [SubjectClassController::class, 'index'])->name('subject-classes-index');
Route::post('subject-classes', [SubjectClassController::class, 'store'])->name('subject-classes-store');
Route::post('subject-classes/enroll-students', [SubjectClassController::class, 'enrollStudents'])->name('subject-classes-enroll-students');
'@

Set-Content -Path $routeSnippetPath -Value $routeSnippet -NoNewline

Write-Host "Copied subject workspace backend files into $backendRoot"
Write-Host "Generated route snippet: $routeSnippetPath"
Write-Host "Next steps:"
Write-Host "1. Merge the controller use statements and routes from subject_workspace_routes.snippet.php into routes/api.php"
Write-Host "2. Run php artisan migrate"
Write-Host "3. Validate /subjects/my-context, /subject-classes, and /subject-classes/enroll-students"