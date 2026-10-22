---
title: API design
description: Rules for HTTP APIs - resource naming, methods, status codes, a standard error format (RFC 9457), pagination, idempotency, versioning and OpenAPI as the contract.
sidebar:
  order: 4
---

## Rules

### Contract
- The API contract **MUST** be written down before implementation, as an OpenAPI document (REST) or schema (GraphQL), and kept in the repo.
- Generated clients and server validation **SHOULD** come from that contract so they cannot drift.

### Resources and methods
- Nouns for resources, plural, lowercase, hyphenated: `/v1/orders/{orderId}/line-items`.
- `GET` reads (safe, cacheable), `POST` creates or runs an action, `PUT` replaces, `PATCH` partially updates, `DELETE` removes.
- `GET` **MUST NOT** change state.

### Status codes
- `200` OK, `201` Created (with `Location`), `204` No Content, `400` invalid input, `401` not authenticated, `403` not allowed, `404` not found, `409` conflict, `422` valid syntax but failed rules, `429` rate limited (with `Retry-After`), `5xx` server faults only.

### Errors
- Error responses **MUST** use one format across the API. Use Problem Details (RFC 9457, `application/problem+json`): `type`, `title`, `status`, `detail`, `instance`, plus field-level `errors` where useful.
- Errors **MUST NOT** leak stack traces, SQL, internal hostnames or whether a user account exists.

### Lists
- Paginate every list endpoint. Prefer cursor pagination for large or changing data; return `next` cursors.
- Set a default and a maximum page size.
- Filtering and sorting through documented query parameters only.

### Safety
- `POST` endpoints that create payments, orders or messages **MUST** accept an `Idempotency-Key` header and return the original result on retry.
- Validate every input against the schema; reject unknown fields on writes.
- Authenticate every non-public endpoint; authorise every object access (check the caller owns or may see that record).
- Rate-limit by user and by IP.

### Versioning and change
- Version in the path (`/v1/`) or a header; pick one per API.
- Adding optional fields is non-breaking. Removing, renaming or changing meaning is breaking and needs a new version and a deprecation period.
- Timestamps in ISO 8601 UTC; IDs as opaque strings.

## Checklist
- [ ] Contract written and committed
- [ ] Consistent error format
- [ ] Pagination with limits
- [ ] Idempotency on state-changing money/message endpoints
- [ ] Authn + per-object authz on every endpoint
- [ ] Rate limits
