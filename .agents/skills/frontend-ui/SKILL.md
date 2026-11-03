---
name: frontend-ui
description: Builds the React, TypeScript and Tailwind interface for Masrouf following docs/DESIGN_SYSTEM.md with the 60/30/10 paper, ledger and stamp palette, Source Serif 4 and Source Sans 3 typography, money display rules and the Pace Marker signature. Use when creating or changing screens, components, forms, tables, drawers, loading, empty and error states, keyboard shortcuts or client data fetching.
---

# Frontend UI

## Goal

Ship screens that are accessible, fast and unmistakably Masrouf, built from tokens and primitives. Open `docs/design-reference.html` before starting.

## Before each component, state briefly

Intent (who, what task, what feel), focal element and how it wins, palette share (60/30/10 check), depth (borders at rest), typography levers, spacing. If you cannot say why, you are defaulting.

## Folder layout

```
apps/web/src/
  app/                  router, providers (QueryClient, Auth, Toaster), TopBar shell
  components/ui/        Button, IconButton, Field, Input, Select, Combobox, AmountInput,
                        Drawer, Dialog, Toast, Skeleton, EmptyState, StatusTag, DataTable, Segmented
  components/charts/    SpendingPaceChart, MonthlyBars, CategoryBars, PaceBar
  features/
    auth/  overview/  transactions/  budgets/  reports/  accounts/  settings/
    each: api/, components/, hooks/, pages/, copy.ts
  lib/                  http.ts (CSRF, 401 handling), format.ts, dates.ts, cn.ts
  styles/               tokens.css, globals.css
```

## Instructions

1. **Foundation first:** tokens, Tailwind mapping, fonts, global styles (selection, caret, focus ring, scrollbar, tabular numerals), `components/ui` primitives on Radix, then charts (see `data-viz`). Build a temporary `/__kit` route showing every primitive and chart in every state, then remove it before release.
2. **Fixtures first (Step 1 of the project):** build Overview, Transactions, Budgets and Reports against typed fixtures from `packages/contracts`, with all states, then swap to real API hooks without changing components.
3. **Data:** one typed `http.ts` that adds the CSRF header to unsafe requests and handles 401 by clearing state and redirecting with a return path. Features expose hooks (`useSummary`, `useTransactions`). Mutations invalidate precisely.
4. **URL state:** selected month, date range preset, filters, search, sort and cursor live in search params.
5. **Overview:** MonthSwitcher title, StatementBand, SpendingPaceChart with its finding sentence, budgets with PaceBars, recent transactions. No hero, no greeting.
6. **Transactions:** FilterBar with removable chips, TransactionTable with right-aligned tabular amounts, "Load more" on keyset cursor, row click opens the edit drawer, delete shows an Undo toast (8s) that calls restore.
7. **TransactionDrawer:** Expense or Income segmented control, `AmountInput` first, payee with suggestions from history, category combobox filtered by kind, account, date (default today in the user's timezone), note. `Enter` saves, "Save and add another" keeps the drawer open and focus on the amount. Server `fields` errors map onto inputs and focus the first invalid one.
8. **Keyboard:** `n` opens add, `/` focuses search, `g` then `o`, `t`, `b`, `r` navigate. **These actions are instant (no animation).** Show the shortcuts in a help dialog (`?`).
9. **Money:** every figure through `formatMoney` and the display rules in the design system. Never format with string concatenation. Parse input with `parseMoney`.
10. **Budgets page:** list of PaceBars for the month, inline edit of limits, copy from previous month, categories without a budget listed below with "Set budget".
11. **Reports page:** range segmented control (This month, Last month, Last 3 months, This year, Custom), finding sentences, charts, "View as table", Export CSV.
12. **States:** skeleton, empty (teaches), error with retry. Never a blank screen.
13. **Performance:** route-level splitting, charts lazy-loaded, font preload for the two primary faces, no layout shift (reserve chart height), bundle analyzer before release.
14. **Accessibility:** skip link, landmarks, labels, focus return from drawers and dialogs, live-region for toasts, keyboard-operable everything.

## Constraints

- No raw colors, no arbitrary Tailwind color values, no inline styles except dynamic widths and chart geometry.
- No `useEffect` for data fetching. No copying query data to local state.
- No hard-coded copy scattered in JSX: use each feature's `copy.ts`.
- No component over 150 lines.
