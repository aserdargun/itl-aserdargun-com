import type { ExperimentResult } from "@/lib/domain/types";
import { buildExperimentResult } from "@/lib/experiments/demo";

export const REPLAY_SCHEMA_VERSION = "ITL-REPLAY-1.0.0";
export const MAX_REPLAY_BYTES = 100_000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Compare against the bounded canonical tree, never merge or execute imported data.
const matchesCanonical = (actual: unknown, expected: unknown): boolean => {
  if (Array.isArray(expected)) {
    return (
      Array.isArray(actual) &&
      actual.length === expected.length &&
      expected.every((item, index) => matchesCanonical(actual[index], item))
    );
  }
  if (isRecord(expected)) {
    return (
      isRecord(actual) &&
      Object.keys(actual).length === Object.keys(expected).length &&
      Object.keys(expected).every(
        (key) =>
          Object.hasOwn(actual, key) &&
          matchesCanonical(actual[key], expected[key]),
      )
    );
  }
  return actual === expected;
};

const validateResult = (value: unknown): ExperimentResult => {
  if (!isRecord(value) || !isRecord(value.provenance)) {
    throw new Error(
      "Incomplete evidence package. The current fixture was kept.",
    );
  }
  const canonical = buildExperimentResult(
    value.provenance.experimentConfiguration,
  );
  if (!matchesCanonical(value, canonical)) {
    throw new Error(
      "Evidence does not match this version of the deterministic fixture. The current fixture was kept.",
    );
  }
  return canonical;
};

export const exportReplay = (result: ExperimentResult): string =>
  JSON.stringify(
    { schemaVersion: REPLAY_SCHEMA_VERSION, result: validateResult(result) },
    null,
    2,
  ) + "\n";

export const importReplay = (text: string): ExperimentResult => {
  if (new TextEncoder().encode(text).byteLength > MAX_REPLAY_BYTES) {
    throw new Error(
      "Replay files must be 100 KB or smaller. The current fixture was kept.",
    );
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error("Invalid replay JSON. The current fixture was kept.");
  }
  if (
    !isRecord(value) ||
    Object.keys(value).length !== 2 ||
    !Object.hasOwn(value, "result") ||
    value.schemaVersion !== REPLAY_SCHEMA_VERSION
  ) {
    throw new Error("Unsupported replay schema. The current fixture was kept.");
  }
  return validateResult(value.result);
};
