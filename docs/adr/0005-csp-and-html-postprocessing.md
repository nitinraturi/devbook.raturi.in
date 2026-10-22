# ADR-0005: Build-time CSP hashes and HTML post-processing

**Status:** accepted · **Date:** 2026-10-22 · **Decider:** Nitin Raturi

## Context
`stacks/cloudflare.md` requires a CSP with hashed inline scripts and no `'unsafe-inline'` for scripts. Starlight emits a few small inline scripts (theme, sidebar state). Pagefind search needs WebAssembly.

Astro 7's default Markdown processor does not run rehype plugins without an extra package. Two accessibility issues in generated HTML needed fixing.

## Decision
- **CSP.** `public/_headers` holds the policy with placeholders. `scripts/postbuild-csp.mjs` hashes every inline `<script>` in `dist/**/*.html` (JSON-LD excluded) into `script-src`. It adds Google Analytics hosts only when the GA tag is in the build. `'wasm-unsafe-eval'` is allowed for Pagefind. `style-src` keeps `'unsafe-inline'` (allowed by the stack profile; Starlight and Expressive Code use inline styles).
- **Script inlining off.** `vite.build.assetsInlineLimit: 0` keeps page scripts as cached, hashed files under `/_astro/`, which also reduces the number of inline hashes.
- **HTML fixes.** `scripts/postbuild-html.mjs` runs before the CSP step:
  - GFM task-list checkboxes are disabled and unlabelled. They get `aria-hidden="true"`, because the list text carries the meaning (axe `label`, critical).
  - Code blocks get `tabindex="0"` so keyboard users can scroll them (axe `scrollable-region-focusable`, serious).
- **Known exception.** Starlight's search button is named "Search" while visually showing a ⌘K hint. The smoke tests exclude that one element from axe `label-content-name-mismatch` only. This is an upstream issue (`docs/TODO.md`).

## Options considered
- Astro's built-in CSP: it emits a `<meta>` policy. A header policy also covers `frame-ancestors`, which a meta tag cannot set, so the header approach was kept. It matches webtools.raturi.in.
- Overriding `markdown.processor` with Sätteri hast plugins: rejected because it risks replacing the Markdown plugins Starlight registers.

## Consequences
- `npm run build` = `astro build` → HTML fixes → CSP hashes. Always deploy the output of `npm run build`, not of `astro build` alone.
- Playwright runs against `scripts/serve-dist.mjs`, which applies `dist/_headers`, so CSP breakage fails the tests.
