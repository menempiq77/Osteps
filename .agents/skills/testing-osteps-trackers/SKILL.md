---
name: testing-osteps-trackers
description: Test Osteps student tracker rewards, wallet persistence, teacher readiness, and certificate reporting through the UI.
---

# Testing Osteps Student Trackers

Use this skill for runtime verification of student tracker, coin wallet, leaderboard-point, final-test, certificate, or report Achievement changes.

## Devin Secrets Needed

- `OSTEPS_TEST_USERNAME`
- `OSTEPS_TEST_PASSWORD`

Use a dedicated school-admin test account that can impersonate students. Load repo-scoped secrets from the environment-provided secret file; never print their values.

## Runtime

Run the local frontend against the production API:

```bash
source "/run/repo_secrets/menempiq77/Osteps/.env.secrets" &&
NEXT_PUBLIC_API_BASE_URL=https://${OSTEPS_SSH_HOST}/api npm run dev
```

- Frontend: `http://localhost:3000`
- API: `https://${OSTEPS_SSH_HOST}/api`
- Production frontend: `https://osteps.com`

Do not use `${OSTEPS_SSH_HOST}` as a frontend URL.

## Safe Test Data

- Prefer a clearly dedicated test student.
- Do not mutate real learners to obtain convenient tracker state.
- Record the student's initial wallet, topic count, tracker marks, subject, class, and selected topic before clicking `Done`.
- Use one incomplete topic with a small configured reward.
- Do not attempt cleanup by undoing a completion; tracker completion is intentionally irreversible.

## Setup Through the UI

1. Sign in as school admin.
2. Open **All Students**, search for the dedicated test student, and confirm its assignment.
3. If assignment is required, assign the intended subject and existing class through the drawer.
4. Click **Login As** for the student.
5. Open the subject, then **Trackers**, then the target tracker card.
6. Read the actual tracker URL after navigation. Displayed class names and route IDs can differ; never reuse another student's route ID without verifying it.
7. Confirm the live tracker has the topic count, reward, and quiz configuration required by the test.

## Primary Reward Test

Start one annotated recording only after setup is complete.

1. Capture the full-screen precondition:
   - wallet balance;
   - topics completed;
   - selected topic reward;
   - enabled `Done` action;
   - absence of a student mark input or reversible completion control.
2. Click `Done` once.
3. Capture transient evidence immediately:
   - exact success toast;
   - coin animation;
   - reward amount;
   - completed/locked row;
   - disabled `Done`;
   - incremented topic count.
4. Allow several seconds for the production leaderboard aggregation/refetch. The wallet may show a transient `+reward` before the numeric balance settles.
5. Assert that the wallet increased by exactly the configured reward.
6. Hard-refresh and assert that wallet, completion count, locked row, and disabled action persist.
7. Never click another topic merely to retry a missed screenshot.

## Downstream Checks

### Teacher readiness

1. Return to admin.
2. Open the teacher tracker review using the student tracker’s verified class and tracker IDs.
3. Select the same student.
4. Assert the exact learning-topic count and final-test guidance.

The teacher roster might lag behind a newly assigned student. If the student is absent after a refresh and a complete selector check, mark readiness untested rather than substituting a real learner or using direct API calls.

### Student report

1. Impersonate the same test student again.
2. Open **My Report**.
3. Verify tracker topics/marks reflect the reward.
4. Verify the **Achievements** section and its certificate state.

### Final test and certificates

Inspect the tracker before promising this coverage. A live tracker might have no quiz topic. If no safe assigned quiz tracker exists, explicitly mark these untested:

- final-test lock/unlock;
- final-test submission;
- certificate request;
- teacher certificate upload;
- issued-certificate link in Achievements.

Do not create production quiz or certificate data solely to satisfy a runtime test unless the user explicitly approves it.

## Evidence and Reporting

- Use full-screen screenshots.
- Prefer two-column before/after evidence.
- Annotate recording setup, test starts, passed assertions, and untested limitations.
- Report exact observed values and exact UI text.
- Do not claim overall success when any requested path is untested.
- For an open PR, post one test-results comment with embedded visual evidence and the Devin session link.
