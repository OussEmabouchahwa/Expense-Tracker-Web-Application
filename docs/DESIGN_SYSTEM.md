# Design System: Masrouf

Single source of truth for look and behavior. A live visual reference is in [`design-reference.html`](design-reference.html). Open it in a browser first. Components consume **tokens**, never raw values.

## 1. Direction

**Who:** a person at the end of the day or the end of the month, checking whether they are on track. Calm, not anxious. They enter a transaction in ten seconds, then look at the numbers.

**Mode:** Operate (authenticated app) with Read moments (report findings in plain sentences).

**Feel:** exact like a ledger, calm like paper. A printed statement, a rubber stamp, no casino lights.

**World (where tokens come from):** an accountant's desk. **Paper** (receipts and statements), **ledger** (the green-black ruled book and its ink), **stamp** (the blue rubber stamp that marks something as done). Token names use those words.

**Signature, the Pace Marker:** budgets and spending are always read against *where you should be today*. A dark tick on every budget bar marks the expected spend for this day of the month, and the spending chart compares this month with last month **by the same day**. It answers the real question ("am I on track?") that a plain total never does. Status words come from it: "On pace", "Ahead of pace", "Over by 36.500".

**Rejected defaults:** green fintech gradients, four KPI tiles with icons and sparklines (replaced by one divided statement band of figures), pie and donut charts (replaced by ranked bars), a color per category (replaced by one data hue), "Welcome back" heroes (replaced by the month as the page title).

## 2. Color: the 60 / 30 / 10 rule

| Share | Role | Family | Where it appears |
|---|---|---|---|
| **60%** | Dominant neutral | **Paper** | Page ground, panels, table rows, inputs |
| **30%** | Secondary structure | **Ledger** | Top bar, rules, bar tracks, secondary text, ink, income series, budget fills |
| **10%** | Accent and main data | **Stamp** blue | The one primary action, the expense data series, selection, focus accents |
| outside | Money semantics and status | Gain, Loss, Warn | Income amounts and favorable deltas (gain), overspend and unfavorable deltas (loss), "ahead of pace" (warn). Marks and tags only, never fills of large areas |

Measured by screen area. If stamp blue is on more than a few elements of a screen, something is over-accented.

### Tokens

| Token | Hex | Use | Contrast (measured) |
|---|---|---|---|
| `--paper-0` | `#FFFFFF` | Panels, inputs | n/a |
| `--paper-50` | `#F7F6F2` | Page ground | n/a |
| `--paper-100` | `#EFEDE7` | Sunken fills, hover | n/a |
| `--ledger-100` | `#E6EAE4` | Top bar, tag fill, table header band | n/a |
| `--ledger-200` | `#D0D7CD` | Bar tracks | n/a |
| `--ledger-300` | `#B0BAAB` | Disabled, decorative | n/a |
| `--ledger-400` | `#7E8A79` | **Control borders**, last-month chart line | 3.6:1 white, 3.4:1 paper-50, 3.1:1 paper-100 |
| `--ledger-500` | `#5C6A57` | Tertiary text, axis labels (paper surfaces only) | 5.7:1 white, 4.7:1 on ledger-100 |
| `--ledger-700` | `#33402F` | Secondary text, income series, budget fill | 11.0:1 white |
| `--ledger-900` | `#172016` | Primary text (ink) | 16.7:1 white |
| `--stamp-100` | `#E4ECFC` | Selected row, selection highlight | n/a |
| `--stamp-500` | `#2A5BD7` | Primary button, expense series | 5.9:1 (white on it, and on white) |
| `--stamp-600` | `#2049B3` | Button hover and pressed | 7.9:1 white on it |
| `--stamp-700` | `#1B3C94` | Accent text and links | 9.9:1 on white |
| `--gain-100` / `--gain-600` | `#E1F3E8` / `#176B40` | Income amounts, favorable change | 5.7:1 on gain-100, 6.5:1 on white |
| `--loss-100` / `--loss-600` | `#FBE9E7` / `#B3261E` | Overspend, unfavorable change, errors | 5.6:1 on loss-100 |
| `--warn-100` / `--warn-700` | `#FFF1CC` / `#8A5A00` | Ahead of pace | 5.3:1 |
| `--line` | `rgb(23 32 22 / .12)` | Resting borders, row rules, chart grid | decorative |

Rules:

