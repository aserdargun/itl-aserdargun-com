import "@testing-library/jest-dom/vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ExperimentDemo } from "@/components/experiment/experiment-demo";
import {
  DEMO_ALGORITHM_OPTIONS,
  DEMO_FEATURE_SET_OPTIONS,
  DEMO_MACHINE_OPTIONS,
  DEMO_PROBLEM_OPTIONS,
  DEMO_VALIDATION_OPTIONS,
} from "@/lib/experiments/demo";

afterEach(cleanup);

const DEFAULT_METRICS = [
  ["Detection Rate", "86 %"],
  ["False Alarms", "0.9 alerts/month"],
  ["Lead Time", "5 days"],
  ["Inference Cost", "18 ms"],
  ["Sensor Count", "11 sensors"],
  ["Robustness", "80/100"],
  ["Explainability", "78/100"],
] as const;

const EXPECTED_MACHINE_OPTIONS = [{ value: "P-101", label: "P-101" }];
const EXPECTED_PROBLEM_OPTIONS = [
  { value: "bearing-degradation", label: "Bearing degradation" },
];
const EXPECTED_FEATURE_SET_OPTIONS = [
  { value: "process", label: "Process" },
  { value: "vibration", label: "Vibration" },
  { value: "physics", label: "Physics" },
  { value: "combined", label: "Combined" },
];
const EXPECTED_ALGORITHM_OPTIONS = [
  { value: "isolation-forest", label: "Isolation Forest" },
  { value: "xgboost", label: "XGBoost" },
  { value: "autoencoder", label: "Autoencoder" },
  { value: "physics-residual", label: "Physics Residual" },
];
const EXPECTED_VALIDATION_OPTIONS = [
  { value: "time-split", label: "Time Split" },
  { value: "walk-forward", label: "Walk Forward" },
  { value: "leave-one-regime-out", label: "Leave-One-Regime-Out" },
];

const selectOptions = (label: string) =>
  within(screen.getByLabelText(label))
    .getAllByRole<HTMLOptionElement>("option")
    .map((option) => ({ value: option.value, label: option.textContent }));

describe("ExperimentDemo", () => {
  it("renders every canonical option in exact order with no extras and selects the exact defaults", () => {
    render(<ExperimentDemo />);

    const contracts = [
      ["Machine", "P-101", DEMO_MACHINE_OPTIONS, EXPECTED_MACHINE_OPTIONS],
      [
        "Problem",
        "bearing-degradation",
        DEMO_PROBLEM_OPTIONS,
        EXPECTED_PROBLEM_OPTIONS,
      ],
      [
        "Feature set",
        "combined",
        DEMO_FEATURE_SET_OPTIONS,
        EXPECTED_FEATURE_SET_OPTIONS,
      ],
      [
        "Algorithm",
        "xgboost",
        DEMO_ALGORITHM_OPTIONS,
        EXPECTED_ALGORITHM_OPTIONS,
      ],
      [
        "Validation",
        "walk-forward",
        DEMO_VALIDATION_OPTIONS,
        EXPECTED_VALIDATION_OPTIONS,
      ],
    ] as const;

    for (const [
      label,
      defaultValue,
      exportedOptions,
      expectedOptions,
    ] of contracts) {
      expect(exportedOptions).toEqual(expectedOptions);
      expect(selectOptions(label)).toEqual(expectedOptions);
      expect(screen.getByLabelText(label)).toHaveValue(defaultValue);
    }
  });

  it("publishes all seven literal fixture metrics", () => {
    render(<ExperimentDemo />);

    const table = screen.getByRole("table", {
      name: "Synthetic fixture metrics",
    });
    expect(within(table).getAllByRole("row")).toHaveLength(8);
    for (const [label, displayValue] of DEFAULT_METRICS) {
      const row = within(table).getByRole("row", {
        name: `${label} ${displayValue}`,
      });
      expect(within(row).getByRole("rowheader")).toHaveTextContent(label);
      expect(within(row).getByRole("cell")).toHaveTextContent(displayValue);
    }
  });

  it.each([
    ["Feature set", "physics"],
    ["Algorithm", "physics-residual"],
    ["Validation", "leave-one-regime-out"],
  ] as const)(
    "recomputes deterministic evidence when %s changes",
    (label, value) => {
      render(<ExperimentDemo />);
      const initialId = screen.getByTestId("experiment-id").textContent;

      fireEvent.change(screen.getByLabelText(label), { target: { value } });

      expect(screen.getByTestId("experiment-id")).not.toHaveTextContent(
        initialId ?? "",
      );
      expect(screen.getByRole("status")).toHaveTextContent(
        /^Evidence updated: EXP-P101-BD-/,
      );
      expect(screen.getByRole("status").textContent!.length).toBeLessThan(100);
    },
  );

  it.each([
    ["Machine", "P-101"],
    ["Problem", "bearing-degradation"],
    ["Feature set", "combined"],
    ["Algorithm", "xgboost"],
    ["Validation", "walk-forward"],
  ] as const)(
    "restores a programmatically invalid %s selection without throwing",
    (label, defaultValue) => {
      render(<ExperimentDemo />);
      const select = screen.getByLabelText<HTMLSelectElement>(label);
      select.add(new Option("Invalid fixture", "invalid-fixture"));

      expect(() =>
        fireEvent.change(select, { target: { value: "invalid-fixture" } }),
      ).not.toThrow();
      expect(select).toHaveValue(defaultValue);
      expect(screen.getByTestId("experiment-id")).toHaveTextContent(
        "EXP-P101-BD-COMBINED-XGBOOST-WALKFORWARD",
      );
      expect(screen.getByRole("status")).toHaveTextContent(
        new RegExp(`^Invalid ${label} selection restored to `),
      );
    },
  );

  it("shows the complete provenance, qualified evidence, and human authority", () => {
    render(<ExperimentDemo />);

    expect(
      screen.getAllByText(
        "Conceptual demonstration — synthetic fixture results.",
      ).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("Synthetic fixture", { exact: true }).length,
    ).toBeGreaterThanOrEqual(1);
    for (const value of [
      "ASSET-P101-0.1.0",
      "TWIN-P101-0.1.0",
      "DATASET-P101-SYN-0.1.0",
      "SIM-P101-0.1.0",
      "FEATURES-P101-0.1.0",
      "MODEL-XGB-0.1.0",
      "ITL-PHASE-1-0.1.0",
      "Industrial Twin Lab synthetic fixture agent",
      "Industrial Twin Lab deterministic experiment fixture lookup",
    ]) {
      expect(screen.getAllByText(value).length).toBeGreaterThanOrEqual(1);
    }
    expect(screen.getByText("Nominal flow: 220–260 m³/h")).toBeVisible();
    expect(
      screen.getByText(
        "Illustrative uncertainty only; no confidence value is derived from an operating machine.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(/Human engineer retains decision authority/u),
    ).toBeVisible();
  });
});
