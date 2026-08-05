# Performance baseline

The client reports the Web Vitals **LCP**, **CLS**, **INP**, and **TTFB** metrics
to `POST /api/web-vitals`. In local development, the file-backed log is stored
at:

```text
.data/web-vitals/metrics.json
```

To view an entry locally:

1. Start the app with `npm run dev`.
2. Open a page in a browser and wait for it to finish loading.
3. Navigate between a few pages, then inspect `.data/web-vitals/metrics.json`.

Example entry:

```json
{
  "id": "v3-1234567890",
  "name": "LCP",
  "value": 1842.5,
  "delta": 1842.5,
  "rating": "good",
  "navigationType": "navigate",
  "pathname": "/",
  "createdAt": "2026-08-04T18:00:00.000Z"
}
```
