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

const EXPECTED_FEATURE_LINEAGE = [
  {
    id: "pressure-ratio",
    name: "Pressure Ratio",
    description: "Discharge pressure relative to suction pressure.",
    featureGroup: "process",
    sourceSignals: "suction-pressure, discharge-pressure",
    unit: "dimensionless ratio",
    transformation: "discharge pressure ÷ suction pressure",
    window: "Aligned sample; no rolling window.",
  },
  {
    id: "flow-per-speed",
    name: "Flow / Speed",
    description: "Flow normalized by rotational speed.",
    featureGroup: "process",
    sourceSignals: "flow, speed",
    unit: "m³/h per rpm",
    transformation: "flow ÷ speed",
    window: "Aligned sample; no rolling window.",
  },
  {
    id: "power-per-flow",
    name: "Power / Flow",
    description: "Electrical power normalized by flow.",
    featureGroup: "process",
    sourceSignals: "motor-power, flow",
    unit: "kW per (m³/h)",
    transformation: "motor power ÷ flow",
    window: "Aligned sample; no rolling window.",
  },
  {
    id: "bearing-de-delta-ambient",
    name: "DE temperature delta ambient",
    description: "Drive-end bearing temperature above ambient.",
    featureGroup: "physics",
    sourceSignals: "bearing-de-temperature, ambient-temperature",
    unit: "°C",
    transformation: "bearing DE temperature − ambient temperature",
    window: "Aligned sample; no rolling window.",
  },
  {
    id: "bearing-nde-delta-ambient",
    name: "NDE temperature delta ambient",
    description: "Non-drive-end bearing temperature above ambient.",
    featureGroup: "physics",
    sourceSignals: "bearing-nde-temperature, ambient-temperature",
    unit: "°C",
    transformation: "bearing NDE temperature − ambient temperature",
    window: "Aligned sample; no rolling window.",
  },
  {
    id: "vibration-rms",
    name: "Vibration RMS",
    description: "RMS vibration from bearing-housing measurements.",
    featureGroup: "vibration",
    sourceSignals: "axial-vibration, radial-vibration",
    unit: "mm/s RMS",
    transformation: "root mean square of axial and radial vibration samples",
    window:
      "Declared vibration analysis window; duration not specified in Phase 1.",
  },
  {
    id: "vibration-kurtosis",
    name: "Vibration Kurtosis",
    description: "Distribution-tail indicator for vibration change.",
    featureGroup: "vibration",
    sourceSignals: "axial-vibration, radial-vibration",
    unit: "dimensionless",
    transformation: "kurtosis of axial and radial vibration samples",
    window:
      "Declared vibration analysis window; duration not specified in Phase 1.",
  },
  {
    id: "twin-residual",
    name: "Twin Residual",
    description: "Measured value minus digital-twin prediction.",
    featureGroup: "physics",
    sourceSignals: "motor-power, flow, speed",
    unit: "kW",
    transformation:
      "motor power − digital-twin motor-power prediction conditioned on flow and speed",
    window: "Aligned sample; no rolling window.",
  },
  {
    id: "rolling-mean-30m",
    name: "Rolling Mean 30m",
    description: "Thirty-minute rolling temperature mean.",
    featureGroup: "temporal",
    sourceSignals: "bearing-de-temperature",
    unit: "°C",
    transformation:
      "mean of bearing DE temperature over the trailing 30 minutes",
    window: "Trailing 30 minutes.",
  },
] as const;

const FEATURE_APPLICABLE_REGIME =
  "Within the declared fictional P-101 operating envelope only.";
const FEATURE_PROVENANCE =
  "Industrial Twin Lab fictional engineering fixture; no plant-derived feature values.";
const FEATURE_LEAKAGE_ASSESSMENT =
  "Past or contemporaneous source values only; future values, maintenance labels, and held-out outcomes are prohibited.";
const FEATURE_VALIDATION_STATUS = "Not validated in Phase 1";

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
  await expect(lineageHeadings).toHaveCount(EXPECTED_FEATURE_LINEAGE.length);
  await expect(lineageHeadings).toHaveText(
    EXPECTED_FEATURE_LINEAGE.map((feature) => feature.name),
  );
  for (const feature of EXPECTED_FEATURE_LINEAGE) {
    const record = page.locator(`section#${feature.id}`);
    await expect(record.getByRole("heading", { level: 3 })).toHaveText(
      feature.name,
    );
    await expect(
      record.getByText(feature.description, { exact: true }),
    ).toBeVisible();

    const expectedRows = [
      ["Feature ID", feature.id],
      ["Feature group", feature.featureGroup],
      ["Source signals", feature.sourceSignals],
      ["Unit", feature.unit],
      ["Formula / transformation", feature.transformation],
      ["Window", feature.window],
      ["Applicable regime", FEATURE_APPLICABLE_REGIME],
      ["Provenance", FEATURE_PROVENANCE],
      ["Leakage assessment", FEATURE_LEAKAGE_ASSESSMENT],
      ["Validation status", FEATURE_VALIDATION_STATUS],
    ] as const;
    const rows = record.locator("dl.feature-lineage__details > div");
    await expect(rows).toHaveCount(expectedRows.length);
    for (const [index, [label, value]] of expectedRows.entries()) {
      const row = rows.nth(index);
      await expect(row.locator(":scope > dt")).toHaveText(label);
      await expect(row.locator(":scope > dd")).toHaveText(value);
    }
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
