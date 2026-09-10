import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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

for (const route of PUBLIC_ROUTES) {
  test(`${route} has no axe violations or browser runtime errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(route);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("every public route has unique IDs, one H1, and named form controls", async ({
  page,
}) => {
  for (const route of PUBLIC_ROUTES) {
    await page.goto(route);
    await expect(page.locator("main h1")).toHaveCount(1);

    const audit = await page.evaluate(() => {
      const ids = [...document.querySelectorAll<HTMLElement>("[id]")].map(
        (element) => element.id,
      );
      const duplicateIds = [
        ...new Set(ids.filter((id, index) => ids.indexOf(id) !== index)),
      ];
      const unnamedControls = [
        ...document.querySelectorAll<HTMLElement>(
          "button, input, select, textarea",
        ),
      ]
        .filter((control) => {
          const id = control.id;
          const label = id
            ? document.querySelector(`label[for="${CSS.escape(id)}"]`)
            : null;
          return !(
            control.getAttribute("aria-label")?.trim() ||
            control.getAttribute("aria-labelledby")?.trim() ||
            label?.textContent?.trim() ||
            control.textContent?.trim() ||
            control.getAttribute("title")?.trim()
          );
        })
        .map((control) => control.outerHTML);
      return { duplicateIds, unnamedControls };
    });

    expect(audit.duplicateIds, route).toEqual([]);
    expect(audit.unnamedControls, route).toEqual([]);
  }
});

test("active navigation, focus rings, safety state, and the demo live region do not rely on color alone", async ({
  page,
}) => {
  await page.goto("/architecture/");
  await expect(
    page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Architecture" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByText("Human validation gate", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/^Human in command\./u)).toBeVisible();

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  expect(
    await skipLink.evaluate(
      (element) => getComputedStyle(element).outlineStyle,
    ),
  ).not.toBe("none");

  await page.goto("/experiment-fabric/demo/");
  const liveRegion = page.getByRole("status");
  await expect(liveRegion).toHaveAttribute("aria-live", "polite");
  await expect(liveRegion).toHaveAttribute("aria-atomic", "true");
  const validation = page.getByLabel("Validation");
  await validation.focus();
  await validation.selectOption("leave-one-regime-out");
  await expect(liveRegion).toContainText(/^Evidence updated:/u);
  await expect(validation).toBeFocused();
  await expect(
    page.getByText("Human review required", { exact: true }),
  ).toBeVisible();
});
