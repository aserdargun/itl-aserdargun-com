# Industrial Twin Lab Phase 1 Design

**Status:** Approved for implementation  
**Date:** 2026-08-24  
**Repository:** `aserdargun/itl-aserdargun-com`  
**Target domain:** `itl.aserdargun.com`  
**Publication status:** Research / Experimental

## 1. Purpose

Industrial Twin Lab begins as a living technical manifesto, research publication, architecture atlas, and interactive concept demonstrator for industrial machine intelligence. It explains why AI experiments should be isolated from physical machinery, how digital twins can support reproducible experimentation, and how engineers can govern the resulting evidence.

The product thesis is:

> Build machine intelligence in the twin before trusting it in the machine.

Phase 1 must let a visitor understand the project's purpose, system model, safety boundary, scientific discipline, and future direction without external explanation.

## 2. Audience

The primary audience is industrial engineers, reliability engineers, data scientists, technical leaders, researchers, and architects evaluating how digital twins and machine learning can be combined safely. The site is English-only in Phase 1.

The writing must be technically precise, skeptical of hype, concise, and understandable by both engineers and technical managers.

## 3. Goals

Phase 1 will:

1. Publish the Industrial Twin Lab manifesto and its twelve principles.
2. Explain the relationship between the physical asset, digital twin, isolated experiment lab, AI Scientist, evidence package, human decision, and validated deployment.
3. Make safety boundaries and human authority visually unmistakable.
4. Connect every major concept to one fictional but engineering-realistic asset: P-101, a boiler feed water pump.
5. Provide a deterministic interactive experiment demonstrator using clearly labeled synthetic fixture results.
6. Establish reusable content, data, diagram, metadata, and navigation foundations for future phases.
7. Produce a mostly static, accessible, responsive site deployable to Azure Static Web Apps.

## 4. Non-goals

Phase 1 will not:

- provide a commercial SaaS workflow;
- connect to operational technology or real industrial equipment;
- ingest customer or production data;
- train or execute real machine-learning models;
- present a chatbot as an AI Scientist;
- implement user accounts, billing, a database, or a backend API;
- imply that synthetic fixture results are validated industrial evidence;
- grant any automated system authority over physical machinery.

## 5. Information Architecture

The initial application exposes these routes:

| Route | Purpose |
| --- | --- |
| `/` | Research-publication entry point, thesis, five-stage architecture, selected manifesto principles, P-101, and evidence-backed knowledge |
| `/manifesto` | Twelve principles with cross-links to supporting concepts |
| `/architecture` | End-to-end Twin Lab architecture and Industrial AI safety boundary |
| `/twin-capsule` | Asset hierarchy, registry model, and P-101 Twin Capsule anatomy |
| `/experiment-fabric` | Experiment as a first-class object, validation discipline, and Evidence Package |
| `/experiment-fabric/demo` | Deterministic conceptual experiment demonstrator |
| `/feature-factory` | Raw signals, engineered features, physics relationships, and Residual Intelligence |
| `/algorithm-arena` | Problem-dependent competition among statistical, ML, deep-learning, physics-hybrid, and optimization methods |
| `/fault-lab` | Synthetic fault generation, fault injection, and simulation-validity warning |
| `/ai-scientist` | Hypothesis-to-evidence orchestration outside the control loop |
| `/fleet-intelligence` | Cross-asset validation, portability, organizational learning, and the Knowledge Flywheel |
| `/research` | Extensible catalogue of open research questions and the maturity model |
| `/technology` | Candidate implementation ecosystem, explicitly not a prescribed stack |
| `/glossary` | Cross-linked definitions for the project's technical vocabulary |
| `/about` | Project status, boundaries, roadmap, authorship, and research disclaimer |

No route will be a placeholder. Shorter concept pages may share a common publication layout, but each must contain substantive content, a relevant diagram or structured visual, and cross-links.

## 6. Narrative Structure

The homepage moves through five editorial beats:

1. **Thesis:** Industrial Twin Lab and its central statement.
2. **Operating model:** Physical Asset → Digital Twin → Isolated Experiment Lab → AI Scientist → Evidence Package.
3. **Manifesto:** Selected principles leading to the complete manifesto.
4. **Demonstration asset:** P-101 as the connective tissue across the atlas.
5. **Outcome:** The primary output is evidence-backed machine knowledge, not merely a model.

Deeper pages preserve this progression: establish a question, show a system or experiment, expose evidence and uncertainty, then connect the finding to engineering authority.

## 7. Visual Design

The approved direction is **Research Monograph**.

### 7.1 Character

