# Design guardrails (always on for any UI work)

Full specification: `docs/DESIGN_SYSTEM.md`. Visual truth: `docs/design-reference.html`. Open the reference before building a screen.

## Must

- **60/30/10.** Paper (neutral ground and surfaces) is about 60% of any screen, ledger (top bar, rules, tracks, text, income series, budget fills) about 30%, stamp blue (one primary action, the expense series, selection) about 10% or less. Gain, loss and warn colors appear on money semantics and status marks only.
- Colors, radii, shadows, fonts and durations come from tokens through Tailwind. A raw hex value or arbitrary Tailwind color in a component is a bug.
- Source Serif 4 600 for titles and big figures, Source Sans 3 for everything else. Fixed rem scale at ratio 1.2. No serif in buttons, inputs, tabs, tags or table cells.
- **Money display:** fixed decimals per currency, `Intl` formatting, currency shown once per view, true minus `−` on expenses in plain ink, `+` in gain-600 on income, right-aligned tabular numerals, no `k` or `M` abbreviations in tables, deltas always stated with their window in words.
- **Charts:** one hue per chart, no pie, donut, gauge, dual axis, gradient fill or 3D, bars start at zero, 3 to 5 faint grid lines, direct labels instead of legends for single series, a finding sentence above, a text summary and a "View as table" alternative, no entrance animation. Custom SVG with d3-scale and d3-shape.
- Each view has one focal element and one primary (stamp) button. Every interactive element has hover (gated by `hover: hover`), focus-visible, active (`scale(.97)`), disabled. Every data view has loading (skeleton), empty (teaches), error (with retry) and populated states.
- Touch targets 44px. Text contrast 4.5:1, UI contrast 3:1: control borders use `ledger-400`, never `--line`. On ledger-100 surfaces use ledger-700 text or darker.
- Motion: transform and opacity only, under 300ms, custom ease-out, never `transition: all`. **Keyboard-initiated actions (`n`, `/`) are instant.** Respect `prefers-reduced-motion`.
- CSS logical properties so right-to-left can be added. Theme browser surfaces (selection, caret, focus ring, scrollbar, accent-color).

## Must not

- Gradients, glass or blur as decoration, glow, hard offset shadows, colored border-left stripes.
- Violet or indigo, a second accent hue, a hue per category, rainbow charts.
- Icon-in-circle KPIs, sparklines on KPIs, donut or pie charts, progress rings.
- Eyebrows, section numbers, ALL-CAPS tracked labels, "Welcome back" heroes, emoji anywhere.
- Nested cards, identical card grids as structure, a modal where a drawer or page works.
- Placeholder content ("Lorem ipsum", "Test", "Item 1").

## Before declaring a screen finished

Run the `design-review` skill at 1440, 768 and 390. Apply the squint test, the swap test, and the signature test (can you point to five places the Pace Marker idea shows up?).
