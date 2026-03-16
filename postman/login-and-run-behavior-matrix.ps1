param(
  [string]$BaseUrl = "http://localhost:8000",
  [string]$LoginPath = "/api/login",

  [string]$AdminEmail,
  [string]$AdminPass,
  [string]$HodEmail,
  [string]$HodPass,
  [string]$TeacherEmail,
  [string]$TeacherPass,
  [string]$StudentEmail,
  [string]$StudentPass,

  [string]$LoginUserField = "email",
  [string]$LoginSecretField = "password",

  [string]$SubjectId = "1",
  [string]$StudentId = "1",
  [string]$BehaviourTypeId = "1",
  [string]$BehaviorId = "1",
  [string]$StudentBehaviorId = "1"
)

$ErrorActionPreference = "Stop"

function Get-TokenFromResponse {
  param($ResponseObject)

  if ($null -eq $ResponseObject) { return $null }

  $candidates = @(
    $ResponseObject.access_token,
    $ResponseObject.token,
    $ResponseObject.api_token,
    $ResponseObject.bearer_token,
    $ResponseObject.data.access_token,
    $ResponseObject.data.token,
    $ResponseObject.data.api_token,
    $ResponseObject.result.access_token,
    $ResponseObject.result.token,
    $ResponseObject.user.access_token,
    $ResponseObject.user.token
  )

  foreach ($candidate in $candidates) {
    if ($candidate -is [string] -and -not [string]::IsNullOrWhiteSpace($candidate)) {
      return $candidate
    }
  }

  return $null
}

function Get-LoginToken {
  param(
    [string]$RoleName,
    [string]$UserValue,
    [string]$SecretValue
  )

  if ([string]::IsNullOrWhiteSpace($UserValue) -or [string]::IsNullOrWhiteSpace($SecretValue)) {
    throw "$RoleName credentials are missing."
  }

  $loginUrl = "$($BaseUrl.TrimEnd('/'))/$($LoginPath.TrimStart('/'))"
  $body = @{}
  $body[$LoginUserField] = $UserValue
  $body[$LoginSecretField] = $SecretValue

  Write-Host "Logging in as $RoleName..." -ForegroundColor Cyan

  try {
    $response = Invoke-RestMethod -Method Post -Uri $loginUrl -ContentType "application/json" -Body ($body | ConvertTo-Json)
  }
  catch {
    throw "Login failed for $RoleName at $loginUrl. $($_.Exception.Message)"
  }

  $token = Get-TokenFromResponse -ResponseObject $response
  if ([string]::IsNullOrWhiteSpace($token)) {
    $jsonPreview = $response | ConvertTo-Json -Depth 6
    throw "Could not extract token for $RoleName. Response: $jsonPreview"
  }

  return $token
}

$adminToken = Get-LoginToken -RoleName "School Admin" -UserValue $AdminEmail -SecretValue $AdminPass
$hodToken = Get-LoginToken -RoleName "HOD" -UserValue $HodEmail -SecretValue $HodPass
$teacherToken = Get-LoginToken -RoleName "Teacher" -UserValue $TeacherEmail -SecretValue $TeacherPass
$studentToken = Get-LoginToken -RoleName "Student" -UserValue $StudentEmail -SecretValue $StudentPass

$runnerScript = Join-Path $PSScriptRoot "run-behavior-role-matrix.ps1"
if (!(Test-Path $runnerScript)) {
  throw "Runner script not found: $runnerScript"
}

Write-Host "All tokens acquired. Running role matrix..." -ForegroundColor Green

$runnerParams = @{
  BaseUrl = $BaseUrl
  AdminToken = $adminToken
  HodToken = $hodToken
  TeacherToken = $teacherToken
  StudentToken = $studentToken
  SubjectId = $SubjectId
  StudentId = $StudentId
  BehaviourTypeId = $BehaviourTypeId
  BehaviorId = $BehaviorId
  StudentBehaviorId = $StudentBehaviorId
}

& $runnerScript @runnerParams

exit $LASTEXITCODE
