# Phase 1 Fidelity Ledger

**Review date:** 2026-08-24

**Verification target:** static export served from `http://127.0.0.1:4173`

**Source hierarchy:** approved Phase 1 specification → written visual system →
five PNG composition references

The rendered screenshots were captured with the in-app browser's documented
`tab.screenshot` viewport API after an explicit `scrollTo(0, 0)` and DOM geometry
check. The requested CSS viewports are recorded below; the in-app browser raster
excludes its scrollbar/chrome (for example, the `1440 × 1000` CSS viewport
produces a `1425px` content width). Exact `1440 × 1000`, `1024 × 768`,
`768 × 1024`, and `390 × 844` behavior is independently enforced by Playwright.
No image below is a stitched or claimed full-page capture.

## Evidence inventory

| Surface         | Reference                                          | Latest matching viewport render                                                                                                  | Viewport          |
| --------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Homepage        | `docs/design/phase-1/homepage-concept.png`         | `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-homepage-top-1440x1000.jpg`      | `1440 × 1000` CSS |
| Publication     | `docs/design/phase-1/publication-page-concept.png` | `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-manifesto-top-1440x1000.jpg`     | `1440 × 1000` CSS |
| Architecture    | `docs/design/phase-1/architecture-concept.png`     | `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-architecture-top-1440x1000.jpg`  | `1440 × 1000` CSS |
| Experiment demo | `docs/design/phase-1/experiment-demo-concept.png`  | `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-demo-top-1440x1000.jpg`          | `1440 × 1000` CSS |
| Mobile          | `docs/design/phase-1/mobile-concept.png`           | `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-mobile-homepage-top-390x844.png` | `390 × 844` CSS   |

Additional trustworthy viewport/interaction evidence:

- `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-manifesto-top-1024x768.jpg`
- `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-manifesto-top-390x844.jpg`
- `/Users/aserdargun/.codex/visualizations/2026/08/24/01a032ef-a31a-7972-98b9-f6f2f420065b/round1-mobile-menu-open-390x844.png`

All five references and every listed replacement render were inspected with
`view_image`. Repeated-section, black-gap, stale-scroll, and stitched images were
explicitly excluded. The Browser binding does not expose
`tab.playwright.screenshot`; the supported `tab.screenshot` API was used. An
expired prior browser ID first returned `Browser is not available`; the same
browser-client agent was rebound to the inferred localhost target and one new tab
was reused thereafter. Narrow JPEGs were rejected after black-gap inspection and
recaptured as PNG after a viewport reset. A requested lower-section scroll did not
persist through the Browser's read-only page evaluation boundary, so no lower or
full-page image is claimed.

## Homepage comparison

| Dimension          | Observed match                                                                                                                                             | Mismatch                                                                                                | Action                                                                                                                                                               | Final verdict                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Copy/order         | Brand, core navigation, title, exact thesis/deck, operating-thesis label, Figure 01, and five stages follow the approved order.                            | None.                                                                                                   | Protected with route and existing homepage E2E assertions.                                                                                                           | PASS                                      |
| Layout             | The first viewport uses the written `1.18fr / 0.82fr` asymmetric grid and exposes the next dark thesis band at desktop.                                    | None.                                                                                                   | No change.                                                                                                                                                           | PASS                                      |
| Typography/palette | Newsreader display, Inter body, IBM Plex Mono notation, warm paper, deep shell, ink, signal orange, and thin square rules match the visual system.         | None.                                                                                                   | No change.                                                                                                                                                           | PASS                                      |
| Diagram treatment  | Numbered semantic rows and rules preserve the stage relationship.                                                                                          | The concept includes illustrative glyphs.                                                               | No runtime artwork was copied: the written contract makes semantic, selectable HTML primary and treats generated marks as incidental.                                | ACCEPT — intentional                      |
| Page rhythm        | The top viewport establishes hero, operating thesis, and the next dark thesis band; source order and E2E assertions cover the remaining semantic sections. | Shared Twin Capsule and Evidence Package records make the real page longer than the compressed concept. | Retained complete limitations, provenance, synthetic disclosure, units, and human authority as required by the specification; no full-page screenshot claim is made. | ACCEPT — higher-priority content contract |

## Publication comparison

| Dimension               | Observed match                                                                                                                                          | Mismatch                                                                 | Action                                                                                                                                                                                                                                                                                               | Final verdict            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| Identity/copy           | One H1 identifies the substantive manifesto, followed by the exact thesis and complete validated English source.                                        | The concept's illustrative title is shorter.                             | The validated MDX publication identity outranks concept-only display copy.                                                                                                                                                                                                                           | ACCEPT — source contract |
| Editorial hierarchy     | Large serif H1, italic pull quote, broad reading measure, thin rules, and a named machine-knowledge sequence reproduce the monograph hierarchy.         | None at the tested viewport.                                             | No change.                                                                                                                                                                                                                                                                                           | PASS                     |
| Running index           | One semantic `Manifesto running index` complementary region contains one uniquely named `Manifesto principles` navigation with 12 exact fragment links. | Initial review found the page-specific rail missing.                     | Implemented the narrow rail because written design-system section 6 explicitly requires “Long-form pages use a narrow running-index column and one broad reading column.” It sits beside the reading column above `850px`, then reflows above it without duplicate navigation below that breakpoint. | FIXED / PASS             |
| Principle treatment     | Twelve semantic sections use open ruled rows/columns rather than SaaS cards, with exact numbered titles, evidence, and notes.                           | The complete publication is denser than the three-row concept crop.      | Kept the complete twelve-principle content required by the specification.                                                                                                                                                                                                                            | PASS                     |
| Active/navigation state | Manifesto remains exact-active; `/experiment-fabric/demo/` marks the segment-boundary parent Experiment Fabric in all-sections.                         | Round 1 found nested publication routes were not represented as current. | Added root-preserving slash normalization plus exact-or-segment matching, with negative prefix/sibling regression cases.                                                                                                                                                                             | FIXED / PASS             |

