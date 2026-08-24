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

export const DEFAULT_DEMO_CONFIG: ExperimentDemoConfig = {
  assetId: "P-101",
  problem: "bearing-degradation",
  featureSet: "combined",
  algorithm: "xgboost",
  validation: "walk-forward",
};

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
  version: "DATASET-P101-SYN-0.1.0",
  assetId: "P-101",
  description: "Synthetic P-101 bearing-degradation fixture dataset.",
  provenance: {
    assetVersion: "ASSET-P101-0.1.0",
    twinVersion: "TWIN-P101-0.1.0",
    datasetVersion: "DATASET-P101-SYN-0.1.0",
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
  displayValue: `${value.toFixed(precision)} ${unit}`,
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
    assetVersion: "ASSET-P101-0.1.0",
    twinVersion: "TWIN-P101-0.1.0",
    datasetVersion: "DATASET-P101-SYN-0.1.0",
    featurePipelineVersion: "FEATURES-P101-0.1.0",
    modelVersion: MODEL_VERSIONS[config.algorithm],
    codeVersion: "ITL-PHASE-1-0.1.0",
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

export const EXPERIMENT_FIXTURES = createExperimentLookup();

const includes = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => typeof value === "string" && values.includes(value as T);

const isExperimentDemoConfig = (
  value: unknown,
): value is ExperimentDemoConfig => {
  if (typeof value !== "object" || value === null) return false;
  const config = value as Record<string, unknown>;
  return (
    config.assetId === "P-101" &&
    config.problem === "bearing-degradation" &&
    includes(FEATURE_SETS, config.featureSet) &&
    includes(ALGORITHMS, config.algorithm) &&
    includes(VALIDATIONS, config.validation)
  );
};

const normalizeConfig = (config: ExperimentDemoConfig): ExperimentDemoConfig =>
  isExperimentDemoConfig(config) ? config : DEFAULT_DEMO_CONFIG;

export const buildExperimentResult = (
  config: ExperimentDemoConfig,
): ExperimentResult => EXPERIMENT_FIXTURES[keyFor(normalizeConfig(config))];
