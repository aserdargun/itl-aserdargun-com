import { expect, test, type Locator, type Page } from "@playwright/test";

const PUBLIC_ROUTES = [
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

const PUBLIC_ROUTE_H1S: Record<(typeof PUBLIC_ROUTES)[number], string> = {
  "/": "Industrial Twin Lab",
  "/manifesto/": "Industrial Twin Lab Manifesto",
  "/architecture/": "Industrial AI Safety Architecture",
  "/twin-capsule/": "Twin Capsule",
  "/experiment-fabric/": "Experiment Fabric",
  "/feature-factory/": "Feature Factory",
  "/algorithm-arena/": "Algorithm Arena",
  "/fault-lab/": "Synthetic Fault Laboratory",
  "/ai-scientist/": "AI Scientist",
  "/fleet-intelligence/": "Fleet Intelligence",
  "/research/": "Open Research Questions",
  "/technology/": "Technology Atlas",
  "/glossary/": "Glossary",
  "/about/": "About Industrial Twin Lab",
  "/experiment-fabric/demo/": "Experiment Fabric",
};

const VIEWPORTS = [
  { width: 1440, height: 1000 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
] as const;

const DEMO_CONTROLS = [
  "Machine",
  "Problem",
  "Feature set",
  "Algorithm",
  "Validation",
] as const;

const SAFETY_ZONE_LABELS = [
  "OT Control Zone",
  "Data Access Zone",
  "Twin Zone",
  "AI Experiment Zone",
  "Validation Gate",
  "Inference Zone",
] as const;

const expectNoDocumentOverflow = async (page: Page) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(
    dimensions.scrollWidth,
    `${new URL(page.url()).pathname} must not overflow the document`,
  ).toBeLessThanOrEqual(dimensions.clientWidth);
};

const expectMinimumHeight = async (locator: Locator, minimum: number) => {
  const box = await locator.boundingBox();
  expect(box, "expected a rendered bounding box").not.toBeNull();
  expect(box?.height).toBeGreaterThanOrEqual(minimum);
};

for (const viewport of VIEWPORTS) {
  test(`${viewport.width}x${viewport.height} preserves every public route without document overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      if (viewport.width === 320) {
        await expect(page.locator("main h1")).toHaveText(
          PUBLIC_ROUTE_H1S[route],
        );
        await expect(page.locator("main h1")).toHaveCount(1);
        expect(
          await page
            .locator("body")
            .evaluate((body) => getComputedStyle(body).minWidth),
          `${route} must not impose a document minimum wider than the viewport`,
        ).toBe("0px");

        if (route === "/") {
          const stageGeometry = await page
            .locator(".operating-thesis__stage")
            .first()
            .evaluate((stage) => {
              const title = stage
                .querySelector("strong")!
                .getBoundingClientRect();
              const role = stage
                .querySelector(":scope > span:last-child")!
                .getBoundingClientRect();
              return { titleBottom: title.bottom, roleTop: role.top };
            });
          expect(stageGeometry.titleBottom).toBeLessThanOrEqual(
            stageGeometry.roleTop,
          );
        }
      }
      await expectNoDocumentOverflow(page);

      const primary = page.getByRole("navigation", { name: "Primary" });
      const disclosure = page.getByRole("button", { name: "All sections 13" });
      await expect(disclosure).toBeVisible();
      await expectMinimumHeight(disclosure, 44);
      await expect(primary).toBeVisible({ visible: viewport.width > 850 });

      const scrollRegions = page.locator(
        '[role="region"][aria-label*="scroll horizontally"]',
      );
      for (let index = 0; index < (await scrollRegions.count()); index += 1) {
        const region = scrollRegions.nth(index);
        await expect(region).toBeVisible();
        await expect(region).toHaveAttribute("tabindex", "0");
        expect(await region.getAttribute("aria-label")).toMatch(/\S/u);
        expect(
          await region.evaluate(
            (element) => getComputedStyle(element).overflowX,
          ),
        ).toMatch(/auto|scroll/u);
      }

      const clippedDiagramLabels = await page
        .locator("figure h2, figure h3, figure figcaption")
        .evaluateAll((elements) =>
          elements
            .filter(
              (element) =>
                element.scrollWidth > element.clientWidth + 1 ||
                element.scrollHeight > element.clientHeight + 1,
            )
            .map((element) => element.textContent?.trim()),
        );
      expect(clippedDiagramLabels).toEqual([]);
    }
  });

  test(`${viewport.width}x${viewport.height} preserves the required rail, demo, disclosure, and diagram contracts`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    await page.goto("/manifesto/");
    const runningIndex = page.getByRole("complementary", {
      name: "Manifesto running index",
    });
    const principleNavigation = page.getByRole("navigation", {
      name: "Manifesto principles",
    });
    await expect(runningIndex).toBeVisible();
    await expect(principleNavigation).toHaveCount(1);
    await expect(principleNavigation.getByRole("link")).toHaveCount(12);

    const railBox = await runningIndex.boundingBox();
    const manifestoHeadingBox = await page
      .getByRole("heading", {
        level: 1,
        name: "Industrial Twin Lab Manifesto",
      })
      .boundingBox();
    expect(railBox).not.toBeNull();
    expect(manifestoHeadingBox).not.toBeNull();
    if (viewport.width > 850) {
      expect(railBox!.x + railBox!.width).toBeLessThanOrEqual(
        manifestoHeadingBox!.x,
      );
    } else {
      expect(railBox!.y + railBox!.height).toBeLessThanOrEqual(
        manifestoHeadingBox!.y,
      );
    }

    await page.goto("/experiment-fabric/demo/");
    await expect(
      page
        .getByText("Conceptual demonstration — synthetic fixture results.")
        .first(),
    ).toBeVisible();
    for (const label of DEMO_CONTROLS) {
      await expectMinimumHeight(page.getByLabel(label), 44);
    }

    const algorithm = page.getByLabel("Algorithm");
    const initialId = await page.getByTestId("experiment-id").innerText();
    await algorithm.selectOption("physics-residual");
    await expect(page.getByTestId("experiment-id")).not.toHaveText(initialId);
    const changedId = await page.getByTestId("experiment-id").innerText();
    await expect(page.getByRole("status")).toHaveText(
      `Evidence updated: ${changedId}.`,
    );
    await page.reload();
    await algorithm.selectOption("physics-residual");
    await expect(page.getByTestId("experiment-id")).toHaveText(changedId);

    const sectionTrigger = page.getByRole("button", {
      name: "All sections 13",
    });
    await expect(sectionTrigger).toBeVisible();
    await expectMinimumHeight(sectionTrigger, 44);
    if (viewport.width === 320) {
      await page.evaluate(() => {
        document.documentElement.style.scrollbarGutter = "stable";
      });
    }
    await sectionTrigger.click();
    const allSections = page.getByRole("navigation", { name: "All sections" });
    await expect(allSections).toBeVisible();
    if (viewport.width === 320) {
      const [panelBox, documentWidth] = await Promise.all([
        allSections.boundingBox(),
        page.evaluate(() => document.documentElement.scrollWidth),
      ]);
      expect(panelBox).not.toBeNull();
      expect(panelBox!.x).toBeGreaterThanOrEqual(0);
      expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(documentWidth);
    }
    await expect(
      allSections.getByRole("link", { name: /Experiment Fabric/u }),
    ).toHaveAttribute("aria-current", "page");

    await page.goto("/architecture/");
    await expect(
      page.getByLabel("Demonstration asset disclosure"),
    ).toContainText("Fictional demonstration asset");
    const safetyFigure = page.getByRole("figure", {
      name: "Industrial Twin Lab safety boundary",
    });
    const zoneHeadings = safetyFigure.locator(".safety-boundary__zone h3");
    await expect(zoneHeadings).toHaveText([...SAFETY_ZONE_LABELS]);
    const geometry = await safetyFigure
      .locator(".safety-boundary__zone section")
      .evaluateAll((sections) =>
        sections.map((section) => {
          const box = section.getBoundingClientRect();
          const heading = section.querySelector("h3");
          return {
            width: box.width,
            height: box.height,
            headingWidth: heading?.getBoundingClientRect().width ?? 0,
            headingHeight: heading?.getBoundingClientRect().height ?? 0,
            headingScrollWidth: heading?.scrollWidth ?? 0,
            headingClientWidth: heading?.clientWidth ?? 0,
            headingScrollHeight: heading?.scrollHeight ?? 0,
            headingClientHeight: heading?.clientHeight ?? 0,
          };
        }),
      );
    expect(geometry).toHaveLength(SAFETY_ZONE_LABELS.length);
    for (const zone of geometry) {
      expect(zone.width).toBeGreaterThan(0);
      expect(zone.height).toBeGreaterThan(0);
      expect(zone.headingWidth).toBeGreaterThan(0);
      expect(zone.headingHeight).toBeGreaterThan(0);
      expect(zone.headingScrollWidth).toBeLessThanOrEqual(
        zone.headingClientWidth + 1,
      );
      expect(zone.headingScrollHeight).toBeLessThanOrEqual(
        zone.headingClientHeight + 1,
      );
    }
    await expectNoDocumentOverflow(page);
  });
}

test("mobile all-sections supports complete content, close, Escape focus return, navigation, and reachable main", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "All sections 13" });
  const navigation = page.getByRole("navigation", { name: "All sections" });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("link")).toHaveCount(13);

  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
  await expect(page.locator("main")).toBeVisible();
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await page.locator("main").focus();
  await expect(page.locator("main")).toBeFocused();

  await trigger.click();
  await navigation.getByRole("link", { name: /Architecture/u }).click();
  await expect(page).toHaveURL(/\/architecture\/?$/u);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Industrial AI Safety Architecture",
  );
  await expect(
    page.getByRole("button", { name: "All sections 13" }),
  ).toHaveAttribute("aria-expanded", "false");
});

test("all-sections uses segment-boundary matching without sibling or prefix false positives", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto("/experiment-fabric/demo/");
  await page.getByRole("button", { name: "All sections 13" }).click();
  await expect(
    page
      .getByRole("navigation", { name: "All sections" })
      .getByRole("link", { name: /Experiment Fabric/u }),
  ).toHaveAttribute("aria-current", "page");

  await page.goto("/experiment-fabrication/");
  await page.getByRole("button", { name: "All sections 13" }).click();
  await expect(
    page
      .getByRole("navigation", { name: "All sections" })
      .getByRole("link", { name: /Experiment Fabric/u }),
  ).not.toHaveAttribute("aria-current", "page");
  await expect(
    page
      .getByRole("navigation", { name: "All sections" })
      .locator('[aria-current="page"]'),
  ).toHaveCount(0);
});

test("the demo has 44px controls, named internal scrolling, and deterministic mobile interaction", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/experiment-fabric/demo/");

  for (const label of [
    "Machine",
    "Problem",
    "Feature set",
    "Algorithm",
    "Validation",
  ]) {
    await expectMinimumHeight(page.getByLabel(label), 44);
  }

  const algorithm = page.getByLabel("Algorithm");
  const initialId = await page.getByTestId("experiment-id").innerText();
  await algorithm.focus();
  await algorithm.selectOption("physics-residual");
  await expect(page.getByTestId("experiment-id")).not.toHaveText(initialId);
  const changedId = await page.getByTestId("experiment-id").innerText();
  await expect(page.getByRole("status")).toHaveText(
    `Evidence updated: ${changedId}.`,
  );
  await expect(algorithm).toBeFocused();

  await page.reload();
  await algorithm.selectOption("physics-residual");
  await expect(page.getByTestId("experiment-id")).toHaveText(changedId);
  await expectNoDocumentOverflow(page);
  await expect(
    page
      .getByText("Conceptual demonstration — synthetic fixture results.")
      .first(),
  ).toBeVisible();
});
