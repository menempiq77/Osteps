param(
  [string]$Message
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

if (-not $Message -or $Message.Trim().Length -eq 0) {
  $Message = Read-Host "Commit message"
}

if (-not $Message -or $Message.Trim().Length -eq 0) {
  Write-Error "Commit message is required."
}

git add -A

git commit -m $Message
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

git push origin main
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host "Done: committed and pushed to origin/main."
