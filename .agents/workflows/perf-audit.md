---
description: Measure performance against the stated budgets
---

1. Build production artifacts and report initial JavaScript size (gzipped) against the 170KB budget.
2. Run Lighthouse on Overview (target 90+, LCP under 2.5s, CLS under 0.1).
3. Seed about 20,000 transactions for one user, run `npm run perf:load`, and report p95 per endpoint (budget 150ms for reads) and error rate.
4. For any slow query run `EXPLAIN (ANALYZE, BUFFERS)`, name the cause, apply the fix, re-measure.
5. Report before and after numbers.
