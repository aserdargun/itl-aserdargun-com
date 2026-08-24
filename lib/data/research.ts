import type { ResearchQuestion } from "@/lib/domain/types";

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
];