- dark near-black application shell;
- warm paper-like reading surfaces;
- off-black ink and off-white interface typography;
- one restrained signal orange for critical annotations and active states;
- serif display typography for theses and long-form editorial hierarchy;
- monospace typography for identifiers, captions, provenance, measurements, and system notation;
- thin rules, wide margins, numbered clauses, and archival publication rhythm;
- open layouts, bands, lists, tables, and diagrams instead of repetitive card grids.

### 7.2 Homepage Composition

The approved homepage has:

- a restrained masthead with core routes and an all-sections control;
- a two-column first viewport pairing the title and thesis with the five-stage operating model;
- a full-width dark thesis band;
- a numbered manifesto excerpt;
- a P-101 Twin Capsule and Evidence Package juxtaposition;
- a closing statement leading to the full manifesto.

The visual system must not use generic SaaS patterns, marketing proof sections, decorative badges, AI-brain imagery, cyberpunk glow, stock factory photography, excessive gradients, glassmorphism, or ornamental 3D objects.

### 7.3 Responsive Behavior

Desktop layouts may use asymmetric editorial grids. Tablet and mobile layouts collapse into a clear reading sequence while preserving numbering and data relationships. Diagrams may reflow vertically or become horizontally scrollable only when a vertical transformation would obscure meaning. Navigation becomes a keyboard-accessible disclosure menu. No primary content may require pointer hover to understand.

### 7.4 Motion

Motion is limited to purposeful diagram progression, selection state changes, and subtle content reveals. Every animation respects `prefers-reduced-motion`, and no meaning depends exclusively on animation.

## 8. Technical Architecture

### 8.1 Framework

The application uses the current stable Next.js App Router, React, TypeScript, Tailwind CSS, and MDX versions available at implementation time. It is configured for static export so Azure Static Web Apps serves prebuilt assets without a Node runtime.

Server Components are the default. Client Components are introduced only for responsive navigation, interactive diagrams whose state adds meaning, and the experiment demonstrator.

### 8.2 Project Boundaries

The project is divided into:

```text
app/                 Routes, layouts, metadata, sitemap, robots, and not-found page
components/          Shared publication, diagram, navigation, and demo components
content/             Long-form MDX and structured editorial content
lib/                 Types, fixtures, selectors, metadata helpers, and deterministic demo logic
public/              Static icons and social metadata assets
docs/                Architecture decisions and implementation documentation
tests/               Unit, integration, accessibility, and browser tests
```

Components must have clear ownership. Route files compose content and components; they do not contain the full long-form publication copy or duplicate diagram implementations.

### 8.3 Content Layer

Long-form manifesto, concept, research, glossary, and technology content is stored outside route components in MDX or typed content modules. Frontmatter supplies title, description, order, status, cross-links, and metadata where applicable.

Content collections are validated during build. Broken slugs, duplicate identifiers, missing required metadata, invalid cross-links, and inconsistent research-question identifiers fail validation rather than silently publishing incomplete content.

### 8.4 Domain Types

TypeScript models cover at minimum:

`Asset`, `TwinCapsule`, `Sensor`, `Feature`, `FailureMode`, `Experiment`, `Dataset`, `Algorithm`, `ModelCandidate`, `ExperimentResult`, `Hypothesis`, `Evidence`, `ResearchQuestion`, `Technology`, and `GlossaryTerm`.

Types describe stable conceptual contracts. UI-specific display values remain outside domain entities. Fixtures are imported through narrow repository functions so a later API or database can replace local storage without rewriting every component.

## 9. P-101 Demonstration Asset

P-101 is a fictional centrifugal boiler feed water pump driven by an electric motor. Its fixtures include eleven named signals and six failure modes defined in the project brief. Pages reuse the same identifiers, engineering units, labels, experiment IDs, and version metadata.

The fictional status is visible wherever P-101 data might otherwise be mistaken for plant evidence. Values must be plausible enough to communicate the concept but must not claim to originate from a physical installation.

## 10. Interactive Experiment Demonstrator

The `/experiment-fabric/demo` route lets a visitor choose:

- machine: P-101;
- problem: bearing degradation;
- feature set: Process, Vibration, Physics, or Combined;
- algorithm: Isolation Forest, XGBoost, Autoencoder, or Physics Residual;
- validation: Time Split, Walk Forward, or Leave-One-Regime-Out.

A pure deterministic function maps the complete selection to fixture results. The function has no randomness, network dependency, or claim of real computation. It produces comparable Detection Rate, False Alarms, Lead Time, Inference Cost, Sensor Count, Robustness, and Explainability values plus a complete Evidence Package.

The following disclosure remains visible with the results:

> Conceptual demonstration — synthetic fixture results.

Changing a selection updates the evidence view, announces the result to assistive technology without disruptive focus movement, and preserves a stable layout. Invalid or incomplete states cannot generate a result.

