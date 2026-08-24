type EvidenceLevel = "Strong" | "Medium" | "Weak";

export interface P101HypothesisEvidence {
  readonly physics: EvidenceLevel;
  readonly historical: EvidenceLevel;
  readonly machineLearning: EvidenceLevel;
  readonly similarAssets: EvidenceLevel;
  readonly confidence: number;
}

export interface P101Hypothesis {
  readonly id: string;
  readonly catalogueLabel: string;
  readonly statement: string;
  readonly evidenceLabel?: string;
  readonly evidence?: P101HypothesisEvidence;
}

export const AI_SCIENTIST_CATALOGUE = {
  investigation:
    "Pump P-101 has required progressively more power for the same flow during the last three months. Investigate.",
  experimentFlow: [
    "Observe",
    "Retrieve Knowledge",
    "Generate Hypotheses",
    "Design Experiments",
    "Run Twin Experiments",
    "Compare Evidence",
    "Explain Findings",
    "Recommend Next Action",
  ],
  hypotheses: [
    {
      id: "HYP-P101-01",
      catalogueLabel: "Hypothesis 01",
      statement: "Impeller degradation",
      evidenceLabel: "Impeller degradation",
      evidence: {
        physics: "Strong",
        historical: "Strong",
        machineLearning: "Strong",
        similarAssets: "Medium",
        confidence: 0.82,
      },
    },
    {
      id: "HYP-P101-02",
      catalogueLabel: "Hypothesis 02",
      statement: "Suction restriction",
      evidenceLabel: "Suction restriction",
      evidence: {
        physics: "Medium",
        historical: "Weak",
        machineLearning: "Medium",
        similarAssets: "Weak",
        confidence: 0.31,
      },
    },
    {
      id: "HYP-P101-03",
      catalogueLabel: "Hypothesis 03",
      statement: "Sensor calibration drift",
      evidenceLabel: "Sensor drift",
      evidence: {
        physics: "Weak",
        historical: "Medium",
        machineLearning: "Weak",
        similarAssets: "Weak",
        confidence: 0.19,
      },
    },
    {
      id: "HYP-P101-04",
      catalogueLabel: "Hypothesis 04",
      statement: "Increasing mechanical losses",
    },
  ],
} as const satisfies {
  readonly investigation: string;
  readonly experimentFlow: readonly string[];
  readonly hypotheses: readonly P101Hypothesis[];
};

export const FLEET_INTELLIGENCE_CATALOGUE = {
  hierarchy: [
    "Component Twin",
    "Machine Twin",
    "System Twin",
    "Plant Twin",
    "Fleet Twin",
    "Enterprise Intelligence",
  ],
  protocol: {
    trainLabel: "Train",
    trainAssets: "Pump P01–P49",
    testLabel: "Test",
    testAsset: "Pump P50",
    qualification:
      "Conceptual and synthetic research protocol — not a field result",
  },
  researchQuestion:
    "Did the AI learn pump degradation, or did it memorize individual machines?",
  knowledgeFlywheel: [
    "Machine Data",
    "Twin",
    "Experiment",
    "Evidence",
    "Knowledge",
    "Fleet Learning",
    "Better Experiments",
    "Better Machine Knowledge",
  ],
} as const;
