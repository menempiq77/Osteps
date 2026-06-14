---
name: testing-student-usernames-staff-header
description: Test that student usernames appear in the Students & Staff table and the dashboard "Total Students" inline table, and that the Students & Staff header is theme-aware. Use when verifying changes to dashboard/page.tsx, dashboard/students-staff/page.tsx, or dashboard/students/all/page.tsx.
---

# Testing: Student usernames in lists + theme-aware Students & Staff header

Three user-visible checks:
1. Students & Staff table shows a gray `@username` under each student name.
2. The Students & Staff header is a soft, theme-aware hero that recolors with the page color picker (not the old fixed dark/green block).
3. The dashboard "Total Students" inline detail table shows `@username` under each name.

## Environment
- Easiest: test directly on **production** `https://www.osteps.com` after deploy (login as the JESS school admin). The page color picker dots are in the top bar.
- Or run a local prod build that hits the live API: `cd /home/ubuntu/Osteps && npm run build && PORT=3100 npm run start` → `http://localhost:3100`.

## Where the "Total Students" stat lives (important — easy to miss)
`/dashboard` does NOT render the stat dashboard for school admins — it `router.replace`s to `/dashboard/subject-cards` (see `shouldUseSubjectCardsEntry` in `dashboard/page.tsx`). The "Total Students" stat card + inline table is the **subject dashboard**: open a subject (e.g. Islamic) → its dashboard at `/dashboard/s/<subjectId>` (e.g. `/dashboard/s/3`). Click the **Total Students** card to expand the inline table.

## Steps (all via UI; record it)
1. Go to `/dashboard/students-staff` (Students tab). Each row's name cell should have `@username` on a second line (e.g. `Ahmedmath → @Ahmedmath`). Zoom region ~`[180,440,700,720]` for a clean shot.
2. In the top bar, click a different color dot (e.g. Green if currently Blue). The header tint, "Students & Staff" title, "School Management" eyebrow, and the active Students/Teachers toggle should all recolor. (Old header hardcoded `#0f172a`/`#38C16C` and would NOT change — that's the adversarial check.)
3. Open Islamic subject dashboard (`/dashboard/s/3`) → click the **Total Students** card → inline "Total Students · N" table shows `@username` under each name (e.g. `Adam E → @AdamE`).

## Verifying via DOM (fast, no scrolling)
The annotated DOM returned with each computer screenshot includes every row even when `offscreen`. Grep the returned HTML for `@` spans to confirm usernames render across all rows without manually scrolling the whole table.

## Gotchas (may change over time)
- Username resolution checks several API shapes (`user_name`, `username`, `user.user_name`, `student.user_name`, …). If a username is blank for a student, the source record likely has none of those fields — not necessarily a bug.
- The header theme uses CSS vars (`var(--primary)`, `var(--theme-*)`). If it doesn't recolor, the page color picker may not be writing those vars, or the build is stale — hard-refresh (Ctrl+Shift+R) after a deploy.

## Devin Secrets Needed
- A school-admin login for `www.osteps.com` (JESS). For local prod testing a temp password can be set via tinker (save + restore the original bcrypt hash — write the hash to a file, don't inline it in `tinker --execute`, since `$` segments get eaten by the shell).
- `OSTEPS_DEPLOY_SSH_KEY` — only if deploying the build first (`~/.ssh/devin_deploy`, `root@dashboard.osteps.com`).