- Text on paper uses ledger-900, 700 or 500. On ledger-100 surfaces use ledger-700 or darker.
- Text on a stamp fill is white. Status tags are a pale tint with dark text of the same family.
- **Color encodes money meaning only.** Income amounts are gain, expense amounts are plain ink (a screen of red expenses is noise). Zero and unknown are neutral. A change is colored by good or bad (spending down is favorable), never by up or down.
- No gradients, no tinted shadows, no hue per category. Dark mode is out of scope for v1 (tokens are structured to add it later).

## 3. Typography: one designed pair

**Source Serif 4** and **Source Sans 3** were drawn together by the same design team (Adobe), so proportions, stroke contrast and rhythm agree without tuning. Both carry real tabular lining figures, which matters for money.

| Role | Face | Where |
|---|---|---|
| Titles and big figures | Source Serif 4 600 | Month title, page titles, statement band figures, report headline figures |
| Interface | Source Sans 3 400, 500, 600 | Navigation, labels, buttons, tables, forms, amounts in tables, body |

Load with `font-display: swap`, fallbacks `Georgia, serif` and `system-ui, sans-serif`, Latin subset (`opsz` axis for the serif, weights as listed).

### Scale (fixed rem, ratio 1.2, base 16px)

| Step | Size / line-height | Face and weight | Use |
|---|---|---|---|
| Figure | 2.5rem (40) / 1.1 | Serif 600, tabular | One headline figure on Reports. Rare |
| H1 | 1.75rem (28) / 1.2 | Serif 600, tracking -0.01em | Page title (the month, or a noun) |
| Statement figure | 1.75rem (28) / 1.25 | Serif 600, tabular | Income, Expenses, Net, Savings rate |
| H2 | 1.4375rem (23) / 1.25 | Serif 600 | Report titles, empty-state titles |
| H3 | 1.1875rem (19) / 1.3 | Serif 600 | Panel headings |
| Body | 1rem (16) / 1.5 | Sans 400 | Default text |
| Table and amount | 0.9375rem (15) / 1.4 | Sans 400/600, tabular | Table cells |
| Small | 0.875rem (14) / 1.43 | Sans 400/500 | Secondary text, tags, captions |
| Caption | 0.75rem (12) / 1.33 | Sans 500 | Chart axis labels. Nothing smaller |

Hierarchy from weight and color first, size second. Four text levels: ledger-900, 700, 500, 300 (disabled). Sentence case everywhere, no ALL-CAPS labels. `font-variant-numeric: tabular-nums` on every number. Fixed rem in the app shell (no fluid type). Serif never appears in buttons, inputs, tabs, tags or table cells.

## 4. Money display rules

These make numbers trustworthy at a glance.

1. **Fixed decimals per currency** (TND 3, EUR and USD 2). Never round away precision, never abbreviate (`1.2k`) in tables.
2. **Locale-aware formatting** through `Intl.NumberFormat`, using the user's `locale`. The currency is shown **once per view** (header or column title), not on every cell.
3. **Signs:** expenses carry a true minus (`−`, U+2212) in plain ink, income carries `+` in gain-600, net always shows its sign, zero is `0.000` in neutral.
4. **Right-aligned, tabular, same decimals** in every numeric column. Totals align under the amounts.
5. **Deltas** are stated in words with their window ("8% more than September by day 28"). A bare arrow or percentage is not allowed.
6. Unknown or missing values print as an en dash in secondary text, not as zero.
7. Large numbers keep thousands separators. Negative balances use loss-600 text and a minus.

## 5. Charts

Rules (data visualization):

