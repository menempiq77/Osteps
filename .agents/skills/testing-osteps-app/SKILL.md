---
name: testing-osteps-app
description: How to run and test the Osteps Next.js dashboard locally against the production API, including login, roles, and the navigation paths to games, live polls and student report pages.
---

# Testing the Osteps dashboard locally

## Running the app
```bash
cd <repo>
npm install                      # blueprint maintenance step
NEXT_PUBLIC_API_BASE_URL=https://${OSTEPS_SSH_HOST}/api npm run dev
# http://localhost:3000 — the login page footer shows "Local API target: <url>",
# which is the quickest confirmation the env var took effect.
```

`npm run build` (`next build`) ignores ESLint and TypeScript errors by repo config, so a green build only proves bundling/route generation succeeded.

### Critical: never run `next build` while the dev server is running
Both use the same `.next` directory. A concurrent build (especially `ANALYZE=true npm run build`, which also auto-opens bundle-analyzer tabs in the browser) deletes `.next` under the running dev server and produces
`ENOENT: .next/routes-manifest.json` / `.next/required-server-files.json` and HTTP 500 on every route.
Symptom in the browser: "Application error: a client-side exception has occurred".
Fix: wait for the build to finish, kill the dev server, restart it, and hard-reload (Ctrl+Shift+R).
If you must do both at once, use a separate clone (e.g. `Osteps-build/`) for the build.

Other gotchas:
- `npm run dev` runs `dev:clean`, which `rm -rf .next` — restarting dev wipes any build/analyze output.
- `pkill -f "next dev"` can match your own shell command string and kill the shell before it starts the server. Prefer killing by PID (`ss -ltnp | grep :3000`) or `pkill -f next-server`.
- After any dev restart the first page load may show a stale-chunk client error; Ctrl+Shift+R clears it. Do not report this as a product bug.
- The dev server takes 10-25s to compile a route on first visit; wait before judging a page as broken.

## Login
Sign in from `/` with email-or-username + password. Watch for leading/trailing characters in passwords relayed from chat — a password quoted as `${_repo_secret_menempiq77/Osteps_OSTEPS_TEST_PASSWORD}` after an email can be misread as an "@" separator. If you see the red "Invalid credentials" message, try the variant with/without the leading punctuation before escalating.

Reveal the password with the eye icon and confirm the exact typed string before reporting a credential problem.

The logged-in role is visible in the header ("SCHOOL ADMIN WORKSPACE", "Welcome back, <NAME>") and in the console log `[SubjectContext] bootstrap — role: <ROLE>`.

### Role-gated pages
- `/dashboard/students/my-report` derives everything from `currentUser.student`; non-student roles just get an amber "No report data found." alert. You need a STUDENT account to test it.
- School Admin can reach games, tools, and `/dashboard/reports/student/[studentId]`.
- Student accounts land on a different subject-cards page: a "Student Tools" row with Games / Library / Timetable / Announcements / Ask a Question / **My Report** / Leaderboard. The role is confirmed in the console log `[SubjectContext] bootstrap — role: STUDENT`.
- Report/chart pages only render their charts when the underlying data exists (attendance entries, conduct events, *marked* assessments); otherwise they show antd `Empty` states. Before concluding a chart is broken, check the adjacent counters — and when picking a test student, pick one with marked assessments if you need the academic bar chart.

## Testing a specific branch when the shared checkout has moved on
In fast-moving sessions the lead may switch `/home/ubuntu/repos/Osteps` (and the secondary clone) to newer branches mid-run, which silently invalidates a dev server you started earlier. **Always re-check `git -C <repo> branch --show-current` and that the files the PR touched still exist before trusting a running server.**
Safe way to test an older branch without disturbing anyone:
```bash
git -C /path/to/Osteps worktree add /home/ubuntu/osteps-<pr> <branch>
ln -s /path/to/Osteps/node_modules /home/ubuntu/osteps-<pr>/node_modules   # works fine with next dev
cd /home/ubuntu/osteps-<pr> && NEXT_PUBLIC_API_BASE_URL=https://${OSTEPS_SSH_HOST}/api npx next dev -p 3002
```
Each worktree gets its own `.next`, so this also sidesteps the concurrent-build clobbering problem. Clean up with `git worktree remove --force`.

### Browser navigation can appear "stuck" on a localhost tab
The app registers a PWA service worker, and a tab that has gone into the offline state (amber "You are offline. Reconnect to load live school data or save changes." banner — this banner appears routinely even when the app works fine) can stop responding to omnibox navigation: the URL bar and screenshot keep showing the old page even though the dev server logs the new request. Opening a brand-new Chrome **window** (`ctrl+n`) and adding a cache-busting query (`http://localhost:<port>/?fresh=1`) reliably breaks out. Closing the stuck tab also works. Don't mistake this for an app bug.

## Measuring polling / timing behaviour
- If the polled endpoint is a **local Next route** (`/api/...`), the dev-server log is the best evidence. Start the server with its output teed to a file and derive timestamps yourself, e.g.
  `... npx next dev -p 3004 2>&1 | tee /tmp/dev.log` and a tailer that prefixes `date +%H:%M:%S` to matching lines.
- If it hits the **remote prod API** (`${OSTEPS_SSH_HOST}`), dev logs show nothing. Read the page's own resource timings instead:
  `performance.getEntriesByType('resource').filter(r => /<endpoint>/.test(r.name)).map(r => Math.round(r.startTime))`
  Set a `window.__t0 = performance.now()` marker first and filter `startTime > __t0` so each measurement window is clean; dedupe by rounding to 500 ms because one logical poll can emit duplicate entries.
