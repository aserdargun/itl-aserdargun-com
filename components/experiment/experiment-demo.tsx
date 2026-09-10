"use client";

import { useRef, useState } from "react";

import { EvidencePackage } from "@/components/diagrams/evidence-package";
import { MetricComparison } from "@/components/experiment/metric-comparison";
import type {
  ExperimentDemoConfig,
  ExperimentResult,
} from "@/lib/domain/types";
import {
  buildExperimentResult,
  DEFAULT_DEMO_CONFIG,
  DEMO_ALGORITHM_OPTIONS,
  DEMO_FEATURE_SET_OPTIONS,
  DEMO_MACHINE_OPTIONS,
  DEMO_PROBLEM_OPTIONS,
  DEMO_VALIDATION_OPTIONS,
} from "@/lib/experiments/demo";
import {
  exportReplay,
  importReplay,
  MAX_REPLAY_BYTES,
} from "@/lib/experiments/replay";

type SelectOption = Readonly<{ value: string; label: string }>;

interface DemoSelectProps {
  readonly id: string;
  readonly label: string;
  readonly options: readonly SelectOption[];
  readonly value: string;
  readonly onChange: (value: string) => void;
}

function DemoSelect({ id, label, onChange, options, value }: DemoSelectProps) {
  return (
    <div className="experiment-control">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={id}
        onChange={(event) => onChange(event.currentTarget.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const optionLabel = (options: readonly SelectOption[], value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

export function ExperimentDemo() {
  const [result, setResult] = useState<ExperimentResult>(() =>
    buildExperimentResult(DEFAULT_DEMO_CONFIG),
  );
  const config = result.provenance.experimentConfiguration;
  const [announcement, setAnnouncement] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const downloadReplay = () => {
    const url = URL.createObjectURL(
      new Blob([exportReplay(result)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `${result.experimentId}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setAnnouncement("Replay exported with the complete evidence package.");
  };

  const restoreReplay = async (file: File) => {
    setIsImporting(true);
    setAnnouncement("Checking replay evidence…");
    try {
      if (file.size > MAX_REPLAY_BYTES) {
        throw new Error(
          "Replay files must be 100 KB or smaller. The current fixture was kept.",
        );
      }
      const restored = importReplay(await file.text());
      setResult(restored);
      setAnnouncement(
        "Replay verified and restored. This confirms fixture consistency, not plant validity.",
      );
    } catch (error) {
      setAnnouncement(
        error instanceof Error
          ? error.message
          : "Replay could not be read. The current fixture was kept.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  const updateDimension = (
    field: keyof ExperimentDemoConfig,
    fieldLabel: string,
    value: string,
    options: readonly SelectOption[],
  ) => {
    const option = options.find((candidate) => candidate.value === value);
    if (!option) {
      setAnnouncement(
        `Invalid ${fieldLabel} selection rejected. The current fixture was kept.`,
      );
      return;
    }
    const nextConfig = {
      ...config,
      [field]: option.value,
    } as ExperimentDemoConfig;
    const nextResult = buildExperimentResult(nextConfig);

    setResult(nextResult);
    setAnnouncement(`Evidence updated: ${nextResult.experimentId}.`);
  };

  const validationLabel = optionLabel(
    DEMO_VALIDATION_OPTIONS,
    config.validation,
  );

  return (
    <section className="experiment-demo" aria-label="Concept demonstrator">
      <div
        aria-label="Experiment configuration"
        className="experiment-demo__configuration"
        role="region"
      >
        <div className="experiment-demo__rail-heading">
          <p>Configure an experiment</p>
          <p>Deterministic local fixture</p>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <fieldset disabled={isImporting} className="experiment-controls">
            <legend className="sr-only">Fixture selections</legend>
            <DemoSelect
              id="experiment-machine"
              label="Machine"
              onChange={(value) =>
                updateDimension(
                  "assetId",
                  "Machine",
                  value,
                  DEMO_MACHINE_OPTIONS,
                )
              }
              options={DEMO_MACHINE_OPTIONS}
              value={config.assetId}
            />
            <DemoSelect
              id="experiment-problem"
              label="Problem"
              onChange={(value) =>
                updateDimension(
                  "problem",
                  "Problem",
                  value,
                  DEMO_PROBLEM_OPTIONS,
                )
              }
              options={DEMO_PROBLEM_OPTIONS}
              value={config.problem}
            />
            <DemoSelect
              id="experiment-feature-set"
              label="Feature set"
              onChange={(value) =>
                updateDimension(
                  "featureSet",
                  "Feature set",
                  value,
                  DEMO_FEATURE_SET_OPTIONS,
                )
              }
              options={DEMO_FEATURE_SET_OPTIONS}
              value={config.featureSet}
            />
            <DemoSelect
              id="experiment-algorithm"
              label="Algorithm"
              onChange={(value) =>
                updateDimension(
                  "algorithm",
                  "Algorithm",
                  value,
                  DEMO_ALGORITHM_OPTIONS,
                )
              }
              options={DEMO_ALGORITHM_OPTIONS}
              value={config.algorithm}
            />
            <DemoSelect
              id="experiment-validation"
              label="Validation"
              onChange={(value) =>
                updateDimension(
                  "validation",
                  "Validation",
                  value,
                  DEMO_VALIDATION_OPTIONS,
                )
              }
              options={DEMO_VALIDATION_OPTIONS}
              value={config.validation}
            />
          </fieldset>
        </form>
        <p className="experiment-demo__rail-note">
          Selection updates the local evidence fixture immediately. No model is
          trained or executed.
        </p>
        <div className="experiment-replay">
          <h2>Save and replay evidence</h2>
          <p id="replay-help">
            Export this record, then import it to restore the same selections
            and evidence. JSON only, up to 100 KB. Files are checked locally
            against the supported fixture; they are never uploaded.
          </p>
          <button type="button" disabled={isImporting} onClick={downloadReplay}>
            Export replay JSON
          </button>
          <label htmlFor="experiment-replay-file">Import replay JSON</label>
          <input
            ref={fileRef}
            id="experiment-replay-file"
            type="file"
            accept=".json,application/json"
            aria-describedby="replay-help"
            disabled={isImporting}
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              event.currentTarget.value = "";
              if (file) void restoreReplay(file);
            }}
          />
          <button
            type="button"
            disabled={isImporting}
            onClick={() => {
              setResult(buildExperimentResult(DEFAULT_DEMO_CONFIG));
              if (fileRef.current) fileRef.current.value = "";
              setAnnouncement("Default fixture restored.");
            }}
          >
            Reset to default
          </button>
        </div>
      </div>

      <div
        aria-label="Experiment evidence ledger"
        className="experiment-demo__evidence"
        role="region"
      >
        <header className="experiment-result__header">
          <div>
            <p>Evidence Package / Synthetic fixture</p>
            <h2>P-101 decision replay</h2>
            <p
              className="experiment-result__record-id"
              data-testid="experiment-id"
            >
              {result.experimentId}
            </p>
          </div>
          <p className="experiment-result__status">
            <span>Status</span>
            Synthetic fixture
          </p>
        </header>

        <p className="experiment-result__disclosure">{result.disclosure}</p>
        <p
          aria-atomic="true"
          aria-live="polite"
          className="experiment-result__announcement"
          role="status"
        >
          {announcement}
        </p>

        <dl className="experiment-result__audit-rail">
          <div>
            <dt>Context snapshot</dt>
            <dd>P-101 + operating envelope</dd>
          </div>
          <div>
            <dt>Constraint check</dt>
            <dd>No control path</dd>
          </div>
          <div>
            <dt>Evidence</dt>
            <dd>Deterministic fixture</dd>
          </div>
          <div>
            <dt>Authority</dt>
            <dd>Human review required</dd>
          </div>
        </dl>

        <MetricComparison metrics={result.metrics} />
        <p className="experiment-metrics__note">
          Authored teaching values, including the millisecond timings. These
          scores do not measure model performance or establish a preferred
          algorithm.
        </p>

        <dl className="experiment-result__summary">
          <div>
            <dt>Machine / failure mode</dt>
            <dd>P-101 / Bearing degradation</dd>
          </div>
          <div>
            <dt>Validation</dt>
            <dd>{validationLabel}</dd>
          </div>
          <div>
            <dt>Simulator version</dt>
            <dd>{result.provenance.simulatorVersion}</dd>
          </div>
        </dl>

        <EvidencePackage
          caption="A deterministic, fictional teaching record for inspecting the evidence contract; it is not plant evidence or a deployment certificate."
          evidencePackage={result.evidence}
          title="Complete experiment evidence"
        />
      </div>
    </section>
  );
}
