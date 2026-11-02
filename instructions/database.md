---
title: Databases
description: Design tables and models that stay correct - modelling, naming, keys, types, constraints, relationships, indexes, concurrency, privacy, migrations and backups.
sidebar:
  order: 6
sources:
  - PostgreSQL documentation and the PostgreSQL wiki page "Don't Do This"
  - Use The Index, Luke (Markus Winand)
  - SQL Antipatterns (Bill Karwin)
  - Designing Data-Intensive Applications (Martin Kleppmann)
  - RFC 9562 (UUIDs)
lastVerified: 2026-11-02
# Path scoping: Claude Code reads paths, Copilot reads applyTo. Keep both lists the same.
paths:
  - "**/migrations/**"
  - "**/models.py"
  - "**/models/**"
  - "**/*.sql"
  - "**/schema.prisma"
  - "**/prisma/**"
  - "**/drizzle/**"
  - "**/db/**"
  - "**/*.entity.ts"
applyTo: "**/migrations/**,**/models.py,**/models/**,**/*.sql,**/schema.prisma,**/prisma/**,**/drizzle/**,**/db/**,**/*.entity.ts"
---

Load for any relational database, through SQL or an ORM. Check your engine's docs for exact types and syntax. Password hashing, secrets and retention are in the security instructions.

## First
- DB-01: Before creating tables, list the entities, relationships and cardinality, the invariants, and the main queries with expected row counts, and put them in the plan for approval.
- DB-02: The database guards integrity and application code is the second line: every invariant that can be a constraint is one. ORM models declare every constraint and index, so the generated migration contains them; read the generated SQL before committing.
- DB-03: Every schema change is a committed, reviewed migration. Never edit an applied one.
- DB-04: Stay compatible with the running code: expand, migrate the data, then contract in a later deploy.
- DB-05: Every reference is a foreign key, with `ON DELETE` chosen deliberately: restrict by default, cascade only to children the parent owns, set null only for optional links. Index foreign key columns, because not every engine does it for you.

## Naming and keys
- DB-06: Booleans start with `is_` or `has_`, instants end in `_at` (`paid_at`), and units are in the name (`size_bytes`, `price_minor`).
- DB-07: Avoid reserved words (`user`, `order`, `group`). Name constraints and indexes explicitly, so errors and migrations read clearly.
- DB-08: Every table has a primary key: a database-generated 64-bit identity, or a UUID when IDs are created outside the database or exposed. Prefer time-ordered UUIDv7 to random UUIDv4 for index locality.
- DB-09: Key rows by a surrogate ID, not a value that can change (email, username, phone), because a changing key cascades through every reference. Give the natural value its own unique constraint, case-insensitive where users expect it.

## Types and constraints
- DB-10: Store instants in UTC, in a time-zone-aware type. For future local events, store the local date-time plus the IANA time-zone name, because offset rules change.
- DB-11: Money is an exact decimal or an integer in minor units, with an ISO 4217 currency column, because floats round.
- DB-12: Use full 4-byte UTF-8. Limit text length to the business rule, not an arbitrary `varchar(255)`.
- DB-13: Fixed value sets (status, role) use a check constraint or a lookup table; native enum types only for sets that never change.
- DB-14: JSON columns only for genuinely variable or external payloads. Anything you filter, join or constrain on is a real column.
- DB-15: Files go in object storage; the row keeps the key, size, type and checksum.
- DB-16: Columns are `NOT NULL` unless "unknown" is a real state, and then the meaning of null is documented.
- DB-17: Every "only one" rule is a unique constraint, often partial: one active subscription per user. Engines treat nulls in unique constraints differently; check yours.
- DB-18: Defaults such as `created_at` and `updated_at` live in the database or one shared place, so every writer gets them.
- DB-19: Instead of polymorphic references (`target_type` + `target_id`), which the database can't enforce, use one nullable foreign key per target with a check that exactly one is set.

## Indexes
- DB-20: Index for the real queries in the plan: filter, join and sort columns. Confirm with `EXPLAIN` on realistic volumes.
- DB-21: In composite indexes, equality columns come first and range or sort columns last.
- DB-22: Use partial indexes for common subsets (live rows) and expression indexes for transformed lookups (`lower(email)`).

## History and concurrency
- DB-23: Soft delete only when restore or audit needs it. Filter it everywhere, and make unique constraints partial on live rows.
- DB-24: Where history matters (prices, permissions, legal records), append to a history or event table instead of overwriting.
- DB-25: Wrap multi-step writes in one short transaction, with no network calls inside.
- DB-26: Prevent lost updates with a `version` column or row locks. Prefer atomic updates (`SET stock = stock - 1 WHERE stock > 0`) to read-modify-write.
- DB-27: Make inserts idempotent with unique keys and upserts, so retries don't create duplicates.

## Tenancy and access
- DB-28: Tenant-owned tables have `tenant_id NOT NULL`, leading their composite indexes and unique constraints, and every query filters on it. Add row-level security where supported.
- DB-29: The application's database user has only the rights it needs. Migrations run as a separate role.

## Operations
- DB-30: Avoid long locks on large tables: set a lock timeout, build indexes concurrently, and add constraints unvalidated, then validate them, where your engine supports it.
- DB-31: Data migrations are idempotent and run in batches. Plan a rollback or forward fix before a risky one.
- DB-32: Production databases have automated backups with point-in-time recovery. Test a restore at least every quarter, because an untested backup may not restore.
- DB-33: Anonymise production personal data before it reaches development or test.
