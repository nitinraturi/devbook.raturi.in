---
name: api-design
description: "Adds or changes a REST API endpoint contract first: OpenAPI, server-side access checks, RFC 9457 problem-details errors, status codes, pagination, idempotency, ETags, webhooks and contract tests. Use when asked to add, change, remove or fix an API endpoint, route, JSON error response or webhook."
license: CC-BY-4.0
---

# API design

Where these rules leave a choice, use the convention the API already follows; if there is none, pick one, write it in the API's design doc or `AGENTS.md`, and apply it everywhere.

## Procedure

1. Read the API's OpenAPI document and conventions (field casing, versioning, pagination, error and custom-action style).
2. Update the OpenAPI document before the code: path, method, parameters, request and response schemas, error codes and examples. If the change breaks existing clients (see Compatibility), stop and ask.
3. Implement with the rules below. Authorise on the server for each object and field, and validate the request with a schema that matches the OpenAPI document.
4. Test the contract: success, each validation error, unauthenticated, forbidden, not found, and the pagination or idempotency cases the endpoint uses. Run contract tests against the OpenAPI document if the project has them.
5. Report the endpoint, the tests and their output, and open questions.

## Rules

Contract and compatibility
- Every endpoint and version is in the OpenAPI document. Remove undocumented, test and retired endpoints from production.
- Breaking changes: removing or renaming anything; changing a type, meaning, default, status code or error code; adding a required input; tightening validation. Avoid them, or release a new major version. New endpoints, optional fields and new values of extensible enums are not breaking.
- Before removing anything, mark it deprecated in OpenAPI and send `Deprecation` and `Sunset` headers with a `Link` to the migration guide.

Resources and methods
- Paths are plural lowercase kebab-case nouns (`/invoices/{invoice_id}`), nested at most one level to show ownership; otherwise filter (`/invoices?customer_id=`). No verbs, file extensions or trailing slashes.
- Custom actions are `POST` on the resource, in one style: `/invoices/{id}:send` or `/invoices/{id}/send`.
- IDs are opaque, stable, never reused, and random or time-ordered, because sequential IDs let anyone count and guess records.
- Create with `POST` → `201`, a `Location` header and the resource. Partial update with `PATCH` (JSON Merge Patch) → the resource. Replace with `PUT`. Delete → `204`.
- Reject unknown fields on writes, and return only fields the caller may see.

Status codes and errors
- `400` malformed, `422` valid syntax that fails validation, `404` also for objects the caller may not see, `409` state conflict, `412` failed precondition. Errors never use `2xx`; `5xx` only for server faults.
- Every error is RFC 9457 problem details (`application/problem+json`) with `type`, `title`, `status`, `detail`, a stable machine `code` and, for validation, an `errors` list with a JSON Pointer and message per field. Error codes are part of the contract.
- Long-running work returns `202` with a status resource in `Location` and `Retry-After`.

Payloads
- JSON in UTF-8; top-level responses are objects, never bare arrays.
- Timestamps are RFC 3339 in UTC; dates are `YYYY-MM-DD`; money is an integer in minor units with an ISO 4217 code; integers above 2^53 are strings.
- Return empty arrays, never null; booleans are never null. Enums are strings documented as extensible.
- Return a request ID header on every response; keep stack traces, queries and internal hostnames out of responses.

Lists, retries and caching
- Paginate every list with a documented default and maximum. Use opaque cursors (`page_token` / `next_page_token`) for large or changing collections. Sort only on indexed fields from an allowlist.
- Make `POST` retry-safe with an `Idempotency-Key` header: store the key, a request hash and the response for at least 24 hours; the same key with a different body is an error.
- Prevent lost updates: return an `ETag`, require `If-Match` on `PATCH`, `PUT` and `DELETE`, and answer `412` on a mismatch.
- Send `Cache-Control` on every `GET` (`private` or `no-store` for user-specific data) and support `If-None-Match` → `304`.
- Bulk endpoints have a maximum batch size and return a result per item. Rate-limit and cap request sizes.
- Credentials go in headers (OAuth 2.0, OpenID Connect or scoped API keys), never in URLs.

Webhooks
- Follow Standard Webhooks: each event has a unique ID, a timestamp and an HMAC-SHA256 signature over the ID, timestamp and raw body.
- Receivers verify the signature on the raw body, reject stale timestamps, deduplicate by event ID, answer `2xx` fast and process in the background.
- Senders retry with exponential backoff for a documented period and never promise ordering.

Sources: RFC 9110, RFC 9457, RFC 3339, RFC 7396, RFC 9745, RFC 8594, the OpenAPI Specification, Google AIP, Microsoft Azure REST API Guidelines, Zalando RESTful API Guidelines, OWASP API Security Top 10 (2023) and Standard Webhooks.
