# Security rules (always on)

Authoritative detail is in `docs/SECURITY.md`. These apply to every change.

1. **Default deny.** Every route requires authentication unless explicitly marked public with a reason.
2. **Never trust the client.** `userId`, `deletedAt`, timestamps and ownership come from the server. Ignore such fields in request bodies.
3. **Scope every query** by the authenticated user. Verify client-supplied `accountId` and `categoryId` belong to that user. Return 404 for other users' resources.
4. **Validate at the edge** with strict Zod schemas, with length and range caps. Reject unknown keys.
5. **Sessions:** opaque random id in an HttpOnly, Secure, SameSite=Lax cookie, only its SHA-256 hash stored. Never store credentials in localStorage or sessionStorage.
6. **CSRF:** every unsafe request needs the `X-CSRF-Token` header and a valid `Origin`.
7. **Passwords** use argon2id. Auth and reset responses never reveal whether an account exists.
8. **Privacy in logs:** never log amounts, payees, notes, emails, cookies, tokens or passwords. Use the redacting logger.
9. **Output:** never use `dangerouslySetInnerHTML` with user input. CSV export neutralizes cells starting with `=`, `+`, `-`, `@`, tab or carriage return.
10. **Headers:** helmet with a strict CSP, HSTS in production, rate limits on auth and write endpoints.
11. Any change touching auth, sessions, scoping, export or logging needs a matching security test from `docs/SECURITY.md` section 10, or a new one.