- To make a tab genuinely `document.visibilityState === "hidden"`, open a new tab in the **same** window (`ctrl+t`). Switching to a different window may leave the tab "visible but occluded" and will not fire `visibilitychange`.
- **Always confirm the component you are measuring is actually mounted.** `grep -rn "<ComponentName>" src/` — the repo contains dead components (e.g. `src/components/chat/ChatWidget.tsx` is not rendered anywhere; the chat UI users reach is `src/app/dashboard/chat/page.tsx`, which has its own `setInterval` polling). Also diff the file against main (`git diff origin/main...HEAD -- <path>`) to be sure the PR really changed the code path you are exercising.

## File-backed local API routes (`.data/`)
Some routes persist to `DATA_DIR` = `<project-root>/.data` (`src/lib/server/dataDir.ts`, overridable with `OSTEPS_DATA_DIR`). In a git worktree that resolves to the worktree root, so each worktree has its own copy — handy for tests. Record whether the target file exists *before* the run so any content is unambiguously yours. These routes tend to do naive read-modify-write of a whole JSON file, so they may be racy: worth firing ~20 concurrent POSTs (`curl ... &` in a loop, then `wait`) and re-parsing the file, plus a sequential control run to prove concurrency is the trigger. Watch for two distinct failure modes — outright corrupted JSON (overlapping writes leave trailing bytes) and silent lost updates (valid JSON, far fewer entries than posted). Once such a file is corrupt the route can 500 forever if it rethrows `JSON.parse` errors.

## Navigation paths (from `/dashboard/subject-cards`)
- **Games**: "Games" card → `/dashboard/games` → "Play Neon Tower" / "Play Brick Bounce" / "Enter the Lost Library". Each game page has a **Play free admin preview** / **Preview the adventure** button ("Preview mode does not spend coins") that opens the level map, then click level 1 to reach the actual game. Interactivity checks: Brick Bounce → "Launch ball" + arrow keys (Score/Balls/Bricks HUD changes); Neon Tower → "Drop block" (Height n/5 increments); Lost Library → arrow keys move the explorer sprite.
- **Live Polls**: "Tools" card → `/dashboard/tools/live-polls`. Poll list shows **Results** only for `active`/`closed` polls; clicking it is a read-only fetch. Chart types depend on question types present (multiple_choice / rating render recharts; word_cloud and free text do not).
- **Chat**: left icon rail → **Chat** → `/dashboard/chat`.
- **Lesson decks with the Bloom taxonomy badge**: `/dashboard/lessons/uae-curriculum/<gradeSlug>/<topicSlug>`, e.g. `/dashboard/lessons/uae-curriculum/grade-1-year-2/wudu`. The badge only renders for sections using the **singular** `learningObjective` field; sections with plural `learningObjectives` render a different, badge-less block. Check the lesson source under `src/app/dashboard/lessons/uae-curriculum/lessons/` (see `registry.ts` for the slug → file mapping) before concluding the badge is missing.
- **Plenary**: `/plenary/<code>` is public and works with any arbitrary code (`enabled: !!code`), so you can exercise its polling with a throwaway code without touching a real plenary. Submitting a comment is the only mutation.
- **Student report with charts**: "Reports" card → pick Subject, then Class, then a student → `/dashboard/reports/student/<id>?subject_id=..&class_id=..`. Renders attendance donut, behaviour donut and an academic bar chart.

## Working against PRODUCTION data
`${OSTEPS_SSH_HOST}` is live school data. Default to read-only: no creating/editing/deleting polls, no Present mode, no saving marks, comments or support info, no Export CSV/Print. Prefer admin "preview" game modes, which do not spend student coins.

## Verifying lazy-loaded (`next/dynamic ssr:false`) components
Broken dynamic imports leave the loading placeholder on screen. Assert the placeholder is *replaced*: antd `Spin` for games, `animate-pulse` grey blocks for charts. For recharts, hover a bar/segment to get the tooltip — that proves the interactive component mounted rather than a static fallback. Cross-check chart values against the numeric text on the same page (e.g. donut `57%` vs "4/7 present").

## Known-benign console noise (do not report as regressions)
`antd v5 support React is 16 ~ 18` compat warning, `[antd: Tooltip] overlayInnerStyle is deprecated`, `[antd: Modal] destroyOnClose is deprecated`, a React "unique key prop" warning in `DashboardLayout`, a next/image aspect-ratio warning, and `Route "..." used params.<x>. params should be awaited` on dynamic lesson routes.

## `next/image` gotchas in this repo
`next.config.ts` sets only `images: { formats, minimumCacheTTL }` — there is **no `dangerouslyAllowSVG`**, so hand-probing `/_next/image?url=%2Fsomething.svg` returns `400 "url" parameter is valid but image type is not allowed`. That probe is **not** representative: Next 15 marks SVG sources `unoptimized` automatically and emits a plain `<img src="/something.svg">`, which serves fine. Always confirm against the rendered page before reporting a broken image. For raster assets the optimizer is used normally (`/_next/image?url=...webp` → 200).

## Devin Secrets Needed
- `OSTEPS_SSH_HOST`, `OSTEPS_SSH_USER`, `OSTEPS_SSH_KEY` — only for deploying to the production VPS (PM2, not Netlify); not needed for local UI testing.
- Application login credentials for ${OSTEPS_SSH_HOST} are supplied by the user per session; a STUDENT-role account is needed to cover student-only pages.
