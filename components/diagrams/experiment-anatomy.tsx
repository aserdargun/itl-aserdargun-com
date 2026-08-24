export interface ExperimentStage {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface ExperimentAnatomyProps {
  readonly title: string;
  readonly caption?: string;
  readonly stages: readonly ExperimentStage[];
  readonly activeStageId?: string;
}

export function ExperimentAnatomy({
  title,
  caption,
  stages,
  activeStageId,
}: ExperimentAnatomyProps) {
  return (
    <figure className="diagram-figure experiment-anatomy" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <ol className="diagram-flow__list experiment-anatomy__list">
        {stages.map((stage, index) => {
          const isActive = activeStageId === stage.id;
          return (
            <li
              className={
                isActive
                  ? "diagram-flow__step diagram-active-mark"
                  : "diagram-flow__step"
              }
              data-state={isActive ? "active" : "idle"}
              key={stage.id}
            >
              <span className="diagram-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              {isActive ? (
                <span className="diagram-state-label">Active stage</span>
              ) : null}
            </li>
          );
        })}
      </ol>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
