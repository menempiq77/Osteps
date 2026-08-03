$ErrorActionPreference = "Stop"

$deployCmd = "cd /var/www/osteps/Osteps && git stash && git pull origin main && npm run build && pm2 restart osteps"
$keyPath = "$env:USERPROFILE\.ssh\osteps_deploy"

ssh -i $keyPath -o BatchMode=yes root@dashboard.osteps.com $deployCmd
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host "Done: deployed to production."
