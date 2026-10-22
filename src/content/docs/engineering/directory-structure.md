---
title: Directory structure
description: Principles for organising any repository - feature-based folders, where tests, docs, scripts and config live, naming, and monorepo versus polyrepo.
sidebar:
  order: 2
---

Stack profiles show concrete trees. This page sets the principles they follow.

## Rules

- Organise by **feature or domain** first, by technical type second. `orders/` containing its model, service, views and tests beats a global `models/`, `services/`, `views/` once the project has more than a handful of features.
- Shared code goes in a clearly named shared folder (`lib/`, `core/`, `common/`) only after two features need it.
- Every repo **MUST** have at its root: `README.md`, `AGENTS.md`, a lockfile, a licence (public repos), `.gitignore`, `.editorconfig`, and the CI config.
- Documentation **MUST** live in `docs/` inside the repo and change with the code.
- Tests **SHOULD** sit next to the code they test (`*.test.ts`, `test_*.py`) or mirror the source tree in `tests/`; pick one per project and record it in `AGENTS.md`.
- One-off and build scripts go in `scripts/`, each with a header comment saying what it does and how to run it.
- Generated output (`dist/`, `build/`, coverage, caches) **MUST** be git-ignored, except deliberately committed build artefacts, which are listed in the README.
- Secrets **MUST NOT** be committed. Commit `.env.example` with variable names and safe dummy values.
- Path aliases (for example `@lib/*`) **SHOULD** replace deep relative imports.
- Barrel files that re-export whole folders **SHOULD NOT** be used in front-end code; they hurt tree-shaking.

## Naming

- Files and folders: lowercase with hyphens (`order-summary/`), except where the language convention differs (PascalCase components, snake_case Python modules).
- One main export per file; the filename matches it.
- Names state the domain, not the pattern: `invoice-totals.ts`, not `helper2.ts` or `utils.ts`.

## Generic shape

```
<repo>/
├── README.md  AGENTS.md  CLAUDE.md  CHANGELOG.md  LICENSE
├── .github/ (workflows, copilot-instructions.md, PR template)
├── docs/    (devbook pin, adr/, brief, spec, domain docs)
├── src/     (feature folders + shared lib)
├── tests/   (if not colocated; e2e always here)
├── scripts/
├── public/ or static/
└── config files (lint, format, types, CI)
```

## Monorepo or polyrepo

- **One repo per deployable product** by default.
- Use a monorepo when several packages are released together, share types, or one person maintains them all. Use workspace tooling native to the language.
- Shared standards (like this devbook) live in their own repo and are pinned, not copied.
