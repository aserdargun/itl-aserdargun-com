import type { ManifestoPrinciple } from "@/lib/content/types";

interface ManifestoPrinciplesProps {
  readonly principles: readonly ManifestoPrinciple[];
}

export function ManifestoPrinciples({ principles }: ManifestoPrinciplesProps) {
  return (
    <ol aria-label="Selected manifesto principles" className="clause-list">
      {principles.map((principle) => (
        <li key={principle.number}>
          <span aria-hidden="true" className="clause-list__number">
            {String(principle.number).padStart(2, "0")}
          </span>
          <h3>{principle.title}</h3>
        </li>
      ))}
    </ol>
  );
}
