import { readFileSync } from "node:fs";

import "@testing-library/jest-dom/vitest";

import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AssetHierarchy } from "@/components/diagrams/asset-hierarchy";
import { EvidenceMatrix } from "@/components/diagrams/evidence-matrix";
import { EvidencePackage } from "@/components/diagrams/evidence-package";
import { ExperimentAnatomy } from "@/components/diagrams/experiment-anatomy";
import { FlowDiagram } from "@/components/diagrams/flow-diagram";
import { KnowledgeFlywheel } from "@/components/diagrams/knowledge-flywheel";
import { MaturityModel } from "@/components/diagrams/maturity-model";
import { SafetyBoundary } from "@/components/diagrams/safety-boundary";
import { TechnologyMap } from "@/components/diagrams/technology-map";
import { TwinCapsuleDiagram } from "@/components/diagrams/twin-capsule-diagram";
import { ARCHITECTURE_CATALOGUE } from "@/lib/data/architecture";
import { P101_TWIN } from "@/lib/data/p101";
import { TECHNOLOGIES } from "@/lib/data/technologies";
import {
  DEFAULT_DEMO_CONFIG,
  buildExperimentResult,
} from "@/lib/experiments/demo";

afterEach(cleanup);

describe("sequence diagrams", () => {
  it("renders a flow as a named, captioned ordered relationship", () => {
    render(
      <FlowDiagram
        title="Experiment flow"
        caption="Evidence moves in one direction."
        steps={["Machine", "Twin", "Evidence"]}
      />,
    );

    const figure = screen.getByRole("figure", { name: "Experiment flow" });
    expect(
      within(figure).getByText("Evidence moves in one direction."),
    ).toBeInTheDocument();
    expect(
      within(figure)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["01Machine", "02Twin", "03Evidence"]);
  });

  it("renders experiment anatomy with visible stage state independent of motion", () => {
    render(
      <ExperimentAnatomy
        title="Experiment anatomy"
        activeStageId="validation"
        stages={[
          {
            id: "hypothesis",
            title: "Hypothesis",
            description: "State the claim.",
          },
          {
            id: "validation",
            title: "Validation",
            description: "Test the claim.",
          },
        ]}
      />,
    );

    const figure = screen.getByRole("figure", { name: "Experiment anatomy" });
    expect(within(figure).getAllByRole("listitem")).toHaveLength(2);
    const activeLabel = within(figure).getByText("Active stage");
    expect(activeLabel).toBeInTheDocument();
    expect(activeLabel.closest("li")).toHaveClass("diagram-active-mark");
  });

  it("keeps maturity and flywheel progression readable as numbered ordered cycles", () => {
    render(
      <>
        <MaturityModel
          title="Evidence maturity"
          currentLevelId="validated"
          levels={[
            {
              id: "observed",
              title: "Observed",
              description: "Record the condition.",
            },
            {
              id: "validated",
              title: "Validated",
              description: "Reproduce the evidence.",
            },
          ]}
        />
        <KnowledgeFlywheel
          title="Knowledge flywheel"
          steps={["Observe", "Experiment", "Validate", "Decide"]}
        />
      </>,
    );

    const maturity = screen.getByRole("figure", { name: "Evidence maturity" });
    expect(within(maturity).getAllByRole("listitem")).toHaveLength(2);
    expect(within(maturity).getByText("Current level")).toBeInTheDocument();

    const flywheel = screen.getByRole("figure", { name: "Knowledge flywheel" });
    expect(
      within(flywheel)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["01Observe", "02Experiment", "03Validate", "04Decide"]);
    expect(within(flywheel).getByText(/cycle continues/i)).toBeInTheDocument();
  });
});

