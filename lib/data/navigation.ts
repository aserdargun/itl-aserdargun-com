import type { NavigationItem } from "@/lib/domain/types";

export const SITE_NAVIGATION: readonly NavigationItem[] = [
  { id: "manifesto", label: "Manifesto", href: "/manifesto" },
  { id: "architecture", label: "Architecture", href: "/architecture" },
  { id: "twin-capsule", label: "Twin Capsule", href: "/twin-capsule" },
  {
    id: "experiment-fabric",
    label: "Experiment Fabric",
    href: "/experiment-fabric",
  },
  { id: "feature-factory", label: "Feature Factory", href: "/feature-factory" },
  { id: "algorithm-arena", label: "Algorithm Arena", href: "/algorithm-arena" },
  { id: "fault-lab", label: "Fault Lab", href: "/fault-lab" },
  { id: "ai-scientist", label: "AI Scientist", href: "/ai-scientist" },
  {
    id: "fleet-intelligence",
    label: "Fleet Intelligence",
    href: "/fleet-intelligence",
  },
  { id: "research", label: "Research", href: "/research" },
  { id: "technology", label: "Technology", href: "/technology" },
  { id: "glossary", label: "Glossary", href: "/glossary" },
  { id: "about", label: "About", href: "/about" },
];
