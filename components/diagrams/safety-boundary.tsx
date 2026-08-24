export type SafetyBoundaryKind = "isolation" | "safety" | "human";

export interface SafetyZone {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly boundary?: SafetyBoundaryKind;
}

export interface SafetyBoundaryProps {
  readonly title: string;
  readonly caption?: string;
  readonly zones: readonly SafetyZone[];
}

export function SafetyBoundary({ title, caption, zones }: SafetyBoundaryProps) {
  return (
    <figure className="diagram-figure safety-boundary" aria-label={title}>
      <h2 className="diagram-figure__title">{title}</h2>
      <section className="diagram-legend" aria-label="Diagram notation">
        <p className="diagram-legend__title">Diagram notation</p>
        <ul>
          <li>
            <span
              className="diagram-legend__symbol diagram-legend__symbol--flow"
              aria-hidden="true"
            />
            <span>Solid line = directional flow</span>
          </li>
          <li>
            <span
              className="diagram-legend__symbol diagram-legend__symbol--isolation"
              aria-hidden="true"
            />
            <span>Dashed boundary = isolated experiment zone</span>
          </li>
          <li>
            <span
              className="diagram-legend__symbol diagram-legend__symbol--stop"
              aria-hidden="true"
            />
            <span>
              Signal-orange stop marker = human authority / safety boundary
            </span>
          </li>
        </ul>
      </section>
      <ol className="safety-boundary__zones">
        {zones.map((zone, index) => (
          <li
            className="safety-boundary__zone"
            data-boundary={zone.boundary}
            data-next-boundary={zones[index + 1]?.boundary}
            key={zone.id}
          >
            {zone.boundary === "human" ? (
              <span className="safety-boundary__human-stop" aria-hidden="true">
                <span className="safety-boundary__human-connector" />
                <span className="safety-boundary__human-stop-bar" />
              </span>
            ) : null}
            <section aria-label={zone.title}>
              <span className="diagram-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{zone.title}</h3>
              <p>{zone.description}</p>
              {zone.boundary === "isolation" ? (
                <p className="safety-boundary__label">
                  Isolated experiment zone
                </p>
              ) : null}
              {zone.boundary === "safety" ? (
                <p className="safety-boundary__label">Safety boundary</p>
              ) : null}
              {zone.boundary === "human" ? (
                <p className="safety-boundary__label">Human validation gate</p>
              ) : null}
            </section>
          </li>
        ))}
      </ol>
      <div className="safety-boundary__text-equivalent">
        <p>
          Experimentation is isolated from operational control. There is no
          direct control path from AI or an experiment result to the physical
          machine or OT Control.
        </p>
        <p>
          Human engineering review remains in command of every physical-machine
          decision.
        </p>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
