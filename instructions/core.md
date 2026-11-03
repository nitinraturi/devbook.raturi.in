---
title: Core
description: Mandatory rules for every project - verify before reporting, never weaken a check, get approval for risky changes and keep designs simple.
sidebar:
  order: 1
sources:
  - Functional core, imperative shell (Gary Bernhardt)
  - Documenting Architecture Decisions (Michael Nygard)
  - Conventional Commits 1.0
lastVerified: 2026-11-02
---

The project's `AGENTS.md` overrides Devbook only where it says so; the user's direct request overrides both. Cite rule IDs, such as `CORE-02`, in reports.

## First
- CORE-01: Before reporting, run the project's format, lint, typecheck, tests and build, and show the real output, with zero warnings. If a check can't run, say which and why; never claim it passed.
- CORE-02: When a test, lint rule or check fails, fix the cause and report the failure. Never weaken, skip or delete the check to make it pass.
- CORE-03: Report what changed, what you verified, what you did not do and every assumption. Report partial work as partial; no silent TODOs, stubs or placeholder data.
- CORE-04: Never invent packages, APIs, file paths, commands, IDs, citations or results. When something is missing or unverifiable, say so and ask.
- CORE-05: Commit, push, deploy or rewrite history only when asked.
- CORE-06: Get human approval before changing auth, payments, data deletion, migrations, secrets, infrastructure, security headers or production data.

## Plan and stay current
- CORE-07: For work touching many files, data models, auth, payments, infrastructure or public URLs, propose a short plan (steps, files, risks, questions) and wait for approval, because these are expensive to undo.
- CORE-08: Check versions, APIs, config syntax, prices, limits and policies in the official docs or the installed version, because they change faster than training data; say when you couldn't. Use the latest stable release unless pinned, and no deprecated APIs.

## Design
- CORE-09: Build the simplest thing that meets the requirement: static before server-rendered before client-heavy, one service before many.
- CORE-10: Keep business logic in pure functions with no framework, UI or I/O imports, so it tests alone. UI, HTTP and database code only adapts.
- CORE-11: Keep each fact in one place: content, copy and config live in validated data, not hard-coded in components.
- CORE-12: Fail the build, not the user: invalid data, broken links and missing assets stop the build.
- CORE-13: Prefer the platform and mature, widely used tools. Add a dependency or service only with a written reason and approval.

## Structure and names
- CORE-14: Group code by feature (`src/billing/`), not type (`controllers/`). Move code to a shared `src/lib/` only once two features need it.
- CORE-15: Name modules after what they do (`format-date.ts`), never `utils`, `helpers`, `common` or `misc`.
- CORE-16: Put units in ambiguous names: `timeoutMs`, `priceInCents`, `sizeBytes`.

## Changes, docs and git
- CORE-17: Make one small, reviewable change at a time, without unrelated refactors.
- CORE-18: Update docs, config examples and the changelog in the same change as the behaviour; delete docs that are no longer true. Keep project facts in `AGENTS.md`, short and current.
- CORE-19: Record significant decisions (framework, data store, hosting, auth, major dependency) as short ADRs in `docs/adr/NNNN-title.md` (context, decision, alternatives, consequences); supersede them rather than rewrite.
- CORE-20: Let the formatter, linter and strictest practical type checking enforce style, failing on warnings. Every type escape or lint ignore has a comment saying why.
- CORE-21: Write Conventional Commits (`feat:`, `fix:`) that say why. Name branches `type/short-description`.
