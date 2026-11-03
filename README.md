# Masrouf — Expense Tracker Web Application

A full-stack application for tracking income, expenses, and financial summaries: log transactions, manage budgets per category, view spending reports, and monitor your savings rate across multiple bank and cash accounts.

The interface is built around a personal finance workflow and a documented design system ([docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)). The dashboard shows a live spending-pace chart comparing current-month cumulative spend to the previous month, alongside a budget tracker and recent transactions.

---

## Screenshots

### Dashboard (Overview)

| Desktop (1440px) | Tablet (768px) | Mobile (390px) |
|---|---|---|
| ![Overview desktop](docs/screenshots/overview-desktop-1440px.png) | ![Overview tablet](docs/screenshots/overview-tablet-768px.png) | ![Overview mobile](docs/screenshots/overview-mobile-390px.png) |

### Transactions

| Desktop (1440px) | Tablet (768px) | Mobile (390px) |
|---|---|---|
| ![Transactions desktop](docs/screenshots/transactions-desktop-1440px.png) | ![Transactions tablet](docs/screenshots/transactions-tablet-768px.png) | ![Transactions mobile](docs/screenshots/transactions-mobile-390px.png) |

### Add / Edit Transaction Drawer

| Desktop (1440px) | Tablet (768px) | Mobile (390px) |
|---|---|---|
| ![Drawer desktop](docs/screenshots/drawer-desktop-1440px.png) | ![Drawer tablet](docs/screenshots/drawer-tablet-768px.png) | ![Drawer mobile](docs/screenshots/drawer-mobile-390px.png) |

### Budgets

| Desktop (1440px) | Tablet (768px) | Mobile (390px) |
|---|---|---|
| ![Budgets desktop](docs/screenshots/budgets-desktop-1440px.png) | ![Budgets tablet](docs/screenshots/budgets-tablet-768px.png) | ![Budgets mobile](docs/screenshots/budgets-mobile-390px.png) |

### Reports

| Desktop (1440px) | Tablet (768px) | Mobile (390px) |
|---|---|---|
| ![Reports desktop](docs/screenshots/reports-desktop-1440px.png) | ![Reports tablet](docs/screenshots/reports-tablet-768px.png) | ![Reports mobile](docs/screenshots/reports-mobile-390px.png) |

### Accounts

| Desktop (1440px) | Tablet (768px) | Mobile (390px) |
|---|---|---|
| ![Accounts desktop](docs/screenshots/accounts-desktop-1440px.png) | ![Accounts tablet](docs/screenshots/accounts-tablet-768px.png) | ![Accounts mobile](docs/screenshots/accounts-mobile-390px.png) |

---

## Features

- Log income and expense transactions with payee, category, account, date, and optional note
- Edit and soft-delete transactions; restore at any time
- Spending-pace chart comparing current month vs previous month, day by day
- Monthly budget limits per category with real-time pace indicators (on pace / ahead of pace / over budget)
- Financial reports: income vs expense bars, savings rate, spending ranked by category
- Multi-account support: Cash, Bank, Card, Savings with opening balances
- Export transactions to CSV
- User authentication with cookie sessions, CSRF protection, argon2id hashing, and rate limiting
- Secure password reset via email token
- Loading, empty, and error states on every view
- Responsive from 360 px phones to wide desktops, keyboard accessible (WCAG 2.2 AA target)
- All monetary values stored as integer minor units — no floating-point rounding errors

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, TanStack Query v5, React Hook Form, Zod |
| Backend | Node.js 20+, Express 4, TypeScript, Zod, Pino |
| Database | PostgreSQL through Prisma ORM (embedded for development) |
| Auth | argon2id · DB-backed cookie sessions · CSRF tokens · express-rate-limit |
| Charts | Custom SVG with d3-scale and d3-shape |
| Testing | Vitest, Supertest, Testing Library, Playwright, k6 |
| Tooling | ESLint, Prettier, npm workspaces, Docker Compose |

---

## Architecture

