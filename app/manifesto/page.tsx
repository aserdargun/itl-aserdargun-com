import type { Metadata } from "next";

import Manifesto from "@/content/manifesto.mdx";
import { FlowDiagram } from "@/components/diagrams/flow-diagram";

const KNOWLEDGE_SEQUENCE = [
  "Machine",
  "Observation",
  "Hypothesis",
  "Experiment",
  "Simulation",
  "Evidence",
  "Knowledge",
  "Decision",
] as const;

export const metadata: Metadata = {
  title: "Manifesto",
  description:
    "Twelve principles for isolated, evidence-led industrial machine intelligence.",
};

function MachineKnowledgeSequence() {
  return (
    <FlowDiagram
      caption="Observation and simulation produce reviewable evidence. Only human engineering authority turns that evidence into a decision; the sequence grants no automated control authority."
      steps={KNOWLEDGE_SEQUENCE}
      title="Machine knowledge sequence"
    />
  );
}

export default function ManifestoPage() {
  return (
    <article className="manifesto-publication">
      <Manifesto components={{ pre: MachineKnowledgeSequence }} />
    </article>
  );
}
