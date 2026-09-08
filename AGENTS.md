# ITL working contract

- Industrial Twin Lab (itl) — Build the public research publication and deterministic concept demonstrator that separates digital-twin simulation, statistical evidence, engineering judgment, and control authority in industrial machine intelligence.
- Keep publication routes in `app/`, MDX articles in `content/`, deterministic demonstrator logic in `lib/experiments`, and typed domain truth in `lib/domain`; Phase 1 is a static publication — no real ML training, OT connectors, customer or production data, accounts, or backend services.
- Synthetic experiment outputs and typed P-101 fixtures are observer outputs only. Hypothesis, evidence provenance, uncertainty, and limitations are decision inputs; the four authorities (training, recommending, approving an inference model, changing a physical setpoint) are never collapsed into one.
- Behavior, experiment, world, simulation, metric, and export schema versions are explicit. Update affected versions when semantics change.
- Every synthetic run is seeded and tick-stamped; the Evidence Package (hypothesis, data and twin versions, feature pipeline, validation regime, uncertainty, limitations, provenance) ships with replay exports. Reject runs that are non-deterministic, unsupported, or whose evidence chain is incomplete.
- Keep Turkish and English controls and explanations equivalent. Label model assumptions and simulation units.
- Verify `npm run validate:codex` and review `git diff --check` before handoff.
- Local work only unless the user authorizes external publication. Preserve unrelated work and processes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
