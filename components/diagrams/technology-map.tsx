import type { Technology } from "@/lib/domain/types";

export interface TechnologyMapProps {
  readonly title: string;
  readonly caption?: string;
  readonly technologies: readonly Technology[];
}

export function TechnologyMap({
  title,
  caption,
  technologies,
}: TechnologyMapProps) {
  return (
    <figure className="diagram-figure technology-map" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <ul className="technology-map__categories">
        {technologies.map((technology) => (
          <li key={technology.id}>
            <section aria-label={technology.name}>
              <h3>{technology.name}</h3>
              <p>{technology.description}</p>
              <ul>
                {technology.items.map((candidate) => (
                  <li key={candidate.id}>{candidate.name}</li>
                ))}
              </ul>
            </section>
          </li>
        ))}
      </ul>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
