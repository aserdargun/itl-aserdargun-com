import { defineConfig } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  workers: externalBaseURL ? 1 : undefined,
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  use: {
    baseURL: externalBaseURL ?? "http://127.0.0.1:4173",
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: "npm run start:static",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: false,
      },
});
