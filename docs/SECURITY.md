# Security: Masrouf

Financial data is sensitive even when the amounts are small. Every control below has a test or a check in the Definition of Done.

## 1. Assets and actors

**Assets:** accounts and credentials, sessions, every transaction (amounts, payees, notes), budgets, personal data (name, email).

**Actors:** anonymous visitor, authenticated user, attackers: credential stuffers, a malicious user probing another user's data, an XSS or CSV payload author, someone with a stolen laptop or cookie.

## 2. Threat model (condensed STRIDE)

| Threat | Example | Control |
|---|---|---|
| Spoofing | Credential stuffing, stolen session cookie | argon2id, rate limits and backoff, HttpOnly Secure cookies, session rotation at login, revocation |
| Tampering | Changing another user's transaction by guessing its id (IDOR) | `userId` in every repository query, ownership checks on foreign keys, 404 on foreign ids |
| Repudiation | "I never deleted that" | Soft delete with timestamps, auth events logged |
| Information disclosure | Amounts or notes in logs, user enumeration at login or reset, verbose errors | Log redaction, uniform auth responses, generic 500s with `requestId` |
| Denial of service | Login flood, expensive reports, huge CSV export | Rate limits, date-range and page-size caps, streamed export with a row cap |
| Elevation of privilege | Mass assignment of `userId` or `deletedAt` in a body | Strict Zod schemas drop unknown keys, `userId` always comes from the session |
| XSS | Payee or note containing HTML or script | React escapes output, no `dangerouslySetInnerHTML`, strict CSP |
| CSRF | A foreign site submits a transaction using the victim's cookie | SameSite=Lax, CSRF token header, Origin check |
| CSV injection | A payee like `=HYPERLINK(...)` executed when the export opens in a spreadsheet | Cells starting with `=`, `+`, `-`, `@`, tab or carriage return are prefixed with `'` on export |
| Data loss | Accidental delete or failed deploy | Soft delete with Undo, nightly encrypted backup, tested restore |

## 3. Authentication and sessions

- **Passwords:** argon2id with tuned memory cost, minimum 10 characters, maximum 128, checked against a common-password list. No composition rules.
- **Sessions:** random 256-bit id in the cookie, SHA-256 hash in the database, idle timeout 7 days (sliding), absolute lifetime 30 days. A new id is issued at login (fixation defense). Cookie `__Host-sid; Secure; HttpOnly; SameSite=Lax; Path=/` in production.
- **CSRF:** the session carries a random CSRF token. Every `POST`, `PATCH`, `PUT` and `DELETE` must send it in `X-CSRF-Token` and pass an `Origin` check against the configured app origin.
- **Login:** errors and timing are identical for unknown email and wrong password (verify a dummy hash). Throttle per IP and per email (for example 5 per minute, then backoff). No permanent lockouts.
- **Registration:** returns the same message whether the email exists or not when email verification is on. (Email verification is optional in v1. If off, registration states plainly that the email is taken.)
- **Password reset:** single-use random token, stored hashed, 30-minute expiry, identical response for known and unknown emails. A reset or change deletes all the user's sessions.
- **Logout:** deletes the session row. "Sign out everywhere" deletes all of them.

## 4. Authorization

- Default deny. Routes without `requireAuth` fail a CI check unless explicitly marked public.
- Every repository function takes `userId` first and filters by it. There is no fetch-by-id-only function.
- Foreign keys from the client (`accountId`, `categoryId`) are verified to belong to the user.
- Cross-user resources return `404`.

## 5. Input, output, export

- Validate every body, query and param with strict Zod schemas. Reject unknown keys, cap string lengths (payee 120, note 500), cap ranges (`limit` 100, date span 10 years).
- Prisma parameterizes queries. Raw SQL for reports uses parameter binding only (`$queryRaw` tagged templates), never string concatenation.
- Amounts are integers validated as positive safe integers. Dates are validated calendar dates.
- CSV export is generated server-side with the injection prefix rule above, correct quoting, `Content-Type: text/csv; charset=utf-8` and `Content-Disposition: attachment`.

## 6. Transport, headers, browser

- HTTPS only (HSTS in production). `helmet` plus CSP: `default-src 'self'`, no inline scripts, `img-src 'self' data:`, `connect-src 'self'`, `frame-ancestors 'none'`.
- Single origin, so no CORS in production. In development the Vite proxy keeps it single-origin as well. If CORS is ever enabled, use an explicit allow-list.
- Body limit 100kb for JSON. Remove `X-Powered-By`. `Cache-Control: no-store` on auth responses, `private` on data responses.

## 7. Privacy and logging

- Logs never contain amounts, payees, notes, emails, passwords, cookies or CSRF tokens. The logger redacts by key list and tests assert it.
- The user can export all their data (`GET /me/export`) and delete their account (`DELETE /me`, real erase, requires the password).
- Backups are encrypted, retained for a fixed period, and restore-tested.
- Seed and demo accounts exist in development only and are never created in production.

## 8. Secrets and supply chain

- Secrets only from environment variables. `.env` is git-ignored, `.env.example` lists every key with safe placeholders. Production secrets live in the host's secret store.
- Lockfile committed. `npm audit --omit=dev` and Dependabot in CI. Pin base images. Containers run as non-root.
- New dependencies need a justification in the commit message.

## 9. OWASP Top 10 (2021) mapping

| Risk | Handled by |
|---|---|
| A01 Broken access control | Sections 3 and 4, IDOR tests |
| A02 Cryptographic failures | argon2id, hashed session ids, TLS, HSTS |
| A03 Injection | Zod, Prisma, bound raw SQL, CSV injection rule |
| A04 Insecure design | Threat model, single-tenant scoping by construction |
| A05 Security misconfiguration | helmet, CSP, non-root containers, no CORS surface |
| A06 Vulnerable components | Audit in CI, Dependabot |
| A07 Authentication failures | Section 3 |
| A08 Integrity failures | Lockfile, CI-built images |
| A09 Logging failures | Structured logs with redaction, auth event logging |
| A10 SSRF | No server-side fetch of user-supplied URLs |

## 10. Required security tests

These must exist and pass before the project is considered done:

1. User B cannot read, update, delete or restore user A's transaction, account, category or budget (expect 404 each).
2. A request referencing another user's `accountId` or `categoryId` is rejected.
3. A body containing `userId`, `deletedAt` or other unknown keys is rejected or the keys are ignored, and the result is still scoped to the caller.
4. Unsafe requests without a valid CSRF token or with a foreign `Origin` return 403.
5. Login and password-reset responses (body and status) are identical for existing and unknown emails.
6. After password change or logout everywhere, the old session cookie no longer works.
7. A session expired by idle timeout or absolute lifetime is rejected.
8. The login endpoint returns 429 after the configured number of failures.
9. CSV export neutralizes cells beginning with `=`, `+`, `-`, `@`, tab and carriage return.
10. Logs for a request containing an amount, payee and note contain none of those values.
11. Security headers and CSP are present on every response.
12. `DELETE /me` removes every row belonging to the user and nothing else.
