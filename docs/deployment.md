# Production deployment

## Required GitHub secrets

The deploy workflow requires these repository secrets:

- `DEPLOY_SSH_KEY`: private SSH key used to access the production VPS.
- `DEPLOY_SSH_HOST`: production VPS hostname or IP address.
- `DEPLOY_SSH_USER`: SSH username on the production VPS.

The private key is consumed by the SSH action and is never printed by the
workflow.

## Pipeline

The `CI` workflow runs for pushes and pull requests targeting `main`. After a
successful CI workflow run on `main`, the `Deploy` workflow:

1. Connects to the production VPS over SSH.
2. Pulls the latest `main` branch in `/var/www/osteps/Osteps`.
3. Installs production dependencies.
4. Builds the Next.js application with the configured Node memory limit.
5. Restarts the `osteps` PM2 process.
6. Retries an HTTPS health check against `https://osteps.com/` for up to 60
   seconds.

The production server needs the swap space already provisioned for builds.

## Manual fallback

If the workflow is unavailable, connect to the VPS and run:

```bash
ssh "$DEPLOY_SSH_USER@$DEPLOY_SSH_HOST"
cd /var/www/osteps/Osteps
git pull origin main
npm install --no-audit --no-fund
NODE_OPTIONS=--max-old-space-size=5120 npm run build
pm2 restart osteps
```
