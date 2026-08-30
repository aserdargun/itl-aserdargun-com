import { ARCHITECTURE_CATALOGUE } from "@/lib/data/architecture";

import { DigitalTwinSystemBoundary } from "./digital-twin-system-boundary";
import { FlowDiagram } from "./flow-diagram";
import { SafetyBoundary } from "./safety-boundary";

export function ArchitectureAtlas() {
  return (
    <div className="architecture-atlas">
      <DigitalTwinSystemBoundary />
      <SafetyBoundary
        caption="Six ordered zones keep research inquiry outside the control loop. Evidence may move forward for review; no experimental or inference result has a return path to P-101 or OT Control."
        title="Industrial Twin Lab safety boundary"
        zones={ARCHITECTURE_CATALOGUE.zones}
      />
      <div
        className="architecture-atlas__asset"
        aria-label="Demonstration asset disclosure"
      >
        <strong>P-101</strong>
        <span>Fictional demonstration asset</span>
      </div>
      <FlowDiagram
        caption="A one-way real-world to digital-world path: controlled data enters the lab, while evidence reaches a human decision before any separately validated deployment."
        steps={ARCHITECTURE_CATALOGUE.flow}
        title="Real-world to digital-world evidence flow"
      />
    </div>
  );
}
