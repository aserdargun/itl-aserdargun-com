import type { ComponentProps } from "react";

import { EvidenceMatrix } from "@/components/diagrams/evidence-matrix";
import { PublicationLink } from "@/components/publication/publication-link";
import AlgorithmArenaContent from "@/content/concepts/algorithm-arena.mdx";
import { CONTENT_META } from "@/lib/content/registry";
import { ALGORITHM_SUITABILITY_FACTORS } from "@/lib/data/methods";
import { P101_TWIN } from "@/lib/data/p101";
import {
  buildExperimentResult,
  DEFAULT_DEMO_CONFIG,
} from "@/lib/experiments/demo";
import { publicationMetadata } from "@/lib/metadata";

const contentMeta = CONTENT_META["algorithm-arena"];
const p101Evidence = buildExperimentResult(DEFAULT_DEMO_CONFIG).evidence;

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
        P-101 is a fictional, synthetic teaching fixture. Its candidate results
        are not benchmark or plant evidence.
      </p>
    </>
  );
}

export default function AlgorithmArenaPage() {
  return (
    <article className="concept-publication methods-publication algorithm-arena-publication">
      <AlgorithmArenaContent components={{ h1: PublicationHeading }} />

      <EvidenceMatrix
        caption={`The open ledger uses the existing deterministic evidence for fictional ${P101_TWIN.asset.id}. Its limited, synthetic origin is a criterion to review, never a score that crowns a winner.`}
        evidence={p101Evidence.evidence}
        title="P-101 selection evidence criteria"
      />

      <section className="concept-publication__direction">
        <p>Human validation authority</p>
        <h2>Selection remains an engineering decision</h2>
        <p>
          Suitability depends on {ALGORITHM_SUITABILITY_FACTORS.join(", ")}. A
          human engineer selects and validates the candidate against the
          declared Evidence Package; the result is not a winner or leaderboard
          rank and grants no operational authority.
        </p>
      </section>

      <nav
        aria-label="Related Algorithm Arena publications"
        className="concept-publication__related"
      >
        <p>Continue through the evidence</p>
        <h2>Related publications</h2>
        <ul>
          <li>
            <PublicationLink href="/experiment-fabric">
              Experiment Fabric
            </PublicationLink>
          </li>
          <li>
            <PublicationLink href="/feature-factory">
              Feature Factory
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
