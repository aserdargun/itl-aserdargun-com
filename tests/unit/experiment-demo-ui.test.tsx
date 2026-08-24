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

afterEach(cleanup);

const DEFAULT_METRICS = [
  ["Detection Rate", "86 %"],
  ["False Alarms", "0.9 alerts/month"],
  ["Lead Time", "5 days"],
  ["Inference Cost", "18 ms"],
  ["Sensor Count", "11 sensors"],
  ["Robustness", "80 /100"],
  ["Explainability", "78 /100"],
] as const;

describe("ExperimentDemo", () => {
  it("starts from canonical options and publishes all seven literal fixture metrics", () => {
    render(<ExperimentDemo />);

    expect(screen.getByLabelText("Machine")).toHaveValue("P-101");
    expect(screen.getByLabelText("Problem")).toHaveValue("bearing-degradation");
    expect(screen.getByLabelText("Feature set")).toHaveValue("combined");
    expect(screen.getByLabelText("Algorithm")).toHaveValue("xgboost");
    expect(screen.getByLabelText("Validation")).toHaveValue("walk-forward");

    expect(
      within(screen.getByLabelText("Machine")).getAllByRole("option"),
    ).toHaveLength(1);
    expect(
      within(screen.getByLabelText("Problem")).getAllByRole("option"),
    ).toHaveLength(1);
    expect(
      within(screen.getByLabelText("Feature set")).getAllByRole("option"),
    ).toHaveLength(4);
    expect(
      within(screen.getByLabelText("Algorithm")).getAllByRole("option"),
    ).toHaveLength(4);
    expect(
      within(screen.getByLabelText("Validation")).getAllByRole("option"),
    ).toHaveLength(3);

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
