# ADR-0006: Design system and webfonts

**Status:** accepted · **Date:** 2026-11-02 · **Decider:** Nitin Raturi · **Supersedes:** ADR-0004

## Context
The site used Starlight's default look with a blue accent, a gradient hero and a grid of identical cards, which Devbook's own design rules call the template look (DES-02). Its fonts were system stacks.

## Decision
- Follow the direction in `docs/design-system.md`: a printed engineering standard, with rule IDs set as margin clause numbers as the signature element.
- Keep Starlight (ADR-0001) and theme it only through tokens in `src/styles/custom.css`: OKLCH role tokens (`--dvb-*`) mapped onto Starlight's `--sl-*` tokens in both themes, with a vermilion accent.
- Use the system sans for text, and self-host IBM Plex Mono (400) from `@fontsource/ibm-plex-mono` 5.3.0 (SIL OFL 1.1): Latin subset, `font-display: swap`, preloaded, about 15 KB. It is a dev dependency because the site is static.
- `scripts/postbuild-html.mjs` wraps each leading rule ID in a span, so CSS can place it in the margin; the HTML stays plain Markdown output.
- `scripts/check-contrast.mjs` reads the OKLCH tokens and checks every text pair in both themes.

## Alternatives
- IBM Plex Sans (400, 600) with Plex Mono, about 61 KB: the approved pairing, rejected after measuring. Mobile Lighthouse LCP on `/start-here/setup/` (simulated, 3 runs each, budget 2,000 ms):

  | Fonts | LCP |
  |---|---|
  | Before the redesign (system fonts) | 1,959 ms |
  | Plex Sans 400 and 600, Plex Mono | 2,105–2,256 ms |
  | Plex Sans 400, Plex Mono | 2,105–2,108 ms |
  | Plex Mono only (chosen) | 1,955–1,958 ms |

  The maintainer chose Plex Mono only rather than raise the budget. A metric-matched Arial fallback removed the layout shift that Plex Sans caused (0.092 to 0), but not the LCP cost.
- A fully custom Astro layout: more control, but rebuilding search, sidebar and accessibility that Starlight already provides.

## Consequences
- About 15 KB of font on first visit, cached afterwards. All Lighthouse budgets pass (`npm run lhci`).
- New colours are added as roles in `custom.css`, never as raw values in components.
- The logo, favicon and social image use the token values printed by `node scripts/check-contrast.mjs --hex <role>`.
