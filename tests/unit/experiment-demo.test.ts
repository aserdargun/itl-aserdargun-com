import { describe, expect, it } from "vitest";
import {
  buildExperimentResult,
  DEFAULT_DEMO_CONFIG,
} from "@/lib/experiments/demo";
import type {
  AlgorithmName,
  ExperimentDemoConfig,
  FeatureSet,
  ValidationStrategy,
} from "@/lib/domain/types";

const FEATURE_SETS: readonly FeatureSet[] = [
  "process",
  "vibration",
  "physics",
  "combined",
];
const ALGORITHMS: readonly AlgorithmName[] = [
  "isolation-forest",
  "xgboost",
  "autoencoder",
  "physics-residual",
];
const VALIDATIONS: readonly ValidationStrategy[] = [
  "time-split",
  "walk-forward",
  "leave-one-regime-out",
];

describe("experiment demo", () => {
  it("returns stable synthetic evidence for the same configuration", () => {
    expect(buildExperimentResult(DEFAULT_DEMO_CONFIG)).toEqual(
      buildExperimentResult(DEFAULT_DEMO_CONFIG),
    );
    expect(
      buildExperimentResult(DEFAULT_DEMO_CONFIG).provenance.synthetic,
    ).toBe(true);
  });

  it("provides a complete evidence package for every valid selection", () => {
    for (const featureSet of FEATURE_SETS) {
      for (const algorithm of ALGORITHMS) {
        for (const validation of VALIDATIONS) {
          const result = buildExperimentResult({
            assetId: "P-101",
            problem: "bearing-degradation",
            featureSet,
            algorithm,
            validation,
          });

          expect(result.metrics.map((metric) => metric.id)).toEqual([
            "detection-rate",
            "false-alarms",
            "lead-time",
            "inference-cost",
            "sensor-count",
            "robustness",
            "explainability",
          ]);
          expect(result.evidence.operatingRegimes.length).toBeGreaterThan(0);
          expect(result.evidence.limitations.length).toBeGreaterThan(0);
          expect(result.provenance).toMatchObject({
            datasetVersion: "DATASET-P101-SYN-0.1.0",
            featurePipelineVersion: "FEATURES-P101-0.1.0",
            twinVersion: "TWIN-P101-0.1.0",
            codeVersion: "ITL-PHASE-1-0.1.0",
            randomSeed: 101,
            timestampLabel: "Synthetic fixture",
            synthetic: true,
          });
        }
      }
    }
  });

  it("falls back to the only valid default before constructing a result", () => {
    const invalidConfig = {
      assetId: "P-999",
      problem: "unknown",
      featureSet: "unobserved",
      algorithm: "unobserved",
      validation: "unobserved",
    } as unknown as ExperimentDemoConfig;

    expect(buildExperimentResult(invalidConfig)).toEqual(
      buildExperimentResult(DEFAULT_DEMO_CONFIG),
    );
  });
});
