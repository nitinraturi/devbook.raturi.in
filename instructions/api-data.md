---
title: APIs and data
description: API contracts, errors, pagination, idempotency, webhooks, data modelling, migrations, backups and retention for any project with a backend or database.
sidebar:
  order: 5
---

## API design
- Contract first: keep an OpenAPI (or GraphQL) schema in the repo and generate types or validate against it.
- Plural nouns, lowercase hyphenated paths, standard methods and status codes (200, 201, 204, 400, 401, 403, 404, 409, 422, 429).
- One error format everywhere (for example RFC 9457 problem details): a stable error code, a human message and field errors. Never leak stack traces, queries or internals.
- Validate bodies, path params and query strings against the schema. Reject unknown fields on writes.
- Paginate every list with a maximum page size; use cursors for large or changing sets. Filter and sort only on indexed fields.
- Make retries safe: `PUT` and `DELETE` are idempotent, and creates or payments accept an idempotency key.
- Additive changes need no new version. Breaking changes get a new version and a deprecation period for consumers.
- Authenticate every non-public endpoint and authorise per object. Rate-limit and return 429 with `Retry-After`.
- Webhooks: verify signatures, tolerate duplicates and out-of-order delivery, respond fast and process in the background.
- Timestamps are ISO 8601 in UTC. Money is an integer in minor units plus a currency code. Public IDs are opaque (UUID or ULID) where enumeration matters.

## Data modelling
- Enforce invariants in the database, not only in code: `NOT NULL`, unique, foreign key and check constraints.
- Store UTC timestamps and UTF-8 text. Money is never a float.
- Wrap multi-step writes in a transaction. Handle concurrent updates with optimistic locking or row locks.
- Use soft delete only when restore or audit needs it, and filter it everywhere.
- Never store passwords or secrets in plain text. Encrypt sensitive fields where the law or risk requires it.

## Migrations
- Every schema change is a committed, reviewed migration. Never edit an applied one.
- Keep migrations compatible with the running code: expand, migrate the data, then contract in a later deploy. Avoid long locks on large tables.
- Data migrations are idempotent and run in batches. Plan a rollback or forward fix before running a risky one.

## Backups and retention
- Production databases have automated backups with point-in-time recovery. Test a restore at least every quarter.
- Define a retention period for each kind of personal data, and delete or anonymise it when that period ends.
- Never copy production personal data into development or test environments without anonymising it.
