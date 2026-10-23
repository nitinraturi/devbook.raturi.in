---
title: Design
description: UI, design-token, layout, motion and WCAG 2.2 AA accessibility rules an assistant follows when building any interface.
sidebar:
  order: 4
---

The project's look (brand, colours, fonts, components) lives in its own docs, for example `docs/design-system.md`. These rules apply to every design.

## Principles
- Content first. Decoration must help the user understand or act.
- Mobile first: design at 360–400 px, then use extra space on larger screens. Don't add features there.
- Use one accent colour, for interaction and meaning, not decoration.
- Honest UI: label estimates and illustrations. Never imitate system dialogs, live data or official seals.
- If an effect costs more performance than it adds, remove it.

## Tokens and CSS
- Define colours, type scale, spacing, radii, shadows and durations once as tokens (CSS custom properties or the platform equivalent). Components use tokens, never raw values.
- Use semantic tokens (`--accent`, `--danger`, `--muted`), not literal ones (`--blue-500`).
- Light and dark themes are token sets that follow the OS by default, with a manual toggle. Apply the stored theme before first paint to avoid a flash.
- Layout with flex or grid and `gap`. No fixed heights on text containers. Set `min-width: 0` on flex and grid children holding text.
- Use fluid type with `clamp()`, body text at least 16 px, and lines about 65–75 characters long.
- Scope component styles. Avoid `!important`.

## Components
- Every component handles its states: default, hover, focus-visible, active, disabled, loading, error and empty.
- Labels use the user's words. Buttons say what happens ("Save draft"). Errors say what went wrong and how to fix it.
- No dark patterns, fake urgency or fake social proof. No carousels for core content.
- Use modals only for search, consent or confirmation. Never auto-play sound.

## Motion
- Keep transitions at about 200 ms or less, and never shift layout.
- Wrap non-essential motion in `prefers-reduced-motion: no-preference`.

## Accessibility (WCAG 2.2 AA)
- Use semantic HTML first; add ARIA only when no native element fits. One `h1`, headings in order, `lang` set, a skip link.
- Everything interactive works by keyboard in a logical order, with visible focus. Dialogs trap focus, close on Escape and return focus.
- Contrast: 4.5:1 for text, 3:1 for large text, icons and control boundaries, in every theme. Never use colour as the only signal.
- Pages work at 200% zoom and 320 px width without horizontal scroll.
- Touch targets are at least 24×24 px; aim for 44×44.
- Meaningful images have alt text; decorative images have empty alt. Video has captions.
- Every input has a visible label (placeholders are not labels). Errors name the field.
- Announce async status updates with a live region. Nothing flashes more than 3 times per second.
- Run automated axe checks in end-to-end tests with zero serious or critical issues. Do a keyboard-only pass before release.
