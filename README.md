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
