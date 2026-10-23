---
title: Design
description: Modern, accessible UI rules for any interface - hierarchy, layout, type, colour, tokens, components, forms, states, motion and WCAG 2.2 AA.
sidebar:
  order: 6
lastVerified: 2026-10-23
---

Based on WCAG 2.2, the Apple Human Interface Guidelines, Material Design 3 and long-standing usability research (Nielsen's heuristics). The project's look (brand, colours, fonts, components) lives in its own docs, for example `docs/design-system.md`; these rules apply to every design.

## Principles
- Clarity first: each screen has one primary purpose and one primary action. Decoration must help the user understand or act.
- Clear hierarchy through size, weight, spacing and position before colour. Users scan, so key information comes first.
- Consistency: the same thing looks and behaves the same everywhere, and follows platform conventions users already know.
- Show system status: every action gets visible feedback within about 100 ms, and progress for anything over about 1 s.
- Prevent errors before reporting them: sensible defaults, constraints, confirmation for destructive actions, and undo where possible.
- Recognition over recall: visible options, labels on icons, and remembered input.
- Honest UI: label estimates and illustrations. Never imitate system dialogs, live data or official seals. No dark patterns, fake urgency or fake social proof.
- Mobile first: design at 360 px, then use extra space on larger screens. Don't add features there.

## Layout and spacing
- Use a spacing scale based on 4 or 8 px. Related items sit closer together than unrelated ones.
- Layout with grid and flex plus `gap`. Use container queries for components that live in different widths, and media queries for page layout.
- Content width is about 65–75 characters for reading. Avoid full-width text on large screens.
- No fixed heights on text containers. Set `min-width: 0` on flex and grid children that hold text. Use `dvh`/`svh` instead of `vh` for full-height mobile layouts, and respect `env(safe-area-inset-*)`.
- Use logical properties (`margin-inline`, `padding-block`) so right-to-left languages work.

## Typography
- Use at most two families (often one) and a few weights. Use system fonts or self-hosted variable fonts.
- Use a modular type scale (ratio about 1.2–1.25) with fluid sizes via `clamp()`. Body text is at least 16 px with line height about 1.5. Headings use about 1.1–1.3.
- Use `text-wrap: balance` for headings and `text-wrap: pretty` for paragraphs. Use tabular figures for numbers in tables.
- Never justify body text or set long passages in all caps.

## Colour and theming
- Define colour as semantic tokens (`--color-surface`, `--color-text`, `--color-accent`, `--color-danger`), not literal names (`--blue-500`). Prefer OKLCH for perceptually even palettes.
- Use mostly neutral surfaces with one accent colour for interaction and emphasis. Status colours (success, warning, danger, info) mean only that.
- Light and dark themes are token sets that follow `prefers-color-scheme`, with a manual toggle. Set `color-scheme`, and apply the stored theme before first paint.
- In dark mode, use dark grey rather than pure black, show elevation with lighter surfaces, and soften saturated colours.
- Never use colour as the only signal; add text, icons or patterns.

## Tokens and CSS
- Define colours, type scale, spacing, radii, shadows, z-index and durations once as tokens. Components use tokens, never raw values.
- Scope component styles (CSS modules, framework scoping or `@layer`). Avoid `!important` and deep selectors.
- Use native elements before custom ones: `<button>`, `<a>`, `<dialog>`, `popover`, `<details>`, and form controls styled with `accent-color` where enough.

## Components and states
- Every interactive component handles: default, hover, `:focus-visible`, active, disabled, loading, error, empty and success.
- Buttons say what happens ("Save draft", "Delete project"). There is one primary button per view; destructive buttons look destructive.
- Icons only on their own when universally understood; otherwise add a text label. Icon-only buttons have an accessible name and a tooltip.
- Loading: use skeletons that match the layout for content, spinners only for short actions, and optimistic updates where safe.
- Empty states explain what belongs there and offer the next action. Error states say what happened and how to fix it, and keep the user's input.
- Toasts are for brief, non-critical confirmations. Errors that need action stay on the screen.
- Use modals only for focused tasks or confirmation. Never auto-play sound or video with sound. Avoid carousels for core content.

## Forms
- Single column, with visible labels above fields. Placeholders are not labels. Mark optional fields rather than required ones when most are required.
- Use the right `type`, `inputmode` and `autocomplete` on every field, so keyboards and autofill work.
- Validate on blur and on submit, not on every keystroke. Show errors next to the field and in a summary for long forms, and move focus to the first error.
- Never ask for the same information twice in one flow. Allow paste in password and code fields.

## Motion
- Motion explains change (where something came from, what changed). Keep UI transitions about 150–250 ms with ease-out, and animate only `transform` and `opacity`.
- Wrap non-essential motion in `prefers-reduced-motion: no-preference`. Never shift layout, and nothing flashes more than 3 times per second.

## Accessibility (WCAG 2.2 AA)
- Use semantic HTML first, and ARIA only when no native element fits. Pages have `lang`, landmarks, a skip link and descriptive headings that expose the real hierarchy. House rule: one `h1` per page, with no skipped levels.
- Everything works by keyboard in a logical order with a visible focus indicator. Focused elements are never hidden behind sticky headers or banners.
- Dialogs trap focus, close on Escape and return focus to where it came from.
- Contrast: 4.5:1 for text, 3:1 for large text, icons, focus indicators and control boundaries, in every theme and state.
- Pages work at 200% zoom, with text spacing increased, and at 320 px width without horizontal scrolling.
- Targets are at least 24×24 CSS px or have enough spacing (WCAG 2.5.8, with its exceptions for inline links). Aim for 44×44 on touch. Any drag action has a single-pointer alternative.
- Meaningful images have alt text and decorative ones have empty alt. Video has captions, and audio has transcripts.
- Sign-in allows password managers and paste, with no cognitive tests such as puzzles. Help and contact links stay in a consistent place.
- Announce async results and status messages with a live region.
- Run automated axe checks in end-to-end tests with zero serious or critical issues. Do a keyboard-only pass and a screen-reader spot-check before release.
