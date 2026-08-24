import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator } from "@playwright/test";

const AI_HYPOTHESES = [
  "Hypothesis 01 — Impeller degradation",
  "Hypothesis 02 — Suction restriction",
  "Hypothesis 03 — Sensor calibration drift",
  "Hypothesis 04 — Increasing mechanical losses",
] as const;

const EXPERIMENT_FLOW = [
  "Observe",
  "Retrieve Knowledge",
  "Generate Hypotheses",
  "Design Experiments",
  "Run Twin Experiments",
  "Compare Evidence",
  "Explain Findings",
  "Recommend Next Action",
] as const;

const FLEET_HIERARCHY = [
  "Component",
  "Machine",
  "System",
  "Plant",
  "Fleet",
  "Enterprise",
] as const;

const KNOWLEDGE_FLYWHEEL = [
  "Machine Data",
  "Twin",
  "Experiment",
  "Evidence",
  "Knowledge",
  "Fleet Learning",
  "Better Experiments",
  "Better Machine Knowledge",
] as const;

const expectDomOrder = async (locators: readonly Locator[]) => {
  for (let index = 0; index < locators.length - 1; index += 1) {
    const following = await locators[index + 1].elementHandle();
    expect(following).not.toBeNull();
    expect(
      await locators[index].evaluate(
        (element, next) =>
          Boolean(
            element.compareDocumentPosition(next as Node) &
            Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        following,
      ),
    ).toBe(true);
  }
};

test("AI Scientist publishes the bounded P-101 hypothesis investigation", async ({
  page,
}) => {
  await page.goto("/ai-scientist/");

  await expect(
    page.getByRole("heading", { level: 1, name: "AI Scientist" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByText(/P-101 is a fictional, synthetic teaching fixture/u).first(),
  ).toBeVisible();

  const catalogue = page.getByRole("list", {
    name: "Canonical P-101 hypotheses",
  });
  await expect(catalogue.getByRole("listitem")).toHaveCount(4);
  await expect(catalogue.getByRole("listitem")).toHaveText(AI_HYPOTHESES);

  const experimentFlow = page.getByRole("figure", {
    name: "P-101 hypothesis-to-evidence experiment flow",
  });
  const flowSteps = experimentFlow.getByRole("listitem");
  await expect(flowSteps).toHaveCount(EXPERIMENT_FLOW.length);
  await expect(flowSteps).toContainText(EXPERIMENT_FLOW);
  await expectDomOrder(
    EXPERIMENT_FLOW.map((step) => flowSteps.getByText(step)),
  );

  await expect(
    page.getByText("The LLM does not replace engineering computation.", {
      exact: true,
    }),
  ).toBeVisible();
  for (const boundary of [
    "outside the control loop",
    "cannot alter machinery",
    "cannot validate its own result",
    "does not replace simulation, physics, statistics, or engineering review",
    "provenance",
    "limitations",
    "uncertainty",
    "reproducibility",
    "safety boundary",
    "human decision authority",
  ]) {
    await expect(
      page.getByText(boundary, { exact: false }).first(),
    ).toBeVisible();
  }
});

test("AI Scientist exposes only supplied confidence evidence with a named table", async ({
  page,
}) => {
  await page.goto("/ai-scientist/");

  const matrix = page.getByRole("table", {
    name: "P-101 hypothesis evidence matrix",
  });
  await expect(matrix).toBeVisible();
  await expect(matrix.getByRole("columnheader")).toHaveText([
    "Hypothesis",
    "Physics",
    "Historical",
    "ML",
    "Similar assets",
    "Confidence",
  ]);

  const rows = matrix.locator("tbody tr");
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).locator("th, td")).toHaveText([
    "Impeller degradation",
    "Strong",
    "Strong",
    "Strong",
    "Medium",
    "0.82 — evaluated fixture",
  ]);
  await expect(rows.nth(1).locator("th, td")).toHaveText([
    "Suction restriction",
    "Medium",
    "Weak",
    "Medium",
    "Weak",
    "0.31 — evaluated fixture",
  ]);
  await expect(rows.nth(2).locator("th, td")).toHaveText([
    "Sensor drift",
    "Weak",
    "Medium",
    "Weak",
    "Weak",
    "0.19 — evaluated fixture",
  ]);

  await expect(
    page.locator("p").filter({
      hasText:
        "Sensor drift is the supplied evidence-row wording for Hypothesis 03 — Sensor calibration drift.",
    }),
  ).toHaveText(
    "The source matrix uses Sensor drift as the evidence-row label. Sensor drift is the supplied evidence-row wording for Hypothesis 03 — Sensor calibration drift.",
  );
  await expect(
    page.getByText(
      "Hypothesis 04 — Increasing mechanical losses: unevaluated — no evidence row or confidence was supplied.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText("Conceptual demonstration — synthetic fixture results.", {
      exact: true,
    }),
  ).toBeVisible();

  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("Fleet Intelligence makes cross-asset generalization conditional", async ({
  page,
}) => {
  await page.goto("/fleet-intelligence/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Fleet Intelligence" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  const hierarchy = page.getByRole("figure", {
    name: "Fleet intelligence asset hierarchy",
  });
  const hierarchySteps = hierarchy.getByRole("listitem");
  await expect(hierarchySteps).toHaveCount(FLEET_HIERARCHY.length);
  await expect(hierarchySteps).toContainText(FLEET_HIERARCHY);
  await expectDomOrder(
    FLEET_HIERARCHY.map((level) => hierarchySteps.getByText(level)),
  );

  const protocol = page.getByRole("figure", {
    name: "Conceptual leave-one-asset-out protocol",
  });
  await expect(protocol).toContainText("Train");
  await expect(protocol).toContainText("Pump P01–P49");
  await expect(protocol).toContainText("Test");
  await expect(protocol).toContainText("Pump P50");
  await expect(protocol).toContainText(
    "Conceptual and synthetic research protocol — not a field result",
  );

  await expect(
    page.getByText(
      "Did the AI learn pump degradation, or did it memorize individual machines?",
      { exact: true },
    ),
  ).toBeVisible();
  for (const concept of [
    "portability",
    "population evidence",
    "local evidence",
    "operating regime",
    "configuration differences",
    "negative transfer risk",
    "leave-one-asset-out validation",
    "does not automatically generalize",
  ]) {
    await expect(
      page.getByText(concept, { exact: false }).first(),
    ).toBeVisible();
  }

  const flywheel = page.getByRole("figure", {
    name: "Knowledge Flywheel",
  });
  const flywheelSteps = flywheel.getByRole("listitem");
  await expect(flywheelSteps).toHaveCount(KNOWLEDGE_FLYWHEEL.length);
  await expect(flywheelSteps).toContainText(KNOWLEDGE_FLYWHEEL);
  await expectDomOrder(
    KNOWLEDGE_FLYWHEEL.map((step) =>
      flywheelSteps.getByText(step, { exact: true }),
    ),
  );
  await expect(
    page.getByText("Conceptual demonstration — synthetic fixture results.", {
      exact: true,
    }),
  ).toBeVisible();

  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

for (const path of ["/ai-scientist/", "/fleet-intelligence/"] as const) {
  test(`${path} contains narrow technical regions without document overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path);

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: path === "/ai-scientist/" ? "AI Scientist" : "Fleet Intelligence",
      }),
    ).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);

    if (path === "/ai-scientist/") {
      const tableRegion = page.getByRole("region", {
        name: "P-101 hypothesis evidence matrix, scroll horizontally to inspect all columns",
      });
      await expect(tableRegion).toBeVisible();
      expect(
        await tableRegion.evaluate(
          (element) => element.scrollWidth > element.clientWidth,
        ),
      ).toBe(true);
    }
  });
}
