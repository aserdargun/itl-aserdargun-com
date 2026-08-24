export interface FlowDiagramProps {
  readonly title: string;
  readonly caption?: string;
  readonly steps: readonly string[];
}

export function FlowDiagram({ title, caption, steps }: FlowDiagramProps) {
  return (
    <figure className="diagram-figure diagram-flow" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <ol className="diagram-flow__list">
        {steps.map((step, index) => (
          <li className="diagram-flow__step" key={`${index}-${step}`}>
            <span className="diagram-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
