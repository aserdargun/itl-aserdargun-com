import type { Evidence } from "@/lib/domain/types";

interface EvidenceMatrixBaseProps {
  readonly title: string;
  readonly caption?: string;
}

export interface EvidenceMatrixColumn {
  readonly id: string;
  readonly label: string;
}

export interface EvidenceMatrixRow {
  readonly id: string;
  readonly label: string;
  readonly values: readonly string[];
}

export type EvidenceMatrixProps = EvidenceMatrixBaseProps &
  (
    | {
        readonly evidence: readonly Evidence[];
        readonly columns?: never;
        readonly rows?: never;
      }
    | {
        readonly evidence?: never;
        readonly columns: readonly EvidenceMatrixColumn[];
        readonly rows: readonly EvidenceMatrixRow[];
      }
  );

const DEFAULT_COLUMNS: readonly EvidenceMatrixColumn[] = [
  { id: "summary", label: "Summary" },
  { id: "strength", label: "Strength" },
  { id: "origin", label: "Origin" },
];

const rowsFromEvidence = (
  evidence: readonly Evidence[],
): readonly EvidenceMatrixRow[] =>
  evidence.map((item) => ({
    id: item.id,
    label: item.id,
    values: [
      item.summary,
      item.strength,
      item.synthetic ? "Synthetic fixture" : "Recorded evidence",
    ],
  }));

export function EvidenceMatrix(props: EvidenceMatrixProps) {
  const { title, caption } = props;
  const columns = props.columns ?? DEFAULT_COLUMNS;
  const rows = props.rows ?? rowsFromEvidence(props.evidence);
  const rowHeading = props.columns ? "Hypothesis" : "Evidence";

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
              <th scope="col">{rowHeading}</th>
              {columns.map((column) => (
                <th key={column.id} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => (
                  <td key={`${row.id}-${columns[index]?.id ?? index}`}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
