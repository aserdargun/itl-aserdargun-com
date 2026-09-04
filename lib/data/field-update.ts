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
  readonly dateTime: string;
  readonly dateLabel: string;
  readonly href: string;
}

export const FIELD_UPDATE_REVIEW = {
  dateTime: "2026-09-04",
  dateLabel: "4 Sep 2026",
} as const;

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
    title: "Decision and process orchestration",
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
    dateTime: "2026-08-25",
    dateLabel: "25 Aug 2026",
    href: "https://www.digitaltwinconsortium.org/press-room/digital-twin-consortium-announces-the-digital-twin-system-framework/",
  },
  {
    id: "dtc-industrial-ai-agent-manifesto",
    title: "Industrial AI Agent Manifesto",
    dateTime: "2026-02-25",
    dateLabel: "25 Feb 2026",
    href: "https://www.digitaltwinconsortium.org/2026/02/the-industrial-ai-agent-manifesto-governance-requirements-for-trustworthy-autonomous-operations/",
  },
  {
    id: "modelica-3-7",
    title: "Modelica Specification 3.7",
    dateTime: "2026-07-07",
    dateLabel: "7 Jul 2026",
    href: "https://modelica.org/news/release-modelica-specification-3.7/",
  },
  {
    id: "modelica-ssp-2",
    title: "Modelica SSP 2.0",
    dateTime: "2025-01-08",
    dateLabel: "8 Jan 2025",
    href: "https://modelica.org/news/2025-01-08-ssp-20-released/",
  },
  {
    id: "eu-ai-act",
    title: "EU AI Act",
    dateTime: "2026-08-02",
    dateLabel: "General application 2 Aug 2026",
    href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32024R1689",
  },
  {
    id: "eu-ai-act-2026-amendment",
    title: "EU AI Act — 2026 amendment",
    dateTime: "2026-07-08",
    dateLabel: "8 Jul 2026",
    href: "https://eur-lex.europa.eu/eli/reg/2026/1744/oj",
  },
  {
    id: "eu-data-act",
    title: "EU Data Act",
    dateTime: "2025-09-12",
    dateLabel: "Applies 12 Sep 2025",
    href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R2854",
  },
];
