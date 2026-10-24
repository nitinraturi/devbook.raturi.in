---
title: Security
description: Mandatory security rules for every feature - secure defaults, auth and sessions, headers, secrets, dependencies, uploads, privacy and LLM features.
sidebar:
  order: 2
---

Mandatory for every project. Covers the OWASP Top 10 risks, with password rules from NIST SP 800-63B. For anything not listed, follow the OWASP Cheat Sheet Series.

## Defaults
- Deny by default. Every route and endpoint declares who may access it, and permissions are checked on the server for each object, not only per route.
- Re-check everything the client sends on the server (IDs, roles, prices, hidden fields, type, length, format), because any client can be modified.
- Use parameterised queries or the ORM. Pass user input to SQL, shell commands and file paths only as parameters, never by concatenation.
- Encode output for its context and keep framework auto-escaping on. A raw-HTML escape hatch needs review, and rich text is sanitised with an allowlist.
- Fetch user-supplied URLs on the server only through an allowlist that blocks internal addresses.
- Write a short threat model for features touching accounts, payments, personal data, uploads, admin or LLM tools.
- Log security events (sign-in, failed sign-in, permission and role changes, admin actions, data exports) with who, what and when, without secrets.

## Auth and sessions
- Use the framework's or a proven provider's auth instead of custom password hashing or session crypto. Offer passkeys (WebAuthn) where practical.
- Passwords: at least 8 characters (15 when the password is the only factor), allow at least 64 characters and paste, and block known-breached passwords. Use no composition rules or forced periodic changes, because they push people to weaker, predictable passwords.
- Hash passwords with Argon2id, or scrypt if it is unavailable. Use bcrypt only in legacy systems, handle its 72-byte input limit, and plan a migration.
- Session cookies are `Secure`, `HttpOnly` and `SameSite=Lax` or `Strict`, with the `__Host-` prefix where possible so subdomains can't overwrite them. Rotate the session on login and privilege change to prevent fixation, and expire idle sessions.
- Rate-limit login, sign-up and reset. Give the same response whether or not an account exists. Offer MFA, at least for admins.
- Every cookie-authenticated, state-changing request has CSRF protection.

## Headers (web)
- HTTPS only, with HSTS.
- A Content Security Policy that allows scripts by hash or nonce, without `'unsafe-inline'` or `'unsafe-eval'`.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and `frame-ancestors 'none'`.
- CORS allows named origins only, never `*` with credentials.

## Secrets
- Keep secrets in the platform's secret store or env vars. Keep them out of the repo, client bundles, logs, prompts, screenshots and error messages.
- Commit `.env.example` with names only. Use separate, least-privilege credentials per environment, and rotate anything exposed.

## Dependencies
- Before adding a dependency, confirm it exists under that exact name, is maintained, its repository matches the package, and its licence is allowed, because typosquatted and invented package names are a real attack.
- Commit lockfiles and install from them in CI. Audit dependencies in CI and fix high or critical issues.
- Pin third-party CI actions to commit SHAs, because tags can be moved to malicious code. Serve front-end libraries from your own bundle instead of a public CDN.

## Files and abuse
- Check uploads for type and size, rename them, and store them outside the web root.
- Rate-limit forms, search, expensive endpoints and LLM calls, and cap request and upload sizes. Add bot protection to public forms.

## Privacy
- Collect only the personal data a feature needs, and write down why.
- Keep personal data out of URLs, analytics events and logs.
- Load non-essential cookies and trackers only after consent where the law requires it. Declining is as easy as accepting.
- Keep a privacy notice that lists data, purposes, retention and processors. Delete data when its retention period ends.
- Users can access, correct and delete their data.

## LLM features (if the product calls a model)
- Treat model input and output as untrusted. Enforce permissions, schemas, allowlists and human confirmation for risky actions in code, because a prompt can be talked out of its rules.
- Validate model output against a schema before use. Pass it to SQL, shell, `eval`, file paths or HTML only through the same parameterising and encoding as user input.
- Send only the data the task needs and no secrets. Cap tokens, cost and requests per user.
