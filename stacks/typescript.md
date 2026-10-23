---
title: TypeScript
description: TypeScript notes - strict compiler flags, types from schemas, boundary validation, lint setup and import style for any TypeScript project.
lastVerified: 2026-10-22
---

- Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch` and `verbatimModuleSyntax`, on top of the framework's base config.
- Run `tsc --noEmit` or the framework checker in CI.
- Never use `any`; use `unknown` and narrow it. Derive types from schemas (`z.infer`) instead of writing them twice.
- Use discriminated unions for state. Prefer string-literal unions or `as const` objects to runtime enums.
- Validate env vars at startup and external data at the boundary with Zod or similar.
- Use ESLint with type-checked `typescript-eslint` rules, plus Prettier. CI fails on warnings.
- Use path aliases instead of deep relative imports. No barrel files in browser code.
- Use `readonly` for data that must not change. Async code always handles or propagates errors.
