---
title: Testing
description: Mandatory testing rules for any stack - a test per acceptance criterion, failing test first for bugs, deterministic tests, real boundaries and flaky tests.
sidebar:
  order: 3
sources:
  - The Practical Test Pyramid (Ham Vocke, martinfowler.com)
  - Software Engineering at Google (Winters, Manshreck and Wright)
---

Mandatory for every project.

- TEST-01: Map each acceptance criterion to at least one test. Test behaviour through public interfaces, not implementation details, so refactors don't break tests.
- TEST-02: Start a bug fix with a test that fails without the fix.
- TEST-03: Make tests deterministic: control time, randomness, network and ordering, and wait for conditions instead of fixed sleeps, which are both slow and flaky.
- TEST-04: Mock only boundaries you don't own or that are slow or non-deterministic. Test the real unit, and assert on its results rather than on the mock.
- TEST-05: Test boundaries (database, HTTP handlers, queues) against real dependencies, such as local services or test containers, where practical.
- TEST-06: Use synthetic data from factories or fixtures, never production personal data.
- TEST-07: Fix a flaky test at once, or quarantine it with a tracked issue. Re-running until green hides real bugs.
- TEST-08: Every pull request runs format, lint, typecheck, tests and build in CI, and a failure blocks the merge.
