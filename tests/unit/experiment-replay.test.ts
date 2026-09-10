import { describe, expect, it } from "vitest";
import {
  buildExperimentResult,
  DEFAULT_DEMO_CONFIG,
  EXPERIMENT_FIXTURES,
} from "@/lib/experiments/demo";
import {
  exportReplay,
  importReplay,
  MAX_REPLAY_BYTES,
} from "@/lib/experiments/replay";

const fixture = () => buildExperimentResult(DEFAULT_DEMO_CONFIG);

describe("bounded evidence replay", () => {
  it("round-trips all 48 supported fixtures with byte-stable evidence", () => {
    for (const result of Object.values(EXPERIMENT_FIXTURES)) {
      const text = exportReplay(result);
      expect(importReplay(text)).toEqual(result);
      expect(exportReplay(importReplay(text))).toBe(text);
      expect(result.evidence.hypothesis.status).toBe("not-tested");
      expect(result.provenance.tick).toBe(0);
      expect(result.evidence.assumptions.length).toBeGreaterThan(0);
    }
  });

  it.each([
    "evidence.hypothesis",
    "evidence.assumptions",
    "evidence.limitations",
    "evidence.uncertainty",
    "evidence.dataset.provenance",
    "evidence.provenance",
    "provenance.randomSeed",
    "provenance.tick",
    "provenance.metricVersion",
    "provenance.worldVersion",
    "provenance.behaviorVersion",
    "provenance.experimentVersion",
    "provenance.simulatorVersion",
    "provenance.featurePipelineVersion",
  ])("rejects incomplete evidence at %s", (path) => {
    const record = JSON.parse(exportReplay(fixture()));
    const keys = path.split(".");
    let parent = record.result;
    for (const key of keys.slice(0, -1)) parent = parent[key];
    delete parent[keys.at(-1)!];
    expect(() => importReplay(JSON.stringify(record))).toThrow();
  });

  it("rejects altered metrics even when both displayed copies agree", () => {
    const record = JSON.parse(exportReplay(fixture()));
    record.result.metrics[0].value = 99;
    record.result.evidence.metrics[0].value = 99;
    expect(() => importReplay(JSON.stringify(record))).toThrow(
      /does not match/,
    );
    expect(() => exportReplay(record.result)).toThrow(/does not match/);
  });

  it("rejects changed seeds, ticks and dataset versions", () => {
    for (const [key, value] of [
      ["randomSeed", 102],
      ["tick", 1],
      ["datasetVersion", "unknown"],
    ]) {
      const record = JSON.parse(exportReplay(fixture()));
      record.result.provenance[key] = value;
      record.result.evidence.provenance[key] = value;
      expect(() => importReplay(JSON.stringify(record))).toThrow(
        /does not match/,
      );
    }
  });

  it("accepts JSON property reordering without changing canonical output", () => {
    const record = JSON.parse(exportReplay(fixture()));
    const reordered = {
      result: record.result,
      schemaVersion: record.schemaVersion,
    };
    expect(importReplay(JSON.stringify(reordered))).toEqual(fixture());
  });

  it.each([
    null,
    [],
    {},
    { ...DEFAULT_DEMO_CONFIG, algorithm: "unknown" },
    { ...DEFAULT_DEMO_CONFIG, seed: 102 },
  ])("rejects unsupported config %j", (config) => {
    expect(() => buildExperimentResult(config)).toThrow(/Unsupported/);
  });

  it("rejects invalid JSON, unknown schemas, extra fields and oversized imports", () => {
    for (const text of [
      "{",
      "null",
      "[]",
      "{}",
      " ".repeat(MAX_REPLAY_BYTES + 1),
    ]) {
      expect(() => importReplay(text)).toThrow();
    }
    const record = JSON.parse(exportReplay(fixture()));
    expect(() =>
      importReplay(JSON.stringify({ ...record, schemaVersion: "future" })),
    ).toThrow(/schema/);
    expect(() =>
      importReplay(JSON.stringify({ ...record, authorize: true })),
    ).toThrow(/schema/);
    record.result.evidence.approved = true;
    expect(() => importReplay(JSON.stringify(record))).toThrow(
      /does not match/,
    );
  });

  it("protects canonical evidence from cross-run mutation", () => {
    const result = fixture();
    expect(Reflect.set(result.metrics[0], "value", 100)).toBe(false);
    expect(Reflect.set(result.evidence.hypothesis, "status", "validated")).toBe(
      false,
    );
    expect(
      Reflect.set(
        result.provenance.experimentConfiguration,
        "algorithm",
        "autoencoder",
      ),
    ).toBe(false);
    expect(Reflect.set(DEFAULT_DEMO_CONFIG, "algorithm", "autoencoder")).toBe(
      false,
    );
    expect(fixture().metrics[0].value).toBe(86);
  });
});
