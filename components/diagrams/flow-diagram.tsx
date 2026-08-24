export interface FlowDiagramProps {
  readonly title: string;
  readonly caption?: string;
  readonly steps: readonly string[];
  readonly continuous?: boolean;
}

export function FlowDiagram({
  title,
  caption,
  steps,
  continuous = false,
}: FlowDiagramProps) {
  const sequence = (
    <ol
      className="diagram-flow__list"
      style={
        continuous
          ? {
              gridTemplateColumns: `repeat(${steps.length}, minmax(9rem, 1fr))`,
            }
          : undefined
      }
    >
      {steps.map((step, index) => (
        <li className="diagram-flow__step" key={`${index}-${step}`}>
          <span className="diagram-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <figure className="diagram-figure diagram-flow" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      {continuous ? (
        <div
          aria-label={`${title} ordered sequence`}
          className="diagram-sequence-region"
          role="region"
          tabIndex={0}
        >
          {sequence}
        </div>
      ) : (
        sequence
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
