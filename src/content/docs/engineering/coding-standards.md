---
title: Coding standards
description: Language-neutral rules for naming, units, types, functions, comments, errors, logging, formatting and linting that keep code readable for people and agents.
sidebar:
  order: 3
---

## Rules

### Formatting and linting
- Every project **MUST** use an automatic formatter and a linter, run in CI, failing on warnings.
- Formatting is never discussed in review; the tool decides.

### Naming
- Functions are verbs (`calculateTotal`), booleans read as questions (`isPublished`, `hasAccess`), collections are plural.
- Include units when ambiguous: `timeoutMs`, `weightKg`, `angleDeg`, `priceInPaise`.
- No abbreviations except widely known ones (`id`, `url`, `http`).
- Store values in base units internally (seconds, metres, smallest currency unit as integers); convert only for display.

### Types
- Use the strictest practical type checking (TypeScript `strict`, Python type hints checked by mypy or pyright).
- No escape hatches (`any`, `# type: ignore`, unchecked casts) without a comment explaining why.
- Validate all external input at the boundary with a schema (Zod, Pydantic, Django forms/serializers); inside the boundary, trust the types.

### Functions and modules
- Functions do one thing. If a function needs a comment to separate its sections, split it.
- Prefer pure functions and return values over mutation and shared state.
- Keep parameter lists short; group related parameters into an object.
- No hidden module-level state except documented caches.

### Comments
- Comments explain **why**: constraints, trade-offs, sources of constants, links to specs or issues.
- Every non-obvious constant cites where it came from.
- Delete commented-out code; git keeps history.

### Errors
- Never swallow an error silently. Handle it, add context and re-raise, or log and report.
- Use typed or named error classes for expected failures; reserve crashes for programmer errors.
- User-facing messages say what happened and what to do next. Internal details stay in logs.

### Logging
- Structured logs (key-value or JSON) with a level, a message and context IDs.
- **MUST NOT** log secrets, tokens, passwords, full card or ID numbers, or personal data beyond what is necessary.
- Log at boundaries (requests, jobs, external calls), not inside tight loops.

### Dates, money, text
- Store timestamps in UTC with timezone awareness; convert at display.
- Money as integers in the smallest unit or a decimal type; never floating point.
- Text is UTF-8 everywhere.

## Checklist
- [ ] Formatter and linter clean
- [ ] Types strict; no unexplained escape hatches
- [ ] Inputs validated at the boundary
- [ ] Units in names where ambiguous
- [ ] No swallowed errors; no sensitive data in logs
