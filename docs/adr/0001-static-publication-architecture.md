# ADR 0001: Static publication architecture

- Status: Accepted
- Date: 2026-08-24
- Scope: Industrial Twin Lab Phase 1

## Context

Phase 1 must publish a substantive English research monograph, a cross-linked technical atlas, and one deterministic concept demonstrator. It must remain legible without application state, distinguish fictional fixtures from real evidence, avoid implying a production control system, and deploy as prebuilt files to Azure Static Web Apps.

The content needs editorial ownership and build-time validation. Stable engineering concepts need typed contracts, while the small interactive surface must work without a database, remote computation, or nondeterministic model execution.

## Decision

Use the Next.js App Router in static-export mode with MDX publications, typed TypeScript fixtures and catalogues, Server Components by default, and minimal client JavaScript only where interaction adds meaning.

- Next.js owns routing, layouts, route metadata, static export, and the shared publication shell.
- MDX keeps long-form argument and document structure outside route composition files.
- Typed fixtures and validators make identifiers, cross-links, P-101 records, experiment selections, evidence, and disclaimers fail closed during local validation and builds.
- Native HTML, CSS, and restrained inline SVG keep diagrams inspectable and accessible.
- Client JavaScript is limited to responsive navigation and the deterministic experiment demonstrator. No Phase 1 interaction depends on a network service.

## Alternatives considered

### Astro

Astro would be a credible static-publication framework with a small client payload. We did not choose it because the repository's accepted implementation already uses the Next.js App Router and React component model, and Next static export satisfies the same no-runtime hosting boundary without introducing a second framework or migration during Phase 1.

### Backend application and database

A backend could support persisted Twin Capsules, datasets, experiment jobs, provenance records, accounts, and authorization. Those capabilities are not Phase 1 requirements. Introducing them now would create operational, privacy, security, and lifecycle claims that the fictional publication does not validate.

### Headless CMS

A CMS could provide non-code editorial workflows, but it would add a remote availability and schema dependency while weakening the repository-local link, identifier, and disclaimer validation contract. Phase 1 content changes remain reviewable with the code and build together.

## Consequences

Benefits:

- Azure serves immutable build assets without a Node runtime.
- Most content remains usable without client-side JavaScript.
- Publication copy, typed evidence fixtures, and validation evolve in one reviewed source tree.
- Deterministic local builds are straightforward to inspect and reproduce.

Costs and constraints:

- Every content change requires a repository change and rebuild.
- There is no runtime authoring, persistence, search index, experiment execution, user identity, or per-user state.
- Next's static output and hosting configuration must be checked together, including trailing slashes, 404 behavior, CSP compatibility, and cache headers.
- Interactive code must preserve deterministic fixtures and cannot silently become a proxy for real model execution.

## Boundaries and future change

The static publication remains separate from future runtime services. Dataset import, Python experiment execution, FMU or Modelica simulation, experiment registries, local tool-using orchestration, industrial connectors, and fleet learning require explicit architecture decisions and independent authorization.

No future service may infer control authority from this publication. Any path toward operational technology requires a distinct threat and safety model, plant-specific evidence, validation gates, auditable human approval, and a deliberately designed interface between publication, experiment, inference, and control environments.
