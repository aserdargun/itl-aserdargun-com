import { describe, expect, it } from "vitest";

import {
  isNavigationItemCurrent,
  normalizeNavigationPathname,
} from "@/lib/navigation-active";

describe("publication navigation active paths", () => {
  it("preserves the exact root and normalizes slash and non-slash paths", () => {
    expect(normalizeNavigationPathname(null)).toBe("/");
    expect(normalizeNavigationPathname("/")).toBe("/");
    expect(normalizeNavigationPathname("////")).toBe("/");
    expect(normalizeNavigationPathname("/manifesto")).toBe("/manifesto");
    expect(normalizeNavigationPathname("/manifesto/")).toBe("/manifesto");
  });

  it("matches exact publications and nested segments only", () => {
    expect(isNavigationItemCurrent("/", "/")).toBe(true);
    expect(isNavigationItemCurrent("/manifesto", "/")).toBe(false);
    expect(
      isNavigationItemCurrent("/experiment-fabric/demo/", "/experiment-fabric"),
    ).toBe(true);
    expect(
      isNavigationItemCurrent("/experiment-fabrication/", "/experiment-fabric"),
    ).toBe(false);
    expect(
      isNavigationItemCurrent(
        "/experiment-fabric-sibling/",
        "/experiment-fabric",
      ),
    ).toBe(false);
  });
});
