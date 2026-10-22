# ADR-0001: Stack and tool versions

**Status:** accepted · **Date:** 2026-10-22 · **Decider:** Nitin Raturi

## Context
The devbook site is built around existing Markdown content. BUILD-PROMPT asks for the latest stable Astro and Starlight, a lockfile, TypeScript strict mode and exact versions recorded here.

## Decision
Exact versions, all pinned in `package.json` and locked in `package-lock.json`:

| Package | Version | Role |
|---|---|---|
| astro | 7.4.2 | Framework (BUILD-PROMPT verified 7.4.1; 7.4.2 was the latest patch on npm at build time) |
| @astrojs/starlight | 0.42.6 | Docs theme, search (Pagefind), sitemap |
| starlight-links-validator | 0.27.0 | Fails the build on broken internal links |
| starlight-llms-txt | 0.12.0 | Generates `/llms.txt`, `/llms-full.txt`, `/llms-small.txt` |
| @astrojs/check, typescript | 0.9.12, 6.0.3 | `astro check` |
| @playwright/test, @axe-core/playwright | 1.64.1, 4.14.0 | Smoke tests and accessibility checks |
| @lhci/cli | 0.15.1 | Lighthouse CI budgets |
| sharp | 0.35.5 | Generates the OG image (`npm run og:image`); dev only |

- Node: current LTS line 24 (`.nvmrc`), used by CI and Cloudflare Pages.
- TypeScript: `astro/tsconfigs/strict` plus `noUncheckedIndexedAccess`.
- Markdown: Astro 7's default processor (Sätteri). Remark/rehype plugins would need `@astrojs/markdown-remark`, so two small HTML fixes run post-build instead (see ADR-0005).

## Consequences
- Upgrades go through `npx @astrojs/upgrade` in a dedicated PR, followed by `npm run check` and the Lighthouse run.
- `starlight-llms-txt` depends on `micromatch` → `braces`, which has an unfixed high advisory. It runs only at build time on patterns in `astro.config.mjs`, so CI audits at `critical` until a fix exists (tracked in `docs/TODO.md`).
