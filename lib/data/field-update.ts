export interface TwinSystemLayer {
  readonly id: "data" | "context" | "orchestration" | "actuation";
  readonly title: string;
  readonly summary: string;
  readonly architectureDetail: string;
  readonly phaseOneStatus: "inside" | "outside";
}

export interface FieldUpdateSource {
  readonly id: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly href: string;
}

export const TWIN_SYSTEM_LAYERS: readonly TwinSystemLayer[] = [
  {
    id: "data",
    title: "Data",
    summary: "Synchronized evidence",
    architectureDetail: "Synchronized signals + provenance",
    phaseOneStatus: "inside",
  },
  {
    id: "context",
    title: "Context",
    summary: "Asset + operating limits",
    architectureDetail: "Twin Capsule + operating envelope",
    phaseOneStatus: "inside",
  },
  {
    id: "orchestration",
    title: "Decision & process orchestration",
    summary: "Validated recommendation",
    architectureDetail: "AI Scientist + deterministic validation",
    phaseOneStatus: "inside",
  },
  {
    id: "actuation",
    title: "Actuation",
    summary: "Human-authorized execution",
    architectureDetail: "People, agents, or machines",
    phaseOneStatus: "outside",
  },
];

export const FIELD_UPDATE_SOURCES: readonly FieldUpdateSource[] = [
  {
    id: "dtc-digital-twin-system",
    title: "DTC Digital Twin System Framework",
    dateLabel: "25 Aug 2026",
    href: "https://www.digitaltwinconsortium.org/press-room/digital-twin-consortium-announces-the-digital-twin-system-framework/",
  },
  {
    id: "dtc-industrial-ai-agent-manifesto",
    title: "Industrial AI Agent Manifesto",
    dateLabel: "Feb 2026",
    href: "https://www.digitaltwinconsortium.org/2026/02/the-industrial-ai-agent-manifesto-governance-requirements-for-trustworthy-autonomous-operations/",
  },
  {
    id: "modelica-ssp-2",
    title: "Modelica SSP 2.0",
    dateLabel: "Jan 2025",
    href: "https://modelica.org/news/2025-01-08-ssp-20-released/",
  },
  {
    id: "eu-ai-act",
    title: "EU AI Act",
    dateLabel: "Applies 02 Aug 2026",
    href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32024R1689",
  },
  {
    id: "eu-data-act",
    title: "EU Data Act",
    dateLabel: "Applies 12 Sep 2025",
    href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2854",
  },
];
