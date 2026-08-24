export type Quantity = Readonly<{
  value: number;
  unit: string;
}>;

export type FeatureSet = "process" | "vibration" | "physics" | "combined";
export type AlgorithmName =
  "isolation-forest" | "xgboost" | "autoencoder" | "physics-residual";
export type ValidationStrategy =
  "time-split" | "walk-forward" | "leave-one-regime-out";
export type ConfidenceGrade = "low" | "medium" | "high";
export type EvidenceStrength =
  "inconclusive" | "limited" | "supporting" | "strong";
export type ImplementationStatus =
  "conceptual" | "candidate" | "experimental" | "validated";
export type MetricId =
  | "detection-rate"
  | "false-alarms"
  | "lead-time"
  | "inference-cost"
  | "sensor-count"
  | "robustness"
  | "explainability";

export interface Asset {
  readonly id: string;
  readonly name: string;
  readonly assetType: string;
  readonly driver: string;
  readonly description: string;
  readonly hierarchy: readonly string[];
  readonly engineeringMetadata: Readonly<Record<string, string | Quantity>>;
}

export interface Sensor {
  readonly id: string;
  readonly name: string;
  readonly quantity: string;
  readonly unit: string;
  readonly location: string;
  readonly nominalValue: Quantity;
}

export interface Feature {
  readonly id: string;
  readonly name: string;
  readonly featureSet: FeatureSet | "temporal";
  readonly sourceSignalIds: readonly string[];
  readonly description: string;
}

export interface FailureMode {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly affectedSensorIds: readonly string[];
}

export interface Provenance {
  readonly assetVersion: string;
  readonly twinVersion: string;
  readonly datasetVersion?: string;
  readonly featurePipelineVersion?: string;
  readonly modelVersion?: string;
  readonly codeVersion?: string;
  readonly randomSeed?: number;
  readonly timestampLabel?: string;
  readonly source: string;
  readonly statement: string;
  readonly synthetic: boolean;
}

export interface TwinModelAvailability {
  readonly implementationStatus: "Not implemented";
  readonly validationStatus: "Not validated in Phase 1";
  readonly statement: string;
}

export interface TwinUncertaintyBoundary {
  readonly status: "Unquantified";
  readonly statement: string;
}

export interface TwinCapsule {
  readonly id: string;
  readonly version: string;
  readonly asset: Asset;
  readonly sensors: readonly Sensor[];
  readonly features: readonly Feature[];
  readonly failureModes: readonly FailureMode[];
  readonly operatingEnvelope: Readonly<Record<string, Quantity>>;
  readonly safetyConstraints: readonly string[];
  readonly modelAvailability: TwinModelAvailability;
  readonly limitations: readonly string[];
  readonly uncertainty: TwinUncertaintyBoundary;
  readonly provenance: Provenance;
}

export interface Dataset {
  readonly id: string;
  readonly version: string;
  readonly assetId: string;
  readonly description: string;
  readonly provenance: Provenance;
}

export interface Algorithm {
  readonly id: AlgorithmName;
  readonly name: string;
  readonly family: string;
  readonly description: string;
}

export interface ModelCandidate {
  readonly id: string;
  readonly algorithm: AlgorithmName;
  readonly version: string;
  readonly status: ImplementationStatus;
}

export interface Hypothesis {
  readonly id: string;
  readonly statement: string;
  readonly confidence: ConfidenceGrade;
}

export interface Evidence {
  readonly id: string;
  readonly strength: EvidenceStrength;
  readonly summary: string;
  readonly synthetic: boolean;
}

export interface Experiment {
  readonly id: string;
  readonly assetId: string;
  readonly problem: string;
  readonly featureSet: FeatureSet;
  readonly algorithm: AlgorithmName;
  readonly validation: ValidationStrategy;
}

export interface MetricResult {
  readonly id: MetricId;
  readonly label: string;
  readonly value: number;
  readonly unit: string;
  readonly displayValue: string;
}

export interface EvidencePackage {
  readonly experimentId: string;
  readonly model: ModelCandidate;
  readonly dataset: Dataset;
  readonly featureSet: FeatureSet;
  readonly operatingRegimes: readonly string[];
  readonly validationMethod: ValidationStrategy;
  readonly metrics: readonly MetricResult[];
  readonly limitations: readonly string[];
  readonly uncertainty: string;
  readonly explainability: string;
  readonly evidence: readonly Evidence[];
  readonly provenance: ExperimentProvenance;
}

export interface ExperimentDemoConfig {
  readonly assetId: "P-101";
  readonly problem: "bearing-degradation";
  readonly featureSet: FeatureSet;
  readonly algorithm: AlgorithmName;
  readonly validation: ValidationStrategy;
}

export interface ExperimentProvenance extends Provenance {
  readonly assetVersion: string;
  readonly twinVersion: string;
  readonly datasetVersion: string;
  readonly featurePipelineVersion: string;
  readonly modelVersion: string;
  readonly codeVersion: string;
  readonly experimentConfiguration: ExperimentDemoConfig;
  readonly randomSeed: number;
  readonly timestampLabel: string;
  readonly authorAgent: string;
}

export interface ExperimentResult {
  readonly experiment: Experiment;
  readonly experimentId: string;
  readonly metrics: readonly MetricResult[];
  readonly evidence: EvidencePackage;
  readonly provenance: ExperimentProvenance;
  readonly disclosure: "Conceptual demonstration — synthetic fixture results.";
}

export interface ResearchQuestion {
  readonly id: string;
  readonly question: string;
  readonly status: ImplementationStatus;
}

export interface TechnologyItem {
  readonly id: string;
  readonly name: string;
}

export interface Technology {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly items: readonly TechnologyItem[];
}

export interface GlossaryTerm {
  readonly id: string;
  readonly term: string;
  readonly definition: string;
  readonly relatedHrefs: readonly string[];
}

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}
