import { TWIN_SYSTEM_LAYERS } from "@/lib/data/field-update";

export function DigitalTwinSystemBoundary() {
  return (
    <figure
      aria-labelledby="digital-twin-system-title"
      className="digital-twin-system-boundary"
    >
      <h2 id="digital-twin-system-title">
        Digital Twin System / ITL research boundary
      </h2>
      <ol aria-label="Digital Twin System architecture layers">
        {TWIN_SYSTEM_LAYERS.map((layer, index) => (
          <li data-phase-one={layer.phaseOneStatus} key={layer.id}>
            <span
              aria-hidden="true"
              className="digital-twin-system-boundary__number"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{layer.title}</h3>
            <p>{layer.architectureDetail}</p>
            {layer.phaseOneStatus === "outside" ? (
              <span className="digital-twin-system-boundary__stop">
                Human authority / Phase 1 out of scope
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="digital-twin-system-boundary__thread">
        Digital thread / traceability
      </div>
      <p className="digital-twin-system-boundary__note">
        ITL Phase 1 has no control path. Evidence may be reviewed; actuation is
        not implemented or authorized.
      </p>
      <figcaption>
        The 25 August 2026 four-layer Digital Twin System framing is used here
        as comparison context. Industrial Twin Lab deliberately ends its static
        research demonstrator before actuation.
      </figcaption>
    </figure>
  );
}
