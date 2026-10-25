---
title: Core
description: Mandatory rules for every project - work like a senior engineer, stay current, structure and name code, write it well, document decisions and define done.
sidebar:
  order: 1
---

Mandatory for every project. Work like a senior engineer who owns the outcome. Draws on the functional-core, imperative-shell pattern, the Twelve-Factor App's config rule, Michael Nygard's architecture decision records and Conventional Commits. Rules in the project's `AGENTS.md` override Devbook only where they say so explicitly; the user's direct request overrides both.

## Understand first
- Read the relevant code, docs and tests before changing anything. Match existing patterns unless they break these rules.
- Restate the goal and acceptance criteria. If they are missing or ambiguous, ask, and list the assumptions you would otherwise make.
- For work touching many files, data models, auth, payments, infrastructure or public URLs, propose a short plan (steps, files, risks, questions) and wait for approval, because these are expensive to undo.

## Stay current
- Check versions, APIs, config syntax, prices, limits and policies in the official docs or the installed version before using them, because they change faster than training data. If you can't check, say the answer is unverified.
- Use the latest stable release unless the project pins otherwise, and no deprecated APIs in new code.
- Never invent packages, APIs, file paths, commands, citations or results. If you can't verify something, say so.

## Design principles
- Build the simplest thing that meets the requirement: static before server-rendered before client-heavy, one service before many.
- Pure core, thin shell: business logic is pure functions with no framework, UI or I/O imports, so it can be tested without them. UI, HTTP and database code only adapts.
- One responsibility per module. Dependencies point inward: core code never imports UI or infrastructure.
- One source for each fact. Content, copy and config live in validated data, not hard-coded in components.
- Fail the build, not the user: invalid data, broken links and missing assets stop the build.
- Prefer the platform and mature, widely used tools. Every new dependency or service needs a written reason and approval.
- Settings that differ per environment come from env vars or config, so one build runs everywhere.
- Decide what happens on every failure: retry, fallback, user message or alert.

## Project structure
- Follow the framework's documented layout first, and the defaults below where it is silent.
- `src/` for application code, `tests/` or colocated tests, `docs/` (with `docs/adr/`), `scripts/` for dev and ops scripts, and `public/` or `static/` for files served as-is. Config files sit at the root.
- Inside `src/`, group by feature (`src/billing/`), not by type (`controllers/`, `models/`), so a change stays in one folder. Each feature keeps its UI, logic, data access and tests together.
- Move code to `src/lib/` (pure helpers) or `src/components/` (shared UI) only once two features need it.
- Name modules after what they do (`format-date.ts`, `slugify.py`) instead of catch-all `utils`, `helpers`, `common` or `misc`.
- Keep nesting to about 3–4 levels and one main export or concept per file.
- Change generated, build and vendored files through their source or tool, never by hand. Keep them in `.gitignore` unless the tool requires committing them.

## Naming
- Language and framework conventions come first. Defaults where they are silent:
  - Files and folders `kebab-case` (`user-profile.ts`); Python modules `snake_case`; component files match the component name where the framework expects it (`UserCard.tsx`).
  - Types, classes and components `PascalCase`; functions and variables `camelCase` (`snake_case` in Python, Ruby and Rust); true constants and env vars `SCREAMING_SNAKE_CASE`.
  - Database tables and columns `snake_case`; URLs and CSS classes `kebab-case`.
  - Tests mirror the file they test: `price.test.ts`, `test_price.py`.
- Name things in domain words (`invoiceTotal`), not `data`, `info`, `temp`, `obj` or `manager`.
- Functions are verbs (`sendInvoice`). Booleans read as questions (`isPaid`, `canEdit`). Collections are plural. Event handlers are `onX` or `handleX`.
- Put units in ambiguous names (`timeoutMs`, `priceInCents`, `sizeBytes`). Spell words out, except common abbreviations such as `id`, `url` and `api`.
- Branches are `type/short-description` (`feat/invoice-export`).

## Code
- Use the project's formatter, linter and the strictest practical type checking, with CI failing on warnings. Every type escape, lint ignore or unchecked cast carries a comment saying why.
- Validate all external input (requests, forms, env vars, files, API responses) with a schema at the boundary.
- Write small functions that do one thing, with early returns instead of deep nesting. Prefer return values to mutation.
- Comments explain why, not what. Cite the source of non-obvious constants.
- Handle every error, or add context and rethrow it. Users see what happened and what to do next; details go to logs.
- Log in a structured format at boundaries, without secrets, tokens or unneeded personal data.

## Make changes
- One small, reviewable change at a time, without unrelated refactors.
- When a test, lint rule or check fails, fix the cause and report the failure. Never weaken, skip or delete the check to make it pass.
- Finish what you start. If something must wait, say so in your report instead of leaving silent TODOs, stubs, placeholder data or commented-out code.
- A human approves changes to auth, payments, data deletion, migrations, secrets, infrastructure, security headers and production data.

## Documentation and decisions
- Update docs, config examples and the changelog in the same change as the behaviour. Delete docs that are no longer true.
- The README gets a new developer from clone to running app: purpose, requirements, setup, commands, env var names, deploy and layout.
- Record significant decisions (framework, data store, hosting, auth, major dependency, hard-to-reverse trade-offs) as short ADRs in `docs/adr/NNNN-title.md`: context, decision, alternatives, consequences. Supersede an accepted ADR with a new one instead of rewriting it.
- Document public APIs, config options and non-obvious behaviour next to the code.
- Keep project facts and conventions in `AGENTS.md`, short and current.

## Verify
- Run the project's format, lint, typecheck, tests and build, and show the real output. If a check can't run, say which one and why; never claim it passed.
- For UI work, check the result in a browser at about 360 px and 1440 px, in light and dark themes, and by keyboard.
- Re-read your diff as a reviewer: correctness, security, edge cases, naming and dead code.

## Git
- Use Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `chore:`), and explain why, not only what.
- Commit, push, deploy or rewrite history only when asked.
- Keep `main` deployable, with one concern per pull request.

## Done means
- Every acceptance criterion is met and all checks pass with zero warnings.
- New logic has tests. Errors are handled with plain-words messages.
- Code, tests, logs and fixtures hold no secrets or personal data.
- The report lists what changed, what was verified, what was not done and every assumption. Partial work is reported as partial.
