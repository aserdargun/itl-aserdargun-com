import type { Metadata } from "next";
import { isValidElement, type ComponentProps, type ReactNode } from "react";

import {
  EvidenceMatrix,
  type EvidenceMatrixColumn,
  type EvidenceMatrixRow,
} from "@/components/diagrams/evidence-matrix";
import { FlowDiagram } from "@/components/diagrams/flow-diagram";
import { PublicationLink } from "@/components/publication/publication-link";
import AiScientistContent from "@/content/concepts/ai-scientist.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import { AI_SCIENTIST_CATALOGUE } from "@/lib/data/intelligence";

const contentMeta = CONTENT_META["ai-scientist"];

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

const evidenceColumns: readonly EvidenceMatrixColumn[] = [
  { id: "physics", label: "Physics" },
  { id: "historical", label: "Historical" },
  { id: "machine-learning", label: "ML" },
  { id: "similar-assets", label: "Similar assets" },
  { id: "confidence", label: "Confidence" },
];

const evidenceRows: readonly EvidenceMatrixRow[] =
  AI_SCIENTIST_CATALOGUE.hypotheses.flatMap((hypothesis) => {
    if (!("evidence" in hypothesis) || !hypothesis.evidence) return [];

    return [
      {
        id: hypothesis.id,
        label: hypothesis.evidenceLabel,
        values: [
          hypothesis.evidence.physics,
          hypothesis.evidence.historical,
          hypothesis.evidence.machineLearning,
          hypothesis.evidence.similarAssets,
          `${hypothesis.evidence.confidence.toFixed(2)} — evaluated fixture`,
        ],
      },
    ];
  });

const textFromNode = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) return node.map(textFromNode).join("");
  if (isValidElement<{ readonly children?: ReactNode }>(node)) {
    return textFromNode(node.props.children);
  }
  return "";
};

function PublicationHeading(props: ComponentProps<"h1">) {
  return (
    <>
      <h1 {...props} />
      <p className="methods-fixture-disclosure">
        P-101 is a fictional, synthetic teaching fixture. The investigation and
        confidence values below are not plant observations or validated
        engineering conclusions.
      </p>
    </>
  );
}

function IntelligenceFigure({ children, ...preProps }: ComponentProps<"pre">) {
  const marker = textFromNode(children).trim();

  if (marker.includes("hypothesis-to-evidence-flow-figure")) {
    return (
      <FlowDiagram
        caption="The AI Scientist may structure and request this isolated experiment path; it cannot send a command to P-101 or approve its own evidence."
        steps={AI_SCIENTIST_CATALOGUE.experimentFlow}
        title="P-101 hypothesis-to-evidence experiment flow"
      />
    );
  }

  if (marker.includes("hypothesis-evidence-matrix-figure")) {
    return (
      <EvidenceMatrix
        caption="Exactly three supplied evidence rows are shown. Confidence is a synthetic fixture value stated in text, not a color scale; Hypothesis 04 remains explicitly unevaluated."
        columns={evidenceColumns}
        rows={evidenceRows}
        title="P-101 hypothesis evidence matrix"
      />
    );
  }

  return (
    <pre data-publication-code {...preProps}>
      {children}
    </pre>
  );
}

export default function AiScientistPage() {
  return (
    <article className="concept-publication intelligence-publication ai-scientist-publication">
      <AiScientistContent
        components={{ h1: PublicationHeading, pre: IntelligenceFigure }}
      />

      <section className="concept-publication__direction">
        <p>Human validation gate</p>
        <h2>Reasoning is not operational authority</h2>
        <p>
          An accountable engineer owns the decision, scope, repetition, and stop
          condition. No LLM, tool result, confidence fixture, or Evidence
          Package can validate itself or cross from this publication into
          machinery control.
        </p>
      </section>

      <nav
        aria-label="Related AI Scientist publications"
        className="concept-publication__related"
      >
        <p>Continue through the boundary</p>
        <h2>Related publications</h2>
        <ul>
          <li>
            <PublicationLink href="/architecture">Architecture</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/experiment-fabric">
              Experiment Fabric
            </PublicationLink>
          </li>
          <li>
            <PublicationLink href="/fleet-intelligence">
              Fleet Intelligence
            </PublicationLink>
          </li>
        </ul>
      </nav>
    </article>
  );
}
