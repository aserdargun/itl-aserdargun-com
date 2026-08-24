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

const VIEWPORTS = [
  { width: 1440, height: 1000 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
] as const;

const expectNoDocumentOverflow = async (page: Page) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
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
