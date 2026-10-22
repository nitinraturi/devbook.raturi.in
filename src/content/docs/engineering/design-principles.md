---
title: Design principles
description: Stack-agnostic architecture rules - simple first, data as data, derive don't duplicate, pure core and thin shell, fail the build, and when not to abstract.
sidebar:
  order: 1
---

These principles decide most structural questions before they become debates. Agents tend to over-engineer, so the "when not to" rules matter as much as the rest.

## Rules

1. **Simplest thing that meets the requirement.** Static before server-rendered, server-rendered before client-heavy, one service before many. Add complexity only when a written requirement needs it. (KISS, YAGNI.)
2. **Data is data.** Facts, content, configuration and copy live in validated data files or a database, not hard-coded in components.
3. **Derive, don't duplicate.** If a list or relationship can be computed from existing data, compute it. Never maintain the same fact in two places.
4. **Pure core, thin shell.** Business logic and calculations are pure functions with no I/O, framework or DOM imports, so they can be unit-tested. The shell (UI, HTTP, database, renderer) only adapts.
5. **Single responsibility.** A module or component has one reason to change. A component either prepares data or renders it.
6. **Dependencies point inward.** Core logic does not import framework, UI or infrastructure code. Infrastructure depends on the core, not the reverse.
7. **Explicit over clever.** Name things plainly, make side effects visible, avoid magic and implicit global state.
8. **Fail the build, not the user.** Broken links, invalid data, missing assets, schema errors and failed checks stop the build or deploy.
9. **Boring technology.** Prefer mature, widely used tools with good docs. Each new tool is a cost; justify it in an ADR.
10. **Configuration from the environment.** Settings that differ between environments come from environment variables or config files, never code edits (12-factor style).
11. **Errors are part of the design.** Every failure mode has a defined behaviour: retry, fallback, user message, or alert.
12. **Reversible decisions fast, irreversible ones slow.** Data models, public URLs, APIs and vendor lock-in get an ADR; internal naming does not.

## When NOT to abstract

- **MUST NOT** create an abstraction (base class, generic helper, plugin system, factory) until there are at least **three** real cases that need it.
- **MUST NOT** add layers "for future flexibility" without a requirement.
- **SHOULD** prefer a little duplication over the wrong abstraction.
- **MUST NOT** wrap a library just to rename its functions.

## SOLID, applied lightly

Use SOLID where code is object-oriented and expected to grow. In small modules and functional code, single responsibility and dependency direction carry most of the value; the rest is rarely worth ceremony.

## Checklist for a design proposal
- [ ] Requirement it serves is written down
- [ ] Simpler option considered and rejected with a reason
- [ ] Data model and failure modes defined
- [ ] Testability: core logic pure
- [ ] Irreversible parts captured in an ADR
