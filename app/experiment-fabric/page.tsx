import type { Metadata } from "next";
import type { TableHTMLAttributes } from "react";

import { EvidencePackage } from "@/components/diagrams/evidence-package";
import { ExperimentAnatomy } from "@/components/diagrams/experiment-anatomy";
import { PublicationLink } from "@/components/publication/publication-link";
import ExperimentFabricContent from "@/content/concepts/experiment-fabric.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import {
  buildExperimentResult,
  DEFAULT_DEMO_CONFIG,
} from "@/lib/experiments/demo";

const contentMeta = CONTENT_META["experiment-fabric"];
const p101Result = buildExperimentResult(DEFAULT_DEMO_CONFIG);

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

const experimentStages = [
  ["asset", "Asset", "Versioned machine identity and twin context."],
  ["problem", "Problem", "Bearing degradation as the bounded failure mode."],
  [
    "dataset",
    "Dataset",
    "Synthetic, versioned fixture with explicit provenance.",
  ],
  [
    "regime",
    "Operating regime",
    "The envelope in which evidence is interpreted.",
  ],
  [
    "target",
    "Target and horizon",
    "Seven-day detection objective and outcome.",
  ],
  [
    "features",
    "Feature set",
    "Process, vibration, physics, or combined inputs.",
  ],
  ["algorithm", "Algorithm", "Candidates compete under identical conditions."],
  [
    "configuration",
    "Configuration",
    "Exact selections, versions, and random seed.",
  ],
  ["validation", "Validation", "Time-aware evaluation without future leakage."],
  [
    "metrics",
    "Metrics and cost",
    "Performance, false alarms, lead time, and compute.",
  ],
  [
    "qualification",
    "Qualification",
    "Robustness, explainability, and uncertainty.",
  ],
  [
    "decision",
    "Evidence result",
    "Limitations and human authority remain attached.",
  ],
] as const;

function ExperimentFabricAnatomy() {
  return (
    <ExperimentAnatomy
      caption="The experiment record binds the engineering question, reproducible configuration, validation discipline, qualified result, and decision boundary."
      stages={experimentStages.map(([id, title, description]) => ({
        id,
        title,
        description,
      }))}
      title="Complete experiment anatomy"
    />
  );
}

function P101ConfigurationTable(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div
      aria-label="P-101 experiment configuration, scroll horizontally to inspect all columns"
      className="diagram-table-region experiment-fabric__configuration-table"
      role="region"
      tabIndex={0}
    >
      <table {...props} className="diagram-table" />
    </div>
  );
}

export default function ExperimentFabricPage() {
  return (
    <article className="concept-publication experiment-fabric-publication">
      <ExperimentFabricContent
        components={{
          pre: ExperimentFabricAnatomy,
          table: P101ConfigurationTable,
        }}
      />

      <EvidencePackage
        caption="The fictional P-101 example keeps model and feature competition, validation, provenance, uncertainty, limitations, and human review in one reproducible record."
        evidencePackage={p101Result.evidence}
        title="P-101 bearing-degradation Evidence Package"
      />

      <nav
        aria-label="Related Experiment Fabric publications"
        className="concept-publication__related"
      >
        <p>Inspect the contract</p>
        <h2>Continue with the evidence</h2>
        <ul>
          <li>
            <PublicationLink href="/experiment-fabric/demo">
              Open the conceptual demonstrator
            </PublicationLink>
          </li>
          <li>
            <PublicationLink href="/feature-factory">
              Feature Factory
            </PublicationLink>
          </li>
          <li>
            <PublicationLink href="/algorithm-arena">
              Algorithm Arena
            </PublicationLink>
          </li>
        </ul>
      </nav>
    </article>
  );
}
