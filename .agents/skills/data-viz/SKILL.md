---
name: data-viz
description: Builds the honest, accessible, custom SVG charts of Masrouf (spending pace line, monthly income and expense bars, ranked category bars, budget pace bar) with d3-scale and d3-shape following the chart rules in docs/DESIGN_SYSTEM.md. Use when creating or changing any chart, report visual, finding sentence or table alternative.
---

# Data visualization

## Goal

Charts that answer one question each, read in two seconds, and stay truthful and accessible.

## Instructions

1. **One question per chart, stated as a finding sentence above it.** Generate the sentence from the data ("By day 28 you have spent 159.350 more than by the same day in September, 8% more."). Always include the comparison window.
2. **Use the right form.** Time: line (cumulative) or bars (monthly). Ranking: horizontal bars sorted descending. Part of budget: PaceBar. No pie, donut, gauge, stacked area, dual axis, 3D, gradient fills.
3. **Scales.** `d3-scale` linear and band. Bars start at zero. Round the max up to a clean tick (600, 1200, ...). 3 to 5 faint horizontal grid lines (`--line`), no axis lines, axis text 12px ledger-500 tabular. Never truncate a bar axis.
4. **Color.** Expense series `--chart-expense` (stamp-500), income `--chart-income` (ledger-700), comparison `--chart-compare` (ledger-400, thinner). One hue per chart. Over-budget fill is loss-600. No hue per category.
5. **Labels instead of legends.** Direct-label line ends and bars ("Oct 2,146", "Sep 1,987"). A legend is only allowed when two series cannot be directly labeled. Values are always readable as text.
6. **SpendingPaceChart.** Cumulative spend by day for this month (stops at today, no future zeros) and last month (all days). A 1px today line, end dot and label. Missing days are gaps in the data, not zeros in the middle of the line.
7. **PaceBar.** 10px track (radius 4), fill ledger-700 clipped to 100% (loss-600 when over), a 2px ink tick at expected spend extending 4px above and below, status tag, "186.500 of 150.000". Percent is never the only carrier of the value.
8. **Responsive.** SVG with `viewBox`, `width: 100%`. Increase text size inside the SVG at narrow widths so rendered text never drops below 11px. Reduce tick count on mobile.
9. **Accessibility.** `role="img"` with an `aria-label` that states the finding. A `View as table` toggle revealing a real `<table>` of the same data. Charts are never the only carrier of a number. Do not trap keyboard focus in the SVG. Comparison line meets 3:1.
10. **Motion.** None on mount, none on data change except a 150ms opacity cross-fade between ranges if needed. Respect reduced motion.
11. **States.** Loading skeleton with the chart's frame. Empty: draw the zero line and one sentence ("No spending recorded in October yet."), no illustration. Error with retry.
12. **Formatting.** All numbers through `formatMoney`/`Intl`, the currency stated once in the panel header.

## Tests

Component tests: finding sentence text, table alternative content equals the chart data, accessible name present, empty state, mobile text sizing class, no animation attributes. Unit tests for tick calculation and sentence generation.

## Constraints

- No charting kit, no chart that cannot be read without color.
- No data transformation inside the chart component. Pass it prepared series.
