import { expect, test, type Locator, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const RESEARCH_QUESTIONS = [
  [
    "RQ-001",
    "How much digital twin fidelity is actually required for predictive maintenance?",
  ],
  [
    "RQ-002",
    "When does physics-informed feature engineering outperform end-to-end deep learning?",
  ],
  [
    "RQ-003",
    "Can synthetic failures improve models without introducing dangerous simulation bias?",
  ],
  ["RQ-004", "Which features generalize across machines of the same class?"],
  [
    "RQ-005",
    "How should confidence from simulation, historical evidence, and machine learning be combined?",
  ],
  [
    "RQ-006",
    "Can an AI Scientist autonomously design useful industrial experiments while remaining outside the control loop?",
  ],
  [
    "RQ-007",
    "How should Digital Twin uncertainty propagate into AI recommendations?",
  ],
  [
    "RQ-008",
    "Can fleet learning work without centralizing industrial raw data?",
  ],
  [
    "RQ-009",
    "How can organizations distinguish correlation, causality, and physical mechanism?",
  ],
  [
    "RQ-010",
    "What evidence should be required before an industrial AI model is allowed into production?",
  ],
  [
    "RQ-011",
    "How can multi-agent orchestration remain subordinate to a shared safety hierarchy and named human authority?",
  ],
  [
    "RQ-012",
    "What operational context must be captured to replay and audit an industrial agent recommendation?",
  ],
  [
    "RQ-013",
    "Can SSP 2.0 and FMI 3.0 preserve enough simulation architecture and provenance for cross-tool replication?",
  ],
  [
    "RQ-014",
    "What machine-readable data and metadata contract is required for a connected product to support trustworthy twin evidence?",
  ],
  [
    "RQ-015",
    "What technical evidence should support risk management, human oversight, and traceability for high-risk industrial AI?",
  ],
] as const;

const MATURITY_LEVELS = [
  [
    "Level 0 — Connected Asset",
    "Machine → Data",
    "Data access is known; no inference claim is made.",
  ],
  [
    "Level 1 — Observable Asset",
    "Machine → Data → Monitoring",
    "Signals and quality limits are visible and traceable.",
  ],
  [
    "Level 2 — Digital Twin",
    "Machine ↔ Digital Representation",
    "The representation is verified and validated for a stated use.",
  ],
  [
    "Level 3 — Twin Lab",
    "Twin → Simulation → Experiments",
    "Experiments are isolated, reproducible, and limitation-aware.",
  ],
  [
    "Level 4 — Machine Intelligence",
    "Twin + Experiment Fabric + AI Scientist + Fleet Learning",
    "Recommendations survive independent validation and explicit engineering review.",
  ],
] as const;

const TECHNOLOGY_CATALOGUE = [
  [
    "Industrial Connectivity",
    "OPC UA",
    "MQTT",
    "Modbus",
    "historian connectors",
  ],
  [
    "Twin Semantics",
    "Asset Administration Shell",
    "Eclipse BaSyx",
    "domain ontologies",
  ],
  [
    "Simulation",
    "Modelica",
    "OpenModelica",
    "FMI",
    "SSP 2.0",
    "FMU",
    "Python scientific computing",
  ],
  ["Data", "Parquet", "DuckDB", "Polars", "TimescaleDB", "InfluxDB", "MinIO"],
  ["Machine Learning", "scikit-learn", "XGBoost", "LightGBM", "PyTorch"],
  ["Experimentation", "MLflow", "Optuna"],
  ["Local AI", "local LLM runtimes", "RAG", "tool-using agents"],
  ["Infrastructure", "Docker", "Kubernetes", "k3s"],
  ["Observability", "Prometheus", "Grafana"],
] as const;

const GLOSSARY = [
  [
    "AI Scientist",
    "A reasoning and experimentation layer that remains outside the control loop.",
    "ai-scientist",
  ],
  [
    "Challenger Model",
    "A candidate compared with a champion under the same experimental conditions.",
    "challenger-model",
  ],
  [
    "Champion Model",
    "The currently selected candidate under stated evidence and constraints.",
    "champion-model",
  ],
  [
    "Digital Thread",
    "The connected information trace that follows an asset across its lifecycle.",
    "digital-thread",
  ],
  [
    "Digital Triplet",
    "A research direction combining a physical machine, a digital twin, and an AI Scientist.",
    "digital-triplet",
  ],
  [
    "Digital Twin",
    "A computational representation of a physical asset and its relevant behavior.",
    "digital-twin",
  ],
  [
    "Experiment Fabric",
    "The system that treats experiments, their configurations, and their evidence as first-class objects.",
    "experiment-fabric",
  ],
  [
    "Fault Injection",
    "A controlled modification of a twin or input to study detection behavior.",
    "fault-injection",
  ],
  [
    "Feature Factory",
    "The transformation of raw industrial signals into engineered features.",
    "feature-factory",
  ],
  [
    "Fleet Intelligence",
    "Cross-asset learning and validation that preserves engineering context.",
    "fleet-intelligence",
  ],
  [
    "Gray-box Model",
    "A hybrid model that combines physical structure with learned components.",
    "gray-box-model",
  ],
  [
    "Model Provenance",
    "The reproducibility record for an asset, data, features, model, code, and configuration.",
    "model-provenance",
  ],
  [
    "Physics-Informed ML",
    "Machine learning constrained or informed by engineering relationships.",
    "physics-informed-ml",
  ],
  [
    "Residual Intelligence",
    "Reasoning from the difference between physical measurement and digital-twin prediction.",
    "residual-intelligence",
  ],
  [
    "Synthetic Fault",
    "A fault scenario generated by a model, rather than observed in an operating plant.",
    "synthetic-fault",
  ],
  [
    "Twin Capsule",
    "A bounded record of an asset, signals, features, failure modes, and provenance.",
    "twin-capsule",
  ],
  [
    "Twin Lab",
    "An isolated environment for investigation on a digital representation rather than a physical machine.",
    "twin-lab",
  ],
  [
    "Twin Registry",
    "A catalogue that identifies and locates Twin Capsules.",
    "twin-registry",
  ],
  [
    "Uncertainty Quantification",
    "Characterizing uncertainty that affects an inference or recommendation.",
    "uncertainty-quantification",
  ],
  [
    "Validation",
    "Assessing whether a result is fit for its intended engineering decision.",
    "validation",
  ],
  [
    "Verification",
    "Checking that an implementation conforms to its specified design.",
    "verification",
  ],
] as const;

const ROADMAP_PHASES = [
  "Phase 1 — Manifesto + Architecture Atlas",
  "Phase 2 — Interactive Twin Capsule",
  "Phase 3 — Synthetic Experiment Workbench",
  "Phase 4 — Real Dataset Import",
  "Phase 5 — Python Experiment Runtime",
  "Phase 6 — MLflow / Experiment Registry",
  "Phase 7 — FMU / Modelica Simulation",
  "Phase 8 — Local LLM AI Scientist",
  "Phase 9 — Industrial Connectors",
  "Phase 10 — Fleet Intelligence",
] as const;

const RESEARCH_DISCLAIMER =
  "Industrial Twin Lab is currently a research and concept-development project. Demonstrations must not be interpreted as validated industrial control or safety systems.";

const expectOneHeadingAndHealthyMain = async (page: Page, title: string) => {
  const response = await page.goto(page.url());
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
};

const expectDomOrder = async (locators: readonly Locator[]) => {
  for (let index = 0; index < locators.length - 1; index += 1) {
    const following = await locators[index + 1].elementHandle();
    expect(following).not.toBeNull();
    expect(
      await locators[index].evaluate(
        (element, next) =>
          Boolean(
            element.compareDocumentPosition(next as Node) &
            Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        following,
      ),
    ).toBe(true);
  }
};

test("research publishes the exact question catalogue and maturity progression", async ({
  page,
}) => {
  await page.goto("/research/");
  await expectOneHeadingAndHealthyMain(page, "Open Research Questions");

  const questions = page.getByRole("main").getByRole("article");
  await expect(questions).toHaveCount(RESEARCH_QUESTIONS.length);
  for (const [index, [id, question]] of RESEARCH_QUESTIONS.entries()) {
    const article = questions.nth(index);
    await expect(article).toHaveAttribute("id", id.toLowerCase());
    await expect(article.getByRole("heading", { level: 2 })).toHaveText(id);
    await expect(article.getByText(question, { exact: true })).toBeVisible();
  }

  const maturity = page.getByRole("figure", {
    name: "Industrial Twin Lab maturity model",
  });
  const levels = maturity.getByRole("listitem");
  await expect(levels).toHaveCount(MATURITY_LEVELS.length);
  for (const [
    index,
    [title, capability, evidence],
  ] of MATURITY_LEVELS.entries()) {
    await expect(levels.nth(index)).toContainText(title);
    await expect(levels.nth(index)).toContainText(capability);
    await expect(levels.nth(index)).toContainText(evidence);
  }
  await expectDomOrder(
    MATURITY_LEVELS.map(([title]) => maturity.getByText(title)),
  );
  await expect(
    page.getByText(RESEARCH_DISCLAIMER, { exact: true }).first(),
  ).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("technology presents every candidate through the shared map without endorsement", async ({
  page,
}) => {
  await page.goto("/technology/");
  await expectOneHeadingAndHealthyMain(page, "Technology Atlas");
  await expect(
    page.getByText(
      "Possible implementation ecosystem — not a prescribed stack.",
      {
        exact: true,
      },
    ),
  ).toBeVisible();

  const map = page.getByRole("figure", {
    name: "Candidate implementation ecosystem",
  });
  const categories = map.locator(":scope > ul > li");
  await expect(categories).toHaveCount(TECHNOLOGY_CATALOGUE.length);
  for (const [index, [category, ...items]] of TECHNOLOGY_CATALOGUE.entries()) {
    const section = categories
      .nth(index)
      .getByRole("region", { name: category });
    await expect(section.getByRole("heading", { level: 3 })).toHaveText(
      category,
    );
    await expect(section.getByRole("listitem")).toHaveText(items);
  }
  await expect(
    page.getByText(
      /candidates, not endorsements or fixed architecture decisions/u,
    ),
  ).toBeVisible();
  await expect(
    page.getByText(RESEARCH_DISCLAIMER, { exact: true }).first(),
  ).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("glossary publishes each canonical definition once, sorted with meaningful live links", async ({
  page,
  request,
}) => {
  await page.goto("/glossary/");
  await expectOneHeadingAndHealthyMain(page, "Glossary");

  const entries = page.locator("main .glossary-entry");
  await expect(entries).toHaveCount(GLOSSARY.length);
  await expect(entries.getByRole("heading", { level: 2 })).toHaveText(
    GLOSSARY.map(([term]) => term),
  );
  for (const [index, [term, definition, id]] of GLOSSARY.entries()) {
    const entry = entries.nth(index);
    await expect(entry).toHaveAttribute("id", id);
    await expect(entry.getByRole("heading", { level: 2 })).toHaveText(term);
    await expect(entry.getByText(definition, { exact: true })).toHaveCount(1);
  }

  const internalLinks = page.locator('main a[href^="/"]');
  const hrefs = await internalLinks.evaluateAll((links) =>
    links.map((link) => link.getAttribute("href")).filter(Boolean),
  );
  expect(hrefs.length).toBeGreaterThan(0);
  for (let index = 0; index < (await internalLinks.count()); index += 1) {
    const link = internalLinks.nth(index);
    const href = await link.getAttribute("href");
    expect(href).not.toBeNull();
    expect((await link.textContent())?.trim()).not.toMatch(
      /^[a-z]+(?:-[a-z]+)+$/u,
    );
    const response = await request.get(href!);
    expect(response.status(), `dead glossary link: ${href}`).toBe(200);
  }
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("about states exact project boundaries, roadmap, source, and disclaimer", async ({
  page,
}) => {
  await page.goto("/about/");
  await expectOneHeadingAndHealthyMain(page, "About Industrial Twin Lab");
  await expect(
    page.getByText("Status: Research / Experimental", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(/Industrial Twin Lab is a living technical manifesto/u),
  ).toBeVisible();
  await expect(
    page.getByText(/It is not a commercial SaaS workflow/u),
  ).toBeVisible();

  const roadmap = page
    .getByRole("list")
    .filter({ hasText: ROADMAP_PHASES[0] })
    .first();
  await expect(roadmap.getByRole("listitem")).toHaveCount(
    ROADMAP_PHASES.length,
  );
  for (const [index, phase] of ROADMAP_PHASES.entries()) {
    await expect(roadmap.getByRole("listitem").nth(index)).toContainText(phase);
  }
  const repository = page.getByRole("main").getByRole("link", {
    name: "aserdargun/itl-aserdargun-com source repository",
  });
  await expect(repository).toHaveAttribute(
    "href",
    "https://github.com/aserdargun/itl-aserdargun-com",
  );
  await expect(repository).toHaveAttribute("rel", /noopener/u);
  await expect(
    page.getByText(RESEARCH_DISCLAIMER, { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByRole("main")).not.toContainText(
    /customer|sign up|start free|get started|buy now/u,
  );
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

test("an unknown route returns a real publication-style 404 with useful navigation", async ({
  page,
}) => {
  const response = await page.goto("/reference-page-that-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page).toHaveURL(/\/reference-page-that-does-not-exist\/$/u);
  await expect(page.locator("main .not-found-publication")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Publication not found",
  );
  for (const [name, href] of [
    ["Index", "/"],
    ["Manifesto", "/manifesto"],
    ["Glossary", "/glossary"],
  ] as const) {
    await expect(
      page.getByRole("main").getByRole("link", { name }),
    ).toHaveAttribute("href", href);
  }
  expect(
    (await new AxeBuilder({ page }).include("main").analyze()).violations,
  ).toEqual([]);
});

for (const [route, expectedTitle, expectedStatus] of [
  ["/research/", "Open Research Questions", 200],
  ["/technology/", "Technology Atlas", 200],
  ["/glossary/", "Glossary", 200],
  ["/about/", "About Industrial Twin Lab", 200],
  ["/reference-page-that-does-not-exist/", "Publication not found", 404],
] as const) {
  test(`${route} has real route identity and no document overflow at 390px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(route);
    expect(response?.status()).toBe(expectedStatus);
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toHaveText(expectedTitle);
    if (expectedStatus === 404) {
      await expect(page.locator("main .not-found-publication")).toBeVisible();
      await expect(
        page.getByRole("main").getByRole("link", { name: "Glossary" }),
      ).toHaveAttribute("href", "/glossary");
    }
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
  });
}
