# AI Assistant Session Context - Osteps Project

> **Quick reference for starting new AI sessions**  
> **Full details**: See `DEVELOPMENT_WORKFLOW_GUIDE.md`

---

## 🔑 Essential Information

### Server Access
- **SSH**: `ssh root@dashboard.osteps.com` (key-based, already configured)
- **Frontend**: `/var/www/osteps/Osteps` (Next.js, managed by PM2 as 'osteps')
- **Backend**: `/var/www/laravel` (Laravel 8, PHP 8.3)
- **Database**: `mysql -h localhost -u osteps -p'osteps123' osteps_db`

### Local Environment
- **Working Directory**: `c:\Windows-\Osteps-main\Osteps\`
- **GitHub**: `https://github.com/menempiq77/Osteps.git` (main branch)
- **SSH Key**: Already configured at `C:\Users\AEleslamboly\.ssh\id_ed25519`

### Tech Stack
- **Frontend**: Next.js 15.5.12, React, TypeScript, React Query, Ant Design
- **Backend**: Laravel 8, PHP 8.3, MySQL
- **Hosting**: Ubuntu server, PM2 process manager

---

## 🚀 Common Workflows

### Deploy Frontend Changes
```powershell
cd c:\Windows-\Osteps-main\Osteps
git add .
git commit -m "description"
git push origin main
ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && git pull origin main && npm run build && pm2 restart osteps"
```

### Upload Backend File
```powershell
scp "c:\Windows-\Osteps-main\Osteps\tmp\File.php" root@dashboard.osteps.com:/var/www/laravel/app/Http/Controllers/
```

### Run Database Migration
```powershell
# Upload migration
scp "c:\Windows-\Osteps-main\Osteps\tmp\migration.php" root@dashboard.osteps.com:/var/www/laravel/database/migrations/

# Run it
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate"
```

---

## 📁 Key Paths

**Local**:
- Frontend: `c:\Windows-\Osteps-main\Osteps\src\`
- Components: `c:\Windows-\Osteps-main\Osteps\src\components\`
- Services: `c:\Windows-\Osteps-main\Osteps\src\services\`
- Backend staging: `c:\Windows-\Osteps-main\Osteps\tmp\`
- Scripts: `c:\Windows-\Osteps-main\Osteps\scripts\`

**Server**:
- Frontend: `/var/www/osteps/Osteps/`
- Backend: `/var/www/laravel/`
- Controllers: `/var/www/laravel/app/Http/Controllers/`
- Models: `/var/www/laravel/app/Models/`
- Services: `/var/www/laravel/app/Services/`
- Migrations: `/var/www/laravel/database/migrations/`

---

## 🔄 Recent Context (Feb 26, 2026)

### Last Major Fix: Gender Persistence Bug
- **Problem**: Gender/nationality showing differently across browsers
- **Root Cause**: localStorage overrides + missing database columns
- **Solution**: 
  1. ✅ Migration added gender columns to students table (commit `3c0e074`)
  2. ✅ Removed localStorage caching from frontend (commits `c40aa9e`, `e2700c2`, `ac8539d`, `19333e1`)
  3. ✅ Updated backend validation & service layer
  4. ✅ All deployed to production

### Current State
- Latest commit: `19333e1` (fix: correct syntax error in all students page)
- PM2 Status: ✅ Running
- Database: ✅ Migration applied (students table has gender columns)
- All three environments synced: Local ✅ GitHub ✅ Production ✅

---

## 🛠️ PowerShell Scripts Available

Located in `scripts/`:
- `commit_push.ps1` - Git commit and push helper
- `deploy.ps1` - Deploy to production
- `server_shell.ps1` - Quick SSH access

---

## ⚡ Quick Commands

```powershell
# Check current commit
git log --oneline -1

# Check PM2 status
ssh root@dashboard.osteps.com "pm2 status"

# Check migrations
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate:status"

# View server logs
ssh root@dashboard.osteps.com "pm2 logs osteps --lines 50"

# Full deploy
ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && git pull origin main && npm run build && pm2 restart osteps"
```

---

## 📝 For AI Assistant

**You have access to**:
- SSH to server (no credentials needed)
- Git push to GitHub (SSH key configured)
- Database access credentials (documented)
- All file paths and structure

**You do NOT need**:
- SSH passwords (key-based auth)
- Database credentials to be re-shared
- GitHub tokens (SSH key auth)
- Server IPs to be provided

**Just start working** - all access is pre-configured!

---

**For full details, workflows, and troubleshooting**: See `DEVELOPMENT_WORKFLOW_GUIDE.md`
