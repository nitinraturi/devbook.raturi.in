# ADR-0004: Accent colour and contrast

**Status:** accepted · **Date:** 2026-10-22 · **Decider:** Nitin Raturi

## Context
BUILD-PROMPT §3 asks for one restrained blue that passes WCAG AA in both themes, set only through Starlight's CSS custom properties.

## Decision
`src/styles/custom.css`:

| Token | Dark theme | Light theme |
|---|---|---|
| `--sl-color-accent-low` | `#0c2a5c` | `#dbe7fe` |
| `--sl-color-accent` | `#4d8dff` | `#1d4ed8` |
| `--sl-color-accent-high` | `#bcd4ff` | `#1e3a8a` |

Grays and fonts stay at Starlight's defaults (system font stacks, no webfont).

Contrast against Starlight 0.42's default backgrounds, from `npm run contrast` (CI fails below 4.5:1):

| Pair | Ratio |
|---|---|
| Dark: link text (accent-high) on page background | 11.83:1 |
| Dark: link text on sidebar/nav background | 10.07:1 |
| Dark: current sidebar item (accent-low on accent-high) | 9.32:1 |
| Dark: primary button (page background on accent) | 5.55:1 |
| Dark: body text on accent-low | 7.93:1 |
| Light: link text (accent) on page background | 6.70:1 |
| Light: link text on sidebar/nav background | 6.25:1 |
| Light: current sidebar item (white on accent) | 6.70:1 |
| Light: accent-high on accent-low | 8.32:1 |

## Consequences
Every pair passes AA for normal text. axe (Playwright) and Lighthouse accessibility (100) confirm this in both themes.