- **One hue per chart.** Stamp blue for expenses, ledger-700 for income, ledger-400 for the comparison series. Never a rainbow, never a hue per category.
- **No pie, donut, gauge, 3D, dual-axis, stacked area or gradient fill.** Ranking uses horizontal bars. Time uses lines or bars. Bars always start at zero.
- **Chart chrome is nearly absent:** 3 to 5 faint grid lines (`--line`), no axis lines, no legend for a single series (direct labels at line ends), round ticks just above the maximum, axis text 12px ledger-500 tabular.
- **State the finding above the chart** in one sentence (it is the chart's title in practice).
- **Honest empties:** no data draws the zero line and one sentence, not an illustration. Missing days are gaps, not zeros.
- **No entrance animation.** Charts render in their final state.
- **Accessible:** every chart has an accessible name and a text summary, a "View as table" toggle, and is not the only carrier of any value (labels and the table repeat it). Focus is never trapped in an SVG.
- Built as custom SVG with `d3-scale` and `d3-shape`, not a charting kit with its own chrome.

Chart inventory: **SpendingPaceChart** (cumulative spend this month vs last month by day, today line, direct end labels), **MonthlyBars** (income and expenses, 12 months), **CategoryBars** (ranked horizontal bars with value and share), **PaceBar** (budget progress with the pace tick).

## 6. Space, depth, layout

- 4px base. Scale 4, 8, 12, 16, 20, 24, 32, 40, 56, 72. Panels pad 24, table rows pad 12, controls are 44px high. Density is medium, with air around the one focal element of each view.
- **Depth: borders only at rest** (1px `--line`). Shadows only on what floats (menu, popover, dialog, drawer, toast): `0 8px 24px rgb(23 32 22 / .14), 0 0 0 1px rgb(23 32 22 / .08)`. Never both on a resting element.
- Radius scale: `--r-sm` 4 (tags, bar tracks), `--r-md` 8 (controls), `--r-lg` 12 (panels). Nested radius is concentric.
- **Layout:** top bar (60px, ledger-100, 1px bottom border) with the mark, five nav links, the global "Add transaction" button and the account menu. Content max-width 1120px, padding `clamp(16px, 4vw, 40px)`. Active nav item: ink text and a 2px ink underline (never colored).
- Every view has one focal element: the statement band and pace chart on Overview, the table on Transactions, the budget list on Budgets, the report finding on Reports.
- Breakpoints (structural): 980px (two columns become one, band becomes 2x2), 760px (nav scrolls under the bar, tables become stacked entries with the amount on the right, chart text enlarges).
- Lists and tables beat cards. Never a grid of identical tiles.

## 7. Motion

| Use | Duration | Easing |
|---|---|---|
| Hover color, press (`scale(.97)`) | 120 to 150ms | `ease` |
| Menus, popovers | 150 to 200ms | `cubic-bezier(.23, 1, .32, 1)`, from the trigger |
| Drawer, dialog | 200 to 240ms | `cubic-bezier(.32, .72, 0, 1)` |
| Toast with Undo | 200ms in, 150ms out | ease-out, stays 8s |

- Transform and opacity only, never `transition: all`, never from `scale(0)`.
- **Keyboard-initiated actions are instant.** `n` (new transaction), `/` (search) and `g` then a letter (go to) open and move with no animation.
- No page-load sequences, no chart animation, no scroll reveals. Hover effects gated by `@media (hover: hover) and (pointer: fine)`. Respect `prefers-reduced-motion`.

## 8. Components

Every component ships default, hover, focus-visible, active, disabled, plus loading and error where relevant. Radix primitives, styled with tokens.

| Component | Spec |
|---|---|
| **Button** | 44px. Primary: stamp-500 fill, white text, **one per view** (the global Add transaction counts for the page). Secondary: paper-0 fill, ledger-400 border. Destructive: loss-600 fill, only inside a confirm. Loading keeps width. |
| **IconButton** | 40px (44 coarse), transparent, paper-100 hover, `aria-label` names the target. |
| **Field, Input, Select, Textarea, Combobox** | Visible label above, helper below, error below in loss-600 with `aria-describedby`. Border ledger-400, focus ring 2px ledger-900 offset 2px. Category combobox filters by typing (cmdk). |
| **AmountInput** | Large (serif 28), `inputmode="decimal"`, parses with the currency exponent, shows the formatted value on blur, never uses floating point. Expense and Income segmented toggle sits above it. |
| **TopBar** | See section 6. |
| **MonthSwitcher** | Previous and next icon buttons around the serif month title, a menu to jump. Scope for Overview and Budgets. |
| **StatementBand** | One panel divided by hairlines: Income, Expenses, Net, Savings rate as serif figures with small labels. No icons, no sparklines, no unwindowed deltas. |
| **PaceBar** | 10px track (ledger-200, radius 4), fill ledger-700 (loss-600 when over), 2px ink tick at expected spend with a 4px overshoot above and below. Caption "Day 28 of 31". Row shows name, status tag, "186.500 of 150.000". |
| **StatusTag** | 22px, radius 99, pale tint with dark text. On pace (ledger), Ahead of pace (warn), Over by N (loss), Favorable and Unfavorable only where a comparison is stated. |
| **TransactionTable** | Date, payee (600) with note beneath if present, category, account, amount right-aligned. 12px grey headers, row rules, no zebra, hover paper-50. Row click opens the edit drawer. Bulk selection only if needed. Grouped by day on mobile. |
| **FilterBar** | Search, date range preset (segmented), kind, account, category. State in the URL. Active filters appear as removable chips with a "Clear all". |
| **TransactionDrawer** | Add and edit. Amount first, then payee, category, account, date, note. `Enter` saves, "Save and add another" secondary. Validates inline. Delete with Undo toast. |
| **EmptyState** | Frame kept. One teaching sentence and one action ("No transactions in October. Add one, or import a CSV."). No illustration. |
| **Skeleton** | Row and band shaped, static. |
| **Toast** | Bottom-center, ink fill, `role="status"`, repeats the verb: "Deleted Carrefour Market. Undo". |
| **ReportPage** | Date range segmented control, finding sentence, chart, "View as table", Export CSV. |

## 9. Voice and copy

Plain, specific, sentence case. Words of money: "Add transaction", "On pace", "Over by 36.500", "Savings rate", "Left to spend". Findings are sentences with numbers ("By day 28 you have spent 159.350 more than by the same day in September, 8% more."). Errors say what happened and what to do, never apologize. Realistic sample data (Tunisian and international payees, dates relative to today). Never "Lorem ipsum", "Test", "Item 1". Copy lives in per-feature dictionaries.

## 10. Accessibility and internationalization

- WCAG 2.2 AA: 4.5:1 text, 3:1 UI (control borders use ledger-400), full keyboard use, visible focus, skip link, landmarks, labels everywhere, errors linked and announced, 44px targets, no color-only meaning (tags have words, amounts have signs, bars have values).
- Charts: text summary, table alternative, no motion. The comparison line (ledger-400) meets 3:1.
- Use CSS logical properties so right-to-left (Arabic) can be added. Use `Intl` for numbers and dates, so French and Arabic locales format correctly.

## 11. Never do this

Gradients or gradient fills under lines, glass or blur, glow, hard offset shadows, colored border-left stripes, icon-in-circle KPIs, sparklines on KPIs, pie, donut and gauge charts, a hue per category, rainbow charts, dual axes, truncated bar axes, ALL-CAPS tracked labels, eyebrows, section numbers, emoji anywhere, "Welcome back", hero banners, nested cards, modal where a drawer or page works, violet or indigo, a second accent hue, bare `k` and `M` abbreviations in tables, left-aligned or proportional numbers, status color on zero, serif in controls.

## 12. Token implementation

`apps/web/src/styles/tokens.css`:

```css
:root {
  --paper-0: #ffffff;
  --paper-50: #f7f6f2;
  --paper-100: #efede7;
  --ledger-100: #e6eae4;
  --ledger-200: #d0d7cd;
  --ledger-300: #b0baab;
  --ledger-400: #7e8a79;
  --ledger-500: #5c6a57;
  --ledger-700: #33402f;
  --ledger-900: #172016;
  --stamp-100: #e4ecfc;
  --stamp-500: #2a5bd7;
  --stamp-600: #2049b3;
  --stamp-700: #1b3c94;
  --gain-100: #e1f3e8;
  --gain-600: #176b40;
  --loss-100: #fbe9e7;
  --loss-600: #b3261e;
  --warn-100: #fff1cc;
  --warn-700: #8a5a00;

  --line: rgb(23 32 22 / 0.12);
  --shadow-float: 0 8px 24px rgb(23 32 22 / 0.14), 0 0 0 1px rgb(23 32 22 / 0.08);

  --font-serif: "Source Serif 4", Georgia, serif;
  --font-sans: "Source Sans 3", system-ui, sans-serif;

  --r-sm: 4px;
  --r-md: 8px;
  --r-lg: 12px;

  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  --dur-press: 120ms;
  --dur-base: 180ms;
  --dur-panel: 240ms;
  color-scheme: light;
}

@media (prefers-reduced-motion: reduce) {
  :root { --dur-press: 0.01ms; --dur-base: 0.01ms; --dur-panel: 0.01ms; }
}

::selection { background: var(--stamp-100); color: var(--ledger-900); }
body { caret-color: var(--stamp-500); accent-color: var(--stamp-500); font-variant-numeric: normal; }
.num { font-variant-numeric: tabular-nums; }
```

Expose every token through `tailwind.config.ts` (`colors.paper[50]`, `colors.ledger[700]`, `colors.stamp[500]`, `fontFamily.serif`, `borderRadius.md`) so `bg-paper-0 text-ledger-900 border-line` are the only way color reaches a component. Chart colors come from the same tokens through CSS variables (`--chart-expense: var(--stamp-500)`, `--chart-income: var(--ledger-700)`, `--chart-compare: var(--ledger-400)`). Theme the browser surfaces too: selection, caret, focus ring, scrollbar, `accent-color`.
