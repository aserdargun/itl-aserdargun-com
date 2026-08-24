export interface MaturityLevel {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface MaturityModelProps {
  readonly title: string;
  readonly caption?: string;
  readonly levels: readonly MaturityLevel[];
  readonly currentLevelId?: string;
}

export function MaturityModel({
  title,
  caption,
  levels,
  currentLevelId,
}: MaturityModelProps) {
  return (
    <figure className="diagram-figure maturity-model" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <ol className="maturity-model__levels">
        {levels.map((level, index) => {
          const isCurrent = currentLevelId === level.id;
          return (
            <li
              className={isCurrent ? "diagram-active-mark" : undefined}
              data-state={isCurrent ? "current" : "unmarked"}
              key={level.id}
            >
              <span className="diagram-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{level.title}</h3>
              <p>{level.description}</p>
              {isCurrent ? (
                <span className="diagram-state-label">Current level</span>
              ) : null}
            </li>
          );
        })}
      </ol>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
