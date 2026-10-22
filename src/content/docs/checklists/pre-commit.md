---
title: Pre-commit
description: A quick checklist to run before every commit or pull request - checks green, no secrets, no stubs, tests for new behaviour, docs in step with code.
sidebar:
  order: 1
---

- [ ] Format, lint and type checks pass with no warnings
- [ ] Tests pass locally; new behaviour has tests; bug fixes have a regression test
- [ ] Build passes
- [ ] No secrets, tokens, personal data or `.env` files staged
- [ ] No stray `console.log`/`print`, commented-out code, stubs or silent `TODO`s
- [ ] No new dependency without approval
- [ ] Diff is one concern and small enough to review
- [ ] Docs, ADRs, `AGENTS.md` and changelog updated if behaviour or conventions changed
- [ ] Commit message follows Conventional Commits and says why
