# Industrial Twin Lab Phase 1 Visual System

**Status:** Approved implementation contract

**Direction:** Research Monograph

**Date:** 2026-08-24

**Applies to:** every Phase 1 route and shared component

## 1. Source hierarchy

When a reference and this document differ, use this order:

1. The approved Phase 1 design specification and its safety/truthfulness rules.
2. This code-native visual contract.
3. The five PNG references in this directory for composition and rhythm.

The PNGs are implementation references, not runtime artwork. All interface text,
controls, tables, icons, arrows, diagrams, and P-101 records must be rendered with
semantic HTML, CSS, and small inline SVG elements. Do not ship screenshot crops or
try to reproduce incidental generated marks, dates, values, or labels that are not
part of the approved content model.

## 2. Character

Industrial Twin Lab is an open technical publication: archival, skeptical,
precise, and calm. It uses a dark application shell around warm paper reading
surfaces; large serif theses; compact monospace notation; thin rules; numbered
clauses; asymmetrical editorial grids; and one restrained signal orange.

Use bands, lists, tables, ledgers, and diagrams. Do not use repetitive card grids,
decorative badges, rounded SaaS panels, marketing proof strips, AI-brain imagery,
cyberpunk glow, glassmorphism, stock factory photography, ornamental 3D objects,
or decorative gradients.

## 3. Color tokens

```css
:root {
  color-scheme: light;

  --color-shell: #292a27;
  --color-shell-deep: #11120f;
  --color-paper: #e9e4d8;
  --color-paper-raised: #f2eee5;
  --color-paper-technical: #d7d2c6;
  --color-ink: #171813;
  --color-ink-muted: #5b5953;
  --color-rule: #b9b4a9;
  --color-rule-strong: #817e76;
  --color-rule-dark: #3a3b37;
  --color-text-on-dark: #eeeae0;
  --color-text-on-dark-muted: #a9aaa4;
  --color-signal: #df5b2f;
  --color-signal-ink: #9b3b1a;
  --color-focus-on-light: #9b3b1a;
  --color-focus-on-dark: #df5b2f;
  --color-focus: var(--color-focus-on-light);
}

.surface-dark {
  --color-focus: var(--color-focus-on-dark);
}
```

- `--color-signal` is the bright brand accent. On dark surfaces it may be used for
  focus geometry, active underlines, and large marks. On light surfaces it is
  decorative only and cannot carry meaning by itself: `#df5b2f` is only `2.92:1`
  on `--color-paper`.
- `--color-signal-ink` is required for small orange text, clause numbers, critical
  annotations, selected-control borders, safety boundaries, and other meaningful
  orange marks on light surfaces.
- Focus uses the surface-aware `--color-focus`: `--color-focus-on-light` on every
  paper surface and `--color-focus-on-dark` on both shell surfaces.
- Paper sections alternate only when hierarchy needs it; they are not cards.
- Dark bands use `--color-shell-deep`, never a gradient.
- Body copy uses `--color-ink` or `--color-ink-muted`; muted text must still meet
  WCAG 2.2 AA contrast at its rendered size.

Contrast values below use WCAG sRGB relative luminance and are minimums across the
listed allowed surfaces:

| Token pair | Contrast | Allowed use |
| --- | ---: | --- |
| `#5b5953` on `#e9e4d8` | `5.52:1` | Muted normal text on primary paper |
| `#5b5953` on `#f2eee5` | `6.05:1` | Muted normal text on raised paper |
| `#5b5953` on `#d7d2c6` | `4.64:1` | Muted normal text on technical paper |
| `#9b3b1a` on `#e9e4d8` | `5.46:1` | Signal normal text and focus on primary paper |
| `#9b3b1a` on `#f2eee5` | `5.98:1` | Signal normal text and focus on raised paper |
| `#9b3b1a` on `#d7d2c6` | `4.59:1` | Signal normal text and focus on technical paper |
| `#df5b2f` on `#292a27` | `3.90:1` | Non-text focus/active geometry on shell |
| `#df5b2f` on `#11120f` | `5.08:1` | Focus/active geometry on deep shell |

Do not substitute the original `#6d6b63` muted text or bright `#df5b2f` light-
surface text for these accessible tokens.

## 4. Typography

```css
:root {
  --font-display: Georgia, "Times New Roman", serif;
  --font-body: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}
```

