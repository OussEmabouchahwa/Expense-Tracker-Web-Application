---
name: devops-optimization
description: Containerizes, deploys and optimizes Masrouf using multi-stage Docker builds, Docker Compose, Caddy HTTPS, nightly encrypted backups, GitHub Actions CI/CD, health checks, query tuning, caching headers, bundle budgets and k6 load tests. Use when working on Dockerfiles, compose files, pipelines, environment configuration, performance, observability or release steps.
---

# DevOps and optimization

## Goal

One command to run locally, a repeatable path to production, and performance measured against stated budgets.

## Deployment assets (`deploy/`)

1. **Dockerfiles** (multi-stage, pinned base images, non-root, `.dockerignore`): `api.Dockerfile` (build, prune dev dependencies, run `node dist/main.js`), `web.Dockerfile` (Vite build, Nginx serving).
2. **Root `docker-compose.yml`** (development services): `db` (postgres:16, healthcheck, volume) and `mailpit`.
3. **`deploy/docker-compose.prod.yml`:** `caddy`, `web`, `api`, `db`, `backup`. Healthchecks, `restart: unless-stopped`, resource limits, no published ports except Caddy 80 and 443. The API and web share one origin through Caddy (`/api` to the API).
4. **`Caddyfile`:** automatic HTTPS, HSTS, gzip and zstd, `/api` reverse proxy, everything else to web.
5. **`nginx.conf`:** SPA fallback, long immutable cache for hashed assets, `no-cache` for `index.html`.
6. **Backups:** nightly `pg_dump`, encrypted (age or gpg) to a separate volume with retention, plus **`RESTORE.md`** with restore steps that were actually tested.
7. **`.env.production.example`** listing every variable with safe placeholders. Migrations run as an explicit step (`prisma migrate deploy`) before the new API takes traffic.

## CI/CD (GitHub Actions)

- `ci.yml` on pull requests: install with cache, lint, typecheck, tests with a Postgres service, build, `npm audit --omit=dev`, Playwright on main.
- `release.yml` on version tags: build and push images to GHCR, deploy over SSH (`pull`, `up -d`, migrate, health check, automatic rollback if `/ready` fails). Secrets only from GitHub secrets.

## Optimization

1. **Database:** confirm the architecture indexes exist. With a seed of about 20,000 transactions for one user run `EXPLAIN (ANALYZE, BUFFERS)` on the transaction list, summary, spending pace, by-category and trend queries. Record before and after timings, fix any sequential scan on `Transaction`.
2. **API:** gzip, `ETag` on report reads, pagination caps, request timeouts, pool size and statement timeout set.
3. **Web:** route-level splitting, charts as lazy chunks, font preload, reserved chart height, initial JS under 170KB gzipped, LCP under 2.5s, CLS under 0.1, bundle analyzer.
4. **Load test:** `perf/k6/main.js` with login, Overview calls, transaction list and a transaction create. Thresholds: p95 under 150ms for reads, error rate under 1%. Exposed as `npm run perf:load`.
5. **Lighthouse CI** on Overview with a performance budget of 90.
6. **Observability:** JSON logs with `requestId` and no financial data, `/health`, `/ready`, documented alerts (error rate, p95, login failure spike, disk usage, backup age).

## Report after any change

Before and after numbers and how they were measured.

## Constraints

- No secrets in images or git. No `latest` tags. No root containers.
- No Redis, queue or Kubernetes without a measured need and an ADR.
