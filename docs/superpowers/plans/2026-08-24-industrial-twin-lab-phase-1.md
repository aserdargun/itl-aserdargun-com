# Industrial Twin Lab Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish an English, static, research-publication application that explains Industrial Twin Lab through substantive content, reusable diagrams, P-101 fixtures, and a deterministic experiment demonstrator.

**Architecture:** Next.js App Router statically exports MDX-led publication pages. Typed local fixtures and pure selectors feed reusable server-rendered diagrams, while only navigation and the experiment demonstrator hydrate on the client. GitHub Actions deploys the verified `out/` artifact to Azure Static Web Apps before authoritative DNS, TLS, HTTPS, and browser checks close the release.

**Tech Stack:** Next.js 16.3.2, React 19.2.8, TypeScript 7.0.2, Tailwind CSS 4.3.3, MDX 3.1.1, Vitest 4.1.11, Playwright 1.62.1, Node.js 22

**Spec:** `docs/superpowers/specs/2026-08-24-industrial-twin-lab-phase-1-design.md`

## Global Constraints

- Phase 1 content and interface copy are English-only.
- The public repository is `aserdargun/itl-aserdargun-com`; the target domain is `itl.aserdargun.com`.
- Publication status is always `Research / Experimental`.
- Long-form content lives outside route components in MDX or typed content modules.
- Server Components are the default; Client Components are limited to navigation and meaningful interaction.
- The production site is a mostly static Azure Static Web Apps deployment with no backend, database, authentication, model runtime, or OT connectivity.
- P-101 and every experiment result are fictional, deterministic fixtures and are labeled at the point of use.
- The exact disclosure `Conceptual demonstration — synthetic fixture results.` remains visible beside experiment results.
- The visual direction is Research Monograph: near-black shell, warm paper surfaces, ink text, signal orange, serif display type, monospace notation, thin rules, open editorial layouts, and no generic SaaS sections.
- Accessibility targets WCAG 2.2 AA practices and respects `prefers-reduced-motion`.
- No Azure or DNS mutation occurs until the complete local validation contract passes.
- Every task finishes with a focused commit; push only commits that pass that task's checks.

## File Map

```text
.codex/environments/environment.toml       Codex Setup, Run, Validate, Stop actions
.github/workflows/azure-static-web-apps.yml Verified static deployment workflow
app/                                        App Router pages and metadata endpoints
components/diagrams/                        Reusable semantic diagram primitives
components/experiment/                      Deterministic interactive demo UI
components/publication/                     Site shell and editorial primitives
content/                                    MDX long-form publication copy
docs/adr/                                   Major architecture decisions
lib/content/                                Content registry and link validation
lib/data/                                   P-101 and publication fixtures
lib/domain/                                 Stable TypeScript entity contracts
lib/experiments/                            Pure experiment selection logic
public/                                     Favicons and social preview assets
scripts/                                    Content validation and safe local stop
tests/e2e/                                  Route, responsive, interaction, and a11y tests
tests/unit/                                 Domain, content, lifecycle, and UI unit tests
```

---

