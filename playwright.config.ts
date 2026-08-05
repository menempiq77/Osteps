import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run dev -- -p 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:4174/api",
    },
  },
});
