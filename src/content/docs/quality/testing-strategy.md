---
title: Testing strategy
description: What must be tested at each layer, from unit to end-to-end, plus rules for AI-written tests so they prove behaviour instead of repeating the implementation.
sidebar:
  order: 1
---

## Rules

### Layers
| Layer | Covers | Must exist for |
|---|---|---|
| **Unit** | Pure logic, calculations, validators, parsers | Every non-trivial function in the core |
| **Integration** | Code + database, code + external API (with test doubles at the network edge) | Every API endpoint and job |
| **Contract** | API matches its OpenAPI/schema | Every public API |
| **End-to-end** | Real browser or device through key user journeys | Sign-up/login, purchase, main content flows, 404 |
| **Accessibility** | Automated axe checks in e2e | Every page template |
| **Visual** | Screenshots at key widths and themes | Design-heavy templates |
| **Performance** | Lighthouse CI or equivalent | Public pages |
| **Content/data** | Schema validation, link checks, reference integrity | Content-driven sites |

### Writing tests
- Test **behaviour through public interfaces**, not private details.
- Each acceptance criterion in the spec maps to at least one test.
- A bug fix **MUST** add a test that failed before the fix.
- Tests are deterministic: no real time, randomness or network unless controlled.
- Test data is synthetic. Never real personal data.

### AI-written tests
- **MUST NOT** be tautological (asserting that a mock returns what it was told to return).
- **MUST NOT** mock the unit under test.
- **MUST NOT** be edited or deleted to make a failing build pass without human approval.
- **SHOULD** include edge cases the agent lists explicitly: empty, maximum, invalid, duplicate, concurrent, unauthorised.
- When asked for tests, the agent first lists the cases it will cover; the human adds missing ones.

### Coverage
- Coverage is a signal, not a goal. Watch it for the core logic; do not chase a number with low-value tests.

### Running
- The full fast suite runs on every PR. Slow suites (full e2e, visual, Lighthouse) run on PR for affected areas and nightly in full.
- Flaky tests are fixed or quarantined within a week, never ignored.

## Checklist
- [ ] Acceptance criteria mapped to tests
- [ ] Regression test with each bug fix
- [ ] e2e for key journeys with axe checks
- [ ] No tautological or self-mocking tests
- [ ] Suite deterministic and green in CI
