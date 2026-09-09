import { ExperimentDemo } from "@/components/experiment/experiment-demo";
import { PublicationLink } from "@/components/publication/publication-link";
import { CONTENT_META } from "@/lib/content/registry";
import { publicationMetadata } from "@/lib/metadata";

const contentMeta = CONTENT_META["experiment-fabric"];

export const metadata = publicationMetadata({
  pathname: "/experiment-fabric/demo",
  title: "Concept Demonstrator — Experiment Fabric",
  description:
    "Inspect deterministic synthetic P-101 experiment fixtures and their complete evidence provenance.",
});

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
      <aside className="pdt-companion" aria-label="PDT companion application">
        <p>
          Want to inspect the pump before exploring its experiment evidence?
          PDT’s interactive 3D exhibit shows P-101 components, sensor locations,
          and illustrative fault conditions using simplified geometry and
          synthetic signals. Its state is separate from this experiment fixture.
        </p>
        <PublicationLink href="https://pdt.aserdargun.com" target="_blank">
          Explore P-101 in PDT
        </PublicationLink>
      </aside>
      <ExperimentDemo />
    </article>
  );
}
