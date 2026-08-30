import { expect, test, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const EXPECTED_METRICS = [
  ["Detection Rate", "86 %"],
  ["False Alarms", "0.9 alerts/month"],
  ["Lead Time", "5 days"],
  ["Inference Cost", "18 ms"],
  ["Sensor Count", "11 sensors"],
  ["Robustness", "80 /100"],
  ["Explainability", "78 /100"],
] as const;

const DEFAULT_EXPERIMENT_RECORD = [
  ["Model", "MODEL-XGB-0.1.0"],
  ["Model status", "experimental"],
  ["Dataset", "DATASET-P101-SYN-0.1.0"],
  ["Feature set", "combined"],
  ["Validation", "walk-forward"],
  ["Twin version", "TWIN-P101-0.1.0"],
  ["Asset version", "ASSET-P101-0.1.0"],
  ["Dataset version", "DATASET-P101-SYN-0.1.0"],
  ["Simulator version", "SIM-P101-0.1.0"],
  ["Feature pipeline", "FEATURES-P101-0.1.0"],
  ["Provenance model", "MODEL-XGB-0.1.0"],
  ["Code version", "ITL-PHASE-1-0.1.0"],
  ["Configured asset", "P-101"],
  ["Problem", "bearing-degradation"],
  ["Configured feature set", "combined"],
  ["Algorithm", "xgboost"],
  ["Configured validation", "walk-forward"],
  ["Random seed", "101"],
  ["Timestamp label", "Synthetic fixture"],
] as const;

const DEFAULT_PROVENANCE_QUALIFICATION = [
  [
    "Uncertainty",
    "Illustrative uncertainty only; no confidence value is derived from an operating machine.",
  ],
  ["Explainability", "XGBoost compared under Walk Forward."],
  ["Dataset source", "Industrial Twin Lab synthetic experiment fixture"],
  [
    "Dataset disclosure",
    "This dataset is a deterministic synthetic fixture for conceptual comparison only; it is not plant data.",
  ],
  [
    "Experiment source",
    "Industrial Twin Lab deterministic experiment fixture lookup",
  ],
  [
    "Experiment disclosure",
    "Conceptual demonstration — synthetic fixture results. No model is trained or executed and no real plant data is used.",
  ],
  ["Author agent", "Industrial Twin Lab synthetic fixture agent"],
] as const;

const expectExactLedger = async (
  ledger: Locator,
  expectedRows: readonly (readonly [string, string])[],
) => {
  const rows = ledger.locator(":scope > div");
  await expect(rows).toHaveCount(expectedRows.length);

  for (const [index, [label, value]] of expectedRows.entries()) {
    const row = rows.nth(index);
    await expect(row.locator(":scope > dt")).toHaveCount(1);
    await expect(row.locator(":scope > dd")).toHaveCount(1);
    await expect(row.locator(":scope > dt")).toHaveText(label);
    await expect(row.locator(":scope > dd")).toHaveText(value);
  }
};

test("Experiment Fabric publishes the complete P-101 evidence contract", async ({
  page,
}) => {
  await page.goto("/experiment-fabric/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Experiment Fabric",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("figure", { name: "Complete experiment anatomy" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("figure", { name: "Complete experiment anatomy" })
      .getByRole("listitem"),
  ).toHaveCount(12);
  await expect(
    page.getByText(
      /best solution for a particular machine, operating regime, failure mode, and operational constraint/u,
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("figure", {
      name: "P-101 bearing-degradation Evidence Package",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open the conceptual demonstrator" }),
  ).toHaveAttribute("href", "/experiment-fabric/demo");
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("the conceptual experiment recomputes a complete synthetic evidence ledger", async ({
  page,
}) => {
  await page.goto("/experiment-fabric/demo/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Experiment Fabric",
  );
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page
      .getByText("Conceptual demonstration — synthetic fixture results.")
      .first(),
  ).toBeVisible();
  await expect(
    page.getByText("Synthetic fixture", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "P-101 decision replay" }),
  ).toBeVisible();
  await expectExactLedger(page.locator(".experiment-result__audit-rail"), [
    ["Context snapshot", "P-101 + operating envelope"],
    ["Constraint check", "No control path"],
    ["Evidence", "Deterministic fixture"],
    ["Authority", "Human review required"],
  ]);

  const controls = [
    ["Machine", "P-101"],
    ["Problem", "bearing-degradation"],
    ["Feature set", "combined"],
    ["Algorithm", "xgboost"],
    ["Validation", "walk-forward"],
  ] as const;
  for (const [label, value] of controls) {
    await expect(page.getByLabel(label)).toHaveValue(value);
  }

  const metricTable = page.getByRole("table", {
    name: "Synthetic fixture metrics",
  });
  for (const [label, value] of EXPECTED_METRICS) {
    await expect(
      metricTable.getByRole("row", { name: `${label} ${value}` }),
    ).toBeVisible();
  }

  const evidenceFigure = page.getByRole("figure", {
    name: "Complete experiment evidence",
  });
  await expectExactLedger(
    evidenceFigure
      .getByRole("region", { name: "Experiment record" })
      .locator("dl.technical-ledger"),
    DEFAULT_EXPERIMENT_RECORD,
  );
  await expectExactLedger(
    evidenceFigure
      .getByRole("region", {
        name: "Uncertainty, explainability, and provenance",
      })
      .locator("dl.technical-ledger"),
    DEFAULT_PROVENANCE_QUALIFICATION,
  );

  const initialId = await page.getByTestId("experiment-id").textContent();
  await page.getByLabel("Algorithm").selectOption("physics-residual");
  await expect(page.getByTestId("experiment-id")).not.toHaveText(
    initialId ?? "",
  );
  await expect(page.getByRole("status")).toContainText("Evidence updated:");
  await expect(page.getByText("MODEL-PR-0.1.0").first()).toBeVisible();

  await page.getByLabel("Feature set").focus();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Algorithm")).toBeFocused();

  await page.getByLabel("Validation").selectOption("leave-one-regime-out");
  await expect(page.getByTestId("experiment-id")).toContainText(
    "LEAVEONEREGIMEOUT",
  );
  await expect(
    page
      .getByRole("region", { name: "Experiment evidence ledger" })
      .getByText("Leave-One-Regime-Out", { exact: true }),
  ).toBeVisible();

  for (const text of [
    "ASSET-P101-0.1.0",
    "TWIN-P101-0.1.0",
    "DATASET-P101-SYN-0.1.0",
    "SIM-P101-0.1.0",
    "FEATURES-P101-0.1.0",
    "ITL-PHASE-1-0.1.0",
    "Industrial Twin Lab synthetic fixture agent",
    "Industrial Twin Lab deterministic experiment fixture lookup",
    "Human engineer retains decision authority.",
  ]) {
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
  }
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("invalid programmatic input fails closed and the mobile document does not overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/experiment-fabric/demo/");

  await page.getByLabel("Algorithm").evaluate((select) => {
    const option = document.createElement("option");
    option.value = "invalid-fixture";
    option.textContent = "Invalid fixture";
    select.append(option);
    (select as HTMLSelectElement).value = "invalid-fixture";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await expect(page.getByLabel("Algorithm")).toHaveValue("xgboost");
  await expect(page.getByRole("status")).toHaveText(
    "Invalid Algorithm selection restored to XGBoost.",
  );
  await expect(page.getByTestId("experiment-id")).toHaveText(
    "EXP-P101-BD-COMBINED-XGBOOST-WALKFORWARD",
  );

  const controls = page.getByRole("region", {
    name: "Experiment configuration",
  });
  const evidence = page.getByRole("region", {
    name: "Experiment evidence ledger",
  });
  const evidenceElement = await evidence.elementHandle();
  expect(evidenceElement).not.toBeNull();
  expect(
    await controls.evaluate(
      (node, following) =>
        Boolean(
          node.compareDocumentPosition(following as Node) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      evidenceElement,
    ),
  ).toBeTruthy();
  await expect(
    page.getByRole("region", {
      name: /Synthetic fixture metrics, scroll horizontally/,
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  for (const label of [
    "Machine",
    "Problem",
    "Feature set",
    "Algorithm",
    "Validation",
  ]) {
    const box = await page.getByLabel(label).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});
