import { expect, test, type Locator } from "@playwright/test";

import { P101_TWIN } from "../../lib/data/p101";

const ARCHITECTURE_ZONES = [
  "OT Control Zone",
  "Data Access Zone",
  "Twin Zone",
  "AI Experiment Zone",
  "Validation Gate",
  "Inference Zone",
] as const;

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
  await expect(flow.getByRole("listitem")).toContainText([
    "Physical Asset",
    "Digital Twin",
    "Isolated Experiment Lab",
    "AI Scientist",
    "Evidence",
    "Human Decision",
    "Validated Deployment",
  ]);
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
});

test("Twin Capsule publishes the canonical P-101 record without invented values", async ({
  page,
}) => {
  await page.goto("/twin-capsule/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Twin Capsule", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

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

  for (const sensor of P101_TWIN.sensors) {
    const row = capsule.getByRole("row", {
      name: new RegExp(sensor.name, "iu"),
    });
    await expect(row).toContainText(sensor.quantity);
    await expect(row).toContainText(sensor.location);
    await expect(row).toContainText(
      `${sensor.nominalValue.value} ${sensor.nominalValue.unit}`,
    );
  }

  for (const feature of P101_TWIN.features) {
    const item = capsule.getByText(feature.name, { exact: true }).locator("..");
    await expect(item).toContainText(feature.description);
    await expect(item).toContainText(feature.featureSet);
    await expect(item).toContainText(feature.sourceSignalIds.join(", "));
  }

  for (const failure of P101_TWIN.failureModes) {
    const item = capsule.getByText(failure.name, { exact: true }).locator("..");
    await expect(item).toContainText(failure.description);
    await expect(item).toContainText(failure.affectedSensorIds.join(", "));
  }

  for (const value of Object.values(P101_TWIN.operatingEnvelope)) {
    await expect(capsule).toContainText(`${value.value} ${value.unit}`);
  }
  for (const constraint of P101_TWIN.safetyConstraints) {
    await expect(capsule).toContainText(constraint);
  }
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
