import { defineConfig, devices } from "@playwright/test";
import { phase12TestConfig } from "./tests/config/phase-12.config";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: phase12TestConfig.e2e.timeouts.testMs,
  expect: {
    timeout: phase12TestConfig.e2e.timeouts.expectMs
  },
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: phase12TestConfig.e2e.baseUrl,
    trace: "retain-on-failure",
    screenshot: "only-on-failure"
  },
  webServer: {
    command: `npm run dev --workspace @devconnect/web -- --hostname localhost --port ${phase12TestConfig.e2e.webPort}`,
    url: phase12TestConfig.e2e.baseUrl,
    reuseExistingServer: true,
    timeout: phase12TestConfig.e2e.timeouts.webServerMs
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"]
      }
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"]
      }
    }
  ]
});