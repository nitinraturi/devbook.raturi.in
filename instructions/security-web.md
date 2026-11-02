---
title: Web security
description: Security rules for anything a browser talks to or a user signs in to - a strict CSP, CSRF, CORS, session cookies, passwords and HTTPS headers.
sidebar:
  order: 13
sources:
  - OWASP Cheat Sheet Series (Content Security Policy, CSRF Prevention, HTTP Headers, Session Management)
  - OWASP Password Storage Cheat Sheet
  - NIST SP 800-63B
  - MDN Web Docs on HTTP headers and cookies
# Path scoping: Claude Code reads paths, Copilot reads applyTo. Keep both lists the same.
paths:
  - "**/*.html"
  - "**/*.astro"
  - "**/templates/**"
  - "**/layouts/**"
  - "**/_headers"
  - "**/middleware*"
  - "**/settings.py"
  - "**/settings/**"
  - "**/*session*"
  - "**/*cookie*"
  - "**/*.config.*"
  - "**/wrangler.*"
  - "**/vercel.json"
  - "**/netlify.toml"
  - "**/nginx*.conf"
  - "**/*auth*"
  - "**/*login*"
  - "**/*password*"
  - "**/accounts/**"
applyTo: "**/*.html,**/*.astro,**/templates/**,**/layouts/**,**/_headers,**/middleware*,**/settings.py,**/settings/**,**/*session*,**/*cookie*,**/*.config.*,**/wrangler.*,**/vercel.json,**/netlify.toml,**/nginx*.conf,**/*auth*,**/*login*,**/*password*,**/accounts/**"
---

Load for any project that serves pages or an API to browsers, or has its own sign-in. The rest of security is in `security.md`, which always loads.

- SEC-05: The Content Security Policy allows scripts by hash or nonce, without `'unsafe-inline'` or `'unsafe-eval'`.
- SEC-09: Every cookie-authenticated, state-changing request has CSRF protection. Never turn it off to make a request work.
- SEC-10: CORS allows named origins only, never `*` with credentials.
- SEC-16: Session cookies are `Secure`, `HttpOnly`, `SameSite=Lax` or `Strict`, and `__Host-` prefixed where possible. Rotate the session on login and privilege change, and expire idle sessions.
- SEC-14: Passwords: at least 8 characters (15 when the only factor), allow 64 or more and paste, and block known-breached ones. No composition rules or forced changes, which push people to predictable passwords.
- SEC-15: Hash passwords with Argon2id, else scrypt; under FIPS-140, PBKDF2-HMAC-SHA-256 with at least 600,000 iterations. bcrypt only in legacy systems, handling its 72-byte limit, with a migration plan.
- SEC-17: Sign-in, sign-up and reset respond the same whether or not the account exists.
- SEC-18: Serve HTTPS only, with HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy` and `frame-ancestors 'none'`, checked by a header test.
