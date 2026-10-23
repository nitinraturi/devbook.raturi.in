---
title: Security
description: Security, secrets, dependency and privacy rules an assistant follows for every feature, from authentication to headers, uploads and LLM calls.
sidebar:
  order: 3
---

## Defaults
- Deny by default. Every route and endpoint declares who may access it. Check permissions on the server per object, not only per route.
- Never trust the client: IDs, roles, prices and hidden fields are re-checked on the server.
- Validate every input on the server (type, length, format, allowed values).
- Use parameterised queries or the ORM. Never build SQL, shell commands or file paths from user input by concatenation.
- Encode output for its context and keep framework auto-escaping on. Raw-HTML escape hatches need review; sanitise rich text with an allowlist.
- Server-side fetches of user-supplied URLs use an allowlist and block internal addresses.
- Write a short threat model for features touching accounts, payments, personal data, uploads, admin or LLM tools.

## Auth and sessions
- Use the framework's or a proven provider's auth. Never write custom password hashing or session crypto.
- Session cookies are `Secure`, `HttpOnly` and `SameSite=Lax` or `Strict`. Rotate on login and privilege change; expire idle sessions.
- Rate-limit login, sign-up and reset. Never reveal whether an account exists. Offer MFA, at least for admins.
- Every cookie-authenticated, state-changing request has CSRF protection.

## Headers (web)
- HTTPS only, with HSTS.
- A Content Security Policy without `'unsafe-inline'` or `'unsafe-eval'` for scripts; use hashes or nonces.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`, and `frame-ancestors 'none'`.
- CORS allows named origins only, never `*` with credentials.

## Secrets
- Secrets live in the platform's secret store or env vars. Never in the repo, client bundles, logs, prompts, screenshots or error messages.
- Commit `.env.example` with names only. Use separate, least-privilege credentials per environment. Rotate anything exposed.

## Dependencies
- Ask before adding one. Confirm it exists under that exact name, is maintained, its repository matches the package, and its licence is allowed.
- Commit lockfiles; install from the lockfile in CI. Audit dependencies in CI and fix high or critical issues.
- Pin third-party CI actions to commit SHAs. Load front-end libraries from your own bundle, not a CDN.

## Files and abuse
- Check uploads for type and size, rename them, and store them outside the web root.
- Rate-limit forms, search, expensive endpoints and LLM calls. Add bot protection to public forms.

## Privacy
- Collect only the personal data a feature needs, and write down why.
- Never put personal data in URLs, analytics events or logs.
- Load non-essential cookies and trackers only after consent where the law requires it. Declining is as easy as accepting.
- Keep a privacy notice that lists data, purposes, retention and processors. Delete data when retention ends.
- Users can access, correct and delete their data.

## LLM features (if the product calls a model)
- Treat model input and output as untrusted. Enforce limits in code, never by prompt: permissions, schemas, allowlists and human confirmation for risky actions.
- Validate output against a schema. Never pass it directly to SQL, shell, `eval`, file paths or unencoded HTML.
- Send only the data the task needs. No secrets in prompts. Cap tokens, cost and requests per user.
