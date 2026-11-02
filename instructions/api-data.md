---
title: REST APIs
description: REST API design from HTTP standards and major API guidelines - contract first, URLs, methods, status codes, errors, pagination, versioning and webhooks.
sidebar:
  order: 5
sources:
  - RFC 9110 (HTTP semantics), RFC 9457 (problem details), RFC 3339 (timestamps), RFC 7396 (JSON Merge Patch)
  - RFC 9745 and RFC 8594 (deprecation and sunset)
  - OpenAPI Specification
  - Google API Improvement Proposals, Microsoft Azure REST API Guidelines, Zalando RESTful API Guidelines, Stripe API
  - OWASP API Security Top 10 (2023)
  - Standard Webhooks
lastVerified: 2026-11-02
# Path scoping: Claude Code reads paths, Copilot reads applyTo. Keep both lists the same.
paths:
  - "**/api/**"
  - "**/routes/**"
  - "**/controllers/**"
  - "**/handlers/**"
  - "**/views.py"
  - "**/views/**"
  - "**/serializers.py"
  - "**/urls.py"
  - "**/webhooks/**"
  - "**/openapi*.yaml"
  - "**/openapi*.yml"
  - "**/openapi*.json"
applyTo: "**/api/**,**/routes/**,**/controllers/**,**/handlers/**,**/views.py,**/views/**,**/serializers.py,**/urls.py,**/webhooks/**,**/openapi*.yaml,**/openapi*.yml,**/openapi*.json"
---

Load for any backend or API. Where the sources differ, pick one option, record it in the API's design doc and apply it everywhere. Access control, input validation, rate limits and URL allowlists are in the security instructions; database rules are in the database instructions.

## First
- API-01: Write or update the OpenAPI document before the code, and get it reviewed. Generate validation, types, docs and clients from it, lint it in CI, and run contract tests against the implementation. Every endpoint and version is in it; remove undocumented, test and retired endpoints from production.
- API-02: Every error is RFC 9457 problem details (`application/problem+json`): `type`, `title`, `status`, `detail`, a stable machine `code` and, for validation, an `errors` list with a JSON Pointer and message per field. Error codes are part of the contract: document them and never change their meaning.
- API-03: Paginate every list, with a documented default and maximum page size. Use opaque cursors (`page_token`/`next_page_token`) for large or changing collections, and offsets only for small, stable ones.
- API-04: Avoid breaking changes: removing or renaming anything, changing a type, meaning, default, status code or error code, adding a required input, or tightening validation. When one is unavoidable, release a new major version. New endpoints, optional fields and new values of extensible enums need no new version.
- API-05: Reject unknown fields on writes (mass assignment), and expose only fields the caller may see.

## Conventions
- API-06: Write API-wide conventions down once: field casing (`camelCase` like Google and Microsoft, or `snake_case` like Stripe and Zalando), versioning, pagination, errors and custom-action style.
- API-07: Paths are plural nouns in lowercase kebab-case: `/invoices/{invoice_id}`. Use methods, not verbs in the path, and no file extensions or trailing slashes.
- API-08: Nest only to show ownership, at most one level (`/customers/{id}/invoices`); otherwise filter (`/invoices?customer_id=`).
- API-09: Custom actions are `POST` on the resource, in one style: `/invoices/{id}:send` (Google) or `/invoices/{id}/send`.
- API-10: IDs are opaque, stable strings that are never reused. Generate random or time-ordered public IDs, because sequential ones let anyone count and guess records.
- API-11: Choose one versioning scheme: a major version in the path (`/v1`), a dated version header (Stripe) or an `api-version` query parameter (Microsoft).

## Methods and status codes
- API-12: Create with `POST /collection`, returning `201`, a `Location` header and the resource. Partial update with `PATCH` and JSON Merge Patch, returning the resource; full replace with `PUT`; delete with `204`.
- API-13: `400` for a malformed request and `422` for valid syntax that fails validation. `404` also for objects the caller may not see, so the response doesn't reveal they exist. `409` for state conflicts and `412` for failed preconditions.
- API-14: Errors never use a `2xx` status, and `5xx` is only for server faults, because clients and monitoring trust the status code.
- API-15: Long-running work returns `202` with a status resource (`Location`) and `Retry-After`, kept for at least 24 hours after completion.
- API-16: Bulk endpoints have a maximum batch size and return a result per item.

## Payloads
- API-17: JSON in UTF-8. Top-level responses are objects, never bare arrays, so fields can be added later.
- API-18: Timestamps are RFC 3339 in UTC (`2026-10-24T09:30:00Z`); calendar dates are `YYYY-MM-DD`. Money is an integer in minor units with an ISO 4217 currency code. Integers above 2^53 are strings.
- API-19: Null and absent mean the same. Return empty arrays, never null. Booleans are never null.
- API-20: Enums are strings documented as extensible. Clients tolerate unknown values, and values are never removed.
- API-21: Return a request ID header on every response and log it. Keep stack traces, queries and internal hostnames out of responses.

## Lists, retries and caching
- API-22: Filter with query parameters named after fields. Sort with one parameter (`sort=-created_at,name`), only on indexed fields from an allowlist. The last page has no next token. Skip total counts on large collections unless they are cheap.
- API-23: Make `POST` retry-safe with an `Idempotency-Key` header. Store the key, a request hash and the response for at least 24 hours; the same key with a different body is an error.
- API-24: Prevent lost updates: return an `ETag`, require `If-Match` on `PATCH`, `PUT` and `DELETE`, and answer `412` on a mismatch.
- API-25: Send `Cache-Control` on every `GET`, and support `If-None-Match` with `304`. Use `private` or `no-store` for user-specific or sensitive data.
- API-26: Before removing anything, mark it deprecated in OpenAPI and send `Deprecation` and `Sunset` headers with a `Link` to the migration guide. Announce a period and watch usage before shutting it down.
- API-27: Use HTTPS only, with OAuth 2.0 or OpenID Connect tokens, or scoped API keys, in headers. Never put credentials in URLs.

## Webhooks
- API-28: Follow Standard Webhooks. Each event has a unique ID, a timestamp and an HMAC-SHA256 signature over the ID, timestamp and raw body. Receivers verify the signature on the raw body, reject stale timestamps, deduplicate by event ID, respond `2xx` fast and process in the background.
- API-29: Senders retry with exponential backoff for a documented period and never promise ordering. Payloads are versioned like the API.
