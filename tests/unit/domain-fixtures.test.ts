import { describe, expect, it } from "vitest";
import { ARCHITECTURE_CATALOGUE } from "@/lib/data/architecture";
import { GLOSSARY_TERMS } from "@/lib/data/glossary";
import { SITE_NAVIGATION } from "@/lib/data/navigation";
import { P101_TWIN } from "@/lib/data/p101";
import { RESEARCH_QUESTIONS } from "@/lib/data/research";
import { TECHNOLOGIES } from "@/lib/data/technologies";

describe("P-101 fixtures", () => {
  it("keeps one asset, eleven signals, and six declared failure modes", () => {
    expect(P101_TWIN.asset.id).toBe("P-101");
    expect(P101_TWIN.sensors).toHaveLength(11);
    expect(P101_TWIN.failureModes).toHaveLength(6);
  });

  it("preserves the canonical signal and failure-mode identifiers", () => {
    expect(P101_TWIN.sensors.map((sensor) => sensor.id)).toEqual([
      "suction-pressure",
      "discharge-pressure",
      "flow",
      "motor-current",
      "motor-power",
      "speed",
      "bearing-de-temperature",
      "bearing-nde-temperature",
      "axial-vibration",
      "radial-vibration",
      "ambient-temperature",
    ]);
    expect(P101_TWIN.failureModes.map((failureMode) => failureMode.id)).toEqual(
      [
        "bearing-degradation",
        "impeller-degradation",
        "cavitation",
        "suction-restriction",
        "seal-leakage",
        "motor-degradation",
      ],
    );
    expect(P101_TWIN.version).toBe("TWIN-P101-0.1.0");
    expect(P101_TWIN.provenance.synthetic).toBe(true);
  });

  it("preserves the complete feature, envelope, and safety sets without extras", () => {
    expect(P101_TWIN.features.map((feature) => feature.id)).toEqual([
      "pressure-ratio",
      "flow-per-speed",
      "power-per-flow",
      "bearing-de-delta-ambient",
      "bearing-nde-delta-ambient",
      "vibration-rms",
      "vibration-kurtosis",
      "twin-residual",
      "rolling-mean-30m",
    ]);
    expect(P101_TWIN.operatingEnvelope).toEqual({
      flowMinimum: { value: 180, unit: "m³/h" },
      flowMaximum: { value: 280, unit: "m³/h" },
      suctionPressureMinimum: { value: 2.2, unit: "bar" },
      dischargePressureMaximum: { value: 125, unit: "bar" },
      ambientTemperatureMinimum: { value: 5, unit: "°C" },
      ambientTemperatureMaximum: { value: 45, unit: "°C" },
    });
    expect(P101_TWIN.safetyConstraints).toEqual([
      "Read-only conceptual fixture; no operational technology connection exists.",
      "No result authorizes automatic control or setpoint changes.",
      "Human engineering review is required before any physical-machine decision.",
    ]);
  });

  it("declares truthful Phase 1 model, limitation, and uncertainty boundaries", () => {
    expect(P101_TWIN.modelAvailability).toEqual({
      implementationStatus: "Not implemented",
      validationStatus: "Not validated in Phase 1",
      statement: "No physics model is implemented or validated in Phase 1.",
    });
    expect(P101_TWIN.limitations).toEqual([
      "P-101 values and relationships are synthetic teaching fixtures, not plant measurements or validated industrial evidence.",
      "Read-only conceptual fixture; no operational technology connection exists.",
      "No result authorizes automatic control or setpoint changes.",
    ]);
    expect(P101_TWIN.uncertainty).toEqual({
      status: "Unquantified",
      statement:
        "Uncertainty is unquantified because P-101 has no plant measurements or validated industrial evidence.",
    });
  });
});

describe("publication catalogues", () => {
  it("keeps one exact architecture flow and six complete zone records", () => {
    expect(ARCHITECTURE_CATALOGUE.flow).toEqual([
      "Physical Asset",
      "Digital Twin",
      "Isolated Experiment Lab",
      "AI Scientist",
      "Evidence",
      "Human Decision",
      "Validated Deployment",
    ]);
    expect(ARCHITECTURE_CATALOGUE.zones).toEqual([
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
        permittedRole:
          "Generate and test hypotheses without control authority.",
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
    ]);
  });

  it("exposes the ten canonical research questions in sequence", () => {
    expect(RESEARCH_QUESTIONS.map((question) => question.id)).toEqual([
      "RQ-001",
      "RQ-002",
      "RQ-003",
      "RQ-004",
      "RQ-005",
      "RQ-006",
      "RQ-007",
      "RQ-008",
      "RQ-009",
      "RQ-010",
    ]);
    expect(RESEARCH_QUESTIONS.at(-1)?.question).toBe(
      "What evidence should be required before an industrial AI model is allowed into production?",
    );
  });

  it("keeps the thirteen publication sections and complete reference catalogues", () => {
    expect(SITE_NAVIGATION).toHaveLength(13);
    expect(SITE_NAVIGATION.map((item) => item.href)).toEqual([
      "/manifesto",
      "/architecture",
      "/twin-capsule",
      "/experiment-fabric",
      "/feature-factory",
      "/algorithm-arena",
      "/fault-lab",
      "/ai-scientist",
      "/fleet-intelligence",
      "/research",
      "/technology",
      "/glossary",
      "/about",
    ]);
    expect(TECHNOLOGIES.map((category) => category.name)).toEqual([
      "Industrial Connectivity",
      "Twin Semantics",
      "Simulation",
      "Data",
      "Machine Learning",
      "Experimentation",
      "Local AI",
      "Infrastructure",
      "Observability",
    ]);
    expect(GLOSSARY_TERMS).toHaveLength(21);
    expect(GLOSSARY_TERMS.map((term) => term.term)).toContain(
      "Model Provenance",
    );
  });
});
