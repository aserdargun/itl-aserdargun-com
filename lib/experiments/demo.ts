import type {
  AlgorithmName,
  Dataset,
  EvidencePackage,
  ExperimentDemoConfig,
  ExperimentProvenance,
  ExperimentResult,
  FeatureSet,
  MetricId,
  MetricResult,
  ValidationStrategy,
} from "@/lib/domain/types";
import { P101_TWIN } from "@/lib/data/p101";

const deepFreeze = <T>(value: T): T => {
  if (value !== null && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
};

export const DEMO_VERSIONS = deepFreeze({
  behaviorVersion: "BEHAVIOR-P101-0.2.0",
  experimentVersion: "EXPERIMENT-P101-0.2.0",
  worldVersion: "WORLD-P101-0.2.0",
  metricVersion: "METRICS-P101-0.1.0",
});

export const DEFAULT_DEMO_CONFIG: ExperimentDemoConfig = deepFreeze({
  assetId: "P-101",
  problem: "bearing-degradation",
  featureSet: "combined",
  algorithm: "xgboost",
  validation: "walk-forward",
});

export const DEMO_MACHINE_OPTIONS = [
  { value: "P-101", label: "P-101" },
] as const satisfies readonly {
  readonly value: ExperimentDemoConfig["assetId"];
  readonly label: string;
}[];
export const DEMO_PROBLEM_OPTIONS = [
  { value: "bearing-degradation", label: "Bearing degradation" },
] as const satisfies readonly {
  readonly value: ExperimentDemoConfig["problem"];
  readonly label: string;
}[];

export const DEMO_FEATURE_SET_OPTIONS = [
  { value: "process", label: "Process" },
  { value: "vibration", label: "Vibration" },
  { value: "physics", label: "Physics" },
  { value: "combined", label: "Combined" },
] as const satisfies readonly {
  readonly value: FeatureSet;
  readonly label: string;
}[];
export const DEMO_ALGORITHM_OPTIONS = [
  { value: "isolation-forest", label: "Isolation Forest" },
  { value: "xgboost", label: "XGBoost" },
  { value: "autoencoder", label: "Autoencoder" },
  { value: "physics-residual", label: "Physics Residual" },
] as const satisfies readonly {
  readonly value: AlgorithmName;
  readonly label: string;
}[];
export const DEMO_VALIDATION_OPTIONS = [
  { value: "time-split", label: "Time Split" },
  { value: "walk-forward", label: "Walk Forward" },
  { value: "leave-one-regime-out", label: "Leave-One-Regime-Out" },
] as const satisfies readonly {
  readonly value: ValidationStrategy;
  readonly label: string;
}[];

const FEATURE_SETS: readonly FeatureSet[] = DEMO_FEATURE_SET_OPTIONS.map(
  ({ value }) => value,
);
const ALGORITHMS: readonly AlgorithmName[] = DEMO_ALGORITHM_OPTIONS.map(
  ({ value }) => value,
);
const VALIDATIONS: readonly ValidationStrategy[] = DEMO_VALIDATION_OPTIONS.map(
  ({ value }) => value,
);

const ALGORITHM_LABELS: Readonly<Record<AlgorithmName, string>> = {
  "isolation-forest": "Isolation Forest",
  xgboost: "XGBoost",
  autoencoder: "Autoencoder",
  "physics-residual": "Physics Residual",
};
const VALIDATION_LABELS: Readonly<Record<ValidationStrategy, string>> = {
  "time-split": "Time Split",
  "walk-forward": "Walk Forward",
  "leave-one-regime-out": "Leave-One-Regime-Out",
};

const FEATURE_ADJUSTMENTS: Readonly<Record<FeatureSet, number>> = {
  process: 0,
  vibration: 4,
  physics: 6,
  combined: 9,
};
const ALGORITHM_ADJUSTMENTS: Readonly<Record<AlgorithmName, number>> = {
  "isolation-forest": 0,
  xgboost: 5,
  autoencoder: 3,
  "physics-residual": 4,
};
const VALIDATION_ADJUSTMENTS: Readonly<Record<ValidationStrategy, number>> = {
  "time-split": 2,
  "walk-forward": 0,
  "leave-one-regime-out": -3,
};

const MODEL_VERSIONS: Readonly<Record<AlgorithmName, string>> = {
  "isolation-forest": "MODEL-IF-0.1.0",
  xgboost: "MODEL-XGB-0.1.0",
  autoencoder: "MODEL-AE-0.1.0",
  "physics-residual": "MODEL-PR-0.1.0",
};

type ExperimentLookupKey =
  `${FeatureSet}:${AlgorithmName}:${ValidationStrategy}`;

const keyFor = ({
  featureSet,
  algorithm,
  validation,
}: ExperimentDemoConfig): ExperimentLookupKey =>
  `${featureSet}:${algorithm}:${validation}`;

const dataset: Dataset = {
  id: "DATASET-P101-SYN",
  version: "DATASET-P101-SYN-0.2.0",
  assetId: "P-101",
  description: "Synthetic P-101 bearing-degradation fixture dataset.",
  provenance: {
    assetVersion: P101_TWIN.provenance.assetVersion,
    twinVersion: P101_TWIN.version,
    datasetVersion: "DATASET-P101-SYN-0.2.0",
    source: "Industrial Twin Lab synthetic experiment fixture",
    statement:
      "This dataset is a deterministic synthetic fixture for conceptual comparison only; it is not plant data.",
    synthetic: true,
  },
};

const metric = (
  id: MetricId,
  label: string,
  value: number,
  unit: string,
  precision = 0,
): MetricResult => ({
  id,
  label,
  value,
  unit,
  displayValue: unit.startsWith("/")
    ? `${value.toFixed(precision)}${unit}`
    : `${value.toFixed(precision)} ${unit}`,
});

const createMetrics = (
  config: ExperimentDemoConfig,
): readonly MetricResult[] => {
  const quality =
    FEATURE_ADJUSTMENTS[config.featureSet] +
    ALGORITHM_ADJUSTMENTS[config.algorithm] +
    VALIDATION_ADJUSTMENTS[config.validation];
  const sensorCount =
    config.featureSet === "process"
      ? 5
      : config.featureSet === "vibration"
        ? 4
        : config.featureSet === "physics"
          ? 7
          : 11;
  const inferenceCost =
    config.algorithm === "xgboost"
      ? 18
      : config.algorithm === "autoencoder"
        ? 25
        : config.algorithm === "physics-residual"
          ? 14
          : 11;
  const explainability =
    config.algorithm === "physics-residual"
      ? 93
      : config.algorithm === "xgboost"
        ? 78
        : config.algorithm === "isolation-forest"
          ? 70
          : 54;

  return [
    metric("detection-rate", "Detection Rate", 72 + quality, "%"),
    metric(
      "false-alarms",
      "False Alarms",
      Math.max(0.2, 2.1 - quality / 12),
      "alerts/month",
      1,
    ),
    metric(
      "lead-time",
      "Lead Time",
      2 + Math.max(0, Math.round(quality / 5)),
      "days",
    ),
    metric("inference-cost", "Inference Cost", inferenceCost, "ms"),
    metric("sensor-count", "Sensor Count", sensorCount, "sensors"),
    metric("robustness", "Robustness", 66 + quality, "/100"),
    metric("explainability", "Explainability", explainability, "/100"),
  ];
};

const createFixture = (config: ExperimentDemoConfig): ExperimentResult => {
  const experimentId = [
    "EXP",
    "P101",
    "BD",
    config.featureSet.toUpperCase(),
    config.algorithm.replaceAll("-", "").toUpperCase(),
    config.validation.replaceAll("-", "").toUpperCase(),
  ].join("-");
  const metrics = createMetrics(config);
  const provenance: ExperimentProvenance = {
    ...DEMO_VERSIONS,
    tick: 0,
    tickUnit: "fixture snapshot",
    assetVersion: P101_TWIN.provenance.assetVersion,
    twinVersion: P101_TWIN.version,
    datasetVersion: dataset.version,
    simulatorVersion: "SIM-P101-0.2.0",
    featurePipelineVersion: "FEATURES-P101-0.2.0",
    modelVersion: MODEL_VERSIONS[config.algorithm],
    codeVersion: "ITL-PHASE-1-0.2.0",
    experimentConfiguration: config,
    randomSeed: 101,
    timestampLabel: "Synthetic fixture",
    authorAgent: "Industrial Twin Lab synthetic fixture agent",
    source: "Industrial Twin Lab deterministic experiment fixture lookup",
    statement:
      "Conceptual demonstration — synthetic fixture results. No model is trained or executed and no real plant data is used.",
    synthetic: true,
  };
  const evidence: EvidencePackage = {
    experimentId,
    hypothesis: {
      id: "HYP-P101-BEARING-01",
      statement:
        "Bearing-related features may reveal degradation before failure under held-out operating regimes.",
      status: "not-tested",
    },
    assumptions: [
      "All seven metrics are authored teaching values, not measurements, fitted models, or benchmark results.",
      "Feature and algorithm adjustments prescribe the displayed scores; they cannot establish a winning model or feature set.",
      "Validation selections label illustrative scenarios; no dataset is split and no statistical validation is executed.",
      "The fixed seed 101 identifies this fixture family; no random sampling occurs. Tick 0 is a single snapshot, not elapsed plant time.",
      "Sensor counts and inference milliseconds are illustrative resource assumptions, not an executed feature pipeline or hardware timing.",
    ],
    model: {
      id: `MODEL-${config.algorithm.toUpperCase()}`,
      algorithm: config.algorithm,
      version: MODEL_VERSIONS[config.algorithm],
      status: "experimental",
    },
    dataset,
    featureSet: config.featureSet,
    operatingRegimes: [
      "Nominal flow: 220–260 m³/h",
      "Rated speed: 2,900–3,000 rpm",
      "Ambient temperature: 5–45 °C",
    ],
    validationMethod: config.validation,
    metrics,
    limitations: [
      "Synthetic fixture results do not establish plant performance.",
      "No control decision, alarm threshold, or maintenance action is authorized.",
      "Simulation fidelity and transferability require independent engineering validation.",
    ],
    uncertainty:
      "Illustrative uncertainty only; no confidence value is derived from an operating machine.",
    explainability: `${ALGORITHM_LABELS[config.algorithm]} compared under ${VALIDATION_LABELS[config.validation]}.`,
    evidence: [
      {
        id: `${experimentId}-SYNTHETIC-EVIDENCE`,
        strength: "limited",
        summary: "Deterministic synthetic fixture for conceptual comparison.",
        synthetic: true,
      },
    ],
    provenance,
  };

  return {
    experiment: {
      id: experimentId,
      assetId: config.assetId,
      problem: config.problem,
      featureSet: config.featureSet,
      algorithm: config.algorithm,
      validation: config.validation,
    },
    experimentId,
    metrics,
    evidence,
    provenance,
    disclosure: "Conceptual demonstration — synthetic fixture results.",
  };
};

const createExperimentLookup = (): Readonly<
  Record<ExperimentLookupKey, ExperimentResult>
> => {
  const lookup = {} as Record<ExperimentLookupKey, ExperimentResult>;
  for (const featureSet of FEATURE_SETS) {
    for (const algorithm of ALGORITHMS) {
      for (const validation of VALIDATIONS) {
        const config: ExperimentDemoConfig = {
          assetId: "P-101",
          problem: "bearing-degradation",
          featureSet,
          algorithm,
          validation,
        };
        lookup[keyFor(config)] = createFixture(config);
      }
    }
  }
  return lookup;
};

export const EXPERIMENT_FIXTURES = deepFreeze(createExperimentLookup());

const includes = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => typeof value === "string" && values.includes(value as T);

export const isExperimentDemoConfig = (
  value: unknown,
): value is ExperimentDemoConfig => {
  if (typeof value !== "object" || value === null) return false;
  const config = value as Record<string, unknown>;
  return (
    !Array.isArray(value) &&
    Object.keys(config).length === 5 &&
    ["assetId", "problem", "featureSet", "algorithm", "validation"].every(
      (key) => Object.hasOwn(config, key),
    ) &&
    config.assetId === "P-101" &&
    config.problem === "bearing-degradation" &&
    includes(FEATURE_SETS, config.featureSet) &&
    includes(ALGORITHMS, config.algorithm) &&
    includes(VALIDATIONS, config.validation)
  );
};

export const buildExperimentResult = (config: unknown): ExperimentResult => {
  if (!isExperimentDemoConfig(config)) {
    throw new Error(
      "Unsupported experiment configuration. No result was generated.",
    );
  }
  return EXPERIMENT_FIXTURES[keyFor(config)];
};
