---
title: Git and code review
description: Branching, conventional commits, pull request size and template, and how to review AI-written code line by line before it reaches main.
sidebar:
  order: 4
---

## Rules

### Branches and commits
- `main` **MUST** always be deployable and protected: pull requests only, required CI, no force pushes.
- Feature branches **SHOULD** be short-lived (days, not weeks).
- Commits **MUST** follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `perf:`, `chore:`, `content:`. Breaking changes add `!` or a `BREAKING CHANGE:` footer.
- Commit messages **SHOULD** explain why, not only what.
- Releases **MUST** be tagged with semantic versions.

### Pull requests
- One concern per PR. A PR **SHOULD** be reviewable in one sitting; split larger work.
- The PR description **MUST** link the spec section or issue and include the agent's task report or equivalent.
- CI **MUST** pass before review starts.

### Reviewing AI-written code
- A human **MUST** read every changed line. Skimming is not review.
- Check that every imported package and API **actually exists** in the version you use. Agents can invent plausible names.
- Check for silently weakened tests, broadened permissions, disabled checks, swallowed errors and new network calls.
- Check that the code does what the spec says, not what the agent described.
- Run the change locally or on the preview deployment for anything user-facing.

## PR template

```markdown
## What and why
<1–3 sentences; link spec section / issue>

## Changes
- …

## Checks
<paste summary of lint / types / tests / build / a11y / perf>

## Risk
<what could break; rollback plan if non-trivial>

## Not done / follow-ups
- …

## Checklist
- [ ] Definition of done met
- [ ] Docs + changelog updated
- [ ] Sensitive areas reviewed by a human (auth, payments, data, infra, content claims)
```
