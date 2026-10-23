---
title: Engineering
description: Design principles, coding standards, testing, performance and reliability rules for code an assistant writes in any stack.
sidebar:
  order: 2
---

## Design principles
- Build the simplest thing that meets the requirement (KISS, YAGNI). Static before server-rendered before client-heavy; one service before many.
- Keep content, copy, facts and config in validated data files or a database, not hard-coded in components.
- Derive, don't duplicate. Never keep the same fact in two places.
- Pure core, thin shell: business logic is pure, testable functions with no framework, DOM or I/O imports. UI, HTTP and database code only adapts.
- One responsibility per module. Dependencies point inward: core code never imports UI or infrastructure.
- Explicit over clever: plain names, visible side effects, no hidden global state.
- Fail the build, not the user: invalid data, broken links and missing assets stop the build.
- Prefer mature, widely used tools. Every new tool or service needs a written reason.
- Environment-specific settings come from env vars or config, never code edits.
- Decide the behaviour of every failure: retry, fallback, user message or alert.

## Code
- Use the project's formatter and linter; CI fails on warnings.
- Use the strictest practical type checking. No `any`, ignores or unchecked casts without a comment saying why.
- Validate all external input (requests, forms, env vars, files, API responses) with a schema at the boundary.
- Names: functions are verbs, booleans read as questions, collections are plural. Put units in ambiguous names (`timeoutMs`, `priceInCents`).
- Small functions that do one thing. Prefer return values over mutation.
- Comments explain why. Cite the source of non-obvious constants.
- Never swallow errors: handle them, or add context and rethrow. Users see what happened and what to do next; details go to logs.
- Structured logs at boundaries. Never log secrets, tokens or unneeded personal data.
- Store UTC timestamps, money as integers in the smallest unit or decimals (never floats), and UTF-8 text.
- Organise by feature first. Create shared folders only when two features need the code.

## Testing
- Each acceptance criterion maps to a test. Test behaviour through public interfaces.
- A bug fix adds a test that fails without the fix.
- Cover edge cases: empty, maximum, invalid, duplicate, concurrent, unauthorised.
- Tests are deterministic (control time, randomness and network) and use synthetic data.
- Never write tautological tests or mock the unit under test.
- Add end-to-end tests for key user journeys against the built app, and automated accessibility checks on every page template.

## Performance
- Measure before optimising; set budgets early and enforce them in CI.
- Avoid N+1 queries; index what you filter and sort on; paginate every list.
- Ship the least code to the client. Lazy-load what is not needed for first render.
- Cache with a defined key, lifetime and invalidation. Content-hashed assets cache long; HTML revalidates.

## Reliability
- Every network call has a timeout. Retry only safe operations, with backoff, jitter and a limit.
- Run slow or flaky work (email, uploads, webhooks, LLM calls) in idempotent background jobs.
- Keep servers stateless. Rate-limit public and expensive endpoints; cap request and upload sizes.
- Track errors with release versions, and set up uptime checks before launch. Alert on what users feel.
- Production deploys come from CI on `main`, can be rolled back in minutes, and run migrations as an explicit step.
