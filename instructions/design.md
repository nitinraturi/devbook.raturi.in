---
title: Design
description: Distinctive, accessible UI for any interface - design direction, avoiding the template look, layout, type, colour, tokens, states, forms, motion and WCAG 2.2 AA.
sidebar:
  order: 7
lastVerified: 2026-10-24
sources:
  - WCAG 2.2
  - Apple Human Interface Guidelines and Material Design 3
  - Dieter Rams' ten principles of good design
  - Refactoring UI (Wathan and Schoger)
---

Load for any project with a user interface. The project's own look lives in `docs/design-system.md`.

## First
- DES-01: Before the first screen, write a design direction in the design-system doc and get approval: audience, three tone words, one reference from outside software (print, signage, architecture, a material), type pairing, palette and one signature element. Every later choice traces back to it.
- DES-02: Be distinctive through a few deliberate choices (a characterful display face, a palette from the product's world, one signature element) and keep everything else quiet. Customise any UI kit's theme, and avoid the template look: one default sans everywhere, purple-to-blue gradients, glassmorphism, a centred hero over three identical icon cards, emoji as icons, and the same rounded, shadowed card around everything.
- DES-03: Design with real content at its longest and shortest, never lorem ipsum.
- DES-04: Design mobile first at 360 px. Check every UI change in a browser at about 360 px and 1440 px, in light and dark themes, and by keyboard.
- DES-05: Run axe (or equivalent) on every page template in CI with zero serious or critical issues; it covers contrast, names, landmarks and heading order.

## Craft and layout
- DES-06: Honest UI: label estimates and illustrations, and never imitate system dialogs, live data or official seals. No dark patterns, fake urgency or fake social proof.
- DES-07: Separate content with spacing and background shifts before borders, and keep any remaining lines light.
- DES-08: Icons come from one family, with a stroke matching the adjacent text weight. Images are real (product, people, work) or one illustration style, never generic stock.
- DES-09: Keep reading width to about 65–75 characters.
- DES-10: No fixed heights on text containers; `min-width: 0` on flex and grid children holding text. Use `dvh`/`svh` instead of `vh`, and respect safe-area insets.

## Type and colour
- DES-11: At most two families: a characterful display face with a neutral text face, or one family with real range. Font loading is in the performance instructions.
- DES-12: Use a modular scale of about 1.2–1.25, sized fluidly with `clamp()`. Body text is at least 16 px with line height about 1.5; headings about 1.1–1.3, with slightly tighter letter spacing at large sizes.
- DES-13: Use `text-wrap: balance` for headings, `text-wrap: pretty` for paragraphs and tabular figures for changing numbers.
- DES-14: Name colours by role (`--color-surface`, `--color-accent`), not value (`--blue-500`), and build palettes in OKLCH.
- DES-15: Tint neutrals toward the brand hue instead of pure grey. Use one accent sparingly, on roughly a tenth of the screen. Status colours (success, warning, danger, info) mean only that.
- DES-16: Light and dark themes are token sets that follow `prefers-color-scheme`, with a manual toggle. Set `color-scheme` and apply the stored theme before first paint. Tune dark mode on its own: dark grey rather than black, lighter surfaces for elevation, softer saturation.
- DES-17: Pair colour with text, an icon or a pattern, so meaning survives colour blindness and greyscale.

## Tokens and components
- DES-18: Define colours, type scale, a 4 or 8 px spacing scale, one radius scale, one elevation scale, z-index and durations once as tokens, and use only tokens in components. Shadows are soft, tinted with the surface hue and lit from one direction.
- DES-19: Use native elements before custom ones: `<button>`, `<a>`, `<dialog>`, `popover`, `<details>` and `accent-color` on form controls. Use semantic HTML first and ARIA only when no native element fits.
- DES-20: Every interactive component handles default, hover, `:focus-visible`, active, disabled, loading, error, empty and success.
- DES-21: Empty states explain what belongs there and offer the next action. Error states say what happened and how to fix it, and keep the user's input.

## Forms
- DES-22: Single column, with visible labels above fields. Placeholders are not labels. Mark optional fields when most are required.
- DES-23: Use the right `type`, `inputmode` and `autocomplete` on every field, so keyboards and autofill work.
- DES-24: Validate on blur and on submit, not on every keystroke. Show errors next to the field, and in a summary for long forms, and move focus to the first error.

## Motion
- DES-25: Motion explains change. UI transitions take about 150–250 ms with ease-out and animate only `transform` and `opacity`.
- DES-26: Wrap non-essential motion in `prefers-reduced-motion: no-preference`, and flash nothing more than 3 times per second, which can trigger seizures.

## Accessibility (WCAG 2.2 AA)
- DES-27: Everything works by keyboard in a logical order with a visible focus indicator, and focused elements are never hidden behind sticky headers or banners.
- DES-28: Pages work at 200% zoom, with increased text spacing, and at 320 px width without horizontal scrolling.
- DES-29: Targets are at least 24×24 CSS px or have enough spacing (WCAG 2.5.8); aim for 44×44 on touch. Any drag action has a single-pointer alternative.
- DES-30: Decorative images have empty alt. Video has captions and audio has transcripts.
- DES-31: Announce async results and status messages with a live region.
- DES-32: Spot-check with a screen reader before release.