```mermaid
flowchart LR
  UI[React SPA] -->|HTTP /api/*| MW[Auth + CSRF Middleware]
  MW --> R[Module Router]
  R --> C[Controller]
  C --> S[Service]
  S --> Repo[Repository]
  Repo --> DB[(PostgreSQL)]
  R -. validates .-> Z[Zod schemas]
  UI -. shared .-> Z
```

- **Server** is layered: routes → controller → service → repository. Only the repository touches the database. All input is validated at the edge with Zod schemas shared from `packages/contracts`.
- **Client** is organized by feature. Server state lives in TanStack Query, form state in React Hook Form, and active filters in the URL so views are shareable and bookmarkable.
- **Design tokens** live in one CSS file (`tokens.css`) and are the single source of truth for colors, typography, spacing, and motion.
- **Money** is always stored and computed as integer minor units (millimes for TND). Formatting is locale-aware and injected at display time only.

---

## Project structure

```
expense-kit/                      ← npm workspace monorepo root
├── apps/
│   ├── api/                      ← Express REST API
│   │   ├── src/
│   │   │   ├── modules/          ← Feature modules
│   │   │   │   ├── accounts/     ← controller · service · repository · routes
│   │   │   │   ├── budgets/      ← controller · repository · routes
│   │   │   │   ├── categories/   ← controller · service · repository · routes
│   │   │   │   ├── transactions/ ← controller · repository · routes
│   │   │   │   └── users/        ← controller · service · repository · routes
│   │   │   ├── middleware/       ← auth-stub, CSRF, error handler, request-id
│   │   │   ├── lib/              ← Prisma client, Pino logger, AppError
│   │   │   └── config/           ← Zod-validated environment
│   │   └── prisma/
│   │       ├── schema.prisma     ← Data model
│   │       ├── migrations/       ← SQL migration history
│   │       └── seed.ts           ← Demo data (12 months of transactions)
│   └── web/                      ← React SPA
│       └── src/
│           ├── features/         ← overview · transactions · budgets · reports · accounts
│           ├── components/       ← SVG charts, layout shell, UI primitives
│           ├── app/              ← Router + AppShell
│           └── lib/              ← formatters, cn() utility
├── packages/
│   └── contracts/                ← Shared Zod schemas and domain helpers (API ↔ Web)
│       └── src/
│           ├── schemas.ts        ← All request/response Zod schemas
│           ├── money.ts          ← Minor-unit formatting and parsing
│           ├── dates.ts          ← Timezone-safe month boundaries and helpers
│           └── pace.ts           ← Spending pace calculation logic
└── docs/
    ├── DESIGN_SYSTEM.md
    └── screenshots/
```

---

## Getting started

**Requirements:** Node.js 20 or newer, npm 9 or newer.

```bash
# 1. Clone
git clone https://github.com/OussEmabouchahwa/Expense-Tracker-Web-Application.git
cd Expense-Tracker-Web-Application

# 2. Install all dependencies (monorepo)
npm install

# 3. Configure the API environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — see the table below

# 4. Start the embedded PostgreSQL database
npm run db:start

# 5. Apply database migrations
npm run db:migrate

# 6. (Optional) Load demo data — 12 months of realistic transactions
npm run db:seed

# 7. Start both servers
npm run dev
```

| Service | URL |
|---|---|
| Web (React) | http://localhost:5173 |
| API (Express) | http://localhost:3000 |

Demo login (after seeding): **demo@masrouf.test** / **MasroufDemo-2026**

---

## Environment variables (`apps/api/.env`)

| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql://masrouf:masrouf@localhost:5432/masrouf` | Prisma connection string |
| `SESSION_SECRET` | *(required)* | Cookie signing secret — use a long random string |
| `CSRF_SECRET` | *(required)* | CSRF token signing secret |
| `COOKIE_DOMAIN` | `localhost` | Domain for session cookie |
| `PORT` | `3000` | API port |
| `NODE_ENV` | `development` | Runtime mode |
| `SMTP_HOST` | — | SMTP server for password-reset emails |
| `SMTP_PORT` | `587` | SMTP port |
| `SMTP_USER` | — | SMTP username |
| `SMTP_PASS` | — | SMTP password |
| `EMAIL_FROM` | — | Sender address for outgoing email |

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start API and web client together (coloured output) |
| `npm run build` | Production build of all packages and apps |
| `npm run lint` | ESLint across the monorepo |
| `npm run typecheck` | `tsc --noEmit` on every workspace |
| `npm run format` | Prettier format check |
| `npm run format:fix` | Auto-fix formatting |
| `npm run test` | Vitest unit and integration tests |
| `npm run test:coverage` | Tests with coverage report |
| `npm run test:e2e` | Playwright end-to-end tests |
| `npm run db:start` | Start embedded PostgreSQL |
| `npm run db:stop` | Stop embedded PostgreSQL |
| `npm run db:migrate` | Apply pending Prisma migrations |
| `npm run db:seed` | Insert 12 months of demo transactions |
| `npm run perf:load` | k6 load test |

---

## API

Base path: `/api`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/register` | Create a new account |
| `POST` | `/users/login` | Log in (sets session cookie) |
| `POST` | `/users/logout` | Invalidate session |
| `POST` | `/users/forgot-password` | Request a password-reset email |
| `POST` | `/users/reset-password` | Submit reset token and new password |
| `GET` | `/accounts` | List user accounts |
| `POST` | `/accounts` | Create an account |
| `PATCH` | `/accounts/:id` | Rename or retype an account |
| `POST` | `/accounts/:id/archive` | Archive an account |
| `GET` | `/categories` | List categories (filter by `?kind=EXPENSE\|INCOME`) |
| `POST` | `/categories` | Create a category |
| `PATCH` | `/categories/:id` | Rename a category |
| `POST` | `/categories/:id/archive` | Archive a category |
| `GET` | `/transactions` | List transactions with filters and keyset pagination |
| `POST` | `/transactions` | Create a transaction |
| `GET` | `/transactions/export` | Download as CSV |
| `GET` | `/transactions/:id` | Get one transaction |
| `PATCH` | `/transactions/:id` | Update a transaction |
| `DELETE` | `/transactions/:id` | Soft-delete a transaction |
| `GET` | `/budgets` | List budgets for a month (`?month=YYYY-MM`) |
| `PUT` | `/budgets/:categoryId/:month` | Upsert a budget limit |
| `DELETE` | `/budgets/:categoryId/:month` | Remove a budget |
| `POST` | `/budgets/copy` | Copy previous month's budgets to a target month |

**List transactions query params:** `from`, `to`, `kind`, `accountId`, `categoryId`, `q`, `min`, `max`, `cursor`, `limit` (1–100, default 25)

---

## Data model

| Model | Key fields |
|---|---|
| `User` | id · email (unique) · passwordHash · name · currency · locale · timezone |
| `Session` | SHA-256 id · userId · expiresAt · csrfToken |
| `PasswordResetToken` | tokenHash (unique) · expiresAt · usedAt |
| `Account` | id · userId · name · type (CASH/BANK/CARD/SAVINGS) · openingBalanceMinor |
| `Category` | id · userId · name · kind (EXPENSE/INCOME) · archivedAt |
| `Transaction` | id · userId · accountId · categoryId · kind · amountMinor (BigInt) · occurredOn · payee · note · deletedAt |
| `Budget` | userId · categoryId · month (1st of month) · limitMinor — unique per user+category+month |

All monetary amounts are stored as **BigInt minor units** (e.g., 1 TND = 1 000 millimes).

---

## Testing

- Repository and service functions are unit-tested with Vitest and a fake in-memory repository.
- API routes are integration-tested end-to-end with Supertest against a real test database.
- UI components are tested with Testing Library, queried by role and accessible name.
- A Playwright test covers the critical path: register → log in → add transaction → edit → delete.
- k6 load tests exercise the transaction list endpoint under sustained concurrent load.

---

## Design system

Colors, typography, spacing, motion, component variants, and accessibility requirements are documented in [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md). The palette follows a 60/30/10 rule: Paper (backgrounds), Ledger (text and borders), and Stamp (primary actions). Semantic colors — gain, loss, warn — are reserved exclusively for money and status; they are never used for decoration.

</div>
#
