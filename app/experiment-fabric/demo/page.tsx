import type { Metadata } from "next";

import { ExperimentDemo } from "@/components/experiment/experiment-demo";
import { CONTENT_META } from "@/lib/content/registry";

const contentMeta = CONTENT_META["experiment-fabric"];

export const metadata: Metadata = {
  title: "Concept Demonstrator — Experiment Fabric",
  description:
    "Inspect deterministic synthetic P-101 experiment fixtures and their complete evidence provenance.",
};

export default function ExperimentFabricDemoPage() {
  return (
    <article className="experiment-demo-page">
      <header className="experiment-demo-page__intro">
        <div>
          <p>{contentMeta.status} / Concept demonstrator</p>
          <h1>Experiment Fabric</h1>
          <p>Concept demonstrator</p>
        </div>
        <p className="experiment-demo-page__disclosure">
          Conceptual demonstration — synthetic fixture results.
        </p>
      </header>
      <ExperimentDemo />
    </article>
  );
}
