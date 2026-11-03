# Project standards (always on)

Binding for every file written in this workspace. If a task seems to require breaking a rule, stop and explain why instead of breaking it silently.

## Code quality

- TypeScript `strict: true` everywhere. No `any`, no `@ts-ignore`, no non-null assertion without a comment explaining the invariant.
- One responsibility per function and file. Functions under 40 lines, files under 250 lines (React components under 150).
- Names reveal intent (`findTransactionForUser`, not `getData`). No abbreviations except `id`, `url`, `db`, `api`, `dto`.
- Early returns over nesting. No boolean flag parameters that change behavior.
- No magic numbers or strings. Shared values are named constants or enums in `packages/contracts`.
- No commented-out code, no stray `console.log`, no `TODO` without an issue reference. Use the logger on the server.
- Never swallow errors with an empty `catch`. Throw typed errors (`AppError` with a stable `code`) and let the error handler shape the response.
- Prefer named exports. Imports ordered: node and external, workspace packages, internal absolute, relative.

## Architecture (see docs/ARCHITECTURE.md)

- API layers: `controller -> service -> repository`, pure functions in `domain/` or `packages/contracts`. Only repositories touch Prisma or SQL.
- Every request and response shape is a Zod schema in `packages/contracts`. Types are inferred, never duplicated. Unknown keys are rejected.
- Web is organized by feature. Server state in TanStack Query, form state in React Hook Form, filters and the selected month in the URL. Never copy query data into `useState`.
- **Money is integer minor units. Dates are plain `YYYY-MM-DD` days. Month boundaries are computed in the user's timezone.** Use the helpers in `packages/contracts`. Never use floats for amounts.
- **Every repository function takes `userId` first and filters by it.** No fetch-by-id-only functions. Foreign keys supplied by the client are verified to belong to the same user.
- Business rules (budget status, pace, summaries, authorization) are unit-tested without HTTP.

## Database

- Every schema change is a Prisma migration with a descriptive name. Never edit an applied migration.
- Explicit `select`. Raw SQL for reports uses tagged-template parameter binding only. Add the indexes listed in the architecture document and check `EXPLAIN` for list and report queries.
- Multi-step writes use a transaction. Timestamps in UTC.

## Configuration and dependencies

- Configuration only from environment variables, validated at startup. `.env.example` is committed, `.env` never.
- Add a dependency only when needed and justify it in the commit message.

## Git and quality gates

- Conventional Commits, small focused commits.
- A phase is finished only when `npm run lint`, `npm run typecheck` and `npm run test` pass with zero warnings.
- Docs stay true: update README, architecture or security docs in the same change that alters behavior. Add an ADR row for architectural decisions.
- Cross-cutting rules live in `security-rules.md` and `design-guardrails.md`.