| Token | Size / line height | Weight | Tracking | Use |
| --- | --- | --- | --- | --- |
| `display-hero` | `clamp(3.375rem, 6.6vw, 6.5625rem) / 0.88` | 400 | `-0.065em` | Homepage title |
| `display-band` | `clamp(2.3125rem, 4.3vw, 4.5rem) / 1` | 400 | `-0.045em` | Thesis and closing bands |
| `display-page` | `clamp(3rem, 5vw, 5.5rem) / 0.94` | 400 | `-0.05em` | Publication page title |
| `heading-section` | `clamp(2.25rem, 3.6vw, 3.25rem) / 1` | 400 | `-0.04em` | Section titles |
| `heading-item` | `clamp(1.5rem, 2.1vw, 2.25rem) / 1.08` | 400 | `-0.03em` | Stages and clauses |
| `deck` | `1.375rem / 1.28` | 400 italic | `0` | Pull quote / thesis deck |
| `body-long` | `1.125rem / 1.72` | 400 | `0` | Long-form article copy |
| `body` | `0.9375rem / 1.6` | 400 | `0` | Supporting copy |
| `body-small` | `0.8125rem / 1.55` | 400 | `0` | Captions and table notes |
| `meta` | `0.6875rem / 1.5` | 500 | `0.08em` | Labels, folios, identifiers |

Display and item headings use `--font-display`. Paragraphs use `--font-body`.
Identifiers, measurements, navigation, captions, provenance, table headings, and
control labels use `--font-mono`. Meta text is uppercase except where case is part
of a technical identifier. Do not set interface text below `0.6875rem` (11px).

## 5. Spacing and geometry

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-14: 3.5rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  --border-hairline: 1px;
  --radius: 0px;
  --control-height: 44px;
}
```

- All publication panels, controls, tables, and diagram zones have square corners.
- Default rules are `1px solid var(--color-rule)`; emphasized divisions use
  `var(--color-ink)` on paper and `var(--color-rule-dark)` on dark surfaces.
- Do not use shadows inside the publication. The desktop paper may have one shell
  shadow: `0 24px 90px rgb(0 0 0 / 0.32)`.
- Use whitespace before adding a container border. Nested framed boxes are limited
  to technical records, safety zones, and native form controls.

## 6. Containers and page grids

| Container | Exact contract |
| --- | --- |
| Application sheet | `width: min(1440px, calc(100% - 36px))`; `margin-inline: auto` |
| Desktop section gutter | `58px` |
| Desktop diagram gutter | `44px` |
| Tablet gutter | `32px` |
| Mobile gutter | `24px` |
| Long-form measure | `min(72ch, 760px)` |
| Wide article/diagram | `min(1280px, 100%)` |
| Masthead | `70px` desktop; `64px` mobile |
| Minimum interactive target | `44px × 44px` |

Desktop may use asymmetric grids. The homepage first viewport is
`minmax(0, 1.18fr) minmax(0, 0.82fr)`. Long-form pages use a narrow running-index
column and one broad reading column. Architecture uses a title/legend rail plus a
six-zone plate. The experiment demo uses a configuration rail plus a broad
evidence ledger. The rail is never a floating dashboard sidebar.

## 7. Masthead

- Desktop: `70px` high; three columns (`1.2fr 1fr auto`); `30px` inline padding;
  brand left, core navigation centered, all-sections control right.
- The core links are exactly `Index`, `Manifesto`, `Architecture`, `Research`, and
  `About`. The control label is `All sections 13`.
- Active navigation uses light text plus a `2px` signal-orange underline. Inactive
  links use `--color-text-on-dark-muted` and become light on hover/focus.
- At `850px` and below, hide the horizontal route list and show a labeled
  `All sections` disclosure button. The button is at least `44px` high, includes a
  three-line menu icon, exposes `aria-expanded`, and returns focus to the trigger
  when closed.
- The masthead is sticky only when it does not obscure the current heading or
  focused control. Add the skip link before it.

## 8. Allowed first-viewport copy

Use the following strings verbatim and in this reading order. Do not add a badge,
CTA, metric, customer proof, or alternate product claim to the first viewport.

```text
Industrial Twin Lab / ITL
Index
Manifesto
Architecture
Research
About
All sections 13

Industrial Twin Lab
Build machine intelligence in the twin before trusting it in the machine.
An isolated experimentation environment for digital twins, industrial AI, simulation, and evidence-driven machine intelligence.

