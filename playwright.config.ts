import { defineConfig, devices } from "@playwright/test";

const localBaseURL = "http://127.0.0.1:3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? localBaseURL;
const useLocalServer = baseURL === localBaseURL;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results/artifacts",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ["list"],
    ["html", { outputFolder: "test-results/playwright-report", open: "never" }],
  ],
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: useLocalServer
    ? [
        {
          command: "node tests/support/mock-supabase.mjs",
          url: "http://127.0.0.1:54321/health",
          reuseExistingServer: !process.env.CI,
          timeout: 30_000,
        },
        {
          command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
          url: localBaseURL,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
            ...process.env,
            NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
            NEXT_PUBLIC_SUPABASE_ANON_KEY: "playwright-local-placeholder",
          },
        },
      ]
    : undefined,
});
