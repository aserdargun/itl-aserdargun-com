import type { MetricResult } from "@/lib/domain/types";

export interface MetricComparisonProps {
  readonly metrics: readonly MetricResult[];
}

export function MetricComparison({ metrics }: MetricComparisonProps) {
  return (
    <div
      aria-label="Synthetic fixture metrics, scroll horizontally to inspect all columns"
      className="experiment-metrics__region"
      role="region"
      tabIndex={0}
    >
      <table
        aria-label="Synthetic fixture metrics"
        className="experiment-metrics"
      >
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col">Synthetic fixture result</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => (
            <tr key={metric.id}>
              <th scope="row">{metric.label}</th>
              <td>{metric.displayValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
