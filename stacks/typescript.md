---
title: TypeScript
description: TypeScript notes - strict compiler flags, types from schemas, boundary validation, lint setup and import style for any TypeScript project.
lastVerified: 2026-10-22
---

Check the current TSConfig reference before changing compiler options.

- Enable `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch` and `verbatimModuleSyntax`, on top of the framework's base config.
- Run `tsc --noEmit` or the framework checker in CI.
- Use `unknown` and narrow it instead of `any`. Derive types from schemas (`z.infer`) instead of writing them twice.
- Use discriminated unions for state. Prefer string-literal unions or `as const` objects to runtime enums.
- Use Zod or a similar library for boundary validation, and validate env vars at startup so a bad config fails fast.
- Use ESLint with type-checked `typescript-eslint` rules, plus Prettier. CI fails on warnings.
- Use path aliases instead of deep relative imports. Import from the module itself rather than a barrel (`index.ts` re-export) file in browser code, because barrels defeat tree-shaking.
- Use `readonly` for data that must not change. Await or return every promise, so rejections aren't lost.
