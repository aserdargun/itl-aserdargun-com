import type { Metadata } from "next";
import { isValidElement, type ComponentProps, type ReactNode } from "react";

import { FlowDiagram } from "@/components/diagrams/flow-diagram";
import { PublicationLink } from "@/components/publication/publication-link";
import FeatureFactoryContent from "@/content/concepts/feature-factory.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import { P101_TWIN } from "@/lib/data/p101";

const contentMeta = CONTENT_META["feature-factory"];

export const metadata: Metadata = {
  title: contentMeta.title,
  description: contentMeta.description,
};

const temperatureSignalIds = new Set(
  P101_TWIN.sensors
    .filter((sensor) => sensor.quantity === "Temperature")
    .map((sensor) => sensor.id),
);

const temperatureFeatures = P101_TWIN.features.filter((feature) =>
  feature.sourceSignalIds.some((sourceId) =>
    temperatureSignalIds.has(sourceId),
  ),
);
const vibrationFeatures = P101_TWIN.features.filter(
  (feature) => feature.featureSet === "vibration",
);
const engineeringFeatures = P101_TWIN.features.filter(
  (feature) =>
    !temperatureFeatures.includes(feature) &&
    !vibrationFeatures.includes(feature),
);

const featureTransformationSteps = [
  `Temperature → ${temperatureFeatures.map((feature) => feature.name).join(", ")}`,
  `Vibration → ${vibrationFeatures.map((feature) => feature.name).join(", ")}`,
  `Engineering relationships → ${engineeringFeatures
    .map((feature) => feature.name)
    .join(", ")}`,
] as const;

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
        P-101 is a fictional, synthetic teaching fixture. Its signals and
        engineered relationships are not field evidence.
      </p>
    </>
  );
}

function FeatureTechnicalFigure({ children }: ComponentProps<"pre">) {
  if (textFromNode(children).includes("Residual =")) {
    return (
      <figure
        aria-label="Residual Intelligence equation"
        className="diagram-figure methods-equation"
      >
        <h2 className="diagram-figure__title">Residual Intelligence</h2>
        <p>
          <code>Residual = Physical Measurement − Digital Twin Prediction</code>
        </p>
        <figcaption>
          A readable technical definition, not a claim that the fictional P-101
          twin is implemented or validated.
        </figcaption>
      </figure>
    );
  }

  return (
    <FlowDiagram
      caption="Every transformation is derived from the canonical fictional P-101 signal and feature fixture; no additional measurement or feature is inferred."
      steps={featureTransformationSteps}
      title="P-101 feature transformation sequence"
    />
  );
}

export default function FeatureFactoryPage() {
  return (
    <article className="concept-publication methods-publication feature-factory-publication">
      <FeatureFactoryContent
        components={{ h1: PublicationHeading, pre: FeatureTechnicalFigure }}
      />

      <section className="concept-publication__direction">
        <p>Interpretation boundary</p>
        <h2>Traceable features are candidates, not conclusions</h2>
        <p>
          Feature provenance must bind sources, units, windows, code, and
          missing-data behavior. Performance remains conditional on operating
          regime, leakage controls, twin fidelity, and engineering validation.
          Feature generation may support a hypothesis; it does not establish
          causality.
        </p>
      </section>

      <nav
        aria-label="Related Feature Factory publications"
        className="concept-publication__related"
      >
        <p>Continue through the methods</p>
        <h2>Related publications</h2>
        <ul>
          <li>
            <PublicationLink href="/twin-capsule">Twin Capsule</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/algorithm-arena">
              Algorithm Arena
            </PublicationLink>
          </li>
          <li>
            <PublicationLink href="/experiment-fabric">
              Experiment Fabric
            </PublicationLink>
          </li>
        </ul>
      </nav>
    </article>
  );
}
