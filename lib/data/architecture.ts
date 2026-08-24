export type ArchitectureBoundary = "isolation" | "safety" | "human";

export interface ArchitectureZone {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly boundary?: ArchitectureBoundary;
  readonly boundaryRole: string;
  readonly representativeElements: readonly string[];
  readonly permittedRole: string;
}

export interface ArchitectureCatalogue {
  readonly flow: readonly string[];
  readonly zones: readonly ArchitectureZone[];
}

export const ARCHITECTURE_CATALOGUE: ArchitectureCatalogue = {
  flow: [
    "Physical Asset",
    "Digital Twin",
    "Isolated Experiment Lab",
    "AI Scientist",
    "Evidence",
    "Human Decision",
    "Validated Deployment",
  ],
  zones: [
    {
      id: "ot-control",
      title: "OT Control Zone",
      description:
        "P-101 is a fictional demonstration asset. PLC, DCS, and SCADA retain deterministic plant control under existing authority.",
      boundary: "safety",
      boundaryRole: "Safety boundary",
      representativeElements: [
        "P-101 fictional demonstration asset",
        "PLC",
        "DCS",
        "SCADA",
      ],
      permittedRole: "Deterministic plant control under existing authority.",
    },
    {
      id: "data-access",
      title: "Data Access Zone",
      description:
        "Sensors, gateway, read-only historian, OPC UA, and MQTT provide controlled acquisition and quality context.",
      boundaryRole: "Controlled flow",
      representativeElements: [
        "Sensors",
        "Gateway",
        "Read-only Historian",
        "OPC UA",
        "MQTT",
      ],
      permittedRole:
        "Controlled, read-oriented acquisition and quality context.",
    },
    {
      id: "twin",
      title: "Twin Zone",
      description:
        "Twin Capsule, digital twin, and simulation runtime represent behaviour within a declared fidelity and envelope.",
      boundaryRole: "Controlled flow",
      representativeElements: [
        "Twin Capsule",
        "Digital Twin",
        "Twin Runtime",
        "Simulation Runtime",
      ],
      permittedRole:
        "Represent behavior within a declared fidelity and envelope.",
    },
    {
      id: "ai-experiment",
      title: "AI Experiment Zone",
      description:
        "Isolated Twin Lab services include local models, feature engineering, model training, experiment tracking, and AI Scientist. They have no control authority.",
      boundary: "isolation",
      boundaryRole: "Isolated experiment boundary",
      representativeElements: [
        "Local Models",
        "Feature Engineering",
        "Model Training",
        "Experiment Tracking",
        "AI Scientist",
      ],
      permittedRole: "Generate and test hypotheses without control authority.",
    },
    {
      id: "validation-gate",
      title: "Validation Gate",
      description:
        "Human in command. Engineering review, approval, and a signed model determine fitness for a stated inference use.",
      boundary: "human",
      boundaryRole: "Human authority gate",
      representativeElements: [
        "Engineering Review",
        "Approval",
        "Signed Model",
      ],
      permittedRole:
        "Decide whether evidence is fit for a stated inference use. Human in command.",
    },
    {
      id: "inference",
      title: "Inference Zone",
      description:
        "An approved local model runs only as the reviewed version within its approved boundary, with no path back to control.",
      boundaryRole: "Approved inference boundary",
      representativeElements: ["Approved Local Model"],
      permittedRole:
        "Run only the reviewed version within its approved boundary, with no path back to control.",
    },
  ],
};
