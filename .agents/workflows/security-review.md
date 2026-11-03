---
description: Audit authentication, scoping and input handling
---

1. Follow `docs/SECURITY.md`. For each of the 12 required security tests confirm it exists, runs and passes.
2. List every route and verify it has `requireAuth` or an explicit public marker with a reason.
3. Grep repositories for any function lacking `userId` as the first argument or any query lacking a `userId` filter.
4. Check headers on a live response (CSP, HSTS in production mode, nosniff), cookie flags, CSRF enforcement and the Origin check.
5. Run `npm audit --omit=dev` and list findings with severity.
6. Confirm logs for a sample request contain no amounts, payees, notes or emails.
7. Report findings ranked by severity with a fix for each.
