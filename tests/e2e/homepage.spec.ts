import { expect, test, type Locator } from "@playwright/test";

import { MANIFESTO_PRINCIPLES } from "../../lib/content/registry";

const EXPECTED_MASTHEAD_LABELS = [
  "Industrial Twin Lab / ITL",
  "Index",
  "Manifesto",
  "Architecture",
  "Research",
  "About",
  "All sections 13",
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

const TWIN_SYSTEM_LAYERS = [
  "DataSynchronized evidence",
  "ContextAsset + operating limits",
  "Decision & process orchestrationValidated recommendation",
  "ActuationHuman-authorized executionPhase 1 stops here",
] as const;

const KNOWLEDGE_SEQUENCE = [
  "Machine",
  "Observation",
  "Hypothesis",
  "Experiment",
  "Simulation",
  "Evidence",
  "Knowledge",
  "Decision",
] as const;

test("homepage establishes the operating thesis in the approved reading order", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/^ITL - /u);
  const hero = page.locator(".home-hero");
  const title = hero.getByRole("heading", {
    level: 1,
    name: "Industrial Twin Lab",
  });
  const thesis = hero.getByText(
    "Build machine intelligence in the twin before trusting it in the machine.",
    { exact: true },
  );
  const deck = hero.getByText(
    "An isolated experimentation environment for digital twins, industrial AI, simulation, and evidence-driven machine intelligence.",
    { exact: true },
  );
  const thesisFigure = hero.getByRole("figure", {
    name: "Twin system research boundary",
  });

  await expect(title).toBeVisible();
  await expect(thesis).toBeVisible();
  await expect(deck).toBeVisible();
  await expect(thesisFigure).toBeVisible();
  await expectDomOrder([title, thesis, deck, thesisFigure]);

  const masthead = page.getByRole("banner");
  await expect(
    masthead.getByRole("navigation", { name: "Primary" }),
  ).toBeVisible();
  await expect(
    masthead.getByRole("button", { name: "All sections 13" }),
  ).toBeVisible();
  const mastheadLabels = await masthead
    .locator(
      'a[aria-label="Industrial Twin Lab"], nav[aria-label="Primary"] a, button[aria-label="All sections 13"]',
    )
    .evaluateAll((elements) =>
      elements.map((element) =>
        (element instanceof HTMLButtonElement
          ? element.getAttribute("aria-label")
          : element.textContent
        )
          ?.replace(/\s+/gu, " ")
          .trim(),
      ),
    );
  expect(mastheadLabels).toEqual(EXPECTED_MASTHEAD_LABELS);

  await expect(thesisFigure.getByRole("listitem")).toContainText(
    TWIN_SYSTEM_LAYERS,
  );
  await expect(thesisFigure).toContainText("Digital thread / traceability");
  const fieldUpdate = page.getByRole("region", {
    name: "The twin is no longer only a model.",
  });
  await expect(fieldUpdate).toBeVisible();
  await expect(
    fieldUpdate.getByRole("list", { name: "Digital Twin System layers" }),
  ).toBeVisible();
  await expect(
    fieldUpdate.getByRole("link", { name: "Read the architecture" }),
  ).toHaveAttribute("href", "/architecture/");
  await expect(
    fieldUpdate.getByRole("link", {
      name: "DTC Digital Twin System Framework (opens in a new tab)",
    }),
  ).toHaveAttribute("target", "_blank");
  await expect(
    page.getByText(
      "Never let AI perform its first experiment on the physical machine.",
      { exact: true },
    ),
  ).toBeVisible();

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Manifesto" }),
  ).toHaveAttribute("href", "/manifesto");
  await expect(
    page.getByRole("link", { name: "Continue to the manifesto" }),
  ).toHaveAttribute("href", "/manifesto");
});

test("homepage keeps the fictional demonstration bounded by evidence and human authority", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("figure", { name: "P-101 Twin Capsule" }),
  ).toBeVisible();
  await expect(
    page.getByRole("figure", { name: "P-101 Evidence Package" }),
  ).toBeVisible();
  await expect(
    page.getByText("Conceptual demonstration — synthetic fixture results.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Limitations" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Human engineer retains decision authority. This package does not authorize control, maintenance action, or safety certification.",
      { exact: true },
    ),
  ).toBeVisible();
});

test("manifesto publishes all twelve principles and the evidence-to-decision sequence", async ({
  page,
}) => {
  await page.goto("/manifesto/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Industrial Twin Lab Manifesto",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  for (const principle of MANIFESTO_PRINCIPLES) {
    const number = String(principle.number).padStart(2, "0");
    const section = page.locator(`#principle-${number}`);

    await expect(section).toBeVisible();
    await expect(
      section.getByRole("heading", {
        level: 2,
        name: `Principle ${number} — ${principle.title}`,
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      section.getByText(principle.statement, { exact: true }),
    ).toBeVisible();

    if (principle.evidence) {
      const evidenceList = section.getByRole("list");
      await expect(evidenceList).toBeVisible();
      await expect(evidenceList.locator(":scope > li")).toHaveText([
        ...principle.evidence,
      ]);
    }

    if (principle.note) {
      await expect(
        section.getByText(principle.note, { exact: true }),
      ).toBeVisible();
    }
  }
  await expect(
    page.getByRole("heading", {
      name: "Principle 12 — Trust Must Be Measurable",
    }),
  ).toBeVisible();

  const sequence = page.getByRole("figure", {
    name: "Machine knowledge sequence",
  });
  await expect(sequence).toBeVisible();
  await expect(sequence.getByRole("listitem")).toContainText(
    KNOWLEDGE_SEQUENCE,
  );
  await expect(
    page.getByText(
      /The object of the work is evidence-backed machine knowledge, not merely a model/u,
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "safety architecture" }),
  ).toHaveAttribute("href", "/architecture");
  await expect(
    page.getByRole("main").getByRole("link", { name: "Experiment Fabric" }),
  ).toHaveAttribute("href", "/experiment-fabric");
  await expect(
    page.getByRole("link", { name: "open research questions" }),
  ).toHaveAttribute("href", "/research");
});

test("homepage has no document-level horizontal overflow at 390px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const title = page.getByRole("heading", {
    level: 1,
    name: "Industrial Twin Lab",
  });
  const thesisFigure = page.getByRole("figure", {
    name: "Twin system research boundary",
  });
  const readingOrder = await title.evaluate(
    (heading, figure) =>
      Boolean(
        heading.compareDocumentPosition(figure as Node) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    await thesisFigure.elementHandle(),
  );

  expect(readingOrder).toBe(true);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);

  const allSections = page.getByRole("button", { name: "All sections 13" });
  const box = await allSections.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
});
