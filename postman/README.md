# Behavior Role Matrix Runner

Use this if Postman UI is confusing.

## Fully automatic (recommended)
From `Osteps/` run:

```powershell
.\postman\login-and-run-behavior-matrix.ps1 -BaseUrl "http://localhost:8000" -AdminEmail "admin@example.com" -AdminPass "..." -HodEmail "hod@example.com" -HodPass "..." -TeacherEmail "teacher@example.com" -TeacherPass "..." -StudentEmail "student@example.com" -StudentPass "..."
```

If your login API uses `username` instead of `email`:

```powershell
.\postman\login-and-run-behavior-matrix.ps1 -BaseUrl "http://localhost:8000" -LoginUserField "username" -AdminEmail "admin_user" -AdminPass "..." -HodEmail "hod_user" -HodPass "..." -TeacherEmail "teacher_user" -TeacherPass "..." -StudentEmail "student_user" -StudentPass "..."
```

## One command
From `Osteps/` run:

```powershell
.\postman\run-behavior-role-matrix.ps1 -BaseUrl "http://localhost:8000" -AdminToken "<admin_token>" -HodToken "<hod_token>" -TeacherToken "<teacher_token>" -StudentToken "<student_token>"
```

## What it checks
- Admin mutation routes succeed.
- HOD/Teacher without `subject_id` fail with `422`.
- HOD/Teacher with `subject_id` succeed.
- Student mutation routes fail with `403`.

## Optional npm command

```powershell
npm run test:behavior-matrix
```

For the npm command, fill tokens in [behavior-role-matrix.postman_environment.json](behavior-role-matrix.postman_environment.json) first.

## Optional npm auto command

```powershell
npm run test:behavior-matrix:auto -- -BaseUrl "http://localhost:8000" -AdminEmail "admin@example.com" -AdminPass "..." -HodEmail "hod@example.com" -HodPass "..." -TeacherEmail "teacher@example.com" -TeacherPass "..." -StudentEmail "student@example.com" -StudentPass "..."
```
