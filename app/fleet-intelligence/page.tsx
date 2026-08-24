import { isValidElement, type ComponentProps, type ReactNode } from "react";

import { FlowDiagram } from "@/components/diagrams/flow-diagram";
import { KnowledgeFlywheel } from "@/components/diagrams/knowledge-flywheel";
import { PublicationLink } from "@/components/publication/publication-link";
import FleetIntelligenceContent from "@/content/concepts/fleet-intelligence.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import { FLEET_INTELLIGENCE_CATALOGUE } from "@/lib/data/intelligence";
import { publicationMetadata } from "@/lib/metadata";

const contentMeta = CONTENT_META["fleet-intelligence"];

export const metadata = publicationMetadata({
  pathname: contentMeta.href,
  title: contentMeta.title,
  description: contentMeta.description,
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

function FleetProtocolFigure() {
  const { protocol } = FLEET_INTELLIGENCE_CATALOGUE;

  return (
    <figure
      aria-label="Conceptual leave-one-asset-out protocol"
      className="diagram-figure intelligence-protocol"
    >
      <h2 className="diagram-figure__title">
        Conceptual leave-one-asset-out protocol
      </h2>
      <dl className="intelligence-protocol__ledger">
        <div>
          <dt>{protocol.trainLabel}</dt>
          <dd>{protocol.trainAssets}</dd>
        </div>
        <div>
          <dt>{protocol.testLabel}</dt>
          <dd>{protocol.testAsset}</dd>
        </div>
      </dl>
      <p className="diagram-disclosure">{protocol.qualification}</p>
      <figcaption>
        The target asset stays outside training so portability is tested against
        a named local machine rather than inferred from a mixed population.
      </figcaption>
    </figure>
  );
}

function FleetFigure({ children, ...preProps }: ComponentProps<"pre">) {
  const marker = textFromNode(children).trim();

  if (marker.includes("fleet-intelligence-hierarchy-figure")) {
    return (
      <FlowDiagram
        caption="Evidence may be organized across these nested scopes, but every move outward requires a new generalization claim and every move inward requires local validation."
        continuous
        steps={FLEET_INTELLIGENCE_CATALOGUE.hierarchy}
        title="Fleet intelligence asset hierarchy"
      />
    );
  }

  if (marker.includes("leave-one-asset-out-protocol-figure")) {
    return <FleetProtocolFigure />;
  }

  if (marker.includes("knowledge-flywheel-figure")) {
    return (
      <KnowledgeFlywheel
        caption="The ordered cycle preserves successful and failed replication evidence. Human owners decide whether the next asset-local experiment is warranted."
        continuous
        steps={FLEET_INTELLIGENCE_CATALOGUE.knowledgeFlywheel}
        title="Knowledge Flywheel"
      />
    );
  }

  return (
    <pre data-publication-code {...preProps}>
      {children}
    </pre>
  );
}

export default function FleetIntelligencePage() {
  return (
    <article className="concept-publication intelligence-publication fleet-intelligence-publication">
      <FleetIntelligenceContent components={{ pre: FleetFigure }} />

      <section className="concept-publication__direction">
        <p>Local authority retained</p>
        <h2>Fleet evidence proposes; each asset validates</h2>
        <p>
          Population findings can prioritize a local experiment. They cannot
          silently replace target-machine evidence, engineering review, or the
          asset owner’s operational authority.
        </p>
      </section>

      <nav
        aria-label="Related Fleet Intelligence publications"
        className="concept-publication__related"
      >
        <p>Continue through the evidence</p>
        <h2>Related publications</h2>
        <ul>
          <li>
            <PublicationLink href="/ai-scientist">AI Scientist</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/twin-capsule">Twin Capsule</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/research">Research</PublicationLink>
          </li>
        </ul>
      </nav>
    </article>
  );
}
