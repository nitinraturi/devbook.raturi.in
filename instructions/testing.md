---
title: Testing
description: Mandatory testing rules for any stack - what to test, test levels, deterministic tests, test data, CI gates and how to handle failing or flaky tests.
sidebar:
  order: 3
---

Mandatory for every project. Draws on Ham Vocke's *The Practical Test Pyramid* (martinfowler.com) and *Software Engineering at Google* (Winters, Manshreck and Wright).

## What to test
- Map each acceptance criterion to at least one test. Test behaviour through public interfaces, not implementation details, so refactors don't break tests.
- Start a bug fix with a test that fails without the fix.
- Cover edge cases: empty, boundary and maximum values, invalid input, duplicates, concurrency, time zones and unauthorised access.
- Test the failure paths you designed: timeouts, retries, fallbacks and error messages.

## Levels
- Unit tests for pure logic: fast, numerous, no I/O.
- Integration tests for boundaries (database, HTTP handlers, queues) with real dependencies, such as local services or test containers, where practical.
- A few stable, independent end-to-end tests for the key user journeys, against the built app.
- Schema or contract tests for APIs that others consume.
- Automated accessibility checks (axe or equivalent) on every page template, with zero serious or critical issues.

## Writing tests
- One behaviour per test. The name states the behaviour and the expected result. Use arrange, act, assert.
- Make tests deterministic by controlling time, randomness, network and ordering. Wait for conditions instead of fixed sleeps, which are both slow and flaky.
- Mock only boundaries you don't own or that are slow or non-deterministic. Test the real unit, and assert on its results rather than on the mock.
- Use synthetic data from factories or fixtures, never production personal data.
- Tests run in any order and in parallel, and clean up what they create.
- Prefer specific assertions to large snapshots, and review snapshot changes like code.

## CI
- Every pull request runs format, lint, typecheck, unit, integration, build and end-to-end tests, and a failure blocks the merge.
- Fix a flaky test at once, or quarantine it with a tracked issue. Re-running until green hides real bugs.
- Treat coverage as a signal, not a target: cover critical logic thoroughly, and skip tests that only raise the number.
