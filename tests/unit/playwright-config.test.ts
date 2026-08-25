import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Playwright target selection", () => {
  it("uses an explicit production URL without starting the local static server", async () => {
    vi.stubEnv("PLAYWRIGHT_BASE_URL", "https://itl.aserdargun.com");

    const { default: config } = await import("../../playwright.config");

    expect(config.use?.baseURL).toBe("https://itl.aserdargun.com");
    expect(config.webServer).toBeUndefined();
    expect(config.workers).toBe(1);
  });
});
