import type { ResearchQuestion } from "@/lib/domain/types";

export interface ResearchMaturityLevel {
  readonly id: string;
  readonly title: string;
  readonly capability: string;
  readonly evidenceThreshold: string;
  readonly description: string;
}

export const RESEARCH_QUESTIONS: readonly ResearchQuestion[] = [
  {
    id: "RQ-001",
    question:
      "How much digital twin fidelity is actually required for predictive maintenance?",
    status: "conceptual",
  },
  {
    id: "RQ-002",
    question:
      "When does physics-informed feature engineering outperform end-to-end deep learning?",
    status: "conceptual",
  },
  {
    id: "RQ-003",
    question:
      "Can synthetic failures improve models without introducing dangerous simulation bias?",
    status: "conceptual",
  },
  {
    id: "RQ-004",
    question: "Which features generalize across machines of the same class?",
    status: "conceptual",
  },
  {
    id: "RQ-005",
    question:
      "How should confidence from simulation, historical evidence, and machine learning be combined?",
    status: "conceptual",
  },
  {
    id: "RQ-006",
    question:
      "Can an AI Scientist autonomously design useful industrial experiments while remaining outside the control loop?",
    status: "conceptual",
  },
  {
    id: "RQ-007",
    question:
      "How should Digital Twin uncertainty propagate into AI recommendations?",
    status: "conceptual",
  },
  {
    id: "RQ-008",
    question:
      "Can fleet learning work without centralizing industrial raw data?",
    status: "conceptual",
  },
  {
    id: "RQ-009",
    question:
      "How can organizations distinguish correlation, causality, and physical mechanism?",
    status: "conceptual",
  },
  {
    id: "RQ-010",
    question:
      "What evidence should be required before an industrial AI model is allowed into production?",
    status: "conceptual",
  },
  {
    id: "RQ-011",
    question:
      "How can multi-agent orchestration remain subordinate to a shared safety hierarchy and named human authority?",
    status: "conceptual",
  },
  {
    id: "RQ-012",
    question:
      "What operational context must be captured to replay and audit an industrial agent recommendation?",
    status: "conceptual",
  },
  {
    id: "RQ-013",
    question:
      "Can SSP 2.0 and FMI 3.0 preserve enough simulation architecture and provenance for cross-tool replication?",
    status: "conceptual",
  },
  {
    id: "RQ-014",
    question:
      "What machine-readable data and metadata contract is required for a connected product to support trustworthy twin evidence?",
    status: "conceptual",
  },
  {
    id: "RQ-015",
    question:
      "What technical evidence should support risk management, human oversight, and traceability for high-risk industrial AI?",
    status: "conceptual",
  },
];

const maturityLevel = (
  level: number,
  name: string,
  capability: string,
  evidenceThreshold: string,
): ResearchMaturityLevel => ({
  id: `level-${level}`,
  title: `Level ${level} — ${name}`,
  capability,
  evidenceThreshold,
  description: `${capability}. ${evidenceThreshold}`,
});

export const RESEARCH_MATURITY_LEVELS: readonly ResearchMaturityLevel[] = [
  maturityLevel(
    0,
    "Connected Asset",
    "Machine → Data",
    "Data access is known; no inference claim is made.",
  ),
  maturityLevel(
    1,
    "Observable Asset",
    "Machine → Data → Monitoring",
    "Signals and quality limits are visible and traceable.",
  ),
  maturityLevel(
    2,
    "Digital Twin",
    "Machine ↔ Digital Representation",
    "The representation is verified and validated for a stated use.",
  ),
  maturityLevel(
    3,
    "Twin Lab",
    "Twin → Simulation → Experiments",
    "Experiments are isolated, reproducible, and limitation-aware.",
  ),
  maturityLevel(
    4,
    "Machine Intelligence",
    "Twin + Experiment Fabric + AI Scientist + Fleet Learning",
    "Recommendations survive independent validation and explicit engineering review.",
  ),
];
