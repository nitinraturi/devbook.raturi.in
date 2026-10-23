---
title: Core
description: Mandatory rules for every project - work like a senior engineer, stay current, structure and name code, write it well, document decisions and define done.
sidebar:
  order: 1
---

Mandatory for every project. Work like a senior engineer who owns the outcome. Rules in the project's `AGENTS.md` override Devbook only where they say so explicitly.

## Understand first
- Read the relevant code, docs and tests before changing anything. Match existing patterns unless they break these rules.
- Restate the goal and acceptance criteria. If they are missing or ambiguous, ask. List the assumptions you would otherwise make.
- For work touching many files, data models, auth, payments, infrastructure or public URLs: propose a short plan (steps, files, risks, questions) and wait for approval.

## Stay current
- Never rely on memory for versions, APIs, config syntax, prices, limits or policies. Check the official docs or the installed version first.
- Use the latest stable release unless the project pins otherwise. Never use deprecated APIs in new code.
- Never invent packages, APIs, file paths, commands, citations or results. If you cannot verify something, say so.

## Design principles
- Build the simplest thing that meets the requirement (KISS, YAGNI). Static before server-rendered before client-heavy; one service before many.
- Pure core, thin shell: business logic is pure, testable functions with no framework, UI or I/O imports. UI, HTTP and database code only adapts.
- One responsibility per module. Dependencies point inward: core code never imports UI or infrastructure.
- Derive, don't duplicate: one source for each fact. Content, copy and config live in validated data, not hard-coded in components.
- Explicit over clever: plain names, visible side effects, no hidden global state.
- Consistency beats preference: match the codebase's existing style and structure.
- Fail the build, not the user: invalid data, broken links and missing assets stop the build.
- Prefer the platform and mature, widely used tools. Every new dependency or service needs a written reason and approval.
- Settings that differ per environment come from env vars or config, never code edits.
- Decide what happens on every failure: retry, fallback, user message or alert.

## Project structure
- Follow the framework's documented layout first (for example Astro `src/pages`, Django apps, Next.js `app/`). Never fight its conventions.
- Otherwise use: `src/` for application code, `tests/` or colocated tests, `docs/` (with `docs/adr/`), `scripts/` for dev and ops scripts, `public/` or `static/` for files served as-is. Config files at the root.
- Inside `src/`, group by feature or domain (`src/billing/`, `src/accounts/`), not by type (`controllers/`, `models/` across the whole app). Each feature keeps its UI, logic, data access and tests together.
- Shared code lives in `src/lib/` (pure helpers) or `src/components/` (shared UI), and only once two features need it.
- Pure domain logic sits apart from adapters (UI, HTTP, database, third-party clients) so it can be tested without them.
- No catch-all `utils`, `helpers`, `common` or `misc` modules. Name modules after what they do (`format-date.ts`, `slugify.py`).
- Keep nesting shallow (about 3–4 levels). One main export or concept per file. Generated, build and vendored files are never edited by hand and are in `.gitignore` unless the tool requires committing them.

## Naming
- Use the language and framework conventions first. Defaults where they are silent:
  - Files and folders: `kebab-case` (`user-profile.ts`). Python modules `snake_case`. Component files match the component in frameworks that expect it (`UserCard.tsx`, `UserCard.astro`).
  - Code: types, classes and components `PascalCase`; functions and variables `camelCase` (Python, Ruby and Rust `snake_case`); true constants and env vars `SCREAMING_SNAKE_CASE`.
  - Database tables and columns `snake_case`; URLs and CSS classes `kebab-case`. Pick one JSON field style per API and never mix.
  - Tests mirror the file they test: `price.test.ts`, `test_price.py`.
- Names say what something is or does in domain words: `invoiceTotal`, not `data`, `info`, `temp`, `obj` or `manager`.
- Functions are verbs (`sendInvoice`). Booleans read as questions (`isPaid`, `hasAccess`, `canEdit`). Collections are plural. Event handlers are `onX` or `handleX`.
- Put units in ambiguous names (`timeoutMs`, `priceInCents`, `sizeBytes`). No unexplained abbreviations; common ones (`id`, `url`, `api`) are fine.
- Branches are `type/short-description` (`feat/invoice-export`).

## Code
- Use the project's formatter, linter and the strictest practical type checking. CI fails on warnings. No `any`, ignores or unchecked casts without a comment saying why.
- Validate all external input (requests, forms, env vars, files, API responses) with a schema at the boundary.
- Small functions that do one thing, with early returns over deep nesting. Prefer return values over mutation.
- Comments explain why, not what. Cite the source of non-obvious constants.
- Never swallow errors: handle them, or add context and rethrow. Users see what happened and what to do next; details go to logs.
- Structured logs at boundaries. Never log secrets, tokens or unneeded personal data.

## Make changes
- One small, reviewable change at a time. Keep unrelated refactors out.
- Never weaken, skip or delete a test, lint rule or check to make it pass. A failing check is a finding.
- Never leave silent TODOs, stubs, placeholder data or commented-out code.
- A human approves changes to auth, payments, data deletion, migrations, secrets, infrastructure, security headers and production data.

## Documentation and decisions
- Update docs, config examples and the changelog in the same change as the behaviour. Delete docs that are no longer true.
- The README gets a new developer from clone to running app: purpose, requirements, setup, commands, env var names, deploy and layout.
- Record significant decisions (framework, data store, hosting, auth, major dependency, hard-to-reverse trade-offs) as short ADRs in `docs/adr/NNNN-title.md`: context, decision, alternatives, consequences. Supersede ADRs; never rewrite accepted ones.
- Document public APIs, config options and non-obvious behaviour next to the code.
- Keep project facts and conventions in `AGENTS.md`, short and current.

## Verify
- Run the project's format, lint, typecheck, tests and build. Show the real output; never claim an unrun check passed.
- For UI work, check the result in a browser at about 360 px and 1440 px, in light and dark themes, by keyboard.
- Re-read your diff as a reviewer: correctness, security, edge cases, naming, dead code.

## Git
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `chore:`). Explain why, not only what.
- Never commit, push, deploy or rewrite history unless asked.
- `main` stays deployable. One concern per pull request.

## Done means
- Every acceptance criterion is met and all checks pass with zero warnings.
- New logic has tests. Errors are handled with plain-words messages.
- No secrets or personal data in code, tests, logs or fixtures.
- The report lists what changed, what was verified, what was not done and every assumption. Never call partial work done.
