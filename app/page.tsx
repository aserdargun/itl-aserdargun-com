import { EvidencePackage } from "@/components/diagrams/evidence-package";
import { TwinCapsuleDiagram } from "@/components/diagrams/twin-capsule-diagram";
import { HomeHero } from "@/components/publication/home-hero";
import { FieldUpdate2026 } from "@/components/publication/field-update-2026";
import { ManifestoPrinciples } from "@/components/publication/manifesto-principles";
import { PublicationLink } from "@/components/publication/publication-link";
import { SectionHeading } from "@/components/publication/section-heading";
import { MANIFESTO_PRINCIPLES } from "@/lib/content/registry";
import { P101_TWIN } from "@/lib/data/p101";
import {
  buildExperimentResult,
  DEFAULT_DEMO_CONFIG,
} from "@/lib/experiments/demo";
import { publicationMetadata } from "@/lib/metadata";

export const metadata = publicationMetadata({
  pathname: "/",
  title: "Industrial Twin Lab",
  description:
    "Build machine intelligence in the twin before trusting it in the machine.",
});

const DEMONSTRATION_RESULT = buildExperimentResult(DEFAULT_DEMO_CONFIG);

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="home-thesis-band surface-dark">
        <div>
          <p aria-hidden="true" className="home-thesis-band__number">
            01
          </p>
          <h2>
            Never let AI perform its first experiment on the physical machine.
          </h2>
        </div>
        <ul>
          <li>Twin before intervention</li>
          <li>Human in command</li>
          <li>Evidence before deployment</li>
        </ul>
      </section>

      <FieldUpdate2026 />

      <section className="home-principles">
        <SectionHeading label="Selected principles / 12 total">
          A discipline for machine intelligence
        </SectionHeading>
        <ManifestoPrinciples principles={MANIFESTO_PRINCIPLES.slice(0, 3)} />
      </section>

      <section className="home-demonstration">
        <header className="home-demonstration__intro">
          <p>Demonstration asset</p>
          <h2>P-101 — Boiler Feed Water Pump</h2>
          <p>
            One fictional but engineering-realistic centrifugal pump connects
            the manifesto, Twin Capsule, experiments, fault laboratory, and AI
            Scientist. It is a synthetic teaching fixture, not a physical
            installation or source of plant evidence.
          </p>
        </header>

        <div className="home-demonstration__plates">
          <TwinCapsuleDiagram
            caption="A versioned fictional machine record with eleven named signals, six failure modes, explicit safety constraints, and source-aware provenance."
            title="P-101 Twin Capsule"
            twin={P101_TWIN}
          />
          <EvidencePackage
            caption="A deterministic conceptual package for review, not production evidence or authorization to intervene."
            evidencePackage={DEMONSTRATION_RESULT.evidence}
            title="P-101 Evidence Package"
          />
        </div>
      </section>

      <section className="home-closing-statement">
        <span aria-hidden="true" />
        <h2>Evidence-backed machine knowledge.</h2>
        <p>
          The primary output is defensible machine knowledge: a reproducible
          body of evidence that an engineer can inspect, challenge, and
          govern—not a model score or autonomous act.
        </p>
        <PublicationLink href="/manifesto">
          Continue to the manifesto
          <span aria-hidden="true" className="home-closing-statement__arrow">
            →
          </span>
        </PublicationLink>
      </section>
    </>
  );
}
