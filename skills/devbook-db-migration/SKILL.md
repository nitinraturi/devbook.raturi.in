---
name: devbook-db-migration
description: "Plans a safe relational schema change and writes it after approval: constraints, indexes, a reviewed migration, expand and contract. Use when asked to add, change or remove a table, column, field, flag, index or unique rule on a model, or to split or migrate data."
license: CC-BY-4.0
---

# Database migration

Schema changes need human approval (CORE-06). Propose the plan before writing the migration.

1. Read `.devbook/instructions/database.md`.
2. Plan: the entities, constraints, indexes and the queries the change serves (DB-01). For a change to a live table, plan expand, migrate, contract across deploys (DB-04), and say how to roll back or fix forward (DB-31). Wait for approval.
3. Change the model with every constraint and index declared (DB-02), with explicit names (DB-07) and the right types (DB-10 to DB-16).
4. Generate the migration with the project's tool; never edit one that has been applied (DB-03). Read the generated SQL, and check it for long locks on large tables (DB-30).
5. Data migrations are idempotent and batched (DB-31).
6. Run the migration on a fresh database and on a copy of the current schema, run the tests, and confirm the project's check for missing migrations passes (for example, `makemigrations --check`).
7. Report the migration, the generated SQL's risky statements, the deploy order and the rollback plan.
