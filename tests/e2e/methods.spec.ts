import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { P101_TWIN } from "../../lib/data/p101";

const METHOD_FAMILIES = [
  ["Statistical", "PCA, SPC, Regression"],
  [
    "Classical ML",
    "Random Forest, XGBoost, LightGBM, Isolation Forest, One-Class SVM",
  ],
  ["Deep Learning", "Autoencoder, LSTM, TCN, Transformer"],
  ["Physics Hybrid", "Residual Model, Gray-box Model, Physics-Informed Model"],
  ["Optimization", "Bayesian Optimization, MPC, Reinforcement Learning"],
] as const;

const SENSOR_AND_COMMUNICATION_FAULTS = [
  "bias",
  "drift",
  "dropout",
  "communication loss",
] as const;

test("Feature Factory preserves canonical feature lineage and the residual boundary", async ({
  page,
}) => {
  await page.goto("/feature-factory/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Feature Factory" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByText(/P-101 is a fictional, synthetic teaching fixture/u).first(),
  ).toBeVisible();

  const transformations = page.getByRole("figure", {
    name: "P-101 feature transformation sequence",
  });
  await expect(transformations.getByRole("listitem")).toHaveCount(3);
  const lineageHeadings = page.locator(
    ".feature-factory-publication > section:not(.concept-publication__direction) > h3",
  );
  await expect(lineageHeadings).toHaveCount(P101_TWIN.features.length);
  await expect(lineageHeadings).toHaveText(
    P101_TWIN.features.map((feature) => feature.name),
  );
  for (const feature of P101_TWIN.features) {
    await expect(
      page.getByText(feature.name, { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByText(feature.description, { exact: true }),
    ).toBeVisible();
  }

  const equation = page.getByRole("figure", {
    name: "Residual Intelligence equation",
  });
  await expect(equation).toContainText(
    "Residual = Physical Measurement − Digital Twin Prediction",
  );
  await expect(
    equation.getByText(
      "Residual = Physical Measurement − Digital Twin Prediction",
      { exact: true },
    ),
  ).toBeVisible();

  for (const boundary of [
    "feature provenance",
    "operating regime",
    "leakage",
    "engineering validation",
    "does not establish causality",
  ]) {
    await expect(
      page.getByText(boundary, { exact: false }).first(),
    ).toBeVisible();
  }

  await expect(
    page.getByRole("main").getByRole("link", { name: "Algorithm Arena" }),
  ).toHaveAttribute("href", "/algorithm-arena");
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("Algorithm Arena compares every family through evidence, not a leaderboard", async ({
  page,
}) => {
  await page.goto("/algorithm-arena/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Algorithm Arena" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByText(/P-101 is a fictional, synthetic teaching fixture/u).first(),
  ).toBeVisible();

  const methods = page.getByRole("table", {
    name: "Problem-dependent method family comparison",
  });
  await expect(methods.locator("tbody tr")).toHaveCount(METHOD_FAMILIES.length);
  for (const [family, candidates] of METHOD_FAMILIES) {
    await expect(
      methods.getByRole("row", { name: new RegExp(family, "u") }),
    ).toContainText(candidates);
  }

  for (const dependency of [
    "asset",
    "operating regime",
    "failure mode",
    "data",
    "constraints",
    "evaluation design",
  ]) {
    await expect(
      page.getByText(dependency, { exact: false }).first(),
    ).toBeVisible();
  }
  await expect(
    page.getByRole("figure", { name: "P-101 selection evidence criteria" }),
  ).toBeVisible();
  await expect(
    page.getByText(/A human engineer selects and validates/u),
  ).toBeVisible();
  await expect(
    page.getByText(/not a winner or leaderboard rank/u),
  ).toBeVisible();

  await expect(
    page.getByRole("main").getByRole("link", { name: "Feature Factory" }),
  ).toHaveAttribute("href", "/feature-factory");
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("Fault Lab limits scenarios to canonical failures and qualifies model evidence", async ({
  page,
}) => {
  await page.goto("/fault-lab/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Synthetic Fault Laboratory",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByText(/P-101 is a fictional, synthetic teaching fixture/u).first(),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Synthetic data is evidence from a model, not evidence from reality.",
      { exact: true },
    ),
  ).toBeVisible();

  const scenarioCatalogue = page.getByRole("figure", {
    name: "P-101 synthetic fault scenario catalogue",
  });
  const machineFailures = scenarioCatalogue.getByRole("list", {
    name: "Canonical P-101 failure modes",
  });
  await expect(machineFailures.getByRole("listitem")).toHaveCount(
    P101_TWIN.failureModes.length,
  );
  for (const failure of P101_TWIN.failureModes) {
    await expect(
      machineFailures.getByText(failure.name, { exact: true }).last(),
    ).toBeVisible();
  }
  const signalFailures = scenarioCatalogue.getByRole("list", {
    name: "Sensor and communication faults",
  });
  await expect(signalFailures.getByRole("listitem")).toHaveCount(
    SENSOR_AND_COMMUNICATION_FAULTS.length,
  );
  await expect(signalFailures.getByRole("listitem")).toHaveText([
    ...SENSOR_AND_COMMUNICATION_FAULTS,
  ]);

  for (const qualification of [
    "Simulation validity",
    "domain gap",
    "injection assumptions",
    "provenance",
    "limitations",
    "physical evidence",
  ]) {
    await expect(
      page.getByText(qualification, { exact: false }).first(),
    ).toBeVisible();
  }
  await expect(page.getByText(/not field incidents/u).first()).toBeVisible();
  await expect(
    page.getByRole("figure", { name: "Synthetic fault evidence path" }),
  ).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

for (const [route, title] of [
  ["/feature-factory/", "Feature Factory"],
  ["/algorithm-arena/", "Algorithm Arena"],
  ["/fault-lab/", "Synthetic Fault Laboratory"],
] as const) {
  test(`${route} contains wide evidence inside named regions without 390px document overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

    const overflowRegions = page.locator(
      '[role="region"][aria-label*="scroll horizontally"]',
    );
    for (let index = 0; index < (await overflowRegions.count()); index += 1) {
      await expect(overflowRegions.nth(index)).toHaveAttribute("tabindex", "0");
    }
  });
}
