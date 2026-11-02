---
title: Security
description: Mandatory security rules for every project - access control, input validation, secrets, dependencies, injection, auth, privacy and LLM features.
sidebar:
  order: 2
sources:
  - OWASP Top 10
  - OWASP Cheat Sheet Series, including the Secrets Management Cheat Sheet
  - GitHub Docs on secret scanning and fine-grained tokens
---

Follow the OWASP Cheat Sheet Series for anything not listed. Browser and sign-in rules (CSP, cookies, headers, passwords) are in `security-web.md`.

## First
- SEC-01: Deny by default. Every route declares who may access it, and the server checks permissions per object and property, not only per route.
- SEC-02: Validate all outside input (requests, forms, env vars, files, API and model responses) with a schema at the boundary; re-check on the server anything a client sends, because clients can be modified.
- SEC-03: Keep secrets in the platform's secret store or env vars, never in the repo, client bundles, logs, prompts or errors. Commit `.env.example` with names only. Revoke an exposed secret first; deleting the commit leaves copies.
- SEC-27: Never put a secret in a command argument, URL, chat or CI output, which are logged; take it through a hidden prompt or stdin. Tokens get least scope (one repository or service) and an expiry.
- SEC-28: Scan for secrets before each commit and in CI, and treat a hit as a leak until a human clears it. Generate test keys at run time instead of committing them.
- SEC-29: Gitignore every file that can hold secrets before it exists, because scanners miss unusual formats. `node .devbook/skills/devbook-setup/scripts/gitignore-secrets.mjs` adds the patterns and lists tracked ones.
- SEC-04: Before adding a dependency, confirm the exact name exists, is maintained, matches its repository and has an allowed licence, because typosquatting is a real attack.

## Injection, abuse and auth
- SEC-06: Pass user input to SQL, shell commands and file paths only as parameters, never by concatenation.
- SEC-07: Keep auto-escaping on. Review raw-HTML escape hatches; sanitise rich text with an allowlist.
- SEC-08: Fetch user-supplied URLs, including webhook targets, only through an allowlist that blocks internal addresses.
- SEC-11: Rate-limit auth, forms, search, expensive endpoints and LLM calls, and cap request and upload sizes. Add bot protection to public forms.
- SEC-12: Check uploads for type and size, rename them, and store them outside the web root.
- SEC-13: Use the framework's or a proven provider's auth, never custom password hashing or session crypto. Offer passkeys where practical, and MFA at least for admins.

## Supply chain
- SEC-19: Install from committed lockfiles in CI, audit dependencies there and fix high and critical issues. Pin CI actions to commit SHAs, because tags can move. Bundle front-end libraries instead of loading them from a public CDN.

## Records and privacy
- SEC-20: Write a short threat model for features touching accounts, payments, personal data, uploads, admin or LLM tools.
- SEC-21: Log security events (sign-ins, permission changes, admin actions, exports) with who, what and when, without secrets.
- SEC-22: Collect only the personal data a feature needs, write down why, and keep it out of URLs, analytics and logs.
- SEC-23: Load non-essential cookies and trackers only after consent where the law requires it, with declining as easy as accepting.
- SEC-24: Keep a privacy notice listing data, purposes, retention and processors. Delete data when retention ends, and let users access, correct and delete theirs.

## LLM features (if the product calls a model)
- SEC-25: Treat model input and output as untrusted. Enforce permissions, schemas and confirmation for risky actions in code, because a prompt can be talked out of its rules, and handle output like user input.
- SEC-26: Send the model only the data the task needs and no secrets, and cap tokens, cost and requests per user.
