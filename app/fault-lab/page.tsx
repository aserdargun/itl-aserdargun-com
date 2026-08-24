import type { ComponentProps } from "react";

import { FlowDiagram } from "@/components/diagrams/flow-diagram";
import { PublicationLink } from "@/components/publication/publication-link";
import FaultLabContent from "@/content/concepts/fault-lab.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import { SENSOR_AND_COMMUNICATION_FAULTS } from "@/lib/data/methods";
import { P101_TWIN } from "@/lib/data/p101";
import { publicationMetadata } from "@/lib/metadata";

const contentMeta = CONTENT_META["fault-lab"];

export const metadata = publicationMetadata({
  pathname: contentMeta.href,
  title: contentMeta.title,
  description: contentMeta.description,
});

function PublicationHeading(props: ComponentProps<"h1">) {
  return (
    <>
      <h1 {...props} />
      <p className="methods-fixture-disclosure">
        P-101 is a fictional, synthetic teaching fixture. The scenarios below
        are not field incidents or production observations.
      </p>
    </>
  );
}

function FaultScenarioCatalogue() {
  return (
    <figure
      aria-label="P-101 synthetic fault scenario catalogue"
      className="diagram-figure methods-fault-catalogue"
    >
      <h2 className="diagram-figure__title">
        P-101 synthetic fault scenario catalogue
      </h2>
      <section>
        <h3>Canonical machine failure modes</h3>
        <ul
          aria-label="Canonical P-101 failure modes"
          className="diagram-ledger-list"
        >
          {P101_TWIN.failureModes.map((failure) => (
            <li key={failure.id}>
              <span className="diagram-record-id">{failure.id}</span>
              <strong>{failure.name}</strong>
              <span>{failure.description}</span>
              <span>
                Affected signals: {failure.affectedSensorIds.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Sensor and communication faults</h3>
        <ul aria-label="Sensor and communication faults">
          {SENSOR_AND_COMMUNICATION_FAULTS.map((fault) => (
            <li key={fault.id}>{fault.name}</li>
          ))}
        </ul>
      </section>
      <figcaption>
        The machine list is sourced only from the canonical fictional P-101
        fixture. The four supplied input faults are separate from machine
        failure modes.
      </figcaption>
    </figure>
  );
}

function FaultEvidenceFigures() {
  return (
    <>
      <FlowDiagram
        caption="The isolated sequence examines model sensitivity. It neither injects a physical fault nor establishes real-world detection performance."
        steps={[
          "Normal Twin",
          "Fault Injection",
          "Synthetic Operating Scenario",
          "AI Model",
          "Detection Capability",
        ]}
        title="Synthetic fault evidence path"
      />
      <FaultScenarioCatalogue />
    </>
  );
}

export default function FaultLabPage() {
  return (
    <article className="concept-publication methods-publication fault-lab-publication">
      <FaultLabContent
        components={{ h1: PublicationHeading, pre: FaultEvidenceFigures }}
      />

      <section className="concept-publication__direction">
        <p>Qualification boundary</p>
        <h2>Simulation sensitivity is not field validity</h2>
        <p>
          Engineering review must document simulation validity, the domain gap,
          injection assumptions, provenance, limitations, and validation against
          physical evidence. These controlled scenarios are not field incidents;
          their only immediate claim is sensitivity to a declared model and
          injection configuration.
        </p>
      </section>

      <nav
        aria-label="Related Fault Laboratory publications"
        className="concept-publication__related"
      >
        <p>Continue through the evidence</p>
        <h2>Related publications</h2>
        <ul>
          <li>
            <PublicationLink href="/twin-capsule">Twin Capsule</PublicationLink>
          </li>
          <li>
            <PublicationLink href="/experiment-fabric">
              Experiment Fabric
            </PublicationLink>
          </li>
          <li>
            <PublicationLink href="/research">Research</PublicationLink>
          </li>
        </ul>
      </nav>
    </article>
  );
}
