---
name: db-migration
description: "Plans a safe relational schema change and writes it after approval: constraints, indexes, explicit names, a reviewed migration, and expand-migrate-contract for live tables. Use when asked to add, change or remove a table, column, field, flag, index or unique rule, or to split or backfill data."
license: CC-BY-4.0
---

# Database migration

Schema changes need the user's approval: propose the plan before you write the migration. Check the engine's own docs for exact types and syntax.

## Procedure

1. Read the current models and migrations, and the queries the change must serve.
2. Plan: entities, relationships and cardinality, invariants, the queries with expected row counts, and the indexes they need. For a live table, plan expand → migrate data → contract across separate deploys, so the running code keeps working, and say how to roll back or fix forward. Wait for approval.
3. Change the model with every constraint and index declared, so the generated migration contains them.
4. Generate the migration with the project's tool. Never edit a migration that has been applied. Read the generated SQL and flag statements that take long locks on large tables.
5. Run the migration on a fresh database and on a copy of the current schema, run the tests, and run the project's check for missing migrations (for example `makemigrations --check`).
6. Report the migration, its risky statements, the deploy order and the rollback plan.

## Rules

Integrity
- The database guards integrity and application code is the second line: every invariant that can be a constraint is one.
- Every reference is a foreign key with a deliberate `ON DELETE`: restrict by default, cascade only to children the parent owns, set null only for optional links. Index foreign-key columns.
- Every "only one" rule is a unique constraint, often partial (one active subscription per user). Engines treat nulls in unique constraints differently; check yours.
- Columns are `NOT NULL` unless "unknown" is a real state, and then document what null means.
- Instead of polymorphic references (`target_type` + `target_id`), use one nullable foreign key per target with a check that exactly one is set.

Keys, names and types
- Every table has a primary key: a database-generated 64-bit identity, or a UUID (prefer time-ordered UUIDv7) when IDs are made outside the database or exposed. Key rows by a surrogate ID, never by email, username or phone; give natural values their own unique constraint, case-insensitive where users expect it.
- Booleans start with `is_` or `has_`, instants end in `_at`, units are in the name (`size_bytes`, `price_minor`). Avoid reserved words (`user`, `order`, `group`). Name constraints and indexes explicitly.
- Instants are UTC in a time-zone-aware type; future local events store local date-time plus the IANA zone name. Money is exact decimal or integer minor units with an ISO 4217 currency column.
- Text limits follow the business rule, not `varchar(255)`. Fixed value sets use a check constraint or lookup table. JSON columns only for genuinely variable payloads; anything filtered, joined or constrained is a real column. Files go in object storage; the row keeps key, size, type and checksum.

Indexes and concurrency
- Index the planned filter, join and sort columns, equality columns first and range or sort columns last; use partial and expression indexes where they fit, and confirm with `EXPLAIN` on realistic volumes.
- Wrap multi-step writes in one short transaction with no network calls inside. Prevent lost updates with a version column, row locks or atomic updates (`SET stock = stock - 1 WHERE stock > 0`). Make inserts idempotent with unique keys and upserts.
- Soft delete only when restore or audit needs it, filtered everywhere, with unique constraints partial on live rows. Where history matters, append to a history table instead of overwriting.
- Tenant-owned tables have `tenant_id NOT NULL` leading their composite indexes and unique constraints; every query filters on it.

Operations
- Avoid long locks: set a lock timeout, build indexes concurrently, and add constraints unvalidated, then validate them, where the engine supports it.
- Data migrations are idempotent and batched.
- Migrations run as a separate database role from the application's least-privilege user.
