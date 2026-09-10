import { defineConfig } from "@playwright/test";

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim() || undefined;
const localPort = process.env.PLAYWRIGHT_PORT ?? "4173";
if (
  !/^\d+$/.test(localPort) ||
  Number(localPort) < 1 ||
  Number(localPort) > 65535
) {
  throw new Error("PLAYWRIGHT_PORT must be an integer between 1 and 65535.");
}
const localBaseURL = `http://127.0.0.1:${localPort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  workers: externalBaseURL ? 1 : 4,
  outputDir: process.env.PLAYWRIGHT_OUTPUT_DIR ?? "test-results",
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  use: {
    baseURL: externalBaseURL ?? localBaseURL,
  },
  webServer: externalBaseURL
    ? undefined
    : {
        command: `node node_modules/serve/build/main.js out --listen tcp://127.0.0.1:${localPort} --no-clipboard`,
        url: localBaseURL,
        reuseExistingServer: false,
      },
});
