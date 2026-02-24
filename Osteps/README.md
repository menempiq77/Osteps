# Osteps
Educational

## Tools - Transcribe
Frontend pages:
- src/app/dashboard/tools/page.tsx
- src/app/dashboard/tools/transcribe/page.tsx

Frontend service:
- src/services/transcribeApi.ts

Expected backend endpoint:
- POST /transcribe
- Accepts multipart file as `file` or JSON `{ "url": "..." }`
- Returns transcript text as `{ "text": "..." }` or `{ "data": { "text": "..." } }`

## Student Notes Storage Mode
- Default mode is file-backed (`.data/student-notes.json`) via Next API route.
- To use Laravel DB for notes persistence, set:
  - `STUDENT_NOTES_MODE=laravel`
  - `STUDENT_NOTES_LARAVEL_BASE_URL=https://your-laravel-api-base`
  - Optional: `STUDENT_NOTES_LARAVEL_PATH_TEMPLATE=/students/{id}/notes`
