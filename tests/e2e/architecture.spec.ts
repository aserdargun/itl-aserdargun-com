import { expect, test, type Locator } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

import { ARCHITECTURE_CATALOGUE } from "../../lib/data/architecture";
import { P101_TWIN } from "../../lib/data/p101";

const ARCHITECTURE_ZONES = ARCHITECTURE_CATALOGUE.zones.map(
  (zone) => zone.title,
);
const ARCHITECTURE_FLOW = ARCHITECTURE_CATALOGUE.flow;
const ARCHITECTURE_ZONE_RECORDS = ARCHITECTURE_CATALOGUE.zones;

const HIERARCHY_LEVELS = [
  "Enterprise",
  "Fleet",
  "Plant",
  "System",
  "Machine",
  "Component",
] as const;

const expectDomOrder = async (locators: readonly Locator[]) => {
  for (let index = 0; index < locators.length - 1; index += 1) {
    const followingElement = await locators[index + 1].elementHandle();
    expect(followingElement).not.toBeNull();
    expect(
      await locators[index].evaluate(
        (element, following) =>
          Boolean(
            element.compareDocumentPosition(following as Node) &
            Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        followingElement,
      ),
    ).toBe(true);
  }
};

test("architecture separates experimentation from operational authority", async ({
  page,
}) => {
  await page.goto("/architecture/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Industrial AI Safety Architecture",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const boundary = page.getByRole("figure", {
    name: "Industrial Twin Lab safety boundary",
  });
  await expect(boundary).toBeVisible();

  const zoneHeadings = ARCHITECTURE_ZONES.map((zone) =>
    boundary.getByRole("heading", { level: 3, name: zone, exact: true }),
  );
  await expect(boundary.getByRole("heading", { level: 3 })).toHaveCount(6);
  await expectDomOrder(zoneHeadings);
  for (const heading of zoneHeadings) await expect(heading).toBeVisible();
  for (const zone of ARCHITECTURE_ZONE_RECORDS) {
    await expect(
      boundary.getByRole("region", { name: zone.title }),
    ).toContainText(zone.description);
  }

  const legend = boundary.getByRole("region", { name: "Diagram notation" });
  await expect(legend).toContainText("Solid line = directional flow");
  await expect(legend).toContainText(
    "Dashed boundary = isolated experiment zone",
  );
  await expect(legend).toContainText(
    "Signal-orange stop marker = human authority / safety boundary",
  );
  await expect(boundary).toContainText("Human in command");
  await expect(boundary).toContainText(/no direct control path/u);
  await expect(boundary).toContainText(/AI or an experiment result/u);
  await expect(boundary).toContainText(/OT Control/u);

  const flow = page.getByRole("figure", {
    name: "Real-world to digital-world evidence flow",
  });
  await expect(flow.getByRole("listitem")).toHaveCount(7);
  await expect(flow.getByRole("listitem")).toContainText(ARCHITECTURE_FLOW);
  await expect(page.locator(".architecture-source-flow")).toHaveText(
    ARCHITECTURE_FLOW.join(" → "),
  );

  const zoneCatalogue = page.getByRole("table", {
    name: "Architecture zone catalogue",
  });
  await expect(zoneCatalogue.locator("tbody tr")).toHaveCount(6);
  for (const zone of ARCHITECTURE_ZONE_RECORDS) {
    const row = zoneCatalogue.getByRole("row", {
      name: new RegExp(`^${zone.title}`, "u"),
    });
    await expect(row).toContainText(zone.boundaryRole);
    await expect(row).toContainText(zone.representativeElements.join(", "));
    await expect(row).toContainText(zone.permittedRole);
  }
  await expect(page.getByText("P-101", { exact: true }).first()).toBeVisible();
  await expect(
    page.getByText(/fictional demonstration asset/u).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Digital Triplet: research direction only",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(/not a deployed autonomous capability/u),
  ).toBeVisible();

  await expect(
    page.getByRole("main").getByRole("link", { name: "Twin Capsule" }),
  ).toHaveAttribute("href", "/twin-capsule");
  await expect(
    page.getByRole("main").getByRole("link", { name: "Experiment Fabric" }),
  ).toHaveAttribute("href", "/experiment-fabric");
  await expect(
    page.getByRole("main").getByRole("link", { name: "AI Scientist" }),
  ).toHaveAttribute("href", "/ai-scientist");

  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("Twin Capsule publishes the canonical P-101 record without invented values", async ({
  page,
}) => {
  await page.goto("/twin-capsule/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Twin Capsule", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByText(
      "The Phase 1 P-101 fixture populates only the typed records rendered below.",
      { exact: false },
    ),
  ).toBeVisible();

  const hierarchy = page.getByRole("figure", {
    name: "P-101 asset hierarchy",
  });
  await expect(hierarchy).toBeVisible();
  await expect(hierarchy.getByRole("listitem")).toHaveCount(6);
  await expect(hierarchy.getByRole("listitem")).toContainText(HIERARCHY_LEVELS);

  const capsule = page.getByRole("figure", { name: "P-101 Twin Capsule" });
  await expect(capsule).toBeVisible();
  await expect(capsule).toContainText(P101_TWIN.id);
  await expect(capsule).toContainText(P101_TWIN.version);
  await expect(capsule).toContainText(P101_TWIN.asset.id);
  await expect(capsule).toContainText(P101_TWIN.asset.name);
  await expect(capsule).toContainText(P101_TWIN.asset.assetType);
  await expect(capsule).toContainText(P101_TWIN.asset.driver);
  await expect(capsule).toContainText(P101_TWIN.asset.description);
  await expect(capsule).toContainText(P101_TWIN.asset.hierarchy.join(" → "));

  for (const value of Object.values(P101_TWIN.asset.engineeringMetadata)) {
    const display =
      typeof value === "string" ? value : `${value.value} ${value.unit}`;
    await expect(capsule).toContainText(display);
  }

  const signals = capsule.getByRole("table", { name: "Twin Capsule signals" });
  await expect(signals.getByRole("columnheader")).toHaveText([
    "Signal ID",
    "Signal",
    "Unit",
    "Quantity",
    "Location",
    "Nominal fixture value",
  ]);
  await expect(signals.locator("tbody tr")).toHaveCount(11);
  for (const sensor of P101_TWIN.sensors) {
    const row = signals.getByRole("row", {
      name: new RegExp(`^${sensor.id}`, "iu"),
    });
    await expect(row.locator("th, td")).toHaveText([
      sensor.id,
      sensor.name,
      sensor.unit,
      sensor.quantity,
      sensor.location,
      `${sensor.nominalValue.value} ${sensor.nominalValue.unit}`,
    ]);
  }

  const features = capsule.getByRole("list", {
    name: "Twin Capsule features",
  });
  await expect(features.locator(":scope > li")).toHaveCount(9);
  for (const feature of P101_TWIN.features) {
    const item = features.getByRole("listitem").filter({
      hasText: feature.id,
    });
    await expect(item).toContainText(feature.id);
    await expect(item).toContainText(feature.description);
    await expect(item).toContainText(feature.featureSet);
    await expect(item).toContainText(feature.sourceSignalIds.join(", "));
  }

  const failures = capsule.getByRole("list", {
    name: "Twin Capsule failure modes",
  });
  await expect(failures.locator(":scope > li")).toHaveCount(6);
  for (const failure of P101_TWIN.failureModes) {
    const item = failures.getByRole("listitem").filter({
      hasText: failure.id,
    });
    await expect(item).toContainText(failure.id);
    await expect(item).toContainText(failure.description);
    await expect(item).toContainText(failure.affectedSensorIds.join(", "));
  }

  const identity = capsule.getByRole("region", { name: "Asset identity" });
  await expect(identity.locator(".technical-ledger > div")).toHaveCount(10);
  const envelope = capsule.getByRole("region", {
    name: "Operating envelope",
  });
  await expect(envelope.locator(".technical-ledger > div")).toHaveCount(6);
  for (const value of Object.values(P101_TWIN.operatingEnvelope)) {
    await expect(capsule).toContainText(`${value.value} ${value.unit}`);
  }

  const safety = capsule.getByRole("region", { name: "Safety constraints" });
  await expect(safety.getByRole("listitem")).toHaveCount(3);
  for (const constraint of P101_TWIN.safetyConstraints) {
    await expect(capsule).toContainText(constraint);
  }

  const boundaries = capsule.getByRole("region", {
    name: "Model availability, limitations, and uncertainty",
  });
  await expect(boundaries.locator(".technical-ledger > div")).toHaveCount(5);
  await expect(boundaries).toContainText(
    P101_TWIN.modelAvailability.implementationStatus,
  );
  await expect(boundaries).toContainText(
    P101_TWIN.modelAvailability.validationStatus,
  );
  await expect(boundaries).toContainText(P101_TWIN.modelAvailability.statement);
  await expect(boundaries).toContainText(P101_TWIN.uncertainty.status);
  await expect(boundaries).toContainText(P101_TWIN.uncertainty.statement);
  const limitations = boundaries.getByRole("list", {
    name: "Twin Capsule limitations",
  });
  await expect(limitations.locator(":scope > li")).toHaveCount(3);
  await expect(limitations.getByRole("listitem")).toHaveText([
    ...P101_TWIN.limitations,
  ]);

  const provenance = capsule.getByRole("region", {
    name: "Provenance and disclosure",
  });
  await expect(provenance.locator(".technical-ledger > div")).toHaveCount(4);
  await expect(capsule).toContainText(P101_TWIN.provenance.assetVersion);
  await expect(capsule).toContainText(P101_TWIN.provenance.twinVersion);
  await expect(capsule).toContainText(P101_TWIN.provenance.source);
  await expect(capsule).toContainText(P101_TWIN.provenance.statement);
  await expect(capsule).toContainText("Fictional / synthetic fixture");
  await expect(capsule).toContainText(
    "Human engineering review is required before any physical-machine decision.",
  );

  await expect(
    page.getByRole("main").getByRole("link", { name: "Architecture" }),
  ).toHaveAttribute("href", "/architecture");
  await expect(
    page.getByRole("main").getByRole("link", { name: "Feature Factory" }),
  ).toHaveAttribute("href", "/feature-factory");
  await expect(
    page.getByRole("main").getByRole("link", { name: "Glossary" }),
  ).toHaveAttribute("href", "/glossary");

  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

for (const route of ["/architecture/", "/twin-capsule/"] as const) {
  test(`${route} has no document overflow or clipped diagram labels at 390px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    const clippedLabels = await page
      .locator(
        ".diagram-figure h2, .diagram-figure h3, .asset-hierarchy__level",
      )
      .evaluateAll((elements) =>
        elements
          .filter(
            (element) =>
              element.scrollWidth > element.clientWidth ||
              element.scrollHeight > element.clientHeight,
          )
          .map((element) => element.textContent?.trim()),
      );
    expect(clippedLabels).toEqual([]);
  });
}
