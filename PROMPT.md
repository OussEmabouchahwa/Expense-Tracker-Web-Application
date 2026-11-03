# Master prompt for Antigravity: Masrouf Expense Tracker

How to use: put `.agents/`, `docs/` and `README.md` from this kit into an empty project folder, open it in Antigravity, choose **Planning** mode, and paste everything under the line below into the agent chat.

---

You are a senior full-stack engineer, system architect and product designer working as one team. Build **Masrouf**, a production-quality **Expense Tracker web application**, in this workspace. It must read like the work of an experienced team: a deliberate architecture, correct money handling, secure authentication, strict typing, meaningful tests, accurate documentation, and a distinctive, polished interface with honest data visualization. It must not look like a tutorial project or a generic AI-generated finance template.

## 0. Before writing any code

1. Read, in this order: `.agents/rules/*`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/DESIGN_SYSTEM.md`, open and study `docs/design-reference.html`, `README.md`, then every skill in `.agents/skills/`. They are binding. The documents describe the target structure, scripts, API and design, and the finished project must match them.
2. Produce an implementation plan (Plan artifact): modules, data model, API contract, component tree, chart inventory, and the phases below with their checks. Then proceed without waiting unless a decision is genuinely ambiguous. If you must deviate from a document, add an ADR row and say why.

## 1. Product

A person records income and expenses, organizes them by account and category, sets monthly budgets, and reads reports that answer "am I on track?". Single user per account, only their own data is ever visible.

The four key features, each working end to end:

1. **Expense tracking:** add, edit, soft-delete with Undo, search, filter and paginate transactions. Keyboard-first quick add.
2. **Income management:** income categories and entries, savings rate, accounts with live balances.
3. **Financial reports:** summary with comparison, spending pace versus last month by the same day, spending by category, 12-month trend, budget progress with the pace marker, top payees, CSV export.
4. **User authentication:** register, sign in, sign out, sign out everywhere, forgot and reset password, change password, export and delete account.

## 2. Stack (fixed, do not substitute)

- Monorepo with npm workspaces: `apps/web`, `apps/api`, `packages/contracts`.
- Web: React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS 3.4, Radix UI, cmdk, React Hook Form, Zod, lucide-react, d3-scale and d3-shape (custom SVG charts, no charting kit).
- API: Node 20+, Express, TypeScript, Zod, Prisma, PostgreSQL 16 (raw parameterized SQL for reports), pino and pino-http, helmet, argon2, express-rate-limit, cookie-parser, nodemailer.
- Tests: Vitest, Supertest, Testing Library, Playwright with axe, k6.
- Delivery: Docker, Docker Compose, Caddy, GitHub Actions.

## 3. Phases (these follow the five workflow steps of the task)

After each phase: run its checks, fix failures, update docs, commit with a Conventional Commit.

### Step 1: Design dashboard screens

- **Phase 1, scaffold and foundations:** workspaces, TypeScript configs, ESLint, Prettier, `packages/contracts` with money and date functions (`parseMoney`, `formatMoney`, currency exponents, month and day helpers, pace and budget status) and exhaustive unit tests, environment validation, pino logging, error filter, request ids, docker compose for `db` and `mailpit`. Check: `lint`, `typecheck` and contract tests pass.
- **Phase 2, design foundation and dashboard screens:** follow `frontend-ui`, `data-viz` and the design system. `tokens.css` (paper, ledger, stamp, 60/30/10), Tailwind mapping, Source Serif 4 and Source Sans 3, `components/ui` primitives, chart components, TopBar, MonthSwitcher, StatementBand, PaceBar, Overview, Transactions, Budgets and Reports screens built against **typed fixtures** from `packages/contracts`, with all states (loading, empty, error, populated). A temporary `/__kit` route shows every primitive and chart. Check: Overview matches `docs/design-reference.html`, component tests pass, `design-review` clean at 1440, 768 and 390.

### Step 3: Store financial records in a database (built before the APIs need it)

- **Phase 3, data model:** Prisma schema for every entity in the ERD, check constraints, the indexes in the architecture document, first migration, an idempotent development seed (demo user, 3 accounts, 12 categories, 12 months of realistic TND transactions with dates relative to today, budgets for the current month). **All data access is user-scoped from the start**, using a development-only auth stub that returns the seeded user, so Step 5 replaces the stub without touching repositories. Check: migrate and seed succeed on an empty database, repository tests prove user scoping.

### Step 2: Create expense management APIs

- **Phase 4, CRUD APIs:** follow `backend-api` and `finance-domain`. Modules `accounts`, `categories`, `transactions` (filters, keyset pagination, idempotent create, soft delete and restore, CSV export), `budgets`, `users`. Strict Zod validation, standard error shape, OpenAPI. Check: integration tests cover every endpoint and status code.

### Step 4: Display reports and summaries

- **Phase 5, reports and wiring:** the six report endpoints with SQL aggregates (see architecture section 8), integration tests with **hand-computed expected values**, then replace fixtures with real API calls in the web app. Charts render real data, findings are generated as sentences, "View as table" works. Check: report tests pass, Overview and Reports show correct numbers for the seed data.

### Step 5: Implement authentication

- **Phase 6, authentication and security:** follow `auth-security`. Register, login, logout, logout-all, forgot and reset password, change password, `/auth/me` with CSRF token, session middleware, CSRF and Origin checks, rate limits, helmet and CSP, `DELETE /me` and `GET /me/export`. Replace the development stub with real sessions. Web: auth screens, route guards, CSRF header on unsafe requests, redirect after login, expired-session handling. Check: the 12 security tests in `docs/SECURITY.md` section 10 pass.
- **Phase 7, quality pass:** run `/verify`, `/security-review` and `/review-design`. Playwright path with axe checks (register, add transactions, set a budget, read reports, export CSV, sign out and in). Fix everything reported.
- **Phase 8, deploy and optimize:** follow `devops-optimization`. Dockerfiles, production compose with Caddy, backup job and `RESTORE.md`, CI and release workflows, caching headers, bundle and Lighthouse budgets, k6 test, query review with `EXPLAIN ANALYZE` and before and after numbers. Check: `/perf-audit` meets the budgets and a clean machine can run the stack using only the README.

## 4. Quality bar

- Strict TypeScript, ESLint and Prettier clean with zero warnings. Every rule in `.agents/rules/` respected.
- **Money is integer minor units everywhere. Dates are plain days. Boundaries use the user's timezone.** No floats for amounts, no server-timezone business logic.
- Every repository function takes `userId` and filters by it. Foreign keys from the client are verified to belong to the user.
- Interface follows the design system exactly: paper, ledger and stamp blue at 60/30/10, Source Serif 4 and Source Sans 3 scale, the Pace Marker as the signature, money display rules, chart rules, no banned patterns.
- Accessible: WCAG 2.2 AA, keyboard operable (including `n`, `/`), visible focus, every chart has a text summary and a table alternative.
- Tests at every level, 85% line coverage on services and the domain functions.
- Documentation accurate: README, architecture (with new ADR rows), security, deployment.

## 5. Do not

- Do not substitute the stack or add dependencies beyond those listed without an ADR.
- Do not use floating point for money, `parseFloat(x) * 1000`, or `new Date()` arithmetic for month boundaries.
- Do not fetch any user-owned row by id alone.
- Do not log amounts, payees, notes or emails.
- Do not use `any`, raw hex in components, gradients, pie or donut charts, a hue per category, sparklines on KPIs, emoji, or placeholder content.
- Do not weaken or delete a failing test or check to proceed.
- Do not add Redis, queues or multi-currency. They are documented as the scaling path only.

## 6. Definition of done

- On a clean machine: `npm install`, `docker compose up -d db mailpit`, `npm run db:migrate`, `npm run db:seed`, `npm run dev` gives a working app, and the demo account from the README works.
- `npm run lint`, `npm run typecheck`, `npm run test` and `npm run test:e2e` pass, including the 12 security tests and the report tests with hand-computed values.
- All four key features work end to end in the browser with the specified states, and Overview numbers equal what the API and database say.
- Production compose runs the stack behind Caddy with health checks, nightly backups and the documented release process.
- Budgets met: initial JS under 170KB gzipped, Lighthouse 90+ on Overview, API p95 under 150ms for list and report endpoints.
- Final message includes a walkthrough: what was built, the architecture in a few lines, test and security results, performance numbers, screenshots of Overview, Transactions, Budgets and Reports at three widths, and every deviation from this brief with the reason.
