---
name: design-review
description: Reviews the running Masrouf interface against docs/DESIGN_SYSTEM.md using browser screenshots at 1440, 768 and 390 pixels, checking 60/30/10 color balance, typography, money display, chart rules, states and accessibility, then fixes the differences. Use after any UI change, before declaring a screen finished, or when the interface looks generic.
---

# Design review

## Goal

Find the problems code review cannot see and fix them in a short loop.

## Instructions

1. Start the app, sign in with the demo account, open `docs/design-reference.html` beside it.
2. Capture **1440, 768 and 390px** screenshots of: Overview, Transactions (with filters active), transaction drawer (clean and with errors), Budgets, Reports (each range), Accounts, Settings, sign in and register. Include loading, empty and error states and a screen with a long payee and a very large amount.
3. **Balance check (60/30/10).** Squint. Paper dominates, ledger reads as structure, stamp blue is a few small marks (the primary button and the expense series). Gain, loss and warn only on money semantics and status.
4. **Craft checks:** squint test (hierarchy survives blur), swap test (would swapping fonts or layout for defaults change the feel?), signature test (point to five places the Pace Marker idea shows), token test (no raw hex, no off-scale spacing or radius).
5. **Typography:** only Source Serif 4 and Source Sans 3, only the scale in the design system, serif absent from controls, all numbers tabular and right-aligned in tables, no text under 12px at any width.
6. **Money display:** fixed decimals, true minus on expenses, `+` in gain on income, currency once per view, no abbreviations, deltas stated with their window, en dash for missing values.
7. **Charts:** one hue per chart, no banned chart types, finding sentence present, 3 to 5 faint grid lines, direct labels, "View as table" works, readable at 390px.
8. **States:** hover, focus-visible, active, disabled, loading, empty, error all exist and look intentional.
9. **Web interface guidelines** (Vercel's list, fetch the latest from `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` when network allows): icon buttons labeled, inputs have labels and correct `type`, `autocomplete` and `inputmode`, no `transition: all`, reduced motion honored, long text truncates or wraps without breaking layout (`min-w-0`), loading labels end with an ellipsis, links are `<a>` and actions are `<button>`, zoom is not disabled, focus never removed without a replacement, `touch-action: manipulation` on controls, dates and numbers use `Intl`.
10. **Accessibility:** keyboard-only pass through add transaction, filter, edit, delete with Undo, set a budget. Contrast spot-check, reduced motion on.
11. **Report as a table** with Before, After, Why, ranked by severity. Fix the top issues in tokens or components (never one-off overrides), re-capture, re-check. Stop after three iterations or when clean.

## Constraints

- Match the design system, do not reinvent it.
- Do not add decoration to make a screen "feel designed". Fix hierarchy, spacing and copy first.
