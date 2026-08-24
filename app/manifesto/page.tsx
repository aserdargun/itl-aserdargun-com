import Manifesto from "@/content/manifesto.mdx";
import { FlowDiagram } from "@/components/diagrams/flow-diagram";
import { MANIFESTO_PRINCIPLES } from "@/lib/content/registry";
import { publicationMetadata } from "@/lib/metadata";

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

export const metadata = publicationMetadata({
  pathname: "/manifesto",
  title: "Manifesto",
  description:
    "Twelve principles for isolated, evidence-led industrial machine intelligence.",
});

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
      <aside
        aria-label="Manifesto running index"
        className="manifesto-running-index"
      >
        <div className="manifesto-running-index__heading">
          <p>Running index</p>
          <p>{MANIFESTO_PRINCIPLES.length} principles</p>
        </div>
        <nav aria-label="Manifesto principles">
          <ol>
            {MANIFESTO_PRINCIPLES.map((principle) => {
              const number = String(principle.number).padStart(2, "0");
              return (
                <li key={principle.number}>
                  <a href={`#principle-${number}`}>
                    <span aria-hidden="true">{number}</span>
                    <span>{principle.title}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </aside>
      <Manifesto components={{ pre: MachineKnowledgeSequence }} />
    </article>
  );
}