### Task 1: Establish the Runnable Static Application Contract

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `next.config.mjs`
- Create: `next-env.d.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `.codex/environments/environment.toml`
- Create: `scripts/stop-dev.mjs`
- Create: `tests/unit/project-contract.test.ts`

**Interfaces:**
- Consumes: the Node.js 22 runtime and the repository-level design specification.
- Produces: `npm run dev:codex`, `npm run stop:codex`, `npm run validate:codex`, a static `out/` build, Vitest aliases for `@/*`, and Playwright web-server startup on `127.0.0.1:4173`.

- [ ] **Step 1: Write the project-contract test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));

describe("project contract", () => {
  it("exposes Setup, Run, Validate, and Stop lifecycle commands", () => {
    expect(pkg.scripts["dev:codex"]).toContain("127.0.0.1");
    expect(pkg.scripts["dev:codex"]).toContain("4173");
    expect(pkg.scripts["stop:codex"]).toBe("node scripts/stop-dev.mjs 4173");
    expect(pkg.scripts["validate:codex"]).toContain("test:e2e");
  });
});
```

- [ ] **Step 2: Create the package and framework configuration**

Use exact runtime dependencies `next@16.3.2`, `react@19.2.8`, `react-dom@19.2.8`, `@next/mdx@16.3.2`, `@mdx-js/loader@3.1.1`, `@mdx-js/react@3.1.1`, `@fontsource-variable/inter@5.3.0`, `@fontsource-variable/newsreader@5.3.0`, and `@fontsource/ibm-plex-mono@5.3.0`. Use exact development dependencies `typescript@7.0.2`, `tailwindcss@4.3.3`, `@tailwindcss/postcss@4.3.3`, `eslint@10.9.0`, `eslint-config-next@16.3.2`, `vitest@4.1.11`, `jsdom@30.0.1`, `@testing-library/react@16.3.2`, `@testing-library/jest-dom@7.0.1`, `@playwright/test@1.62.1`, `@axe-core/playwright@4.13.0`, and `serve@14.2.6`.

The scripts are:

```json
{
  "dev": "next dev --hostname 127.0.0.1 --port 4173",
  "dev:codex": "next dev --hostname 127.0.0.1 --port 4173",
  "stop:codex": "node scripts/stop-dev.mjs 4173",
  "format:check": "prettier --check .",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "content:validate": "node --import=tsx scripts/validate-content.ts",
  "test:unit": "vitest run",
  "build": "next build",
  "start:static": "serve out --listen 4173 --no-clipboard",
  "test:e2e": "playwright test",
  "validate:codex": "npm run format:check && npm run lint && npm run typecheck && npm run content:validate && npm run test:unit && npm run build && npm run test:e2e"
}
```

Add `prettier@3.9.6`, `prettier-plugin-tailwindcss@0.8.1`, and `tsx@4.23.12` to development dependencies because the scripts invoke them.

Configure `next.config.mjs` with MDX page extensions, `output: "export"`, `trailingSlash: true`, and `images.unoptimized: true`. Configure Playwright's `webServer.command` as `npm run start:static`, URL as `http://127.0.0.1:4173`, and `reuseExistingServer: false`.

- [ ] **Step 3: Implement project-scoped Stop behavior**

`scripts/stop-dev.mjs` accepts only port `4173`, queries listener PIDs with `lsof -tiTCP:4173 -sTCP:LISTEN`, resolves each PID's working directory with `lsof -a -p <pid> -d cwd -Fn`, and refuses termination unless the directory equals the repository root. It sends `SIGTERM`, waits in bounded 100 ms polls for up to five seconds, then sends `SIGKILL` only to the still-running verified PID. A missing listener exits successfully.

- [ ] **Step 4: Add Codex environment actions**

```toml
version = 1
name = "Industrial Twin Lab"

[setup]
script = "npm ci"

[[actions]]
name = "Run"
icon = "run"
command = "npm run dev:codex"

[[actions]]
name = "Validate"
icon = "tool"
command = "npm run validate:codex"

[[actions]]
name = "Stop"
icon = "tool"
command = "npm run stop:codex"
```

- [ ] **Step 5: Install dependencies and prove the initial test passes**

Run: `npm install`  
Run: `npm run test:unit -- tests/unit/project-contract.test.ts`  
Expected: one passing project-contract test.

- [ ] **Step 6: Commit the runnable contract**

```bash
git add package.json package-lock.json next.config.mjs next-env.d.ts tsconfig.json postcss.config.mjs eslint.config.mjs vitest.config.ts playwright.config.ts .codex/environments/environment.toml scripts/stop-dev.mjs tests/unit/project-contract.test.ts
git commit -m "chore: establish static application contract"
```

### Task 2: Produce and Approve the Complete Visual Reference Set

**Files:**
- Create: `docs/design/phase-1/design-system.md`
- Create: `docs/design/phase-1/homepage-concept.png`
- Create: `docs/design/phase-1/publication-page-concept.png`
- Create: `docs/design/phase-1/architecture-concept.png`
- Create: `docs/design/phase-1/experiment-demo-concept.png`
- Create: `docs/design/phase-1/mobile-concept.png`

**Interfaces:**
- Consumes: the approved Research Monograph browser mockup and Phase 1 specification.
- Produces: accepted native-size references, exact visual tokens, allowed first-viewport copy, component families, responsive rules, and a visual inventory used by every UI task.

- [ ] **Step 1: Generate coordinated section references**

Use Image Gen to create fresh, readable references for the complete homepage, one representative long-form publication page, the safety architecture, the experiment demonstrator, and a mobile composition. Preserve the approved warm-paper monograph direction, exact supplied copy, open editorial layouts, signal orange, code-native text and controls, and the prohibition on SaaS cards, decorative badges, gradients, glow, stock imagery, and fake metrics.

- [ ] **Step 2: Review references for implementation clarity**

Reject and regenerate any reference with unreadable copy, compressed long-page detail, invented claims, altered page hierarchy, generic dashboard cards, decorative visual filler, or ambiguous mobile behavior. Obtain explicit user approval of the final coordinated set.

- [ ] **Step 3: Record the visual contract**

`docs/design/phase-1/design-system.md` records exact palette values, typography families and scale, spacing scale, border and radius rules, container widths, masthead behavior, first-viewport copy, diagram connector treatment, icon inventory, interactive states, reduced-motion behavior, image treatment, section order, and native reference dimensions.

- [ ] **Step 4: Commit approved references**

```bash
git add docs/design/phase-1
git commit -m "docs: approve Phase 1 visual system"
```

### Task 3: Define Domain Models and Deterministic Fixtures

**Files:**
- Create: `lib/domain/types.ts`
- Create: `lib/data/p101.ts`
- Create: `lib/data/research.ts`
- Create: `lib/data/technologies.ts`
- Create: `lib/data/glossary.ts`
- Create: `lib/data/navigation.ts`
- Create: `lib/experiments/demo.ts`
- Create: `tests/unit/domain-fixtures.test.ts`
- Create: `tests/unit/experiment-demo.test.ts`

**Interfaces:**
- Consumes: no UI modules.
- Produces: `P101_TWIN: TwinCapsule`, `RESEARCH_QUESTIONS: ResearchQuestion[]`, `TECHNOLOGIES: Technology[]`, `GLOSSARY_TERMS: GlossaryTerm[]`, `SITE_NAVIGATION: NavigationItem[]`, `DEFAULT_DEMO_CONFIG: ExperimentDemoConfig`, and `buildExperimentResult(config: ExperimentDemoConfig): ExperimentResult`.

- [ ] **Step 1: Write fixture and experiment tests**

```ts
import { describe, expect, it } from "vitest";
import { P101_TWIN } from "@/lib/data/p101";
import { buildExperimentResult, DEFAULT_DEMO_CONFIG } from "@/lib/experiments/demo";

describe("P-101 fixtures", () => {
  it("keeps one asset, eleven signals, and six declared failure modes", () => {
    expect(P101_TWIN.asset.id).toBe("P-101");
    expect(P101_TWIN.sensors).toHaveLength(11);
    expect(P101_TWIN.failureModes).toHaveLength(6);
  });
});

describe("experiment demo", () => {
  it("returns stable synthetic evidence for the same configuration", () => {
    expect(buildExperimentResult(DEFAULT_DEMO_CONFIG)).toEqual(
      buildExperimentResult(DEFAULT_DEMO_CONFIG),
    );
    expect(buildExperimentResult(DEFAULT_DEMO_CONFIG).provenance.synthetic).toBe(true);
  });
});
```

- [ ] **Step 2: Define stable entity contracts**

`lib/domain/types.ts` defines all required entities from the specification plus `NavigationItem`, `ExperimentDemoConfig`, `EvidencePackage`, `MetricResult`, `Provenance`, and literal unions for feature sets, algorithms, validation strategies, confidence grades, evidence strength, and implementation status. IDs are readonly strings; arrays are readonly; quantities with units use `{ value: number; unit: string }`.

- [ ] **Step 3: Implement P-101 and catalogue fixtures**

Encode the eleven named signals, six named failure modes, operating envelope, engineering metadata, safety constraints, feature catalogue, twin version `TWIN-P101-0.1.0`, and explicit fictional-source provenance. Encode research questions `RQ-001` through `RQ-010`, all technology categories, all glossary terms, and all site routes from the specification.

- [ ] **Step 4: Implement deterministic experiment selection**

Create a complete lookup keyed by `${featureSet}:${algorithm}:${validation}`. Every valid configuration returns all seven displayed metrics, limitations, operating regimes, experiment ID, dataset version, feature pipeline version, model version, twin version, code version, random seed, timestamp label `Synthetic fixture`, and `synthetic: true`. Parse invalid values through type guards and fall back only to `DEFAULT_DEMO_CONFIG` before the result view is rendered.

- [ ] **Step 5: Run and commit domain tests**

Run: `npm run test:unit -- tests/unit/domain-fixtures.test.ts tests/unit/experiment-demo.test.ts`  
Expected: all fixture counts, identifiers, deterministic mappings, and provenance assertions pass.

```bash
git add lib tests/unit/domain-fixtures.test.ts tests/unit/experiment-demo.test.ts
git commit -m "feat: add Industrial Twin Lab domain fixtures"
```

### Task 4: Build the MDX Content Registry and Validation Gate

**Files:**
- Create: `mdx-components.tsx`
- Create: `lib/content/types.ts`
- Create: `lib/content/registry.ts`
- Create: `scripts/validate-content.ts`
- Create: `content/manifesto.mdx`
- Create: `content/concepts/architecture.mdx`
- Create: `content/concepts/twin-capsule.mdx`
- Create: `content/concepts/experiment-fabric.mdx`
- Create: `content/concepts/feature-factory.mdx`
- Create: `content/concepts/algorithm-arena.mdx`
- Create: `content/concepts/fault-lab.mdx`
- Create: `content/concepts/ai-scientist.mdx`
- Create: `content/concepts/fleet-intelligence.mdx`
- Create: `content/research.mdx`
- Create: `content/technology.mdx`
- Create: `content/glossary.mdx`
- Create: `content/about.mdx`
- Create: `tests/unit/content-registry.test.ts`

**Interfaces:**
- Consumes: `SITE_NAVIGATION`, `RESEARCH_QUESTIONS`, `TECHNOLOGIES`, and `GLOSSARY_TERMS`.
- Produces: `CONTENT_REGISTRY: ContentEntry[]`, `getContentEntry(slug: string): ContentEntry`, `validateContentRegistry(): string[]`, and MDX component mappings for headings, links, tables, blockquotes, lists, and code.

- [ ] **Step 1: Write registry failure tests**

```ts
import { describe, expect, it } from "vitest";
import { CONTENT_REGISTRY, validateContentRegistry } from "@/lib/content/registry";

describe("content registry", () => {
  it("contains one entry for every publication route", () => {
    expect(CONTENT_REGISTRY.map((entry) => entry.href)).toEqual(
      expect.arrayContaining(["/manifesto", "/architecture", "/glossary", "/about"]),
    );
  });

  it("has no duplicate IDs, missing metadata, or broken internal links", () => {
    expect(validateContentRegistry()).toEqual([]);
  });
});
```

- [ ] **Step 2: Write substantive MDX publications**

Move all long-form principles, definitions, technology categories, research questions, warnings, and concept explanations from the approved specification into the matching MDX file. Every file exports an exact `contentMeta` object containing `id`, `href`, `title`, `description`, `order`, `status`, and `relatedHrefs`. Use P-101 consistently and include no unrelated asset examples.

- [ ] **Step 3: Implement registry validation**

Validation reports duplicate IDs or hrefs, missing titles/descriptions, unknown related routes, missing glossary targets, non-sequential manifesto principle numbers, research IDs outside `RQ-001` through `RQ-010`, and any page that omits its required synthetic or research disclaimer. `scripts/validate-content.ts` prints each error and exits with status 1; it prints the entry count and exits 0 when valid.

- [ ] **Step 4: Run content checks and commit**

Run: `npm run content:validate`  
Run: `npm run test:unit -- tests/unit/content-registry.test.ts`  
Expected: the registry reports all content entries valid and unit tests pass.

```bash
git add mdx-components.tsx lib/content scripts/validate-content.ts content tests/unit/content-registry.test.ts
git commit -m "feat: add validated publication content"
```

### Task 5: Implement the Research Monograph Shell

**Files:**
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `components/publication/site-header.tsx`
- Create: `components/publication/mobile-navigation.tsx`
- Create: `components/publication/site-footer.tsx`
- Create: `components/publication/page-intro.tsx`
- Create: `components/publication/section-heading.tsx`
- Create: `components/publication/publication-link.tsx`
- Create: `components/publication/research-disclaimer.tsx`
- Create: `tests/unit/site-shell.test.tsx`

**Interfaces:**
- Consumes: `SITE_NAVIGATION`, `ContentEntry`, and the accepted design-system document.
- Produces: `SiteHeader`, `SiteFooter`, `PageIntro`, `SectionHeading`, `PublicationLink`, `ResearchDisclaimer`, and global CSS tokens used by every page and diagram.

- [ ] **Step 1: Write semantic shell tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "@/components/publication/site-header";

describe("SiteHeader", () => {
  it("exposes the project identity and core navigation", () => {
    render(<SiteHeader />);
    expect(screen.getByRole("link", { name: "Industrial Twin Lab" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement tokens and typography**

Import Newsreader Variable for display, Inter Variable for body and controls, and IBM Plex Mono for technical notation. Define tokens from the approved visual contract for near-black shell, warm paper surfaces, ink, muted text, rules, signal orange, content widths, spacing, typography, focus rings, and motion. Provide `.sr-only`, skip-link, prose, data-table, and reduced-motion rules.

- [ ] **Step 3: Implement shell and responsive navigation**

The desktop masthead exposes Index, Manifesto, Architecture, Research, About, and an All Sections disclosure. The mobile control uses a real button with `aria-expanded`, closes on Escape and route selection, traps no focus, and leaves the underlying page reachable after dismissal. The footer shows Research / Experimental, the safety disclaimer, repository link, and route index without marketing calls to action.

- [ ] **Step 4: Run tests and commit**

Run: `npm run test:unit -- tests/unit/site-shell.test.tsx`  
Run: `npm run typecheck`  
Expected: semantic navigation tests and strict TypeScript pass.

```bash
git add app/globals.css app/layout.tsx components/publication tests/unit/site-shell.test.tsx
git commit -m "feat: build research publication shell"
```

### Task 6: Create Reusable Diagram and Evidence Primitives

**Files:**
- Create: `components/diagrams/flow-diagram.tsx`
- Create: `components/diagrams/safety-boundary.tsx`
- Create: `components/diagrams/asset-hierarchy.tsx`
- Create: `components/diagrams/twin-capsule-diagram.tsx`
- Create: `components/diagrams/experiment-anatomy.tsx`
- Create: `components/diagrams/evidence-matrix.tsx`
- Create: `components/diagrams/evidence-package.tsx`
- Create: `components/diagrams/maturity-model.tsx`
- Create: `components/diagrams/knowledge-flywheel.tsx`
- Create: `components/diagrams/technology-map.tsx`
- Create: `tests/unit/diagram-primitives.test.tsx`

**Interfaces:**
- Consumes: readonly typed arrays, `Evidence`, `EvidencePackage`, `Technology[]`, and `TwinCapsule`.
- Produces: semantic server-rendered visual components with captions and accessible text equivalents.

- [ ] **Step 1: Write diagram semantics tests**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlowDiagram } from "@/components/diagrams/flow-diagram";

describe("FlowDiagram", () => {
  it("renders an ordered relationship with a named figure", () => {
    render(<FlowDiagram title="Experiment flow" steps={["Machine", "Twin", "Evidence"]} />);
    expect(screen.getByRole("figure", { name: "Experiment flow" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Implement diagram contracts**

Each diagram accepts an explicit `title`, optional `caption`, and typed content data. The DOM expresses sequences as ordered lists, hierarchies as nested lists, matrices as tables, and zones as ordered sections. CSS pseudo-elements and small inline SVG arrow components provide geometry while `aria-hidden` prevents duplicate announcements.

- [ ] **Step 3: Implement responsive and reduced-motion variants**

At widths below 720 px, sequences become vertical, matrices live in labeled overflow regions, maturity levels stack in order, and the flywheel becomes a readable ordered cycle. Animated active-stage emphasis is disabled under reduced motion while visible numbering remains.

- [ ] **Step 4: Run and commit diagram tests**

Run: `npm run test:unit -- tests/unit/diagram-primitives.test.tsx`  
Expected: figures, lists, tables, captions, and text equivalents are present.

```bash
git add components/diagrams tests/unit/diagram-primitives.test.tsx
git commit -m "feat: add semantic architecture diagrams"
```

### Task 7: Implement the Homepage and Manifesto

**Files:**
- Create: `app/page.tsx`
- Create: `app/manifesto/page.tsx`
- Create: `components/publication/home-hero.tsx`
- Create: `components/publication/manifesto-principles.tsx`
- Create: `tests/e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: `FlowDiagram`, P-101 fixtures, manifesto MDX, `EvidencePackage`, and publication primitives.
- Produces: the approved homepage composition and complete twelve-principle manifesto.

- [ ] **Step 1: Write browser assertions for the first viewport and thesis**

```ts
import { expect, test } from "@playwright/test";

test("homepage establishes the Industrial Twin Lab thesis", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Industrial Twin Lab" })).toBeVisible();
  await expect(page.getByText("Build machine intelligence in the twin before trusting it in the machine.")).toBeVisible();
  await expect(page.getByRole("figure", { name: "The operating thesis" })).toBeVisible();
});
```

- [ ] **Step 2: Implement the approved homepage in slices**

Build the masthead and first viewport first, capture at the approved desktop dimensions, compare against `homepage-concept.png`, and correct copy, grid, type scale, paper tone, rules, and next-section visibility. Then add the dark thesis band, manifesto excerpt, P-101 juxtaposition, Evidence Package, and closing statement without adding new component families.

- [ ] **Step 3: Implement the full manifesto**

Render all twelve numbered principles from MDX, each with supporting evidence requirements and related-page links. Include the Machine → Observation → Hypothesis → Experiment → Simulation → Evidence → Knowledge → Decision sequence and the primary-output statement.

- [ ] **Step 4: Verify and commit**

Run: `npm run build`  
Run after the static server starts: `npx playwright test tests/e2e/homepage.spec.ts`  
Expected: homepage and manifesto export successfully, first-viewport assertions pass, and no horizontal overflow appears at 390 px.

```bash
git add app/page.tsx app/manifesto components/publication tests/e2e/homepage.spec.ts
git commit -m "feat: publish homepage and manifesto"
```

### Task 8: Implement Architecture and Twin Capsule Publications

**Files:**
- Create: `app/architecture/page.tsx`
- Create: `app/twin-capsule/page.tsx`
- Create: `tests/e2e/architecture.spec.ts`

**Interfaces:**
- Consumes: architecture and Twin Capsule MDX, `SafetyBoundary`, `FlowDiagram`, `AssetHierarchy`, `TwinCapsuleDiagram`, and `P101_TWIN`.
- Produces: full system architecture, six-zone safety boundary, Digital Triplet explanation, and P-101 Twin Capsule view.

- [ ] **Step 1: Write safety-boundary browser tests**

```ts
test("architecture separates experimentation from authority", async ({ page }) => {
  await page.goto("/architecture/");
  for (const zone of ["OT Control Zone", "Data Access Zone", "Twin Zone", "AI Experiment Zone", "Validation Gate", "Inference Zone"]) {
    await expect(page.getByRole("heading", { name: zone })).toBeVisible();
  }
  await expect(page.getByText("Human in command", { exact: false })).toBeVisible();
});
```

- [ ] **Step 2: Implement both publications**

Architecture renders the real-world/digital-world data flow, isolated Twin Lab services, validation gate, safety zones, and Digital Triplet as a research direction. Twin Capsule renders Enterprise → Fleet → Plant → System → Machine → Component and every capsule field from the specification using P-101.

- [ ] **Step 3: Verify at desktop and mobile widths**

Run: `npx playwright test tests/e2e/architecture.spec.ts --project=chromium`  
Expected: all zones remain in order, diagrams expose text equivalents, and the mobile layout has no clipped labels.

- [ ] **Step 4: Commit**

```bash
git add app/architecture app/twin-capsule tests/e2e/architecture.spec.ts
git commit -m "feat: add architecture and Twin Capsule atlas"
```

### Task 9: Implement Experiment Fabric and the Interactive Demonstrator

**Files:**
- Create: `app/experiment-fabric/page.tsx`
- Create: `app/experiment-fabric/demo/page.tsx`
- Create: `components/experiment/experiment-demo.tsx`
- Create: `components/experiment/metric-comparison.tsx`
- Create: `tests/unit/experiment-demo-ui.test.tsx`
- Create: `tests/e2e/experiment-demo.spec.ts`

**Interfaces:**
- Consumes: `DEFAULT_DEMO_CONFIG`, `buildExperimentResult`, `ExperimentDemoConfig`, `ExperimentResult`, `ExperimentAnatomy`, and `EvidencePackage`.
- Produces: `ExperimentDemo` with accessible native selects, deterministic results, metric comparison, provenance, limitations, and synthetic disclosure.

- [ ] **Step 1: Write the interaction test**

```ts
test("changing the algorithm updates synthetic evidence", async ({ page }) => {
  await page.goto("/experiment-fabric/demo/");
  await expect(page.getByText("Conceptual demonstration — synthetic fixture results.")).toBeVisible();
  const initialId = await page.getByTestId("experiment-id").textContent();
  await page.getByLabel("Algorithm").selectOption("physics-residual");
  await expect(page.getByTestId("experiment-id")).not.toHaveText(initialId ?? "");
  await expect(page.getByText("Synthetic fixture", { exact: true })).toBeVisible();
});
```

- [ ] **Step 2: Implement Experiment Fabric publication**

Render the complete experiment anatomy, P-101 bearing-degradation example, model and feature competition framing, operational constraint, validation method, provenance, and an Evidence Package. Emphasize best fit for a machine/regime/failure/constraint rather than highest accuracy.

- [ ] **Step 3: Implement the demonstrator**

Use controlled native selects initialized to the exact defaults. Recompute through `buildExperimentResult` only. Show all seven metrics, limitations, provenance versions, synthetic status, and a polite live-region summary. Do not animate numeric values or imply a remote experiment is running.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:unit -- tests/unit/experiment-demo-ui.test.tsx tests/unit/experiment-demo.test.ts`  
Run: `npx playwright test tests/e2e/experiment-demo.spec.ts`  
Expected: selection, provenance, disclosure, keyboard interaction, and deterministic result checks pass.

```bash
git add app/experiment-fabric components/experiment tests/unit/experiment-demo-ui.test.tsx tests/e2e/experiment-demo.spec.ts
git commit -m "feat: add deterministic experiment demonstrator"
```

### Task 10: Implement Feature, Algorithm, and Fault Publications

**Files:**
- Create: `app/feature-factory/page.tsx`
- Create: `app/algorithm-arena/page.tsx`
- Create: `app/fault-lab/page.tsx`
- Create: `tests/e2e/methods.spec.ts`

**Interfaces:**
- Consumes: matching MDX, P-101 signal and failure fixtures, `FlowDiagram`, `EvidenceMatrix`, and publication primitives.
- Produces: Feature Factory, Algorithm Arena, Residual Intelligence, and Synthetic Fault Laboratory pages.

- [ ] **Step 1: Write route-specific truthfulness tests**

```ts
test("fault laboratory qualifies simulation evidence", async ({ page }) => {
  await page.goto("/fault-lab/");
  await expect(page.getByText("Synthetic data is evidence from a model, not evidence from reality.")).toBeVisible();
  await expect(page.getByText("Simulation validity", { exact: false })).toBeVisible();
});
```

- [ ] **Step 2: Implement the three publications**

Feature Factory shows temperature, vibration, and engineering-relationship transformations plus `Residual = Physical Measurement − Digital Twin Prediction`. Algorithm Arena groups every required method family and states problem dependence. Fault Lab uses only the six P-101 failure modes plus sensor bias, drift, dropout, and communication loss and visibly qualifies model-derived evidence.

- [ ] **Step 3: Verify and commit**

Run: `npx playwright test tests/e2e/methods.spec.ts`  
Expected: the three routes contain their required equations, families, fault sequences, and warnings.

```bash
git add app/feature-factory app/algorithm-arena app/fault-lab tests/e2e/methods.spec.ts
git commit -m "feat: add industrial experimentation methods"
```

### Task 11: Implement AI Scientist and Fleet Intelligence Publications

**Files:**
- Create: `app/ai-scientist/page.tsx`
- Create: `app/fleet-intelligence/page.tsx`
- Create: `tests/e2e/intelligence.spec.ts`

**Interfaces:**
- Consumes: AI Scientist and Fleet Intelligence MDX, P-101 hypotheses, `EvidenceMatrix`, `FlowDiagram`, and `KnowledgeFlywheel`.
- Produces: hypothesis-to-evidence AI Scientist page and cross-asset Fleet Intelligence page.

- [ ] **Step 1: Write authority and generalization tests**

```ts
test("AI Scientist remains outside the control loop", async ({ page }) => {
  await page.goto("/ai-scientist/");
  await expect(page.getByText("The LLM does not replace engineering computation.")).toBeVisible();
  await expect(page.getByRole("table", { name: "P-101 hypothesis evidence matrix" })).toBeVisible();
});
```

- [ ] **Step 2: Implement the two publications**

AI Scientist renders the supplied P-101 investigation, four hypotheses, experiment path, and evidence matrix with the exact confidence fixtures. Fleet Intelligence renders component-to-enterprise progression, train P01–P49/test P50, portability concepts, leave-one-asset-out question, and Knowledge Flywheel.

- [ ] **Step 3: Verify and commit**

Run: `npx playwright test tests/e2e/intelligence.spec.ts`  
Expected: evidence table semantics, authority copy, cross-asset validation, and flywheel sequence pass.

```bash
git add app/ai-scientist app/fleet-intelligence tests/e2e/intelligence.spec.ts
git commit -m "feat: explain AI Scientist and fleet learning"
```

### Task 12: Complete Research, Technology, Glossary, About, and Error Routes

**Files:**
- Create: `app/research/page.tsx`
- Create: `app/technology/page.tsx`
- Create: `app/glossary/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/not-found.tsx`
- Create: `tests/e2e/reference-pages.spec.ts`

**Interfaces:**
- Consumes: the corresponding MDX files and catalogue fixtures, `MaturityModel`, `TechnologyMap`, and publication primitives.
- Produces: complete research/reference pages, cross-linked glossary, maturity progression, project roadmap, and publication-style 404.

- [ ] **Step 1: Write completeness tests**

```ts
test("research catalogue exposes all initial questions", async ({ page }) => {
  await page.goto("/research/");
  await expect(page.getByRole("article")).toHaveCount(10);
  await expect(page.getByText("RQ-001", { exact: true })).toBeVisible();
  await expect(page.getByText("RQ-010", { exact: true })).toBeVisible();
});
```

- [ ] **Step 2: Implement reference routes**

Research renders all ten questions and Levels 0–4. Technology renders every candidate category and the exact statement `Possible implementation ecosystem — not a prescribed stack.` Glossary sorts and cross-links all required terms. About states Research / Experimental, what the project is and is not, all ten phases, source repository, and the full industrial-control disclaimer. The 404 offers Index, Manifesto, and Glossary links.

- [ ] **Step 3: Verify and commit**

Run: `npx playwright test tests/e2e/reference-pages.spec.ts`  
Expected: catalogue counts, required labels, cross-links, roadmap, disclaimer, and 404 navigation pass.

```bash
git add app/research app/technology app/glossary app/about app/not-found.tsx tests/e2e/reference-pages.spec.ts
git commit -m "feat: complete research reference atlas"
```

### Task 13: Add Metadata, Documentation, and Static Hosting Configuration

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `public/favicon.svg`
- Create: `public/opengraph.png`
- Create: `staticwebapp.config.json`
- Create: `README.md`
- Create: `docs/adr/0001-static-publication-architecture.md`
- Create: `tests/unit/metadata.test.ts`

**Interfaces:**
- Consumes: `CONTENT_REGISTRY`, the approved visual references, and the Phase 1 specification.
- Produces: complete metadata foundation, crawl directives, social preview, Azure static route/headers configuration, setup documentation, and architecture rationale.

- [ ] **Step 1: Write metadata coverage tests**

```ts
import sitemap from "@/app/sitemap";

it("publishes every route under the canonical domain", () => {
  const urls = sitemap().map((entry) => entry.url);
  expect(urls).toContain("https://itl.aserdargun.com/manifesto/");
  expect(urls).toContain("https://itl.aserdargun.com/experiment-fabric/demo/");
});
```

- [ ] **Step 2: Implement metadata and hosting configuration**

Add global title template, descriptions, canonical metadata, Open Graph values, robots, and sitemap for every registry entry. Create the 1200×630 social asset in the accepted Research Monograph system. Configure Azure headers for CSP, nosniff, referrer policy, permissions policy, and cache behavior; map unknown paths to the exported 404 document without masking real static assets.

- [ ] **Step 3: Write README and ADR**

README answers what, why, problem, non-goals, principles, implemented/conceptual/planned boundaries, Setup/Run/Validate/Stop, repository status, Azure target, and the exact research disclaimer from the brief. ADR 0001 documents why static Next.js + MDX + typed fixtures + minimal client JavaScript was chosen over Astro and a backend/CMS architecture.

- [ ] **Step 4: Verify and commit**

Run: `npm run test:unit -- tests/unit/metadata.test.ts`  
Run: `npm run content:validate`  
Expected: canonical URLs cover all routes and documentation commands match package scripts.

```bash
git add app/sitemap.ts app/robots.ts public staticwebapp.config.json README.md docs/adr tests/unit/metadata.test.ts
git commit -m "docs: add publication and hosting foundation"
```

### Task 14: Complete Cross-route, Responsive, Accessibility, and Fidelity QA

**Files:**
- Create: `tests/e2e/routes.spec.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `docs/validation/phase-1-fidelity-ledger.md`
- Modify: files identified by QA findings only within their owning component or route.

**Interfaces:**
- Consumes: the complete static site and accepted image references.
- Produces: passing full validation, desktop/mobile screenshots, accessibility evidence, and a fidelity ledger with no unresolved fixable mismatch.

- [ ] **Step 1: Add complete route and link coverage**

```ts
for (const path of ["/", "/manifesto/", "/architecture/", "/twin-capsule/", "/experiment-fabric/", "/experiment-fabric/demo/", "/feature-factory/", "/algorithm-arena/", "/fault-lab/", "/ai-scientist/", "/fleet-intelligence/", "/research/", "/technology/", "/glossary/", "/about/"]) {
  test(`${path} is a complete publication`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
  });
}
```

- [ ] **Step 2: Add responsive and accessibility coverage**

At 1440×1000, 1024×768, 768×1024, and 390×844, assert no horizontal document overflow, masthead usability, readable diagrams, visible disclosures, and usable form controls. Run `@axe-core/playwright` on `/`, `/architecture/`, `/experiment-fabric/demo/`, and `/glossary/` and fail on serious or critical violations.

- [ ] **Step 3: Run the complete local validation contract**

Run: `npm run stop:codex`  
Run: `npm run validate:codex`  
Expected: format, lint, typecheck, content validation, unit tests, static build, and every Playwright test pass.

- [ ] **Step 4: Perform visual fidelity review**

Use the in-app browser to inspect first viewport, full-page rhythm, core links, mobile navigation, every diagram family, and the demo state change. Capture desktop and mobile screenshots. Use `view_image` on each accepted concept and the matching latest render. Record at least five comparison points per major reference: copy, layout, typography, palette, spacing/container model, diagram treatment, responsive behavior, and interaction state. Fix every agency-review-level mismatch and rerun the affected checks.

- [ ] **Step 5: Prove safe shutdown and clean repository state**

Run: `npm run stop:codex`  
Run: `lsof -nP -iTCP:4173 -sTCP:LISTEN`  
Run: `git status --short`  
Expected: no listener on 4173 and only the intended QA documentation change is present before commit.

- [ ] **Step 6: Commit validated Phase 1**

```bash
git add tests/e2e docs/validation app components content lib public README.md staticwebapp.config.json
git commit -m "test: validate Industrial Twin Lab phase 1"
```

### Task 15: Publish Through GitHub and Azure Static Web Apps

**Files:**
- Create: `.github/workflows/azure-static-web-apps.yml`
- Create: `docs/validation/production-release.md`
- Modify: `README.md` only if the generated Azure hostname or publication status belongs in project documentation.

**Interfaces:**
- Consumes: the clean locally validated `main` commit and live GitHub, Azure, IHS DNS, TLS, and HTTP state.
- Produces: a successful GitHub Actions deployment, Azure Static Web Apps resource, verified generated hostname, bound `itl.aserdargun.com`, and a correlated release evidence record.

- [ ] **Step 1: Reconfirm exact external targets before mutation**

Verify GitHub owner/repository, Azure subscription and tenant, intended resource group, globally available Static Web App name, region, branch `main`, build command `npm run build`, output directory `out`, and current authoritative IHS nameservers. Print the exact resource, hostname, TXT owner record, and CNAME target before creating or changing them.

- [ ] **Step 2: Push the verified source commit**

Run: `git status --short --branch`  
Run: `npm run validate:codex`  
Run: `git push origin main`  
Expected: the pushed SHA equals the locally validated SHA and the working tree remains clean.

- [ ] **Step 3: Create and configure Azure Static Web Apps**

Create a dedicated Azure Static Web Apps resource connected to `aserdargun/itl-aserdargun-com` and `main`. Configure the workflow to install with `npm ci`, build the static export, deploy `out`, and skip redundant app builds only when the selected Azure deployment action contract explicitly supports prebuilt output. Store deployment credentials only in the GitHub repository secret used by the workflow.

- [ ] **Step 4: Correlate deployment evidence**

Record the source SHA, GitHub Actions run ID and conclusion, Azure resource provisioning state, production deployment status, generated Azure hostname, HTTPS status, and a content marker unique to Industrial Twin Lab. Do not proceed to DNS while any value is ambiguous or not ready.

- [ ] **Step 5: Publish the custom domain in ownership-first order**

Add the exact `_dnsauth.itl` TXT ownership value, query every authoritative nameserver until it agrees, request the Azure custom-domain binding, then add the `itl` CNAME to the verified generated Azure hostname. Query authoritative and public recursive DNS until the expected answers converge.

- [ ] **Step 6: Verify production end to end**

Verify Azure reports the domain Ready/Validated; the served certificate SAN covers `itl.aserdargun.com`; HTTPS returns the expected status and security headers; homepage and a deep route contain the correct publication markers; the browser renders the homepage, mobile navigation, architecture page, and experiment demonstrator without console errors; and no local project listener remains open.

- [ ] **Step 7: Record release evidence and commit documentation**

`docs/validation/production-release.md` records UTC timestamps, validated SHA, workflow URL, Azure resource and hostname, authoritative/public DNS answers, TLS subject/SAN, HTTP results, browser routes exercised, and local Stop result without including secrets.

```bash
git add .github/workflows/azure-static-web-apps.yml docs/validation/production-release.md README.md
git commit -m "ci: publish Industrial Twin Lab to Azure"
git push origin main
```

Expected: the documentation commit triggers a final successful workflow and `itl.aserdargun.com` serves that exact SHA.
