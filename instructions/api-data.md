---
title: REST APIs
description: REST API rules from HTTP standards and the Google, Microsoft, Zalando and Stripe guidelines - resources, methods, errors, pagination, versioning and webhooks.
sidebar:
  order: 5
---

Based on RFC 9110 (HTTP semantics), RFC 9457 (problem details), RFC 3339 (timestamps), RFC 9745 and RFC 8594 (deprecation and sunset), the OpenAPI Specification, Google's API Improvement Proposals (AIP), the Microsoft Azure REST API Guidelines, the Zalando RESTful API Guidelines, Stripe's API, the OWASP API Security Top 10 (2023) and Standard Webhooks. Where these sources differ, pick one option, record it in the API's design doc and apply it everywhere. Database rules are in the database instructions.

## Design first
- Write or update the OpenAPI document before the code, and get it reviewed. Generate validation, types, docs and clients from it, lint it in CI, and run contract tests against the implementation.
- Design from the consumer's use cases. Model resources and their relationships first, then use standard methods. Add a custom action only when no standard method fits.
- Write API-wide conventions down once: field casing (`camelCase` as Google and Microsoft use, or `snake_case` as Stripe and Zalando use), versioning, pagination, errors and the custom-action style.

## Resources and URLs
- Paths use plural nouns in lowercase kebab-case: `/invoices/{invoice_id}`. Express actions through methods, not verbs in the path, and use no file extensions or trailing slashes.
- Nest only to show ownership, at most one level (`/customers/{id}/invoices`). Otherwise filter (`/invoices?customer_id=`).
- Custom actions are `POST` on the resource, in one style: `/invoices/{id}:send` (Google) or `/invoices/{id}/send`.
- IDs are opaque, stable strings that are never reused. Clients never parse them. Generate random or time-ordered public IDs, because sequential ones let anyone count and guess records.

## Methods and status codes
- Follow RFC 9110: `GET` and `HEAD` are safe; `GET`, `PUT` and `DELETE` are idempotent. `GET` never changes state.
- Create: `POST /collection` returns `201` with a `Location` header and the resource. Partial update: `PATCH` with JSON Merge Patch (RFC 7396), returning the resource. Full replace: `PUT`. Delete: `204`.
- Use status codes for their meaning:
  - `400` malformed request; `422` valid syntax but failed validation
  - `401` missing or invalid credentials; `403` authenticated but not allowed
  - `404` not found, also for objects the caller may not see, so the response doesn't reveal that they exist
  - `409` state conflict; `412` failed precondition
  - `415` unsupported media type; `429` rate limited
  - `5xx` only for server faults. Errors never use a `2xx` status, because clients and monitoring trust the status code.
- Long-running work returns `202` with a status resource (`Location`) and `Retry-After`. Keep that resource for at least 24 hours after completion.
- Bulk endpoints have a maximum batch size and return a result per item.

## Requests and responses
- JSON in UTF-8. Top-level responses are objects, never bare arrays, so fields can be added later.
- Timestamps are RFC 3339 in UTC (`2026-10-24T09:30:00Z`); calendar dates are `YYYY-MM-DD`. Money is an integer in minor units with an ISO 4217 currency code. Integers above 2^53 are strings.
- Null and absent mean the same. Return empty arrays, never null. Booleans are never null.
- Enums are strings documented as extensible. Clients must tolerate unknown values, and values are never removed.
- Reject unknown fields on writes, so clients can't set fields they shouldn't (mass assignment). Responses expose only fields the caller may see, never internal ones.
- Offer field selection or expansion (`fields`, `expand`) only when payload size or round trips are a measured problem.

## Errors
- Every error is RFC 9457 problem details (`application/problem+json`): `type`, `title`, `status`, `detail`, plus a stable machine `code` and, for validation, an `errors` list with a JSON Pointer and message per field.
- Error codes are part of the contract: document them and never change their meaning.
- Return a request ID header on every response and log it. Keep stack traces, queries and internal hostnames in the logs, out of responses.

## Lists
- Paginate every list, with a documented default and maximum page size. The server may return fewer items.
- Use opaque cursors (`page_token`/`next_page_token`) for large or changing collections. Use offsets only for small, stable ones. The last page has no next token.
- Filter with query parameters named after fields. Sort with one parameter (`sort=-created_at,name`). Allow only indexed fields, from an allowlist.
- Don't return total counts on large collections unless they are cheap.

## Retries, concurrency and caching
- Make `POST` retry-safe with an `Idempotency-Key` header (IETF draft, Stripe practice). Store the key, a request hash and the response for at least 24 hours. The same key with a different body is an error.
- Prevent lost updates: return an `ETag`, require `If-Match` on `PATCH`, `PUT` and `DELETE`, and answer `412` on a mismatch.
- Send `Cache-Control` on every `GET`, and support `If-None-Match` with `304`. Use `private` or `no-store` for user-specific or sensitive data.

## Versioning and change
- Additive changes need no new version: new endpoints, optional fields and documented-extensible enum values. Clients ignore unknown fields.
- Breaking changes include:
  - removing or renaming anything
  - changing a type or meaning
  - adding a required input
  - tightening validation
  - changing defaults, status codes or error codes
  
  Avoid them. When one is unavoidable, release a new major version.
- Choose one versioning scheme: a major version in the path (`/v1`), a dated version header (Stripe) or an `api-version` query parameter (Microsoft).
- Before removing anything, mark it deprecated in OpenAPI and send the `Deprecation` (RFC 9745) and `Sunset` (RFC 8594) headers with a `Link` to the migration guide. Announce a period, and watch usage before shutting it down.

## Security (OWASP API Top 10)
- HTTPS only. Use OAuth 2.0 or OpenID Connect tokens, or scoped API keys, in headers. Never send credentials in URLs.
- Authorise on the server for every object, every property and every function, not only per route.
- Limit consumption per client: rate limits with `429` and `Retry-After`, maximum page and batch sizes, and timeouts. Protect sensitive flows (sign-up, checkout) against automation.
- Validate user-supplied URLs, such as webhook targets, against an allowlist, and block internal addresses.
- Every endpoint and version is in the OpenAPI document. Remove undocumented, test and retired endpoints from production.

## Webhooks
- Follow Standard Webhooks:
  - Each event has a unique ID, a timestamp and an HMAC-SHA256 signature over the ID, the timestamp and the raw body.
  - Receivers verify the signature on the raw body and reject stale timestamps.
  - Receivers deduplicate by event ID, respond `2xx` fast and process in the background.
- Senders retry with exponential backoff for a documented period and never promise ordering. Payloads are versioned like the API.
