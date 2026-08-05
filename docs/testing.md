# Testing locally

## Unit tests

Install dependencies and run the deterministic Vitest suite:

```bash
npm test
```

Use `npm run test:watch` while developing tests.

## End-to-end tests

The Playwright suite starts the Next.js development server on a dedicated local
port and mocks API requests in the browser. No backend service is required.

Install the Chromium browser once:

```bash
npx playwright install chromium
```

Then run the suite:

```bash
npm run test:e2e
```

The PDF incident test uses a mocked assessment-document state and a browser
fullscreen shim. It exercises the annotator's real fullscreen-change handler,
exit modal, reason validation, and metadata POST; it does not validate PDF.js
rendering against a real assessment file or a remote backend.
