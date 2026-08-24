import type { Evidence } from "@/lib/domain/types";

export interface EvidenceMatrixProps {
  readonly title: string;
  readonly caption?: string;
  readonly evidence: readonly Evidence[];
}

export function EvidenceMatrix({
  title,
  caption,
  evidence,
}: EvidenceMatrixProps) {
  return (
    <figure className="diagram-figure evidence-matrix" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <div
        className="evidence-matrix__region"
        role="region"
        aria-label={`${title}, scroll horizontally to inspect all columns`}
        tabIndex={0}
      >
        <table className="diagram-table" aria-label={title}>
          <thead>
            <tr>
              <th scope="col">Evidence</th>
              <th scope="col">Summary</th>
              <th scope="col">Strength</th>
              <th scope="col">Origin</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.summary}</td>
                <td>{item.strength}</td>
                <td>
                  {item.synthetic ? "Synthetic fixture" : "Recorded evidence"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
