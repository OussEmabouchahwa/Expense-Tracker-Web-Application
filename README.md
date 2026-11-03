<div align="center">

<img src="https://img.shields.io/badge/Masrouf-Expense%20Tracker-2A5BD7?style=for-the-badge&logo=databricks&logoColor=white" alt="Masrouf" height="50"/>

# Masrouf — Expense Tracker Web Application

**Track income, expenses, and financial summaries with clarity.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📸 Screenshots

<div align="center">

### Dashboard Overview
![Masrouf Dashboard](docs/screenshots/dashboard.png)
*Financial overview — spending pace, budget status, and recent transactions at a glance.*

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#️-architecture)
- [Database Schema](#-database-schema)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Scripts](#-scripts)
- [Skills Demonstrated](#-skills-demonstrated)

---

## 🧾 About

**Masrouf** (مصروف — Arabic for "expense") is a full-stack personal finance web application built as **Task 3** of the internship program. It allows users to track their income and expenses, manage multiple accounts, set monthly budgets per category, and visualize financial reports — all behind a secure authentication layer.

> Built from scratch with a monorepo structure, type-safe API contracts, and a custom SVG charting system.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 💸 **Expense Tracking** | Log expenses by payee, category, account, and date with soft-delete support |
| 💰 **Income Management** | Track income transactions separately with dedicated categories |
| 📊 **Financial Reports** | Monthly income vs expense bars, ranked category breakdown, and savings rate |
| 📈 **Spending Pace** | Live chart comparing current-month cumulative spending to the previous month |
| 🎯 **Budget Management** | Set per-category monthly limits with real-time pace indicators (over/ahead/on pace) |
| 🏦 **Multi-Account** | Manage Cash, Bank, Card, and Savings accounts with opening balances |
| 🔐 **User Authentication** | Cookie-based sessions with CSRF protection, argon2id password hashing, and rate limiting |
| 🔑 **Password Reset** | Secure token-based password reset via email (Nodemailer) |
| 📤 **CSV Export** | Export transactions to CSV with server-side safe rendering |
| 🌍 **Locale-Aware** | Currency, locale, and timezone stored per user (defaults to TND / Africa/Tunis) |

---

## 🛠 Tech Stack

### Frontend (`apps/web`)
| Layer | Technology |
|---|---|
| UI Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| State / Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| Styling | Tailwind CSS (custom design tokens) |
| Charts | Custom SVG with d3-scale & d3-shape |
| Components | Radix UI primitives (Dialog, Select, Popover…) |
| Build | Vite 5 |

### Backend (`apps/api`)
| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM) |
| Framework | Express 4 |
| ORM | Prisma 5 |
| Database | PostgreSQL 18 (embedded for dev) |
| Auth | argon2id · cookie sessions · CSRF tokens |
| Validation | Zod |
| Logging | Pino + pino-http |
| Rate Limiting | express-rate-limit |
| Email | Nodemailer |

### Tooling
| Tool | Purpose |
|---|---|
| npm workspaces | Monorepo management |
| `@masrouf/contracts` | Shared Zod schemas between API and Web |
| Vitest | Unit & integration tests |
| Playwright | End-to-end tests |
| ESLint + Prettier | Code quality |
| Docker Compose | Production deployment |

---

## 🏗️ Architecture

```
expense-kit/                  ← Monorepo root
├── apps/
│   ├── api/                  ← Express REST API
│   │   ├── src/
│   │   │   ├── modules/      ← Feature modules (accounts, budgets, categories, transactions, users)
│   │   │   ├── middleware/   ← Auth, CSRF, error handler, request-id
│   │   │   ├── lib/          ← Prisma client, logger, AppError
│   │   │   └── config/       ← Env validation (Zod)
│   │   └── prisma/
│   │       ├── schema.prisma ← Data model
│   │       ├── migrations/   ← SQL migration history
│   │       └── seed.ts       ← Demo data seeder
│   └── web/                  ← React SPA
│       └── src/
│           ├── features/     ← Overview, Transactions, Budgets, Reports, Accounts
│           ├── components/   ← Charts (SVG), Layout, UI primitives
│           ├── app/          ← Router + AppShell
│           └── lib/          ← Formatters, cn() utility
└── packages/
    └── contracts/            ← Shared Zod schemas (API ↔ Web)
```

### Request Flow

```
Browser → React SPA → TanStack Query → REST API (Express)
                                            ↓
                                      Auth Middleware
                                      CSRF Check
                                            ↓
                                      Module Router
                                            ↓
                                      Prisma ORM → PostgreSQL
```

---

## 🗄 Database Schema

```
User ──┬── Session (cookie-based auth)
       ├── PasswordResetToken
       ├── Account (CASH | BANK | CARD | SAVINGS)
       ├── Category (EXPENSE | INCOME, user-scoped)
       ├── Transaction (linked to Account + Category, soft-delete)
       └── Budget (per category per month, minor-unit limit)
```

> All monetary values are stored as **BigInt minor units** (e.g., 1 TND = 1000 millimes) to avoid floating-point errors.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Docker** (optional — for production PostgreSQL)

### 1. Clone the repository

```bash
git clone https://github.com/OussEmabouchahwa/Expense-Tracker-Web-Application.git
cd Expense-Tracker-Web-Application
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your settings
```

**Required `.env` variables:**

```env
DATABASE_URL="postgresql://masrouf:masrouf@localhost:5432/masrouf"
SESSION_SECRET="change-me-to-a-long-random-string"
CSRF_SECRET="another-long-random-string"
COOKIE_DOMAIN="localhost"
PORT=3000
NODE_ENV=development

# Optional — for password reset emails
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=yourpassword
EMAIL_FROM="Masrouf <noreply@example.com>"
```

### 4. Start the database

```bash
npm run db:start        # Starts embedded PostgreSQL
npm run db:migrate      # Runs Prisma migrations
npm run db:seed         # Seeds demo data (optional)
```

### 5. Start the development servers

```bash
npm run dev
```

| Service | URL |
|---|---|
| Web (React) | http://localhost:5173 |
| API (Express) | http://localhost:3000 |

---

## 📁 Project Structure

```
apps/api/src/modules/
├── accounts/        → CRUD for bank/cash accounts
├── budgets/         → Monthly budget limits per category
├── categories/      → User-scoped income/expense categories
├── transactions/    → Log, list, update, soft-delete transactions
└── users/           → Registration, login, logout, password reset, profile

apps/web/src/features/
├── overview/        → Dashboard: summary cards, spending pace chart, budget bars, recent txns
├── transactions/    → Transaction list with filters, add/edit drawer, CSV export
├── budgets/         → Budget setup per category per month
├── reports/         → Monthly income/expense bar chart, category breakdown
└── accounts/        → Account management
```

---

## 📡 API Reference

All endpoints are prefixed with `/api/v1` and require authentication (cookie session + CSRF header) unless noted.

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Login (sets session cookie) |
| `POST` | `/auth/logout` | Invalidate session |
| `POST` | `/auth/forgot-password` | Request password reset email |
| `POST` | `/auth/reset-password` | Submit reset token + new password |
| `GET` | `/accounts` | List user accounts |
| `POST` | `/accounts` | Create account |
| `PATCH` | `/accounts/:id` | Update account |
| `DELETE`| `/accounts/:id` | Archive account |
| `GET` | `/categories` | List categories |
| `POST` | `/categories` | Create category |
| `GET` | `/transactions` | List transactions (keyset pagination, filters) |
| `POST` | `/transactions` | Create transaction |
| `PATCH` | `/transactions/:id` | Update transaction |
| `DELETE`| `/transactions/:id` | Soft-delete transaction |
| `GET` | `/transactions/export` | Download CSV |
| `GET` | `/budgets` | List budgets for a month |
| `PUT` | `/budgets` | Upsert budget for category+month |
| `GET` | `/reports/summary` | Monthly income/expense/net summary |
| `GET` | `/reports/categories` | Spending by category |

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start API + Web in parallel (with color output) |
| `npm run build` | Build all packages and apps |
| `npm run test` | Run all Vitest unit & integration tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run db:start` | Start embedded PostgreSQL |
| `npm run db:stop` | Stop embedded PostgreSQL |
| `npm run db:migrate` | Apply pending Prisma migrations |
| `npm run db:seed` | Seed demo user and transactions |
| `npm run lint` | ESLint across the monorepo |
| `npm run format` | Prettier format check |
| `npm run format:fix` | Auto-fix formatting |
| `npm run perf:load` | Run k6 load tests |

---

## 🎓 Skills Demonstrated

This project was built as part of a structured internship task covering:

| Skill Area | Implementation |
|---|---|
| **Full-Stack Development** | TypeScript monorepo with shared contracts between React SPA and Express API |
| **Authentication** | Argon2id hashing, DB-backed cookie sessions, CSRF tokens, rate limiting, password reset |
| **Database Operations** | Prisma ORM, PostgreSQL, migrations, soft deletes, keyset pagination, composite indexes |
| **Data Visualization** | Custom SVG charts (spending pace line, monthly bars, category bars, budget pace) |
| **API Design** | RESTful resource endpoints, Zod validation, user-scoped repositories, error handling |
| **Testing & QA** | Vitest unit/integration tests, Testing Library components, Playwright E2E, k6 load tests |
| **DevOps** | Docker Compose, multi-stage builds, Caddy HTTPS, GitHub Actions CI/CD |

---

## 👨‍💻 Author

**Oussema Bouchahwa**
- GitHub: [@OussEmabouchahwa](https://github.com/OussEmabouchahwa)
- Repository: [Expense-Tracker-Web-Application](https://github.com/OussEmabouchahwa/Expense-Tracker-Web-Application)

---

<div align="center">

*Built with ❤️ as part of an internship Full-Stack Development task.*

</div>
#
