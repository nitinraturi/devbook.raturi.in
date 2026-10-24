---
title: Design
description: Distinctive, accessible UI for any interface - design direction, craft, hierarchy, layout, type, colour, tokens, states, forms, motion and WCAG 2.2 AA.
sidebar:
  order: 7
lastVerified: 2026-10-24
---

Based on WCAG 2.2, the Apple Human Interface Guidelines, Material Design 3, Nielsen's heuristics, Dieter Rams' ten principles of good design, the Swiss grid tradition (Josef Müller-Brockmann), Edward Tufte's information design and *Refactoring UI*. Load for any project with a user interface. The project's own look lives in `docs/design-system.md`.

## Direction
- Before the first screen, write a design direction in the design-system doc and get approval: audience, three tone words, one reference from outside software (print, signage, architecture, a material), type pairing, palette and one signature element. Every later choice traces back to it.
- Be distinctive through a few deliberate choices, not decoration: a characterful display typeface, a palette drawn from the product's world and one signature element (a grid, texture, shape or motion). Keep everything else quiet.
- Customise any UI kit's default theme before shipping. Avoid the generic template look: one default sans everywhere, purple-to-blue gradients, glassmorphism, a centred hero over three identical icon cards, emoji as icons, and the same rounded, shadowed card around everything.
- Design with real content at its longest and shortest, never lorem ipsum.
- Less, but better: remove every element, colour, line or effect that does not help the user understand or act, then refine what remains to the last detail.

## Principles
- One primary purpose and action per screen, key information first. Build hierarchy from size, weight, spacing and position before colour, and de-emphasise secondary content instead of emphasising everything.
- Consistency: the same thing looks and behaves the same everywhere and follows platform conventions. Be distinctive in the look, never in how standard controls behave.
- Show status: feedback within about 100 ms, progress for anything over about 1 s.
- Prevent errors with defaults, constraints, confirmation and undo. Prefer recognition over recall: visible options and remembered input.
- Honest UI: label estimates and illustrations. Don't imitate system dialogs, live data or official seals. No dark patterns, fake urgency or fake social proof.
- Mobile first: design at 360 px, then use extra space on larger screens without adding features.

## Craft
- Build on a grid with a steady rhythm. Break it on purpose, at most once per view, for focus.
- Vary density: generous space between sections, tight space within groups. Start with too much white space, then remove it.
- Separate content with spacing and background shifts before borders. Keep any remaining lines light.
- Align optically, not only mathematically: icons, triangles and large type often need a nudge. A nested corner's radius is the outer radius minus the gap between them.
- Use one radius scale and one elevation scale. Shadows are soft, layered, tinted with the surface hue and lit from one direction.
- Icons come from one family, with a stroke matching the adjacent text weight. Images are real (product, people, work) or one illustration style, never generic stock.
- Test every screen three ways: squint (hierarchy holds when blurred), greyscale (it works without colour) and removal (nothing is lost if one more thing goes).

## Layout and spacing
- Use a spacing scale based on 4 or 8 px. Related items sit closer together than unrelated ones.
- Use container queries for components that live in different widths, and media queries for page layout.
- Reading width is about 65–75 characters.
- No fixed heights on text containers; `min-width: 0` on flex and grid children holding text. Use `dvh`/`svh`, not `vh`, and respect safe-area insets.
- Use logical properties (`margin-inline`, `padding-block`) so right-to-left languages work.

## Typography
- At most two families: a characterful display face with a neutral text face, or one family with real range. Use few weights; loading rules are in the performance instructions.
- Use a modular scale of about 1.2–1.25 for text; display sizes may jump further for contrast. Size fluidly with `clamp()`. Body text is at least 16 px with line height about 1.5; headings about 1.1–1.3, with slightly tighter letter spacing at large sizes.
- Use `text-wrap: balance` for headings, `text-wrap: pretty` for paragraphs and tabular figures for changing numbers.
- Set body text ragged-right and in sentence case, not justified or in all caps. Letter-space short all-caps labels slightly.

## Colour and theming
- Name colours by role (`--color-surface`, `--color-accent`), not value (`--blue-500`). Build palettes in OKLCH.
- Tint neutrals slightly toward the brand hue instead of pure grey. Use one accent colour sparingly, on roughly a tenth of the screen, for interaction and emphasis. Status colours (success, warning, danger, info) mean only that.
- Light and dark themes are token sets that follow `prefers-color-scheme`, with a manual toggle. Set `color-scheme`, and apply the stored theme before first paint.
- Tune dark mode on its own rather than inverting: dark grey rather than pure black, lighter surfaces for elevation, softer saturation.
- Pair colour with text, an icon or a pattern, so meaning survives colour blindness and greyscale.

## Tokens and CSS
- Define colours, type scale, spacing, radii, shadows, z-index and durations once as tokens. Components use tokens, never raw values.
- Use native elements before custom ones: `<button>`, `<a>`, `<dialog>`, `popover`, `<details>` and `accent-color` on form controls.

## Components and states
- Every interactive component handles: default, hover, `:focus-visible`, active, disabled, loading, error, empty and success.
- Buttons say what happens ("Save draft", "Delete project"). One primary button per view; destructive buttons look destructive.
- Icons stand alone only when universally understood. Icon-only buttons have an accessible name and a tooltip.
- Loading: layout-matched skeletons for content, spinners only for short actions.
- Empty states explain what belongs there and offer the next action. Error states say what happened and how to fix it, and keep the user's input.
- Toasts only for brief confirmations; errors that need action stay on screen. Modals only for focused tasks. No auto-playing sound or carousels for core content.

## Forms
- Single column, with visible labels above fields. Placeholders are not labels. Mark optional fields when most are required.
- Use the right `type`, `inputmode` and `autocomplete` on every field, so keyboards and autofill work.
- Validate on blur and on submit, not on every keystroke. Show errors next to the field and in a summary for long forms, and move focus to the first error.
- Ask for each piece of information once per flow. Allow paste in password and code fields.

## Motion
- Motion explains change: where something came from and what changed. UI transitions take about 150–250 ms with ease-out, and animate only `transform` and `opacity`.
- Allow at most one expressive moment per page, as part of the signature. Everything else stays fast and quiet.
- Wrap non-essential motion in `prefers-reduced-motion: no-preference`. Animate without shifting layout, and flash nothing more than 3 times per second, which can trigger seizures.

## Accessibility (WCAG 2.2 AA)
- Semantic HTML first; ARIA only when no native element fits. Pages have `lang`, landmarks, a skip link and one `h1`, with no skipped heading levels.
- Everything works by keyboard in a logical order with a visible focus indicator. Focused elements are never hidden behind sticky headers or banners.
- Dialogs trap focus, close on Escape and return focus to where they opened from.
- Contrast: 4.5:1 for text, 3:1 for large text, icons, focus indicators and control boundaries, in every theme and state.
- Pages work at 200% zoom, with increased text spacing, and at 320 px width without horizontal scrolling.
- Targets are at least 24×24 CSS px or have enough spacing (WCAG 2.5.8, with its exceptions for inline links). Aim for 44×44 on touch. Any drag action has a single-pointer alternative.
- Decorative images have empty alt. Video has captions and audio has transcripts.
- Sign-in needs no puzzles or memory tests. Help links stay in a consistent place.
- Announce async results and status messages with a live region.
- Spot-check with a screen reader before release.
