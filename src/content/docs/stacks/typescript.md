---
title: TypeScript
description: TypeScript stack profile - strict compiler flags, lint and format setup, path aliases, types versus interfaces, unknown over any, and boundary validation with Zod.
lastVerified: 2026-10-22
sidebar:
  order: 3
---

## Rules

### Compiler
```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true
  }
}
```
- Extend the framework's base config (for example Astro's `strict` preset) and add the flags above.
- `tsc --noEmit` (or the framework checker) runs in CI.

### Types
- No `any`. Use `unknown` and narrow. A justified `any` has a comment.
- `type` for data shapes and unions; `interface` for component props and extendable contracts. Be consistent per project.
- Derive types from schemas (`z.infer<typeof schema>`) instead of writing them twice.
- Use discriminated unions for state (`{ status: 'loading' } | { status: 'error', error } | …`).
- Avoid enums with runtime output; prefer string-literal unions or `as const` objects.

### Boundaries
- Validate all external data (API responses, form input, env vars, JSON files) with Zod or similar at the edge.
- Validate environment variables at startup and fail fast.

### Tooling
- ESLint with `typescript-eslint` (recommended + type-checked rules) and Prettier; fail CI on warnings.
- Path aliases in `tsconfig` (`@lib/*`, `@components/*`) instead of `../../../`.
- No barrel files re-exporting whole folders in browser code.

### Style
- Functions are small and pure where possible; async functions always handle or propagate errors.
- Prefer `readonly` arrays and properties for data that should not change.

## Checklist
- [ ] Strict flags on; checker in CI
- [ ] No unexplained `any`
- [ ] Types inferred from schemas
- [ ] Env vars validated at startup
- [ ] ESLint + Prettier clean