## Architecture comparison

| Dimension           | Observed match                                                                                                                                                                | Mismatch                                                                                       | Action                                                                                                                | Final verdict              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Zone order          | Six numbered zones remain in the required OT Control → Data Access → Twin → AI Experiment → Validation Gate → Inference order.                                                | Runtime labels add `Zone` where the typed catalogue does.                                      | Retained the canonical data catalogue and exact DOM order.                                                            | PASS                       |
| Composition         | A narrow title/notation rail sits beside a broad six-zone plate at desktop.                                                                                                   | The substantive publication introduction places the plate lower than the diagram-only concept. | Kept the source-backed safety explanation; no clipping or overflow occurs and the plate begins in the first viewport. | ACCEPT — editorial context |
| Safety notation     | Solid directional flow, dashed isolated boundary, orange perpendicular human stop, visible labels, and textual no-direct-control equivalent are present.                      | Generated line-art icons are absent.                                                           | Retained code-native semantic zones and textual equivalents; incidental artwork was not copied.                       | PASS                       |
| Human authority     | `Human in command`, `Human validation gate`, and the no-return path are visible and programmatic, not color-only.                                                             | None.                                                                                          | Covered by accessibility and architecture tests.                                                                      | PASS                       |
| Responsive behavior | The same six body labels remain in exact DOM order with non-zero readable geometry and unclipped headings; mobile stacks them while tables retain labeled internal scrolling. | None.                                                                                          | Verified in the automated `1440`, `1024`, `768`, and `390` viewport matrix.                                           | PASS                       |

## Experiment demo comparison

| Dimension            | Observed match                                                                                                                              | Mismatch                                                       | Action                                                                                                                                                 | Final verdict                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- |
| Layout               | Configuration rail precedes a broad evidence ledger with square controls, table, summary ledger, and Evidence Package.                      | None.                                                          | No change.                                                                                                                                             | PASS                                  |
| Deterministic values | Seven named metrics render exact typed fixture values and update to the same result for the same selection.                                 | The concept intentionally shows placeholder composition marks. | Kept fixture-backed textual values; the written system explicitly forbids deriving values from the PNG.                                                | PASS                                  |
| Interaction          | Native selects update immediately, preserve focus in user interaction, and announce the new experiment ID in a polite atomic live region.   | The concept includes a `Run conceptual experiment` button.     | No button was added: the approved interaction contract requires immediate deterministic updates.                                                       | ACCEPT — written interaction contract |
| Disclosure/authority | The exact synthetic disclosure is adjacent to results; `Human review required`, limitations, and provenance remain visible.                 | None.                                                          | Covered by route, demo, and axe tests.                                                                                                                 | PASS                                  |
| Touch/overflow/focus | All five selects are at least 44px high, focus uses the light-surface signal-ink token, and wide metrics scroll only within a named region. | None.                                                          | All five controls, the exact synthetic disclosure, deterministic update/reload, live status, and overflow are verified at all four required viewports. | PASS                                  |

## Mobile comparison

| Dimension          | Observed match                                                                                                                    | Mismatch                                                                                       | Action                                                                                                  | Final verdict                             |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Reading order      | Title → thesis → deck → operating-thesis label → five numbered rows matches the reference.                                        | None.                                                                                          | Protected by responsive and existing homepage tests.                                                    | PASS                                      |
| Header/disclosure  | The 64px dark masthead exposes the brand and a 44px labeled three-line all-sections trigger.                                      | The visible count is compacted at narrow width.                                                | Accessible name remains exactly `All sections 13`; no information is lost to assistive technology.      | PASS                                      |
| Menu interaction   | All 13 routes appear in one-column order; Escape closes and returns focus, route selection navigates, and main remains reachable. | None.                                                                                          | Captured open-menu evidence and exercised the full interaction loop.                                    | PASS                                      |
| Reflow/overflow    | The document is a single column with `scrollWidth === clientWidth`; tables scroll only in named keyboard-focusable regions.       | None.                                                                                          | Verified across all 15 routes at `390 × 844` and at the other required viewports.                       | PASS                                      |
| Below-fold density | Twin Capsule precedes Evidence Package and both preserve paper/shell treatment and disclosures.                                   | Complete semantic records make the page longer than the summary artwork in the mobile concept. | Retained higher-priority source completeness and safety/truthfulness evidence; no essential copy clips. | ACCEPT — higher-priority content contract |

## Final visual ruling

No fixable Critical or Important mismatch remains. Round 1 fixed the nested
all-sections active state, implemented the written long-form running-index grid,
expanded the exact four-viewport behavioral matrix, and replaced the evidence
inventory with inspected viewport-only captures. The document-wide H1 wording
minor remains unchanged. Reference-only glyphs, placeholder values, the concept's
explicit run button, compressed records, and illustrative folio treatment were
not copied because the written specification and design system outrank incidental
generated marks.
