---
name: testing-osteps-adhkar-completion
description: Test Osteps Morning or Evening Adhkar completion, canonical journey aggregation, celebration, applause, and reload persistence through the authenticated UI.
---

# Testing Osteps Adhkar completion

Use this skill when changing featured Morning/Evening counters, Today's journey
aggregation, collection completion effects, daily reward locking, or progress
persistence.

## Devin Secrets Needed

- `OSTEPS_TEST_USERNAME`
- `OSTEPS_TEST_PASSWORD`

Load repository secrets from
`/run/repo_secrets/menempiq77/Osteps/.env.secrets`. Never print their values.

## Environment

Run the frontend against the configured production API:

```bash
source "/run/repo_secrets/menempiq77/Osteps/.env.secrets"
NEXT_PUBLIC_API_BASE_URL=https://${OSTEPS_SSH_HOST}/api npm run dev
```

Use the authenticated UI. A School Admin preview is useful for deterministic
local completion testing because it exercises counters and effects without
claiming or mutating a student wallet. Use a student only when the reward API
itself is in scope.

## Progress model

- Daily progress key:
  `osteps-adhkar-progress-v1:${subjectId}:${rewardDate}`.
- Featured entries use namespaced keys such as
  `featured-evening:hisn-98`.
- Today's journey has the canonical library total, currently `267`. Featured
  Morning/Evening entries reuse canonical IDs, so expected journey progress is
  the count of unique completed canonical IDs, not the sum of featured plus
  canonical collections.
- Student reward dates come from the server and reset at UAE midnight
  (`Asia/Dubai`). Staff preview uses the client daily date.

## Deterministic completion procedure

1. Open the Islamic/religious subject's Adhkar library through the authenticated
   UI.
2. Prepare a local-only featured collection with every entry complete except
   one final repetition. Record the original localStorage value first.
3. Confirm the library precondition:
   - the featured card is one entry short;
   - Today's journey includes the already completed canonical IDs;
   - the final counter's aria-label contains its exact current and target count.
4. Dismiss any localhost PWA install prompt before clicking a counter near the
   bottom of the viewport. Its fixed high-z-index panel might cover the counter
   and intercept trusted clicks.
5. Before the final trusted UI tap:
   - wrap `window.AudioContext` with a Proxy that counts constructions;
   - start a MutationObserver that records non-empty `[role="status"]` text.
     Completion overlays are transient, so a delayed DOM read might miss them.
6. Click the final counter with a trusted desktop input event. A programmatic
   `element.click()` is not sufficient for validating browser audio
   user-activation behavior.
7. Assert:
   - the counter reaches its target and exposes the completed aria-label;
   - the selected category becomes fully complete;
   - the status log contains `Masha'Allah!` and the collection name;
   - exactly one AudioContext is constructed;
   - returning to Collections increases Today's journey by exactly the number
     of newly completed unique canonical IDs.
8. Reload and verify progress persists without replaying the celebration or
   applause. If pre-startup audio/status evidence is required, keep one CDP
   WebSocket session open across:
   - `Page.enable`;
   - `Page.addScriptToEvaluateOnNewDocument`;
   - `Page.reload`;
   - render wait and `Runtime.evaluate`.
   A new-document script might be removed when its CDP session disconnects.
9. Restore the original localStorage value and confirm the library returns to
   its original totals. Do not change production rewards or wallet balances
   unless those server flows are explicitly in scope.

## Evidence

Follow the user's explicit artifact instruction. If screenshots or video are
not allowed, use exact DOM text, aria-labels, localStorage values, transient
status logs, audio-construction counts, URL state, and a text report. Never
claim audible playback solely from source inspection.
