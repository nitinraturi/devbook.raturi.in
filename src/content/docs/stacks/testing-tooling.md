---
title: Test tooling (JS/TS)
description: Vitest, Playwright, axe, Lighthouse CI and link checking for JavaScript and TypeScript projects, plus a GitHub Actions pipeline in the right order.
lastVerified: 2026-10-22
sidebar:
  order: 7
---

## Tools

| Need | Tool |
|---|---|
| Unit and integration | Vitest |
| End-to-end, visual screenshots | Playwright |
| Accessibility checks | `@axe-core/playwright` |
| Performance budgets | Lighthouse CI (`@lhci/cli`) |
| Links | Framework validator (for Starlight: `starlight-links-validator`) or a crawler over `dist/` |
| Lint / format | ESLint + Prettier |

## Rules

- Unit tests next to the code (`*.test.ts`); e2e in `tests/e2e/`.
- Playwright tests run against the **built** site (`astro preview` or a static server), not the dev server.
- Every page template gets an axe check; zero serious or critical violations.
- Lighthouse CI runs on a fixed list of representative URLs with the mobile preset and asserts the project's budgets.
- Visual screenshots at about 400 px and 1280 px, light and dark, for key templates; update baselines only in a dedicated PR.

## GitHub Actions skeleton

```yaml
name: ci
on: [pull_request, push]
permissions: { contents: read }
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<pinned-sha>
        with: { fetch-depth: 0, submodules: true }
      - uses: actions/setup-node@<pinned-sha>
        with: { node-version: lts/*, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run test:e2e
      - run: npx lhci autorun
      - run: npm audit --audit-level=high
```

Pin actions to commit SHAs (see [supply chain](/security/supply-chain/)). `fetch-depth: 0` is needed for git-based "last updated" dates.

## Checklist
- [ ] Vitest, Playwright, axe, LHCI configured
- [ ] e2e against built output
- [ ] Budgets asserted in LHCI config
- [ ] Pipeline order as above; actions pinned
