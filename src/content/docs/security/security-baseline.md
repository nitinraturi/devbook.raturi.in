---
title: Security baseline
description: Minimum security rules for any web or mobile app - OWASP coverage, authentication, authorisation, input and output handling, headers, secrets, files and rate limits.
lastVerified: 2026-10-22
sidebar:
  order: 1
---

This is the floor, not the ceiling. Use the current [OWASP Top 10](https://owasp.org/www-project-top-ten/) as the risk list and the [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) as the detailed checklist; choose ASVS level 1 for simple sites, level 2 for anything with accounts, payments or personal data.

## Rules

### Threat model
- Any feature touching accounts, payments, personal data, file uploads, admin functions or LLM tools **MUST** have a short threat model in the spec: what is valuable, who might attack it, how, and what stops them.

### Authentication
- Prefer a proven provider or framework auth over custom code. Never write your own password hashing or session crypto.
- Passwords hashed with a modern slow algorithm (Argon2id, scrypt or bcrypt) through the framework.
- Support multi-factor authentication for admin accounts at minimum.
- Session cookies: `Secure`, `HttpOnly`, `SameSite=Lax` or `Strict`; rotate the session on login and privilege change; expire idle sessions.
- Login, sign-up and password reset are rate-limited and do not reveal whether an account exists.

### Authorisation
- **Deny by default.** Every endpoint and page declares who may access it.
- Check permission **per object** on the server (does this user own this order?), not only per route.
- Never trust IDs, roles or prices sent from the client.

### Input and output
- Validate every input on the server against a schema (type, length, format, allowed values).
- Use parameterised queries or the ORM; never build SQL or shell commands by string concatenation.
- Encode output for its context (HTML, attribute, URL, JS). Use the framework's auto-escaping; treat any "raw HTML" escape hatch as a security review item.
- Sanitise user-supplied rich text with an allowlist sanitiser.
- Server-side requests to user-supplied URLs **MUST** use an allowlist and block internal addresses (SSRF).

### Transport and headers
- HTTPS everywhere; HSTS enabled.
- A Content Security Policy that avoids `'unsafe-inline'` and `'unsafe-eval'` for scripts (use hashes or nonces).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and `frame-ancestors 'none'` (or a defined allowlist).
- CORS allows only named origins; never `*` with credentials.
- CSRF protection on every state-changing form or cookie-authenticated request.

### Secrets
- Secrets live in the platform's secret store or environment variables, never in the repo, client bundle, logs, prompts or screenshots.
- `.env` files are git-ignored; `.env.example` holds names only.
- Rotate any secret that was exposed, even briefly, and record it.
- Use separate credentials per environment with least privilege.

### Files
- Validate uploads by content type and size, store them outside the web root or in object storage, rename them, and serve with safe headers. Scan where risk justifies it.

### Abuse
- Rate-limit authentication, forms, search, expensive endpoints and LLM calls.
- Bot protection on public forms where spam is likely.

### Dependencies and patching
- See [supply chain security](/security/supply-chain/).

## Checklist
- [ ] Threat model for sensitive features
- [ ] Framework auth, MFA for admins, secure cookies
- [ ] Deny-by-default, per-object authorisation
- [ ] Schema validation; parameterised queries; context encoding
- [ ] CSP without unsafe-inline scripts; security headers set
- [ ] No secrets in repo, bundle, logs or prompts
- [ ] Rate limits on auth and expensive endpoints
