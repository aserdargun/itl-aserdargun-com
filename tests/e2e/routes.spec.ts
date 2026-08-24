import { expect, test } from "@playwright/test";

export const PUBLIC_ROUTES = [
  "/",
  "/manifesto/",
  "/architecture/",
  "/twin-capsule/",
  "/experiment-fabric/",
  "/feature-factory/",
  "/algorithm-arena/",
  "/fault-lab/",
  "/ai-scientist/",
  "/fleet-intelligence/",
  "/research/",
  "/technology/",
  "/glossary/",
  "/about/",
  "/experiment-fabric/demo/",
] as const;

const PLACEHOLDER_OR_ERROR =
  /coming soon|under construction|lorem ipsum|placeholder content|application error|internal server error|page could not be rendered/iu;

const canonicalPath = (pathname: string) =>
  pathname === "/" ? pathname : `${pathname.replace(/\/+$/u, "")}/`;

for (const route of PUBLIC_ROUTES) {
  test(`${route} is a complete public publication`, async ({ page }) => {
    const response = await page.goto(route);

    expect(response?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main")).not.toContainText(PLACEHOLDER_OR_ERROR);
  });
}

test("every same-origin anchor has a label and a valid route, fragment, trailing slash, and target", async ({
  page,
}) => {
  const routeSet = new Set(PUBLIC_ROUTES);
  const idsByRoute = new Map<string, string[]>();
  const anchorsByRoute = new Map<
    string,
    Array<{
      href: string;
      label: string;
      rel: string;
      target: string;
    }>
  >();

  for (const route of PUBLIC_ROUTES) {
    await page.goto(route);
    idsByRoute.set(
      route,
      await page
        .locator("[id]")
        .evaluateAll((elements) => elements.map((element) => element.id)),
    );
    anchorsByRoute.set(
      route,
      await page.locator("a[href]").evaluateAll((anchors) =>
        anchors.map((anchor) => ({
          href: anchor.getAttribute("href") ?? "",
          label:
            anchor.getAttribute("aria-label")?.trim() ||
            anchor.textContent?.replace(/\s+/gu, " ").trim() ||
            anchor.querySelector("img")?.getAttribute("alt")?.trim() ||
            "",
          rel: anchor.getAttribute("rel") ?? "",
          target: anchor.getAttribute("target") ?? "",
        })),
      ),
    );
  }

  const checkedPaths = new Set<string>();
  for (const [sourceRoute, anchors] of anchorsByRoute) {
    for (const anchor of anchors) {
      expect(
        anchor.href.trim(),
        `${sourceRoute} contains an empty href`,
      ).not.toBe("");
      expect(
        anchor.label,
        `${sourceRoute} -> ${anchor.href} has no label`,
      ).not.toBe("");

      const url = new URL(anchor.href, `http://127.0.0.1:4173${sourceRoute}`);
      if (url.origin !== "http://127.0.0.1:4173") {
        expect(anchor.target, `${sourceRoute} -> ${anchor.href}`).toBe(
          "_blank",
        );
        expect(anchor.rel.split(/\s+/u)).toEqual(
          expect.arrayContaining(["noopener", "noreferrer"]),
        );
        continue;
      }

      expect(anchor.target, `${sourceRoute} -> ${anchor.href}`).toBe("");
      expect(url.pathname, `${sourceRoute} -> ${anchor.href}`).not.toContain(
        "//",
      );
      const destinationRoute = canonicalPath(url.pathname);
      expect(
        routeSet.has(destinationRoute as (typeof PUBLIC_ROUTES)[number]),
        `${sourceRoute} -> ${anchor.href}`,
      ).toBe(true);

      if (!checkedPaths.has(destinationRoute)) {
        const response = await page.request.get(destinationRoute);
        expect(response.status(), `${sourceRoute} -> ${anchor.href}`).toBe(200);
        expect(
          new URL(response.url()).pathname,
          `${sourceRoute} -> ${anchor.href}`,
        ).toBe(destinationRoute);
        checkedPaths.add(destinationRoute);
      }

      if (url.hash) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        expect(fragment, `${sourceRoute} contains an empty fragment`).not.toBe(
          "",
        );
        expect(
          idsByRoute.get(destinationRoute)?.filter((id) => id === fragment),
          `${sourceRoute} -> ${anchor.href}`,
        ).toHaveLength(1);
      }
    }
  }
});

test("the guaranteed unknown route returns the custom 404 and useful live links", async ({
  page,
}) => {
  const response = await page.goto(
    "/__industrial-twin-lab-guaranteed-unknown__/",
  );

  expect(response?.status()).toBe(404);
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator("main h1")).toHaveText("Publication not found");

  for (const [name, destination] of [
    ["Index", "/"],
    ["Manifesto", "/manifesto/"],
    ["Glossary", "/glossary/"],
  ] as const) {
    const link = page.getByRole("main").getByRole("link", { name });
    await expect(link).toBeVisible();
    const responseForLink = await page.request.get(
      (await link.getAttribute("href")) ?? "",
    );
    expect(responseForLink.status()).toBe(200);
    expect(canonicalPath(new URL(responseForLink.url()).pathname)).toBe(
      destination,
    );
  }
});
