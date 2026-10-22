---
title: Definition of done
description: The single objective bar every change must clear before merge, covering checks, tests, docs, security, accessibility and honest reporting.
sidebar:
  order: 3
---

A change is done when all of the following are true. Projects may add items; they may not remove them without an ADR.

## Code
- [ ] Lint, format and type checks pass with zero warnings.
- [ ] Unit tests cover the new logic; all tests pass in CI.
- [ ] Integration or end-to-end test for any new user-facing flow.
- [ ] No `TODO`, stub, mock data or commented-out code left without a tracked follow-up.
- [ ] No new dependency without approval; licence and maintenance checked.
- [ ] No secrets, tokens or personal data in code, tests, logs or fixtures.

## Behaviour
- [ ] Meets every acceptance criterion in the spec section.
- [ ] Errors are handled and shown to users in plain words with a next step.
- [ ] Works at small (≈360 px) and large (≈1440 px) widths, light and dark themes, keyboard only, reduced motion (UI work).
- [ ] No new console errors or warnings.

## Quality gates
- [ ] Performance budgets hold (see [budgets](/quality/performance-budgets/)).
- [ ] Accessibility: automated check has no serious or critical issues.
- [ ] Security checklist done for changes touching auth, input, files, payments, headers or LLM tools.

## Docs
- [ ] Spec, ADRs and `AGENTS.md` updated if behaviour or conventions changed.
- [ ] Changelog entry.
- [ ] User-facing docs or content updated.

## Reporting
- [ ] The task report lists what was not done and any assumptions. "Done" is never claimed for partial work.
