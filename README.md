# Masrouf

Masrouf is a web application for tracking income, expenses and financial summaries. You record transactions in seconds, set monthly budgets, and see at a glance whether you are on track.

The name comes from the Arabic word for "spending" (and pocket money).

## Features

- **Expense tracking:** add, edit, delete (with Undo), search and filter transactions by date, account, category, amount and text
- **Income management:** income categories, salary and freelance entries, savings rate
- **Accounts:** cash, bank, card and savings accounts with live balances
- **Budgets:** monthly limits per expense category, read against the **pace marker** (where you should be today)
- **Financial reports:** monthly summary, spending pace versus last month, spending by category, 12-month trend, top payees, CSV export
- **Authentication:** register, sign in, sign out everywhere, password reset, change password, export and delete your data
- Designed for TND (3 decimals) and any ISO currency, locale-aware formatting, keyboard-first (`n` to add, `/` to search)

## Tech stack

| Layer | Technology |
|---|---|
| Web | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS 3.4, Radix UI, cmdk, React Hook Form, Zod, d3-scale and d3-shape (custom SVG charts) |
| API | Node.js 20, Express, TypeScript, Zod, pino, helmet, argon2, express-rate-limit |
| Data | PostgreSQL 16, Prisma (raw SQL for reports) |
| Shared | `packages/contracts`: Zod schemas, money and date functions, enums |
| Tests | Vitest, Supertest, Testing Library, Playwright with axe, k6 |
| Delivery | Docker, Docker Compose, Caddy, GitHub Actions |

## Documentation

| Document | Contents |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Layers, data model, money and date rules, reporting design, auth flow, API catalog, ADRs |
| [docs/SECURITY.md](docs/SECURITY.md) | Threat model, controls, OWASP mapping, required security tests |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | 60/30/10 palette, typography, money display rules, chart rules, components |
| [docs/design-reference.html](docs/design-reference.html) | Visual reference. Open in a browser |

## Getting started

Requirements: Node.js 20+, Docker.

```bash
npm install
cp apps/api/.env.example apps/api/.env
docker compose up -d db mailpit        # PostgreSQL and a local mail catcher
npm run db:migrate
npm run db:seed                        # demo user with 12 months of data
npm run dev                            # web on :5173 (proxies /api), API on :4000
```

Mail sent in development is visible at http://localhost:8025.

Demo account (development seed only, never created in production): `demo@masrouf.test` / `MasroufDemo-2026`.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Web and API with hot reload |
| `npm run build` | Production build of every workspace |
| `npm run lint` | ESLint, zero warnings allowed |
| `npm run typecheck` | `tsc --noEmit` everywhere |
| `npm run format` | Prettier |
| `npm run test` | Unit and integration tests |
| `npm run test:e2e` | Playwright |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run perf:load` | k6 load test against a running API |

## Configuration (`apps/api/.env`)

| Variable | Purpose |
|---|---|
| `NODE_ENV` | `development`, `test`, `production` |
| `PORT` | API port, default `4000` |
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Used to sign CSRF tokens (32+ random bytes) |
| `APP_ORIGIN` | Public web origin, used for the Origin check and email links |
| `COOKIE_SECURE` | `true` in production |
| `SMTP_URL` | Mail transport |
| `DEFAULT_CURRENCY`, `DEFAULT_TIMEZONE` | Defaults for new users (`TND`, `Africa/Tunis`) |

The API refuses to start when a required variable is missing or invalid.

## Conventions you must know

- **Money** is an integer in minor units (`amountMinor`). TND has 3 decimals. Never use floats for amounts.
- **Dates** of transactions are plain calendar days (`YYYY-MM-DD`). "Today" and month boundaries use the user's timezone.
- **Every query is scoped by the signed-in user.** A user can never see another user's data.

## API

Base path `/api/v1`, interactive docs at `/api/docs` in development. The endpoint catalog is in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#9-api-conventions-and-catalog).

Errors always look like this:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Check the highlighted fields.", "fields": { "amountMinor": "Enter an amount greater than zero." }, "requestId": "7f3c..." } }
```

## Testing

- Pure domain functions (money, dates, pace, budget status) have exhaustive unit tests.
- API: integration tests with Supertest against a real PostgreSQL test database, including hand-computed report expectations and the 12 security tests in [docs/SECURITY.md](docs/SECURITY.md#10-required-security-tests).
- Web: component tests by role and accessible name, including chart text alternatives.
- End to end: add a transaction, set a budget, read the reports, sign out and in again, export CSV.

## Deployment

Production runs as containers behind Caddy (automatic HTTPS): `web` (Nginx with the built SPA), `api`, `db` (PostgreSQL) and a nightly encrypted `backup` job.

```bash
cp deploy/.env.production.example deploy/.env.production   # fill in real secrets
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env.production up -d --build
docker compose -f deploy/docker-compose.prod.yml exec api npx prisma migrate deploy
```

- GitHub Actions runs lint, typecheck and tests on pull requests and builds and pushes images on version tags.
- Health: `GET /health` and `GET /ready`.
- Restore steps are in `deploy/RESTORE.md`.
- A managed alternative (static web on Netlify or Vercel, API on Render or Fly.io, database on Neon) works if the web app and API share a parent domain so cookies stay first-party. Single-origin Caddy is the recommended path.

## Performance budgets

Initial JavaScript under 170KB gzipped, LCP under 2.5s, Lighthouse performance 90+ on Overview, API p95 under 150ms for list and report endpoints with about 20,000 transactions for one user. `npm run perf:load` enforces the API budgets.

## Project structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#14-repository-structure).

## Contributing

Conventional Commits. Before a pull request: `npm run lint && npm run typecheck && npm run test`. Architectural changes need an ADR row in `docs/ARCHITECTURE.md`.
