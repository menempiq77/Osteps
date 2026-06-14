# Test Plan — Class Join Links & Student Self-Enrollment (PR #218)

Env: local prod build `http://localhost:3100` (NODE_ENV=production → live API `dashboard.osteps.com/api`).
Target: class **8IsB** (school_classes id=5, year 2) → maps to **subject_class id=3** (subject 3).
Admin: Jess@osteps.com (temp pw set, original hash saved for restore).

## Test 1 — Teacher gets a shareable join link (NEW)
1. Login as admin, go to `/dashboard/classes`.
2. On the **8IsB** row click **"Join link"**.
- PASS: modal opens showing a 6-char code + a link `localhost:3100/join/XXXXXX`. FAIL: error / no code.
3. Copy the link.

## Test 2 — Student self-enrollment via public page (NEW, headline)
1. Open the join link in a fresh tab (no login).
- PASS: form shows class name "8IsB" + fields First name, Last name, Gender, Nationality, Password, and "Do you feel you need extra support in lessons?" No/Yes. FAIL: "Link not valid".
2. Fill: First=Devin, Last=Tester, Gender=Male, Nationality=UAE, Password=student123, Support=Yes, details="Extra reading time".
3. Submit.
- PASS: success card shows a generated **username** (e.g. devin.tester). FAIL: error / no confirmation.
- Adversarial: a broken impl would 404, not save, or show no username.

## Test 3 — Notification bell + class-card badge update (NEW)
1. Back on the admin tab, reload `/dashboard/classes`.
- PASS: top-bar **bell** shows unread count ≥1; opening it lists "New student signup" mentioning 8IsB. The **8IsB** row shows a **"Signups"** badge with count **1**. FAIL: no badge / no notification.

## Test 4 — Admin review: edit + confirm (NEW)
1. Click the **Signups** badge on 8IsB → review modal lists the pending "Devin Tester" with "Needs support" + the detail text.
- PASS: entry visible with correct name/gender/nationality/username and support note.
2. Click **Confirm**.
- PASS: success toast "Student confirmed and added to 8IsB."; row removed from queue; badge count drops to 0.

## Test 5 — Confirmed student appears in Students & Staff, assigned to class+subject (NEW, the user's added requirement)
1. Go to `/dashboard/students-staff` (Students tab), in the Islamic/relevant subject scope.
- PASS: **Devin Tester** appears in the student list assigned to class **8IsB**. FAIL: not present.
2. Backend cross-check (tinker, shown as text): a `student_subject_enrollments` row exists for the new student_id with subject_class_id=3 and is_active=1.
- Adversarial: without the new approve() subject-enroll code, the student would exist but NOT appear under the subject / have no enrollment row.

## Cleanup (after tests)
- Delete test student + user + topic progress + subject enrollment + enrollment request + related school_notification.
- Restore Jess original password hash from /tmp/jess_orig_hash.txt.
- Reset class 5 join_code to NULL if desired.
