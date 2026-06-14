# Test Plan — Student usernames in lists + Students & Staff header redesign (PR #219)

Env: local prod build `http://localhost:3100` (NODE_ENV=production → live API `dashboard.osteps.com/api`).
Admin: Jess@osteps.com (temp pw set for session, original hash saved for restore).

Code paths informing this plan:
- Students & Staff table username: `src/app/dashboard/students/all/page.tsx` Student Name column render (~line 3014) shows `@{record.userName}`.
- Header redesign: `src/app/dashboard/students-staff/page.tsx` lines 13-83 (theme-aware hero using `var(--theme-*)`/`var(--primary)`).
- Dashboard inline table username: `src/app/dashboard/page.tsx` `loadStudents()` adds `userName` (~line 932) and the inline `<tbody>` renders `@{item.userName}` (~line 2178).

## Test 1 — Students & Staff table shows usernames (NEW, headline)
1. Go to `/dashboard/students-staff` (Students tab active by default).
- PASS: under each student's name a gray `@username` line is visible (e.g. `@adam.e`). FAIL: only the name, no `@username`.
- Adversarial: a broken impl (not reading `userName`) would show names with no second line.

## Test 2 — Students & Staff header redesign is theme-aware (NEW)
1. Observe the header: soft tinted background (not the old solid dark slate/green block), eyebrow "School Management", title "Students & Staff", segmented Students/Teachers toggle.
- PASS: header background is light/soft and the active toggle uses the theme primary color. FAIL: old dark gradient block.
2. Click a different page-color dot in the top bar (e.g. Blue), then look at the header.
- PASS: header tint, title color, and active toggle recolor to the new theme (e.g. blue). FAIL: stays green/unchanged.
- Adversarial: the OLD header had hardcoded `#0f172a`/`#38C16C` and would NOT change with the theme.

## Test 3 — Dashboard "Total Students" inline table shows usernames (NEW)
1. Go to `/dashboard`. Click the **Total Students** stat card to open the inline panel.
- PASS: the inline table's Student Name column shows `@username` under each name. FAIL: name only.
- Adversarial: without the `userName` field added to `StatDetailItem` + `loadStudents`, no `@username` would appear.

## Cleanup
- Restore Jess original password hash (`$2y$12$jeItPPWEkw93XADK3U5DsuB/tgXALJy0ikvhbD.bF/v3jZzjfdfyq`).
