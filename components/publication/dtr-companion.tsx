import { PublicationLink } from "@/components/publication/publication-link";

export function DtrCompanion({
  headingLevel = "h3",
}: {
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <aside className="pdt-companion" aria-label="DTR companion application">
      <p className="pdt-companion__label">Companion application / DTR</p>
      <Heading>Compare a twin prediction with a simulated outcome</Heading>
      <p>
        DTR — Digital Triplet Laboratory separates a simulated P-101 process,
        sensor observations, and an independent twin. Test three alternatives,
        review constraints, approve a candidate, apply it to the simulation, and
        compare the predicted and resulting behavior.
      </p>
      <p>
        DTR computes synthetic numerical experiments; ITL displays authored
        experiment fixtures. The applications have separate models and state,
        and their JSON exports are not interchangeable. DTR has no runtime AI or
        field connection; approval changes only its browser simulation.
      </p>
      <PublicationLink href="https://dtr.aserdargun.com/" target="_blank">
        Open DTR — Digital Triplet Laboratory
      </PublicationLink>
    </aside>
  );
}
