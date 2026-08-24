export interface KnowledgeFlywheelProps {
  readonly title: string;
  readonly caption?: string;
  readonly steps: readonly string[];
}

export function KnowledgeFlywheel({
  title,
  caption,
  steps,
}: KnowledgeFlywheelProps) {
  return (
    <figure className="diagram-figure knowledge-flywheel" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <ol className="knowledge-flywheel__cycle">
        {steps.map((step, index) => (
          <li key={`${index}-${step}`}>
            <span className="diagram-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="knowledge-flywheel__continuation">
        The ordered cycle continues from the final step to the first.
      </p>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
