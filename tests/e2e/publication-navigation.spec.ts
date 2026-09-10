import { expect, test } from "@playwright/test";

test("the landscape section menu scrolls within the viewport and reaches the last publication", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  await page.getByRole("button", { name: "All sections 13" }).click();
  const navigation = page.getByRole("navigation", { name: "All sections" });
  const box = await navigation.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThanOrEqual(390);
  expect(
    await navigation.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);
  const about = navigation.getByRole("link", { name: /About/ });
  await about.scrollIntoViewIfNeeded();
  await expect(about).toBeInViewport();
  await about.click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "About Industrial Twin Lab",
  );
});

test("leaving the menu by keyboard or pointer dismisses it without redirecting focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "All sections 13" });
  const navigation = page.getByRole("navigation", { name: "All sections" });
  await trigger.click();
  await page.keyboard.press("Tab");
  await expect(navigation.getByRole("link").first()).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await navigation.getByRole("link").last().focus();
  await page.keyboard.press("Tab");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).not.toBeFocused();
  await trigger.click();
  await page.getByRole("heading", { level: 1 }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).not.toBeFocused();
});

test("every publication's external link announces its new browsing context", async ({
  page,
}) => {
  const routes = [
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
  ];
  for (const route of routes) {
    await page.goto(route);
    const links = page.locator('a[target="_blank"]');
    for (const link of await links.all()) {
      await expect(
        link,
        `${route}: ${await link.getAttribute("href")}`,
      ).toHaveAccessibleName(/opens in a new tab/);
    }
  }
});
