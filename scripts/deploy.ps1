$ErrorActionPreference = "Stop"

$deployCmd = "cd /var/www/osteps/Osteps && git pull origin main && npm run build && pm2 restart osteps"

ssh root@dashboard.osteps.com $deployCmd
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

Write-Host "Done: deployed to production."
