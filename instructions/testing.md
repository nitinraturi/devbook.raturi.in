---
title: Testing
description: Mandatory testing rules for any stack - what to test, test levels, deterministic tests, test data, CI gates and how to handle failing or flaky tests.
sidebar:
  order: 3
---

Mandatory for every project.

## What to test
- Each acceptance criterion maps to at least one test. Test behaviour through public interfaces, not implementation details.
- A bug fix starts with a test that fails without the fix.
- Cover edge cases: empty, boundary and maximum values, invalid input, duplicates, concurrency, time zones and unauthorised access.
- Test the failure paths you designed: timeouts, retries, fallbacks and error messages.

## Levels
- Unit tests for pure logic: fast, numerous, no I/O.
- Integration tests for boundaries (database, HTTP handlers, queues), using real dependencies such as local services or test containers where practical.
- End-to-end tests for the key user journeys against the built app. Keep them few, stable and independent of each other.
- Schema or contract tests for APIs that others consume.
- Automated accessibility checks (axe or equivalent) on every page template, with zero serious or critical issues.

## Writing tests
- One behaviour per test. The name states the behaviour and the expected result. Use arrange, act, assert.
- Deterministic: control time, randomness, network and ordering. No fixed sleeps; wait for conditions.
- Mock only at boundaries you don't own or that are slow or non-deterministic. Never mock the unit under test or assert on the mock itself.
- Use synthetic data from factories or fixtures. Never use production personal data.
- Tests are isolated: they run in any order and in parallel, and clean up what they create.
- Prefer specific assertions to large snapshots. Review snapshot changes like code.

## CI
- Every pull request runs format, lint, typecheck, unit, integration, build and end-to-end tests. Merging is blocked on failure.
- Fix a flaky test at once, or quarantine it with a tracked issue. Never re-run until green and move on.
- Coverage is a signal, not a target. Cover critical logic thoroughly; never write tests just to raise the number.
