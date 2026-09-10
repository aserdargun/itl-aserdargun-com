import type { EvidencePackage as EvidencePackageData } from "@/lib/domain/types";

export interface EvidencePackageProps {
  readonly title: string;
  readonly caption?: string;
  readonly evidencePackage: EvidencePackageData;
}

export function EvidencePackage({
  title,
  caption,
  evidencePackage,
}: EvidencePackageProps) {
  const { dataset, provenance } = evidencePackage;

  return (
    <figure className="diagram-figure evidence-package" aria-label={title}>
      <div className="evidence-package__heading">
        <h2 className="diagram-figure__title">{title}</h2>
        <p>{evidencePackage.experimentId}</p>
      </div>

      {provenance.synthetic ? (
        <p className="diagram-disclosure">
          Conceptual demonstration — synthetic fixture results.
        </p>
      ) : null}

      <section aria-label="Hypothesis and assumptions">
        <h3>Hypothesis — not tested</h3>
        <p>{evidencePackage.hypothesis.statement}</p>
        <ul className="diagram-ledger-list">
          {evidencePackage.assumptions.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Replay identity">
        <h3>Replay identity</h3>
        <dl className="technical-ledger">
          <div>
            <dt>Behavior version</dt>
            <dd>{provenance.behaviorVersion}</dd>
          </div>
          <div>
            <dt>Experiment version</dt>
            <dd>{provenance.experimentVersion}</dd>
          </div>
          <div>
            <dt>World version</dt>
            <dd>{provenance.worldVersion}</dd>
          </div>
          <div>
            <dt>Metric version</dt>
            <dd>{provenance.metricVersion}</dd>
          </div>
          <div>
            <dt>Snapshot tick</dt>
            <dd>
              {provenance.tick} / {provenance.tickUnit}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-label="Experiment record">
        <h3>Experiment record</h3>
        <dl className="technical-ledger">
          <div>
            <dt>Model</dt>
            <dd>{evidencePackage.model.version}</dd>
          </div>
          <div>
            <dt>Model status</dt>
            <dd>{evidencePackage.model.status}</dd>
          </div>
          <div>
            <dt>Dataset</dt>
            <dd>{dataset.version}</dd>
          </div>
          <div>
            <dt>Feature set</dt>
            <dd>{evidencePackage.featureSet}</dd>
          </div>
          <div>
            <dt>Validation</dt>
            <dd>{evidencePackage.validationMethod}</dd>
          </div>
          <div>
            <dt>Twin version</dt>
            <dd>{provenance.twinVersion}</dd>
          </div>
          <div>
            <dt>Asset version</dt>
            <dd>{provenance.assetVersion}</dd>
          </div>
          <div>
            <dt>Dataset version</dt>
            <dd>{provenance.datasetVersion}</dd>
          </div>
          <div>
            <dt>Simulator version</dt>
            <dd>{provenance.simulatorVersion}</dd>
          </div>
          <div>
            <dt>Feature pipeline</dt>
            <dd>{provenance.featurePipelineVersion}</dd>
          </div>
          <div>
            <dt>Provenance model</dt>
            <dd>{provenance.modelVersion}</dd>
          </div>
          <div>
            <dt>Code version</dt>
            <dd>{provenance.codeVersion}</dd>
          </div>
          <div>
            <dt>Configured asset</dt>
            <dd>{provenance.experimentConfiguration.assetId}</dd>
          </div>
          <div>
            <dt>Problem</dt>
            <dd>{provenance.experimentConfiguration.problem}</dd>
          </div>
          <div>
            <dt>Configured feature set</dt>
            <dd>{provenance.experimentConfiguration.featureSet}</dd>
          </div>
          <div>
            <dt>Algorithm</dt>
            <dd>{provenance.experimentConfiguration.algorithm}</dd>
          </div>
          <div>
            <dt>Configured validation</dt>
            <dd>{provenance.experimentConfiguration.validation}</dd>
          </div>
          <div>
            <dt>Random seed</dt>
            <dd>{provenance.randomSeed}</dd>
          </div>
          <div>
            <dt>Timestamp label</dt>
            <dd>{provenance.timestampLabel}</dd>
          </div>
        </dl>
      </section>

      <section aria-label="Qualified evidence">
        <h3>Qualified evidence</h3>
        <div
          className="diagram-table-region"
          role="region"
          aria-label="Qualified evidence, scroll horizontally to inspect all columns"
          tabIndex={0}
        >
          <table className="diagram-table">
            <thead>
              <tr>
                <th scope="col">Evidence</th>
                <th scope="col">Summary</th>
                <th scope="col">Strength</th>
                <th scope="col">Origin</th>
              </tr>
            </thead>
            <tbody>
              {evidencePackage.evidence.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.id}</th>
                  <td>{item.summary}</td>
                  <td>{item.strength}</td>
                  <td>
                    {item.synthetic ? "Synthetic fixture" : "Recorded evidence"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="Metric results">
        <h3>Metric results</h3>
        <div
          className="diagram-table-region"
          role="region"
          aria-label="Evidence metrics, scroll horizontally to inspect all columns"
          tabIndex={0}
        >
          <table className="diagram-table">
            <thead>
              <tr>
                <th scope="col">Metric</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody>
              {evidencePackage.metrics.map((metric) => (
                <tr key={metric.id}>
                  <th scope="row">{metric.label}</th>
                  <td>{metric.displayValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="Operating regimes">
        <h3>Operating regimes</h3>
        <ul className="diagram-ledger-list">
          {evidencePackage.operatingRegimes.map((regime) => (
            <li key={regime}>{regime}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Limitations">
        <h3>Limitations</h3>
        <ul className="diagram-ledger-list">
          {evidencePackage.limitations.map((limitation) => (
            <li key={limitation}>{limitation}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Uncertainty, explainability, and provenance">
        <h3>Uncertainty, explainability, and provenance</h3>
        <dl className="technical-ledger">
          <div>
            <dt>Uncertainty</dt>
            <dd>{evidencePackage.uncertainty}</dd>
          </div>
          <div>
            <dt>Explainability</dt>
            <dd>{evidencePackage.explainability}</dd>
          </div>
          <div>
            <dt>Dataset source</dt>
            <dd>{dataset.provenance.source}</dd>
          </div>
          <div>
            <dt>Dataset disclosure</dt>
            <dd>{dataset.provenance.statement}</dd>
          </div>
          <div>
            <dt>Experiment source</dt>
            <dd>{provenance.source}</dd>
          </div>
          <div>
            <dt>Experiment disclosure</dt>
            <dd>{provenance.statement}</dd>
          </div>
          <div>
            <dt>Author agent</dt>
            <dd>{provenance.authorAgent}</dd>
          </div>
        </dl>
      </section>

      <p className="evidence-package__authority">
        Human engineer retains decision authority. This package does not
        authorize control, maintenance action, or safety certification.
      </p>
      <section aria-label="Separate authorities">
        <h3>Four separate authorities</h3>
        <dl className="technical-ledger">
          <div>
            <dt>Train a model</dt>
            <dd>
              Not performed. A future training run requires its own
              authorization.
            </dd>
          </div>
          <div>
            <dt>Recommend an action</dt>
            <dd>No operational recommendation is issued by this fixture.</dd>
          </div>
          <div>
            <dt>Approve an inference model</dt>
            <dd>
              Requires separate engineering review for a named model version and
              use.
            </dd>
          </div>
          <div>
            <dt>Change a physical setpoint</dt>
            <dd>
              Outside Phase 1. An inference approval never grants this
              authority.
            </dd>
          </div>
        </dl>
      </section>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
