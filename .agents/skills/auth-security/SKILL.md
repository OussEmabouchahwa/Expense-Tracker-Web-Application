---
name: auth-security
description: Implements and reviews authentication and application security for Masrouf, including argon2id passwords, DB-backed cookie sessions, CSRF protection, password reset, rate limiting, user scoping, CSV export safety, log redaction and account deletion. Use when touching login, sessions, middleware, permissions, export, headers or anything handling untrusted input.
---

# Auth and security

## Goal

Implement the controls in `docs/SECURITY.md` correctly and prove them with tests.

## Instructions

1. **Register and login.** Zod-validate input. Hash with argon2id. Login responses and timing are identical for unknown email and wrong password (verify a dummy hash when the user is missing). Throttle per IP and per email.
2. **Sessions.** Generate a 256-bit random id, store only its SHA-256 hash with `userId`, `expiresAt` (absolute 30 days), `lastUsedAt` (idle 7 days, sliding) and `userAgent`. Issue a new id at every login. Set the cookie `__Host-sid` in production (`HttpOnly; Secure; SameSite=Lax; Path=/`) and `sid` in development.
3. **Session middleware.** Read cookie, hash, look up, check expiry, slide `lastUsedAt` (not on every request: at most once a minute), attach `req.user`. Clear the cookie when invalid.
4. **CSRF.** Generate a token per session, return it from `/auth/login` and `/auth/me`. Require it as `X-CSRF-Token` on `POST`, `PATCH`, `PUT`, `DELETE` and compare in constant time. Also check the `Origin` header against `APP_ORIGIN`.
5. **Password reset.** Single-use random token, store its hash, expiry 30 minutes, identical response for known and unknown emails, send mail through the mailer (Mailpit in development). Reset and change delete all sessions of the user.
6. **Scoping.** Provide a `requireAuth` middleware and a CI check listing routes without it. Repositories take `userId` first. Add a test helper that creates two users to prove isolation.
7. **Account deletion and export.** `DELETE /me` requires the password and erases every row of the user in one transaction. `GET /me/export` returns all the user's data as JSON.
8. **CSV export.** Prefix cells beginning with `=`, `+`, `-`, `@`, tab or carriage return with `'`, quote correctly, stream rows.
9. **Headers and limits.** `helmet` with the CSP from the security document, HSTS in production, body limit, rate limit on `/auth/*` and write endpoints, `Cache-Control: no-store` on auth responses.
10. **Logging.** pino with a redaction list (`password`, `cookie`, `authorization`, `csrfToken`, `email`, `amountMinor`, `payee`, `note`). Test that a request containing those values leaves none of them in the log output.
11. **Web client.** Keep the CSRF token in memory, send it on unsafe requests, handle `401` by clearing state and redirecting to sign in with a return path, never store credentials in localStorage.
12. **Tests.** Implement all 12 from `docs/SECURITY.md` section 10 as automated tests. Do not mark security work done without them.

## Constraints

- Never accept `userId`, `deletedAt` or timestamps from the client.
- Never log personal or financial data.
- Never weaken a security test to make it pass. Fix the code.
