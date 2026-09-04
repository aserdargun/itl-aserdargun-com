import Link from "next/link";

import {
  FIELD_UPDATE_REVIEW,
  FIELD_UPDATE_SOURCES,
  TWIN_SYSTEM_LAYERS,
} from "@/lib/data/field-update";

export function FieldUpdate2026() {
  return (
    <section
      aria-labelledby="field-update-2026-title"
      className="field-update surface-dark"
    >
      <header className="field-update__intro">
        <p>
          Field update /{" "}
          <time dateTime={FIELD_UPDATE_REVIEW.dateTime}>
            {FIELD_UPDATE_REVIEW.dateLabel}
          </time>
        </p>
        <h2 id="field-update-2026-title">
          The twin is no longer only a model.
        </h2>
        <p>
          Current practice is converging on a governed system of data, context,
          orchestration, and actuation—joined by a traceable digital thread.
        </p>
      </header>

      <ol
        aria-label="Digital Twin System layers"
        className="field-update__layers"
      >
        {TWIN_SYSTEM_LAYERS.map((layer, index) => (
          <li data-phase-one={layer.phaseOneStatus} key={layer.id}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3>{layer.title}</h3>
            <p>{layer.summary}</p>
          </li>
        ))}
      </ol>

      <div className="field-update__boundary">
        <p>
          Industrial Twin Lab studies the first three layers.{" "}
          <strong>Actuation remains outside the Phase 1 boundary.</strong>
        </p>
        <nav aria-label="2026 field update links">
          <Link href="/architecture">Read the architecture</Link>
          <Link href="/research">Review the current research frontier</Link>
        </nav>
      </div>

      <div className="field-update__sources">
        <p>Sources / ledger</p>
        <ul>
          {FIELD_UPDATE_SOURCES.map((source) => (
            <li key={source.id}>
              <a
                aria-label={source.title + " (opens in a new tab)"}
                href={source.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>{source.title}</span>
                <time dateTime={source.dateTime}>{source.dateLabel}</time>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
