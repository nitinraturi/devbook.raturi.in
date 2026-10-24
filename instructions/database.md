---
title: Databases
description: Design tables and models that stay correct - modelling, naming, keys, types, constraints, relationships, indexes, concurrency, privacy, migrations and backups.
sidebar:
  order: 6
---

Based on the PostgreSQL documentation and its wiki page "Don't Do This", Markus Winand's *Use The Index, Luke*, Bill Karwin's *SQL Antipatterns*, Martin Kleppmann's *Designing Data-Intensive Applications*, RFC 9562 (UUIDs) and the OWASP Cheat Sheet Series. The rules apply to relational databases, through SQL or an ORM. Check your engine's docs for exact types and syntax.

## Model first
- Before creating tables, list the entities, relationships and cardinality, the invariants, and the main queries with expected row counts. Put them in the plan for approval.
- The database guards integrity; application code is the second line. Every invariant that can be a constraint is one.
- Normalise to third normal form, so each fact is stored once. Denormalise only for a measured read problem, and state how the copy stays in sync.
- One column per attribute. Put repeating values in a child table instead of comma-separated lists, numbered columns (`phone1`, `phone2`) or entity-attribute-value tables.
- ORM models declare every constraint and index, so the generated migration contains them. Read the generated SQL before committing.

## Naming
- Lowercase `snake_case`, unquoted. Choose plural or singular table names once.
- Primary key `id`; foreign keys `<singular>_id` (`customer_id`); join tables name both sides (`project_members`).
- Booleans `is_`/`has_`, instants `<event>_at` (`paid_at`), units in the name (`size_bytes`, `price_minor`).
- Avoid reserved words (`user`, `order`, `group`). Name constraints and indexes explicitly so errors and migrations read clearly.

## Keys
- Every table has a primary key. Use a database-generated 64-bit identity, or a UUID when IDs are created outside the database or exposed. Prefer time-ordered UUIDv7 (RFC 9562) to random UUIDv4 for index locality.
- Key rows by a surrogate ID, not a value that can change (email, username, phone), because changing a key cascades through every reference. Give it its own unique constraint, case-insensitive where users expect it.
- Where enumeration matters, add an opaque public ID instead of exposing the sequential one.

## Types
- Use the narrowest correct type: integer, boolean, `date` for calendar dates, a time-zone-aware timestamp for instants. Store numbers and dates in their own types, not as text, so the database can compare and validate them.
- Store instants in UTC. For future local events, store the local date-time plus the IANA time-zone name, because offset rules change.
- Money is an exact decimal or an integer in minor units, with an ISO 4217 currency column, because floats round.
- Use full 4-byte UTF-8. Limit text length to the business rule, not an arbitrary `varchar(255)`.
- Fixed value sets (status, role) use a check constraint or a lookup table. Use native enum types only for sets that never change.
- JSON columns only for genuinely variable or external payloads. Anything you filter, join or constrain on is a real column.
- Files go in object storage; the row keeps the key, size, type and checksum.

## Constraints
- Columns are `NOT NULL` unless "unknown" is a real state, and then the meaning of null is documented.
- Check constraints for ranges and cross-column rules (`quantity > 0`, `ends_at > starts_at`).
- Every "only one" rule is a unique constraint, often partial: one active subscription per user. Engines treat nulls in unique constraints differently; check yours.
- Defaults such as `created_at` live in the database, so every writer gets them.

## Relationships
- Every reference is a foreign key. Choose `ON DELETE` deliberately: restrict by default, cascade only to children the parent owns, set null only for optional links.
- Index foreign key columns. Not every engine does it for you, and joins and parent deletes need it.
- Many-to-many uses a join table, unique on both foreign keys, with its own columns when the link carries data.
- Instead of polymorphic references (`target_type` + `target_id`), which the database can't enforce, use one nullable foreign key per target with a check that exactly one is set.

## Indexes
- Index for the real queries in the plan: filter, join and sort columns. Confirm with `EXPLAIN` on realistic volumes.
- In composite indexes, equality columns come first and range or sort columns last.
- Use partial indexes for common subsets (live rows) and expression indexes for transformed lookups (`lower(email)`).
- Every index slows writes. Drop unused and duplicate ones.

## History and deletion
- Tables carry `created_at` and `updated_at`, maintained in one place, never by hand per query.
- Soft delete only when restore or audit needs it. Filter it everywhere, and make unique constraints partial on live rows.
- Where history matters (prices, permissions, legal records), append to a history or event table instead of overwriting.

## Concurrency
- Wrap multi-step writes in one short transaction, with no network calls inside.
- Prevent lost updates with a `version` column or row locks. Prefer atomic updates (`SET stock = stock - 1 WHERE stock > 0`) to read-modify-write.
- Make inserts idempotent with unique keys and upserts, so retries don't create duplicates.

## Tenancy and privacy
- Tenant-owned tables have `tenant_id NOT NULL`, leading their composite indexes and unique constraints, and every query filters on it. Add row-level security where supported.
- Keep personal data in clearly named columns or tables, so it can be found, exported and deleted on request.
- Store password hashes, never passwords, and keep secrets out of tables. Encrypt highly sensitive fields in the application where law or risk requires it; encrypted fields can't be searched normally.
- The application's database user has only the rights it needs. Migrations run as a separate role.

## Migrations
- Every schema change is a committed, reviewed migration. Never edit an applied one.
- Stay compatible with the running code: expand, migrate the data, then contract in a later deploy.
- Avoid long locks on large tables: set a lock timeout, build indexes concurrently, and add constraints unvalidated, then validate them, where your engine supports it.
- Data migrations are idempotent and run in batches. Plan a rollback or forward fix before a risky one.

## Backups and retention
- Production databases have automated backups with point-in-time recovery. Test a restore at least every quarter, because an untested backup may not restore.
- Delete or anonymise personal data with a scheduled job when its retention period ends.
- Anonymise production personal data before it reaches development or test.
