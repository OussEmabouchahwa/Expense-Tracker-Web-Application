---
name: backend-api
description: Builds the Express, TypeScript, Prisma and PostgreSQL REST API for Masrouf with layered modules, Zod contracts, user-scoped repositories, keyset pagination, idempotent creates, soft delete, error handling, OpenAPI and seed data. Use when creating or changing modules, endpoints, migrations or server-side business rules.
---

# Backend API

## Goal

A typed, layered, secure API that matches `docs/ARCHITECTURE.md` and passes review without comments.

## Module template

```
modules/<name>/
  <name>.routes.ts        route table and middleware
  <name>.controller.ts    HTTP only
  <name>.service.ts       use cases and rules
  <name>.repository.ts    Prisma access only, userId first
  <name>.test.ts          unit tests (service) and integration tests (routes)
```

## Instructions

1. **Contracts first** in `packages/contracts`: strict Zod objects, trimmed strings with length caps, lowercase emails, coerced query numbers, `amountMinor` as a positive safe integer, `occurredOn` as a validated calendar date.
2. **Controllers** parse input with the schema, call one service function, return `{ data, meta? }` with the right status. A wrapper forwards rejected promises to the error handler.
3. **Services** hold rules and throw `AppError(code, status, message, fields?)`. They verify that `accountId` and `categoryId` belong to the user and that kind matches (an income category cannot be used on an expense).
4. **Repositories** return plain objects, take `userId` first, use explicit `select`, and exclude `deletedAt IS NOT NULL` by default.
5. **Transactions endpoints:** filters (`from`, `to`, `kind`, `accountId`, `categoryId`, `q`, `min`, `max`), sort allow-list, **keyset pagination** on `(occurredOn DESC, id DESC)` with an opaque `cursor`, idempotent create using an optional client `id`, `PATCH` with at least one field, soft `DELETE`, `POST /:id/restore`, `GET /export.csv` (streamed, row cap).
6. **Accounts:** balances are computed (`openingBalanceMinor + income - expense`) in SQL, never stored. Archive instead of delete when transactions exist.
7. **Budgets:** upsert by `(month, categoryId)`, expense categories only, `copy-from-previous`.
8. **Global pieces:** request-id middleware, pino-http, error handler producing `{ error: { code, message, fields?, requestId } }`, 404 handler, graceful shutdown, Zod-to-OpenAPI generation at `/api/docs` (development).
9. **Seed** (`prisma/seed.ts`, development only, idempotent): demo user (`demo@masrouf.test`), 3 accounts (cash, bank, card), 9 expense and 3 income categories, 12 months of realistic transactions in TND with Tunisian and international payees (salary monthly, rent, groceries, utilities, louage, cafes, freelance invoices), dates relative to today, budgets for the current month with one over, one ahead of pace and the rest on pace.
10. **Purge job:** command and scheduler hook removing rows soft-deleted over 30 days ago.

## Constraints

- No business logic in controllers or repositories.
- No unscoped query. No `any`. No unbounded list.
- No cross-module repository imports.