describe("architecture structures", () => {
  it("renders both canonical architecture primitives from one catalogue", () => {
    render(
      <>
        <FlowDiagram
          title="Canonical architecture flow"
          steps={ARCHITECTURE_CATALOGUE.flow}
        />
        <SafetyBoundary
          title="Canonical architecture zones"
          zones={ARCHITECTURE_CATALOGUE.zones}
        />
      </>,
    );

    const flow = screen.getByRole("figure", {
      name: "Canonical architecture flow",
    });
    expect(
      within(flow)
        .getAllByRole("listitem")
        .map((item) => item.textContent?.replace(/^\d{2}/u, "")),
    ).toEqual([...ARCHITECTURE_CATALOGUE.flow]);

    const zones = screen.getByRole("figure", {
      name: "Canonical architecture zones",
    });
    expect(
      within(zones)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(ARCHITECTURE_CATALOGUE.zones.map((zone) => zone.title));
  });

  it("renders an asset hierarchy as nested lists in source order", () => {
    render(
      <AssetHierarchy
        title="P-101 asset hierarchy"
        caption="From enterprise to component."
        levels={P101_TWIN.asset.hierarchy}
      />,
    );

    const figure = screen.getByRole("figure", {
      name: "P-101 asset hierarchy",
    });
    expect(within(figure).getAllByRole("list")).toHaveLength(6);
    expect(
      within(figure)
        .getAllByRole("listitem")
        .map((item) => item.firstChild?.textContent),
    ).toEqual([
      "Enterprise",
      "Fleet",
      "Plant",
      "System",
      "Machine",
      "Component",
    ]);
  });

  it("orders safety zones and states isolation plus human authority in text", () => {
    render(
      <SafetyBoundary
        title="Industrial Twin Lab safety boundary"
        caption="A read-only evidence path."
        zones={[
          {
            id: "ot",
            title: "OT Control",
            description: "Physical control remains separate.",
            boundary: "safety",
          },
          {
            id: "data",
            title: "Data Access",
            description: "Read-oriented access.",
          },
          { id: "twin", title: "Twin", description: "Bounded representation." },
          {
            id: "experiment",
            title: "AI Experiment",
            description: "Isolated inquiry.",
            boundary: "isolation",
          },
          {
            id: "gate",
            title: "Validation Gate",
            description: "Human review.",
            boundary: "human",
          },
          {
            id: "inference",
            title: "Approved Inference",
            description: "Scoped output.",
          },
        ]}
      />,
    );

    const figure = screen.getByRole("figure", {
      name: "Industrial Twin Lab safety boundary",
    });
    expect(
      within(figure)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "OT Control",
      "Data Access",
      "Twin",
      "AI Experiment",
      "Validation Gate",
      "Approved Inference",
    ]);
    const textEquivalent = figure.querySelector(
      ".safety-boundary__text-equivalent",
    );
    expect(textEquivalent).toHaveTextContent(/no direct control path/i);
    expect(textEquivalent).toHaveTextContent(
      /human engineering review remains in command/i,
    );
  });

  it("publishes a visible semantic legend for every diagram notation", () => {
    render(
      <SafetyBoundary
        title="Safety notation"
        zones={[
          {
            id: "experiment",
            title: "AI Experiment",
            description: "Isolated inquiry.",
            boundary: "isolation",
          },
          {
            id: "gate",
            title: "Validation Gate",
            description: "Human review.",
            boundary: "human",
          },
        ]}
      />,
    );

    const legend = screen.getByRole("region", { name: "Diagram notation" });
    expect(legend).toBeVisible();
    expect(
      within(legend)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual([
      "Solid line = directional flow",
      "Dashed boundary = isolated experiment zone",
      "Signal-orange stop marker = human authority / safety boundary",
    ]);
    expect(legend.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  });

  it("ends the human-gate connector at a 12px perpendicular stop bar", () => {
    const styles = readFileSync("app/globals.css", "utf8").replace(
      '@import "tailwindcss";',
      "",
    );
    render(
      <>
        <style>{styles}</style>
        <SafetyBoundary
          title="Human gate notation"
          zones={[
            {
              id: "experiment",
              title: "AI Experiment",
              description: "Isolated inquiry.",
              boundary: "isolation",
            },
            {
              id: "gate",
              title: "Validation Gate",
              description: "Human review.",
              boundary: "human",
            },
          ]}
        />
      </>,
    );

    const gate = screen.getByRole("region", { name: "Validation Gate" });
    const humanZone = gate.closest("li");
    const precedingZone = humanZone?.previousElementSibling;
    const marker = humanZone?.querySelector<HTMLElement>(
      ".safety-boundary__human-stop",
    );
    const connector = marker?.querySelector<HTMLElement>(
      ".safety-boundary__human-connector",
    );
    const stopBar = marker?.querySelector<HTMLElement>(
      ".safety-boundary__human-stop-bar",
    );

    expect(precedingZone).toHaveAttribute("data-next-boundary", "human");
    expect(marker).toHaveAttribute("aria-hidden", "true");
    expect(getComputedStyle(connector!).height).toBe("1px");
    expect(getComputedStyle(stopBar!).width).toBe("2px");
    expect(getComputedStyle(stopBar!).height).toBe("12px");
    expect(styles).not.toContain(
      '.safety-boundary__zone[data-boundary="human"]::before',
    );
  });

  it("renders every technology category and candidate as nested semantic lists", () => {
    render(
      <TechnologyMap
        title="Candidate technology map"
        technologies={TECHNOLOGIES}
      />,
    );

    const figure = screen.getByRole("figure", {
      name: "Candidate technology map",
    });
    expect(within(figure).getAllByRole("heading", { level: 3 })).toHaveLength(
      9,
    );
    expect(within(figure).getByText("OPC UA")).toBeInTheDocument();
    expect(within(figure).getByText("Grafana")).toBeInTheDocument();
  });
});

describe("P-101 evidence primitives", () => {
  it("preserves exact Twin Capsule identity, units, provenance, disclosure, and human authority", () => {
    render(<TwinCapsuleDiagram title="P-101 Twin Capsule" twin={P101_TWIN} />);

    const figure = screen.getByRole("figure", { name: "P-101 Twin Capsule" });
    expect(
      within(figure).getByText("Boiler Feed Water Pump P-101"),
    ).toBeInTheDocument();
    expect(
      within(figure).getByText("P-101", { exact: true }),
    ).toBeInTheDocument();
    expect(within(figure).getByText("Centrifugal Pump")).toBeInTheDocument();
    expect(within(figure).getByText("Electric Motor")).toBeInTheDocument();
    expect(
      within(figure).getByText(
        "Enterprise → Fleet → Plant → System → Machine → Component",
      ),
    ).toBeInTheDocument();
    expect(within(figure).getByText("Twin Residual")).toBeInTheDocument();
    expect(within(figure).getAllByText("240 m³/h")).toHaveLength(2);
    expect(within(figure).getByText("114 bar")).toBeInTheDocument();
    expect(within(figure).getAllByText("TWIN-P101-0.1.0")).toHaveLength(2);
    expect(
      within(figure).getAllByText(P101_TWIN.provenance.statement),
    ).toHaveLength(2);
    expect(
      within(figure).getByText(
        "Human engineering review is required before any physical-machine decision.",
      ),
    ).toBeInTheDocument();
  });

  it("renders complete named P-101 records and explicit unavailable model boundaries", () => {
    render(<TwinCapsuleDiagram title="P-101 Twin Capsule" twin={P101_TWIN} />);

    const figure = screen.getByRole("figure", { name: "P-101 Twin Capsule" });
    const signals = within(figure).getByRole("table", {
      name: "Twin Capsule signals",
    });
    expect(within(signals).getAllByRole("columnheader")).toHaveLength(6);
    expect(within(signals).getAllByRole("row")).toHaveLength(12);
    expect(within(signals).getByText("suction-pressure")).toBeInTheDocument();
    expect(within(signals).getAllByText("bar", { exact: true })).toHaveLength(
      2,
    );

    const features = within(figure).getByRole("list", {
      name: "Twin Capsule features",
    });
    expect(within(features).getAllByRole("listitem")).toHaveLength(9);
    expect(within(features).getByText("pressure-ratio")).toBeInTheDocument();

    const failures = within(figure).getByRole("list", {
      name: "Twin Capsule failure modes",
    });
    expect(within(failures).getAllByRole("listitem")).toHaveLength(6);
    expect(
      within(failures).getByText("bearing-degradation"),
    ).toBeInTheDocument();

    const boundaries = within(figure).getByRole("region", {
      name: "Model availability, limitations, and uncertainty",
    });
    expect(within(boundaries).getByText("Not implemented")).toBeInTheDocument();
    expect(
      within(boundaries).getByText("Not validated in Phase 1"),
    ).toBeInTheDocument();
    expect(
      within(boundaries).getByText(
        "No physics model is implemented or validated in Phase 1.",
      ),
    ).toBeInTheDocument();
    expect(
      within(boundaries).getByRole("list", {
        name: "Twin Capsule limitations",
      }),
    ).toHaveTextContent(
      /not plant measurements or validated industrial evidence/u,
    );
    expect(within(boundaries).getByText("Unquantified")).toBeInTheDocument();
  });

  it("renders evidence as a named table with explicit synthetic origin", () => {
    const result = buildExperimentResult(DEFAULT_DEMO_CONFIG);
    render(
      <EvidenceMatrix
        title="P-101 hypothesis evidence matrix"
        caption="Evidence remains qualified by origin."
        evidence={result.evidence.evidence}
      />,
    );

    const table = screen.getByRole("table", {
      name: "P-101 hypothesis evidence matrix",
    });
    expect(
      within(table).getByRole("columnheader", { name: "Strength" }),
    ).toBeInTheDocument();
    expect(within(table).getByText("limited")).toBeInTheDocument();
    expect(within(table).getByText("Synthetic fixture")).toBeInTheDocument();
  });

  it("renders an Evidence Package ledger without dropping measurements or limitations", () => {
    const result = buildExperimentResult(DEFAULT_DEMO_CONFIG);
    render(
      <EvidencePackage
        title="P-101 Evidence Package"
        caption="A bounded decision record."
        evidencePackage={result.evidence}
      />,
    );

    const figure = screen.getByRole("figure", {
      name: "P-101 Evidence Package",
    });
    expect(within(figure).getByText("86 %")).toBeInTheDocument();
    expect(within(figure).getByText("0.9 alerts/month")).toBeInTheDocument();
    expect(within(figure).getAllByText("DATASET-P101-SYN-0.1.0")).toHaveLength(
      2,
    );
    expect(
      within(figure).getByText(
        "Synthetic fixture results do not establish plant performance.",
      ),
    ).toBeInTheDocument();
    expect(
      within(figure).getByText(
        "Deterministic synthetic fixture for conceptual comparison.",
      ),
    ).toBeInTheDocument();
    expect(within(figure).getByText("ASSET-P101-0.1.0")).toBeInTheDocument();
    expect(within(figure).getByText("FEATURES-P101-0.1.0")).toBeInTheDocument();
    expect(within(figure).getByText("bearing-degradation")).toBeInTheDocument();
    expect(
      within(figure).getByText(
        "Conceptual demonstration — synthetic fixture results.",
      ),
    ).toBeInTheDocument();
    expect(
      within(figure).getByText(/human engineer retains decision authority/i),
    ).toBeInTheDocument();
  });
});

describe("responsive and motion contracts", () => {
  it("defines mobile stacking, labeled matrix overflow, and reduced-motion active marks", () => {
    const styles = readFileSync("app/globals.css", "utf8");

    expect(styles).toMatch(
      /@media \(max-width: 719px\)[\s\S]*\.diagram-flow__list[\s\S]*grid-template-columns:\s*1fr/,
    );
    expect(styles).toMatch(
      /\.evidence-matrix__region[\s\S]*overflow-x:\s*auto/,
    );
    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.diagram-active-mark[\s\S]*animation:\s*none/,
    );
  });
});
