---
title: Data and databases
description: Schema design, reversible reviewed migrations, indexing, deletes, backups with restore drills, personal-data tagging and safe production data access.
sidebar:
  order: 5
---

## Rules

### Schema
- The data model **MUST** be in the technical spec before tables are created.
- Use constraints (not-null, unique, foreign keys, checks) in the database, not only in application code.
- Primary keys **SHOULD** be opaque (UUID or similar) for anything exposed in URLs or APIs.
- Every table has `created_at` and `updated_at` in UTC.
- Columns holding personal data **MUST** be marked (comment, naming convention or data catalogue) so retention and deletion can find them.

### Migrations
- Schema changes happen **only** through versioned migrations committed to the repo.
- Migrations **MUST** be reviewed by a human before running on production.
- Prefer backwards-compatible steps: add column → backfill → switch code → remove old column in a later release.
- Destructive migrations (drop, truncate, type narrowing) **MUST** have a tested backup and a written rollback plan.
- Long-running migrations on large tables are planned to avoid locking (batched backfills, concurrent index creation where supported).

### Queries and performance
- Index columns used in filters, joins and sorting; check query plans for slow paths.
- No N+1 queries: fetch related data in bulk.
- Paginate all list queries.

### Deletes and retention
- Decide per table: hard delete, soft delete (`deleted_at`) or archive. Write it in the spec.
- Soft-deleted personal data still counts as stored; retention rules apply.
- Retention periods for personal data are defined and enforced by a scheduled job.

### Backups
- Automated backups with point-in-time recovery where the platform supports it.
- A **restore drill** at least every quarter for production data; record the time it took.
- Backups are encrypted and access-controlled like production.

### Production access
- No routine direct writes to production databases. Changes go through migrations or audited admin tools.
- AI agents **MUST NOT** be given write credentials to production data.
- Use anonymised or synthetic data for development and tests. Never copy real personal data into dev environments.

## Checklist
- [ ] Model in spec; constraints in DB
- [ ] Migration reviewed, reversible or backed up
- [ ] Indexes for new query paths
- [ ] Personal data columns tagged; retention defined
- [ ] Restore drill date recorded
