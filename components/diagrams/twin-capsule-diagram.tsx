import type { Quantity, TwinCapsule } from "@/lib/domain/types";

export interface TwinCapsuleDiagramProps {
  readonly title: string;
  readonly caption?: string;
  readonly twin: TwinCapsule;
}

const formatQuantity = ({ value, unit }: Quantity) => `${value} ${unit}`;

const formatMetadataValue = (value: string | Quantity) =>
  typeof value === "string" ? value : formatQuantity(value);

export function TwinCapsuleDiagram({
  title,
  caption,
  twin,
}: TwinCapsuleDiagramProps) {
  return (
    <figure className="diagram-figure twin-capsule" aria-label={title}>
      <div className="twin-capsule__heading">
        <h2 className="diagram-figure__title">{title}</h2>
        <p className="twin-capsule__version">{twin.version}</p>
      </div>

      <section
        className="twin-capsule__section"
        aria-labelledby={`${twin.id}-identity`}
      >
        <h3 id={`${twin.id}-identity`}>Asset identity</h3>
        <dl className="technical-ledger">
          <div>
            <dt>Asset ID</dt>
            <dd>{twin.asset.id}</dd>
          </div>
          <div>
            <dt>Asset</dt>
            <dd>{twin.asset.name}</dd>
          </div>
          <div>
            <dt>Type</dt>
            <dd>{twin.asset.assetType}</dd>
          </div>
          <div>
            <dt>Driver</dt>
            <dd>{twin.asset.driver}</dd>
          </div>
          <div>
            <dt>Description</dt>
            <dd>{twin.asset.description}</dd>
          </div>
          <div>
            <dt>Hierarchy</dt>
            <dd>{twin.asset.hierarchy.join(" → ")}</dd>
          </div>
          {Object.entries(twin.asset.engineeringMetadata).map(
            ([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formatMetadataValue(value)}</dd>
              </div>
            ),
          )}
        </dl>
      </section>

      <section
        className="twin-capsule__section"
        aria-labelledby={`${twin.id}-features`}
      >
        <h3 id={`${twin.id}-features`}>Features</h3>
        <ul className="diagram-ledger-list">
          {twin.features.map((feature) => (
            <li key={feature.id}>
              <strong>{feature.name}</strong>
              <span>{feature.description}</span>
              <span>
                {feature.featureSet}; sources:{" "}
                {feature.sourceSignalIds.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="twin-capsule__section"
        aria-labelledby={`${twin.id}-sensors`}
      >
        <h3 id={`${twin.id}-sensors`}>Signals</h3>
        <div
          className="diagram-table-region"
          role="region"
          aria-label="Twin Capsule signals, scroll horizontally to inspect all columns"
          tabIndex={0}
        >
          <table className="diagram-table">
            <thead>
              <tr>
                <th scope="col">Signal</th>
                <th scope="col">Quantity</th>
                <th scope="col">Location</th>
                <th scope="col">Nominal fixture value</th>
              </tr>
            </thead>
            <tbody>
              {twin.sensors.map((sensor) => (
                <tr key={sensor.id}>
                  <th scope="row">{sensor.name}</th>
                  <td>{sensor.quantity}</td>
                  <td>{sensor.location}</td>
                  <td>{formatQuantity(sensor.nominalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="twin-capsule__section"
        aria-labelledby={`${twin.id}-envelope`}
      >
        <h3 id={`${twin.id}-envelope`}>Operating envelope</h3>
        <dl className="technical-ledger">
          {Object.entries(twin.operatingEnvelope).map(([label, quantity]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{formatQuantity(quantity)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className="twin-capsule__section"
        aria-labelledby={`${twin.id}-failure-modes`}
      >
        <h3 id={`${twin.id}-failure-modes`}>Failure modes</h3>
        <ul className="diagram-ledger-list">
          {twin.failureModes.map((failureMode) => (
            <li key={failureMode.id}>
              <strong>{failureMode.name}</strong>
              <span>{failureMode.description}</span>
              <span>
                Affected signals: {failureMode.affectedSensorIds.join(", ")}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="twin-capsule__section twin-capsule__safety"
        aria-labelledby={`${twin.id}-safety`}
      >
        <h3 id={`${twin.id}-safety`}>Safety constraints</h3>
        <ul>
          {twin.safetyConstraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
      </section>

      <section
        className="twin-capsule__section"
        aria-labelledby={`${twin.id}-provenance`}
      >
        <h3 id={`${twin.id}-provenance`}>Provenance and disclosure</h3>
        <dl className="technical-ledger">
          <div>
            <dt>Asset version</dt>
            <dd>{twin.provenance.assetVersion}</dd>
          </div>
          <div>
            <dt>Twin version</dt>
            <dd>{twin.provenance.twinVersion}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{twin.provenance.source}</dd>
          </div>
          <div>
            <dt>Origin</dt>
            <dd>
              {twin.provenance.synthetic
                ? "Fictional / synthetic fixture"
                : "Recorded source"}
            </dd>
          </div>
        </dl>
        <p className="diagram-disclosure">{twin.provenance.statement}</p>
      </section>

      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
