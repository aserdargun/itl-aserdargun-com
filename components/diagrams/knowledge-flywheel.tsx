export interface KnowledgeFlywheelProps {
  readonly title: string;
  readonly caption?: string;
  readonly steps: readonly string[];
  readonly continuous?: boolean;
}

export function KnowledgeFlywheel({
  title,
  caption,
  steps,
  continuous = false,
}: KnowledgeFlywheelProps) {
  const sequence = (
    <ol
      className="knowledge-flywheel__cycle"
      style={
        continuous
          ? {
              gridTemplateColumns: `repeat(${steps.length}, minmax(8rem, 1fr))`,
            }
          : undefined
      }
    >
      {steps.map((step, index) => (
        <li key={`${index}-${step}`}>
          <span className="diagram-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <figure className="diagram-figure knowledge-flywheel" aria-label={title}>
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
      <p className="knowledge-flywheel__continuation">
        The ordered cycle continues from the final step to the first.
      </p>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
