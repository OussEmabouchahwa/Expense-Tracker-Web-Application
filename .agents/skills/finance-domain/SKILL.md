---
name: finance-domain
description: Implements the money, date, pace, budget and report rules of Masrouf correctly, including integer minor units, currency exponents, parsing and formatting, timezone-safe month boundaries, budget status, summaries, spending pace and aggregate SQL. Use when touching amounts, dates, budgets, balances, savings rate, report endpoints or anything that computes totals.
---

# Finance domain

## Goal

Totals are exactly right and boundaries are right for the user, always. Rules: `docs/ARCHITECTURE.md` section 5 and 8.

## Money

1. Currency table in `packages/contracts`: `TND` exponent 3, `EUR` 2, `USD` 2. Amount fields are `amountMinor` (integer, positive, safe).
2. `parseMoney(text, currency)` parses with string operations: normalize a locale decimal separator, reject more fractional digits than the exponent, reject scientific notation, return minor units. **Never** `parseFloat(x) * 10**exp`.
3. `formatMoney(minor, currency, locale)` uses `Intl.NumberFormat` with fixed fraction digits. Provide `formatSigned` for statement figures (`+`, true minus).
4. Aggregations are integer sums in SQL. Ratios are computed from integers and rounded once, only for display. Savings rate = net / income, defined as 0 when income is 0, shown as a whole percent.

## Dates

1. `occurredOn` is a `date`. Parse and validate `YYYY-MM-DD` as a real calendar date (reject 2026-02-30).
2. `todayInZone(timezone, now)`, `monthRange("2026-10", timezone)` return plain dates. Ranges are half-open (`>= start AND < nextStart`).
3. Take `now` as a parameter so tests control the clock. Never read the server's local timezone for business logic.
4. Test month ends, leap years, daylight-saving zones, and a user near midnight whose "today" differs from UTC.

## Pace and budgets

- `expectedFraction(month, today)`: `dayOfMonth / daysInMonth` for the current month, `1` for past months, `0` for future months (status `UPCOMING`).
- `budgetStatus(spent, limit, expectedFraction)`: `OVER` if `spent > limit`, else `AHEAD` if `spent / limit > expectedFraction`, else `ON_PACE`. `overBy = spent - limit`. `limit = 0` is invalid at write time.
- `leftToSpend = max(0, limit - spent)`.

## Reports (SQL, scoped by userId, half-open ranges)

| Report | Notes |
|---|---|
| Summary | Income, expenses, net, savings rate, transaction count, and the same for the previous equal-length range. One query with `FILTER` |
| Spending pace | `generate_series` days of the month, left join daily expense sums, `SUM() OVER (ORDER BY day)`. Return this month through today (no zero-fill for future days) and last month for all days, plus `previousAtSameDay` |
| By category | Group, order by total, share from total, optional previous-range comparison, "Uncategorized" never exists (category is required) |
| Trend | `date_trunc('month')`, fill missing months with zeros |
| Budgets | Budgets for the month joined with category spend, status from the pure function |
| Top payees | Group by `lower(trim(payee))`, count and total |

Findings are generated as sentences in the web layer from these numbers, always with the comparison window ("by day 28", "than September").

## Tests required

Pure functions with table-driven cases (parsing edge cases, rounding, formatting, month boundaries, pace, status). Report integration tests on a small dataset **with expected values computed by hand in the test file**, plus a user-isolation test for every report.

## Constraints

- No float arithmetic on amounts. No `Date` arithmetic for month boundaries without the timezone helpers.
- No report loads rows into Node to sum them.
- Never change a report without updating its hand-computed test.
