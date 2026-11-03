---
name: testing-qa
description: Writes and runs unit, integration, security, component and end-to-end tests for Masrouf using Vitest, Supertest, Testing Library, Playwright with axe and k6, including hand-computed report tests and the 12 security tests. Use when adding or changing behavior, fixing bugs, validating a phase or checking coverage.
---

# Testing and QA

## Goal

Every behavior that matters has a test that fails when it breaks. Money and report tests use values computed by hand.

## Instructions

1. **Pyramid:** exhaustive unit tests for pure domain functions, solid integration tests against a real PostgreSQL test database (migrated, truncated between tests), focused component tests, one end-to-end path.
2. **Domain unit tests (table-driven):** `parseMoney` (separators, too many decimals, empty, scientific notation, negative), `formatMoney`, month ranges across timezones and DST and leap years, `expectedFraction`, `budgetStatus` boundaries (exactly at limit, exactly at pace), savings rate with zero income.
3. **Report integration tests:** seed a tiny dataset in the test, write the expected totals **as literals computed by hand in a comment**, and assert equality for summary, pace (cumulative by day), by category, trend (including empty months), budgets and top payees. Add a test that user B's data never appears in user A's reports.
4. **API integration (Supertest):** every endpoint and status code (400, 401, 403, 404, 409, 422, 429), idempotent create with the same client id, keyset pagination continuity (no duplicates or gaps with equal dates), soft delete and restore, CSV export content.
5. **Security tests:** all 12 from `docs/SECURITY.md` section 10 live in `security.test.ts`.
6. **Component tests (Testing Library):** query by role and accessible name. Cover StatementBand figures and signs, PaceBar statuses, chart finding sentence and table alternative, AmountInput parsing and formatting, drawer error mapping, keyboard `n` and `/`, Undo toast calls restore, empty and error states.
7. **End to end (Playwright):** register, add income and expenses (including with the keyboard shortcut), set a budget, read Overview and Reports, export CSV, sign out, sign in. Run axe on Overview, Transactions, Budgets, Reports and the drawer, zero serious or critical violations. Screenshots at 1440 and 390.
8. **Clock control:** inject `now` into domain and services, use fake timers in the web tests. Never rely on the real date.
9. **Naming:** `it("marks a budget as over when spending exceeds the limit by one minor unit")`.
10. **Coverage:** 85% lines on services and domain functions. No chasing on glue.
11. **Report after a run:** passed and failed, coverage, untested behavior and why.

## Commands

```
npm run test            all unit and integration tests
npm run test:e2e        Playwright
npm run test:coverage   coverage report
```

## Constraints

- Never edit a test to make it pass without explaining the behavior change.
- Never mock what can run for real (database, Express app).
- No arbitrary sleeps.
