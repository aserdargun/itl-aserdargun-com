import type { Metadata } from "next";
import { Children, type HTMLAttributes } from "react";

import { FlowDiagram } from "@/components/diagrams/flow-diagram";
import {
  SafetyBoundary,
  type SafetyZone,
} from "@/components/diagrams/safety-boundary";
import ArchitectureContent from "@/content/concepts/architecture.mdx";
import { CONTENT_META } from "@/lib/content/registry";

const contentMeta = CONTENT_META.architecture;

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

const ARCHITECTURE_FLOW = [
  "Physical Asset",
  "Digital Twin",
  "Isolated Experiment Lab",
  "AI Scientist",
  "Evidence",
  "Human Decision",
  "Validated Deployment",
] as const;

const SAFETY_ZONES: readonly SafetyZone[] = [
  {
    id: "ot-control",
    title: "OT Control Zone",
    description:
      "P-101 is a fictional demonstration asset. PLC, DCS, and SCADA retain deterministic plant control under existing authority.",
    boundary: "safety",
  },
  {
    id: "data-access",
    title: "Data Access Zone",
    description:
      "Sensors, gateway, read-only historian, OPC UA, and MQTT provide controlled acquisition and quality context.",
  },
  {
    id: "twin",
    title: "Twin Zone",
    description:
      "Twin Capsule, digital twin, and simulation runtime represent behaviour within a declared fidelity and envelope.",
  },
  {
    id: "ai-experiment",
    title: "AI Experiment Zone",
    description:
      "Isolated Twin Lab services include local models, feature engineering, model training, experiment tracking, and AI Scientist. They have no control authority.",
    boundary: "isolation",
  },
  {
    id: "validation-gate",
    title: "Validation Gate",
    description:
      "Human in command. Engineering review, approval, and a signed model determine fitness for a stated inference use.",
    boundary: "human",
  },
  {
    id: "inference",
    title: "Inference Zone",
    description:
      "An approved local model runs only as the reviewed version within its approved boundary, with no path back to control.",
  },
] as const;

function ArchitectureAtlas() {
  return (
    <div className="architecture-atlas">
      <SafetyBoundary
        caption="Six ordered zones keep research inquiry outside the control loop. Evidence may move forward for review; no experimental or inference result has a return path to P-101 or OT Control."
        title="Industrial Twin Lab safety boundary"
        zones={SAFETY_ZONES}
      />
      <div
        className="architecture-atlas__asset"
        aria-label="Demonstration asset disclosure"
      >
        <strong>P-101</strong>
        <span>Fictional demonstration asset</span>
      </div>
      <FlowDiagram
        caption="A one-way real-world to digital-world path: controlled data enters the lab, while evidence reaches a human decision before any separately validated deployment."
        steps={ARCHITECTURE_FLOW}
        title="Real-world to digital-world evidence flow"
      />
    </div>
  );
}

function ArchitectureParagraph({
  children,
  ...paragraphProps
}: HTMLAttributes<HTMLParagraphElement>) {
  const isSourceTable = Children.toArray(children).some(
    (child) =>
      typeof child === "string" && child.trimStart().startsWith("| Zone"),
  );

  return isSourceTable ? null : <p {...paragraphProps}>{children}</p>;
}

export default function ArchitecturePage() {
  return (
    <article className="concept-publication architecture-publication">
      <ArchitectureContent
        components={{ pre: ArchitectureAtlas, p: ArchitectureParagraph }}
      />
      <section className="concept-publication__direction">
        <p>Research direction / not deployed</p>
        <h2>Digital Triplet: research direction only</h2>
        <p>
          Physical Machine + Digital Twin + AI Scientist describes a research
          direction, not a deployed autonomous capability. It grants no control
          authority and remains subject to the same validation boundary and
          human engineering decision.
        </p>
      </section>
    </article>
  );
}
