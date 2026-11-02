---
title: Security
description: Mandatory security rules for every feature - access control, input validation, secrets, dependencies, injection, auth and sessions, headers, privacy and LLM features.
sidebar:
  order: 2
sources:
  - OWASP Top 10
  - OWASP Cheat Sheet Series, including the Password Storage Cheat Sheet
  - NIST SP 800-63B
---

Mandatory for every project. For anything not listed, follow the OWASP Cheat Sheet Series.

## First
- SEC-01: Deny by default. Every route declares who may access it, and the server checks permissions per object and property, not only per route.
- SEC-02: Validate all outside input (requests, forms, env vars, files, API and model responses) with a schema at the boundary, and re-check on the server everything the client sends, because any client can be modified.
- SEC-03: Keep secrets in the platform's secret store or env vars, never in the repo, client bundles, logs, prompts or error messages. Commit `.env.example` with names only, and rotate anything exposed.
- SEC-04: Before adding a dependency, confirm the exact name exists, is maintained, matches its repository and has an allowed licence, because invented and typosquatted names are a real attack.
- SEC-05: The Content Security Policy allows scripts by hash or nonce, without `'unsafe-inline'` or `'unsafe-eval'`.

## Injection and abuse
- SEC-06: Pass user input to SQL, shell commands and file paths only as parameters, never by concatenation.
- SEC-07: Keep auto-escaping on. Raw-HTML escape hatches need review, and rich text is sanitised with an allowlist.
- SEC-08: Fetch user-supplied URLs, including webhook targets, only through an allowlist that blocks internal addresses.
- SEC-09: Every cookie-authenticated, state-changing request has CSRF protection. Never turn it off to make a request work.
- SEC-10: CORS allows named origins only, never `*` with credentials.
- SEC-11: Rate-limit auth, forms, search, expensive endpoints and LLM calls, and cap request and upload sizes. Add bot protection to public forms.
- SEC-12: Check uploads for type and size, rename them, and store them outside the web root.

## Auth and sessions
- SEC-13: Use the framework's or a proven provider's auth, never custom password hashing or session crypto. Offer passkeys where practical, and MFA at least for admins.
- SEC-14: Passwords: at least 8 characters (15 when it is the only factor), allow 64 or more and paste, and block known-breached ones. No composition rules or forced changes, because they push people to predictable passwords.
- SEC-15: Hash passwords with Argon2id, else scrypt; where FIPS-140 is required, PBKDF2-HMAC-SHA-256 with at least 600,000 iterations. Use bcrypt only in legacy systems, handling its 72-byte limit, and plan a migration.
- SEC-16: Session cookies are `Secure`, `HttpOnly`, `SameSite=Lax` or `Strict`, and `__Host-` prefixed where possible. Rotate the session on login and privilege change, and expire idle sessions.
- SEC-17: Sign-in, sign-up and reset respond the same whether or not the account exists.

## Headers and supply chain
- SEC-18: Serve HTTPS only, with HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy` and `frame-ancestors 'none'`, checked by a header test.
- SEC-19: Install from committed lockfiles in CI, audit dependencies there and fix high and critical issues. Pin CI actions to commit SHAs, because tags can move. Bundle front-end libraries instead of loading them from a public CDN.

## Records and privacy
- SEC-20: Write a short threat model for features touching accounts, payments, personal data, uploads, admin or LLM tools.
- SEC-21: Log security events (sign-ins, permission changes, admin actions, exports) with who, what and when, without secrets.
- SEC-22: Collect only the personal data a feature needs, write down why, and keep it out of URLs, analytics and logs.
- SEC-23: Load non-essential cookies and trackers only after consent where the law requires it, with declining as easy as accepting.
- SEC-24: Keep a privacy notice listing data, purposes, retention and processors. Delete data when retention ends, and let users access, correct and delete theirs.

## LLM features (if the product calls a model)
- SEC-25: Treat model input and output as untrusted. Enforce permissions, schemas and human confirmation for risky actions in code, because a prompt can be talked out of its rules, and handle output like user input.
- SEC-26: Send the model only the data the task needs and no secrets, and cap tokens, cost and requests per user.
