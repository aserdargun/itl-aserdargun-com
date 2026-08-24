import { expect, test } from "@playwright/test";

const OPERATING_STAGES = [
  "Physical asset — Reality",
  "Digital twin — Representation",
  "Isolated experiment lab — Inquiry",
  "AI scientist — Reasoning",
  "Evidence package — Decision",
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

  await expect(page).toHaveTitle(/Industrial Twin Lab/u);
  await expect(
    page.getByRole("heading", { level: 1, name: "Industrial Twin Lab" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Build machine intelligence in the twin before trusting it in the machine.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    page.getByText(
      "An isolated experimentation environment for digital twins, industrial AI, simulation, and evidence-driven machine intelligence.",
      { exact: true },
    ),
  ).toBeVisible();

  const thesisFigure = page.getByRole("figure", {
    name: "The operating thesis",
  });
  await expect(thesisFigure).toBeVisible();
  await expect(thesisFigure.getByRole("listitem")).toContainText(
    OPERATING_STAGES,
  );
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

  for (let number = 1; number <= 12; number += 1) {
    await expect(
      page.locator(`#principle-${String(number).padStart(2, "0")}`),
    ).toBeVisible();
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
    name: "The operating thesis",
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
