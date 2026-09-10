import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("Playwright target selection", () => {
  it("uses an isolated loopback port without reusing an unrelated listener", async () => {
    vi.stubEnv("PLAYWRIGHT_BASE_URL", "");
    vi.stubEnv("PLAYWRIGHT_PORT", "4183");
    const { default: config } = await import("../../playwright.config");
    expect(config.use?.baseURL).toBe("http://127.0.0.1:4183");
    expect(config.webServer).toMatchObject({
      url: "http://127.0.0.1:4183",
      reuseExistingServer: false,
    });
  });

  it("rejects invalid port text before constructing a server command", async () => {
    vi.stubEnv("PLAYWRIGHT_PORT", "4183;invalid");
    await expect(import("../../playwright.config")).rejects.toThrow(
      /PLAYWRIGHT_PORT/,
    );
  });
  it("uses an explicit production URL without starting the local static server", async () => {
    vi.stubEnv("PLAYWRIGHT_BASE_URL", "https://itl.aserdargun.com");

    const { default: config } = await import("../../playwright.config");

    expect(config.use?.baseURL).toBe("https://itl.aserdargun.com");
    expect(config.webServer).toBeUndefined();
    expect(config.workers).toBe(1);
  });
});
