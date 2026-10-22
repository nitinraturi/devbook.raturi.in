---
title: UI and design systems
description: Stack-agnostic UI rules - design tokens, honest interfaces, mobile-first layout, component states, UI writing, motion and what a design-system doc contains.
sidebar:
  order: 6
---

Each project defines its own look in `docs/design-system.md`. This page sets the rules every design system follows.

## Rules

### Tokens
- Colours, type sizes, spacing, radii, shadows and durations are defined once as **tokens** (CSS custom properties or the platform equivalent). Components use tokens, never raw values.
- Light and dark themes are token sets; both are checked for contrast.
- Semantic tokens (`--accent`, `--danger`, `--muted`) over literal ones (`--blue-500`) in components.

### Principles
- **Content first.** The interface frames the content; decoration earns its place by teaching or guiding.
- **One accent, used with intent.** Saturated colour marks interaction or meaning, not decoration.
- **Honest UI.** Illustrative things are labelled; estimates look like estimates; nothing imitates live data, system dialogs or official seals.
- **Mobile first.** Design at about 360–400 px wide, then add space on larger screens, not features.
- **Fast and light.** If an effect costs more than it adds, remove it.

### Components
- Every component documents its states: default, hover, focus-visible, active, disabled, loading, error, empty.
- Interactive targets meet [accessibility](/quality/accessibility/) sizes.
- Layout uses flex/grid with `gap`; no fixed heights on text containers.

### Writing in the UI
- Labels use the words users use, not internal jargon.
- Buttons say what happens ("Save draft", "Download report").
- Errors say what went wrong and what to do next.
- No exclamation marks or hype in interface text.

### Motion
- Interface transitions are short (about 200 ms or less) and never shift layout.
- One orchestrated moment per page at most.
- `prefers-reduced-motion` disables non-essential motion.

### Don'ts
- No dark patterns: fake scarcity, pre-ticked consent, confirm-shaming, hidden cancellation.
- No fake social proof, counters or "trusted by" logos.
- No carousels for core content; no modals except where a task truly needs one (search, consent, confirmation).
- No auto-playing sound.

## A project design-system doc contains
1. Principles (3–7, project-specific)
2. Brand: name, logo rules, voice of the visuals
3. Token tables (light and dark)
4. Typography: faces, weights, scale, fallbacks
5. Space, grid, radii, elevation
6. Components with props and states
7. Page templates (mobile first)
8. Iconography and imagery rules
9. Motion rules
10. Accessibility checklist and don'ts
