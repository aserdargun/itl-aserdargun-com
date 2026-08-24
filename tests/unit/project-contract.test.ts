import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
const nextConfig = readFileSync("next.config.mjs", "utf8");

describe("project contract", () => {
  it("exposes Setup, Run, Validate, and Stop lifecycle commands", () => {
    expect(pkg.scripts["dev:codex"]).toContain("127.0.0.1");
    expect(pkg.scripts["dev:codex"]).toContain("4173");
    expect(pkg.scripts["stop:codex"]).toBe("node scripts/stop-dev.mjs 4173");
    expect(pkg.scripts["validate:codex"]).toContain("test:e2e");
  });

  it("matches MD and MDX page extensions for the MDX loader", () => {
    expect(nextConfig).toContain("extension: /\\.mdx?$/");
    expect(nextConfig).not.toContain("extension: /\\\\.mdx?$/");
  });
});
