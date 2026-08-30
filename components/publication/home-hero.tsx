import { TWIN_SYSTEM_LAYERS } from "@/lib/data/field-update";

export function HomeHero() {
  return (
    <header className="home-hero">
      <div className="home-hero__statement">
        <h1>Industrial Twin Lab</h1>
        <span aria-hidden="true" className="home-hero__signal" />
        <p className="home-hero__thesis">
          Build machine intelligence in the twin before trusting it in the
          machine.
        </p>
        <p className="home-hero__deck">
          An isolated experimentation environment for digital twins, industrial
          AI, simulation, and evidence-driven machine intelligence.
        </p>
      </div>

      <figure
        aria-label="Twin system research boundary"
        className="twin-system-hero"
      >
        <div className="twin-system-hero__heading">
          <h2>Twin system / research boundary</h2>
          <p>
            Field update / <time dateTime="2026-08-25">25 Aug 2026</time>
          </p>
        </div>
        <ol>
          {TWIN_SYSTEM_LAYERS.map((layer, index) => (
            <li data-phase-one={layer.phaseOneStatus} key={layer.id}>
              <span aria-hidden="true" className="twin-system-hero__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.summary}</p>
              {layer.phaseOneStatus === "outside" ? (
                <span className="twin-system-hero__stop">
                  Phase 1 stops here
                </span>
              ) : null}
            </li>
          ))}
        </ol>
        <figcaption>Digital thread / traceability</figcaption>
      </figure>
    </header>
  );
}
