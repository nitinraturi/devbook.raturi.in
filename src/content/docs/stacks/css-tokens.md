---
title: CSS and design tokens
description: Plain CSS with custom-property tokens - token file structure, dark mode that respects the OS and a manual toggle, layout rules, container queries and scoping.
sidebar:
  order: 4
---

## Rules

### Tokens
- One `tokens.css` defines colour, type scale, space, radius, z-index and durations on `:root`.
- Components use tokens only; raw hex values outside `tokens.css` fail review.

### Dark mode (OS default + manual toggle)
```css
:root { --bg: #f4f5f6; --ink: #15191e; /* … light values */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #0e1114; --ink: #e6e9ec; /* … dark values */ }
}
:root[data-theme="dark"] { --bg: #0e1114; --ink: #e6e9ec; /* … same dark values */ }

body { background: var(--bg); color: var(--ink); }
```
- The toggle sets `data-theme` on `<html>` and stores the choice in `localStorage` inside `try/catch`.
- An inline script in `<head>` applies the stored theme before first paint to avoid a flash. Hash it in the CSP.

### Layout
- Flexbox and grid with `gap`; avoid margins between siblings.
- No fixed heights on containers holding text.
- `min-width: 0` on flex/grid children that contain text, code or tables.
- Container queries for components used at different widths.
- Page gutters respect safe areas: `padding-inline: max(16px, env(safe-area-inset-left))`.
- Running text limited to about 65–75 characters per line.

### Typography
- Fluid sizes with `clamp()`; body text at least 16 px.
- `text-wrap: balance` on headings; `font-variant-numeric: tabular-nums` in tables.

### Scope and specificity
- Component styles scoped (Astro `<style>`, CSS modules or equivalent). Global CSS limited to reset, tokens, base typography and prose.
- No `!important` except a `[hidden]` utility.
- No utility framework unless the project's design-system doc chooses one.

### Motion
- Wrap non-essential animation in `@media (prefers-reduced-motion: no-preference)`.

## Checklist
- [ ] All values from tokens
- [ ] Dark mode pattern above, no flash
- [ ] Contrast checked in both themes
- [ ] No fixed text heights; `min-width: 0` where needed
