# Osteps Development Workflow & Server Access Guide

> **Last Updated**: February 26, 2026  
> **Purpose**: Complete reference for AI assistant to resume work seamlessly in new sessions

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Server Access & Credentials](#server-access--credentials)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Deployment Process](#deployment-process)
6. [Database Management](#database-management)
7. [Common Commands Reference](#common-commands-reference)
8. [PowerShell Scripts](#powershell-scripts)
9. [Troubleshooting](#troubleshooting)
10. [Recent Changes Log](#recent-changes-log)

---

## 🎯 Project Overview

**Project Name**: Osteps Student Management Dashboard  
**Tech Stack**:
- **Frontend**: Next.js 15.5.12, React, TypeScript, TanStack React Query, Ant Design
- **Backend**: Laravel 8, PHP 8.3
- **Database**: MySQL (osteps_db)
- **Server**: Ubuntu with PM2 for process management
- **Version Control**: GitHub

**Purpose**: School management system for tracking students, behavior, grades, leaderboards, and more.

---

## 🔐 Server Access & Credentials

### SSH Access
```bash
Host: dashboard.osteps.com
User: root
Port: 22 (default)
Authentication: SSH key-based (no password required)
```

**SSH Command**:
```powershell
ssh root@dashboard.osteps.com
```

### Database Credentials

**Production Database** (on server):
```
Host: localhost
Database: osteps_db
Username: osteps
Password: osteps123
```

**Direct MySQL Access**:
```bash
mysql -h localhost -u osteps -p'osteps123' osteps_db
```

### GitHub Repository
```
Repository: https://github.com/menempiq77/Osteps.git
Branch: main
Access: User has push access (SSH key configured on local machine)
```

**SSH Key Location** (local):
```
Public Key: C:\Users\AEleslamboly\.ssh\id_ed25519.pub
Private Key: C:\Users\AEleslamboly\.ssh\id_ed25519
```

---

## 📁 Project Structure

### Local Development Environment

**Primary Working Directory**:
```
c:\Windows-\Osteps-main\Osteps\
```

**Note**: There's a nested Osteps folder structure:
```
c:\Windows-\Osteps-main\
└── Osteps/                  # Root Git repository
    ├── src/                 # Next.js frontend source
    ├── public/              # Static files
    ├── scripts/             # Custom PowerShell scripts
    ├── tmp/                 # Backend files & migrations
    ├── package.json
    ├── next.config.ts
    └── Osteps/              # Nested duplicate (ignore this one)
```

**Important Directories**:
- **Frontend Code**: `c:\Windows-\Osteps-main\Osteps\src\`
- **Components**: `c:\Windows-\Osteps-main\Osteps\src\components\`
- **API Services**: `c:\Windows-\Osteps-main\Osteps\src\services\`
- **Pages**: `c:\Windows-\Osteps-main\Osteps\src\app\`
- **Backend Files**: `c:\Windows-\Osteps-main\Osteps\tmp\` (for uploading to server)
- **Scripts**: `c:\Windows-\Osteps-main\Osteps\scripts\`

### Server Paths

**Frontend (Next.js)**:
```
Path: /var/www/osteps/Osteps
Git: Connected to GitHub repo
Build: npm run build
Process: PM2 managed as 'osteps'
```

**Backend (Laravel)**:
```
Path: /var/www/laravel
Git: Separate Laravel repository
Artisan: php artisan commands available
```

**Key Server Locations**:
- **Frontend Root**: `/var/www/osteps/Osteps/`
- **Backend Root**: `/var/www/laravel/`
- **Laravel Migrations**: `/var/www/laravel/database/migrations/`
- **Laravel Controllers**: `/var/www/laravel/app/Http/Controllers/`
- **Laravel Models**: `/var/www/laravel/app/Models/`
- **Laravel Requests**: `/var/www/laravel/app/Http/Requests/`

---

## 🔄 Development Workflow

### Standard Development Flow

1. **Edit Code Locally** in `c:\Windows-\Osteps-main\Osteps\`
2. **Test Locally** (optional - dev server on localhost:3000)
3. **Commit to Git**
4. **Push to GitHub**
5. **Pull on Server**
6. **Build & Restart**

### For Frontend Changes

```powershell
# Navigate to project root
cd c:\Windows-\Osteps-main\Osteps

# Make changes to files in src/

# Stage changes
git add .

# Commit
git commit -m "description of changes"

# Push to GitHub
git push origin main

# Deploy to server
ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && git pull origin main && npm run build && pm2 restart osteps"
```

### For Backend Changes

**Backend changes must be uploaded via SCP** (Laravel is not in GitHub):

```powershell
# Upload a file to server
scp "c:\Windows-\Osteps-main\Osteps\tmp\YourFile.php" root@dashboard.osteps.com:/var/www/laravel/path/to/destination/
```

**Common Backend Files**:
- Controllers: `/var/www/laravel/app/Http/Controllers/`
- Models: `/var/www/laravel/app/Models/`
- Requests: `/var/www/laravel/app/Http/Requests/`
- Services: `/var/www/laravel/app/Services/`

---

## 🚀 Deployment Process

### Quick Deployment (Frontend Only)

**Using Custom Script**:
```powershell
.\scripts\deploy.ps1
```

**Manual Command**:
```powershell
ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && git pull origin main && npm run build && pm2 restart osteps"
```

### Full Deployment (Frontend + Backend)

1. **Commit and Push Frontend**:
   ```powershell
   cd c:\Windows-\Osteps-main\Osteps
   git add .
   git commit -m "feat: description"
   git push origin main
   ```

2. **Upload Backend Files** (if changed):
   ```powershell
   scp "c:\Windows-\Osteps-main\Osteps\tmp\UpdatedController.php" root@dashboard.osteps.com:/var/www/laravel/app/Http/Controllers/
   ```

3. **Deploy Frontend**:
   ```powershell
   ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && git pull origin main && npm run build && pm2 restart osteps"
   ```

4. **Run Migrations** (if database changes):
   ```powershell
   ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate"
   ```

### PM2 Management

**Check Status**:
```bash
ssh root@dashboard.osteps.com "pm2 status"
```

**Restart**:
```bash
ssh root@dashboard.osteps.com "pm2 restart osteps"
```

**View Logs**:
```bash
ssh root@dashboard.osteps.com "pm2 logs osteps --lines 50"
```

---

## 🗄️ Database Management

### Database Information
- **Name**: `osteps_db`
- **User**: `osteps`
- **Password**: `osteps123`
- **Host**: `localhost` (on server)
- **Type**: MySQL

### Running Migrations

**Upload Migration File**:
```powershell
scp "c:\Windows-\Osteps-main\Osteps\tmp\2026_02_26_migration_name.php" root@dashboard.osteps.com:/var/www/laravel/database/migrations/
```

**Run Migration**:
```powershell
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate"
```

**Check Migration Status**:
```powershell
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate:status"
```

### Direct Database Access

**Query Database**:
```bash
ssh root@dashboard.osteps.com
mysql -h localhost -u osteps -p'osteps123' osteps_db
```

**Using Laravel Tinker**:
```bash
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan tinker"
```

### Recent Database Changes

**Migration Applied**: `2026_02_26_add_gender_to_students.php`
- Added columns: `gender`, `student_gender`, `sex`, `student_sex`, `nationality`
- Table: `students`
- Status: ✅ Applied successfully (233.08ms)

---

## 📝 Common Commands Reference

### Git Commands

```powershell
# Check status
git status

# Stage all changes
git add .

# Stage specific file
git add path/to/file.tsx

# Commit with message
git commit -m "fix: description of fix"

# Push to GitHub
git push origin main

# View recent commits
git log --oneline -5

# Check current commit
git rev-parse --short HEAD
```

### Server Commands

**SSH Access**:
```powershell
ssh root@dashboard.osteps.com
```

**Frontend Build**:
```bash
cd /var/www/osteps/Osteps
npm run build
```

**PM2 Restart**:
```bash
pm2 restart osteps
```

**Clear Laravel Cache**:
```bash
cd /var/www/laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### File Transfer (SCP)

**Upload Single File**:
```powershell
scp "local\path\file.php" root@dashboard.osteps.com:/var/www/laravel/destination/
```

**Download File from Server**:
```powershell
scp root@dashboard.osteps.com:/var/www/laravel/file.php "c:\Windows-\Osteps-main\Osteps\tmp\"
```

---

## 🛠️ PowerShell Scripts

Custom scripts located in: `c:\Windows-\Osteps-main\Osteps\scripts\`

### 1. commit_push.ps1
**Purpose**: Commit and push local changes to GitHub

**Usage**:
```powershell
.\scripts\commit_push.ps1
```

**What it does**:
1. Stages all changes (`git add .`)
2. Prompts for commit message
3. Commits changes
4. Pushes to GitHub main branch

### 2. deploy.ps1
**Purpose**: Deploy latest code to production server

**Usage**:
```powershell
.\scripts\deploy.ps1
```

**What it does**:
1. SSH to server
2. Navigate to `/var/www/osteps/Osteps`
3. Pull latest from GitHub
4. Run `npm run build`
5. Restart PM2 process

### 3. server_shell.ps1
**Purpose**: Quick SSH access to different server directories

**Usage**:
```powershell
.\scripts\server_shell.ps1
```

**Options**:
- Access frontend folder
- Access backend folder
- Run artisan commands
- View logs

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### **Build Fails on Server**
```bash
# Clear Next.js cache
ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && rm -rf .next && npm run build"
```

#### **PM2 Process Not Starting**
```bash
# Check PM2 logs
ssh root@dashboard.osteps.com "pm2 logs osteps --lines 100"

# Kill and restart
ssh root@dashboard.osteps.com "pm2 delete osteps && pm2 start npm --name osteps -- start"
```

#### **Database Changes Not Reflecting**
```bash
# Clear Laravel cache
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan cache:clear && php artisan config:clear"
```

#### **Migration Already Ran**
```bash
# Check migration status
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate:status"

# Rollback last migration
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate:rollback --step=1"
```

#### **Port 3000 Already in Use (Local)**
```powershell
# Kill all Node processes
Get-Process | Where-Object {$_.Name -like "*node*"} | Stop-Process -Force
```

---

## 📊 Recent Changes Log

### February 26, 2026 - Gender Persistence Fix

**Issue**: Gender and nationality values showing differently across browsers

**Root Cause**: localStorage caching overriding database values

**Changes Made**:

1. **Database Migration** (✅ Applied):
   - File: `2026_02_26_add_gender_to_students.php`
   - Added columns: `gender`, `student_gender`, `sex`, `student_sex`, `nationality`
   - Table: `students`
   - Commit: `3c0e074`

2. **Frontend - StudentList.tsx** (Commit: `e2700c2`, `c40aa9e`):
   - Removed `genderOverrides` localStorage state
   - Changed from `invalidateQueries` to `refetchQueries` for immediate updates
   - Direct database reading, no localStorage override

3. **Frontend - All Students Page** (Commit: `ac8539d`, `19333e1`):
   - Removed `genderOverrides` and `nationalityOverrides` state
   - Removed all localStorage.getItem() and setItem() calls
   - Direct database values only

4. **Backend - StudentService.php** (Uploaded to production):
   - Added gender fields to student update payload
   - Fixed password hashing (only hash if non-empty)

5. **Backend - UpdateRequest.php** (Uploaded to production):
   - Added validation rules for gender: nullable|in:male,female
   - Added validation rules for nationality: nullable|string|max:100

**Files Modified**:
- `src/components/dashboard/StudentList.tsx`
- `src/app/dashboard/students/all/page.tsx`
- `/var/www/laravel/app/Services/StudentService.php` (server)
- `/var/www/laravel/app/Http/Requests/UpdateRequest.php` (server)

**Git Commits**:
- `19333e1` - fix: correct syntax error in all students page
- `ac8539d` - fix: remove localStorage gender/nationality overrides
- `3c0e074` - feat: add gender columns to students table
- `e2700c2` - fix: use refetchQueries for immediate UI update
- `c40aa9e` - fix: remove localStorage gender override

### Previously Completed Features

1. **Teacher Leaderboard Fix**:
   - Backend: Modified `LeaderBoardController.php` `schoolSelf()` method
   - Frontend: Updated leaderboard page to use correct endpoint
   - Status: ✅ Shows all 182 school students

2. **Optional Fields on Edit**:
   - Gender and nationality are optional (can be left empty)
   - Password optional (only updates if provided)
   - Commit: `a2e73c1`

3. **Deployment Scripts**:
   - Created `commit_push.ps1`, `deploy.ps1`, `server_shell.ps1`
   - Located in `scripts/` folder

---

## 🎯 Quick Start for New Session

When starting a new session with AI assistant, provide this document and confirm:

1. **Server Access**: SSH key-based authentication is already configured
2. **GitHub Access**: Local machine has push access via SSH key
3. **Current Commit**: Check latest commit with `git log --oneline -1`
4. **Server Status**: Verify PM2 is running: `ssh root@dashboard.osteps.com "pm2 status"`
5. **Database**: Migration status: `ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate:status"`

**No need to share**:
- SSH credentials (already configured)
- Database passwords (documented here)
- GitHub tokens (SSH key authentication)
- Server IPs (hostname: dashboard.osteps.com)

---

## 📞 Support Information

**Project Owner**: User (AEleslamboly)  
**Local Machine**: Windows (PowerShell)  
**Server OS**: Ubuntu Linux  
**Time Zone**: Working in 2026 (future date context)

---

## 🔒 Security Notes

**Important**:
- This document contains sensitive credentials
- Keep this file LOCAL only (already in .gitignore)
- Never commit credentials to GitHub
- SSH keys remain on local machine only

**Credentials Summary** (for AI reference):
- SSH: root@dashboard.osteps.com (key-based)
- MySQL: osteps / osteps123 @ localhost
- GitHub: SSH key authentication

---

## 📝 Template Commands

### Deploy Full Stack Changes
```powershell
# 1. Commit frontend
cd c:\Windows-\Osteps-main\Osteps
git add .
git commit -m "feat: description"
git push origin main

# 2. Upload backend (if needed)
scp "c:\Windows-\Osteps-main\Osteps\tmp\File.php" root@dashboard.osteps.com:/var/www/laravel/destination/

# 3. Deploy frontend
ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && git pull origin main && npm run build && pm2 restart osteps"

# 4. Run migrations (if needed)
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate"
```

### Sync Migration to All Three Locations
```powershell
# 1. Upload to server
scp "c:\Windows-\Osteps-main\Osteps\tmp\migration.php" root@dashboard.osteps.com:/var/www/laravel/database/migrations/

# 2. Run on server
ssh root@dashboard.osteps.com "cd /var/www/laravel && php artisan migrate"

# 3. Commit to local git (for GitHub sync)
cd c:\Windows-\Osteps-main\Osteps
git add tmp/migration.php
git commit -m "feat: add migration description"
git push origin main

# 4. Pull to frontend server (optional - for record keeping)
ssh root@dashboard.osteps.com "cd /var/www/osteps/Osteps && git pull origin main"
```

---

**End of Guide** | Version 1.0 | February 26, 2026
