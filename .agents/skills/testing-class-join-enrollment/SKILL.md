---
name: testing-class-join-enrollment
description: Test the class join-code + student self-enrollment + admin review + school-notification flow end-to-end. Use when verifying changes to the public /join page, ClassEnrollmentReviewModal, ClassJoinLinkModal, SchoolNotificationBell, or the Laravel ClassEnrollmentController.
---

# Testing: Class join links & student self-enrollment

End-to-end flow: teacher shares a per-class join link → student fills a public form (no login) → a pending `ClassEnrollmentRequest` + school notification are created → admin reviews/edits/confirms → confirmed student is created and enrolled into the base class **and** every active subject-class mapped to it, so they appear in Students & Staff.

## Environment
- Run the **production** Next build locally so it hits the live API:
  `cd /home/ubuntu/Osteps && npm run build && PORT=3100 npm run start` → `http://localhost:3100` (NODE_ENV=production → API `https://dashboard.osteps.com/api`).
- Backend (Laravel) lives on the same VPS at `/var/www/laravel`. SSH with the deploy key: `ssh -i ~/.ssh/devin_deploy root@dashboard.osteps.com`. Backend tables/controllers are applied directly on the server (the repo keeps copies under `tmp/class_enrollment_feature/`).

## Test target (known-good fixture)
- Class **8IsB** = `school_classes.id=5`, `year_id=2`, maps to **subject_class id=3** (Islamic). The base class has 18 raw students but the subject-scoped Students view shows 17 (one student isn't subject-enrolled) — don't be alarmed by the 17-vs-18 mismatch.
- Navigate the Classes page via: Islamic subject → Manager → Manage Classes → Year 8. URL pattern: `/dashboard/s/3/classes?year=2`.

## Steps (all via UI, record it)
1. On the 8IsB row click **Join link** → modal shows a 6-char code + `localhost:3100/join/XXXXXX`. (Generating a link persists `school_classes.join_code`.)
2. Open the link in a new tab (no login) → form scoped to the class. Fill name/gender/nationality/password, toggle support **Yes** (reveals the detail textarea), submit → success card with a generated username (e.g. `devin.tester`).
3. Back on admin tab, reload Classes → top-bar **bell** shows unread count + "X asked to join 8IsB"; the 8IsB row shows a **Signups** badge.
4. Click the **Signups** badge → review modal lists the entry (Needs support + note). Click **Confirm** → toast "Student confirmed and added to 8IsB", queue empties, badge clears.
5. Open the 8IsB **Students** view (URL has `subjectClassId=3`) → the new student appears, proving class+subject assignment.

## Backend cross-check (the key assertion)
The headline requirement is subject enrollment. Verify directly:
```bash
ssh -i ~/.ssh/devin_deploy root@dashboard.osteps.com 'cd /var/www/laravel && php artisan tinker --execute='"'"'
$s=\App\Models\Student::where("user_name","devin.tester")->first();
echo $s->id." class_id=".$s->class_id." is_sen=".$s->is_sen.PHP_EOL;
foreach(\DB::table("student_subject_enrollments")->where("student_id",$s->id)->get() as $r){echo "sc=".$r->subject_class_id." active=".$r->is_active.PHP_EOL;}
'"'"''
```
A row with the right `subject_class_id` + `is_active=1` is the proof. If it's missing, `ClassEnrollmentController::approve()` isn't running its `enrollIntoSubjectClasses()` helper.

## Cleanup (always do this)
Delete in this order: `student_subject_enrollments`, `topic_status_progress` rows, the `class_enrollment_requests` row, the `students` row, the `users` row, then the `school_notifications` row (`where message like '%<name>%'`). Reset `school_classes.join_code` to NULL if you generated one.

## Gotchas (may change over time)
- **`$` in bcrypt hashes gets interpolated.** When restoring a saved password hash via `tinker --execute`, the shell/PHP will eat `$...` segments and silently corrupt the hash. Write the hash to a file and `file_get_contents()` it instead of inlining a double-quoted string. Verify with `User::find(2)->password === $h`.
- The `users.password` column does **not** appear to be auto-`hashed`-cast here, so to set a known temp password use `Hash::make()`, and to restore assign the raw original hash directly. (Could change if a `'hashed'` cast is added — re-check by testing a login after setting.)
- If the public form 404s or says "Link not valid", the join code may not be persisted or the lookup route may be down — check `join_code` on the class and the `/class-by-join-code` endpoint.

## Devin Secrets Needed
- `OSTEPS_DEPLOY_SSH_KEY` — SSH key for `root@dashboard.osteps.com` (used for backend tinker cross-checks and cleanup). Saved at `~/.ssh/devin_deploy`.
- A school-admin login for `www.osteps.com` / the local prod build. For testing, a temp password can be set on the admin user via tinker (save and restore the original hash).