## 11. Reusable Visual Primitives

Reusable components include:

- flow and stage diagrams;
- zoned safety-boundary diagrams;
- asset hierarchy and Twin Capsule anatomy;
- experiment pipeline and configuration anatomy;
- evidence matrix and Evidence Package;
- maturity progression;
- technology maps;
- Knowledge Flywheel;
- provenance record.

Components use semantic HTML for their underlying relationships. CSS and small inline SVG elements provide connectors, arrows, and diagram geometry. Each complex visual has an accessible textual equivalent, useful captions, and responsive behavior.

## 12. Safety and Truthfulness

Safety messaging is structural, not a footer disclaimer. The architecture page separates OT Control, Data Access, Twin, AI Experiment, Validation Gate, and Approved Inference zones. The AI Scientist page explicitly states that orchestration and recommendation are different from control authority.

Synthetic data, simulated faults, confidence values, and experiment results are labeled at the point of use. The application does not present fictional results as measurements, benchmark claims, production evidence, or safety certification.

## 13. Failure and Edge States

- Unknown routes render a useful publication-style 404 page with links to the index, manifesto, and glossary.
- Missing fixture references or invalid content relationships fail build validation.
- Interactive controls begin with valid deterministic defaults and never show an empty pseudo-dashboard.
- Diagrams remain understandable when CSS animation is unavailable.
- Content and core navigation remain usable without client-side JavaScript; only the experiment result interaction requires hydration.
- External technology references open safely and are clearly distinguished from internal routes.

## 14. Accessibility

The implementation targets WCAG 2.2 AA practices:

- semantic landmarks and heading hierarchy;
- visible keyboard focus;
- skip navigation;
- adequate text and non-text contrast;
- accessible menu and disclosure behavior;
- labeled controls and status announcements;
- table semantics for evidence matrices;
- textual alternatives for diagrams;
- sufficient touch targets;
- reduced-motion support;
- responsive typography without clipping at narrow widths and browser zoom.

## 15. Metadata and Discoverability

Phase 1 includes global and route-specific metadata, canonical URLs, Open Graph and social metadata foundations, sitemap generation, robots configuration, favicons, and structured descriptions. Titles emphasize research and experimentation rather than unvalidated product claims.

## 16. Validation Strategy

The local validation contract will expose explicit Setup, Run, Validate, and Stop commands. Validation includes:

1. formatting and lint checks;
2. strict TypeScript compilation;
3. content and cross-link validation;
4. unit tests for deterministic fixture logic and key selectors;
5. production static build;
6. browser smoke tests for every route;
7. interaction tests for navigation and the experiment demonstrator;
8. desktop and mobile visual inspection;
9. accessibility checks on representative pages;
10. project-scoped shutdown verification with no development server left running.

## 17. GitHub and Azure Publication

The source of truth is the public GitHub repository `aserdargun/itl-aserdargun-com` with `main` as the default branch.

After local validation:

1. commit and push the verified implementation to `main`;
2. create or configure a dedicated Azure Static Web Apps resource for this repository;
3. deploy the prebuilt static output through GitHub Actions;
4. correlate the pushed commit, workflow run, Azure deployment status, and generated Azure hostname;
5. bind `itl.aserdargun.com` using the required ownership and CNAME records;
6. verify authoritative and public DNS, Azure domain readiness, TLS certificate coverage, HTTPS behavior, content identity, and browser rendering;
7. stop all project-owned local development listeners.

Azure credentials, deployment tokens, resource state, DNS records, and certificates are treated as live external state and checked immediately before use. No unrelated repository, Azure resource, or DNS record is modified.

## 18. Architectural Extension Points

Phase 1 keeps stable seams for future Twin Capsule editing, dataset import, Python experiment execution, experiment registries, FMU/Modelica simulation, a local tool-using AI Scientist, industrial connectors, and fleet learning. These are documented directions rather than hidden partial implementations.

Future runtime services must remain separated from the static publication, and any control-facing capability requires a distinct safety design and authorization model.

## 19. Definition of Done

Phase 1 is complete when:

- every route contains substantive English content and works as a static page;
- the visitor can explain why, what, how, safety, science, and future evolution without external guidance;
- the Research Monograph design is coherent across desktop and mobile;
- P-101 references are internally consistent;
- the experiment demonstrator is deterministic, interactive, and visibly synthetic;
- evidence, uncertainty, limitations, provenance, and human authority are prominent;
- validation commands pass from a clean checkout;
- the public GitHub repository contains the verified source and documentation;
- Azure Static Web Apps serves the matching commit;
- `itl.aserdargun.com` passes authoritative/public DNS, TLS, HTTPS, content, and browser checks;
- no project-owned local server remains running after handoff.

