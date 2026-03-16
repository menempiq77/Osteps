param(
  [string]$BaseUrl = "http://localhost:8000",
  [string]$AdminToken,
  [string]$HodToken,
  [string]$TeacherToken,
  [string]$StudentToken,
  [string]$SubjectId = "1",
  [string]$StudentId = "1",
  [string]$BehaviourTypeId = "1",
  [string]$BehaviorId = "1",
  [string]$StudentBehaviorId = "1"
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($AdminToken) -or
    [string]::IsNullOrWhiteSpace($HodToken) -or
    [string]::IsNullOrWhiteSpace($TeacherToken) -or
    [string]::IsNullOrWhiteSpace($StudentToken)) {
  Write-Host "Missing required tokens." -ForegroundColor Red
  Write-Host "Usage example:" -ForegroundColor Yellow
  Write-Host '.\postman\run-behavior-role-matrix.ps1 -BaseUrl "http://localhost:8000" -AdminToken "..." -HodToken "..." -TeacherToken "..." -StudentToken "..."' -ForegroundColor Yellow
  exit 1
}

$collectionPath = Join-Path $PSScriptRoot "behavior-role-matrix.postman_collection.json"

if (!(Test-Path $collectionPath)) {
  Write-Host "Collection file not found: $collectionPath" -ForegroundColor Red
  exit 1
}

$newmanCommand = Get-Command newman -ErrorAction SilentlyContinue

if ($newmanCommand) {
  $runner = "newman"
  $args = @(
    "run", $collectionPath,
    "--env-var", "baseUrl=$BaseUrl",
    "--env-var", "subjectId=$SubjectId",
    "--env-var", "studentId=$StudentId",
    "--env-var", "behaviourTypeId=$BehaviourTypeId",
    "--env-var", "behaviorId=$BehaviorId",
    "--env-var", "studentBehaviorId=$StudentBehaviorId",
    "--env-var", "token_admin=$AdminToken",
    "--env-var", "token_hod=$HodToken",
    "--env-var", "token_teacher=$TeacherToken",
    "--env-var", "token_student=$StudentToken"
  )
}
else {
  $runner = "npx"
  $args = @(
    "--yes", "newman@latest",
    "run", $collectionPath,
    "--env-var", "baseUrl=$BaseUrl",
    "--env-var", "subjectId=$SubjectId",
    "--env-var", "studentId=$StudentId",
    "--env-var", "behaviourTypeId=$BehaviourTypeId",
    "--env-var", "behaviorId=$BehaviorId",
    "--env-var", "studentBehaviorId=$StudentBehaviorId",
    "--env-var", "token_admin=$AdminToken",
    "--env-var", "token_hod=$HodToken",
    "--env-var", "token_teacher=$TeacherToken",
    "--env-var", "token_student=$StudentToken"
  )
}

Write-Host "Running behavior role-matrix tests..." -ForegroundColor Cyan
& $runner @args
exit $LASTEXITCODE
