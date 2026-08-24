import { describe, expect, it } from "vitest";
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
});

describe("publication catalogues", () => {
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
