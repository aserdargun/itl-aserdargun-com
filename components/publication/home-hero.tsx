const OPERATING_STAGES = [
  { title: "Physical asset", role: "Reality" },
  { title: "Digital twin", role: "Representation" },
  { title: "Isolated experiment lab", role: "Inquiry" },
  { title: "AI scientist", role: "Reasoning" },
  { title: "Evidence package", role: "Decision" },
] as const;

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

      <figure aria-label="The operating thesis" className="operating-thesis">
        <div className="operating-thesis__heading">
          <h2>The operating thesis</h2>
          <p>Figure 01</p>
        </div>
        <ol>
          {OPERATING_STAGES.map((stage, index) => (
            <li key={stage.title}>
              <span aria-hidden="true" className="operating-thesis__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="operating-thesis__stage">
                <strong>{stage.title}</strong>
                <span aria-hidden="true"> — </span>
                <span>{stage.role}</span>
              </span>
            </li>
          ))}
        </ol>
      </figure>
    </header>
  );
}