The operating thesis
Figure 01
01 Physical asset — Reality
02 Digital twin — Representation
03 Isolated experiment lab — Inquiry
04 AI scientist — Reasoning
05 Evidence package — Decision
```

The title/thesis/deck occupies the left column on desktop. The five stages occupy
the right column. On mobile, title/thesis/deck comes first and the five stages
follow as full-width numbered rows.

## 9. Homepage order

The homepage uses this fixed order:

1. Masthead.
2. Title, thesis, deck, and five-stage operating model.
3. Dark thesis band: `Never let AI perform its first experiment on the physical machine.`
4. Selected numbered manifesto principles.
5. P-101 demonstration asset with the Twin Capsule and Evidence Package juxtaposed.
6. Closing evidence-backed-machine-knowledge statement and manifesto link.

Independent application-map or route links must not be removed to simplify this
composition.

## 10. Component families

- `PublicationShell`: dark outer field and paper section sequence.
- `Masthead` and `SectionDisclosure`: global route access on desktop and mobile.
- `MonographHero`: title, thesis, deck, and the adjacent operating model.
- `SectionHeading`: running label, serif heading, rule, and optional figure number.
- `StageList`: ordered relationships with semantic `ol` markup.
- `ThesisBand`: one large claim plus compact supporting principles.
- `ClauseList`: numbered manifesto/research clauses; rows or open columns, not cards.
- `TechnicalLedger`: definition lists and record tables for identifiers/measurements.
- `TwinCapsulePlate`: P-101 identity, signal count, failure modes, and version.
- `EvidencePackage`: hypothesis, method, limitations, provenance, and human authority.
- `ZonedArchitecture`: six semantic zones with a textual equivalent.
- `ExperimentConfigurator`: labeled native controls with deterministic valid defaults.
- `EvidenceResultTable`: seven named metrics followed by Evidence Package metadata.
- `ClosingStatement`: editorial outcome plus a text-link arrow.

Components inherit paper/shell surfaces from their section. A bordered component is
not automatically a card and must not gain radius, drop shadow, badge chrome, or
independent marketing copy.

## 11. Diagram connectors and safety notation

- **Controlled data / evidence flow:** `1px solid var(--color-ink)` with a simple
  `6px` triangular arrowhead. Use only for a known one-way relationship.
- **Isolated zone boundary:** a closed `1px dashed var(--color-ink-muted)` rectangle
  with a `4px 5px` dash pattern. Dashed styling is never a connector, flow line, or
  arrow.
- **Human authority / no direct control:** an ink line ending at a `12px`
  perpendicular `--color-signal-ink` stop bar on paper; the human gate uses the
  same signal-ink cross-bar and a visible human-review label. On a dark legend,
  the stop bar may use `--color-signal`.
- Other safety boundaries use `2px solid var(--color-signal-ink)` on light
  surfaces. They remain paired with a text label and never rely on color alone.
- Connectors turn at right angles. They do not glow, animate continuously, weave
  behind labels, or cross unrelated zones.
- The architecture zone order is exactly `OT Control` → `Data Access` → `Twin` →
  `AI Experiment` → `Validation Gate` → `Approved Inference`.
- No connector may run from AI Scientist, Evidence Package, Approved Inference, or
  any experiment result back into P-101 or OT Control. A textual alternative must
  state the same boundary.

## 12. Icon inventory

Use small inline SVG only for: menu, chevron, text-link arrow, external-link mark,
P-101 centrifugal pump and motor, sensor, read-only historian/data store, Twin
Capsule, experiment/search, comparison/plot, method/network, checklist, Evidence
Package document, human decision, and approved-inference endpoint.

- Base grid: `24 × 24`; complex diagram symbols may use `48 × 48` or `64 × 64`.
- Stroke: `1.25px`, `currentColor`, square line caps and joins where practical.
- Fill: none by default. Signal ink may fill only an active mark or gate on paper;
  bright signal may fill the equivalent mark on a dark surface.
- Icons always accompany text in navigation, controls, safety states, and complex
  diagrams. They never substitute for an accessible name.
- Do not use emoji, clip art, AI-brain symbols, decorative factories, or a mixed
  third-party icon vocabulary.

## 13. Interaction states

- Text links: ink text with a `1px` underline offset by `0.35em`. Active/critical
  link text uses `--color-signal-ink` on paper. On dark surfaces, keep link text
  light and use bright signal only for the underline. Hover thickens or shifts the
  underline without moving text.
- Buttons/controls: square corners, minimum `44px` height, `1px` ink border. Primary
  actions use `--color-signal-ink` with light text on paper and a contrast-checked
  surface-specific treatment on dark sections.
- Focus visible: `2px solid var(--color-focus)` with `2px` offset. Light and dark
  surfaces set `--color-focus` as defined in the palette. Never suppress the
  browser focus indicator without replacing it.
- Selected controls: `--color-signal-ink` border/underline on paper, bright signal
  geometry on dark surfaces, plus a text/state cue; color is not the only signal.
- Disabled controls: `0.55` opacity, `not-allowed` cursor, and programmatic disabled
  state. Disabled appearance must not be used for read-only evidence.
- Experiment updates announce through a polite live region and do not move focus.
  Result dimensions stay stable between valid configurations.
- Shipping experiment results are exact deterministic textual values sourced from
  typed fixtures. Each value includes its engineering unit where applicable and an
  assistive-text equivalent. Do not infer a value, scale, rank, or magnitude from
  the non-quantitative composition marks in `experiment-demo-concept.png`.
- The exact disclosure `Conceptual demonstration — synthetic fixture results.`
  remains visible beside every generated result and Evidence Package.

## 14. Responsive behavior

### Desktop: `1101px` and above

- Use the asymmetric grids shown in the desktop references.
- Manifesto clauses may form three open columns divided by rules.
- Architecture stays in six zones when every label remains readable.

### Tablet: `851px` to `1100px`

- Reduce gutters to `32px` and display sizes through their `clamp()` tokens.
- Two-column records may remain side-by-side; architecture may use two horizontal
  rows of three zones with explicit continuation arrows.
- Never shrink diagram labels below the `meta` token.

### Mobile: `850px` and below

- The application sheet becomes `width: 100%` with no outer margin or shadow.
- All page grids collapse to a single reading column; section gutters are `24px`.
- The hero title/thesis/deck precedes the vertical five-stage list.
- Manifesto principles become full-width rows. Twin Capsule precedes Evidence
  Package. Experiment controls precede the result table and Evidence Package.
- Architecture becomes six numbered vertical zones. Horizontal scrolling is
  allowed only if a vertical transformation would destroy the relationship; if
  used, provide a visible scroll cue and the same textual alternative outside it.
- Tables may scroll within a labeled region, but page-level horizontal overflow is
  prohibited. No copy or control may clip at `320px` CSS width or browser zoom.

## 15. Motion and reduced motion

Default transitions are limited to `color`, `border-color`, and `opacity`, last
`120ms`, and use `ease-out`. A diagram may reveal a selected path once, but meaning
cannot depend on that reveal.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

No parallax, ambient looping motion, pulsing status, or animated glow is allowed.

## 16. Image treatment

- Phase 1 UI uses no stock photography and no generated raster imagery as content.
- The five PNGs below are review artifacts only and must not be imported by the app.
- P-101 and architecture imagery is implemented as restrained line art or semantic
  diagrams. It must identify P-101 as a centrifugal boiler feed water pump driven
  by an electric motor, not a refinery, turbine, or generic process plant.
- Future editorial images require a caption, source/provenance, meaningful `alt`,
  square corners, no color effect beyond a restrained warm-paper treatment, and no
  text embedded in the bitmap.

## 17. Native visual-reference inventory

| Reference | Native pixels | Implementation purpose |
| --- | ---: | --- |
| `homepage-concept.png` | `864 × 1821` | Complete homepage order, bands, and desktop editorial rhythm |
| `publication-page-concept.png` | `864 × 1821` | Representative long-form manifesto/publication hierarchy |
| `architecture-concept.png` | `1599 × 984` | Six-zone safety boundary and human-decision gate |
| `experiment-demo-concept.png` | `1536 × 1024` | Configuration ledger, result table, and Evidence Package |
| `mobile-concept.png` | `864 × 1821` | Single-column homepage order and collapsed navigation |

These dimensions are the native generated review files, not CSS breakpoints or
required screenshot sizes.

## 18. Implementation acceptance

Before a UI task is complete, compare it with the relevant reference and verify:

- exact approved copy and section/zone order;
- code-native, selectable text and native/semantic controls;
- no invented claims, results, dates, plant data, or production status;
- synthetic/fictional disclosure at the point of possible confusion;
- no AI-to-OT control path and a dominant human validation gate;
- keyboard-visible focus, sufficient touch targets, textual diagram alternatives,
  and reduced-motion behavior;
- desktop and mobile composition without clipping or page-level horizontal scroll;
- no prohibited SaaS, glow, gradient, glass, badge, stock-image, or card-grid drift.
