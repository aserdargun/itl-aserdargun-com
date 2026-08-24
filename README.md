# Industrial Twin Lab

Industrial Twin Lab is an English, public research publication about how digital twins can support isolated, reproducible industrial machine-intelligence experiments. Its central thesis is: **Build machine intelligence in the twin before trusting it in the machine.**

## Why this exists

Industrial AI work can collapse simulation, statistical evidence, engineering judgment, and control authority into one misleading story. This publication separates those concerns. It gives engineers a shared vocabulary, a safety architecture, typed fictional fixtures, and a deterministic concept demonstrator for examining evidence before any intervention is considered.

The problem is not simply selecting a model. It is establishing whether a claim generalizes, what uncertainty and limitations remain, where the evidence came from, and who retains authority over a physical machine.

## Non-goals

Phase 1 is not a commercial product or SaaS workflow. It does not connect to operational technology, ingest customer or production data, train or execute real machine-learning models, provide accounts or a backend, certify safety, or give an automated system control authority.

## Principles

- Twin before intervention.
- Physics before pure correlation.
- Evidence before deployment.
- Local-first operation and isolation by design.
- Human engineering authority remains in command.
- Models and features compete under identical conditions.
- Synthetic evidence is never presented as reality.
- Trust requires evidence, uncertainty, provenance, assumptions, and limitations.

The complete twelve-clause manifesto is published at `/manifesto/`.

## Status and boundaries

Publication status: **Research / Experimental**. The source repository is the public `aserdargun/itl-aserdargun-com` repository. Phase 1 is a static publication and concept demonstrator; this Task 13 revision does not publish or deploy it.

- Implemented: the publication route tree, MDX articles, typed fictional P-101 fixtures, code-native diagrams, deterministic synthetic experiment demonstrator, metadata, crawl files, and static-hosting contract.
- Conceptual: Twin Capsule workflows, evidence-led model evaluation, fault simulation, AI Scientist orchestration, and cross-asset learning.
- Planned: separately designed services for dataset import, experiment execution, registries, simulation, industrial connectors, and fleet learning.

Future runtime services must stay separate from the static publication. Any control-facing capability requires an independent safety design, explicit authorization, plant-specific validation, and human engineering governance.

## Local lifecycle

Prerequisites: a current Node.js runtime compatible with Next.js 16 and npm.

### Setup

```bash
npm ci
```

### Run

```bash
npm run dev:codex
```

The project-local development server binds only to `127.0.0.1:4173`.

### Validate

```bash
npm run validate:codex
```

This package script checks formatting, lint, TypeScript, content relationships, unit tests, the static production build, and browser tests.

### Stop

```bash
npm run stop:codex
```

The Stop script is deliberately scoped to port `4173`. It verifies that a listener's working directory is this repository before sending a termination signal, and refuses to stop a foreign process.

To inspect the already-built static export locally, run `npm run start:static`; stop it with the same project-scoped Stop command.

## Azure target

The intended static-hosting target is Azure Static Web Apps at `https://itl.aserdargun.com`. The exported `out/` directory is the deployable artifact. `staticwebapp.config.json` defines trailing-slash behavior, document-only 404 fallback, security headers, and cache policy; the eventual deployment workflow must place that file at the deployed output root. Azure resources, deployment, custom-domain binding, DNS, TLS, and production verification are outside this local Task 13 change.

## Research and industrial-control disclaimer

Industrial Twin Lab is currently a research and concept-development project. Demonstrations must not be interpreted as validated industrial control or safety systems.
